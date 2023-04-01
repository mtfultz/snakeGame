const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const snakeSpeed = 100;

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
];

let dx = gridSize;
let dy = 0;
let food = spawnFood();