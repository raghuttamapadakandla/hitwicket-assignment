document.addEventListener('DOMContentLoaded', () => {
    fetchBoardState();
});

function fetchBoardState() {
    fetch('/get_board_state')
        .then(response => response.json())
        .then(boardState => {
            renderBoard(boardState);
        });
}

function renderBoard(boardState) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Clear existing board

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            const piece = boardState[row][col];

            cell.classList.add('cell');
            if (piece === '.') {
                cell.classList.add('empty');
            } else if (piece.startsWith('A-')) {
                cell.classList.add('player-a');
                cell.textContent = piece;
            } else if (piece.startsWith('B-')) {
                cell.classList.add('player-b');
                cell.textContent = piece;
            }
            gameBoard.appendChild(cell);
        }
    }
}
