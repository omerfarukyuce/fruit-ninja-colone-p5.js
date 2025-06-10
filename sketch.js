let fruits = [];
let bombs = [];
let halves = [];
let score = 0;
let gameOver = false;
let fruitTypes = [];
let sliceSound, bombSound, knifeSound, watahSound, failSound, throwSound, fireFuseSound; // Yeni ses değişkenleri eklendi
let backgroundImg;

let gameState = 'menu'; // 'menu', 'howToPlay', 'playing', 'gameOver'

let menuApple;
let menuWatermelon;
let backBomb;

let trail = [];
const TRAIL_LENGTH = 15;
let lastMouse = null;
let sliceCooldown = 0;
let lastTrailTime = 0;
const TRAIL_TIMEOUT = 300;

let lives = 3; // Can değişkeni

function preload() {
  backgroundImg = loadImage('fruit_ninja_background.png');
  sliceSound = loadSound('swis_sound.mp3');
  bombSound = loadSound('bomb.mp3');
  knifeSound = loadSound('nasty-knife.wav');
  watahSound = loadSound('watah.wav');
  failSound = loadSound('fail.wav');
  throwSound = loadSound('throw.wav');
  fireFuseSound = loadSound('fire-fuse.mp4');
  fruitTypes = [
    {name: "elma", color: color(255, 0, 0), shape: "ellipse"},
    {name: "kivi", color: color(110, 200, 80), shape: "ellipse"},
    {name: "muz", color: color(255, 255, 80), shape: "rect"},
    {name: "portakal", color: color(255, 150, 0), shape: "ellipse"},
    {name: "karpuz", color: color(0, 200, 0), shape: "ellipse"},
    {name: "üzüm", color: color(120, 0, 180), shape: "ellipse"}
  ];
}

function setup() {
  createCanvas(910, 512);
  textFont('Arial Black');
  watahSound.play();

  menuApple = {
    x: width / 2 - 120,
    y: height / 2 + 100,
    r: 50,
    type: fruitTypes[0],
    angle: 0,
    vx: 0,
    vy: 0,
    gravity: 0,
    contains: function(px, py) {
      return dist(px, py, this.x, this.y) < this.r;
    },
    show: function() {
      push();
      translate(this.x, this.y);
      fill(this.type.color);
      noStroke();
      ellipse(0, 0, this.r * 2, this.r * 2);
      pop();
    }
  };

  menuWatermelon = {
    x: width / 2 + 120,
    y: height / 2 + 100,
    r: 60,
    type: fruitTypes[4],
    angle: 0,
    vx: 0,
    vy: 0,
    gravity: 0,
    contains: function(px, py) {
      return dist(px, py, this.x, this.y) < this.r;
    },
    show: function() {
      push();
      translate(this.x, this.y);
      fill(this.type.color);
      noStroke();
      ellipse(0, 0, this.r * 2, this.r * 2);
      pop();
    }
  };

  backBomb = {
    x: width - 100,
    y: height - 100,
    r: 35,
    angle: 0,
    vx: 0,
    vy: 0,
    gravity: 0,
    contains: function(px, py) {
      return dist(px, py, this.x, this.y) < this.r;
    },
    show: function() {
      push();
      translate(this.x, this.y);
      rotate(this.angle);
      fill(50);
      stroke(255, 0, 0);
      strokeWeight(3);
      ellipse(0, 0, this.r * 2);
      stroke(255, 200, 0);
      strokeWeight(4);
      line(0, -this.r, 0, -this.r - 20);
      pop();
    }
  };
}

