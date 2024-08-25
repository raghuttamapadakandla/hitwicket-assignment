class Character:
    def __init__(self, player, name, character_type, position):
        self.player = player
        self.name = name
        self.character_type = character_type
        self.position = position

    def move(self, direction, board, captured):
        if self in captured[self.player]:
            raise ValueError("Invalid move: piece already captured.")

        x, y = self.position
        if self.character_type == 'Pawn':
            new_position = self._pawn_move(direction, x, y)
        elif self.character_type == 'Hero1':
            new_position = self._hero1_move(direction, x, y)
        elif self.character_type == 'Hero2':
            new_position = self._hero2_move(direction, x, y)
        else:
            raise ValueError("Invalid character type")

        if self._is_valid_move(new_position, board):
            self._capture_opponent(new_position, board, captured)
            board[x][y] = None  # Leave the old position empty
            self.position = new_position
            board[new_position[0]][new_position[1]] = self  # Update to the new position
        else:
            raise ValueError("Invalid move")

    def _pawn_move(self, direction, x, y):
        if self.player == 'A':
            moves = {'L': (x, y - 1), 'R': (x, y + 1), 'F': (x - 1, y), 'B': (x + 1, y)}
        else:  # For Player B, directions are mirrored
            moves = {'L': (x, y + 1), 'R': (x, y - 1), 'F': (x + 1, y), 'B': (x - 1, y)}
        return moves.get(direction, (x, y))

    def _hero1_move(self, direction, x, y):
        if self.player == 'A':
            moves = {'L': (x, y - 2), 'R': (x, y + 2), 'F': (x - 2, y), 'B': (x + 2, y)}
        else:  # For Player B, directions are mirrored
            moves = {'L': (x, y + 2), 'R': (x, y - 2), 'F': (x + 2, y), 'B': (x - 2, y)}
        return moves.get(direction, (x, y))

    def _hero2_move(self, direction, x, y):
        if self.player == 'A':
            moves = {'FL': (x - 2, y - 2), 'FR': (x - 2, y + 2), 'BL': (x + 2, y - 2), 'BR': (x + 2, y + 2)}
        else:  # For Player B, diagonal moves are mirrored and reversed
            moves = {'FL': (x + 2, y + 2), 'FR': (x + 2, y - 2), 'BL': (x - 2, y + 2), 'BR': (x - 2, y - 2)}
        return moves.get(direction, (x, y))

    def _is_valid_move(self, new_position, board):
        x, y = new_position
        if 0 <= x < 5 and 0 <= y < 5:
            target = board[x][y]
            if target is None or target.player != self.player:
                return True
        return False

    def _capture_opponent(self, new_position, board, captured):
        x, y = new_position
        target = board[x][y]
        if target is not None and target.player != self.player:
            board[x][y] = None  # Remove the opponent's character from the board
            captured[target.player].append(target)  # Add captured character to the list


class Game:
    def __init__(self):
        self.board = [[None for _ in range(5)] for _ in range(5)]
        self.players = {'A': [], 'B': []}
        self.captured = {'A': [], 'B': []}
        self.current_player = 'A'
        self.winner = None

    def setup(self, player):
        print(f"Player {player}, set up your characters.")
        pawn_count = 1  # Start count for Pawn numbering
        h1_used = h2_used = False  # Track if Hero1 or Hero2 is used
        character_positions = []
        for i in range(5):
            while True:
                character = input(f"Enter character type for position {i + 1} (P, H1, H2): ")
                if character == 'P':
                    name = f"P{pawn_count}"
                    pawn_count += 1
                    break
                elif character == 'H1' and not h1_used:
                    name = "H1"
                    h1_used = True
                    break
                elif character == 'H2' and not h2_used:
                    name = "H2"
                    h2_used = True
                    break
                else:
                    print(f"Invalid choice or {character} already used. Please choose again.")
            
            character_type = 'Pawn' if character == 'P' else 'Hero1' if character == 'H1' else 'Hero2'
            position = (4, i) if player == 'A' else (0, i)
            new_character = Character(player, name, character_type, position)
            character_positions.append(new_character)
            x, y = position
            self.board[x][y] = new_character

        self.players[player] = character_positions
        self.display_board()

    def play(self):
        while not self.winner:
            self.display_board()
            self.make_move()
            self.check_winner()
            self.current_player = 'B' if self.current_player == 'A' else 'A'

    def make_move(self):
        while True:
            try:
                move = input(f"Player {self.current_player}, enter your move (e.g., P1:F): ")
                character_name, direction = move.split(':')
                character = self.get_character_by_name(character_name)
                character.move(direction, self.board, self.captured)
                break
            except ValueError as e:
                print(e)
                print("Invalid move. Try again.")

    def get_character_by_name(self, name):
        for character in self.players[self.current_player]:
            if character.name == name:
                return character
        raise ValueError("Character not found")

    def check_winner(self):
        for player, pieces in self.players.items():
            if len(pieces) == len(self.captured[player]):
                self.winner = 'B' if player == 'A' else 'A'
                print(f"Player {self.winner} wins: all pieces of Player {player} captured!")
                return True  # End the game if a winner is found

    def display_board(self):
        print("\n  0 1 2 3 4")
        for i, row in enumerate(self.board):
            print(i, end=' ')
            for cell in row:
                if cell is None:
                    print(".", end=" ")
                else:
                    print(f"{cell.player}-{cell.name}", end=" ")
            print()

    def start_new_game(self):
        self.__init__()


# Example game setup and flow
game = Game()
game.setup('A')
game.setup('B')
game.play()
