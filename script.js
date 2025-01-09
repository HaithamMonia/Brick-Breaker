document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const paddle = document.getElementById('paddle');
    const bricksContainer = document.getElementById('bricks');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const livesDisplay = document.getElementById('lives');
    const pauseMenu = document.getElementById('pause-menu');
    const continueBtn = document.getElementById('continue-btn');
    const restartBtn = document.getElementById('restart-btn');
    const winDialog = document.getElementById('win-dialog');
    const winRestartBtn = document.getElementById('win-restart-btn');
    const lostDialog = document.getElementById('lost-dialog');
    const lostRestartBtn = document.getElementById('lost-restart-btn');

    let ballX = window.innerWidth / 2 - 10;
    let ballY = window.innerHeight / 2 - 10;
    let ballDX = 4;
    let ballDY = -4;
    let paddleX = window.innerWidth / 2 - 50;
    let score = 0;
    let lives = 3;
    let gamePaused = false;
    let gameTimer = 0;
    let bricks = [];

    function createBricks() {
        bricksContainer.innerHTML = ''; // Clear existing bricks
        const rows = 1;
        const cols = 10;
        const brickWidth = 60;
        const brickHeight = 20;
        const brickMargin = 10;

        bricks = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const brick = document.createElement('div');
                brick.classList.add('brick');
                brick.style.left = `${j * (brickWidth + brickMargin)}px`;
                brick.style.top = `${i * (brickHeight + brickMargin)}px`;
                bricksContainer.appendChild(brick);
                bricks.push(brick);
            }
        }
    }

    function updateGame() {
        if (gamePaused) return;

        // Ball movement
        ballX += ballDX;
        ballY += ballDY;

        // Ball collision with walls
        if (ballX <= 0 || ballX >= window.innerWidth - 20) ballDX = -ballDX;
        if (ballY <= 0) ballDY = -ballDY;

        // Ball collision with paddle
        const paddleRect = paddle.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        if (
            ballRect.bottom >= paddleRect.top &&
            ballRect.left < paddleRect.right &&
            ballRect.right > paddleRect.left &&
            ballRect.top < paddleRect.bottom
        ) {
            ballDY = -ballDY;
            ballY = paddleRect.top - ballRect.height; // Adjust ball position to prevent sticking
        }

        // Ball collision with bricks
        bricks.forEach((brick, index) => {
            const brickRect = brick.getBoundingClientRect();

            if (
                ballRect.left < brickRect.right &&
                ballRect.right > brickRect.left &&
                ballRect.top < brickRect.bottom &&
                ballRect.bottom > brickRect.top
            ) {
                ballDY = -ballDY;
                bricksContainer.removeChild(brick);
                bricks.splice(index, 1);
                score += 10;
                scoreDisplay.textContent = score;
                if (bricks.length === 0) {
                    showWinDialog();
                }
            }
        });

        // Ball out of bounds
        if (ballY > window.innerHeight) {
            lives--;
            if (lives <= 0) {
                showLostDialog();
                return;
            }
            resetBall();
        }

        // Update positions
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
        paddle.style.left = `${paddleX}px`;

        // Update scoreboard
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        timeDisplay.textContent = gameTimer;

        // Request next frame
        requestAnimationFrame(updateGame);
    }

    function showWinDialog() {
        gamePaused = true;
        winDialog.style.display = 'block';
        document.getElementById('win-score').textContent = score;
        document.getElementById('win-time').textContent = gameTimer;
    }

    function showLostDialog() {
        gamePaused = true;
        lostDialog.style.display = 'block';
    }

    function resetBall() {
        ballX = window.innerWidth / 2 - 10;
        ballY = window.innerHeight / 2 - 10;
        ballDX = 4;
        ballDY = -4;
    }

    function resetGame() {
        score = 0;
        lives = 3;
        gameTimer = 0;
        resetBall();
        createBricks();
        gamePaused = false;
        pauseMenu.style.display = gamePaused ? 'block' : 'none';
        winDialog.style.display = 'none';
        lostDialog.style.display = 'none';
        updateGame();
    }

    function handleKeyDown(e) {
        if (e.key === 'ArrowLeft' && paddleX >=60) {
            paddleX -= 20;
        } else if (e.key === 'ArrowRight' && paddleX < window.innerWidth - 60) {
            paddleX += 20;
        } else if (e.key === 'Escape') {
            togglePause();
        }
    }

    function togglePause() {
        gamePaused = !gamePaused;
        pauseMenu.style.display = gamePaused ? 'block' : 'none';
        if (!gamePaused) updateGame();
    }

    document.addEventListener('keydown', handleKeyDown);
    continueBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', resetGame);
    winRestartBtn.addEventListener('click', resetGame);
    lostRestartBtn.addEventListener('click', resetGame);

    // Start game
    createBricks();
    updateGame();

    // Timer
    setInterval(() => {
        if (!gamePaused) gameTimer++;
    }, 1000);
});
