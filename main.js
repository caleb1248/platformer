const ctx = document.querySelector("canvas").getContext("2d");
ctx.fillStyle = "black";

class Player {
  constructor() {
    this.gravity = 1;
    this.x = 0;
    this.y = 400-20;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    this.x += this.speedX;
    this.speedY += this.gravity;
    this.y += this.speedY;
    console.log("clearing rect...");
    ctx.clearRect(0,0,400,400);
    console.log("rect cleared. filling rect")
    ctx.fillRect(this.x, this.y, 20, 20);
    console.log("rect filled");
  }
}

const player = new Player();

/**
 * 
 * @param {KeyboardEvent} e 
 */
window.onkeydown = e => {
  switch(e.key) {
    case "ArrowRight":
      player.speedX = 3;
      break;
    case "ArrowLeft":
      player.speedX = -3;
      break;
    case "ArrowUp":
      player.speedY = -10;
      break;
  }
}

function frame() {
  player.update();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);