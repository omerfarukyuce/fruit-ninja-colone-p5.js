/**
 * FruitHalf class represents a sliced half of a fruit.
 * These are created when a fruit is successfully sliced by the player.
 */
class FruitHalf {
  constructor(fruit, sliceVec) {
    this.r = fruit.r; // Radius of the original fruit
    this.type = fruit.type; // Type (color, shape) of the original fruit
    this.baseAngle = fruit.angle; // Initial rotation angle of the original fruit

    let initialX = fruit.x; // Starting X position from the original fruit
    let initialY = fruit.y; // Starting Y position from the original fruit

    // Determine the normal vector to the slice plane
    // This vector dictates the direction the halves will separate
    let norm = {x: 0, y: -1}; // Default normal (vertical slice) if no slice vector is provided
    if (sliceVec && (sliceVec.x !== 0 || sliceVec.y !== 0)) {
      let len = sqrt(sliceVec.x * sliceVec.x + sliceVec.y * sliceVec.y);
      // Calculate perpendicular vector for separation direction
      norm = {x: -sliceVec.y / len, y: sliceVec.x / len};
    }

    // Inherit initial velocities from the original fruit if they exist
    let initialVx = fruit.vx !== undefined ? fruit.vx : 0;
    let initialVy = fruit.vy !== undefined ? fruit.vy : 0;

    let speed = 6; // Speed at which the two halves separate from each other
    // Inherit gravity from the original fruit or use a default
    this.gravity = fruit.gravity !== undefined ? fruit.gravity : 0.28;

    // Properties for the first half
    this.half1X = initialX + norm.x * (this.r / 2); // Slightly offset from center
    this.half1Y = initialY + norm.y * (this.r / 2); // Slightly offset from center
    this.half1Vx = initialVx + norm.x * speed; // Initial velocity including separation
    this.half1Vy = initialVy + norm.y * speed; // Initial velocity including separation
    this.half1Angle = this.baseAngle - 0.2; // Initial rotation offset for variety

    // Properties for the second half
    this.half2X = initialX - norm.x * (this.r / 2); // Slightly offset in opposite direction
    this.half2Y = initialY - norm.y * (this.r / 2); // Slightly offset in opposite direction
    this.half2Vx = initialVx - norm.x * speed; // Initial velocity including separation
    this.half2Vy = initialVy - norm.y * speed; // Initial velocity including separation
    this.half2Angle = this.baseAngle + 0.2; // Initial rotation offset for variety

    this.t = 0; // Time counter for tracking the half's lifespan (not directly used for decay here, but can be for other effects)
  }

  /**
   * Updates the position and rotation of both fruit halves based on their velocities and gravity.
   */
  update() {
    this.half1Vy += this.gravity; // Apply gravity to first half
    this.half2Vy += this.gravity; // Apply gravity to second half

    this.half1X += this.half1Vx; // Update x position of first half
    this.half1Y += this.half1Vy; // Update y position of first half
    this.half2X += this.half2Vx; // Update x position of second half
    this.half2Y += this.half2Vy; // Update y position of second half

    this.half1Angle += 0.03; // Rotate first half
    this.half2Angle -= 0.03; // Rotate second half in opposite direction

    this.t++; // Increment time counter
  }

  /**
   * Displays both fruit halves on the canvas.
   */
  show() {
    // Draw first half
    push(); // Save current drawing style
    translate(this.half1X, this.half1Y); // Move origin to first half's center
    rotate(this.half1Angle); // Apply rotation
    fill(this.type.color); // Use the fruit's defined color
    // Darker stroke based on fruit color for a subtle outline
    stroke(this.type.color.levels[0] * 0.8, this.type.color.levels[1] * 0.8, this.type.color.levels[2] * 0.8);
    strokeWeight(2);
    // Draw an arc representing half of the fruit (PIE mode creates a closed wedge)
    arc(-this.r/2, 0, this.r*2, this.r*2, PI+QUARTER_PI, QUARTER_PI, PIE);
    pop(); // Restore previous drawing style

    // Draw second half
    push(); // Save current drawing style
    translate(this.half2X, this.half2Y); // Move origin to second half's center
    rotate(this.half2Angle); // Apply rotation
    fill(this.type.color); // Use the fruit's defined color
    // Darker stroke based on fruit color for a subtle outline
    stroke(this.type.color.levels[0] * 0.8, this.type.color.levels[1] * 0.8, this.type.color.levels[2] * 0.8);
    strokeWeight(2);
    // Draw an arc representing the other half of the fruit
    arc(this.r/2, 0, this.r*2, this.r*2, -QUARTER_PI, PI-QUARTER_PI, PIE);
    pop(); // Restore previous drawing style
  }

  /**
   * Checks if both fruit halves have fallen off-screen (below the canvas).
   * @returns {boolean} - True if both halves are off-screen, false otherwise.
   */
  done() {
    return (this.half1Y - this.r > height) && (this.half2Y - this.r > height);
  }
}