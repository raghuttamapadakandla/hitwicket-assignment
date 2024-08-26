const cells = document.querySelectorAll('.cell');
const piecesA = document.querySelectorAll('#drag-drop-area .piece');
const piecesB = document.querySelectorAll('#drag-drop-area-b .piece');
const submitLineupButton = document.getElementById('submit-lineup-button');
const submitLineupButtonB = document.getElementById('submit-lineup-button-b');
const currentTurnElement = document.getElementById('current-turn');
const moveInputArea = document.getElementById('move-input-area');
const moveInput = document.getElementById('move-input');
const submitMoveButton = document.getElementById('submit-move-button');
const moveList = document.getElementById('move-list');
const gameOverMessage = document.getElementById('game-over-message');
const gameOverElement = document.getElementById('game-over');
const moveButtons = document.querySelectorAll('.move');
let currentPlayer = "A";
const canMakeMove = false

let piecesInLineup = [];
let gameStarted = false;

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function handleDrop(event) {
    event.preventDefault();
    const pieceId = event.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);

    const previousCellId = piece.parentElement.id;
    const valid = validDrop(event.target.id);
    if (valid) {
        const swapRequired = swapCheck(previousCellId, event.target.id);
        if (swapRequired === "invalid") {
            alert("Cannot swap to dock.");
        } else if (swapRequired === "true") {
            swap(pieceId, previousCellId, event.target.id)
        } else {
            event.target.appendChild(piece);
            piecesInLineup.push(pieceId);
        }
    } else {
        alert("Invalid position.")
    }
}

function handleDragOver(event) {
    event.preventDefault();
}

function addDragDropListeners(pieces, cells) {
    pieces.forEach(piece => piece.addEventListener('dragstart', handleDragStart));
    cells.forEach(cell => {
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('drop', handleDrop);
    });
}

function validDrop(cell) {
    if (cell.split('-')[0] !== 'cell') {
        cell = document.getElementById(cell).parentElement.id;
    }

    if (currentPlayer === "A") {
        if (cell.split("-")[1] === '4') {
            return true
        } else {
            return false
        }
    } else {
        if (cell.split("-")[1] === '0') {
            return true
        } else {
            return false
        }
    }
}

function swapCheck(previousCell, newCell) {
    if (newCell.split('-')[0] !== 'cell') {
        newCell = document.getElementById(newCell).parentElement.id;
    }

    const newCellElement = document.getElementById(newCell);

    if (newCellElement.childElementCount > 0) {
        if (previousCell.split('-')[0] === "drag") return "invalid"
        return "true"
    } else {
        return "false"
    }
}

function swap(pieceId, prevCellId, newCellId) {
    const prevCellElement = document.getElementById(prevCellId);

    if (newCellId.split('-')[0] !== 'cell') {
        newCellId = document.getElementById(newCellId).parentElement.id;
    }

    const newCellElement = document.getElementById(newCellId);

    const oldPiece = newCellElement.childNodes[0];
    const newPiece = document.getElementById(pieceId);

    newCellElement.appendChild(newPiece);
    prevCellElement.appendChild(oldPiece);
}

addDragDropListeners(piecesA, cells);

submitLineupButton.addEventListener('click', () => {
    if (piecesInLineup.length === 5) {
        currentPlayer = 'B';
        piecesInLineup = [];
        document.getElementById('drag-drop-area').classList.add('hidden');
        document.getElementById('drag-drop-area-b').classList.remove('hidden');
        currentTurnElement.textContent = "Player B's Turn";
        addDragDropListeners(piecesB, cells);
        piecesA.forEach((p) => p.setAttribute("draggable", "false"));
    } else {
        alert('Please select 5 pieces for your lineup');
    }
});

submitLineupButtonB.addEventListener('click', () => {
    if (piecesInLineup.length === 5) {
        gameStarted = true;
        currentPlayer = 'A';
        currentTurnElement.textContent = "Game Starts! Player A's Turn";
        document.getElementById('drag-drop-area-b').classList.add('hidden');
        const pieceArrs = ['P1', 'P2', 'P3', 'H1', 'H2'];
        for (_ of pieceArrs) {
            document.getElementById(`A-${_}`).addEventListener('click', (e) => displayMoves(e.target.id))
            document.getElementById(`B-${_}`).addEventListener('click', (e) => displayMoves(e.target.id))
        }
        piecesB.forEach((p) => p.setAttribute("draggable", "false"));
        moveInputArea.classList.remove('hidden');
    } else {
        alert('Please select 5 pieces for your lineup');
    }
});

function calculateNewPosition(pieceType, currentRow, currentCol, direction) {
    let newRow = currentRow;
    let newCol = currentCol;

    if (pieceType.charAt(0) === 'P') {
        const distance = 1;

        switch (direction) {
            case 'L':
                newCol -= distance;
                break;
            case 'R':
                newCol += distance;
                break;
            case 'F':
                newRow = currentPlayer === 'A' ? newRow - distance : newRow + distance;
                break;
            case 'B':
                newRow = currentPlayer === 'A' ? newRow + distance : newRow - distance;
                break;
        }

    } else if (pieceType === 'H1') {
        const distance = 2;  // Fix: H1 should move 2 spaces forward

        switch (direction) {
            case 'L':
                newCol -= distance;
                break;
            case 'R':
                newCol += distance;
                break;
            case 'F':
                newRow = currentPlayer === 'A' ? newRow - distance : newRow + distance;
                break;
            case 'B':
                newRow = currentPlayer === 'A' ? newRow + distance : newRow - distance;
                break;
        }

    } else if (pieceType === 'H2') {
        const diagonalDistance = 2;

        switch (direction) {
            case 'FR':
                newRow = currentPlayer === 'A' ? newRow - diagonalDistance : newRow + diagonalDistance;
                newCol += diagonalDistance;
                break;
            case 'FL':
                newRow = currentPlayer === 'A' ? newRow - diagonalDistance : newRow + diagonalDistance;
                newCol -= diagonalDistance;
                break;
            case 'BR':
                newRow = currentPlayer === 'A' ? newRow + diagonalDistance : newRow - diagonalDistance;
                newCol += diagonalDistance;
                break;
            case 'BL':
                newRow = currentPlayer === 'A' ? newRow + diagonalDistance : newRow - diagonalDistance;
                newCol += diagonalDistance;
                break;
        }
    }

    return [newRow, newCol];
}

