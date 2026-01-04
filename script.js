// GLOBAL VARIABLES
let bestScore = localStorage.getItem("bestScore");
let moves = 0;
let errors = 0;

const cards = [
  "captainA", "batman", "wolverine", "spiderman", "ironman",
  "robin", "greenL", "flash", "wonderwoman", "superman"
];

const rows = 4, cols = 5;
let board = [];
let cardSet = [];
let first = null, second = null;
let canClick = false; // ⬅ cannot click until Play is pressed

// TIMER
let seconds = 0;
let timerInterval = null;

//TIME
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ON PAGE LOAD
window.onload = () => {
  document.getElementById("restart").onclick = restart;
  document.getElementById("play").onclick = startGame;

  document.getElementById("best").innerText = bestScore ?? "—";
};

// START GAME (Play button)
function startGame() {
  // Enable clicking after Play
  canClick = false;

  // Reset board area
  document.getElementById("board").innerHTML = "";
  board = [];

  moves = 0;
  errors = 0;
  document.getElementById("moves").innerText = 0;
  document.getElementById("errors").innerText = 0;

  shuffle();
  setupBoard();
}

// RESET GAME (Restart)
function restart() {
  clearInterval(timerInterval);

  seconds = 0;
  document.getElementById("timer").innerText = "00:00";

  startGame();
}
// SHUFFLE CARDS
function shuffle() {
  cardSet = [...cards, ...cards];

  for (let i = cardSet.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
}

// CREATE BOARD
function setupBoard() {
  for (let r = 0; r < rows; r++) {
    board[r] = [];

    for (let c = 0; c < cols; c++) {
      const cardName = cardSet.pop();
      board[r][c] = cardName;

      const img = document.createElement("img");
      img.id = `${r}-${c}`;
      img.src = `${cardName}.png`; // revealed briefly
      img.dataset.card = cardName;
      img.classList.add("card");
      img.onclick = handleClick;

      document.getElementById("board").append(img);
    }
  }

  // Reveal then hide
  setTimeout(hideAll, 1200);

  // START TIMER
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById("timer").innerText = "00:00";

  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").innerText = formatTime(seconds);
  }, 1000);
}
// HIDE ALL CARDS
function hideAll() {
  document.querySelectorAll("#board img").forEach(card => {
    card.src = "MarvelsBG.jpg";
    card.classList.remove("flipped", "matched");
  });

  canClick = true; // ⬅ Now players can click
}
// CARD CLICK
function handleClick() {
  if (!canClick || this.classList.contains("flipped")) return;

  const [r, c] = this.id.split("-").map(Number);
  this.src = board[r][c] + ".png";
  this.classList.add("flipped");

  if (!first) {
    first = this;
  } else if (this !== first) {
    second = this;
    moves++;
    document.getElementById("moves").innerText = moves;

    canClick = false;
    setTimeout(checkMatch, 700);
  }
}

// CHECK MATCH
function checkMatch() {
  if (first.dataset.card === second.dataset.card) {
    first.classList.add("matched");
    second.classList.add("matched");
  } else {
    first.src = "MarvelsBG.jpg";
    second.src = "MarvelsBG.jpg";

    first.classList.remove("flipped");
    second.classList.remove("flipped");

    errors++;
    document.getElementById("errors").innerText = errors;
  }

  first = second = null;
  canClick = true;

  checkWin();
}
// CHECK WIN
function checkWin() {
  const matched = document.querySelectorAll(".matched").length;

  if (matched === rows * cols) {
    clearInterval(timerInterval);

    if (!bestScore || moves < bestScore) {
      bestScore = moves;
      localStorage.setItem("bestScore", bestScore);
      document.getElementById("best").innerText = bestScore;
    }

    setTimeout(() => {
      alert(`You win!\nMoves: ${moves}\nErrors: ${errors}\nTime: ${formatTime(seconds)}`);
    }, 300);
  }
}
