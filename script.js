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

    const getBoard = () => [...board]; // return a copy of the board

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setMark = (index, mark) => { // "X" or "O"
        if (index >= 0 && index < 9 && board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const checkWin = () => {
        for (let condition of winConditions) { // destructuring
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // "X" or "O"
            }
        }
        return null;
    };

    const isFull = () => board.every(cell => cell !== ""); // check for draw

    return { getBoard, resetBoard, setMark, checkWin, isFull };
})();

const gameController = (() => {
    let currentPlayer = "X";
    let gameOver = false;

    const switchPlayer = () => { // toggle between "X" and "O"
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

    const resetGame = () => { // reset everything
        Gameboard.resetBoard();
        currentPlayer = "X";
        gameOver = false;
        userInterface.updateBoard();
        userInterface.updateMessage(`Player ${currentPlayer}'s turn`);
    };

    return { getCurrentPlayer, playGame, resetGame };
})();

const userInterface = (() => { // DOM manipulation
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");

    const updateBoard = () => { // render the board
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const updateMessage = (msg) => {
        message.textContent = msg;
    };

    cells.forEach((cell, index) => { // add click event to each cell
        cell.addEventListener("click", () => {
            gameController.playGame(index);
        });
    });

    return { updateBoard, updateMessage };
})();