moveButtons.forEach((b) => b.addEventListener("click", (e) => {
    const selectedPiece = document.querySelector(".highlight").id.split('-')[1];
    const requiredMove = e.target.innerText;

    makeMove(selectedPiece, requiredMove);
}))

function makeMove(piece, move) {
    const pieceElement = document.getElementById(`${currentPlayer}-${piece}`);
    const currentCell = pieceElement.parentElement;
    const [currentRow, currentCol] = currentCell.id.split('-').slice(1).map(Number);

    const [newRow, newCol] = calculateNewPosition(piece, currentRow, currentCol, move);

    if (newRow < 0 || newRow > 4 || newCol < 0 || newCol > 4) {
        alert('Invalid move. Out of bounds.');
        return;
    }

    const targetCell = document.getElementById(`cell-${newRow}-${newCol}`);
    if (targetCell.innerHTML !== '') {
        const targetPiece = targetCell.firstElementChild;

        if (targetPiece.id.startsWith(currentPlayer)) {
            alert('Invalid move. Cannot attack your own piece.');
            return;
        } else {
            targetCell.removeChild(targetPiece);
        }
    }

    targetCell.appendChild(pieceElement);
    currentPlayer = currentPlayer === "A" ? "B" : "A";
    moveList.innerHTML += `<li>${currentPlayer}-${piece} moved ${move}</li>`;

    document.querySelector(".highlight").classList.remove("highlight");

    const gameState = checkWinCondition()

    if (gameState.winCondition) {
        endGame(gameState.winner);
    } else {
        currentTurnElement.textContent = `${currentPlayer === 'A' ? 'Player A' : 'Player B'}'s Turn`;
    }
}

function checkWinCondition() {
    const remainingPiecesA = Array.from(document.querySelectorAll('.piece')).filter(piece => piece.id.startsWith('A'));
    const remainingPiecesB = Array.from(document.querySelectorAll('.piece')).filter(piece => piece.id.startsWith('B'));

    if (remainingPiecesA.length == 0) return { winCondition: true, winner: "B" }
    else if (remainingPiecesB.length === 0) return { winCondition: true, winner: "A" }
    else return { winCondition: false }
}

function endGame(winningPlayer) {
    moveInputArea.classList.add('hidden');
    gameOverElement.style.display = 'block';
    gameOverMessage.textContent = `${winningPlayer === 'A' ? 'Player A' : 'Player B'} Wins!`;
}

submitMoveButton.addEventListener('click', makeMove);

document.getElementById('new-game-button').addEventListener('click', () => {
    location.reload();
});

function displayMoves(pId) {
    // if (!canMakeMove) {
    //     alert("Not your turn please wait.")
    // }
    if (currentPlayer.toLocaleLowerCase() === pId.split('-')[0].toLocaleLowerCase()) {
        document.querySelectorAll('div.piece').forEach((p) => p.classList.remove('highlight'));
        document.getElementById(pId).classList.add('highlight');
    } else {
        alert("Not your piece.")
        return
    }
    pId = pId.split('-')[1]
    if (pId.charAt(0) === 'P') {
        document.getElementById('P-piece-moves').classList.remove('hidden');
        document.getElementById('H1-piece-moves').classList.add('hidden');
        document.getElementById('H2-piece-moves').classList.add('hidden');
    }

    if (pId === 'H1') {
        document.getElementById('P-piece-moves').classList.add('hidden');
        document.getElementById('H1-piece-moves').classList.remove('hidden');
        document.getElementById('H2-piece-moves').classList.add('hidden');
    }

    if (pId === 'H2') {
        document.getElementById('P-piece-moves').classList.add('hidden');
        document.getElementById('H1-piece-moves').classList.add('hidden');
        document.getElementById('H2-piece-moves').classList.remove('hidden');
    }
}

function defaultLineup() {
    const lineupA = {
        "A-P1": "cell-4-0",
        "A-P2": "cell-4-1",
        "A-P3": "cell-4-2",
        "A-H1": "cell-4-3",
        "A-H2": "cell-4-4",
    }

    for (pId in lineupA) {
        document.getElementById(lineupA[pId]).appendChild(document.getElementById(pId));
        piecesInLineup.push(pId);
    }

    submitLineupButton.click();

    const lineupB = {
        "B-P1": "cell-0-0",
        "B-P2": "cell-0-1",
        "B-P3": "cell-0-2",
        "B-H1": "cell-0-3",
        "B-H2": "cell-0-4",
    }

    for (pId in lineupB) {
        document.getElementById(lineupB[pId]).appendChild(document.getElementById(pId));
        piecesInLineup.push(pId);
    }

    submitLineupButtonB.click();
    document.getElementById("default-setup").classList.add("hidden");
}

document.getElementById("default-setup").addEventListener("click", defaultLineup);