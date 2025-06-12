/**
 * Fruit class represents a fruit object in the game.
 */
class Fruit {
  constructor() {
    // Select a random fruit type from the global fruitTypes array (defined in sketch.js)
    this.type = random(fruitTypes);
    this.r = random(30, 50); // Random radius for the fruit
    this.x = random(this.r, width - this.r); // Random x position within canvas bounds
    this.y = height + this.r; // Start below the screen, moving upwards
    this.vx = random(-2, 2); // Random horizontal velocity
    this.vy = random(-11, -15); // Random initial upward velocity
    this.gravity = 0.28; // Gravity effect pulling the fruit down
    this.angle = random(TWO_PI); // Random initial rotation angle
    this.maxHeight = random(height * 0.1, height * 0.2); // Random max height for the fruit's arc
    this.goingUp = true; // Flag to track if the fruit is currently moving upwards
  }
  
  /**
   * Updates the fruit's position and rotation based on its velocity and gravity.
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;

    // If the fruit is going up and reaches its maximum height, reverse vertical velocity
    if (this.goingUp && this.y < this.maxHeight) {
      this.vy *= -1;
      this.y = this.maxHeight; // Ensure it doesn't go above maxHeight
      this.goingUp = false;
    }
    this.angle += 0.05; // Continuously rotate the fruit
  }

  /**
   * Displays the fruit on the canvas.
   */
  show() {
    push(); // Save current drawing style
    translate(this.x, this.y); // Move origin to fruit's center
    rotate(this.angle); // Apply rotation

    // Draw fruit body
    fill(this.type.color); // Use the fruit's defined color
    // Darker stroke based on fruit color for a subtle outline
    stroke(this.type.color.levels[0] * 0.8, this.type.color.levels[1] * 0.8, this.type.color.levels[2] * 0.8);
    strokeWeight(2);
    if (this.type.shape === "ellipse") {
      ellipse(0, 0, this.r * 2, this.r * 2); // Draw as ellipse if shape is "ellipse"
    } else if (this.type.shape === "rect") {
      rectMode(CENTER); // Set rectangle drawing mode to center
      rect(0, 0, this.r * 2, this.r, 20); // Draw as rounded rectangle if shape is "rect"
    }

    // Draw fruit stem
    fill(80, 40, 0); // Brown color for the stem
    noStroke(); // No stroke for the stem
    rect(-5, -this.r - 10, 10, 15, 5); // Draws a more defined stem (x, y, width, height, corner_radius)
    pop(); // Restore previous drawing style
  }

  /**
   * Checks if a given point (px, py) is inside the fruit's circular bounding area.
   * @param {number} px - X-coordinate of the point.
   * @param {number} py - Y-coordinate of the point.
   * @returns {boolean} - True if the point is inside the fruit, false otherwise.
   */
  contains(px, py) {
    return dist(px, py, this.x, this.y) < this.r;
  }

  /**
   * Checks if the fruit has fallen off-screen (below the canvas).
   * @returns {boolean} - True if the fruit is off-screen, false otherwise.
   */
  offScreen() {
    return this.y - this.r > height;
  }
}