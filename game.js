const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startHighScoreElement = document.getElementById('start-high-score');
const gameOverHighScoreElement = document.getElementById('game-over-high-score');
const finalScoreElement = document.getElementById('final-score');

// Mobile Controls
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

// Character definitions
const characters = {
    vinny: {
        name: 'Vinny',
        suitColor: '#2c3e50',
        tieColor: '#c0392b',
        skinColor: '#f1c27d',
        hairColor: '#4a3728',
        hairStyle: 'slick'
    },
    charlie: {
        name: 'Charlie',
        suitColor: '#c0392b',
        tieColor: '#f39c12',
        skinColor: '#fce4d6',
        hairColor: '#e25822',
        hairStyle: 'long',
        gender: 'female'
    },
    daryll: {
        name: 'Daryll',
        suitColor: '#1a5276',
        tieColor: '#e74c3c',
        skinColor: '#f0c987',
        hairColor: '#1a1a1a',
        hairStyle: 'short',
        gender: 'male'
    }
};

let selectedCharacter = 'vinny';

// Character selection
const charCards = document.querySelectorAll('.char-card');
charCards.forEach(card => {
    card.addEventListener('click', () => {
        charCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCharacter = card.dataset.char;
    });
});

// Draw character on a given canvas context
function drawCharacter(c, x, y, w, h) {
    const char = characters[selectedCharacter] || characters.vinny;
    drawCharacterWithConfig(c, x, y, w, h, char);
}

