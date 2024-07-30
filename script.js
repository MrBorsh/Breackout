const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;
let level = 1;
let balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2, color: '#0095DD' }];
const bricks = [];
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawLives() {
    for (let i = 0; i < lives; i++) {
        ctx.beginPath();
        ctx.arc(40 + i * 20, 20, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawLives();
    balls.forEach(ball => drawBall(ball));
    drawScore();
    moveBalls();
}

function drawScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
}

function moveBalls() {
    balls.forEach(ball => {
        if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ballRadius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ballRadius) {
            if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                ball.dy = -ball.dy;
            } else {
                lives--;
                if (lives === 0) {
                    document.getElementById('game-over').style.display = 'flex';
                    document.getElementById('gameCanvas').style.display = 'none';
                    return;
                } else {
                    resetBall(ball);
                }
            }
        }
        ball.x += ball.dx;
        ball.y += ball.dy;
    });

    collisionDetection();

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                balls.forEach(ball => {
                    if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                        ball.dy = -ball.dy;
                        ball.color = '#FF0000'; // Change color on collision
                        setTimeout(() => {
                            ball.color = '#0095DD'; // Reset color after brief delay
                        }, 100);
                        b.status = 0;
                        score++;
                        if (score === brickRowCount * brickColumnCount * level) {
                            document.getElementById('level-up-screen').style.display = 'flex';
                            document.getElementById('gameCanvas').style.display = 'none';
                        }
                    }
                });
            }
        }
    }
}

function resetBall(ball) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 2;
    ball.dy = -2;
}

function resetBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function initGame() {
    balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2, color: '#0095DD' }];
    resetBricks();
    score = 0;
    lives = 3;
    level = 1;
    paddleX = (canvas.width - paddleWidth) / 2;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
    draw();
}

function startLevel(levelNum) {
    if (levelNum === 2) {
        balls.push({ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2, color: '#0095DD' });
        // Add barriers here
    }
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('level-up-screen').style.display = 'none';
    initGame();
}

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('level-selection').style.display = 'flex';
});

document.getElementById('level-1-button').addEventListener('click', () => startLevel(1));
document.getElementById('level-2-button').addEventListener('click', () => startLevel(2));
document.getElementById('next-level-button').addEventListener('click', () => startLevel(2));
document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
});
