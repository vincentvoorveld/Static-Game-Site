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
let spawnRate = 1500; // ms
let fallSpeedMultiplier = 1;

// Player
const player = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 350, // pixels per second
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
    
    // Maintain player inside canvas if resized
    if (player.y === 0 || player.y > canvas.height) {
        player.y = canvas.height - player.height - 20; // 20px padding from bottom
        if (window.innerWidth < 600) {
            player.y -= 80; // Make room for mobile controls
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

// Touch Dragging (Alternative Mobile Control)
let isDragging = false;
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    updatePlayerPositionFromTouch(e.touches[0].clientX);
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        e.preventDefault(); // Prevent scrolling
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
    
    // Clamp to screen
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
    // Movement from keys
    if (!isDragging) {
        if (keys.ArrowLeft) {
            player.x -= player.speed * (dt / 1000);
        }
        if (keys.ArrowRight) {
            player.x += player.speed * (dt / 1000);
        }
        
        // Clamp to screen
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }
    
    // Spawning
    timeSinceLastSpawn += dt;
    if (timeSinceLastSpawn > spawnRate) {
        spawnItem();
        timeSinceLastSpawn = 0;
    }
    
    // Level up every 20 seconds
    timeSinceLastLevelUp += dt;
    if (timeSinceLastLevelUp > 20000) {
        level++;
        fallSpeedMultiplier += 0.2;
        spawnRate = Math.max(500, spawnRate - 150); // Faster spawning, cap at 500ms
        timeSinceLastLevelUp = 0;
        updateUI();
    }
    
    // Update Items
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
        
        // Collision detection
        if (
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y
        ) {
            // Collision!
            item.caught = true;
            
            if (item.type === 'good') {
                score += item.points;
            } else {
                lives--;
                if (lives <= 0) {
                    endGame();
                    updateUI();
                    return; // Stop updating if game over
                }
            }
            updateUI();
        } else if (item.y > canvas.height) {
            // Missed
            items.splice(i, 1);
        }
    }
}

// Add roundRect for older browsers if it doesn't exist
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
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
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Player (Salesperson icon)
    ctx.fillStyle = '#3498db'; // Suit body
    ctx.beginPath();
    ctx.roundRect(player.x + 5, player.y + 15, player.width - 10, player.height - 15, 5);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#f1c27d'; // Skin tone
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + 10, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Tie
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y + 15);
    ctx.lineTo(player.x + player.width / 2 + 4, player.y + 30);
    ctx.lineTo(player.x + player.width / 2, player.y + 35);
    ctx.lineTo(player.x + player.width / 2 - 4, player.y + 30);
    ctx.fill();
    
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
            // Catch animation: float up and fade out
            const progress = item.catchAnimationTimer / 300;
            drawY -= progress * 30;
            alpha = 1 - progress;
            drawWidth *= 1.2; // Slight pop
            drawHeight *= 1.2;
            drawX -= (drawWidth - item.width) / 2; // Keep centered
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
        
        // Value popup for caught items
        if (item.caught && item.type === 'good') {
            ctx.fillStyle = '#2ecc71';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`+${item.points}`, drawX + drawWidth / 2, drawY - 15);
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
    
    // Cap dt to prevent huge jumps if tab was inactive
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
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Initialize high scores on load
updateHighScoreDisplays();
resizeCanvas(); // Initial setup of sizes
