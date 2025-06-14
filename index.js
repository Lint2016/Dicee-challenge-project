


// DOM Elements
const playerSetup = document.getElementById('playerSetup');
const gameArea = document.getElementById('gameArea');
const playerForm = document.getElementById('playerForm');
const rollButton = document.getElementById('rollButton');
const newGameButton = document.getElementById('newGameButton');
const player1Dice = document.getElementById('player1Dice');
const player2Dice = document.getElementById('player2Dice');
const resultText = document.getElementById('result');
const player1ScoreEl = document.getElementById('player1Score');
const player2ScoreEl = document.getElementById('player2Score');
const player1NameDisplay = document.getElementById('player1NameDisplay');
const player2NameDisplay = document.getElementById('player2NameDisplay');
const winningScoreDisplay = document.getElementById('winningScoreDisplay');
//const diceSound = document.getElementById('diceSound');
//const winSound = document.getElementById('winSound');

// Game state
let gameState = {
  player1: {
    name: 'Player 1',
    score: 0
  },
  player2: {
    name: 'Player 2',
    score: 0
  },
  winningScore: 5,
  isRolling: false,
  gameOver: false
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Add event listeners
  playerForm.addEventListener('submit', startGame);
  rollButton.addEventListener('click', rollDice);
  newGameButton.addEventListener('click', showPlayerSetup);
  
  // Add keyboard support
  document.addEventListener('keydown', handleKeyDown);
});

// Handle form submission to start the game
function startGame(e) {
  e.preventDefault();
  
  // Get player names from form
  gameState.player1.name = document.getElementById('player1Name').value.trim() || 'Player 1';
  gameState.player2.name = document.getElementById('player2Name').value.trim() || 'Player 2';
  gameState.winningScore = parseInt(document.getElementById('winningScore').value) || 5;
  
  // Reset scores
  gameState.player1.score = 0;
  gameState.player2.score = 0;
  gameState.gameOver = false;
  
  // Update UI
  updatePlayerDisplays();
  updateScoreboard();
  winningScoreDisplay.textContent = gameState.winningScore;
  
  // Show game area and hide setup
  playerSetup.style.display = 'none';
  gameArea.style.display = 'block';
  
  // Focus the roll button for better accessibility
  rollButton.focus();
}

// Roll the dice
async function rollDice() {
  if (gameState.isRolling || gameState.gameOver) return;
  
  gameState.isRolling = true;
  rollButton.disabled = true;
  
  // Play dice rolling sound
  //playSound(diceSound);
  
  // Add rolling animation
  player1Dice.parentElement.classList.add('rolling');
  player2Dice.parentElement.classList.add('rolling');
  
  // Generate random numbers
  const randomNumber1 = Math.floor(Math.random() * 6) + 1;
  const randomNumber2 = Math.floor(Math.random() * 6) + 1;
  
  // Update dice with animation
  await Promise.all([
    animateDice(player1Dice, randomNumber1),
    animateDice(player2Dice, randomNumber2)
  ]);
  
  // Remove rolling animation
  player1Dice.parentElement.classList.remove('rolling');
  player2Dice.parentElement.classList.remove('rolling');
  
  // Determine the winner of this round
  determineRoundWinner(randomNumber1, randomNumber2);
  
  gameState.isRolling = false;
  
  // Check if game is over
  if (gameState.player1.score >= gameState.winningScore || gameState.player2.score >= gameState.winningScore) {
    endGame();
  } else {
    rollButton.disabled = false;
  }
}

// Animate dice roll
function animateDice(diceElement, number) {
  return new Promise(resolve => {
    // Reset animation
    diceElement.style.animation = 'none';
    void diceElement.offsetWidth; // Trigger reflow
    
    // Set the final dice face after animation
    setTimeout(() => {
      diceElement.src = `images/dice${number}.png`;
      diceElement.alt = `Dice showing ${number}`;
      resolve();
    }, 1000);
  });
}

// Determine the winner of the current round
function determineRoundWinner(roll1, roll2) {
  let resultMessage = '';
  
  if (roll1 > roll2) {
    gameState.player1.score++;
    resultMessage = `${gameState.player1.name} wins this round!`;
    highlightWinner(player1Dice.parentElement);
  } else if (roll2 > roll1) {
    gameState.player2.score++;
    resultMessage = `${gameState.player2.name} wins this round!`;
    highlightWinner(player2Dice.parentElement);
  } else {
    resultMessage = "It's a draw!";
    player1Dice.parentElement.classList.add('draw');
    player2Dice.parentElement.classList.add('draw');
    
    // Remove draw class after animation
    setTimeout(() => {
      player1Dice.parentElement.classList.remove('draw');
      player2Dice.parentElement.classList.remove('draw');
    }, 1000);
  }
  
  // Update the UI
  updateScoreboard();
  resultText.innerHTML = resultMessage;
}

