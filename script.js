const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const getBoard = () => [...board];

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setMark = (index, mark) => {
        if (index >= 0 && index < 9 && board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const checkWin = () => {
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // "X" or "O"
            }
        }
        return null;
    };

    const isFull = () => board.every(cell => cell !== "");

    return { getBoard, resetBoard, setMark, checkWin, isFull };
})();

const gameController = (() => {
    let currentPlayer = "X";
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        userInterface.updateMessage(`Player ${currentPlayer}'s turn`);
    };

    const getCurrentPlayer = () => currentPlayer;

    const playGame = (index) => {
        if (gameOver) return;

        if (Gameboard.setMark(index, currentPlayer)) {
            userInterface.updateBoard(); // update board

            if (Gameboard.checkWin() === currentPlayer) {
                userInterface.updateMessage(`Player ${currentPlayer} wins!`);
                gameOver = true;
            } else if (Gameboard.isFull()) {
                userInterface.updateMessage(`It's a draw!`);
                gameOver = true;
            } else {
                switchPlayer();
            }
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = "X";
        gameOver = false;
        userInterface.updateBoard();
        userInterface.updateMessage(`Player ${currentPlayer}'s turn`);
    };

    return { getCurrentPlayer, playGame, resetGame };
})();

const userInterface = (() => {
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const updateMessage = (msg) => {
        message.textContent = msg;
    };

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            gameController.playGame(index);
        });
    });

    return { updateBoard, updateMessage };
})();