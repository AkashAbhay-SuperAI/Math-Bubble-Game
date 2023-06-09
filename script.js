function generateQuestion() {
  var operators = ["+", "-", "*", "/"];
  var operator = operators[Math.floor(Math.random() * operators.length)];
  var num1 = Math.floor(Math.random() * 10) + 1;
  var num2 = Math.floor(Math.random() * 10) + 1;
  if (operator === "/") {
    while (num1 % num2 !== 0) {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    }
  }

  return { answer: eval(num1 + operator + num2), num1, num2, operator };
}
let pause = false;
let health = 3;
let score = 0;
let highScore;

const inpBox = document.getElementById("textbox");

let init = false;

highScore = localStorage.getItem("high-score");

if (!highScore) {
  localStorage.setItem("high-score", 0);
  highScore = 0;
}

window.addEventListener("blur", function () {
  if (health && init) pauseGame();
});

let scoreBox = document.querySelector(".score");

function createBubble() {
  if (pause) return;
  const bubble = document.createElement("div");
  const { answer, num1, num2, operator } = generateQuestion();
  bubble.classList.add("bubble");
  bubble.dataset.answer = answer;
  bubble.style.top = "-100px";

  const text = document.createElement("p");
  text.classList.add("text");
  text.innerHTML = `<div>${num1}</div>${operator} ${num2}`;

  bubble.appendChild(text);
  document.getElementById("game-window").appendChild(bubble);

  animateBubble(bubble);
}
const bars = document.querySelectorAll(".bar");

function animateBubble(bubble) {
  const gameContainer = document.querySelector("#game-window");
  const left = Math.random() * (gameContainer.offsetWidth - bubble.offsetWidth);

  let top = -50;
  const animationInterval = setInterval(() => {
    if (pause) {
      return;
    }

    if (bubble.parentNode == null) {
      clearInterval(animationInterval);
      return;
    }
    top += 5;
    bubble.style.left = left * 0.9 + "px";
    bubble.style.top = top + "px";
    if (top >= gameContainer.offsetHeight - bubble.offsetHeight) {
      clearInterval(animationInterval);
      const el = document.querySelector("#inputBox");
      el.style.height = el.offsetHeight + 16 + "px";

      bars[health - 1].style.borderColor = "goldenrod";

      bubble.remove();
      health--;
      if (health === 0) {
        gameOver();
      }
    }
  }, 50);
}

let intervalId = null;

// Game over event
function gameOver() {
  document.querySelector(
    ".smText"
  ).innerHTML = `<font>High Score: ${highScore}</font><font>Score: ${score}</font>`;
  document.querySelector(".gameOverScreen").classList.remove("goToTop");
  pause = true;
  const bubbles = Array.from(document.getElementsByClassName("bubble"));
  clearInterval(intervalId);
  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    bubble.remove();
  }
  if (score > highScore) {
    localStorage.setItem("high-score", score);
  }
}

function startGame() {
  inpBox.value = "";
  inpBox.focus();
  highScore = localStorage.getItem("high-score");
  init = true;
  health = 3;
  score = 0;
  const el = document.querySelector("#inputBox");
  el.style.height = "4rem";

  bars.forEach((bar) => {
    bar.style.borderColor = "#eee";
  });

  scoreBox.textContent = `SCORE: ${score}`;
  pause = false;
  document.querySelector(".playScreen").classList.add("goToTop");
  document.querySelector(".gameOverScreen").classList.add("goToTop");
  intervalId = setInterval(createBubble, 1500);
}

document
  .getElementById("textbox")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const userAnswer = parseInt(document.getElementById("textbox").value);
      if (!isNaN(userAnswer)) {
        const bubbles = document.getElementsByClassName("bubble");
        for (let i = 0; i < bubbles.length; i++) {
          const bubble = bubbles[i];
          const answer = parseInt(bubble.dataset.answer);
          if (userAnswer === answer) {
            bubble.remove();
            score += 50;
            scoreBox.textContent = `SCORE: ${score}`;
          }
        }
        document.getElementById("textbox").value = "";
      }
    }
  });

function pauseGame() {
  document.querySelector(".pauseScreen").classList.remove("goToTop");
  pause = true;
}

function resumeGame() {
  inpBox.focus();
  document.querySelector(".pauseScreen").classList.add("goToTop");
  pause = false;
}