function draw() {
  if (backgroundImg) {
    let imgAspect = backgroundImg.width / backgroundImg.height;
    let canvasAspect = width / height;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (imgAspect > canvasAspect) {
      drawWidth = width;
      drawHeight = width / imgAspect;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgAspect;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }
    image(backgroundImg, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    background(30, 150, 200);
  }

  switch (gameState) {
    case 'menu':
      drawMenuScreen();
      break;
    case 'howToPlay':
      drawHowToPlayScreen();
      break;
    case 'playing':
      if (gameOver) {
        drawGameOver();
        return;
      }
      let fruitRate = 0.01 + min(score, 50) * 0.0003;
      let bombRate = 0.003 + min(score, 50) * 0.0001;
      if (score > 50) {
        fruitRate += (score - 50) * 0.0007;
        bombRate += (score - 50) * 0.0003;
      }

      if (random(1) < fruitRate) {
        fruits.push(new Fruit());
        if (throwSound) throwSound.play(); // Meyve atıldığında ses çalar
      }
      if (random(1) < bombRate) {
        bombs.push(new Bomb());
        if (fireFuseSound) fireFuseSound.play(); // Bomba atıldığında ses çalar
      }

      for (let i = fruits.length - 1; i >= 0; i--) {
        fruits[i].update();
        fruits[i].show();
        if (fruits[i].offScreen()) {
          lives--; // Meyve yere düştüğünde can azalır
          if (failSound) failSound.play(); // fail.wav sesi çalar
          fruits.splice(i, 1);
          if (lives <= 0) {
            gameOver = true;
            gameState = 'gameOver';
          }
        }
      }

      for (let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].update();
        bombs[i].show();
        if (bombs[i].offScreen()) {
          bombs.splice(i, 1);
        }
      }

      for (let i = halves.length - 1; i >= 0; i--) {
        halves[i].update();
        halves[i].show();
        if (halves[i].done()) {
          halves.splice(i, 1);
        }
      }

      fill(255);
      textSize(32);
      textAlign(LEFT, TOP);
      text("Skor: " + score, 10, 10);
      drawLives(); // Canları çiz
      break;
    case 'gameOver':
      drawGameOver();
      break;
  }

  drawTrail();
  if (sliceCooldown > 0) sliceCooldown--;

  if (millis() - lastTrailTime > TRAIL_TIMEOUT) {
    trail = [];
    lastMouse = null;
  }
}

function mouseDragged() {
  lastTrailTime = millis();
  trail.push({x: mouseX, y: mouseY});
  if (trail.length > TRAIL_LENGTH) trail.shift();

  if (lastMouse) {
    let d = dist(mouseX, mouseY, lastMouse.x, lastMouse.y);
    if (d > 30 && sliceCooldown === 0) {
      if (sliceSound) sliceSound.play();
      sliceCooldown = 10;
    }
  }
  let sliceVec = {x: 0, y: 0};
  if (lastMouse) {
    sliceVec.x = mouseX - lastMouse.x;
    sliceVec.y = mouseY - lastMouse.y;
  }
  lastMouse = {x: mouseX, y: mouseY};

  if (gameState === 'menu') {
    if (menuApple.contains(mouseX, mouseY)) {
      halves.push(new FruitHalf(menuApple, sliceVec));
      if (knifeSound) knifeSound.play();
      gameState = 'howToPlay';
      trail = [];
      lastMouse = null;
      return;
    }
    if (menuWatermelon.contains(mouseX, mouseY)) {
      halves.push(new FruitHalf(menuWatermelon, sliceVec));
      if (knifeSound) knifeSound.play();
      gameState = 'playing';
      score = 0;
      fruits = [];
      bombs = [];
      halves = [];
      trail = [];
      gameOver = false;
      lives = 3; // Oyun başlangıcında canlar sıfırlanır
      lastMouse = null;
      return;
    }
  } else if (gameState === 'howToPlay') {
    if (backBomb.contains(mouseX, mouseY)) {
      if (bombSound) bombSound.play();
      gameState = 'menu';
      trail = [];
      lastMouse = null;
      return;
    }
  } else if (gameState === 'playing') {
    for (let i = fruits.length - 1; i >= 0; i--) {
      if (fruits[i].contains(mouseX, mouseY)) {
        score++;
        halves.push(new FruitHalf(fruits[i], sliceVec));
        if (knifeSound) knifeSound.play();
        fruits.splice(i, 1);
      }
    }
    for (let i = bombs.length - 1; i >= 0; i--) {
      if (bombs[i].contains(mouseX, mouseY)) {
        gameOver = true;
        gameState = 'gameOver';
        if (bombSound) bombSound.play();
        bombs.splice(i, 1);
        break;
      }
    }
  }
}

