// Global arrays to hold game objects
let fruits = [];
let bombs = [];
let halves = [];

// Game state variables
let score = 0;
let bestScore = 0; // Variable to store the highest score achieved
let gameOver = false;

// Array to define different types of fruits with their properties (name, color, shape)
let fruitTypes = [];

// Sound variables
let sliceSound, bombSound, knifeSound, watahSound, failSound, throwSound, fireFuseSound;
let backgroundImg; // Variable for the background image

// Current game state, controls which screen is displayed
let gameState = 'menu'; // Possible states: 'menu', 'howToPlay', 'playing', 'gameOver'

// Interactive elements specific to the menu and how-to-play screens
let menuApple;
let menuWatermelon;
let backBomb;

// Variables for the slicing trail effect
let trail = [];
const TRAIL_LENGTH = 15; // Maximum number of points in the trail
let lastMouse = null; // Stores the last mouse position to calculate slice direction and distance
let sliceCooldown = 0; // Cooldown timer for the slice sound to prevent rapid re-triggering
let lastTrailTime = 0; // Timestamp of the last time the trail was updated
const TRAIL_TIMEOUT = 300; // Time in milliseconds after which the trail clears if no mouse movement

let lives = 3; // Player's remaining lives

/**
 * preload() function:
 * Called once before setup(), typically used for loading media assets
 * like images and sound files.
 */
function preload() {
  backgroundImg = loadImage('fruit_ninja_background.png');
  sliceSound = loadSound('sounds/swis_sound.mp3');
  bombSound = loadSound('sounds/bomb.mp3');
  knifeSound = loadSound('sounds/nasty-knife.wav');
  watahSound = loadSound('sounds/watah.wav');
  failSound = loadSound('sounds/fail.wav');
  throwSound = loadSound('sounds/throw.wav'); // Load sound for when fruits are thrown
  fireFuseSound = loadSound('sounds/fire-fuse.mp4'); // Load sound for bomb fuse

  // Initialize fruitTypes array with various fruit definitions
  fruitTypes = [
    {name: "apple", color: color(255, 0, 0), shape: "ellipse"},
    {name: "kiwi", color: color(110, 200, 80), shape: "ellipse"},
    {name: "banana", color: color(255, 255, 80), shape: "rect"},
    {name: "orange", color: color(255, 150, 0), shape: "ellipse"},
    {name: "watermelon", color: color(0, 200, 0), shape: "ellipse"},
    {name: "grapes", color: color(120, 0, 180), shape: "ellipse"}
  ];
}

/**
 * setup() function:
 * Called once when the program starts. Used for initial setup of the canvas
 * and game elements.
 */
function setup() {
  createCanvas(910, 512); // Create the drawing canvas
  textFont('Arial Black'); // Set the font for all text in the game
  watahSound.play(); // Play a background sound on startup

  // Initialize properties for the interactive apple on the menu screen
  menuApple = {
    x: width / 2 - 120,
    y: height / 2 + 100,
    r: 50,
    type: fruitTypes[0], // Uses the first fruit type (apple) for its appearance
    angle: 0, vx: 0, vy: 0, gravity: 0, // Static elements, so velocities and gravity are 0
    contains: function(px, py) { // Method to check if a point is within the apple's area
      return dist(px, py, this.x, this.y) < this.r;
    },
    show: function() { // Method to display the menu apple
      push(); translate(this.x, this.y); fill(this.type.color); noStroke();
      ellipse(0, 0, this.r * 2, this.r * 2);
      // Draw a stem for the menu apple
      fill(80, 40, 0); noStroke(); rect(-5, -this.r - 10, 10, 15, 5);
      pop();
    }
  };

  // Initialize properties for the interactive watermelon on the menu screen
  menuWatermelon = {
    x: width / 2 + 120,
    y: height / 2 + 100,
    r: 60,
    type: fruitTypes[4], // Uses the fifth fruit type (watermelon)
    angle: 0, vx: 0, vy: 0, gravity: 0,
    contains: function(px, py) {
      return dist(px, py, this.x, this.y) < this.r;
    },
    show: function() {
      push(); translate(this.x, this.y); fill(this.type.color); noStroke();
      ellipse(0, 0, this.r * 2, this.r * 2);
      // Draw a stem for the menu watermelon
      fill(80, 40, 0); noStroke(); rect(-5, -this.r - 10, 10, 15, 5);
      pop();
    }
  };

  // Initialize properties for the 'back' bomb on the how-to-play screen
  backBomb = {
    x: width - 100,
    y: height - 100,
    r: 35,
    angle: 0, vx: 0, vy: 0, gravity: 0,
    contains: function(px, py) {
      return dist(px, py, this.x, this.y) < this.r;
    },
    show: function() {
      push(); translate(this.x, this.y); rotate(this.angle);
      fill(50); stroke(255, 0, 0); strokeWeight(3); ellipse(0, 0, this.r * 2);
      stroke(255, 200, 0); strokeWeight(4); line(0, -this.r, 0, -this.r - 20);
      pop();
    }
  };
}

