const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const audio = document.getElementById('backgroundAudio');

canvas.width = 600;
canvas.height = 400;

const coneWidth = 50;
const coneHeight = 70;
let coneX = canvas.width / 2 - coneWidth / 2;
const coneY = canvas.height - coneHeight - 10;
let score = 0;
let missed = 0;
const maxMisses = 3;
let gameInterval;
let iceCreamInterval;
let iceCreamSpeed = 2;
let iceCreamGenerationRate = 1000;

const iceCreams = [];
const iceCreamSize = 40; 

const iceCreamImg = new Image();
iceCreamImg.src = 'chocolate-ice-cream.png'; 

iceCreamImg.onload = function() {
    console.log('Ice cream image loaded successfully.');
};

iceCreamImg.onerror = function() {
    console.error('Failed to load ice cream image.');
};

const coneImg = new Image();
coneImg.src = 'cone.png';

coneImg.onload = function() {
    console.log('Cone image loaded successfully.');
};

coneImg.onerror = function() {
    console.error('Failed to load cone image.');
};

function drawCone() {
    ctx.drawImage(coneImg, coneX, coneY, coneWidth, coneHeight);
}

function drawIceCream(x, y) {
    ctx.drawImage(iceCreamImg, x - iceCreamSize / 2, y - iceCreamSize / 2, iceCreamSize, iceCreamSize);
}

function generateIceCream() {
    const x = Math.random() * (canvas.width - iceCreamSize);
    iceCreams.push({ x: x, y: -iceCreamSize });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCone();

    iceCreams.forEach((iceCream, index) => {
        iceCream.y += iceCreamSpeed;
        drawIceCream(iceCream.x, iceCream.y);

        if (
            iceCream.y + iceCreamSize > coneY &&
            iceCream.x > coneX &&
            iceCream.x < coneX + coneWidth
        ) {
            iceCreams.splice(index, 1);
            score++;
            if (score % 5 === 0) {
                increaseSpeed(); 
                clearInterval(iceCreamInterval);
                iceCreamGenerationRate = Math.max(300, iceCreamGenerationRate - 100);
                iceCreamInterval = setInterval(generateIceCream, iceCreamGenerationRate);
            }
        } else if (iceCream.y > canvas.height) {
            iceCreams.splice(index, 1);
            missed++;
        }
    });

    ctx.fillStyle = '#000';
    ctx.font = '24px "Quicksand", sans-serif';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Missed: ' + missed, 10, 60);

    if (missed < maxMisses) {
        gameInterval = requestAnimationFrame(draw);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
        clearInterval(iceCreamInterval);
        startButton.textContent = "Restart Game";
        startButton.style.display = "block";

        if (score >= 30) {
            const code = Math.floor(100000 + Math.random() * 900000);
            setTimeout(() => {
                alert(`Congratulations! Show this code ${code} to our staff at any of our stores islandwide to get a free scoop of Udders ice cream!`);
            }, 1000);
        }
    }
}

function startGame() {
    score = 0;
    missed = 0;
    iceCreams.length = 0;
    iceCreamSpeed = 2;
    iceCreamGenerationRate = 1000;
    startButton.style.display = "none";

    generateIceCream();
    draw(); 
    iceCreamInterval = setInterval(generateIceCream, iceCreamGenerationRate);

    setInterval(() => {
        increaseSpeed();
    }, 10000);
}

function increaseSpeed() {
    iceCreamSpeed += 0.5;
}

document.addEventListener('mousemove', (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    coneX = event.clientX - canvasRect.left - coneWidth / 2;
});

startButton.addEventListener('click', () => {
    cancelAnimationFrame(gameInterval);
    clearInterval(iceCreamInterval);
    audio.play();
    startGame();
});

pauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        pauseButton.textContent = "Pause Music";
    } else {
        audio.pause();
        pauseButton.textContent = "Play Music";
    }
});
