const scoreSpan = document.querySelector('.score span');
const dialog = document.querySelector('.dialog');
const professionSpan = document.querySelector('.profession');
const playAgainBtn = document.querySelector('.play-again');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let running = true;

const gravity = 0.7;
const speed = 5;
const jumpStrength = 20;
const chance = 0.01; // 0.01

const professions = [
    'программист',
    'дизайнер',
    'электромеханик',
    'электромонтажник',
]

const professionsImgPath = [
    "assets/prog.svg",
    "assets/designer.svg",
    "assets/electro.svg",
    "assets/screwdriver.svg",
]

const professionsImgs = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
];

const startPage = document.querySelector('.start-page');
let profession;
const dinoImg = new Image();

playAgainBtn.onclick = () => {
    location.reload();
}

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Dino {
    /**
     * Initializes a new instance of the class with the specified position and size.
    *
    * @param {number} x - The x-coordinate of the position.
    * @param {number} y - The y-coordinate of the position.
    * @param {number} width - The width of the size.
    * @param {number} height - The height of the size.
    */
   constructor(x, y, width, height) {
       this.pos = new Vec2(x, y);
       this.vel = new Vec2(0, 0);
       this.size = new Vec2(width, height);
       this.onGround = true;
    }
}

class Obstacle {
    constructor(x, y, profession) {
        this.pos = new Vec2(x, y);
        this.size = new Vec2(50, 50);
        this.profession = profession;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const dino = new Dino(50, canvas.height - 50, 80, 80);

/** @type {Obstacle[]} */
let obstacles = [];

function drawDino() {
    ctx.drawImage(dinoImg, dino.pos.x, dino.pos.y, dino.size.x, dino.size.y);
}

function gameOver() {
    running = false;
    
    dialog.oncancel = e => e.preventDefault();
    dialog.showModal();
}

function drawObstacles() {
    ctx.fillStyle = 'brown';
    for (const obstacle of obstacles) {
        ctx.drawImage(professionsImgs[obstacle.profession], obstacle.pos.x, obstacle.pos.y, obstacle.size.x, obstacle.size.y);
        obstacle.pos.x -= speed; // obstacle.pos.x -= 5;
    }
}

let score = 0;
function increaseScore() {
    score += 10;
    scoreSpan.textContent = `${score}%`;
    if (score >= 100) {
        gameOver();
    }
}

function decreaseScore() {
    if (score <= 0) return;
    score -= 5;
    scoreSpan.textContent = `${score}%`;
}

function checkCollisions() {
    for (const [i, obstacle] of obstacles.entries()) {
        if (collideCheck(dino.pos, dino.size, obstacle.pos, obstacle.size)) {
            
            if (obstacle.profession == profession)
                increaseScore();
            else
                decreaseScore();

            obstacles.splice(i, 1);
            break;
        }
    }
}

function jump() {
    if (!dino.onGround) return;
    dino.vel.y -= jumpStrength;
    dino.onGround = false;
}

// Обработчик нажатия клавиши
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
    }
});


function collideCheck(vec1, vec1size, vec2, vec2size) {
    // Half sizes for easier calculation
    const halfSize1 = { x: vec1size.x / 2, y: vec1size.y / 2 };
    const halfSize2 = { x: vec2size.x / 2, y: vec2size.y / 2 };

    // Check if x-coordinates overlap
    const xOverlap = Math.abs(vec1.x - vec2.x) <= halfSize1.x + halfSize2.x;

    // Check if y-coordinates overlap
    const yOverlap = Math.abs(vec1.y - vec2.y) <= halfSize1.y + halfSize2.y;

    // Return true if there's overlap on both axes
    return xOverlap && yOverlap;
}

function applyGravity() {
    if (!running) return;
    dino.pos.y += dino.vel.y;
    dino.vel.y += gravity;
    if (dino.pos.y >= canvas.height - dino.size.y) {
        dino.onGround = true;
        dino.vel.y = 0;
        dino.pos.y = canvas.height - dino.size.y;
    }
}

function clearGarbage() {
    obstacles = obstacles.filter(obstacle => (obstacle.pos.x + obstacle.size.x) > 0);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < chance) {
        obstacles.push(new Obstacle(canvas.width, [canvas.height-200, canvas.height - 50][getRandomInt(2)], getRandomInt(4)));
    }

    applyGravity();
    drawDino();
    drawObstacles();
    checkCollisions();
    clearGarbage();
    if (!running) return;

    requestAnimationFrame(gameLoop);
}

zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]))

function startGame() {
    for (const [imgPath, professionsImg] of zip(professionsImgPath, professionsImgs)) {
        professionsImg.src = imgPath;
    }
    dinoImg.src = 'assets/dino.svg';
    dinoImg.onload = () => {
        gameLoop();
    };
}

function selectProfession(prof) {
    professionSpan.textContent = professions[prof];
    profession = prof;
    console.log(professions[profession])
    startPage.style.display = 'none';
    startGame();
}
