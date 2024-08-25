from flask import Flask, render_template, request, jsonify
from game_logic import Game, Character

app = Flask(__name__)
game = Game()

@app.route('/', methods=['GET'])
def render_game():
    return render_template('game.html')

@app.route('/setup', methods=['POST'])
def setup_game():
    data = request.json
    player = data['player']
    positions = data['positions']
    for pos in positions:
        name = pos['name']
        character_type = pos['type']
        position = tuple(pos['position'])
        new_character = Character(player, name, character_type, position)
        game.board[position[0]][position[1]] = new_character
        game.players[player].append(new_character)
    return jsonify(success=True)

@app.route('/move', methods=['POST'])
def move():
    data = request.json
    character_name = data['character']
    direction = data['direction']
    try:
        character = game.get_character_by_name(character_name)
        character.move(direction, game.board, game.captured)
        game.check_winner()
        return jsonify(success=True, board=game.board, winner=game.winner)
    except ValueError as e:
        return jsonify(success=False, error=str(e))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=81)