/**
 * draw() function:
 * Called continuously at the frame rate. This is the main game loop
 * where drawing and updates happen based on the current game state.
 */
function draw() {
  // Draw the background image, scaled to fit the canvas while maintaining aspect ratio
  if (backgroundImg) {
    let imgAspect = backgroundImg.width / backgroundImg.height;
    let canvasAspect = width / height;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (imgAspect > canvasAspect) {
      drawWidth = width; drawHeight = width / imgAspect;
      offsetX = 0; offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height; drawWidth = height * imgAspect;
      offsetX = (width - drawWidth) / 2; offsetY = 0;
    }
    image(backgroundImg, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    // Fallback background color if the image is not loaded
    background(30, 150, 200);
  }

  // Use a switch statement to manage different game states
  switch (gameState) {
    case 'menu':
      drawMenuScreen(); // Render the main menu
      break;
    case 'howToPlay':
      drawHowToPlayScreen(); // Render the how-to-play instructions
      break;
    case 'playing':
      if (gameOver) { // If game is over during 'playing' state, go to game over screen
        drawGameOver();
        return; // Stop further drawing/logic for 'playing'
      }

      // Update the best score if the current score is higher
      if (score > bestScore) {
        bestScore = score;
      }

      // Dynamically adjust fruit and bomb spawn rates based on the current score
      let fruitRate = 0.01 + min(score, 50) * 0.0003;
      let bombRate = 0.003 + min(score, 50) * 0.0001;
      if (score > 50) { // Accelerate rates further after score 50
        fruitRate += (score - 50) * 0.0007;
        bombRate += (score - 50) * 0.0003;
      }

      // Randomly spawn new fruits
      if (random(1) < fruitRate) {
        fruits.push(new Fruit());
        if (throwSound) throwSound.play(); // Play a sound when a fruit is spawned
      }
      // Randomly spawn new bombs
      if (random(1) < bombRate) {
        bombs.push(new Bomb());
        if (fireFuseSound) fireFuseSound.play(); // Play a sound when a bomb is spawned
      }

      // Loop through fruits: update, display, and handle off-screen fruits
      for (let i = fruits.length - 1; i >= 0; i--) {
        fruits[i].update();
        fruits[i].show();
        if (fruits[i].offScreen()) {
          lives--; // Decrease a life if a fruit falls off the screen
          if (failSound) failSound.play(); // Play a "fail" sound
          fruits.splice(i, 1); // Remove the fruit from the array
          if (lives <= 0) { // If lives run out, end the game
            gameOver = true;
            gameState = 'gameOver'; // Transition to the game over screen
          }
        }
      }

      // Loop through bombs: update, display, and handle off-screen bombs
      for (let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].update();
        bombs[i].show();
        if (bombs[i].offScreen()) {
          bombs.splice(i, 1); // Remove the bomb from the array
        }
      }

      // Loop through fruit halves: update, display, and remove when done (fallen off-screen)
      for (let i = halves.length - 1; i >= 0; i--) {
        halves[i].update();
        halves[i].show();
        if (halves[i].done()) {
          halves.splice(i, 1); // Remove the fruit half from the array
        }
      }

      // Display the current score
      fill(255); textSize(32); textAlign(LEFT, TOP);
      text("Score: " + score, 10, 10);
      // Display the high score
      textSize(20); // Smaller font for the high score
      text("Best Score: " + bestScore, 10, 45);
      drawLives(); // Draw the player's lives
      break;
    case 'gameOver':
      drawGameOver(); // Render the game over screen
      break;
  }

  drawTrail(); // Always draw the slicing trail
  if (sliceCooldown > 0) sliceCooldown--; // Decrement slice sound cooldown

  // Clear the slicing trail if the mouse hasn't moved for a specified timeout
  if (millis() - lastTrailTime > TRAIL_TIMEOUT) {
    trail = []; // Clear all points from the trail
    lastMouse = null; // Reset last mouse position
  }
}

/**
 * mouseDragged() function:
 * Called when the mouse is dragged (moved while a button is pressed).
 * Handles the core slicing logic and screen transitions.
 */
