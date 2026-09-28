/* =========================================================
   MASTERMIND GAMES HUB
   Complete app.js
   ========================================================= */

"use strict";

/* =========================================================
   GAME DATA
   ========================================================= */

const games = [
    {
        id: "snake",
        title: "Snake",
        icon: "🐍",
        category: "Arcade",
        description: "Eat the food and grow your snake."
    },
    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        icon: "⭕",
        category: "Puzzle",
        description: "Play Tic Tac Toe against the computer."
    },
    {
        id: "2048",
        title: "2048",
        icon: "🔢",
        category: "Puzzle",
        description: "Combine tiles and reach 2048."
    },
    {
        id: "memory",
        title: "Memory Match",
        icon: "🧠",
        category: "Puzzle",
        description: "Match all the hidden pairs."
    },
    {
        id: "reaction",
        title: "Reaction Test",
        icon: "⚡",
        category: "Skill",
        description: "Test your reaction speed."
    },
    {
        id: "guess",
        title: "Number Guess",
        icon: "🎯",
        category: "Puzzle",
        description: "Guess the secret number."
    },
    {
        id: "pong",
        title: "Pong",
        icon: "🏓",
        category: "Arcade",
        description: "Play the classic paddle game."
    },
    {
        id: "breakout",
        title: "Breakout",
        icon: "🧱",
        category: "Arcade",
        description: "Break all the blocks."
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        icon: "💣",
        category: "Puzzle",
        description: "Clear the board without mines."
    },
    {
        id: "connect4",
        title: "Connect Four",
        icon: "🔴",
        category: "Board",
        description: "Connect four pieces in a row."
    },
    {
        id: "rps",
        title: "Rock Paper Scissors",
        icon: "✊",
        category: "Classic",
        description: "Challenge the computer."
    },
    {
        id: "simon",
        title: "Simon Says",
        icon: "🎨",
        category: "Skill",
        description: "Remember the sequence."
    },
    {
        id: "whack",
        title: "Whack-a-Mole",
        icon: "🔨",
        category: "Arcade",
        description: "Hit the mole as quickly as possible."
    },
    {
        id: "sliding",
        title: "Sliding Puzzle",
        icon: "🧩",
        category: "Puzzle",
        description: "Arrange the tiles in order."
    },
    {
        id: "colormatch",
        title: "Color Match",
        icon: "🌈",
        category: "Skill",
        description: "Match the correct color."
    },
    {
        id: "math",
        title: "Math Sprint",
        icon: "➗",
        category: "Brain",
        description: "Solve math problems quickly."
    },
    {
        id: "tap",
        title: "Tap Counter",
        icon: "👆",
        category: "Arcade",
        description: "Tap as many times as you can."
    },
    {
        id: "word",
        title: "Word Guess",
        icon: "🔤",
        category: "Puzzle",
        description: "Guess the hidden word."
    },
    {
        id: "dodge",
        title: "Dodge Blocks",
        icon: "🚧",
        category: "Arcade",
        description: "Avoid the falling blocks."
    },
    {
        id: "coin",
        title: "Coin Catcher",
        icon: "🪙",
        category: "Arcade",
        description: "Catch the falling coins."
    },
    {
        id: "target",
        title: "Target Tap",
        icon: "🎯",
        category: "Skill",
        description: "Hit the target before time runs out."
    },
    {
        id: "lightsout",
        title: "Lights Out",
        icon: "💡",
        category: "Puzzle",
        description: "Turn all the lights off."
    },
    {
        id: "higherlower",
        title: "Higher or Lower",
        icon: "⬆️",
        category: "Classic",
        description: "Guess whether the next number is higher or lower."
    },
    {
        id: "dice",
        title: "Dice Duel",
        icon: "🎲",
        category: "Classic",
        description: "Roll against the computer."
    },
    {
        id: "coinflip",
        title: "Coin Flip",
        icon: "🪙",
        category: "Classic",
        description: "Choose heads or tails."
    },
    {
        id: "typing",
        title: "Typing Sprint",
        icon: "⌨️",
        category: "Skill",
        description: "Type the sentence quickly."
    },
    {
        id: "hangman",
        title: "Hangman",
        icon: "🔠",
        category: "Word",
        description: "Guess the hidden word."
    },
    {
        id: "colorhunt",
        title: "Color Hunt",
        icon: "🎨",
        category: "Skill",
        description: "Find the correct color."
    },
    {
        id: "quickmath",
        title: "Quick Math",
        icon: "🧮",
        category: "Brain",
        description: "Solve calculations quickly."
    },
    {
        id: "treasure",
        title: "Treasure Hunt",
        icon: "💎",
        category: "Puzzle",
        description: "Find the hidden treasure."
    }
];

/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentGame = null;
let cleanupGame = null;
let currentCategory = "All";

const scoresKey = "mgh_scores";
const themeKey = "mgh_theme";

/* =========================================================
   HELPERS
   ========================================================= */

const $ = selector => document.querySelector(selector);

function safeGet(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
    } catch {
        return fallback;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

function getScores() {
    try {
        const data = JSON.parse(safeGet(scoresKey, "{}"));
        return data && typeof data === "object" ? data : {};
    } catch {
        return {};
    }
}

function saveScores(scores) {
    return safeSet(scoresKey, JSON.stringify(scores));
}

function getHighScore(id) {
    const scores = getScores();
    return Number(scores[id] || 0);
}

function saveHighScore(id, score) {
    score = Number(score) || 0;

    const scores = getScores();
    const oldScore = Number(scores[id] || 0);

    if (score > oldScore) {
        scores[id] = score;
        saveScores(scores);
        return true;
    }

    return false;
}

function setGameScore(score) {
    const element = $("#gameScore");

    if (element) {
        element.textContent = score;
    }
}

function gameLayout(content) {
    return `
        <div class="game-inner">
            ${content}
        </div>
    `;
}

function infoBar(score = 0, best = null) {
    return `
        <div class="game-info-bar">
            <div>
                <small>Score</small>
                <strong id="gameScore">${score}</strong>
            </div>

            ${
                best !== null
                    ? `
                    <div>
                        <small>Best</small>
                        <strong id="gameBest">${best}</strong>
                    </div>
                    `
                    : ""
            }
        </div>
    `;
}

function showGameMessage(container, icon, title, text) {
    const old = container.querySelector(".message-overlay");

    if (old) {
        old.remove();
    }

    const overlay = document.createElement("div");

    overlay.className = "message-overlay";

    overlay.innerHTML = `
        <div class="message-box">
            <div class="message-icon">${icon}</div>
            <h2>${title}</h2>
            <p>${text}</p>

            <button
                type="button"
                class="primary-button"
                data-play-again
            >
                Play Again
            </button>
        </div>
    `;

    container.appendChild(overlay);

    overlay
        .querySelector("[data-play-again]")
        ?.addEventListener("click", () => {
            if (currentGame) {
                openGame(currentGame.id);
            }
        });
}

/* =========================================================
   THEME
   ========================================================= */

function setupTheme() {
    const savedTheme = safeGet(themeKey, null);

    let darkMode;

    if (savedTheme === "dark") {
        darkMode = true;
    } else if (savedTheme === "light") {
        darkMode = false;
    } else {
        darkMode =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    applyTheme(darkMode);

    const themeButton = $("#themeToggle");

    if (!themeButton) {
        return;
    }

    themeButton.addEventListener("click", () => {
        const dark =
            !document.documentElement.classList.contains("dark");

        applyTheme(dark);

        safeSet(themeKey, dark ? "dark" : "light");
    });
}

function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);

    if (document.body) {
        document.body.classList.toggle("dark", dark);
    }

    updateThemeButton();
}

function updateThemeButton() {
    const button = $("#themeToggle");

    if (!button) {
        return;
    }

    const dark =
        document.documentElement.classList.contains("dark");

    button.textContent = dark ? "☀️" : "🌙";

    button.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
    );
}

/* =========================================================
   CATEGORIES
   ========================================================= */

