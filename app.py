from flask import Flask, render_template, request, jsonify
from game_logic import Game, Character

app = Flask(__name__)
game = Game()

def serialize_board(board):
    """Convert the board's current state to a JSON-serializable format."""
    return [[str(cell) if cell else "." for cell in row] for row in board]

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

        # Create a new character and place it on the board
        new_character = Character(player, name, character_type, position)
        game.board[position[0]][position[1]] = new_character
        game.players[player].append(new_character)

    # Check if Player B should now set up their pieces
    if player == 'A':
        next_player = 'B'
        return jsonify(success=True, next_player=next_player)
    else:
        serialized_board = serialize_board(game.board)
        return jsonify(success=True, board=serialized_board, game_ready=True)

@app.route('/move', methods=['POST'])
def move():
    data = request.json
    character_name = data['character']
    direction = data['direction']

    try:
        result = game.process_move(game.current_turn, character_name, direction)
        if result != "valid":
            return jsonify(success=False, error=result)
        
        serialized_board = serialize_board(game.board)
        return jsonify(success=True, board=serialized_board, winner=game.get_winner())
    except ValueError as e:
        return jsonify(success=False, error=str(e))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=81)
