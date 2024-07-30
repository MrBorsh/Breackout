const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 10;
const paddleWidth = 75;
const ballRadius = 10;
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const wallWidth = 20;
const wallHeight = 100;
const initialBallSpeed = 4.5; // Ball speed remains constant

let paddleX = (canvas.width - paddleWidth) / 2;
let balls = [];
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;
let level = 1;
let wallX = (canvas.width - wallWidth) / 2;
let staticBlocks = [];

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.getElementById('start-button').addEventListener('click', showLevelSelection);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('next-level-button').addEventListener('click', nextLevel);
document.getElementById('level-1-button').addEventListener('click', () => startGame(1));
document.getElementById('level-2-button').addEventListener('click', () => startGame(2));

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
                            if (level === 1) {
                                document.getElementById('level-up-screen').style.display = 'flex';
                            } else {
                                document.getElementById('game-over').style.display = 'flex';
                                document.getElementById('gameCanvas').style.display = 'none';
                            }
                            return;
                        }
                    }
                });
            }
        }
    }

    staticBlocks.forEach(block => {
        balls.forEach(ball => {
            if (ball.x > block.x && ball.x < block.x + block.width && ball.y > block.y && ball.y < block.y + block.height) {
                ball.dy = -ball.dy;
                ball.color = '#FF0000'; // Change color on collision
                setTimeout(() => {
                    ball.color = '#0095DD'; // Reset color after brief delay
                }, 100);
            }
        });
    });
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color; // Use ball's color
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
            const b = bricks[c][r];
            if (b.status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#DD9500';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawWall() {
    if (level > 1) {
        ctx.beginPath();
        ctx.rect(wallX, brickOffsetTop, wallWidth, wallHeight);
        ctx.fillStyle = '#DD9500';
        ctx.fill();
        ctx.closePath();
    }
}

function drawStaticBlocks() {
    staticBlocks.forEach(block => {
        ctx.beginPath();
        ctx.rect(block.x, block.y, block.width, block.height);
        ctx.fillStyle = '#FFD700'; // Change color to distinguish static blocks
        ctx.fill();
        ctx.closePath();
    });
}

function drawScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

function drawLives() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const canvasElement = document.createElement('canvas');
        canvasElement.width = 20;
        canvasElement.height = 20;
        const ctx = canvasElement.getContext('2d');
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
        livesContainer.appendChild(canvasElement);
    }
}

function startGame(selectedLevel) {
    level = selectedLevel;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    resetGame();
}

function restartGame() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}

function nextLevel() {
    level++;
    resetGame();
    document.getElementById('level-up-screen').style.display = 'none';
}

function resetGame() {
    score = 0;
    lives = 3;
    balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: initialBallSpeed, dy: -initialBallSpeed, color: '#0095DD' }];
    paddleX = (canvas.width - paddleWidth) / 2;
    staticBlocks = [];
    document.getElementById('score').innerText = 'Score: ' + score;
    drawLives();
    setupBricks();
    if (level === 2) {
        setupLevelTwo();
    }
    draw();
}

function setupBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function setupLevelTwo() {
    staticBlocks = [
        { x: 50, y: 100, width: wallWidth, height: wallHeight },
        { x: 200, y: 150, width: wallWidth, height: wallHeight }
    ];
}

function showLevelSelection() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('level-selection').style.display = 'flex';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    balls.forEach(ball => drawBall(ball));
    drawPaddle();
    drawWall();
    drawStaticBlocks();
    drawScore();
    drawLives();

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
                    resetGame();
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

document.getElementById('start-screen').style.display = 'flex';
