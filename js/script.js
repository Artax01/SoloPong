document.addEventListener('DOMContentLoaded', function() {
   
    // elements
    const canvasObj = document.getElementById('canvas');
    const ctx = canvasObj.getContext("2d");
    const startBtn = document.getElementById('startBtn');

    const canvas = {
        HEIGHT: canvasObj.height,
        WIDTH: canvasObj.width
    }

    const paddle = {
        x: canvas.WIDTH / 2 - 85 / 2,
        y: canvas.HEIGHT - 20,
        height: 10,
        width: 85,
        radius: 5,
        velocity: 7
    }

    const ball = {
        x: canvas.WIDTH / 2,
        y: canvas.HEIGHT - 20 - paddle.height,
        height: 10,
        width: 10,
        radius: 5,
        velocity: 5,
        multiplier: 1
    }

    const keys = {
        left: false,
        right: false
    }

    const game = {
        playing: false,
        score: 0,
        highestScore: 0,
        startTime: null,
        animationFrame: null
    }


    function drawPaddle(xPos, yPos, height, width, radius) {
        ctx.beginPath();
        ctx.moveTo(xPos + radius, yPos);
        ctx.lineTo(xPos + width - radius, yPos);
        ctx.quadraticCurveTo(xPos + width, yPos, xPos + width, yPos + radius);
        ctx.lineTo(xPos + width, yPos + height - radius);
        ctx.quadraticCurveTo(xPos + width, yPos + height, xPos + width - radius, yPos + height);
        ctx.lineTo(xPos + radius, yPos + height);
        ctx.quadraticCurveTo(xPos, yPos + height, xPos, yPos + height - radius);
        ctx.lineTo(xPos, yPos + radius);
        ctx.quadraticCurveTo(xPos, yPos, xPos + radius, yPos);
        ctx.closePath();

        // Remplissage en blanc
        ctx.fillStyle = "#FFF";
        ctx.fill();

        // Bordure en noir
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }

    function drawBall(xPos, yPos, height, width, radius) {
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius - 2, 0, Math.PI * 2);
        ctx.fill();
    }


    function draw() {
        ctx.clearRect(0, 0, canvas.WIDTH, canvas.HEIGHT);
        drawPaddle(paddle.x, paddle.y, paddle.height, paddle.width, paddle.radius);
        drawBall(ball.x, ball.y, ball.height, ball.width, ball.radius);
    }
    
    // functions
    function startGame() {
        if (game.playing) return stopGame();

        startBtn.innerText = "En cours...";
        game.playing = true;
        game.startTime = Date.now();

        cancelAnimationFrame(game.animationFrame);
        loop();
    }

    function stopGame() {
        startBtn.innerText = "Recommencer";
        game.playing = false;
        paddle.x = canvas.WIDTH / 2 - paddle.width / 2;
        draw();
    }

    function updateGame() {
        if (keys.left && (paddle.x - paddle.velocity) > 0) {
            paddle.x -= paddle.velocity;
        }
        if (keys.right && (paddle.x + paddle.velocity) <= (canvas.WIDTH - paddle.width)) {
            paddle.x += paddle.velocity;
        }

        if (ball.y > paddle.y) {
            return stopGame();
        }
    }

    function loop() {
        if (game.playing) {
            updateGame();
            draw();
            game.animationFrame = requestAnimationFrame(loop);
        } else {
            // dessiner l'état final si perdu
            draw();
        }
    }


    // listeners
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
});