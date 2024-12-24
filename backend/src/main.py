from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .routes.auth_routes import router as auth_router
from .sockets import ConnectionManager, handle_websocket_connection
import os

FRONTEND_URL = os.getenv('FRONTEND_URL')
SESSION_SECRET = os.getenv('SESSION_SECRET')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    same_site="lax",
    https_only=False
)

manager = ConnectionManager()

app.include_router(auth_router)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await handle_websocket_connection(websocket, client_id, manager)
        