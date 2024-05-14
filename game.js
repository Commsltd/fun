const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    playerY = canvas.height - playerHeight - 20; // Adjust player Y position on resize
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const playerWidth = 80;
const playerHeight = 80;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 20;
const playerSpeed = 7;

const playerImage = new Image();
playerImage.src = 'player.png';

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.key === 'Up' || e.key === 'ArrowUp') {
        upPressed = true;
    }
    if (e.key === 'Down' || e.key === 'ArrowDown') {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
    if (e.key === 'Up' || e.key === 'ArrowUp') {
        upPressed = false;
    }
    if (e.key === 'Down' || e.key === 'ArrowDown') {
        downPressed = false;
    }
}

function movePlayer() {
    if (rightPressed && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
    if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (upPressed && playerY > 0) {
        playerY -= playerSpeed;
    }
    if (downPressed && playerY < canvas.height - playerHeight) {
        playerY += playerSpeed;
    }
}

function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

function draw() {
    drawPlayer();
    movePlayer();
    requestAnimationFrame(draw);
}

playerImage.onload = () => {
    draw();
}
