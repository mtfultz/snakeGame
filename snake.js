const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const snakeSpeed = 100;

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
];

let dx = 0;
let dy = 0;
let food = spawnFood();

function gameLoop() {
    setTimeout(() => {
        moveSnake();
        checkCollision();
        draw();
        gameLoop();
    }, snakeSpeed);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        // Snake hit the wall, reset game
        snake = [{ x: gridSize * 5, y: gridSize * 5 }];
        dx = gridSize;
        dy = 0;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            // Snake hit itself, reset game
            snake = [{ x: gridSize * 5, y: gridSize * 5 }];
            dx = gridSize;
            dy = 0;
        }
    }
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
        y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    for (const segment of snake) {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function handleKeydown(event) {
    const key = event.key.toLowerCase();

    if (key === 'w' && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (key === 'a' && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (key === 's' && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (key === 'd' && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
}

document.addEventListener('keydown', handleKeydown);
gameLoop();