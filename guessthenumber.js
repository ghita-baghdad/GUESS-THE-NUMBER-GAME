function randomColor() {
    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);
    return { r, g, b }
}

function toRad(deg) {
    return deg * (Math.PI / 180.0);
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const width = document.getElementById("canvas").width
const height = document.getElementById("canvas").height

const centerX = width / 2
const centerY = height / 2
const radius = width / 2

let items = document.getElementById("numberList").value.split("\n");

let currentDeg = 0
let step = 360 / items.length
let colors = []
let itemDegs = {}

for (let i = 0; i < items.length + 1; i++) {
    colors.push(randomColor())
}

function createWheel() {
    items = document.getElementById("numberList").value.split("\n");
    step = 360 / items.length
    colors = []
    for (let i = 0; i < items.length + 1; i++) {
        colors.push(randomColor())
    }
    draw()
}
draw()
   // Confetti effect function
   let confettiCanvas;

// Function to start the confetti effect
function startConfetti() {
// Remove the existing canvas if it exists
if (confettiCanvas) {
confettiCanvas.remove();
}

// Create a new canvas
confettiCanvas = document.createElement("canvas");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
document.body.appendChild(confettiCanvas);

// Configure confetti
const duration = 10 * 1000;
const animationEnd = Date.now() + duration;
const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
return Math.random() * (max - min) + min;
}

const interval = setInterval(() => {
const timeLeft = animationEnd - Date.now();

if (timeLeft <= 0) {
    clearInterval(interval);
    if (confettiCanvas) {
        confettiCanvas.remove(); // Remove canvas when confetti is finished
    }
    return;
}

const particleCount = 50 * (timeLeft / duration);
// since particles fall down, start a bit higher than random
confetti(
    Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    }),
    confettiCanvas
);
}, 250);
}
function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(${33},${33},${33})`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    let startDeg = currentDeg;
    for (let i = 0; i < items.length; i++, startDeg += step) {
        let endDeg = startDeg + step;

        const color = colors[i];
        const colorStyle = `rgb(${color.r},${color.g},${color.b})`;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        const colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
        ctx.fillStyle = colorStyle2;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";
        ctx.fillStyle = color.r > 150 || color.g > 150 || color.b > 150 ? "#000" : "#fff";
        ctx.font = 'bold 24px serif';
        ctx.fillText(items[i], 130, 10);
        ctx.restore();

        itemDegs[items[i]] = {
            "startDeg": startDeg,
            "endDeg": endDeg
        };

        if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
            const winningNumber = parseInt(document.getElementById("winningNumber").value);
            if (winningNumber === parseInt(items[i])) {
                document.getElementById("winner").innerHTML = "Congratulations!";
            } else {
                document.getElementById("winner").innerHTML = "You Lost!";
            }
        }
    }
}

let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

function animate() {
    if (pause) {
        return;
    }
    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true;
        displayResult();
    }
    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

function hideMessageBox() {
    document.getElementById("messageBox").style.display = "none";
}

function displayResult() {
    const winner = document.getElementById("winner").innerHTML;
    if (winner === "Congratulations!") {
        document.getElementById("backgroundSound").pause();
        document.getElementById("correctSound").play();
        startConfetti();
        document.getElementById("messageText").innerText = "You won! :)";
        document.getElementById("messageBox").style.display = "block";
    } else if (winner === "You Lost!") {
        document.getElementById("backgroundSound").pause();
        document.getElementById("wrongSound").play();
        document.getElementById("messageText").innerText = "Maybe next time :(";
        document.getElementById("messageBox").style.display = "block";
    }

    setTimeout(() => {
        document.getElementById("winner").innerHTML = "A FUN AND EXCITING CHALLENGE!";
        if (document.getElementById("backgroundSound").paused) {
            document.getElementById("backgroundSound").play();
        }
        hideMessageBox();
    }, 3000);
}

function stopConfetti() {
    clearInterval(confettiInterval);
}

function spin() {
    if (speed !== 0) {
        hideMessageBox();
        stopConfetti();
        return;
    }

    maxRotation = 0;
    currentDeg = 0;
    createWheel();
    draw();

    const randomStart = Math.floor(Math.random() * items.length);
    const startItem = items[randomStart];
    maxRotation = (360 * 6) - itemDegs[startItem].endDeg + 10;
    itemDegs = {};
    pause = false;
    window.requestAnimationFrame(animate);

    // Start the background sound when spinning
    document.getElementById("backgroundSound").play();
}

document.addEventListener("DOMContentLoaded", function () {
    // Hide the textarea
    document.getElementById("numberList").style.display = "none";
});