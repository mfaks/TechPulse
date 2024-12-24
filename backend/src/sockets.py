from fastapi import WebSocket
import json
from kafka import KafkaProducer, KafkaConsumer
import asyncio
import threading
import os
from typing import Dict

KAFKA_SERVER = os.getenv("KAFKA_SERVER")

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}
        self.consumer_threads: Dict[int, threading.Thread] = {}

    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        await self.send_personal_message(
            json.dumps({
                "type": "connection",
                "status": "connected",
                "client_id": client_id
            }),
            client_id
        )

    async def disconnect(self, client_id: int):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            try:
                await self.send_personal_message(
                    json.dumps({
                        "type": "connection",
                        "status": "disconnected",
                        "client_id": client_id
                    }),
                    client_id
                )
            except:
                pass
            
            del self.active_connections[client_id]
            
            if client_id in self.consumer_threads:
                del self.consumer_threads[client_id]

    async def send_personal_message(self, message: str, client_id: int):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        for client_id in self.active_connections:
            await self.send_personal_message(message, client_id)

def kafka_consumer_thread(client_id: int, manager: ConnectionManager):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    consumer = KafkaConsumer(
        'article_summaries',
        bootstrap_servers=KAFKA_SERVER,
        value_deserializer=lambda v: json.loads(v.decode('utf-8')),
        group_id=f'backend_group_{client_id}'
    )
    
    for message in consumer:
        try:
            if client_id not in manager.active_connections:
                break
                
            summary_data = message.value
            if isinstance(summary_data, dict):
                summary_data['type'] = 'article_summary'
            
            loop.run_until_complete(
                manager.send_personal_message(
                    json.dumps(summary_data),
                    client_id
                )
            )
        except Exception as e:
            print(f"Error processing summary for client {client_id}: {e}")
            if client_id in manager.active_connections:
                loop.run_until_complete(manager.disconnect(client_id))
            break
    
    consumer.close()

async def handle_websocket_connection(websocket: WebSocket, client_id: int, manager: ConnectionManager):
    try:
        await manager.connect(websocket, client_id)
        
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_SERVER,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
        consumer_thread = threading.Thread(
            target=kafka_consumer_thread,
            args=(client_id, manager),
            daemon=True
        )
        manager.consumer_threads[client_id] = consumer_thread
        consumer_thread.start()
        
        while True:
            try:
                data = await websocket.receive_text()
                preferences = json.loads(data)
                
                if 'topics' in preferences and 'companies' in preferences:
                    await manager.send_personal_message(
                        json.dumps({
                            "type": "processing_update",
                            "status": "processing",
                            "message": "Generating your personalized news feed... Please wait."
                        }), 
                        client_id
                    )
                    
                    producer.send('news_requests', preferences)
                    producer.flush()
                    
            except json.JSONDecodeError as e:
                print(f"Invalid JSON from client {client_id}: {e}")
                await manager.send_personal_message(
                    json.dumps({
                        "type": "error",
                        "error": "Invalid JSON format"
                    }),
                    client_id
                )
            except Exception as e:
                print(f"Error processing message from client {client_id}: {e}")
                break
                
    except Exception as e:
        print(f"Unexpected error with client {client_id}: {e}")
    finally:
        await manager.disconnect(client_id)
        producer.close()