function setupCategories() {
    const categoryArea =
        $(".category-area") ||
        $("#categories") ||
        $(".categories");

    if (!categoryArea) {
        return;
    }

    const categories = [
        "All",
        "Arcade",
        "Puzzle",
        "Skill",
        "Classic",
        "Brain",
        "Board",
        "Word"
    ];

    categoryArea.innerHTML = categories
        .map(
            category => `
                <button
                    type="button"
                    class="category-button ${
                        category === "All" ? "active" : ""
                    }"
                    data-category="${category}"
                >
                    ${category}
                </button>
            `
        )
        .join("");

    categoryArea
        .querySelectorAll("[data-category]")
        .forEach(button => {
            button.addEventListener("click", () => {
                currentCategory = button.dataset.category;

                categoryArea
                    .querySelectorAll("[data-category]")
                    .forEach(item => {
                        item.classList.toggle(
                            "active",
                            item === button
                        );
                    });

                renderGames();
            });
        });
}

/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {
    const input = $("#searchInput");

    if (!input) {
        return;
    }

    input.addEventListener("input", renderGames);
}

/* =========================================================
   GAME CARDS
   ========================================================= */

function renderGames() {
    const grid = $("#gameGrid");

    if (!grid) {
        return;
    }

    const search =
        ($("#searchInput")?.value || "")
            .trim()
            .toLowerCase();

    const filtered = games.filter(game => {
        const categoryMatch =
            currentCategory === "All" ||
            game.category === currentCategory;

        const searchMatch =
            !search ||
            `${game.title} ${game.description} ${game.category}`
                .toLowerCase()
                .includes(search);

        return categoryMatch && searchMatch;
    });

    if (!filtered.length) {
        grid.innerHTML = `
            <div class="no-results">
                <div style="font-size:3rem">🔎</div>
                <h3>No games found</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }

    grid.innerHTML = filtered
        .map(
            game => `
                <article class="game-card">

                    <div class="game-card-top">
                        <div class="game-icon">
                            ${game.icon}
                        </div>

                        <span class="game-category">
                            ${game.category}
                        </span>
                    </div>

                    <h3>${game.title}</h3>

                    <p>
                        ${game.description}
                    </p>

                    <button
                        type="button"
                        class="play-button"
                        data-game="${game.id}"
                    >
                        Play
                    </button>

                </article>
            `
        )
        .join("");

    grid
        .querySelectorAll("[data-game]")
        .forEach(button => {
            button.addEventListener("click", () => {
                openGame(button.dataset.game);
            });
        });
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {
    $("#backButton")?.addEventListener("click", closeGame);

    $("#restartButton")?.addEventListener("click", () => {
        if (currentGame) {
            openGame(currentGame.id);
        }
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            currentGame
        ) {
            closeGame();
        }
    });
}

function openGame(id) {
    const game = games.find(item => item.id === id);

    if (!game) {
        return;
    }

    cleanupGame?.();
    cleanupGame = null;

    currentGame = game;

    const icon = $("#currentGameIcon");
    const title = $("#currentGameTitle");
    const category = $("#currentGameCategory");

    if (icon) {
        icon.textContent = game.icon;
    }

    if (title) {
        title.textContent = game.title;
    }

    if (category) {
        category.textContent = game.category;
    }

    $("#homeScreen")?.classList.remove("active");
    $("#gameScreen")?.classList.add("active");

    const container = $("#gameContainer");

    if (container) {
        createGame(game.id, container);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function closeGame() {
    cleanupGame?.();

    cleanupGame = null;
    currentGame = null;

    $("#gameScreen")?.classList.remove("active");
    $("#homeScreen")?.classList.add("active");

    const container = $("#gameContainer");

    if (container) {
        container.innerHTML = "";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   GAME FACTORY
   ========================================================= */

function createGame(id, container) {
    container.innerHTML = "";

    const creators = {
        snake: createSnake,
        tictactoe: createTicTacToe,
        "2048": create2048,
        memory: createMemory,
        reaction: createReaction,
        guess: createGuess,
        pong: createPong,
        breakout: createBreakout,
        minesweeper: createMinesweeper,
        connect4: createConnect4,
        rps: createRPS,
        simon: createSimon,
        whack: createWhack,
        sliding: createSliding,
        colormatch: createColorMatch,
        math: createMath,
        tap: createTap,
        word: createWord,
        dodge: createDodge,
        coin: createCoin,
        target: createTarget,
        lightsout: createLightsOut,
        higherlower: createHigherLower,
        dice: createDice,
        coinflip: createCoinFlip,
        typing: createTyping,
        hangman: createHangman,
        colorhunt: createColorHunt,
        quickmath: createQuickMath,
        treasure: createTreasure
    };

    const creator = creators[id];

    if (creator) {
        cleanupGame = creator(container) || (() => {});
    } else {
        cleanupGame = () => {};
    }
}

/* =========================================================
   1. SNAKE
   ========================================================= */

function createSnake(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("snake"))}

        <canvas
            id="snakeCanvas"
            width="400"
            height="400"
            style="
                width:min(100%,400px);
                height:auto;
                display:block;
                margin:auto;
                background:#111;
                border-radius:18px;
                touch-action:none;
            "
        ></canvas>

        <div
            class="direction-controls"
            style="
                display:grid;
                grid-template-columns:repeat(3,70px);
                grid-template-rows:repeat(3,60px);
                justify-content:center;
                gap:8px;
                margin:20px auto;
            "
        >
            <span></span>

            <button
                type="button"
                class="game-button"
                data-direction="up"
            >
                ⬆️
            </button>

            <span></span>

            <button
                type="button"
                class="game-button"
                data-direction="left"
            >
                ⬅️
            </button>

            <button
                type="button"
                class="game-button"
                data-direction="down"
            >
                ⬇️
            </button>

            <button
                type="button"
                class="game-button"
                data-direction="right"
            >
                ➡️
            </button>
        </div>

        <p style="text-align:center">
            Use arrow keys, buttons, or swipe.
        </p>
    `);

    const canvas = $("#snakeCanvas");
    const ctx = canvas.getContext("2d");

    const grid = 20;
    const cell = 20;

    let snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    let direction = {
        x: 1,
        y: 0
    };

    let nextDirection = {
        x: 1,
        y: 0
    };

    let food;
    let score = 0;
    let timer = null;
    let running = true;

    let touchStartX = 0;
    let touchStartY = 0;

    function randomFood() {
        let position;

        do {
            position = {
                x: Math.floor(Math.random() * grid),
                y: Math.floor(Math.random() * grid)
            };
        } while (
            snake.some(
                part =>
                    part.x === position.x &&
                    part.y === position.y
            )
        );

        return position;
    }

    food = randomFood();

    function draw() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, 400, 400);

        ctx.fillStyle = "#ff4d6d";

        ctx.fillRect(
            food.x * cell + 2,
            food.y * cell + 2,
            16,
            16
        );

        snake.forEach((part, index) => {
            ctx.fillStyle =
                index === 0
                    ? "#6c63ff"
                    : "#8580ff";

            ctx.fillRect(
                part.x * cell + 1,
                part.y * cell + 1,
                18,
                18
            );
        });
    }

    function changeDirection(name) {
        const directions = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };

        const next = directions[name];

        if (!next) {
            return;
        }

        /*
         * Prevent reversing.
         */
        if (
            next.x === -direction.x &&
            next.y === -direction.y
        ) {
            return;
        }

        /*
         * Also prevent two fast button presses from
         * queueing an immediate reverse.
         */
        if (
            next.x === -nextDirection.x &&
            next.y === -nextDirection.y
        ) {
            return;
        }

        nextDirection = next;
    }

    function gameOver() {
        running = false;

        clearInterval(timer);

        saveHighScore("snake", score);

        showGameMessage(
            container,
            "🐍",
            "Game Over",
            `Your score: ${score}`
        );
    }

    function tick() {
        if (!running) {
            return;
        }

        direction = nextDirection;

        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        const hitWall =
            head.x < 0 ||
            head.x >= grid ||
            head.y < 0 ||
            head.y >= grid;

        const hitSelf = snake.some(
            part =>
                part.x === head.x &&
                part.y === head.y
        );

        if (hitWall || hitSelf) {
            gameOver();
            return;
        }

        snake.unshift(head);

        if (
            head.x === food.x &&
            head.y === food.y
        ) {
            score++;

            setGameScore(score);

            food = randomFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function handleKey(event) {
        const keyMap = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right"
        };

        const directionName =
            keyMap[event.key];

        if (directionName) {
            event.preventDefault();
            changeDirection(directionName);
        }
    }

    function touchStart(event) {
        const point =
            event.changedTouches?.[0];

        if (!point) {
            return;
        }

        touchStartX = point.clientX;
        touchStartY = point.clientY;
    }

    function touchEnd(event) {
        const point =
            event.changedTouches?.[0];

        if (!point) {
            return;
        }

        const dx =
            point.clientX - touchStartX;

        const dy =
            point.clientY - touchStartY;

        const distance =
            Math.max(
                Math.abs(dx),
                Math.abs(dy)
            );

        if (distance < 25) {
            return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
            changeDirection(
                dx > 0 ? "right" : "left"
            );
        } else {
            changeDirection(
                dy > 0 ? "down" : "up"
            );
        }
    }

    const buttons =
        container.querySelectorAll(
            "[data-direction]"
        );

    buttons.forEach(button => {
        button.addEventListener(
            "pointerdown",
            event => {
                event.preventDefault();

                changeDirection(
                    button.dataset.direction
                );
            }
        );
    });

    document.addEventListener(
        "keydown",
        handleKey
    );

    canvas.addEventListener(
        "touchstart",
        touchStart,
        { passive: true }
    );

    canvas.addEventListener(
        "touchend",
        touchEnd,
        { passive: true }
    );

    draw();

    timer = setInterval(
        tick,
        120
    );

    return () => {
        running = false;

        clearInterval(timer);

        document.removeEventListener(
            "keydown",
            handleKey
        );

        canvas.removeEventListener(
            "touchstart",
            touchStart
        );

        canvas.removeEventListener(
            "touchend",
            touchEnd
        );
    };
}

