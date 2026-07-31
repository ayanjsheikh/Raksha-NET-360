"""
websocket_manager.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — Real-time broadcast layer

Tracks every connected Caregiver Dashboard WebSocket and broadcasts
{"type": ..., "payload": ...} frames matching the shape expected by the
frontend's integration/socket.ts client.
------------------------------------------------------------------------------
"""

import json
from typing import Any, Dict, List

from fastapi import WebSocket


class WebSocketManager:
    def __init__(self) -> None:
        self._connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self._connections:
            self._connections.remove(websocket)

    async def broadcast(self, event_type: str, payload: Dict[str, Any]) -> None:
        message = json.dumps({"type": event_type, "payload": payload})
        stale: List[WebSocket] = []
        for connection in self._connections:
            try:
                await connection.send_text(message)
            except Exception:
                stale.append(connection)
        for connection in stale:
            self.disconnect(connection)


# Singleton shared across every router.
ws_manager = WebSocketManager()
