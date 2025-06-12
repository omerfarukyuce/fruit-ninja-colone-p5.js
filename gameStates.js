/**
 * Functions related to drawing different game states (screens).
 * These functions require access to global variables like width, height, score,
 * menuApple, menuWatermelon, backBomb, and bestScore defined in sketch.js.
 */

/**
 * Renders the main menu screen of the game.
 */
function drawMenuScreen() {
  fill(255); // White color for text
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Fruit Ninja Clone", width / 2, height / 2 - 100); // Game title

  textSize(28);
  textAlign(CENTER, BOTTOM);
  // Text for "How to Play" button (menuApple)
  text("How to Play", menuApple.x, menuApple.y - menuApple.r - 20);
  menuApple.show(); // Display the interactive menu apple

  // Text for "Start to Play" button (menuWatermelon)
  text("Start to Play", menuWatermelon.x, menuWatermelon.y - menuWatermelon.r - 20);
  menuWatermelon.show(); // Display the interactive menu watermelon
}

/**
 * Renders the game over screen.
 */
function drawGameOver() {
  fill(255); // Red color for "GAME OVER" text
  textSize(60);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 40); // Game over message

  textSize(32);
  text("Score: " + score, width / 2, height / 2 + 30); // Display the final score

  textSize(20);
  text("Click to Restart", width / 2, height / 2 + 70); // Instruction for restarting
}

/**
 * Renders the "How to Play" instructions screen.
 */
function drawHowToPlayScreen() {
  fill(255); // White color for text
  textSize(40);
  textAlign(CENTER, CENTER);
  text("How to Play?", width / 2, height / 2 - 150); // Title for instructions

  textSize(24);
  text("Slice fruits to score points.", width / 2, height / 2 - 70); // Instruction 1
  text("Avoid touching bombs, or the game ends!", width / 2, height / 2 - 30); // Instruction 2
  text("The game speeds up as your score increases.", width / 2, height / 2 + 10); // Instruction 3

  fill(255);
  textSize(28);
  textAlign(CENTER, BOTTOM);
  // Text for "Back" button (backBomb)
  text("Back", backBomb.x, backBomb.y - backBomb.r - 20);
  backBomb.show(); // Display the interactive back bomb
}