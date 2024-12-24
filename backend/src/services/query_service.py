from kafka import KafkaConsumer, KafkaProducer
import json 
import boto3
import os
from datetime import datetime
from typing import List, Dict, Any
from src.services.openai_service import summarize_articles
import asyncio

KAFKA_SERVER = os.getenv("KAFKA_SERVER")

dynamodb = boto3.resource('dynamodb',
    endpoint_url=os.getenv("LOCALSTACK"),
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    aws_session_token=None,
    verify=False
)
table = dynamodb.Table('TechPulse')

def sort_by_date(items: List[Dict[str, Any]], limit: int = 3) -> List[Dict[str, Any]]:
    dated_items = []
    undated_items = []
    
    for item in items:
        date_str = item.get('date')
        if date_str:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d')
                item['parsed_date'] = date
                dated_items.append(item)
            except ValueError:
                undated_items.append(item)
        else:
            undated_items.append(item)
    
    dated_items = sorted(dated_items, key=lambda x: x['parsed_date'], reverse=True)
    if len(dated_items) >= limit:
        return dated_items[:limit]

    remaining = limit - len(dated_items)
    return dated_items + undated_items[:remaining]

def query_dynamodb(topics=None, companies=None):
    results = []
    
    try:
        if companies and topics:
            for company in companies:
                for topic in topics:
                    response = table.query(
                        IndexName='CompanyDateIndex',
                        KeyConditionExpression='company = :company',
                        FilterExpression='contains(categories, :topic)',
                        ExpressionAttributeValues={
                            ':company': company,
                            ':topic': topic
                        }
                    )
                    items = response.get('Items', [])
                    results.extend(items)

        elif companies:
            for company in companies:
                response = table.query(
                    IndexName='CompanyDateIndex',
                    KeyConditionExpression='company = :company',
                    ExpressionAttributeValues={
                        ':company': company
                    }
                )
                items = response.get('Items', [])
                results.extend(items)

        elif topics:
            for topic in topics:
                response = table.query(
                    IndexName='CategoryDateIndex',
                    KeyConditionExpression='categories = :topic',
                    ExpressionAttributeValues={
                        ':topic': topic
                    }
                )
                items = response.get('Items', [])
                results.extend(items)
        
        unique_results = {item['url']: item for item in results}.values()
        sorted_results = sort_by_date(list(unique_results))
        
        return sorted_results if sorted_results else []

    except Exception as e:
        print(f"Error querying DynamoDB: {e}")
        return []

async def process_messages():
    
    max_retries = 5
    retry_delay = 5

    for retry in range(max_retries):
        try:
            consumer = KafkaConsumer(
                'news_requests', 
                bootstrap_servers=KAFKA_SERVER, 
                value_deserializer=lambda v: json.loads(v.decode('utf-8')),
                group_id='query_service_group'
            )
            
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_SERVER, 
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            break
        except Exception as e:
            if retry < max_retries - 1:
                print(f"Failed to connect to Kafka, attempt {retry + 1}/{max_retries}. Retrying in {retry_delay} seconds...")
                await asyncio.sleep(retry_delay)
            else:
                print(f"Failed to connect to Kafka after {max_retries} attempts: {e}")
                return

    try:
        while True:
            for message in consumer:
                try:
                    data = message.value
                    topics = data.get('topics', [])
                    companies = data.get('companies', [])
                    
                    results = query_dynamodb(
                        topics=topics if topics else None,
                        companies=companies if companies else None
                    )
                    
                    if not results:
                        no_results_message = {
                            'type': 'article_summary',
                            'status': "complete",
                            'summary': f"No articles found matching your criteria:\n\n**Topics**: {', '.join(topics) if topics else 'None'}\n**Companies**: {', '.join(companies) if companies else 'None'}\n\nPlease try different selections."
                        }
                        producer.send('article_summaries', no_results_message)
                        producer.flush()
                        continue
                        
                    summary = await summarize_articles(results)

                    producer.send('article_summaries', {
                        'type': 'article_summary',
                        'status': "complete",
                        'summary': summary,
                    })
                    producer.flush()
                except Exception as e:
                    print(f"Error processing message: {e}")
                    continue
            
            await asyncio.sleep(1)
            
    except Exception as e:
        print(f"Error in process_messages: {e}")

if __name__ == "__main__":
    asyncio.run(process_messages())