/* =========================================================
   2. 2048
   ========================================================= */

function create2048(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("2048"))}

        <div
            style="
                max-width:430px;
                margin:auto;
            "
        >
            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                    margin-bottom:15px;
                "
            >
                <strong>Reach 2048</strong>

                <button
                    type="button"
                    class="game-button"
                    id="new2048"
                >
                    New Game
                </button>
            </div>

            <div
                id="board2048"
                style="
                    display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:8px;
                    padding:8px;
                    border-radius:14px;
                    background:#bbada0;
                    touch-action:none;
                    user-select:none;
                "
            ></div>

            <p style="text-align:center">
                Use arrow keys or swipe.
            </p>
        </div>
    `);

    const boardElement = $("#board2048");
    const newButton = $("#new2048");

    const SIZE = 4;

    let board;
    let score = 0;
    let gameOver = false;
    let touchStartX = 0;
    let touchStartY = 0;

    function createEmptyBoard() {
        return Array.from(
            { length: SIZE },
            () => Array(SIZE).fill(0)
        );
    }

    function addRandomTile() {
        const empty = [];

        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (board[row][col] === 0) {
                    empty.push({
                        row,
                        col
                    });
                }
            }
        }

        if (!empty.length) {
            return;
        }

        const position =
            empty[
                Math.floor(
                    Math.random() * empty.length
                )
            ];

        board[position.row][position.col] =
            Math.random() < 0.9 ? 2 : 4;
    }

    function slideLine(line) {
        const values =
            line.filter(value => value !== 0);

        const result = [];

        let gained = 0;

        for (let i = 0; i < values.length; i++) {
            if (
                values[i] ===
                values[i + 1]
            ) {
                const merged =
                    values[i] * 2;

                result.push(merged);

                gained += merged;

                i++;
            } else {
                result.push(values[i]);
            }
        }

        while (result.length < SIZE) {
            result.push(0);
        }

        return {
            line: result,
            gained
        };
    }

    function cloneBoard() {
        return board.map(row => [...row]);
    }

    function sameBoard(a, b) {
        return JSON.stringify(a) ===
            JSON.stringify(b);
    }

    /*
     * Correct 2048 movement.
     *
     * Left:
     * [2, 0, 2, 4] -> [4, 4, 0, 0]
     *
     * Right:
     * [2, 0, 2, 4] -> [0, 0, 4, 4]
     */

    function moveLeft() {
        let gained = 0;

        for (let row = 0; row < SIZE; row++) {
            const result =
                slideLine(board[row]);

            board[row] = result.line;

            gained += result.gained;
        }

        return gained;
    }

    function moveRight() {
        let gained = 0;

        for (let row = 0; row < SIZE; row++) {
            const reversed =
                [...board[row]].reverse();

            const result =
                slideLine(reversed);

            board[row] =
                result.line.reverse();

            gained += result.gained;
        }

        return gained;
    }

    function moveUp() {
        let gained = 0;

        for (let col = 0; col < SIZE; col++) {
            const line = [];

            for (let row = 0; row < SIZE; row++) {
                line.push(board[row][col]);
            }

            const result =
                slideLine(line);

            for (let row = 0; row < SIZE; row++) {
                board[row][col] =
                    result.line[row];
            }

            gained += result.gained;
        }

        return gained;
    }

    function moveDown() {
        let gained = 0;

        for (let col = 0; col < SIZE; col++) {
            const line = [];

            for (let row = 0; row < SIZE; row++) {
                line.push(board[row][col]);
            }

            const reversed =
                line.reverse();

            const result =
                slideLine(reversed);

            const finalLine =
                result.line.reverse();

            for (let row = 0; row < SIZE; row++) {
                board[row][col] =
                    finalLine[row];
            }

            gained += result.gained;
        }

        return gained;
    }

    function canMove() {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {

                if (board[row][col] === 0) {
                    return true;
                }

                if (
                    col < SIZE - 1 &&
                    board[row][col] ===
                        board[row][col + 1]
                ) {
                    return true;
                }

                if (
                    row < SIZE - 1 &&
                    board[row][col] ===
                        board[row + 1][col]
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    function render() {
        boardElement.innerHTML = "";

        board.flat().forEach(value => {
            const tile =
                document.createElement("div");

            tile.style.aspectRatio = "1";
            tile.style.display = "grid";
            tile.style.placeItems = "center";
            tile.style.borderRadius = "8px";
            tile.style.fontWeight = "800";
            tile.style.fontSize =
                "clamp(1rem, 7vw, 2rem)";

            tile.textContent =
                value === 0 ? "" : value;

            const backgrounds = {
                0: "#cdc1b4",
                2: "#eee4da",
                4: "#ede0c8",
                8: "#f2b179",
                16: "#f59563",
                32: "#f67c5f",
                64: "#f65e3b",
                128: "#edcf72",
                256: "#edcc61",
                512: "#edc850",
                1024: "#edc53f",
                2048: "#edc22e"
            };

            tile.style.background =
                backgrounds[value] ||
                "#3c3a32";

            tile.style.color =
                value > 4
                    ? "#ffffff"
                    : "#776e65";

            boardElement.appendChild(tile);
        });
    }

    function move(direction) {
        if (gameOver) {
            return;
        }

        const before = cloneBoard();

        let gained = 0;

        if (direction === "left") {
            gained = moveLeft();
        } else if (direction === "right") {
            gained = moveRight();
        } else if (direction === "up") {
            gained = moveUp();
        } else if (direction === "down") {
            gained = moveDown();
        }

        if (sameBoard(before, board)) {
            return;
        }

        score += gained;

        setGameScore(score);

        addRandomTile();

        render();

        if (board.flat().includes(2048)) {
            saveHighScore(
                "2048",
                score
            );
        }

        if (!canMove()) {
            gameOver = true;

            saveHighScore(
                "2048",
                score
            );

            setTimeout(() => {
                showGameMessage(
                    container,
                    "🔢",
                    "Game Over",
                    `Score: ${score}`
                );
            }, 100);
        }
    }

    function handleKey(event) {
        const directions = {
            ArrowLeft: "left",
            ArrowRight: "right",
            ArrowUp: "up",
            ArrowDown: "down"
        };

        const direction =
            directions[event.key];

        if (!direction) {
            return;
        }

        event.preventDefault();

        move(direction);
    }

    function touchStart(event) {
        const point =
            event.changedTouches?.[0];

        if (!point) {
            return;
        }

        touchStartX = point.clientX;
        touchStartY = point.clientY;
    }

    function touchEnd(event) {
        const point =
            event.changedTouches?.[0];

        if (!point) {
            return;
        }

        const dx =
            point.clientX - touchStartX;

        const dy =
            point.clientY - touchStartY;

        const distance =
            Math.max(
                Math.abs(dx),
                Math.abs(dy)
            );

        if (distance < 25) {
            return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
            move(
                dx > 0
                    ? "right"
                    : "left"
            );
        } else {
            move(
                dy > 0
                    ? "down"
                    : "up"
            );
        }
    }

    function newGame() {
        board = createEmptyBoard();

        score = 0;
        gameOver = false;

        setGameScore(0);

        addRandomTile();
        addRandomTile();

        render();
    }

    document.addEventListener(
        "keydown",
        handleKey
    );

    boardElement.addEventListener(
        "touchstart",
        touchStart,
        { passive: true }
    );

    boardElement.addEventListener(
        "touchend",
        touchEnd,
        { passive: true }
    );

    newButton.addEventListener(
        "click",
        newGame
    );

    newGame();

    return () => {
        document.removeEventListener(
            "keydown",
            handleKey
        );

        boardElement.removeEventListener(
            "touchstart",
            touchStart
        );

        boardElement.removeEventListener(
            "touchend",
            touchEnd
        );
    };
}

/* =========================================================
   3. TIC TAC TOE
   ========================================================= */

function createTicTacToe(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("tictactoe"))}

        <p
            id="tttStatus"
            style="text-align:center;font-weight:700"
        >
            Your turn
        </p>

        <div
            id="tttBoard"
            style="
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:8px;
                max-width:360px;
                margin:auto;
            "
        ></div>

        <div style="text-align:center;margin-top:20px">
            <button
                type="button"
                class="game-button"
                id="tttReset"
            >
                New Game
            </button>
        </div>
    `);

    const boardElement = $("#tttBoard");
    const status = $("#tttStatus");

    let board = Array(9).fill("");
    let gameEnded = false;
    let timeout = null;

    const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function checkWinner() {
        for (const combination of wins) {
            const [a, b, c] = combination;

            if (
                board[a] &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                return board[a];
            }
        }

        if (board.every(Boolean)) {
            return "draw";
        }

        return null;
    }

    function render() {
        boardElement.innerHTML =
            board
                .map(
                    (value, index) => `
                        <button
                            type="button"
                            data-cell="${index}"
                            style="
                                aspect-ratio:1;
                                font-size:clamp(2rem,10vw,4rem);
                            "
                        >
                            ${value}
                        </button>
                    `
                )
                .join("");

        boardElement
            .querySelectorAll("[data-cell]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        playerMove(
                            Number(
                                button.dataset.cell
                            )
                        );
                    }
                );
            });
    }

    function finish(result) {
        gameEnded = true;

        if (result === "X") {
            status.textContent = "You win! 🎉";

            const score =
                getHighScore("tictactoe") + 1;

            saveHighScore(
                "tictactoe",
                score
            );
        } else if (result === "O") {
            status.textContent =
                "Computer wins!";
        } else {
            status.textContent = "Draw!";
        }
    }

    function playerMove(index) {
        if (
            gameEnded ||
            board[index]
        ) {
            return;
        }

        board[index] = "X";

        render();

        const result = checkWinner();

        if (result) {
            finish(result);
            return;
        }

        status.textContent =
            "Computer thinking...";

        timeout = setTimeout(
            computerMove,
            350
        );
    }

    function computerMove() {
        if (gameEnded) {
            return;
        }

        const empty =
            board
                .map((value, index) =>
                    value ? null : index
                )
                .filter(
                    index => index !== null
                );

        if (!empty.length) {
            return;
        }

        /*
         * Try winning move.
         */
        let chosen = findWinningMove("O");

        /*
         * Block player.
         */
        if (chosen === null) {
            chosen = findWinningMove("X");
        }

        /*
         * Center.
         */
        if (
            chosen === null &&
            !board[4]
        ) {
            chosen = 4;
        }

        /*
         * Random available cell.
         */
        if (chosen === null) {
            chosen =
                empty[
                    Math.floor(
                        Math.random() *
                        empty.length
                    )
                ];
        }

        board[chosen] = "O";

        render();

        const result = checkWinner();

        if (result) {
            finish(result);
        } else {
            status.textContent =
                "Your turn";
        }
    }

    function findWinningMove(player) {
        for (const index of board.keys()) {
            if (board[index]) {
                continue;
            }

            board[index] = player;

            const result =
                checkWinner();

            board[index] = "";

            if (result === player) {
                return index;
            }
        }

        return null;
    }

    function reset() {
        clearTimeout(timeout);

        board = Array(9).fill("");
        gameEnded = false;

        status.textContent =
            "Your turn";

        render();
    }

    $("#tttReset").addEventListener(
        "click",
        reset
    );

    reset();

    return () => {
        clearTimeout(timeout);
    };
}

