// Получаем контекст рисования на канвасе
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let = running = true;
const gravity = 1;

const professions = [
    'программист',
    'дизайнер',
    'электромеханик',
    'электромонтажник',
]

const startPage = document.querySelector('.start-page');
let profession;



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
    constructor(x, y) {
        this.pos = new Vec2(x, y);
        this.size = new Vec2(20, 50);
        this.profession = 0
    }
}

// Объявляем переменные для динозавра и препятствий
// let dinoX = 50;
// let dinoY = canvas.height - 50;
const dino = new Dino(50, canvas.height - 50, 50, 50);

// const dinoWidth = 50;
// const dinoHeight = 50;
let obstacles = [];

// Функция для отрисовки динозавра
function drawDino() {
    ctx.fillStyle = 'green';
    ctx.fillRect(dino.pos.x, dino.pos.y, dino.size.x, dino.size.y);
}

// game over
function gameOver() {
    running = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2);
    // alert('Игра окончена!');
    // location.reload(); // Перезагружаем страницу
}

// Функция для отрисовки препятствий
function drawObstacles() {
    ctx.fillStyle = 'brown';
    for (const obstacle of obstacles) {
        ctx.fillRect(obstacle.pos.x, obstacle.pos.y, obstacle.size.x, obstacle.size.y);
        obstacle.pos.x -= 5; // Двигаем препятствие влево
    }
}

function checkCollisions() {
    for (const obstacle of obstacles) {
        if (collideCheck(dino.pos, obstacle.pos, dino.size, obstacle.size)) {
            gameOver();
            break;
        }
    }
}

// Функция для прыжка динозавра
function jump() {
    if (!dino.onGround) return;
    dino.vel.y -= 20;
    dino.onGround = false;
}

// Обработчик нажатия клавиши
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
    }
});


function collideCheck(vec1, vec2, vec1size, vec2size) {
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
    if (dino.pos.y > canvas.height - dino.size.y) {
        dino.onGround = true;
        dino.vel.y = 0;
        dino.pos.y = canvas.height - dino.size.y;
    }
}

// Главная функция игрового цикла
function gameLoop() {
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Создаем новое препятствие с определенной вероятностью
    if (Math.random() < 0.01) {
        // obstacles.push({ x: canvas.width, y: canvas.height - 70 });
        obstacles.push(new Obstacle(canvas.width, canvas.height - 50));
    }

    // Отрисовываем динозавра и препятствия
    applyGravity();
    drawDino();
    drawObstacles();
    checkCollisions();
    if (!running) return;
    // Запускаем следующий кадр
    requestAnimationFrame(gameLoop);
}

function selectProfession(prof) {
    profession = prof
    console.log(professions[profession])
    startPage.style.display = 'none';
    gameLoop();
}
