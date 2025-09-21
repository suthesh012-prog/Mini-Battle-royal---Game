const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;

let player = { x: 180, y: 250, w: 40, h: 40, speed: 5 };
let bullets = [];
let enemies = [];
let score = 0;

// Spawn enemy every 2 seconds
setInterval(() => {
  enemies.push({ x: Math.random() * 360, y: 0, w: 40, h: 40, speed: 2 });
}, 2000);

// Key events
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys[" "]) shoot();

  // Move bullets
  bullets.forEach(b => b.y -= 5);
  bullets = bullets.filter(b => b.y > 0);

  // Move enemies
  enemies.forEach(e => e.y += e.speed);
  enemies = enemies.filter(e => e.y < canvas.height);

  // Check collisions
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.w && b.x + b.w > e.x &&
          b.y < e.y + e.h && b.y + b.h > e.y) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
      }
    });
  });
}

function shoot() {
  if (!keys["canShoot"]) {
    bullets.push({ x: player.x + 18, y: player.y, w: 4, h: 10 });
    keys["canShoot"] = true;
    setTimeout(() => keys["canShoot"] = false, 300); // Fire delay
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Draw bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

  // Draw enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));

  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();