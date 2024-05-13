const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const playerWidth = 80;
const playerHeight = 80; 
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 20;
const playerSpeed = 7;

const bulletWidth = 30; // Increased width for visibility
const bulletHeight = 60; // Increased height for visibility
const bulletSpeed = 10;
let bullets = [];

const invaderRowCount = 5;
const invaderColumnCount = 11;
const invaderWidth = 60; 
const invaderHeight = 60;
const invaderPadding = 20;
const invaderOffsetTop = 50;
const invaderOffsetLeft = 50;
let invaders = [];
let invaderDirection = 1;
const invaderSpeed = 1;
const invaderDescentSpeed = 5; // Slower descent

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;

const playerImage = new Image();
playerImage.src = 'player.png';  // Ensure you have an image named 'player.png'

const bulletImage = new Image();
bulletImage.src = 'bullet.png';  // Ensure you have an image named 'bullet.png'

const invaderImage = new Image();
invaderImage.src = 'invader.png';  // Ensure you have an image named 'invader.png'

const explosionImage = new Image();
explosionImage.src = 'explosion.png';  // Ensure you have an image named 'explosion.png'

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

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
    if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = true;
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
    if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = false;
        shootBullet();
    }
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchEndX = touchStartX;
    touchEndY = touchStartY;
}

function handleTouchMove(event) {
    const touch = event.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
}

function handleTouchEnd() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            // Swipe right
            rightPressed = true;
            leftPressed = false;
        } else {
            // Swipe left
            leftPressed = true;
            rightPressed = false;
        }
    } else {
        if (dy > 0) {
            // Swipe down
            downPressed = true;
            upPressed = false;
        } else {
            // Swipe up
            upPressed = true;
            downPressed = false;
        }
    }
    setTimeout(() => {
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
        downPressed = false;
    }, 100); // Reset after 100ms

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        // Tap detected
        shootBullet();
    }
}

function drawPlayer() {
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

function drawBullet(bullet) {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bulletWidth, bulletHeight);
}

function drawInvader(invader) {
    ctx.drawImage(invaderImage, invader.x, invader.y, invaderWidth, invaderHeight);
}

function drawExplosion(explosion) {
    ctx.drawImage(explosionImage, explosion.x, explosion.y, invaderWidth, invaderHeight);
}

function drawInvaders() {
    for (let c = 0; c < invaderColumnCount; c++) {
        for (let r = 0; r < invaderRowCount; r++) {
            let invader = invaders[c][r];
            if (invader.status === 1) {
                drawInvader(invader);
            } else if (invader.status === 2) {
                drawExplosion(invader);
            }
        }
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

function shootBullet() {
    bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY, status: 1 });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        if (bullet.status === 1) {
            bullet.y -= bulletSpeed;
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        }
    });
}

function createInvaders() {
    for (let c = 0; c < invaderColumnCount; c++) {
        invaders[c] = [];
        for (let r = 0; r < invaderRowCount; r++) {
            let invaderX = c * (invaderWidth + invaderPadding) + invaderOffsetLeft;
            let invaderY = r * (invaderHeight + invaderPadding) + invaderOffsetTop;
            invaders[c][r] = { x: invaderX, y: invaderY, status: 1 };
        }
    }
}

function updateInvaderPositions() {
    let rightEdge = 0;
    let leftEdge = canvas.width;
    for (let c = 0; c < invaderColumnCount; c++) {
        for (let r = 0; r < invaderRowCount; r++) {
            let invader = invaders[c][r];
            if (invader.status === 1) {
                invader.x += invaderDirection * invaderSpeed;
                rightEdge = Math.max(rightEdge, invader.x + invaderWidth);
                leftEdge = Math.min(leftEdge, invader.x);
            }
        }
    }
    if (rightEdge > canvas.width - invaderOffsetLeft || leftEdge < invaderOffsetLeft) {
        invaderDirection *= -1;
        for (let c = 0; c < invaderColumnCount; c++) {
            for (let r = 0; r < invaderRowCount; r++) {
                let invader = invaders[c][r];
                invader.y += invaderDescentSpeed;
                if (invader.y + invaderHeight >= playerY && invader.status === 1) {
                    gameOver();
                }
            }
        }
    }
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        invaders.forEach((column, columnIndex) => {
            column.forEach((invader, invaderIndex) => {
                if (invader.status === 1 && bullet.status === 1) {
                    if (bullet.x > invader.x && bullet.x < invader.x + invaderWidth &&
                        bullet.y > invader.y && bullet.y < invader.y + invaderHeight) {
                        invader.status = 2;  // Change status to explosion
                        bullet.status = 0;
                        setTimeout(() => {
                            invader.status = 0;  // Remove invader after explosion
                            bullets.splice(bulletIndex, 1);
                        }, 500);  // Explosion duration
                    }
                }
            });
        });
    });
}

function checkPlayerInvaderCollision() {
    invaders.forEach((column) => {
        column.forEach((invader) => {
            if (invader.status === 1) {
                if (playerX < invader.x + invaderWidth &&
                    playerX + playerWidth > invader.x &&
                    playerY < invader.y + invaderHeight &&
                    playerY + playerHeight > invader.y) {
                    gameOver();
                }
            }
        });
    });
}

function gameOver() {
    document.getElementById('gameOver').classList.remove('hidden');
    setTimeout(() => {
        location.reload();
    }, 2000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    bullets.forEach(drawBullet);
    drawInvaders();
    movePlayer();
    moveBullets();
    updateInvaderPositions();
    checkCollisions();
    checkPlayerInvaderCollision();
    requestAnimationFrame(draw);
}

createInvaders();
draw();