function drawCharacterWithConfig(c, x, y, w, h, char) {
    // Suit body
    c.fillStyle = char.suitColor;
    c.beginPath();
    c.roundRect(x + 5, y + 18, w - 10, h - 18, 5);
    c.fill();

    if (char.gender === 'female') {
        // Blouse neckline
        c.fillStyle = '#ecf0f1';
        c.beginPath();
        c.moveTo(x + w / 2 - 8, y + 18);
        c.lineTo(x + w / 2 + 8, y + 18);
        c.lineTo(x + w / 2, y + 26);
        c.fill();

        // Necklace dot
        c.fillStyle = char.tieColor;
        c.beginPath();
        c.arc(x + w / 2, y + 23, 2.5, 0, Math.PI * 2);
        c.fill();
    } else {
        // Shirt collar
        c.fillStyle = '#ecf0f1';
        c.beginPath();
        c.moveTo(x + w / 2 - 6, y + 18);
        c.lineTo(x + w / 2 + 6, y + 18);
        c.lineTo(x + w / 2 + 3, y + 26);
        c.lineTo(x + w / 2 - 3, y + 26);
        c.fill();

        // Tie
        c.fillStyle = char.tieColor;
        c.beginPath();
        c.moveTo(x + w / 2, y + 18);
        c.lineTo(x + w / 2 + 4, y + 32);
        c.lineTo(x + w / 2, y + 38);
        c.lineTo(x + w / 2 - 4, y + 32);
        c.fill();
    }

    // Head
    c.fillStyle = char.skinColor;
    c.beginPath();
    c.arc(x + w / 2, y + 12, 12, 0, Math.PI * 2);
    c.fill();

    // Eyes
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(x + w / 2 - 4, y + 10, 3, 0, Math.PI * 2);
    c.arc(x + w / 2 + 4, y + 10, 3, 0, Math.PI * 2);
    c.fill();

    if (char.hairStyle === 'short') {
        // Daryll: narrower dark eyes
        c.fillStyle = '#1a1a1a';
        c.beginPath();
        c.ellipse(x + w / 2 - 4, y + 10, 1.8, 1.2, 0, 0, Math.PI * 2);
        c.ellipse(x + w / 2 + 4, y + 10, 1.8, 1.2, 0, 0, Math.PI * 2);
        c.fill();
    } else {
        c.fillStyle = '#2c3e50';
        c.beginPath();
        c.arc(x + w / 2 - 4, y + 10, 1.5, 0, Math.PI * 2);
        c.arc(x + w / 2 + 4, y + 10, 1.5, 0, Math.PI * 2);
        c.fill();
    }

    if (char.gender === 'female') {
        // Eyelashes
        c.strokeStyle = char.hairColor;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(x + w / 2 - 7, y + 8);
        c.lineTo(x + w / 2 - 6, y + 7);
        c.moveTo(x + w / 2 + 7, y + 8);
        c.lineTo(x + w / 2 + 6, y + 7);
        c.stroke();

        // Lips
        c.fillStyle = '#e74c3c';
        c.beginPath();
        c.ellipse(x + w / 2, y + 16, 3, 1.5, 0, 0, Math.PI * 2);
        c.fill();
    } else {
        // Mouth
        c.strokeStyle = '#2c3e50';
        c.lineWidth = 1;
        c.beginPath();
        c.arc(x + w / 2, y + 16, 3, 0.1 * Math.PI, 0.9 * Math.PI);
        c.stroke();
    }

    // Hair
    c.fillStyle = char.hairColor;
    if (char.hairStyle === 'slick') {
        // Vinny: slicked-back dark hair
        c.beginPath();
        c.ellipse(x + w / 2, y + 3, 13, 6, 0, Math.PI, 0);
        c.fill();
        c.beginPath();
        c.ellipse(x + w / 2 + 8, y + 5, 5, 8, 0.3, Math.PI * 1.2, Math.PI * 0.2);
        c.fill();
    } else if (char.hairStyle === 'long') {
        // Charlie: long flowing ginger hair
        c.beginPath();
        c.ellipse(x + w / 2, y + 2, 14, 7, 0, Math.PI, 0);
        c.fill();
        // Side hair flowing down
        c.beginPath();
        c.roundRect(x + w / 2 - 15, y + 2, 6, 20, [3, 3, 3, 3]);
        c.fill();
        c.beginPath();
        c.roundRect(x + w / 2 + 9, y + 2, 6, 20, [3, 3, 3, 3]);
        c.fill();
        // Top volume
        c.beginPath();
        c.ellipse(x + w / 2 - 6, y + 1, 6, 5, -0.2, Math.PI, 0);
        c.fill();
        c.beginPath();
        c.ellipse(x + w / 2 + 6, y + 1, 6, 5, 0.2, Math.PI, 0);
        c.fill();
    } else if (char.hairStyle === 'short') {
        // Daryll: short neat black hair
        c.beginPath();
        c.ellipse(x + w / 2, y + 3, 13, 7, 0, Math.PI, 0);
        c.fill();
        c.beginPath();
        c.rect(x + w / 2 - 12, y + 3, 24, 3);
        c.fill();
    }
}

// Draw previews on the start screen
function drawCharacterPreviews() {
    Object.keys(characters).forEach(key => {
        const previewCanvas = document.getElementById('preview-' + key);
        if (!previewCanvas) return;
        const pc = previewCanvas.getContext('2d');
        pc.clearRect(0, 0, 60, 70);
        drawCharacterWithConfig(pc, 10, 5, 40, 55, characters[key]);
    });
}

// Game State
let animationId;
let lastTime = 0;
let score = 0;
let lives = 3;
let level = 1;
let isPlaying = false;
let timeSinceLastLevelUp = 0;
let timeSinceLastSpawn = 0;

// Difficulty Settings
let spawnRate = 1500;
let fallSpeedMultiplier = 1;

// Player
const player = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 350,
    dx: 0
};

