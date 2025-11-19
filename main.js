// Game State
const state = {
    bounty: 0,
    unlockedLevels: [1], // Level 1 is unlocked by default
    currentLevel: null
};

// DOM Elements
const app = document.getElementById('app');
const contentArea = document.getElementById('game-content');
const scoreDisplay = document.getElementById('score-display');

// Initialization
function init() {
    console.log("Initializing Wano English Game...");
    loadState();
    renderMainMenu();
}

// State Management
function loadState() {
    try {
        const saved = localStorage.getItem('wano-english-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            state.bounty = parsed.bounty || 0;
            state.unlockedLevels = parsed.unlockedLevels || [1];
        }
    } catch (e) {
        console.warn("Could not load state:", e);
    }
    updateScoreUI();
}

function saveState() {
    try {
        localStorage.setItem('wano-english-state', JSON.stringify(state));
    } catch (e) {
        console.warn("Could not save state:", e);
    }
}

function updateScoreUI() {
    if (scoreDisplay) scoreDisplay.textContent = state.bounty.toLocaleString();
}

// Navigation
function renderMainMenu() {
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="w-full max-w-xs flex flex-col gap-4 animate-fade-in">
            <h2 class="text-center text-wano-pink font-shojumaru text-2xl mb-6 text-shadow-black">Select Your Path</h2>
            ${[1, 2, 3, 4, 5].map(level => {
        const isUnlocked = state.unlockedLevels.includes(level);
        const titles = [
            "The Conversation Dojo",
            "The Structure Scroll",
            "Pronoun Palace",
            "The 'To Be' Shrine",
            "The 'To Play' Arena"
        ];
        return `
                    <button 
                        onclick="window.startGame(${level})"
                        class="relative w-full p-4 border-2 ${isUnlocked ? 'border-wano-gold bg-wano-red hover:bg-red-900' : 'border-gray-600 bg-gray-800 cursor-not-allowed'} 
                        text-white font-ruslan transition-all duration-300 transform hover:scale-105 group overflow-hidden"
                        ${!isUnlocked ? 'disabled' : ''}
                    >
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <div class="relative z-10 flex justify-between items-center">
                            <span class="text-lg">${level}. ${titles[level - 1]}</span>
                            ${!isUnlocked ? '🔒' : '⚔️'}
                        </div>
                    </button>
                `;
    }).join('')}
        </div>
    `;
}

// Global Scope for HTML access
window.startGame = (levelId) => {
    console.log(`Starting Level ${levelId}`);

    // Show loading state (briefly)
    contentArea.innerHTML = `
        <div class="text-center animate-pulse">
            <p class="text-wano-pink font-shojumaru text-xl mb-4">Traveling...</p>
        </div>
    `;

    try {
        // Access level from global object
        const level = window.WanoLevels[`level${levelId}`];

        if (!level) {
            throw new Error(`Level ${levelId} not found in WanoLevels`);
        }

        state.currentLevel = levelId;

        // Render level
        level.render(
            contentArea,
            (finalScore) => {
                // On Complete
                completeLevel(levelId, finalScore);
            },
            (points) => {
                // On Score Update
                state.bounty += points;
                updateScoreUI();
                saveState();
            }
        );
    } catch (error) {
        console.error("Failed to load level:", error);
        contentArea.innerHTML = `
            <div class="text-center text-red-500">
                <p>Failed to load level scroll.</p>
                <p class="text-xs">${error.message}</p>
                <button onclick="renderMainMenu()" class="mt-4 underline">Return</button>
            </div>
        `;
    }
};

function completeLevel(levelId, score) {
    // Unlock next level
    const nextLevel = levelId + 1;
    if (!state.unlockedLevels.includes(nextLevel) && nextLevel <= 5) {
        state.unlockedLevels.push(nextLevel);
    }

    saveState();

    // Show Victory Screen
    contentArea.innerHTML = `
        <div class="text-center animate-fade-in flex flex-col items-center">
            <h2 class="text-4xl text-wano-gold font-shojumaru mb-2 text-shadow-black">Victory!</h2>
            <div class="text-6xl mb-4">🌸</div>
            <p class="text-xl text-white mb-6">Level ${levelId} Complete</p>
            <p class="text-wano-pink mb-8">Bounty Increased!</p>
            
            <button onclick="renderMainMenu()" class="bg-wano-red text-white px-8 py-3 rounded border-2 border-wano-gold font-ruslan hover:bg-red-700 transition-transform hover:scale-105 shadow-lg">
                Continue Journey
            </button>
        </div>
    `;
}

// Expose renderMainMenu to window so it can be called from error screens
window.renderMainMenu = renderMainMenu;

// Start the game immediately
init();
