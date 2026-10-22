const blocks = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let currentPlayer = "X";
let gameOver = false;
let gameMode = "pvp";
let computerThinking = false;

let scoreX = 0;
let scoreO = 0;

const cells = document.querySelectorAll(".cell");
const status = document.querySelector("#status");
const restartButton = document.querySelector("#restart");

const playerXCard = document.querySelector("#player-x");
const playerOCard = document.querySelector("#player-o");

const scoreXElement = document.querySelector("#score-x");
const scoreOElement = document.querySelector("#score-o");

const pvpButton = document.querySelector("#pvp-mode");
const pvcButton = document.querySelector("#pvc-mode");


// Choose game mode
pvpButton.addEventListener("click", () => {
    gameMode = "pvp";
    pvpButton.classList.add("active-mode");
    pvcButton.classList.remove("active-mode");
    restartGame();
});

pvcButton.addEventListener("click", () => {
    gameMode = "pvc";
    pvcButton.classList.add("active-mode");
    pvpButton.classList.remove("active-mode");
    restartGame();
});


// Handle cell click
function handleCellClick(event) {
    if (gameOver || computerThinking) return;

    const cell = event.currentTarget;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    if (blocks[row][col] !== "") return;

    makeMove(row, col, currentPlayer);

    if (gameOver) return;

    if (gameMode === "pvc") {
        computerThinking = true;
        status.textContent = "🤖 Computer is thinking...";

        cells.forEach(cell => {
            cell.disabled = true;
        });

        setTimeout(() => {
            computerMove();
            computerThinking = false;

            if (!gameOver) {
                cells.forEach(cell => {
                    const r = Number(cell.dataset.row);
                    const c = Number(cell.dataset.col);
                    cell.disabled = blocks[r][c] !== "";
                });
            }
        }, 500);

        return;
    }

    switchPlayer();
}


// Make a move
function makeMove(row, col, player) {
    blocks[row][col] = player;

    const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );

    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    cell.disabled = true;

    const winningCombination = checkWinner();

    if (winningCombination) {
        endGame(winningCombination);
        return;
    }

    const boardIsFull = blocks.every(row =>
        row.every(block => block !== "")
    );

    if (boardIsFull) {
        endGame();
        return;
    }
}


// Computer move
function computerMove() {
    if (gameOver) return;

    const emptyCells = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (blocks[row][col] === "") {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length === 0) return;

    // Try to win
    let move = findBestMove("O");

    // Otherwise block the player
    if (!move) {
        move = findBestMove("X");
    }

    // Otherwise take the center
    if (!move && blocks[1][1] === "") {
        move = { row: 1, col: 1 };
    }

    // Otherwise choose a random available cell
    if (!move) {
        move = emptyCells[
            Math.floor(Math.random() * emptyCells.length)
        ];
    }

    makeMove(move.row, move.col, "O");

    if (!gameOver) {
        currentPlayer = "X";
        status.textContent = "Your turn (X)";
        playerXCard.classList.add("active-player");
        playerOCard.classList.remove("active-player");
    }
}


// Find a winning or blocking move
function findBestMove(player) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (blocks[row][col] !== "") continue;

            blocks[row][col] = player;

            const winningCombination = checkWinner();

            blocks[row][col] = "";

            if (winningCombination) {
                return { row, col };
            }
        }
    }

    return null;
}


// Check winner
function checkWinner() {
    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],

        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],

        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        const value = blocks[a[0]][a[1]];

        if (
            value !== "" &&
            value === blocks[b[0]][b[1]] &&
            value === blocks[c[0]][c[1]]
        ) {
            return combination;
        }
    }

    return null;
}


// Switch players
function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    status.textContent = `Player ${currentPlayer}'s turn`;

    playerXCard.classList.toggle(
        "active-player",
        currentPlayer === "X"
    );

    playerOCard.classList.toggle(
        "active-player",
        currentPlayer === "O"
    );
}


// End game
function endGame(winningCombination = null) {
    gameOver = true;

    if (winningCombination) {
        const [row, col] = winningCombination[0];
        const winner = blocks[row][col];

        if (gameMode === "pvc") {
            status.textContent =
                winner === "X"
                    ? "🎉 You Win!"
                    : "🤖 Computer Wins!";
        } else {
            status.textContent = `🎉 Player ${winner} Wins!`;
        }

        if (winner === "X") {
            scoreX++;
            scoreXElement.textContent = scoreX;
        } else {
            scoreO++;
            scoreOElement.textContent = scoreO;
        }

        winningCombination.forEach(([row, col]) => {
            const winningCell = document.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );

            winningCell.classList.add("winner");
        });

    } else {
        status.textContent = "🤝 It's a Draw!";
    }

    cells.forEach(cell => {
        cell.disabled = true;
    });

    restartButton.textContent = "Play Again";
}


// Restart round without resetting score
function restartGame() {
    blocks.forEach(row => row.fill(""));

    currentPlayer = "X";
    gameOver = false;
    computerThinking = false;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;

        cell.classList.remove("x", "o", "winner");
    });

    status.textContent =
        gameMode === "pvc"
            ? "Your turn (X)"
            : "Player X's turn";

    playerXCard.classList.add("active-player");
    playerOCard.classList.remove("active-player");

    restartButton.textContent = "Restart Game";
}


// Event listeners
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

restartButton.addEventListener("click", restartGame);