/* =========================================================
   4. MEMORY
   ========================================================= */

function createMemory(container) {
    const icons = [
        "🍎",
        "🚀",
        "🐱",
        "🌟",
        "⚽",
        "🍕",
        "🎵",
        "🌈"
    ];

    let cards = [...icons, ...icons]
        .sort(() => Math.random() - 0.5);

    let opened = [];
    let matched = new Set();
    let locked = false;
    let timeout = null;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("memory"))}

        <div
            id="memoryBoard"
            style="
                display:grid;
                grid-template-columns:repeat(4,1fr);
                gap:8px;
                max-width:480px;
                margin:auto;
            "
        ></div>
    `);

    const board = $("#memoryBoard");

    function render() {
        board.innerHTML =
            cards
                .map(
                    (card, index) => `
                        <button
                            type="button"
                            data-memory="${index}"
                            style="
                                aspect-ratio:1;
                                font-size:clamp(1.5rem,8vw,3rem);
                            "
                        >
                            ${
                                opened.includes(index) ||
                                matched.has(index)
                                    ? card
                                    : "?"
                            }
                        </button>
                    `
                )
                .join("");

        board
            .querySelectorAll("[data-memory]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        flipCard(
                            Number(
                                button.dataset.memory
                            )
                        );
                    }
                );
            });
    }

    function flipCard(index) {
        if (
            locked ||
            opened.includes(index) ||
            matched.has(index)
        ) {
            return;
        }

        opened.push(index);

        render();

        if (opened.length !== 2) {
            return;
        }

        locked = true;

        timeout = setTimeout(() => {
            const first = opened[0];
            const second = opened[1];

            if (
                cards[first] ===
                cards[second]
            ) {
                matched.add(first);
                matched.add(second);

                const score =
                    matched.size / 2;

                setGameScore(score);

                saveHighScore(
                    "memory",
                    score
                );
            }

            opened = [];
            locked = false;

            render();

            if (
                matched.size ===
                cards.length
            ) {
                showGameMessage(
                    container,
                    "🧠",
                    "Complete!",
                    "You matched every pair!"
                );
            }
        }, 600);
    }

    render();

    return () => {
        clearTimeout(timeout);
    };
}

/* =========================================================
   5. REACTION
   ========================================================= */

function createReaction(container) {
    let timer = null;
    let ready = false;
    let startTime = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("reaction"))}

        <button
            type="button"
            id="reactionButton"
            style="
                width:100%;
                min-height:220px;
                font-size:clamp(1.5rem,6vw,3rem);
            "
        >
            Wait...
        </button>
    `);

    const button = $("#reactionButton");

    function prepare() {
        clearTimeout(timer);

        ready = false;
        button.textContent =
            "Wait for green...";

        timer = setTimeout(() => {
            ready = true;
            startTime =
                performance.now();

            button.textContent =
                "CLICK!";
        }, 1000 + Math.random() * 2500);
    }

    button.addEventListener(
        "click",
        () => {
            if (!ready) {
                clearTimeout(timer);

                button.textContent =
                    "Too early!";

                setTimeout(
                    prepare,
                    800
                );

                return;
            }

            const reaction =
                Math.round(
                    performance.now() -
                    startTime
                );

            setGameScore(reaction);

            saveHighScore(
                "reaction",
                Math.max(
                    0,
                    1000 - reaction
                )
            );

            button.textContent =
                `${reaction} ms — try again`;

            ready = false;

            setTimeout(
                prepare,
                900
            );
        }
    );

    prepare();

    return () => {
        clearTimeout(timer);
    };
}

/* =========================================================
   6. NUMBER GUESS
   ========================================================= */