// Items
const items = [];
const itemTypes = [
    { type: 'good', label: '3C', points: 3, color: '#f1c40f', shape: 'circle', outline: '#d4ac0d' },
    { type: 'good', label: 'Quote', points: 10, color: '#ffffff', shape: 'rect', outline: '#bdc3c7' },
    { type: 'good', label: 'Banknote', points: 25, color: '#2ecc71', shape: 'rect', outline: '#27ae60' },
    { type: 'bad', label: 'Meeting', color: '#e74c3c', shape: 'rect', outline: '#c0392b' },
    { type: 'bad', label: 'Spam', color: '#e74c3c', shape: 'rect', outline: '#c0392b' },
    { type: 'bad', label: 'No-show', color: '#e74c3c', shape: 'rect', outline: '#c0392b' },
    { type: 'bad', label: 'Admin', color: '#e74c3c', shape: 'rect', outline: '#c0392b' }
];

// Input tracking
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

// Resize Canvas
function resizeCanvas() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    if (player.y === 0 || player.y > canvas.height) {
        player.y = canvas.height - player.height - 20;
        if (window.innerWidth < 600) {
            player.y -= 80;
        }
        player.x = canvas.width / 2 - player.width / 2;
    }
}

window.addEventListener('resize', resizeCanvas);

// High Score Management
function getHighScore() {
    return parseInt(localStorage.getItem('salesCoinHighScore')) || 0;
}

function setHighScore(newScore) {
    const currentHigh = getHighScore();
    if (newScore > currentHigh) {
        localStorage.setItem('salesCoinHighScore', newScore);
        return newScore;
    }
    return currentHigh;
}

function updateHighScoreDisplays() {
    const high = getHighScore();
    startHighScoreElement.textContent = high;
    gameOverHighScoreElement.textContent = high;
}

// Input Event Listeners
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Mobile button listeners
function addTouchListeners(element, key) {
    element.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; }, {passive: false});
    element.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; }, {passive: false});
    element.addEventListener('mousedown', (e) => { e.preventDefault(); keys[key] = true; });
    element.addEventListener('mouseup', (e) => { e.preventDefault(); keys[key] = false; });
    element.addEventListener('mouseleave', (e) => { e.preventDefault(); keys[key] = false; });
}

addTouchListeners(btnLeft, 'ArrowLeft');
addTouchListeners(btnRight, 'ArrowRight');

// Touch Dragging
let isDragging = false;
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    updatePlayerPositionFromTouch(e.touches[0].clientX);
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        e.preventDefault();
        updatePlayerPositionFromTouch(e.touches[0].clientX);
    }
}, {passive: false});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

function updatePlayerPositionFromTouch(touchX) {
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const relativeX = touchX - containerRect.left;
    player.x = relativeX - player.width / 2;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Game Loop
function startGame() {
    resizeCanvas();
    score = 0;
    lives = 3;
    level = 1;
    items.length = 0;
    spawnRate = 1500;
    fallSpeedMultiplier = 1;
    timeSinceLastLevelUp = 0;
    timeSinceLastSpawn = 0;
    lastTime = performance.now();
    isPlaying = true;

    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 20;
    if (window.innerWidth < 600) {
        player.y -= 80;
    }

    updateUI();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
    isPlaying = false;

    const highScore = setHighScore(score);
    finalScoreElement.textContent = score;
    gameOverHighScoreElement.textContent = highScore;

    gameOverScreen.classList.remove('hidden');
}

function updateUI() {
    scoreElement.textContent = score;
    levelElement.textContent = level;

    let hearts = '';
    for (let i = 0; i < lives; i++) {
        hearts += '❤️';
    }
    livesElement.textContent = hearts || '💔';
}

function spawnItem() {
    const template = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const size = 50;

    items.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: (120 + Math.random() * 80) * fallSpeedMultiplier,
        ...template,
        caught: false,
        catchAnimationTimer: 0
    });
}

