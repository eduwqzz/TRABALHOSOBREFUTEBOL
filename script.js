const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 150, y: 250, width: 30, height: 50, speed: 5 };
let ball = { x: 400, y: 250, radius: 12, vx: 0, vy: 0 };
let cpu = { x: 650, y: 250, width: 30, height: 80, speed: 4 };

let playerScore = 0;
let cpuScore = 0;
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawField() {
    // Gramado
    ctx.fillStyle = "#0b6623";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Linhas brancas
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Meio campo
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 20);
    ctx.lineTo(canvas.width/2, canvas.height - 20);
    ctx.stroke();
    
    // Círculo central
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 80, 0, Math.PI * 2);
    ctx.stroke();
    
    // Área do gol
    ctx.strokeRect(20, 170, 100, 160);           // Gol esquerdo
    ctx.strokeRect(canvas.width - 120, 170, 100, 160); // Gol direito
}

function drawPlayer() {
    ctx.fillStyle = "#00aaff";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Cabeça
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 10, 10, 0, Math.PI * 2);
    ctx.fill();
}

function drawCPU() {
    ctx.fillStyle = "#ff2222";
    ctx.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);
    ctx.beginPath();
    ctx.arc(cpu.x + 15, cpu.y + 15, 12, 0, Math.PI * 2);
    ctx.fill();
}

function drawBall() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Detalhes da bola
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.stroke();
}

function update() {
    // Movimento do jogador
    if (keys["ArrowUp"] && player.y > 30) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y < canvas.height - player.height - 30) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > 30) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width/2 - player.width - 20) player.x += player.speed;

    // Chute
    if (keys[" "] && Math.hypot(ball.x - (player.x + 15), ball.y - (player.y + 25)) < 40) {
        ball.vx = 12;
        ball.vy = (ball.y - (player.y + 25)) * 0.3;
        keys[" "] = false;
    }

    // Movimento da bola
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= 0.98;
    ball.vy *= 0.98;

    // Colisão com paredes
    if (ball.y - ball.radius < 30 || ball.y + ball.radius > canvas.height - 30) {
        ball.vy *= -1;
    }

    // Gol do jogador
    if (ball.x < 40 && ball.y > 180 && ball.y < 320) {
        playerScore++;
        document.getElementById("player-score").textContent = playerScore;
        resetBall();
    }
    // Gol do CPU
    if (ball.x > canvas.width - 40 && ball.y > 180 && ball.y < 320) {
        cpuScore++;
        document.getElementById("cpu-score").textContent = cpuScore;
        resetBall();
    }

    // Movimento simples do goleiro CPU
    if (ball.x > canvas.width / 2) {
        if (cpu.y + 40 < ball.y) cpu.y += cpu.speed;
        if (cpu.y + 40 > ball.y) cpu.y -= cpu.speed;
    }

    // Colisão jogador x bola
    const dx = ball.x - (player.x + 15);
    const dy = ball.y - (player.y + 25);
    if (Math.hypot(dx, dy) < ball.radius + 25) {
        ball.vx = 8;
        ball.vy = dy * 0.4;
    }

    // Colisão CPU x bola
    const dx2 = ball.x - (cpu.x + 15);
    const dy2 = ball.y - (cpu.y + 40);
    if (Math.hypot(dx2, dy2) < ball.radius + 30 && ball.vx > 0) {
        ball.vx *= -1.1;
    }
}

function resetBall() {
    ball.x = 400;
    ball.y = 250;
    ball.vx = 0;
    ball.vy = 0;
}

function gameLoop() {
    drawField();
    drawPlayer();
    drawCPU();
    drawBall();
    update();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    playerScore = 0;
    cpuScore = 0;
    document.getElementById("player-score").textContent = 0;
    document.getElementById("cpu-score").textContent = 0;
    resetBall();
    player.x = 150;
    player.y = 250;
}

gameLoop();