function createGuess(container) {
    let target =
        Math.floor(
            Math.random() * 100
        ) + 1;

    let attempts = 0;
    let finished = false;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("guess"))}

        <div style="text-align:center">
            <p>
                Guess a number from 1 to 100.
            </p>

            <input
                id="guessInput"
                type="number"
                min="1"
                max="100"
                inputmode="numeric"
                style="padding:12px"
            >

            <button
                type="button"
                class="game-button"
                id="guessButton"
            >
                Guess
            </button>

            <p id="guessMessage"></p>
        </div>
    `);

    const input = $("#guessInput");
    const button = $("#guessButton");
    const message = $("#guessMessage");

    function guess() {
        if (finished) {
            return;
        }

        const value = Number(input.value);

        if (
            !Number.isInteger(value) ||
            value < 1 ||
            value > 100
        ) {
            message.textContent =
                "Enter a number from 1 to 100.";

            return;
        }

        attempts++;

        setGameScore(attempts);

        if (value === target) {
            finished = true;

            message.textContent =
                `Correct! You needed ${attempts} guesses.`;

            saveHighScore(
                "guess",
                Math.max(
                    1,
                    101 - attempts
                )
            );

            return;
        }

        message.textContent =
            value < target
                ? "Try higher ⬆️"
                : "Try lower ⬇️";
    }

    button.addEventListener(
        "click",
        guess
    );

    input.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                guess();
            }
        }
    );

    return () => {};
}

/* =========================================================
   7. ROCK PAPER SCISSORS
   ========================================================= */

function createRPS(container) {
    const choices = [
        "Rock",
        "Paper",
        "Scissors"
    ];

    let score = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("rps"))}

        <div
            style="
                display:flex;
                gap:10px;
                justify-content:center;
                flex-wrap:wrap;
            "
        >
            ${choices
                .map(
                    choice => `
                        <button
                            type="button"
                            class="game-button"
                            data-rps="${choice}"
                        >
                            ${choice}
                        </button>
                    `
                )
                .join("")}
        </div>

        <p
            id="rpsMessage"
            style="text-align:center"
        ></p>
    `);

    const message = $("#rpsMessage");

    container
        .querySelectorAll("[data-rps]")
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const player =
                        button.dataset.rps;

                    const computer =
                        choices[
                            Math.floor(
                                Math.random() *
                                choices.length
                            )
                        ];

                    let result;

                    if (
                        player === computer
                    ) {
                        result = "Draw!";
                    } else if (
                        (
                            player === "Rock" &&
                            computer === "Scissors"
                        ) ||
                        (
                            player === "Paper" &&
                            computer === "Rock"
                        ) ||
                        (
                            player === "Scissors" &&
                            computer === "Paper"
                        )
                    ) {
                        result = "You win!";
                        score++;

                        setGameScore(score);

                        saveHighScore(
                            "rps",
                            score
                        );
                    } else {
                        result =
                            "Computer wins!";
                    }

                    message.textContent =
                        `You: ${player} | Computer: ${computer} | ${result}`;
                }
            );
        });

    return () => {};
}

/* =========================================================
   8. TAP COUNTER
   ========================================================= */

function createTap(container) {
    let score = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("tap"))}

        <button
            type="button"
            id="tapButton"
            style="
                display:block;
                width:min(100%,450px);
                height:220px;
                margin:25px auto;
                font-size:3rem;
            "
        >
            TAP!
        </button>
    `);

    const button = $("#tapButton");

    button.addEventListener(
        "pointerdown",
        event => {
            event.preventDefault();

            score++;

            setGameScore(score);

            saveHighScore(
                "tap",
                score
            );
        }
    );

    return () => {};
}

/* =========================================================
   9. COIN FLIP
   ========================================================= */

function createCoinFlip(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("coinflip"))}

        <div style="text-align:center">
            <button
                type="button"
                class="game-button"
                data-choice="Heads"
            >
                Heads
            </button>

            <button
                type="button"
                class="game-button"
                data-choice="Tails"
            >
                Tails
            </button>

            <h2 id="coinResult">
                Choose one
            </h2>
        </div>
    `);

    const result = $("#coinResult");

    container
        .querySelectorAll("[data-choice]")
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const coin =
                        Math.random() < 0.5
                            ? "Heads"
                            : "Tails";

                    const player =
                        button.dataset.choice;

                    result.textContent =
                        coin === player
                            ? `It was ${coin}! You win! 🎉`
                            : `It was ${coin}.`;
                }
            );
        });

    return () => {};
}

/* =========================================================
   10. DICE
   ========================================================= */

function createDice(container) {
    let score = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("dice"))}

        <div style="text-align:center">
            <button
                type="button"
                class="game-button"
                id="rollDice"
            >
                Roll Dice 🎲
            </button>

            <h2 id="diceResult">—</h2>
        </div>
    `);

    $("#rollDice").addEventListener(
        "click",
        () => {
            const player =
                Math.floor(
                    Math.random() * 6
                ) + 1;

            const computer =
                Math.floor(
                    Math.random() * 6
                ) + 1;

            let result;

            if (player > computer) {
                result = "You win! 🎉";
                score++;

                setGameScore(score);

                saveHighScore(
                    "dice",
                    score
                );
            } else if (
                player < computer
            ) {
                result =
                    "Computer wins!";
            } else {
                result = "Draw!";
            }

            $("#diceResult").textContent =
                `You: ${player} | Computer: ${computer} | ${result}`;
        }
    );

    return () => {};
}

/* =========================================================
   11. HIGHER LOWER
   ========================================================= */

function createHigherLower(container) {
    let current =
        Math.floor(
            Math.random() * 100
        ) + 1;

    let score = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("higherlower"))}

        <div style="text-align:center">
            <h2 id="higherLowerNumber">
                ${current}
            </h2>

            <button
                type="button"
                class="game-button"
                data-hl="higher"
            >
                Higher ⬆️
            </button>

            <button
                type="button"
                class="game-button"
                data-hl="lower"
            >
                Lower ⬇️
            </button>

            <p id="higherLowerMessage"></p>
        </div>
    `);

    function play(choice) {
        const next =
            Math.floor(
                Math.random() * 100
            ) + 1;

        const correct =
            choice === "higher"
                ? next > current
                : next < current;

        if (correct) {
            score++;

            setGameScore(score);

            saveHighScore(
                "higherlower",
                score
            );

            $("#higherLowerMessage").textContent =
                "Correct! 🎉";
        } else {
            score = 0;

            setGameScore(0);

            $("#higherLowerMessage").textContent =
                "Wrong! Score reset.";
        }

        current = next;

        $("#higherLowerNumber").textContent =
            current;
    }

    container
        .querySelectorAll("[data-hl]")
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    play(
                        button.dataset.hl
                    );
                }
            );
        });

    return () => {};
}

/* =========================================================
   12. SIMPLE COLOR GAMES
   ========================================================= */

function createColorMatch(container) {
    return createColorGame(
        container,
        "colormatch",
        "Color Match",
        "Match the requested color."
    );
}

function createColorHunt(container) {
    return createColorGame(
        container,
        "colorhunt",
        "Color Hunt",
        "Find the requested color."
    );
}