function update(dt) {
    if (!isDragging) {
        if (keys.ArrowLeft) {
            player.x -= player.speed * (dt / 1000);
        }
        if (keys.ArrowRight) {
            player.x += player.speed * (dt / 1000);
        }

        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }

    timeSinceLastSpawn += dt;
    if (timeSinceLastSpawn > spawnRate) {
        spawnItem();
        timeSinceLastSpawn = 0;
    }

    timeSinceLastLevelUp += dt;
    if (timeSinceLastLevelUp > 20000) {
        level++;
        fallSpeedMultiplier += 0.2;
        spawnRate = Math.max(500, spawnRate - 150);
        timeSinceLastLevelUp = 0;
        updateUI();
    }

    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];

        if (item.caught) {
            item.catchAnimationTimer += dt;
            if (item.catchAnimationTimer > 300) {
                items.splice(i, 1);
            }
            continue;
        }

        item.y += item.speed * (dt / 1000);

        if (
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y
        ) {
            item.caught = true;

            if (item.type === 'good') {
                score += item.points;
            } else {
                lives--;
                if (lives <= 0) {
                    endGame();
                    updateUI();
                    return;
                }
            }
            updateUI();
        } else if (item.y > canvas.height) {
            items.splice(i, 1);
        }
    }
}

// roundRect polyfill
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        if (typeof radius === 'undefined') radius = 5;
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else if (Array.isArray(radius)) {
            radius = {tl: radius[0] || 0, tr: radius[1] || 0, br: radius[2] || 0, bl: radius[3] || 0};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        this.beginPath();
        this.moveTo(x + radius.tl, y);
        this.lineTo(x + width - radius.tr, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        this.lineTo(x + width, y + height - radius.br);
        this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        this.lineTo(x + radius.bl, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        this.lineTo(x, y + radius.tl);
        this.quadraticCurveTo(x, y, x + radius.tl, y);
        this.closePath();
        return this;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player using the selected character
    drawCharacter(ctx, player.x, player.y, player.width, player.height);

    // Draw Items
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const item of items) {
        ctx.save();

        let drawX = item.x;
        let drawY = item.y;
        let drawWidth = item.width;
        let drawHeight = item.height;
        let alpha = 1;

        if (item.caught) {
            const progress = item.catchAnimationTimer / 300;
            drawY -= progress * 30;
            alpha = 1 - progress;
            drawWidth *= 1.2;
            drawHeight *= 1.2;
            drawX -= (drawWidth - item.width) / 2;
        }

        ctx.globalAlpha = alpha;

        if (item.shape === 'circle') {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(drawX + drawWidth / 2, drawY + drawHeight / 2, drawWidth / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = item.outline;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(item.label, drawX + drawWidth / 2, drawY + drawHeight / 2);
        } else {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 4);
            ctx.fill();

            ctx.strokeStyle = item.outline;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = item.type === 'bad' ? 'white' : '#2c3e50';
            if (item.label === 'Banknote') {
                ctx.font = 'bold 28px Arial';
                ctx.fillStyle = 'white';
                ctx.fillText('€', drawX + drawWidth / 2, drawY + drawHeight / 2);
            } else {
                ctx.font = 'bold 12px Arial';
                ctx.fillText(item.label, drawX + drawWidth / 2, drawY + drawHeight / 2);
            }
        }

        if (item.caught && item.type === 'good') {
            ctx.fillStyle = '#2ecc71';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('+' + item.points, drawX + drawWidth / 2, drawY - 15);
        } else if (item.caught && item.type === 'bad') {
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('-1 Life', drawX + drawWidth / 2, drawY - 15);
        }

        ctx.restore();
    }
}

function gameLoop(timestamp) {
    if (!isPlaying) return;

    let dt = timestamp - lastTime;
    if (dt > 100) dt = 16;
    lastTime = timestamp;

    update(dt);
    draw();

    if (isPlaying) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Initialization
const changeCharBtn = document.getElementById('change-char-btn');

function goToCharacterSelect() {
    isPlaying = false;
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    drawCharacterPreviews();
    updateHighScoreDisplays();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
changeCharBtn.addEventListener('click', goToCharacterSelect);

updateHighScoreDisplays();
resizeCanvas();
drawCharacterPreviews();