// End the game and show winner
function endGame() {
  gameState.gameOver = true;
  // playSound(winSound);
  
  const winner = gameState.player1.score > gameState.player2.score ? 
    gameState.player1 : gameState.player2;
  const loser = gameState.player1.score > gameState.player2.score ? 
    gameState.player2 : gameState.player1;
  
  resultText.innerHTML = `🎉 <strong>${winner.name} wins the game!</strong> 🎉`;
  
  // Highlight the winning player
  if (gameState.player1.score > gameState.player2.score) {
    highlightWinner(player1Dice.parentElement, true);
  } else {
    highlightWinner(player2Dice.parentElement, true);
  }

  // Show SweetAlert popup
  Swal.fire({
    title: '🎉 Game Over! 🎉',
    html: `<h2>${winner.name} Wins!</h2>
           <p>${winner.name} defeated ${loser.name} with a score of ${winner.score}-${loser.score}!</p>`,
    icon: 'success',
    confirmButtonText: 'Play Again',
    background: '#393E46',
    color: '#EEEEEE',
    confirmButtonColor: '#4ECCA3',
    backdrop: `
      rgba(0,0,0,0.6)
      url("images/Nba Finals Basketball GIF by Pudgy Penguins.gif")
      left top
      no-repeat
    `
  }).then((result) => {
    if (result.isConfirmed) {
      showPlayerSetup();
    }
  });
}

// Highlight the winner with animation
function highlightWinner(winnerElement, isGameWinner = false) {
  winnerElement.classList.add('winner');
  
  // For game winners, keep the highlight
  if (!isGameWinner) {
    setTimeout(() => {
      winnerElement.classList.remove('winner');
    }, 2000);
  }
}

// Update the scoreboard
function updateScoreboard() {
  player1ScoreEl.textContent = gameState.player1.score;
  player2ScoreEl.textContent = gameState.player2.score;
  
  // Update score colors based on who's winning
  if (gameState.player1.score > gameState.player2.score) {
    player1ScoreEl.style.color = '#4ECCA3';
    player2ScoreEl.style.color = '#EEEEEE';
  } else if (gameState.player2.score > gameState.player1.score) {
    player2ScoreEl.style.color = '#4ECCA3';
    player1ScoreEl.style.color = '#EEEEEE';
  } else {
    player1ScoreEl.style.color = '#EEEEEE';
    player2ScoreEl.style.color = '#EEEEEE';
  }
}

// Update player name displays
function updatePlayerDisplays() {
  player1NameDisplay.textContent = gameState.player1.name;
  player2NameDisplay.textContent = gameState.player2.name;
  player1Dice.alt = `${gameState.player1.name}'s dice`;
  player2Dice.alt = `${gameState.player2.name}'s dice`;
}

// Show player setup screen
function showPlayerSetup() {
  // Reset game state
  gameState.isRolling = false;
  gameState.gameOver = false;
  
  // Reset UI
  player1Dice.src = 'images/dice6.png';
  player2Dice.src = 'images/dice6.png';
  resultText.innerHTML = 'Click \'Roll Dice\' to start!';
  
  // Clear any active animations
  player1Dice.parentElement.className = 'dice';
  player2Dice.parentElement.className = 'dice';
  
  // Show setup and hide game area
  playerSetup.style.display = 'block';
  gameArea.style.display = 'none';
  
  // Focus first input field
  document.getElementById('player1Name').focus();
}

// Play sound with error handling
function playSound(audioElement) {
  try {
    // Reset audio to start in case it's already playing
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log('Audio play failed:', e));
  } catch (e) {
    console.log('Error playing sound:', e);
  }
}

// Handle keyboard events
function handleKeyDown(e) {
  // Only handle if not in an input field
  if (e.target.tagName === 'INPUT') return;
  
  if (e.code === 'Space' && !gameState.isRolling && !gameState.gameOver) {
    e.preventDefault();
    rollDice();
  } else if (e.code === 'Escape') {
    showPlayerSetup();
  } else if (e.code === 'KeyN' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    showPlayerSetup();
  }

}