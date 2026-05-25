// Confetti Animation
class ConfettiPiece {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 5 + 5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.colors = ['#FF6B9D', '#FFC75F', '#845EC2', '#00C9A7', '#FF9671', '#F39237'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1; // Gravity
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

let confetti = [];
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        confetti.push(new ConfettiPiece(canvas));
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confetti.length - 1; i >= 0; i--) {
        confetti[i].update();
        confetti[i].draw(ctx);

        if (confetti[i].y > canvas.height) {
            confetti.splice(i, 1);
        }
    }

    if (confetti.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// Button Event Listeners
document.getElementById('playMusicBtn').addEventListener('click', () => {
    playBirthdaySong();
});

document.getElementById('confettiBtn').addEventListener('click', () => {
    triggerConfetti();
});

document.getElementById('surpriseBtn').addEventListener('click', () => {
    showSurprise();
});

document.getElementById('closeSurpriseBtn').addEventListener('click', () => {
    hideSurprise();
});

// Play Birthday Song
function playBirthdaySong() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [
        { freq: 261.63, duration: 0.5 },  // C
        { freq: 261.63, duration: 0.5 },  // C
        { freq: 293.66, duration: 1 },    // D
        { freq: 261.63, duration: 1 },    // C
        { freq: 349.23, duration: 1 },    // F
        { freq: 329.63, duration: 2 },    // E
    ];

    let currentTime = audioContext.currentTime;

    notes.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = note.freq;
        gainNode.gain.setValueAtTime(0.3, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);

        currentTime += note.duration;
    });

    triggerConfetti();
}

// Trigger Confetti
function triggerConfetti() {
    createConfetti();
    animateConfetti();
}

// Show Surprise
function showSurprise() {
    const surpriseBox = document.getElementById('surpriseBox');
    surpriseBox.classList.add('show');
    triggerConfetti();
}

// Hide Surprise
function hideSurprise() {
    const surpriseBox = document.getElementById('surpriseBox');
    surpriseBox.classList.remove('show');
}

// Keyboard Shortcuts
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    // Spacebar for confetti
    if (e.code === 'Space') {
        e.preventDefault();
        triggerConfetti();
    }

    // Konami code for Easter Egg
    konamiCode.push(e.key.toLowerCase() === e.key && e.key !== ' ' ? e.key : e.key);
    konamiCode = konamiCode.slice(-10);

    const lastTenKeys = Array.from(konamiCode).map(key => {
        if (key === 'ArrowUp') return 'ArrowUp';
        if (key === 'ArrowDown') return 'ArrowDown';
        if (key === 'ArrowLeft') return 'ArrowLeft';
        if (key === 'ArrowRight') return 'ArrowRight';
        return key.toLowerCase();
    });

    if (lastTenKeys.join(',') === konamiSequence.join(',')) {
        showSurprise();
        konamiCode = [];
    }
});

// Auto-play Easter Egg on load (optional)
window.addEventListener('load', () => {
    console.log('🎉 Happy Birthday Arfeen Jahan! 🎉');
    console.log('💡 Press SPACEBAR for confetti or use arrow keys ↑↑↓↓←→←→ + BA for Easter Egg!');
});