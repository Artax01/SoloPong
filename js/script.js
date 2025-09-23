document.addEventListener('DOMContentLoaded', function() {
   
    const canvasObj = document.getElementById('canvas');
    const ctx = canvasObj.getContext("2d");
    const score = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    // style
    // const scoreTab = document.getElementById('score_tab');
    const startBtnContainer = document.getElementById('startBtnContainer');
    // const strechModeBtn = document.getElementById('stretchModeBtn');
    // const colorPicker = document.getElementById('colorPicker');

    const canvas = {
        HEIGHT: canvasObj.height,
        WIDTH: canvasObj.width
    }

    const paddle = {
        startX: canvas.WIDTH / 2 - (250 / 2),
        startY: canvas.HEIGHT - 75,
        x: canvas.WIDTH / 2 - (250 / 2),
        y: canvas.HEIGHT - 75,
        height: 25,
        width: 250,
        radius: 5,
        velocity: 22,
        stroke: 2,
        // fillStyle: colorPicker.value,
        fillStyle: "#FFFFFF",
        strokeStyle: "#000"
    }

    const ball = {
        startX: canvas.WIDTH / 2,
        startY: canvas.HEIGHT - 4.25 * paddle.height,
        x: canvas.WIDTH / 2,
        y: canvas.HEIGHT - 4.25 * paddle.height,
        height: 10,
        width: 10,
        radius: 30,
        velocity: 20,
        angle: Math.PI / 4,
        // fillStyle: colorPicker.value,
        fillStyle: "#FFFFFF",
    }

    const keys = {
        left: false,
        right: false
    }

    const game = {
        playing: false,
        multiplier: 1.05,
        score: 0,
        highestScore: 0,
        startTime: null,
        animationFrame: null
    }

    function drawPaddle(xPos, yPos, height, width, radius) {
        ctx.beginPath();
        ctx.rect(xPos, yPos, width, height);
        ctx.fillStyle = paddle.fillStyle;
        ctx.fill();
        ctx.lineWidth = paddle.stroke;
        ctx.strokeStyle = paddle.strokeStyle;
        ctx.stroke();
        ctx.closePath();
    }

    function drawBall(xPos, yPos, radius) {
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = ball.fillStyle;
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius - 2, 0, Math.PI * 2);
        ctx.fill();
    }


    function draw() {
        ctx.clearRect(0, 0, canvas.WIDTH, canvas.HEIGHT);
        drawPaddle(paddle.x, paddle.y, paddle.height, paddle.width, paddle.radius);
        drawBall(ball.x, ball.y, ball.radius);
    }
    
    function startGame() {
        if (game.playing) return stopGame();

        // startBtn.innerText = "En cours...";
        game.playing = true;
        game.startTime = Date.now();

        startBtnContainer.classList.remove("visible");
        startBtnContainer.classList.add("hidden");

        cancelAnimationFrame(game.animationFrame);
        gameLoop();
    }

    function stopGame() {
        startBtn.innerText = "Recommencer";
        game.playing = false;
        paddle.x = paddle.startX;
        paddle.y = paddle.startY;
        ball.x = ball.startX;
        ball.y = ball.startY;
        draw();

        if (game.score > game.highestScore) {
            game.highestScore = game.score;
            scoreTab.innerText = `${game.highestScore.toFixed(2)}s`;
        }

        startBtnContainer.innerHTML = "Vous avez perdu !" + startBtnContainer.innerHTML;
        startBtnContainer.classList.remove("hidden");
        startBtnContainer.classList.add("visible");
    }

    function updateGame() {
        if (keys.left && (paddle.x - paddle.velocity) > 0) {
            paddle.x -= paddle.velocity;
        }
        if (keys.right && (paddle.x + paddle.velocity) <= (canvas.WIDTH - paddle.width)) {
            paddle.x += paddle.velocity;
        }

        ball.x -= Math.cos(ball.angle) * ball.velocity;
        ball.y -= Math.sin(ball.angle) * ball.velocity;

        if (ball.x <= 0 || ball.x + ball.width >= canvas.WIDTH) {
            ball.angle = Math.PI - ball.angle;
        }

        if (ball.y < 0) {
            ball.angle = -ball.angle;
        }

        if (ball.y >= paddle.y) {
            return stopGame();
        }

        if (ball.y + ball.height >= paddle.y && ball.x + ball.width >= paddle.x && ball.x <= paddle.x + paddle.width) {
            let newAngle = Math.PI - (Math.PI / 4) * ((ball.x + ball.width / 2) - (paddle.x + paddle.width / 2)) / (paddle.width / 2);

            let speedY = Math.sin(newAngle) * ball.velocity;

            if (Math.abs(speedY) < 5) {
                newAngle = Math.PI / 4;
            }

            ball.angle = newAngle;
            ball.velocity *= game.multiplier;
            paddle.velocity *= game.multiplier;
        }
    }

    function gameLoop() {
        if (game.playing) {
            game.score = (Date.now() - game.startTime) / 1000;
            score.innerText = `${(game.score).toFixed(2)}s`;
            updateGame();
            draw();
            game.animationFrame = requestAnimationFrame(gameLoop);
        } else {
            draw();
        }
    }


    draw();
    startBtn.addEventListener('click', startGame);
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") keys.left = true;
        if (e.key === "ArrowRight") keys.right = true;
    });
    document.addEventListener("keyup", e => {
        if (e.key === "ArrowLeft") keys.left = false;
        if (e.key === "ArrowRight") keys.right = false;
    });
    leftBtn.addEventListener("touchstart", () => keys.left = true);
    leftBtn.addEventListener("touchend", () => keys.left = false);
    rightBtn.addEventListener("touchstart", () => keys.right = true);
    rightBtn.addEventListener("touchend", () => keys.right = false);

    // strechModeBtn.addEventListener('click', () => { 
    //     canvasObj.style.height = "35vh"; 
    //     ball.velocity *= 1.5;
    // });

    // colorPicker.addEventListener("input", e => {
    //     paddle.fillStyle = e.target.value;
    //     ball.fillStyle = e.target.value;
    //     draw();
    // });
});