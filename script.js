const gameBoardContainer = document.querySelector("#game-board");
const updateText = document.querySelector("#update-text");
const restartBtn = document.querySelector("#restart");

const gameController = (() => {
  let isXTurn = true;

  const getCurrentTurn = () => {
    return isXTurn ? "X" : "O";
  };

  const swapTurn = () => {
    isXTurn = !isXTurn;
    updateTurnText();
  };

  const startGame = () => {
    updateTurnText();
    gameBoard.render();
  };

  const endGame = (winner) => {
    if (winner == "Tie") updateText.textContent = `Tie!`;
    else updateText.textContent = `${winner} wins!`;
  };

  const reset = () => {
    gameBoard.reset();
    isXTurn = true;
    updateTurnText();
  };

  const updateTurnText = () => {
    updateText.textContent = `${getCurrentTurn()}'s turn.`;
  };

  return { startGame, getCurrentTurn, swapTurn, endGame, reset };
})();

const gameBoard = (() => {
  let internalBoard = new Array(9).fill("");

  const addElement = (index) => {
    if (index >= internalBoard.length || internalBoard[index] != "") return;

    internalBoard[index] = gameController.getCurrentTurn();
    gameController.swapTurn();
    update();
    checkWin();
  };

  const update = () => {
    const blockElements = Array.from(gameBoardContainer.children);
    blockElements.forEach((element, index) => {
      element.textContent = internalBoard[index];
    });
  };

  const reset = () => {
    const blockElements = Array.from(gameBoardContainer.children);
    blockElements.forEach((element) => {
      element.textContent = "";
    });

    internalBoard = new Array(9).fill("");
  };

  const render = () => {
    internalBoard.forEach((element, index) => {
      const blockElement = document.createElement("div");
      blockElement.textContent = element;
      blockElement.addEventListener("click", (e) => {
        addElement(index);
      });
      blockElement.classList.add("block-element");
      gameBoardContainer.appendChild(blockElement);
    });
  };

  const checkWin = () => {
    // Horizontal check
    for (let i = 0; i < 9; i += 3) {
      const first = internalBoard[i];
      const second = internalBoard[i + 1];
      const third = internalBoard[i + 2];

      compareColumn(first, second, third);
    }

    // Vertical check
    for (let i = 0; i < 3; i++) {
      const first = internalBoard[i];
      const second = internalBoard[i + 3];
      const third = internalBoard[i + 6];

      compareColumn(first, second, third);
    }

    // Diagonal check
    compareColumn(internalBoard[2], internalBoard[4], internalBoard[6]);
    compareColumn(internalBoard[0], internalBoard[4], internalBoard[8]);

    // Tie
    const full = internalBoard.every((element) => element != "");
    if (full) gameController.endGame("Tie");
  };

  const compareColumn = (first, second, third) => {
    if (first == "" || second == "" || third == "") return;

    if (first === second && second === third) {
      if (first === "X") {
        gameController.endGame("X");
      } else {
        gameController.endGame("O");
      }
    }
  };

  return { render, reset };
})();

gameController.startGame();

restartBtn.addEventListener("click", gameController.reset);