function mouseDragged() {
  lastTrailTime = millis(); // Update the time of the last trail activity
  trail.push({x: mouseX, y: mouseY}); // Add current mouse position to the trail
  if (trail.length > TRAIL_LENGTH) trail.shift(); // Remove the oldest point if trail exceeds max length

  // Play slice sound if the mouse has moved a significant distance and cooldown is over
  if (lastMouse) {
    let d = dist(mouseX, mouseY, lastMouse.x, lastMouse.y);
    if (d > 30 && sliceCooldown === 0) {
      if (sliceSound) sliceSound.play();
      sliceCooldown = 10; // Set a cooldown to prevent rapid sound re-triggering
    }
  }

  // Calculate the slice vector, used to determine how fruit halves separate
  let sliceVec = {x: 0, y: 0};
  if (lastMouse) {
    sliceVec.x = mouseX - lastMouse.x;
    sliceVec.y = mouseY - lastMouse.y;
  }
  lastMouse = {x: mouseX, y: mouseY}; // Update last mouse position for the next drag event

  // Handle interactions based on the current game state
  if (gameState === 'menu') {
    // If menu apple is sliced, go to 'How to Play' screen
    if (menuApple.contains(mouseX, mouseY)) {
      halves.push(new FruitHalf(menuApple, sliceVec)); // Create halves from the menu apple
      if (knifeSound) knifeSound.play(); // Play a slicing sound
      gameState = 'howToPlay'; // Change game state
      trail = []; lastMouse = null; // Clear trail and reset mouse data
      return;
    }
    // If menu watermelon is sliced, start 'Playing' the game
    if (menuWatermelon.contains(mouseX, mouseY)) {
      halves.push(new FruitHalf(menuWatermelon, sliceVec)); // Create halves from the menu watermelon
      if (knifeSound) knifeSound.play(); // Play a slicing sound
      gameState = 'playing'; // Change game state
      score = 0; fruits = []; bombs = []; halves = []; trail = []; // Reset game variables
      gameOver = false; lives = 3; // Reset game over status and lives
      lastMouse = null;
      return;
    }
  } else if (gameState === 'howToPlay') {
    // If back bomb is sliced, return to 'Menu' screen
    if (backBomb.contains(mouseX, mouseY)) {
      if (bombSound) bombSound.play(); // Play a bomb sound
      gameState = 'menu'; // Change game state
      trail = []; lastMouse = null; // Clear trail and reset mouse data
      return;
    }
  } else if (gameState === 'playing') {
    // In 'playing' state, check for slices on active fruits
    for (let i = fruits.length - 1; i >= 0; i--) {
      if (fruits[i].contains(mouseX, mouseY)) {
        score++; // Increment score for a successful fruit slice
        halves.push(new FruitHalf(fruits[i], sliceVec)); // Create fruit halves
        if (knifeSound) knifeSound.play(); // Play a slicing sound
        fruits.splice(i, 1); // Remove the sliced fruit from the array
      }
    }
    // Check for slices on active bombs
    for (let i = bombs.length - 1; i >= 0; i--) {
      if (bombs[i].contains(mouseX, mouseY)) {
        gameOver = true; // Set game over if a bomb is sliced
        gameState = 'gameOver'; // Transition to game over screen
        if (bombSound) bombSound.play(); // Play a bomb explosion sound
        bombs.splice(i, 1); // Remove the bomb from the array
        break; // Exit loop as the game has ended
      }
    }
  }
}

/**
 * mousePressed() function:
 * Called once when a mouse button is pressed.
 * Handles restarting the game from the 'Game Over' screen.
 */
function mousePressed() {
  if (gameState === 'gameOver') {
    // Reset all game variables to start a new game
    score = 0; fruits = []; bombs = []; halves = []; trail = [];
    gameOver = false; lives = 3; // Reset game over status and lives
    gameState = 'playing'; // Transition directly to the playing state
    lastMouse = null; // Reset last mouse position for a fresh trail
  }
  // Initialize lastMouse and lastTrailTime if starting a new trail (e.g., first click after not dragging)
  if (lastMouse === null) {
      lastMouse = {x: mouseX, y: mouseY};
      lastTrailTime = millis();
      trail.push({x: mouseX, y: mouseY});
  }
}

// All other functions (drawTrail, drawLives, drawMenuScreen, drawGameOver, drawHowToPlayScreen,
// and classes Fruit, FruitHalf, Bomb) are now in separate .js files.
// They are globally accessible because they will be loaded before sketch.js in index.html.