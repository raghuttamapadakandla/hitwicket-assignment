from flask import Flask, render_template, request, jsonify
from game_logic import Game, Character
import asyncio
from websockets.asyncio.server import serve

app = Flask(__name__)

@app.route("/", methods = ['GET'])
def render_board():
    return render_template("game.html")

app.run(host="0.0.0.0", port=81)