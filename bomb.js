/**
 * Bomb class represents a bomb object in the game.
 * Players should avoid slicing these.
 */
class Bomb {
  constructor() {
    this.r = 35; // Radius of the bomb
    this.x = random(this.r, width - this.r); // Random x position within canvas bounds
    this.y = height + this.r; // Start below the screen, moving upwards
    this.vx = random(-1.5, 1.5); // Random horizontal velocity
    this.vy = random(-10, -13); // Random initial upward velocity
    this.gravity = 0.28; // Gravity effect pulling the bomb down
    this.angle = random(TWO_PI); // Random initial rotation angle
    this.maxHeight = random(height * 0.1, height * 0.2); // Random max height for the bomb's arc
    this.goingUp = true; // Flag to track if the bomb is currently moving upwards
  }

  /**
   * Updates the bomb's position and rotation based on its velocity and gravity.
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    // If the bomb is going up and reaches its maximum height, reverse vertical velocity
    if (this.goingUp && this.y < this.maxHeight) {
      this.vy *= -1;
      this.y = this.maxHeight;
      this.goingUp = false;
    }
    this.angle += 0.05; // Continuously rotate the bomb
  }

  /**
   * Displays the bomb on the canvas.
   */
  show() {
    push(); // Save current drawing style
    translate(this.x, this.y); // Move origin to bomb's center
    rotate(this.angle); // Apply rotation

    // Bomb body
    fill(40); // Darker gray color for the bomb
    stroke(20); // Even darker border for the bomb
    strokeWeight(3);
    ellipse(0, 0, this.r * 2); // Draw the bomb as a circle

    // Fuse
    stroke(255, 200, 0); // Yellow color for the fuse
    strokeWeight(4);
    line(0, -this.r, 0, -this.r - 20); // Draw the fuse extending upwards from the bomb

    // Optional: Fire effect at the tip of the fuse
    fill(255, 100, 0); // Orange color for the fire
    noStroke(); // No stroke for the fire
    ellipse(0, -this.r - 25, 8, 8); // Draw a small ellipse for the fire ball
    pop(); // Restore previous drawing style
  }

  /**
   * Checks if a given point (px, py) is inside the bomb's circular bounding area.
   * @param {number} px - X-coordinate of the point.
   * @param {number} py - Y-coordinate of the point.
   * @returns {boolean} - True if the point is inside the bomb, false otherwise.
   */
  contains(px, py) {
    return dist(px, py, this.x, this.y) < this.r;
  }

  /**
   * Checks if the bomb has fallen off-screen (below the canvas).
   * @returns {boolean} - True if the bomb is off-screen, false otherwise.
   */
  offScreen() {
    return this.y - this.r > height;
  }
}