function createColorGame(
    container,
    id,
    title,
    instruction
) {
    const colors = [
        "Red",
        "Blue",
        "Green",
        "Yellow",
        "Purple"
    ];

    let score = 0;
    let target = "";

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore(id))}

        <div style="text-align:center">
            <h2>${title}</h2>

            <p id="colorPrompt"></p>

            <div
                id="colorButtons"
                style="
                    display:flex;
                    gap:10px;
                    justify-content:center;
                    flex-wrap:wrap;
                "
            ></div>
        </div>
    `);

    const prompt = $("#colorPrompt");
    const buttons = $("#colorButtons");

    function nextRound() {
        target =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        prompt.textContent =
            `${instruction} Target: ${target}`;

        buttons.innerHTML =
            [...colors]
                .sort(
                    () => Math.random() - 0.5
                )
                .map(
                    color => `
                        <button
                            type="button"
                            class="game-button"
                            data-color="${color}"
                        >
                            ${color}
                        </button>
                    `
                )
                .join("");

        buttons
            .querySelectorAll("[data-color]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        if (
                            button.dataset.color ===
                            target
                        ) {
                            score++;

                            setGameScore(
                                score
                            );

                            saveHighScore(
                                id,
                                score
                            );
                        } else {
                            score = 0;
                            setGameScore(0);
                        }

                        nextRound();
                    }
                );
            });
    }

    nextRound();

    return () => {};
}

/* =========================================================
   13. GENERIC MATH
   ========================================================= */

function createMath(container) {
    return createMathGame(
        container,
        "math",
        30
    );
}

function createQuickMath(container) {
    return createMathGame(
        container,
        "quickmath",
        20
    );
}

function createMathGame(
    container,
    id,
    seconds
) {
    let score = 0;
    let time = seconds;
    let timer = null;

    let answer = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore(id))}

        <div style="text-align:center">
            <h2 id="mathQuestion"></h2>

            <input
                id="mathAnswer"
                type="number"
                inputmode="numeric"
                style="padding:12px"
            >

            <button
                type="button"
                class="game-button"
                id="mathSubmit"
            >
                Answer
            </button>

            <p>
                Time:
                <strong id="mathTime">
                    ${time}
                </strong>
            </p>
        </div>
    `);

    function nextQuestion() {
        const a =
            Math.floor(
                Math.random() * 12
            ) + 1;

        const b =
            Math.floor(
                Math.random() * 12
            ) + 1;

        const multiply =
            Math.random() < 0.5;

        answer =
            multiply
                ? a * b
                : a + b;

        $("#mathQuestion").textContent =
            `${a} ${multiply ? "×" : "+"} ${b} = ?`;

        $("#mathAnswer").value = "";
        $("#mathAnswer").focus();
    }

    function submit() {
        if (
            Number(
                $("#mathAnswer").value
            ) === answer
        ) {
            score++;

            setGameScore(score);

            saveHighScore(
                id,
                score
            );
        }

        nextQuestion();
    }

    $("#mathSubmit").addEventListener(
        "click",
        submit
    );

    $("#mathAnswer").addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                submit();
            }
        }
    );

    nextQuestion();

    timer = setInterval(() => {
        time--;

        $("#mathTime").textContent =
            time;

        if (time <= 0) {
            clearInterval(timer);

            showGameMessage(
                container,
                id === "math"
                    ? "➗"
                    : "🧮",
                "Time Up!",
                `Your score: ${score}`
            );
        }
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}

/* =========================================================
   14. WORD GUESS
   ========================================================= */

function createWord(container) {
    return createHangmanGame(
        container,
        "word"
    );
}

function createHangman(container) {
    return createHangmanGame(
        container,
        "hangman"
    );
}

function createHangmanGame(
    container,
    id
) {
    const words = [
        "planet",
        "rocket",
        "garden",
        "puzzle",
        "orange",
        "school",
        "dragon",
        "button"
    ];

    let word =
        words[
            Math.floor(
                Math.random() *
                words.length
            )
        ];

    let guessed = new Set();
    let mistakes = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore(id))}

        <div style="text-align:center">
            <h2 id="wordDisplay"></h2>

            <input
                id="wordInput"
                maxlength="1"
                inputmode="text"
                style="padding:12px"
            >

            <button
                type="button"
                class="game-button"
                id="wordButton"
            >
                Guess
            </button>

            <p id="wordMessage"></p>
        </div>
    `);

    function render() {
        $("#wordDisplay").textContent =
            [...word]
                .map(letter =>
                    guessed.has(letter)
                        ? letter
                        : "_"
                )
                .join(" ");
    }

    function guess() {
        const letter =
            $("#wordInput")
                .value
                .toLowerCase();

        $("#wordInput").value = "";

        if (!/^[a-z]$/.test(letter)) {
            return;
        }

        guessed.add(letter);

        if (!word.includes(letter)) {
            mistakes++;
        }

        render();

        if (
            [...word].every(
                letter =>
                    guessed.has(letter)
            )
        ) {
            saveHighScore(
                id,
                getHighScore(id) + 1
            );

            showGameMessage(
                container,
                "🔠",
                "You Won!",
                `The word was "${word}".`
            );
        } else {
            $("#wordMessage").textContent =
                `Wrong guesses: ${mistakes}`;
        }
    }

    $("#wordButton").addEventListener(
        "click",
        guess
    );

    $("#wordInput").addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                guess();
            }
        }
    );

    render();

    return () => {};
}

/* =========================================================
   15. TYPING
   ========================================================= */

function createTyping(container) {
    const texts = [
        "The quick brown fox jumps over the lazy dog.",
        "Games are fun when you keep practicing.",
        "Build something small every day."
    ];

    const target =
        texts[
            Math.floor(
                Math.random() * texts.length
            )
        ];

    let started = false;
    let startTime = 0;
    let finished = false;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("typing"))}

        <p
            style="
                text-align:center;
                font-weight:700;
            "
        >
            ${target}
        </p>

        <textarea
            id="typingInput"
            rows="5"
            style="
                width:100%;
                padding:12px;
            "
            placeholder="Start typing..."
        ></textarea>

        <p
            id="typingMessage"
            style="text-align:center"
        ></p>
    `);

    const input = $("#typingInput");

    input.addEventListener(
        "input",
        () => {
            if (finished) {
                return;
            }

            if (!started) {
                started = true;
                startTime =
                    performance.now();
            }

            if (input.value === target) {
                finished = true;

                const seconds =
                    (
                        performance.now() -
                        startTime
                    ) / 1000;

                const words =
                    target.trim().split(/\s+/).length;

                const wpm =
                    Math.max(
                        1,
                        Math.round(
                            words /
                            (seconds / 60)
                        )
                    );

                setGameScore(wpm);

                saveHighScore(
                    "typing",
                    wpm
                );

                $("#typingMessage").textContent =
                    `Finished in ${seconds.toFixed(
                        1
                    )} seconds — ${wpm} WPM`;
            }
        }
    );

    return () => {};
}

/* =========================================================
   16. SIMON
   ========================================================= */

function createSimon(container) {
    const colors = [
        "red",
        "blue",
        "green",
        "yellow"
    ];

    let sequence = [];
    let playerIndex = 0;
    let score = 0;
    let timer = null;
    let active = false;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("simon"))}

        <div
            style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:10px;
                max-width:420px;
                margin:auto;
            "
        >
            ${colors
                .map(
                    color => `
                        <button
                            type="button"
                            class="game-button"
                            data-simon="${color}"
                            style="height:100px"
                        >
                            ${color}
                        </button>
                    `
                )
                .join("")}
        </div>

        <p
            id="simonMessage"
            style="text-align:center"
        >
            Watch the sequence.
        </p>
    `);

    const message = $("#simonMessage");

    function showSequence() {
        active = false;

        let index = 0;

        message.textContent =
            "Watch...";

        clearInterval(timer);

        timer = setInterval(() => {
            if (index >= sequence.length) {
                clearInterval(timer);

                active = true;
                playerIndex = 0;

                message.textContent =
                    "Your turn!";

                return;
            }

            message.textContent =
                sequence[index];

            index++;
        }, 500);
    }

    function nextRound() {
        sequence.push(
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ]
        );

        showSequence();
    }

    container
        .querySelectorAll("[data-simon]")
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    if (!active) {
                        return;
                    }

                    const selected =
                        button.dataset.simon;

                    if (
                        selected !==
                        sequence[playerIndex]
                    ) {
                        active = false;

                        saveHighScore(
                            "simon",
                            score
                        );

                        showGameMessage(
                            container,
                            "🎨",
                            "Game Over",
                            `Round: ${score}`
                        );

                        return;
                    }

                    playerIndex++;

                    if (
                        playerIndex ===
                        sequence.length
                    ) {
                        score++;

                        setGameScore(score);

                        saveHighScore(
                            "simon",
                            score
                        );

                        active = false;

                        setTimeout(
                            nextRound,
                            500
                        );
                    }
                }
            );
        });

    nextRound();

    return () => {
        clearInterval(timer);
        active = false;
    };
}

/* =========================================================
   17. WHACK A MOLE
   ========================================================= */

function createWhack(container) {
    let score = 0;
    let mole = 0;
    let time = 20;

    let timer = null;
    let moleTimer = null;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("whack"))}

        <p style="text-align:center">
            Time:
            <strong id="whackTime">
                ${time}
            </strong>
        </p>

        <div
            id="whackBoard"
            style="
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:8px;
                max-width:450px;
                margin:auto;
            "
        ></div>
    `);

    const board = $("#whackBoard");

    function render() {
        board.innerHTML =
            Array.from(
                { length: 9 },
                (_, index) => `
                    <button
                        type="button"
                        class="game-button"
                        data-mole="${index}"
                        style="height:90px"
                    >
                        ${
                            index === mole
                                ? "🔨"
                                : "•"
                        }
                    </button>
                `
            )
            .join("");

        board
            .querySelectorAll("[data-mole]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        if (
                            Number(
                                button.dataset.mole
                            ) === mole
                        ) {
                            score++;

                            setGameScore(
                                score
                            );

                            saveHighScore(
                                "whack",
                                score
                            );

                            newMole();
                        }
                    }
                );
            });
    }

    function newMole() {
        mole =
            Math.floor(
                Math.random() * 9
            );

        render();
    }

    moleTimer = setInterval(
        newMole,
        700
    );

    timer = setInterval(() => {
        time--;

        $("#whackTime").textContent =
            time;

        if (time <= 0) {
            clearInterval(timer);
            clearInterval(moleTimer);

            showGameMessage(
                container,
                "🔨",
                "Time Up!",
                `Score: ${score}`
            );
        }
    }, 1000);

    newMole();

    return () => {
        clearInterval(timer);
        clearInterval(moleTimer);
    };
}

