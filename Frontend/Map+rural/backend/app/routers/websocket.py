"""
websocket.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — Real-time WebSocket endpoint

Matches the frontend's integration/socket.ts client, which connects to
`${VITE_WS_BASE_URL}/caregiver` (default: ws://localhost:8000/ws/caregiver).
------------------------------------------------------------------------------
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.app.websocket_manager import ws_manager

router = APIRouter()


@router.websocket("/caregiver")
async def caregiver_socket(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # The dashboard doesn't need to send anything, but we read frames
            # so disconnects are detected promptly; ping/pong keepalive could
            # be added here for production use.
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