function mousePressed() {
  if (gameState === 'gameOver') {
    score = 0;
    fruits = [];
    bombs = [];
    halves = [];
    trail = [];
    gameOver = false;
    lives = 3; // Oyun yeniden başladığında canlar sıfırlanır
    gameState = 'playing'; // Oyun bittikten sonra doğrudan oyun durumuna geç
    lastMouse = null;
  }
  if (lastMouse === null) {
      lastMouse = {x: mouseX, y: mouseY};
      lastTrailTime = millis();
      trail.push({x: mouseX, y: mouseY});
  }
}

function drawTrail() {
  push();
  if (trail.length < 2) return;
  noFill();
  stroke(255, 255, 255, 200);
  strokeWeight(8);
  beginShape();
  for (let i = 0; i < trail.length; i++) {
    vertex(trail[i].x, trail[i].y);
  }
  endShape();
  pop();
}

function drawLives() {
  textSize(30);
  textAlign(RIGHT, TOP);
  let startX = width - 20;
  let startY = 10;
  for (let i = 0; i < 3; i++) {
    if (i < lives) {
      fill(255); // Kalan canlar beyaz
    } else {
      fill(255, 0, 0); // Kaybedilen canlar kırmızı
    }
    text("X", startX - (i * 25), startY);
  }
}

function drawMenuScreen() {
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Fruit Ninja Klonu", width / 2, height / 2 - 100);

  textSize(28);
  textAlign(CENTER, BOTTOM);
  text("How to Play", menuApple.x, menuApple.y - menuApple.r - 20);
  menuApple.show();

  text("Start to Play", menuWatermelon.x, menuWatermelon.y - menuWatermelon.r - 20);
  menuWatermelon.show();
}

function drawGameOver() {
  fill(255, 0, 0);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("OYUN BİTTİ", width / 2, height / 2 - 40);
  textSize(32);
  text("Skor: " + score, width / 2, height / 2 + 30);
  textSize(20);
  text("Yeniden başlamak için tıkla", width / 2, height / 2 + 70);
}

function drawHowToPlayScreen() {
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Nasıl Oynanır?", width / 2, height / 2 - 150);

  textSize(24);
  text("Meyveleri keserek puan toplayın.", width / 2, height / 2 - 70);
  text("Bombalara dokunmaktan kaçının, yoksa oyun biter!", width / 2, height / 2 - 30);
  text("Puanınız arttıkça oyun hızlanır.", width / 2, height / 2 + 10);

  fill(255);
  textSize(28);
  textAlign(CENTER, BOTTOM);
  text("Back", backBomb.x, backBomb.y - backBomb.r - 20);
  backBomb.show();
}

class Fruit {
  constructor() {
    this.type = random(fruitTypes);
    this.r = random(30, 50);
    this.x = random(this.r, width - this.r);
    this.y = height + this.r;
    this.vx = random(-2, 2);
    this.vy = random(-11, -15);
    this.gravity = 0.28;
    this.angle = random(TWO_PI);
    this.maxHeight = random(height * 0.1, height * 0.2);
    this.goingUp = true;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    if (this.goingUp && this.y < this.maxHeight) {
      this.vy *= -1;
      this.y = this.maxHeight;
      this.goingUp = false;
    }
    this.angle += 0.05;
  }
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Meyve gövdesi
    fill(this.type.color);
    stroke(this.type.color.levels[0] * 0.8, this.type.color.levels[1] * 0.8, this.type.color.levels[2] * 0.8);
    strokeWeight(2);
    if (this.type.shape === "ellipse") {
      ellipse(0, 0, this.r * 2, this.r * 2);
    } else if (this.type.shape === "rect") {
      rectMode(CENTER);
      rect(0, 0, this.r * 2, this.r, 20);
    }

    // Sap
    fill(80, 40, 0);
    noStroke();
    rect(-5, -this.r - 10, 10, 15, 5); // Daha iyi sap
    pop();
  }
  contains(px, py) {
    return dist(px, py, this.x, this.y) < this.r;
  }
  offScreen() {
    return this.y - this.r > height;
  }
}