/* =========================================================
   18. SLIDING PUZZLE
   ========================================================= */

function createSliding(container) {
    let tiles = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 0
    ];

    let moves = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("sliding"))}

        <div
            id="slidingBoard"
            style="
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:7px;
                max-width:360px;
                margin:auto;
            "
        ></div>
    `);

    const board = $("#slidingBoard");

    function render() {
        board.innerHTML =
            tiles
                .map(
                    (tile, index) => `
                        <button
                            type="button"
                            class="game-button"
                            data-slide="${index}"
                            style="
                                aspect-ratio:1;
                                font-size:2rem;
                            "
                        >
                            ${tile || ""}
                        </button>
                    `
                )
                .join("");

        board
            .querySelectorAll("[data-slide]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        move(
                            Number(
                                button.dataset.slide
                            )
                        );
                    }
                );
            });
    }

    function shuffle() {
        for (
            let i = tiles.length - 1;
            i > 0;
            i--
        ) {
            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                tiles[i],
                tiles[j]
            ] = [
                tiles[j],
                tiles[i]
            ];
        }
    }

    function move(index) {
        const zero =
            tiles.indexOf(0);

        const x1 = index % 3;
        const y1 =
            Math.floor(index / 3);

        const x2 = zero % 3;
        const y2 =
            Math.floor(zero / 3);

        const distance =
            Math.abs(x1 - x2) +
            Math.abs(y1 - y2);

        if (distance !== 1) {
            return;
        }

        [
            tiles[index],
            tiles[zero]
        ] = [
            tiles[zero],
            tiles[index]
        ];

        moves++;

        setGameScore(moves);

        render();

        if (
            tiles.join(",") ===
            "1,2,3,4,5,6,7,8,0"
        ) {
            saveHighScore(
                "sliding",
                Math.max(
                    1,
                    100 - moves
                )
            );

            showGameMessage(
                container,
                "🧩",
                "Solved!",
                `Moves: ${moves}`
            );
        }
    }

    shuffle();

    render();

    return () => {};
}

/* =========================================================
   19. CONNECT FOUR
   ========================================================= */

function createConnect4(container) {
    const rows = 6;
    const cols = 7;

    let board =
        Array(rows * cols).fill("");

    let playerTurn = true;
    let ended = false;
    let aiTimer = null;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("connect4"))}

        <div
            id="connectBoard"
            style="
                display:grid;
                grid-template-columns:repeat(7,1fr);
                gap:4px;
                max-width:500px;
                margin:auto;
            "
        ></div>

        <p
            id="connectMessage"
            style="text-align:center"
        >
            Your turn
        </p>
    `);

    const boardElement =
        $("#connectBoard");

    const message =
        $("#connectMessage");

    function render() {
        boardElement.innerHTML =
            board
                .map(
                    (value, index) => `
                        <button
                            type="button"
                            data-connect="${index}"
                            style="
                                aspect-ratio:1;
                                border-radius:50%;
                                padding:0;
                                font-size:1.5rem;
                            "
                        >
                            ${
                                value === "R"
                                    ? "🔴"
                                    : value === "Y"
                                        ? "🟡"
                                        : ""
                            }
                        </button>
                    `
                )
                .join("");

        boardElement
            .querySelectorAll(
                "[data-connect]"
            )
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        drop(
                            Number(
                                button.dataset.connect
                            ) % cols,
                            "R"
                        );
                    }
                );
            });
    }

    function drop(column, player) {
        if (
            ended ||
            (player === "R" &&
                !playerTurn)
        ) {
            return;
        }

        for (
            let row = rows - 1;
            row >= 0;
            row--
        ) {
            const index =
                row * cols + column;

            if (!board[index]) {
                board[index] = player;

                render();

                if (hasWon(player)) {
                    ended = true;

                    if (player === "R") {
                        saveHighScore(
                            "connect4",
                            getHighScore(
                                "connect4"
                            ) + 1
                        );

                        message.textContent =
                            "You win! 🎉";
                    } else {
                        message.textContent =
                            "Computer wins!";
                    }

                    return;
                }

                if (
                    board.every(Boolean)
                ) {
                    ended = true;
                    message.textContent =
                        "Draw!";
                    return;
                }

                if (player === "R") {
                    playerTurn = false;

                    message.textContent =
                        "Computer thinking...";

                    aiTimer = setTimeout(
                        computerMove,
                        300
                    );
                }

                return;
            }
        }
    }

    function computerMove() {
        if (ended) {
            return;
        }

        const available = [];

        for (let col = 0; col < cols; col++) {
            if (!board[col]) {
                available.push(col);
            }
        }

        if (!available.length) {
            return;
        }

        const column =
            available[
                Math.floor(
                    Math.random() *
                    available.length
                )
            ];

        drop(column, "Y");

        playerTurn = true;

        if (!ended) {
            message.textContent =
                "Your turn";
        }
    }

    function hasWon(player) {
        const directions = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1]
        ];

        for (let row = 0; row < rows; row++) {
            for (
                let col = 0;
                col < cols;
                col++
            ) {
                const start =
                    row * cols + col;

                if (
                    board[start] !== player
                ) {
                    continue;
                }

                for (
                    const [dx, dy]
                    of directions
                ) {
                    let count = 1;

                    for (
                        let step = 1;
                        step < 4;
                        step++
                    ) {
                        const nextRow =
                            row + dy * step;

                        const nextCol =
                            col + dx * step;

                        if (
                            nextRow < 0 ||
                            nextRow >= rows ||
                            nextCol < 0 ||
                            nextCol >= cols
                        ) {
                            break;
                        }

                        if (
                            board[
                                nextRow * cols +
                                nextCol
                            ] === player
                        ) {
                            count++;
                        } else {
                            break;
                        }
                    }

                    if (count >= 4) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    render();

    return () => {
        clearTimeout(aiTimer);
        ended = true;
    };
}

/* =========================================================
   20. LIGHTS OUT
   ========================================================= */

function createLightsOut(container) {
    let lights = Array.from(
        { length: 25 },
        () => Math.random() < 0.5
    );

    let moves = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("lightsout"))}

        <div
            id="lightsBoard"
            style="
                display:grid;
                grid-template-columns:repeat(5,1fr);
                gap:6px;
                max-width:400px;
                margin:auto;
            "
        ></div>
    `);

    const board = $("#lightsBoard");

    function render() {
        board.innerHTML =
            lights
                .map(
                    (on, index) => `
                        <button
                            type="button"
                            data-light="${index}"
                            style="
                                aspect-ratio:1;
                                border:0;
                                border-radius:8px;
                                background:${
                                    on
                                        ? "#ffd54a"
                                        : "#555"
                                };
                            "
                        >
                            ${on ? "💡" : ""}
                        </button>
                    `
                )
                .join("");

        board
            .querySelectorAll("[data-light]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        toggle(
                            Number(
                                button.dataset.light
                            )
                        );
                    }
                );
            });
    }

    function toggle(index) {
        const x = index % 5;
        const y =
            Math.floor(index / 5);

        const positions = [
            [x, y],
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ];

        positions.forEach(
            ([px, py]) => {
                if (
                    px >= 0 &&
                    px < 5 &&
                    py >= 0 &&
                    py < 5
                ) {
                    const target =
                        py * 5 + px;

                    lights[target] =
                        !lights[target];
                }
            }
        );

        moves++;

        setGameScore(moves);

        render();

        if (
            lights.every(
                value => !value
            )
        ) {
            saveHighScore(
                "lightsout",
                Math.max(
                    1,
                    100 - moves
                )
            );

            showGameMessage(
                container,
                "💡",
                "Solved!",
                `Moves: ${moves}`
            );
        }
    }

    render();

    return () => {};
}

/* =========================================================
   21. MINESWEEPER
   ========================================================= */

function createMinesweeper(container) {
    const size = 8;
    const mineCount = 10;

    const total =
        size * size;

    const mines = new Set();
    const opened = new Set();

    let ended = false;

    while (
        mines.size <
        mineCount
    ) {
        mines.add(
            Math.floor(
                Math.random() * total
            )
        );
    }

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("minesweeper"))}

        <div
            id="mineBoard"
            style="
                display:grid;
                grid-template-columns:repeat(8,1fr);
                gap:2px;
                max-width:480px;
                margin:auto;
            "
        ></div>
    `);

    const board = $("#mineBoard");

    function mineCountAround(index) {
        const x = index % size;
        const y =
            Math.floor(index / size);

        let count = 0;

        for (
            let dy = -1;
            dy <= 1;
            dy++
        ) {
            for (
                let dx = -1;
                dx <= 1;
                dx++
            ) {
                const nx = x + dx;
                const ny = y + dy;

                if (
                    nx >= 0 &&
                    nx < size &&
                    ny >= 0 &&
                    ny < size
                ) {
                    if (
                        mines.has(
                            ny * size + nx
                        )
                    ) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    function render() {
        board.innerHTML =
            Array.from(
                { length: total },
                (_, index) => {
                    const isOpen =
                        opened.has(index);

                    const isMine =
                        mines.has(index);

                    const count =
                        mineCountAround(index);

                    return `
                        <button
                            type="button"
                            data-mine="${index}"
                            style="
                                aspect-ratio:1;
                                padding:0;
                            "
                        >
                            ${
                                isOpen
                                    ? isMine
                                        ? "💣"
                                        : count || ""
                                    : ""
                            }
                        </button>
                    `;
                }
            ).join("");

        board
            .querySelectorAll("[data-mine]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        reveal(
                            Number(
                                button.dataset.mine
                            )
                        );
                    }
                );
            });
    }

    function reveal(index) {
        if (
            ended ||
            opened.has(index)
        ) {
            return;
        }

        if (mines.has(index)) {
            ended = true;

            render();

            showGameMessage(
                container,
                "💣",
                "Game Over",
                "You hit a mine."
            );

            return;
        }

        opened.add(index);

        if (
            mineCountAround(index) === 0
        ) {
            const x = index % size;
            const y =
                Math.floor(
                    index / size
                );

            for (
                let dy = -1;
                dy <= 1;
                dy++
            ) {
                for (
                    let dx = -1;
                    dx <= 1;
                    dx++
                ) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (
                        nx >= 0 &&
                        nx < size &&
                        ny >= 0 &&
                        ny < size
                    ) {
                        const next =
                            ny * size + nx;

                        if (
                            !mines.has(next)
                        ) {
                            opened.add(
                                next
                            );
                        }
                    }
                }
            }
        }

        render();

        if (
            opened.size >=
            total - mineCount
        ) {
            ended = true;

            saveHighScore(
                "minesweeper",
                getHighScore(
                    "minesweeper"
                ) + 1
            );

            showGameMessage(
                container,
                "💣",
                "You Win!",
                "The whole board is clear."
            );
        }
    }

    render();

    return () => {
        ended = true;
    };
}

