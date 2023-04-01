const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 40;
const snakeSpeed = 100;
let startButton, restartButton;
let dx = 0;
let dy = 0;
let score = 0;
let highScore = 0;
let gameState = 'start'; // The game states can be 'start', 'playing', 'gameover'
let showStartScreen = true;
let listenersAdded = false;
let gameLoopRunning = false; 

let food = spawnFood();

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
];


function gameLoop() {
    if (gameState != 'gameover' && !gameLoopRunning) {
        gameLoopRunning = true;
        setTimeout(() => {
            moveSnake();
            checkCollision();
            draw();
            gameLoopRunning = false;
            gameLoop();
        }, snakeSpeed);
    }
}

function startGame() {
    gameState = 'playing';
    showStartScreen = false;
}

function restartGame() {
    gameState = 'playing';
    snake = [spawnSnake()];
    food = spawnFood();
    dx = 0;
    dy = 0;
    score = 0;
    if (!gameLoopRunning) {
        gameLoop();
    }
}


// spawn snake at random position
function spawnSnake() {
    return {
        x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
        y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
    };
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
        y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
    };
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // if snake's head position = food's position, spawn food and increment score
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
        score++;
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        // Snake hit the wall, game over
        gameState = 'gameover';
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            // Snake hit itself, game over
            gameState = 'gameover';
        }
    }
}

function createButton(text, x, y, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, x + width / 2, y + (height / 2) + 6);
    
    return { x, y, width, height };
}



function addButtonListeners() {
    if (!listenersAdded) {
        canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (gameState === 'start') {
            if (x >= startButton.x && x <= startButton.x + startButton.width &&
                y >= startButton.y && y <= startButton.y + startButton.height) {
                startGame();
            }
        } else if (gameState === 'gameover') {
            if (x >= restartButton.x && x <= restartButton.x + restartButton.width &&
                y >= restartButton.y && y <= restartButton.y + restartButton.height) {
                restartGame();
            }
        }
    });
        listenersAdded = true;
    }
}

function drawStartScreen() {
    // Draw opaque background
    ctx.fillStyle = 'rgba(255,255,255, 1)';
    ctx.fillRect(canvas.width/4,canvas.width/4, canvas.width/2, canvas.height/2);

    // Draw border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(canvas.width/4,canvas.width/4, canvas.width/2, canvas.height/2);
    
    //Draw text
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Snake Game', canvas.width / 2, canvas.height / 3);
    ctx.font = '20px Arial';
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2);
    
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (x >= startButton.x && x <= startButton.x + startButton.width &&
            y >= startButton.y && y <= startButton.y + startButton.height) {
            startGame();
        }
    });
    startButton = createButton('Start Game', (canvas.width / 2) - 100, (canvas.height * 2) / 3-50, 200, 40);
}

function drawGameOverScreen() {
    // Draw opaque background
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(canvas.width/4,canvas.width/4, canvas.width/2, canvas.height/2);

    // Draw border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(canvas.width/4,canvas.width/4, canvas.width/2, canvas.height/2);
    
    // Draw text
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 3);

    if (score > highScore) {
        highScore = score;
        ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2);
        ctx.fillText('New High Score!', canvas.width / 2, canvas.height / 2+50);
    } else {
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2);
    }

    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, (canvas.height * 3) / 5);
    
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (x >= restartButton.x && x <= restartButton.x + restartButton.width &&
            y >= restartButton.y && y <= restartButton.y + restartButton.height) {
            restartGame();
        }
    });
    restartButton = createButton('Restart Game', (canvas.width / 2) - 100, (canvas.height * 2) / 3, 200, 40);
}




function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 50, 30);
}

function draw() {
    const gap = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    for (const segment of snake) {
        // Draw black border
        ctx.fillStyle = 'black';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        
        // Draw green body
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x + gap/2, segment.y + gap/2, gridSize-gap, gridSize-gap);
    }

    // Draw food
    ctx.fillStyle = 'black';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x + gap/2, food.y + gap/2, gridSize-gap, gridSize-gap);

    // Draw Score
    drawScore();

    if (gameState == 'start') {
        drawStartScreen();
    } else if (gameState == 'gameover') {
        drawGameOverScreen();
    }
}


function handleKeydown(event) {
    
    if (gameState == 'playing') {
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
}

addButtonListeners();
document.addEventListener('keydown', handleKeydown);
gameLoop();