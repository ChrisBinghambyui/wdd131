const greetings = [
  "Hello World!",
  "Buenos días!",
  "Welcome!",
  "How's it going?",
  "What's up?"
];

const typewriterElement = document.getElementById("typewriter");

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

const typingSpeed = 100;
const deleteSpeed = 50;
const pauseDelay = 5000;

function getRandomGreetingIndex(currentIndex) {
  if (greetings.length <= 1) return 0;
  
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * greetings.length);
  } while (newIndex === currentIndex);
  
  return newIndex;
}

function typeLoop() {
  const currentText = greetings[currentTextIndex];

  if (isDeleting) {
    currentCharIndex--;
    typewriterElement.textContent = currentText.substring(0, currentCharIndex);
  } else {
    currentCharIndex++;
    typewriterElement.textContent = currentText.substring(0, currentCharIndex);
  }

  let nextTimeout = isDeleting ? deleteSpeed : typingSpeed;

  if (!isDeleting && currentCharIndex === currentText.length) {
    isDeleting = true;
    nextTimeout = pauseDelay;
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentTextIndex = getRandomGreetingIndex(currentTextIndex);
    nextTimeout = 400;
  }

  setTimeout(typeLoop, nextTimeout);
}

document.addEventListener("DOMContentLoaded", () => {
  typeLoop();
  initTronBackground();
});

function initTronBackground() {
  const canvas = document.getElementById("tronCanvas");
  const ctx = canvas.getContext("2d");

  const GRID_SIZE = 40;
  const COLORS = ["#00d8ff", "#ff6b00"];

  let cols, rows, occupiedGrid;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / GRID_SIZE);
    rows = Math.floor(canvas.height / GRID_SIZE);
    occupiedGrid = Array.from({ length: cols }, () => new Array(rows).fill(false));
    ctx.fillStyle = "#060911";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resize);
  resize();

  class LightBike {
    constructor() {
      this.reset();
    }

    reset() {
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.speed = 4;
      
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) {
        this.gridX = Math.floor(Math.random() * cols);
        this.gridY = 0;
        this.dir = { x: 0, y: 1 };
      } else if (edge === 1) {
        this.gridX = Math.floor(Math.random() * cols);
        this.gridY = rows - 1;
        this.dir = { x: 0, y: -1 };
      } else if (edge === 2) {
        this.gridX = 0;
        this.gridY = Math.floor(Math.random() * rows);
        this.dir = { x: 1, y: 0 };
      } else {
        this.gridX = cols - 1;
        this.gridY = Math.floor(Math.random() * rows);
        this.dir = { x: -1, y: 0 };
      }

      this.x = this.gridX * GRID_SIZE;
      this.y = this.gridY * GRID_SIZE;
      this.path = [{ x: this.x, y: this.y }];
      this.distanceSinceTurn = 0;
      this.life = 0;
      this.maxLife = 600;
      this.active = true;

      if (this.isValidCell(this.gridX, this.gridY)) {
        occupiedGrid[this.gridX][this.gridY] = true;
      }
    }

    isValidCell(gx, gy) {
      return gx >= 0 && gx < cols && gy >= 0 && gy < rows;
    }

    isCellFree(gx, gy) {
      return this.isValidCell(gx, gy) && !occupiedGrid[gx][gy];
    }

    getValidDirections() {
      const valid = [];
      const possibleDirs = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 }
      ];

      possibleDirs.forEach((d) => {
        if (d.x === -this.dir.x && d.y === -this.dir.y) return;

        const nextGX = this.gridX + d.x;
        const nextGY = this.gridY + d.y;
        if (this.isCellFree(nextGX, nextGY)) {
          valid.push(d);
        }
      });

      return valid;
    }

    update() {
      if (!this.active) return;

      this.x += this.dir.x * this.speed;
      this.y += this.dir.y * this.speed;
      this.distanceSinceTurn += this.speed;
      this.life++;

      if (this.distanceSinceTurn >= GRID_SIZE) {
        this.gridX += this.dir.x;
        this.gridY += this.dir.y;
        this.x = this.gridX * GRID_SIZE;
        this.y = this.gridY * GRID_SIZE;
        this.distanceSinceTurn = 0;

        if (this.isValidCell(this.gridX, this.gridY)) {
          occupiedGrid[this.gridX][this.gridY] = true;
        }

        const straightGX = this.gridX + this.dir.x;
        const straightGY = this.gridY + this.dir.y;
        const straightBlocked = !this.isCellFree(straightGX, straightGY);

        const validDirs = this.getValidDirections();

        if (validDirs.length === 0) {
          this.active = false;
          setTimeout(() => this.reset(), 1000);
          return;
        }

        if (straightBlocked || Math.random() < 0.25) {
          let choicePool = validDirs;
          if (!straightBlocked) {
            choicePool = validDirs.filter(
              (d) => d.x === this.dir.x && d.y === this.dir.y
            );
            if (choicePool.length === 0 || Math.random() < 0.5) {
              choicePool = validDirs;
            }
          }

          const newDir = choicePool[Math.floor(Math.random() * choicePool.length)];
          if (newDir.x !== this.dir.x || newDir.y !== this.dir.y) {
            this.path.push({ x: this.x, y: this.y });
            this.dir = newDir;
          }
        }
      }

      if (this.life > this.maxLife || !this.isValidCell(this.gridX, this.gridY)) {
        this.active = false;
        this.reset();
      }
    }

    draw(ctx) {
      if (this.path.length === 0) return;

      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let i = 1; i < this.path.length; i++) {
        ctx.lineTo(this.path[i].x, this.path[i].y);
      }
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  const bikes = Array.from({ length: 4 }, () => new LightBike());

  function drawGrid() {
    ctx.strokeStyle = "rgba(0, 255, 102, 0.04)";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(6, 9, 17, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.002) {
      occupiedGrid = Array.from({ length: cols }, () => new Array(rows).fill(false));
    }

    drawGrid();

    bikes.forEach((bike) => {
      bike.update();
      bike.draw(ctx);
    });

    requestAnimationFrame(animate);
  }

  animate();
}