/* =========================================================
   22. SIMPLE CANVAS GAMES
   ========================================================= */

function createPong(container) {
    return createCanvasArcade(
        container,
        "pong",
        "🏓",
        "Pong"
    );
}

function createBreakout(container) {
    return createCanvasArcade(
        container,
        "breakout",
        "🧱",
        "Breakout"
    );
}

function createDodge(container) {
    return createCanvasArcade(
        container,
        "dodge",
        "🚧",
        "Dodge Blocks"
    );
}

function createCoin(container) {
    return createCanvasArcade(
        container,
        "coin",
        "🪙",
        "Coin Catcher"
    );
}

function createTarget(container) {
    return createCanvasArcade(
        container,
        "target",
        "🎯",
        "Target Tap"
    );
}

function createCanvasArcade(
    container,
    id,
    icon,
    title
) {
    let score = 0;

    let x = 50;
    let y = 50;

    let vx = 1.5;
    let vy = 1.2;

    let raf = null;
    let stopped = false;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore(id))}

        <canvas
            id="arcadeCanvas"
            width="600"
            height="360"
            style="
                display:block;
                width:100%;
                max-width:600px;
                margin:auto;
                background:#111;
                border-radius:18px;
                touch-action:none;
            "
        ></canvas>

        <p style="text-align:center">
            Tap the object to score.
        </p>
    `);

    const canvas =
        $("#arcadeCanvas");

    const ctx =
        canvas.getContext("2d");

    function draw() {
        if (stopped) {
            return;
        }

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(
            x * 6,
            y * 3.6,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

        x += vx;
        y += vy;

        if (
            x <= 5 ||
            x >= 95
        ) {
            vx *= -1;
        }

        if (
            y <= 5 ||
            y >= 95
        ) {
            vy *= -1;
        }

        raf =
            requestAnimationFrame(draw);
    }

    canvas.addEventListener(
        "pointerdown",
        event => {
            event.preventDefault();

            score++;

            setGameScore(score);

            saveHighScore(
                id,
                score
            );

            const rect =
                canvas.getBoundingClientRect();

            x =
                ((event.clientX -
                    rect.left) /
                    rect.width) *
                100;

            y =
                ((event.clientY -
                    rect.top) /
                    rect.height) *
                100;
        }
    );

    draw();

    return () => {
        stopped = true;

        cancelAnimationFrame(raf);
    };
}

/* =========================================================
   23. TREASURE
   ========================================================= */

function createTreasure(container) {
    let treasure =
        Math.floor(
            Math.random() * 25
        );

    let attempts = 0;

    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("treasure"))}

        <div
            id="treasureBoard"
            style="
                display:grid;
                grid-template-columns:repeat(5,1fr);
                gap:6px;
                max-width:400px;
                margin:auto;
            "
        ></div>

        <p style="text-align:center">
            Find the hidden treasure 💎
        </p>
    `);

    const board =
        $("#treasureBoard");

    function render() {
        board.innerHTML =
            Array.from(
                { length: 25 },
                (_, index) => `
                    <button
                        type="button"
                        class="game-button"
                        data-treasure="${index}"
                        style="aspect-ratio:1"
                    >
                        ?
                    </button>
                `
            ).join("");

        board
            .querySelectorAll(
                "[data-treasure]"
            )
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        attempts++;

                        setGameScore(
                            attempts
                        );

                        const index =
                            Number(
                                button.dataset.treasure
                            );

                        if (
                            index ===
                            treasure
                        ) {
                            button.textContent =
                                "💎";

                            saveHighScore(
                                "treasure",
                                Math.max(
                                    1,
                                    100 -
                                        attempts
                                )
                            );

                            showGameMessage(
                                container,
                                "💎",
                                "Treasure Found!",
                                `Attempts: ${attempts}`
                            );
                        } else {
                            button.textContent =
                                "•";
                        }
                    }
                );
            });
    }

    render();

    return () => {};
}

/* =========================================================
   24. SIMPLE FALLBACK
   ========================================================= */

function createSimpleGame(
    container,
    title,
    icon
) {
    container.innerHTML = gameLayout(`
        ${infoBar(0)}

        <div
            style="
                text-align:center;
                padding:40px 10px;
            "
        >
            <div style="font-size:4rem">
                ${icon}
            </div>

            <h2>${title}</h2>

            <p>
                Game loaded successfully.
            </p>
        </div>
    `);

    return () => {};
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {
    setupTheme();
    setupCategories();
    setupSearch();
    setupNavigation();
    renderGames();
}

/* =========================================================
   START APP
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApp,
        { once: true }
    );
} else {
    initializeApp();
}
