const ctx = document.querySelector("canvas").getContext("2d");
let index = 0;
ctx.fillStyle = "black";
ctx.font = "30px Arial";

class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillRect(this.x, this.y, 20, 20);
  }
}

class Block extends GameObject {
  constructor(x, y) {
    super(x, y);
  }
}

class GameText extends GameObject {
  constructor(x, y, text) {
    super(x, y);
    this.text = text;
  }

  draw() {
    ctx.fillText(this.text, this.x, this.y);
  }
}

class End extends GameObject {
  constructor(x,y) {
    super(x, y);
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, 20, 20);
    ctx.fillStyle = "black";
  }
}

class Spike extends GameObject {
  constructor(x, y, rotation) {
    super(x, y);
    this.rotation = rotation * Math.PI / 180;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + 10, this.y + 10);
    ctx.beginPath();
    ctx.rotate(this.rotation);
    ctx.moveTo(0, -10);
    ctx.lineTo(-10,10);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

class Player {
  constructor() {
    this.gravity = 1;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    if (this.y > 400 - 20) {
      this.gravity = 0;
      this.speedY = 0;
      this.y = 400 - 20;
    }

    if (this.x > 400 - 20) {
      this.x = 400 - 20;
      this.speedX = 0;
    }

    if (this.x < 0) {
      this.x = 0;
      this.speedX = 0;
    }

    this.x += this.speedX;
    this.speedY += this.gravity;
    if(this.speedY > 10) {
      this.speedY = 10;
    }
    this.y += this.speedY;

    if (this.y > 400 - 20) {
      this.gravity = 0;
      this.speedY = 0;
      this.y = 400 - 20;
    }

    if (this.x == 400 - 20) {
      this.x = 400 - 20;
      this.speedX = 0;
      if(this.y == 400 - 20) {
        this.x = 0;
        this.y = 0;
        index++;
        loadMap(maps[index], texts[index]);
      }
    }

    ctx.clearRect(0, 0, 400, 400);

    map.forEach(blk => {
      if (blk instanceof Block || blk instanceof Spike || blk instanceof End) {
        blk.draw();
      }
    });

    this.spikeCollisionCheck();
    this.blockCollisionCheck();
    this.leftBlockCheck();
    this.blockUnderCheck();

    if(text) text.draw();

    ctx.fillRect(this.x, this.y, 20, 20);
  }

  isOnGround() {
    return this.y == 380;
  }

  /**
   *
   * @param {Block} block
   */
  isOnBlock(block) {
    return (this.x + 20 > block.x && this.x < block.x + 20) && Math.abs(this.y + 20 - block.y) < 8;
  }

  blockCollisionCheck() {
    var playerIsOnBlock = false;

    for (const block of map.filter(blk => blk instanceof Block)) {
      if(this.isOnBlock(block)) {
        playerIsOnBlock = true;
        this.gravity = 0;
        this.speedY = 0;
        this.y = block.y - 20;
        break;
      }
    }

    if(!playerIsOnBlock) {
      this.gravity = 1;
    }
  }

  isUnderBlock(block) {
    if((this.x + 20 > block.x && this.x < block.x + 20)){
      if(this.y == block.y + 20) {
        return true;
      }
    }
  }

  blockUnderCheck() {
    for (const block of map.filter(blk => blk instanceof Block)) {
      if(this.isUnderBlock(block)) {
        this.gravity = 1;
        this.y = block.y + 20;
        this.speedY = 0;
        for (let i = 0; i < 8; i++) {
          this.speedY += this.gravity;
          this.y += this.speedY;
        }
        break;
      }
    }
  }

  isLeftOfBlock(block) {
    if (this.y + 20 > block.y && this.y < block.y + 20) {
      if(this.x + 20 - block.x < 3 && this.x + 20 - block.x > -3) {
        return true;
      }
    }
  }

  leftBlockCheck() {
    for (const block of map.filter(blk => blk instanceof Block)) {
      if(this.isLeftOfBlock(block)) {
        this.speedX = 0;
        this.x = block.x - 20;
        break;
      }
    }
  }

  collidedWithSpike(spike) {
    return (this.x + 20 > spike.x && this.x < spike.x + 20) && Math.abs(this.y + 20 - spike.y) < 8;
  }

  spikeCollisionCheck() {
    for (const spike of map.filter(blk => blk instanceof Spike)) {
      if(this.collidedWithSpike(spike)) {
        this.x = 0;
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
      }
    }
  }
}

const player = new Player();
/**
 * 
 * @param {string[]} mmap
 * @param {GameText} text
 */
function loadMap(mmap, text2Draw) {
  map = mmap
    .join("")
    .split("")
    .map((char, index) => {
      if (char === "_") {
        return new Block(index % 20 * 20, Math.floor(index / 20) * 20);
      } else if (char === " ") {
        return new GameObject(0, 0);
      } else if (char === "*") {
        return new Spike(index % 20 * 20, Math.floor(index / 20) * 20, 0);
      } else if (char === "!") {
        return new End(index % 20 * 20, Math.floor(index / 20) * 20);
      } else if(char === "u") {
        return new Spike(index % 20 * 20, Math.floor(index / 20) * 20, 180);
      }
    });
  
  if(text2Draw) {
    text = text2Draw;
  } else {
    text = new GameText(0, 0, "");
  }
}

var map = [];
/**
 * @type {GameText}
 */
var text;

const texts = [
  new GameText(40, 40, "Use arrow keys to move"),
  new GameText(40, 40, "Don't touch the spikes!"),
  new GameText(40, 40, "You can jump over spikes."),
]


loadMap(maps[index], texts[index]);
/**
 * @param {KeyboardEvent} e
 */

onkeydown = onkeyup = e => {
  if (e.type === "keyup") {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      player.speedX = 0;
    }
    return;
  }

  switch (e.key) {
    case "ArrowRight":
      player.speedX = 4;
      break;
    case "ArrowLeft":
      player.x -= 4;
      player.speedX = -4;
      break;
    case "ArrowUp":
      if (player.isOnGround() || player.gravity === 0) {
        player.gravity = .5;
        player.speedY = -15;
        player.y -= 2;
        break;
      }
  }
};

function frame() {
  requestAnimationFrame(frame);
  player.update();
}

frame();