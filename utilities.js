/**
 * Utility functions for drawing visual elements that are not part of specific game objects.
 * These functions require access to global variables like trail, TRAIL_LENGTH, lives,
 * width, and height defined in sketch.js.
 */

/**
 * Draws the slicing trail left by the mouse.
 */
function drawTrail() {
  push(); // Save current drawing style
  if (trail.length < 2) return; // Need at least two points to draw a line

  noFill(); // No fill for the trail
  stroke(255, 255, 255, 200); // White color with some transparency
  strokeWeight(8); // Thick line for the trail

  beginShape(); // Start drawing a shape
  for (let i = 0; i < trail.length; i++) {
    vertex(trail[i].x, trail[i].y); // Add each point from the trail array
  }
  endShape(); // End the shape (creates connected lines)
  pop(); // Restore previous drawing style
}

/**
 * Displays the player's remaining lives on the screen.
 * Shows three 'X' marks, with lost lives colored red.
 */
function drawLives() {
  textSize(30); // Font size for life indicators
  textAlign(RIGHT, TOP); // Align text to the right and top

  let startX = width - 20; // Starting X position for the first 'X' (from right edge)
  let startY = 10; // Starting Y position

  for (let i = 0; i < 3; i++) { // Loop for 3 possible lives
    if (i < lives) {
      fill(255); // White color for remaining lives
    } else {
      fill(255, 0, 0); // Red color for lost lives
    }
    // Draw 'X' marks, spaced horizontally
    text("X", startX - (i * 25), startY);
  }
}