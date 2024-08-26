#!/usr/bin/env python

import asyncio
from email import message
from itertools import count
import json
from re import search

from websockets import ConnectionClosed
from websockets.asyncio.server import serve

CLIENTS = set()

check = True

async def handler(websocket):
    global check
    CLIENTS.add(websocket)
    if (check):
        await websocket.send(json.dumps({ "type": "player_assignment", "message": "A" }))
        check = False
    else:
        await websocket.send(json.dumps({ "type": "player_assignment", "message": "B" }))
        check = True
    try:
        async for msg in websocket:
            print(msg)
            await broadcast(msg)
    finally:
        CLIENTS.remove(websocket)

async def broadcast(message):
    for websocket in CLIENTS.copy():
        try:
            await websocket.send(message)
        except ConnectionClosed:
            pass


async def main():
    async with serve(handler, "", 8001):
        await asyncio.get_running_loop().create_future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())