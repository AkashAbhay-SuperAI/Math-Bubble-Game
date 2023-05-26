function generateQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = Math.random() < 0.5 ? '+' : '-';
  const question = `${num1} ${operator} ${num2}`;
  const answer = operator === '+' ? num1 + num2 : num1 - num2;
  return { question, answer };
}

let pause = false;
let health = 3;

// Create and animate a bubble
window.addEventListener("blur", function () {
  pause = true
});

window.addEventListener("focus", function () {
  pause = false
});

function createBubble() {
  if (pause) return;
  const bubble = document.createElement('div');
  const { question, answer } = generateQuestion();
  bubble.textContent = question;
  bubble.classList.add('bubble');
  bubble.dataset.answer = answer;
  bubble.style.top = "-50px"
  document.getElementById('game-window').appendChild(bubble);
  animateBubble(bubble);
}

// Animate the bubble's movement
// function animateBubble(bubble) {
//   const gameContainer = document.querySelector("#game-window")
//   const left = Math.random() * (gameContainer.offsetWidth - bubble.offsetWidth);

//   let top = -50;
//   const animationInterval = setInterval(() => {
//     top += 5;
//     bubble.style.left = left * 0.9 + 'px';
//     bubble.style.top = top + 'px';
//     if (top >= gameContainer.offsetHeight - bubble.offsetHeight) {
//       clearInterval(animationInterval);
//       bubble.remove();
//       health--;
//       if (health === 0) {
//         gameOver();
//       }
//     }
//   }, 50);
// }

function animateBubble(bubble) {
  const gameContainer = document.querySelector("#game-window")
  const left = Math.random() * (gameContainer.offsetWidth - bubble.offsetWidth);

  let top = -50;
  const animationInterval = setInterval(() => {
    if (bubble.parentNode == null) { // bubble has been removed, so stop the interval
      clearInterval(animationInterval);
      return;
    }
    top += 5;
    bubble.style.left = left * 0.9 + 'px';
    bubble.style.top = top + 'px';
    if (top >= gameContainer.offsetHeight - bubble.offsetHeight) {
      clearInterval(animationInterval);
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
  debugger;
  pause = true;
  const bubbles = Array.from(document.getElementsByClassName('bubble'));
  clearInterval(intervalId)
  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    bubble.remove();
  }
}

// Start the game
function startGame() {
  intervalId = setInterval(createBubble, 1500);
}

// Attach event listener for Enter key press
document.getElementById('textbox').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    // debugger;
    const userAnswer = parseInt(document.getElementById('textbox').value);
    if (!isNaN(userAnswer)) {
      const bubbles = document.getElementsByClassName('bubble');
      for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        const answer = parseInt(bubble.dataset.answer);
        if (userAnswer === answer) {
          bubble.remove();
        }
      }
      document.getElementById('textbox').value = '';
    }
  }
});
startGame();