class FruitHalf {
  constructor(fruit, sliceVec) {
    this.r = fruit.r;
    this.type = fruit.type;
    this.baseAngle = fruit.angle;

    let initialX = fruit.x;
    let initialY = fruit.y;

    let norm = {x: 0, y: -1};
    if (sliceVec && (sliceVec.x !== 0 || sliceVec.y !== 0)) {
      let len = sqrt(sliceVec.x * sliceVec.x + sliceVec.y * sliceVec.y);
      norm = {x: -sliceVec.y / len, y: sliceVec.x / len};
    }

    let initialVx = fruit.vx !== undefined ? fruit.vx : 0;
    let initialVy = fruit.vy !== undefined ? fruit.vy : 0;

    let speed = 6;
    this.gravity = fruit.gravity !== undefined ? fruit.gravity : 0.28;

    this.half1X = initialX + norm.x * (this.r / 2);
    this.half1Y = initialY + norm.y * (this.r / 2);
    this.half1Vx = initialVx + norm.x * speed;
    this.half1Vy = initialVy + norm.y * speed;
    this.half1Angle = this.baseAngle - 0.2;

    this.half2X = initialX - norm.x * (this.r / 2);
    this.half2Y = initialY - norm.y * (this.r / 2);
    this.half2Vx = initialVx - norm.x * speed;
    this.half2Vy = initialVy - norm.y * speed;
    this.half2Angle = this.baseAngle + 0.2;

    this.t = 0;
  }
  update() {
    this.half1Vy += this.gravity;
    this.half2Vy += this.gravity;

    this.half1X += this.half1Vx;
    this.half1Y += this.half1Vy;
    this.half2X += this.half2Vx;
    this.half2Y += this.half2Vy;

    this.half1Angle += 0.03;
    this.half2Angle -= 0.03;

    this.t++;
  }
  show() {
    push();
    translate(this.half1X, this.half1Y);
    rotate(this.half1Angle);
    fill(this.type.color);
    stroke(this.type.color.levels[0] * 0.8, this.type.color.levels[1] * 0.8, this.type.color.levels[2] * 0.8);
    strokeWeight(2);
    arc(-this.r/2, 0, this.r*2, this.r*2, PI+QUARTER_PI, QUARTER_PI, PIE);
    pop();

    push();
    translate(this.half2X, this.half2Y);
    rotate(this.half2Angle);
    fill(this.type.color);
    stroke(this.type.color.levels[0] * 0.8, this.type.color.levels[1] * 0.8, this.type.color.levels[2] * 0.8);
    strokeWeight(2);
    arc(this.r/2, 0, this.r*2, this.r*2, -QUARTER_PI, PI-QUARTER_PI, PIE);
    pop();
  }
  done() {
    return (this.half1Y - this.r > height) && (this.half2Y - this.r > height);
  }
}

class Bomb {
  constructor() {
    this.r = 35;
    this.x = random(this.r, width - this.r);
    this.y = height + this.r;
    this.vx = random(-1.5, 1.5);
    this.vy = random(-10, -13);
    this.gravity = 0.28;
    this.angle = random(TWO_PI);
    this.maxHeight = random(height * 0.1, height * 0.2);
    this.goingUp = true;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    if (this.goingUp && this.y < this.maxHeight) {
      this.vy *= -1;
      this.y = this.maxHeight;
      this.goingUp = false;
    }
    this.angle += 0.05;
  }
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Bomba gövdesi
    fill(40); // Daha koyu gri
    stroke(20); // Kenarlık için daha koyu
    strokeWeight(3);
    ellipse(0, 0, this.r * 2);

    // Fitil
    stroke(255, 200, 0); // Sarı fitil
    strokeWeight(4);
    line(0, -this.r, 0, -this.r - 20); // Uzun fitil

    // Fitil ucundaki ateş efekti (isteğe bağlı, daha iyi görünüm için eklenebilir)
    fill(255, 100, 0);
    noStroke();
    ellipse(0, -this.r - 25, 8, 8); // Küçük ateş topu
    pop();
  }
  contains(px, py) {
    return dist(px, py, this.x, this.y) < this.r;
  }
  offScreen() {
    return this.y - this.r > height;
  }
}
