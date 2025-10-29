const gameButtons = document.querySelectorAll(".game-btn");
const announcement = document.getElementById("announcement");
const cells = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
let redPositions = ["A1", "A2", "A3"];
let bluePositions = ["C1", "C2", "C3"];
let selectedCellId = "";
let moveHistory = [];

const WINNING_PATTERNS = [
  ["B1", "B2", "B3"],
  ["A1", "B1", "C1"],
  ["A2", "B2", "C2"],
  ["A3", "B3", "C3"],
  ["A1", "B2", "C3"],
  ["A3", "B2", "C1"],
];

const MOVE_RULES = {
  A1: ["A2", "B1", "B2"],
  A2: ["A1", "A3", "B2"],
  A3: ["A2", "B3", "B2"],
  B1: ["A1", "C1", "B2"],
  B2: ["A1", "A2", "A3", "B1", "B3", "C1", "C2", "C3"],
  B3: ["A3", "C3", "B2"],
  C1: ["C2", "B1", "B2"],
  C2: ["C1", "C3", "B2"],
  C3: ["C2", "B3", "B2"],
};

let currentPlayer = "red";
announcement.innerText = `${capitalize(currentPlayer)} plays first`;
announcement.style.color = "red";

function toggleActiveCell(id) {
  const button = document.getElementById(id);

  if (selectedCellId === id) {
    button.classList.remove("game-btn-active");
    selectedCellId = "";
  } else {
    selectedCellId = id;
    gameButtons.forEach((btn) => btn.classList.remove("game-btn-active"));
    button.classList.add("game-btn-active");
  }
}

function isAdjacentMove(targetId, fromId) {
  return MOVE_RULES[fromId]?.includes(targetId);
}

function handleCellClick(id) {
  const playerPositions =
    currentPlayer === "red" ? redPositions : bluePositions;

  if (checkWinner()) return;

  if (playerPositions.includes(id)) {
    toggleActiveCell(id);
    return;
  }

  if (!selectedCellId) {
    alert("Select one of your pieces first!");
    return;
  }

  if (!isAdjacentMove(id, selectedCellId)) {
    alert("Invalid move — select an adjacent cell!");
    return;
  }

  movePiece(selectedCellId, id);
}

function movePiece(fromId, toId) {
  const fromCell = document.getElementById(fromId);
  const toCell = document.getElementById(toId);

  const playerPositions =
    currentPlayer === "red" ? redPositions : bluePositions;

  const updatedPositions = playerPositions.filter((pos) => pos !== fromId);
  updatedPositions.push(toId);

  if (currentPlayer === "red") {
    redPositions = updatedPositions;
  } else {
    bluePositions = updatedPositions;
  }

  toCell.innerHTML = fromCell.innerHTML;
  fromCell.innerHTML = "";

  moveHistory.push({ player: currentPlayer, from: fromId, to: toId });

  if (checkWinner()) return;

  switchTurn();
}

function switchTurn() {
  currentPlayer = currentPlayer === "red" ? "blue" : "red";
  announcement.innerText = `${capitalize(currentPlayer)} plays next`;
  announcement.style.color = currentPlayer;
  selectedCellId = "";
}

function checkWinner() {
  for (const pattern of WINNING_PATTERNS) {
    if (pattern.every((cell) => redPositions.includes(cell))) {
      announcement.innerText = "Red wins!";
      announcement.style.color = "green";
      return "red";
    }
    if (pattern.every((cell) => bluePositions.includes(cell))) {
      announcement.innerText = "Blue wins!";
      announcement.style.color = "green";
      return "blue";
    }
  }
  return null;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

gameButtons.forEach((btn) => {
  btn.addEventListener("click", () => handleCellClick(btn.id));
});

const resetButton = document.getElementById("reset-el");

resetButton.addEventListener("click", function () {
  redPositions = ["A1", "A2", "A3"];
  bluePositions = ["C1", "C2", "C3"];
  selectedCellId = "";
  moveHistory = [];
  currentPlayer = "red";

  cells.forEach((cellId) => {
    const cell = document.getElementById(cellId);
    cell.innerHTML = "";
    cell.classList.remove("game-btn-active");
  });

  redPositions.forEach((cellId) => {
    const cell = document.getElementById(cellId);
    cell.innerHTML = "<div class='red-seed seed'>🔴</div>";
  });

  bluePositions.forEach((cellId) => {
    const cell = document.getElementById(cellId);
    cell.innerHTML = "<div class='blue-seed seed'>🔵</div>";
  });

  const announcement = document.getElementById("announcement");
  announcement.innerText = "Red starts first";
  announcement.style.color = "red";
});
