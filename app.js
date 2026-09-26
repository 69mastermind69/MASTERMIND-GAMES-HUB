"use strict";

/* =========================================================
   MASTERMIND GAMES HUB
   Developer: MASTERMIND
   Version: 1.0.0
   Offline Game Hub - No external libraries required
   ========================================================= */

const games = [
    {
        id: "snake",
        title: "Snake",
        icon: "🐍",
        category: "Arcade",
        description: "Eat food and grow the snake.",
        start: startSnake
    },
    {
        id: "tictactoe",
        title: "Tic-Tac-Toe",
        icon: "⭕",
        category: "Puzzle",
        description: "Beat the computer in 3×3.",
        start: startTicTacToe
    },
    {
        id: "2048",
        title: "2048",
        icon: "🔢",
        category: "Puzzle",
        description: "Join numbers to reach 2048.",
        start: start2048
    },
    {
        id: "memory",
        title: "Memory Match",
        icon: "🧠",
        category: "Puzzle",
        description: "Find all matching pairs.",
        start: startMemory
    },
    {
        id: "reaction",
        title: "Reaction Test",
        icon: "⚡",
        category: "Quick",
        description: "Test how fast you can react.",
        start: startReaction
    },
    {
        id: "numberguess",
        title: "Number Guess",
        icon: "🎯",
        category: "Quick",
        description: "Guess the secret number.",
        start: startNumberGuess
    },
    {
        id: "pong",
        title: "Pong",
        icon: "🏓",
        category: "Arcade",
        description: "Play classic paddle tennis.",
        start: startPong
    },
    {
        id: "breakout",
        title: "Breakout",
        icon: "🧱",
        category: "Arcade",
        description: "Break every brick.",
        start: startBreakout
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        icon: "💣",
        category: "Puzzle",
        description: "Clear the board without mines.",
        start: startMinesweeper
    },
    {
        id: "connect4",
        title: "Connect Four",
        icon: "🔴",
        category: "Board",
        description: "Connect four pieces in a row.",
        start: startConnectFour
    },
    {
        id: "rps",
        title: "Rock Paper Scissors",
        icon: "✊",
        category: "Quick",
        description: "Choose your move and play.",
        start: startRPS
    },
    {
        id: "simon",
        title: "Simon Says",
        icon: "🎵",
        category: "Memory",
        description: "Remember the color sequence.",
        start: startSimon
    },
    {
        id: "whack",
        title: "Whack-a-Mole",
        icon: "🐹",
        category: "Arcade",
        description: "Tap the mole before it moves.",
        start: startWhack
    },
    {
        id: "sliding",
        title: "Sliding Puzzle",
        icon: "🧩",
        category: "Puzzle",
        description: "Arrange the tiles in order.",
        start: startSlidingPuzzle
    },
    {
        id: "colormatch",
        title: "Color Match",
        icon: "🎨",
        category: "Quick",
        description: "Find the correct color.",
        start: startColorMatch
    },
    {
        id: "math",
        title: "Math Sprint",
        icon: "➗",
        category: "Quick",
        description: "Solve as many sums as possible.",
        start: startMathSprint
    },
    {
        id: "tap",
        title: "Tap Counter",
        icon: "👆",
        category: "Quick",
        description: "Tap as fast as you can.",
        start: startTapCounter
    },
    {
        id: "word",
        title: "Word Guess",
        icon: "🔤",
        category: "Puzzle",
        description: "Guess the hidden word.",
        start: startWordGuess
    },
    {
        id: "dodge",
        title: "Dodge Blocks",
        icon: "🚀",
        category: "Arcade",
        description: "Avoid falling blocks.",
        start: startDodgeBlocks
    },
    {
        id: "coin",
        title: "Coin Catcher",
        icon: "🪙",
        category: "Arcade",
        description: "Catch coins and avoid bombs.",
        start: startCoinCatcher
    }
];

/* =========================================================
   APP STATE
   ========================================================= */

let currentGame = null;
let cleanupCurrentGame = null;
let activeCategory = "All";
let searchText = "";

const gameContainer = document.getElementById("gameContainer");
const gameGrid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");

const currentGameIcon = document.getElementById("currentGameIcon");
const currentGameTitle = document.getElementById("currentGameTitle");
const currentGameCategory = document.getElementById("currentGameCategory");

const themeToggle = document.getElementById("themeToggle");

const scores = JSON.parse(
    localStorage.getItem("mgh_scores") || "{}"
);

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function saveScores() {
    localStorage.setItem("mgh_scores", JSON.stringify(scores));
}

function saveHighScore(gameId, score) {
    score = Number(score) || 0;

    if (!scores[gameId] || score > scores[gameId]) {
        scores[gameId] = score;
        saveScores();
        return true;
    }

    return false;
}

function getHighScore(gameId) {
    return Number(scores[gameId] || 0);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function clearGameContainer() {
    if (gameContainer) {
        gameContainer.innerHTML = "";
    }
}

function setGameContent(html) {
    gameContainer.innerHTML = html;
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function showMessage(icon, title, text, buttonText = "OK", callback = null) {
    let overlay = document.getElementById("messageOverlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "messageOverlay";
        overlay.className = "message-overlay";

        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div class="message-box">
            <div class="message-icon">${icon}</div>
            <h2>${title}</h2>
            <p>${text}</p>
            <div class="message-actions">
                <button class="primary-button" id="messageOkButton">${buttonText}</button>
            </div>
        </div>
    `;

    overlay.classList.remove("hidden");

    const button = document.getElementById("messageOkButton");

    button.addEventListener("click", () => {
        overlay.classList.add("hidden");

        if (callback) {
            callback();
        }
    });
}

function getGame(id) {
    return games.find(game => game.id === id);
}

function gameEndMessage(title, score) {
    const high = getHighScore(currentGame.id);
    const isNew = saveHighScore(currentGame.id, score);

    showMessage(
        isNew ? "🏆" : "🎮",
        title,
        `Score: ${score} | Best: ${Math.max(score, high)}`,
        "Play Again",
        () => {
            restartCurrentGame();
        }
    );
}

/* =========================================================
   HOME SCREEN
   ========================================================= */

function renderCategories() {
    const area = document.querySelector(".category-area");

    if (!area) {
        return;
    }

    const categories = [
        "All",
        ...new Set(games.map(game => game.category))
    ];

    area.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");

        button.className = "category-button";
        button.textContent = category;

        if (category === activeCategory) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            activeCategory = category;
            renderCategories();
            renderGameCards();
        });

        area.appendChild(button);
    });
}

function renderGameCards() {
    if (!gameGrid) {
        return;
    }

    gameGrid.innerHTML = "";

    const filtered = games.filter(game => {
        const matchesCategory =
            activeCategory === "All" ||
            game.category === activeCategory;

        const search = searchText.toLowerCase();

        const matchesSearch =
            !search ||
            game.title.toLowerCase().includes(search) ||
            game.category.toLowerCase().includes(search) ||
            game.description.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        gameGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔎</div>
                <h3>No games found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }

    filtered.forEach(game => {
        const card = document.createElement("article");

        card.className = "game-card";

        card.innerHTML = `
            <div>
                <div class="game-card-top">
                    <div class="game-icon">${game.icon}</div>
                    <span class="game-category">${game.category}</span>
                </div>

                <h3>${game.title}</h3>
                <p>${game.description}</p>
            </div>

            <button class="play-button">
                PLAY
            </button>
        `;

        const playButton = card.querySelector(".play-button");

        playButton.addEventListener("click", () => {
            openGame(game.id);
        });

        gameGrid.appendChild(card);
    });
}

/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */

function openGame(gameId) {
    const game = getGame(gameId);

    if (!game) {
        return;
    }

    if (cleanupCurrentGame) {
        cleanupCurrentGame();
        cleanupCurrentGame = null;
    }

    currentGame = game;

    homeScreen.classList.remove("active");
    gameScreen.classList.add("active");

    currentGameIcon.textContent = game.icon;
    currentGameTitle.textContent = game.title;
    currentGameCategory.textContent = game.category;

    clearGameContainer();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    cleanupCurrentGame = game.start() || null;
}

function backToHome() {
    if (cleanupCurrentGame) {
        cleanupCurrentGame();
        cleanupCurrentGame = null;
    }

    currentGame = null;

    clearGameContainer();

    gameScreen.classList.remove("active");
    homeScreen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function restartCurrentGame() {
    if (!currentGame) {
        return;
    }

    if (cleanupCurrentGame) {
        cleanupCurrentGame();
        cleanupCurrentGame = null;
    }

    clearGameContainer();

    cleanupCurrentGame = currentGame.start() || null;
}

if (backButton) {
    backButton.addEventListener("click", backToHome);
}

if (restartButton) {
    restartButton.addEventListener("click", restartCurrentGame);
}

if (searchInput) {
    searchInput.addEventListener("input", event => {
        searchText = event.target.value.trim();
        renderGameCards();
    });
}

/* =========================================================
   DARK MODE
   ========================================================= */

function updateThemeButton() {
    if (!themeToggle) {
        return;
    }

    const dark =
        document.body.classList.contains("dark-mode");

    themeToggle.textContent = dark ? "☀️" : "🌙";
}

function loadTheme() {
    const theme = localStorage.getItem("mgh_theme");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeButton();
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const dark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "mgh_theme",
            dark ? "dark" : "light"
        );

        updateThemeButton();
    });
}

/* =========================================================
   SNAKE
   ========================================================= */

function startSnake() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="snakeScore">0</b></span>
            <span>Best: <b>${getHighScore("snake")}</b></span>
        </div>

        <canvas id="snakeCanvas"
                class="game-canvas"
                width="360"
                height="360"></canvas>

        <div class="direction-controls">
            <button class="up">▲</button>
            <button class="left">◀</button>
            <button class="down">▼</button>
            <button class="right">▶</button>
        </div>
    `);

    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("snakeScore");

    const grid = 18;
    const cell = canvas.width / grid;

    let snake = [
        { x: 9, y: 9 },
        { x: 8, y: 9 },
        { x: 7, y: 9 }
    ];

    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };

    let food = createFood();
    let score = 0;
    let timer = null;
    let stopped = false;

    function createFood() {
        let position;

        do {
            position = {
                x: randomInt(0, grid - 1),
                y: randomInt(0, grid - 1)
            };
        } while (
            snake &&
            snake.some(
                part =>
                    part.x === position.x &&
                    part.y === position.y
            )
        );

        return position;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#f1b928";
        ctx.fillRect(
            food.x * cell + 3,
            food.y * cell + 3,
            cell - 6,
            cell - 6
        );

        snake.forEach((part, index) => {
            ctx.fillStyle =
                index === 0 ? "#7c7df7" : "#4f52d8";

            ctx.fillRect(
                part.x * cell + 2,
                part.y * cell + 2,
                cell - 4,
                cell - 4
            );
        });
    }

    function finish() {
        if (stopped) {
            return;
        }

        stopped = true;

        if (timer) {
            clearInterval(timer);
        }

        gameEndMessage("Snake Over!", score);
    }

    function update() {
        direction = nextDirection;

        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        if (
            head.x < 0 ||
            head.x >= grid ||
            head.y < 0 ||
            head.y >= grid
        ) {
            finish();
            return;
        }

        if (
            snake.some(
                part =>
                    part.x === head.x &&
                    part.y === head.y
            )
        ) {
            finish();
            return;
        }

        snake.unshift(head);

        if (
            head.x === food.x &&
            head.y === food.y
        ) {
            score++;
            scoreElement.textContent = score;
            food = createFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function changeDirection(x, y) {
        if (
            direction.x === -x &&
            direction.y === -y
        ) {
            return;
        }

        nextDirection = { x, y };
    }

    function keyboardHandler(event) {
        const key = event.key.toLowerCase();

        if (key === "arrowup" || key === "w") {
            changeDirection(0, -1);
        }

        if (key === "arrowdown" || key === "s") {
            changeDirection(0, 1);
        }

        if (key === "arrowleft" || key === "a") {
            changeDirection(-1, 0);
        }

        if (key === "arrowright" || key === "d") {
            changeDirection(1, 0);
        }
    }

    window.addEventListener("keydown", keyboardHandler);

    document.querySelector(".up")
        .addEventListener("click", () => changeDirection(0, -1));

    document.querySelector(".down")
        .addEventListener("click", () => changeDirection(0, 1));

    document.querySelector(".left")
        .addEventListener("click", () => changeDirection(-1, 0));

    document.querySelector(".right")
        .addEventListener("click", () => changeDirection(1, 0));

    draw();

    timer = setInterval(update, 120);

    return () => {
        stopped = true;

        if (timer) {
            clearInterval(timer);
        }

        window.removeEventListener("keydown", keyboardHandler);
    };
}

/* =========================================================
   TIC TAC TOE
   ========================================================= */

function startTicTacToe() {
    setGameContent(`
        <div class="game-info-bar">
            <span id="tttStatus">Your turn — X</span>
            <span>Best: ${getHighScore("tictactoe")}</span>
        </div>

        <div id="tttBoard" class="ttt-board"></div>

        <button id="tttNew" class="game-button">
            New Game
        </button>
    `);

    const boardElement = document.getElementById("tttBoard");
    const statusElement = document.getElementById("tttStatus");
    const newButton = document.getElementById("tttNew");

    let board = Array(9).fill("");
    let gameOver = false;
    let aiTimer = null;

    function render() {
        boardElement.innerHTML = "";

        board.forEach((value, index) => {
            const cell = document.createElement("button");

            cell.className = "ttt-cell";
            cell.textContent = value;

            cell.addEventListener("click", () => {
                if (gameOver || board[index]) {
                    return;
                }

                board[index] = "X";

                if (checkWinner(board, "X")) {
                    gameOver = true;
                    statusElement.textContent = "You win!";
                    saveHighScore("tictactoe", 1);
                    return render();
                }

                if (board.every(Boolean)) {
                    gameOver = true;
                    statusElement.textContent = "Draw!";
                    return render();
                }

                statusElement.textContent = "Computer thinking...";
                render();

                aiTimer = setTimeout(aiMove, 400);
            });

            boardElement.appendChild(cell);
        });
    }

    function aiMove() {
        if (gameOver) {
            return;
        }

        let move = findWinningMove("O");

        if (move === -1) {
            move = findWinningMove("X");
        }

        if (move === -1) {
            const empty = board
                .map((value, index) => value ? -1 : index)
                .filter(index => index !== -1);

            if (empty.length) {
                move = empty[
                    randomInt(0, empty.length - 1)
                ];
            }
        }

        if (move !== -1) {
            board[move] = "O";
        }

        if (checkWinner(board, "O")) {
            gameOver = true;
            statusElement.textContent = "Computer wins!";
        } else if (board.every(Boolean)) {
            gameOver = true;
            statusElement.textContent = "Draw!";
        } else {
            statusElement.textContent = "Your turn — X";
        }

        render();
    }

    function findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = player;

                const win = checkWinner(board, player);

                board[i] = "";

                if (win) {
                    return i;
                }
            }
        }

        return -1;
    }

    function reset() {
        if (aiTimer) {
            clearTimeout(aiTimer);
        }

        board = Array(9).fill("");
        gameOver = false;
        statusElement.textContent = "Your turn — X";

        render();
    }

    newButton.addEventListener("click", reset);

    render();

    return () => {
        if (aiTimer) {
            clearTimeout(aiTimer);
        }
    };
}

function checkWinner(board, player) {
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

    return wins.some(
        line =>
            board[line[0]] === player &&
            board[line[1]] === player &&
            board[line[2]] === player
    );
}

/* =========================================================
   2048
   ========================================================= */

function start2048() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="game2048Score">0</b></span>
            <span>Best: <b>${getHighScore("2048")}</b></span>
        </div>

        <div class="game-2048">
            <div id="grid2048" class="grid-2048"></div>
        </div>

        <p style="margin-top:14px;">
            Use Arrow Keys or swipe.
        </p>
    `);

    const gridElement = document.getElementById("grid2048");
    const scoreElement = document.getElementById("game2048Score");

    let board = Array(16).fill(0);
    let score = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    function addTile() {
        const empty = [];

        board.forEach((value, index) => {
            if (value === 0) {
                empty.push(index);
            }
        });

        if (!empty.length) {
            return;
        }

        const index =
            empty[randomInt(0, empty.length - 1)];

        board[index] = Math.random() < 0.9 ? 2 : 4;
    }

    function render() {
        gridElement.innerHTML = "";

        board.forEach(value => {
            const tile = document.createElement("div");

            tile.className = "tile-2048";
            tile.textContent = value || "";

            gridElement.appendChild(tile);
        });

        scoreElement.textContent = score;
    }

    function slideRow(row) {
        const values = row.filter(value => value !== 0);
        const result = [];

        for (let i = 0; i < values.length; i++) {
            if (values[i] === values[i + 1]) {
                const merged = values[i] * 2;

                result.push(merged);
                score += merged;
                i++;
            } else {
                result.push(values[i]);
            }
        }

        while (result.length < 4) {
            result.push(0);
        }

        return result;
    }

    function move(direction) {
        const oldBoard = [...board];

        if (direction === "left") {
            for (let row = 0; row < 4; row++) {
                const start = row * 4;

                board.splice(
                    start,
                    4,
                    ...slideRow(board.slice(start, start + 4))
                );
            }
        }

        if (direction === "right") {
            for (let row = 0; row < 4; row++) {
                const start = row * 4;

                const result = slideRow(
                    board
                        .slice(start, start + 4)
                        .reverse()
                ).reverse();

                board.splice(start, 4, ...result);
            }
        }

        if (direction === "up") {
            for (let col = 0; col < 4; col++) {
                const column = [];

                for (let row = 0; row < 4; row++) {
                    column.push(board[row * 4 + col]);
                }

                const result = slideRow(column);

                for (let row = 0; row < 4; row++) {
                    board[row * 4 + col] = result[row];
                }
            }
        }

        if (direction === "down") {
            for (let col = 0; col < 4; col++) {
                const column = [];

                for (let row = 0; row < 4; row++) {
                    column.push(board[row * 4 + col]);
                }

                const result = slideRow(column.reverse())
                    .reverse();

                for (let row = 0; row < 4; row++) {
                    board[row * 4 + col] = result[row];
                }
            }
        }

        const changed = board.some(
            (value, index) => value !== oldBoard[index]
        );

        if (changed) {
            addTile();
            render();

            if (board.includes(2048)) {
                showMessage(
                    "🏆",
                    "2048 Reached!",
                    `Amazing! Your score is ${score}.`,
                    "Continue",
                    () => {}
                );
            } else if (!canMove()) {
                gameEndMessage("Game Over!", score);
            }
        }
    }

    function canMove() {
        if (board.includes(0)) {
            return true;
        }

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const index = row * 4 + col;

                if (
                    col < 3 &&
                    board[index] === board[index + 1]
                ) {
                    return true;
                }

                if (
                    row < 3 &&
                    board[index] === board[index + 4]
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    function keyHandler(event) {
        const map = {
            ArrowLeft: "left",
            ArrowRight: "right",
            ArrowUp: "up",
            ArrowDown: "down"
        };

        if (map[event.key]) {
            event.preventDefault();
            move(map[event.key]);
        }
    }

    function touchStart(event) {
        const touch = event.touches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function touchEnd(event) {
        const touch = event.changedTouches[0];

        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) {
            return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
            move(dx > 0 ? "right" : "left");
        } else {
            move(dy > 0 ? "down" : "up");
        }
    }

    window.addEventListener("keydown", keyHandler);

    gameContainer.addEventListener("touchstart", touchStart, {
        passive: true
    });

    gameContainer.addEventListener("touchend", touchEnd, {
        passive: true
    });

    addTile();
    addTile();
    render();

    return () => {
        window.removeEventListener("keydown", keyHandler);
        gameContainer.removeEventListener("touchstart", touchStart);
        gameContainer.removeEventListener("touchend", touchEnd);
    };
}

/* =========================================================
   MEMORY MATCH
   ========================================================= */

function startMemory() {
    const symbols = [
        "🍎", "🍌", "🍇", "🍉",
        "🍎", "🍌", "🍇", "🍉",
        "🚗", "🚀", "⚽", "🎯",
        "🚗", "🚀", "⚽", "🎯"
    ];

    const cards = shuffle(symbols);

    setGameContent(`
        <div class="game-info-bar">
            <span>Moves: <b id="memoryMoves">0</b></span>
            <span>Pairs: <b id="memoryPairs">0</b>/8</span>
        </div>

        <div id="memoryGrid" class="memory-grid"></div>
    `);

    const grid = document.getElementById("memoryGrid");
    const movesElement = document.getElementById("memoryMoves");
    const pairsElement = document.getElementById("memoryPairs");

    let first = null;
    let second = null;
    let locked = false;
    let moves = 0;
    let pairs = 0;
    let flipTimer = null;

    cards.forEach((symbol, index) => {
        const button = document.createElement("button");

        button.className = "memory-card";
        button.textContent = "?";

        button.addEventListener("click", () => {
            if (
                locked ||
                button.classList.contains("flipped") ||
                button.classList.contains("matched")
            ) {
                return;
            }

            button.classList.add("flipped");
            button.textContent = symbol;

            if (!first) {
                first = {
                    button,
                    symbol
                };

                return;
            }

            second = {
                button,
                symbol
            };

            moves++;
            movesElement.textContent = moves;

            if (first.symbol === second.symbol) {
                first.button.classList.add("matched");
                second.button.classList.add("matched");

                first = null;
                second = null;

                pairs++;
                pairsElement.textContent = pairs;

                if (pairs === 8) {
                    saveHighScore("memory", Math.max(1, 1000 - moves));

                    setTimeout(() => {
                        showMessage(
                            "🧠",
                            "You Won!",
                            `All pairs found in ${moves} moves.`,
                            "Play Again",
                            () => restartCurrentGame()
                        );
                    }, 300);
                }
            } else {
                locked = true;

                flipTimer = setTimeout(() => {
                    first.button.classList.remove("flipped");
                    first.button.textContent = "?";

                    second.button.classList.remove("flipped");
                    second.button.textContent = "?";

                    first = null;
                    second = null;
                    locked = false;
                }, 700);
            }
        });

        grid.appendChild(button);
    });

    return () => {
        if (flipTimer) {
            clearTimeout(flipTimer);
        }
    };
}

/* =========================================================
   REACTION TEST
   ========================================================= */

function startReaction() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Best: ${getHighScore("reaction")} ms</span>
        </div>

        <div id="reactionBox" class="reaction-box">
            Click to start
        </div>
    `);

    const box = document.getElementById("reactionBox");

    let state = "start";
    let timer = null;
    let startTime = 0;

    function clickHandler() {
        if (state === "start") {
            state = "waiting";

            box.className = "reaction-box waiting";
            box.textContent = "Wait for green...";

            const delay = randomInt(1200, 3500);

            timer = setTimeout(() => {
                state = "ready";
                startTime = performance.now();

                box.className = "reaction-box ready";
                box.textContent = "CLICK NOW!";
            }, delay);

            return;
        }

        if (state === "waiting") {
            if (timer) {
                clearTimeout(timer);
            }

            state = "start";
            box.className = "reaction-box";
            box.textContent = "Too early! Click to try again.";

            return;
        }

        if (state === "ready") {
            const reaction =
                Math.round(performance.now() - startTime);

            state = "result";

            box.className = "reaction-box";
            box.textContent = `${reaction} ms — Click to try again`;

            if (
                !getHighScore("reaction") ||
                reaction < getHighScore("reaction")
            ) {
                scores.reaction = reaction;
                saveScores();
            }

            return;
        }

        state = "start";
        box.className = "reaction-box";
        box.textContent = "Click to start";
    }

    box.addEventListener("click", clickHandler);

    return () => {
        if (timer) {
            clearTimeout(timer);
        }

        box.removeEventListener("click", clickHandler);
    };
}

/* =========================================================
   NUMBER GUESS
   ========================================================= */

function startNumberGuess() {
    setGameContent(`
        <h2>Guess 1–100</h2>

        <p id="guessHint">
            You have 7 attempts.
        </p>

        <div style="margin-top:18px;">
            <input
                id="guessInput"
                class="game-input"
                type="number"
                min="1"
                max="100"
                placeholder="Enter number"
            >
        </div>

        <button
            id="guessButton"
            class="game-button"
            style="margin-top:12px;"
        >
            Guess
        </button>

        <div class="game-info-bar" style="margin-top:20px;">
            <span>Attempts: <b id="guessAttempts">0</b>/7</span>
        </div>
    `);

    const input = document.getElementById("guessInput");
    const button = document.getElementById("guessButton");
    const hint = document.getElementById("guessHint");
    const attemptsElement =
        document.getElementById("guessAttempts");

    const secret = randomInt(1, 100);

    let attempts = 0;
    let finished = false;

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
            hint.textContent =
                "Please enter a number from 1 to 100.";

            return;
        }

        attempts++;
        attemptsElement.textContent = attempts;

        if (value === secret) {
            finished = true;

            const score = Math.max(
                10,
                100 - (attempts - 1) * 10
            );

            saveHighScore("numberguess", score);

            showMessage(
                "🎯",
                "Correct!",
                `You found the number in ${attempts} attempts.`,
                "Play Again",
                () => restartCurrentGame()
            );

            return;
        }

        if (attempts >= 7) {
            finished = true;

            showMessage(
                "🎮",
                "Game Over",
                `The number was ${secret}.`,
                "Play Again",
                () => restartCurrentGame()
            );

            return;
        }

        hint.textContent =
            value < secret
                ? "Too low! Try a higher number."
                : "Too high! Try a lower number.";

        input.value = "";
        input.focus();
    }

    button.addEventListener("click", guess);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            guess();
        }
    });

    input.focus();

    return () => {};
}

/* =========================================================
   PONG
   ========================================================= */

function startPong() {
    setGameContent(`
        <div class="game-info-bar">
            <span>You: <b id="pongPlayer">0</b></span>
            <span>Computer: <b id="pongAI">0</b></span>
        </div>

        <canvas
            id="pongCanvas"
            class="game-canvas"
            width="500"
            height="300"
        ></canvas>

        <p style="margin-top:12px;">
            Move with Arrow Keys, W/S, or mouse.
        </p>
    `);

    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");

    const playerElement =
        document.getElementById("pongPlayer");

    const aiElement =
        document.getElementById("pongAI");

    let playerY = 120;
    let aiY = 120;

    const paddleWidth = 10;
    const paddleHeight = 70;

    let ball = {
        x: 250,
        y: 150,
        vx: 4,
        vy: 3
    };

    let playerScore = 0;
    let aiScore = 0;

    let animation = null;
    let keys = {};

    function resetBall(direction) {
        ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: direction * 4,
            vy: randomInt(-3, 3) || 2
        };
    }

    function draw() {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#7c7df7";

        ctx.fillRect(
            15,
            playerY,
            paddleWidth,
            paddleHeight
        );

        ctx.fillRect(
            canvas.width - 25,
            aiY,
            paddleWidth,
            paddleHeight
        );

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 7, 0, Math.PI * 2);
        ctx.fill();
    }

    function update() {
        if (keys.ArrowUp || keys.w) {
            playerY -= 6;
        }

        if (keys.ArrowDown || keys.s) {
            playerY += 6;
        }

        playerY = Math.max(
            0,
            Math.min(canvas.height - paddleHeight, playerY)
        );

        const target = ball.y - paddleHeight / 2;

        aiY += (target - aiY) * 0.06;

        aiY = Math.max(
            0,
            Math.min(canvas.height - paddleHeight, aiY)
        );

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (
            ball.y <= 7 ||
            ball.y >= canvas.height - 7
        ) {
            ball.vy *= -1;
        }

        if (
            ball.x - 7 <= 25 &&
            ball.y >= playerY &&
            ball.y <= playerY + paddleHeight &&
            ball.vx < 0
        ) {
            ball.vx = Math.abs(ball.vx) + 0.15;

            const hit =
                (ball.y - (playerY + paddleHeight / 2)) /
                (paddleHeight / 2);

            ball.vy = hit * 5;
        }

        if (
            ball.x + 7 >= canvas.width - 25 &&
            ball.y >= aiY &&
            ball.y <= aiY + paddleHeight &&
            ball.vx > 0
        ) {
            ball.vx = -Math.abs(ball.vx) - 0.15;

            const hit =
                (ball.y - (aiY + paddleHeight / 2)) /
                (paddleHeight / 2);

            ball.vy = hit * 5;
        }

        if (ball.x < -20) {
            aiScore++;
            aiElement.textContent = aiScore;

            if (aiScore >= 5) {
                endPong();
                return;
            }

            resetBall(1);
        }

        if (ball.x > canvas.width + 20) {
            playerScore++;
            playerElement.textContent = playerScore;

            if (playerScore >= 5) {
                endPong();
                return;
            }

            resetBall(-1);
        }

        draw();
        animation = requestAnimationFrame(update);
    }

    function endPong() {
        if (animation) {
            cancelAnimationFrame(animation);
        }

        const score = playerScore * 100;

        saveHighScore("pong", score);

        showMessage(
            playerScore > aiScore ? "🏆" : "🏓",
            playerScore > aiScore ? "You Win!" : "Game Over",
            `Final score: ${playerScore} - ${aiScore}`,
            "Play Again",
            () => restartCurrentGame()
        );
    }

    function keyDown(event) {
        keys[event.key] = true;

        if (
            ["ArrowUp", "ArrowDown", " "].includes(event.key)
        ) {
            event.preventDefault();
        }
    }

    function keyUp(event) {
        keys[event.key] = false;
    }

    function mouseMove(event) {
        const rect = canvas.getBoundingClientRect();

        const y =
            (event.clientY - rect.top) *
            (canvas.height / rect.height);

        playerY = y - paddleHeight / 2;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    canvas.addEventListener("mousemove", mouseMove);

    draw();
    animation = requestAnimationFrame(update);

    return () => {
        if (animation) {
            cancelAnimationFrame(animation);
        }

        window.removeEventListener("keydown", keyDown);
        window.removeEventListener("keyup", keyUp);
        canvas.removeEventListener("mousemove", mouseMove);
    };
}

/* =========================================================
   BREAKOUT
   ========================================================= */

function startBreakout() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="breakoutScore">0</b></span>
            <span>Lives: <b id="breakoutLives">3</b></span>
        </div>

        <canvas
            id="breakoutCanvas"
            class="game-canvas"
            width="500"
            height="360"
        ></canvas>

        <p style="margin-top:12px;">
            Move with Arrow Keys or mouse.
        </p>
    `);

    const canvas = document.getElementById("breakoutCanvas");
    const ctx = canvas.getContext("2d");

    const scoreElement =
        document.getElementById("breakoutScore");

    const livesElement =
        document.getElementById("breakoutLives");

    const paddle = {
        x: 210,
        y: 330,
        width: 80,
        height: 10,
        speed: 7
    };

    let ball = {
        x: 250,
        y: 300,
        vx: 4,
        vy: -4,
        radius: 7
    };

    const rows = 5;
    const cols = 8;
    const bricks = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            bricks.push({
                x: 25 + col * 59,
                y: 30 + row * 25,
                width: 50,
                height: 16,
                alive: true
            });
        }
    }

    let score = 0;
    let lives = 3;
    let keys = {};
    let animation = null;
    let stopped = false;

    function resetBall() {
        ball = {
            x: canvas.width / 2,
            y: canvas.height - 55,
            vx: Math.random() < 0.5 ? -4 : 4,
            vy: -4,
            radius: 7
        };
    }

    function draw() {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bricks.forEach(brick => {
            if (!brick.alive) {
                return;
            }

            ctx.fillStyle = "#7c7df7";

            ctx.fillRect(
                brick.x,
                brick.y,
                brick.width,
                brick.height
            );
        });

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );

        ctx.beginPath();
        ctx.arc(
            ball.x,
            ball.y,
            ball.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    function endGame(win) {
        stopped = true;

        if (animation) {
            cancelAnimationFrame(animation);
        }

        saveHighScore("breakout", score);

        showMessage(
            win ? "🏆" : "🧱",
            win ? "You Win!" : "Game Over",
            `Score: ${score}`,
            "Play Again",
            () => restartCurrentGame()
        );
    }

    function update() {
        if (stopped) {
            return;
        }

        if (keys.ArrowLeft) {
            paddle.x -= paddle.speed;
        }

        if (keys.ArrowRight) {
            paddle.x += paddle.speed;
        }

        paddle.x = Math.max(
            0,
            Math.min(
                canvas.width - paddle.width,
                paddle.x
            )
        );

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (
            ball.x - ball.radius <= 0 ||
            ball.x + ball.radius >= canvas.width
        ) {
            ball.vx *= -1;
        }

        if (ball.y - ball.radius <= 0) {
            ball.vy *= -1;
        }

        if (
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width &&
            ball.vy > 0
        ) {
            ball.vy = -Math.abs(ball.vy);

            const hit =
                (ball.x -
                    (paddle.x + paddle.width / 2)) /
                (paddle.width / 2);

            ball.vx = hit * 5;
        }

        bricks.forEach(brick => {
            if (!brick.alive) {
                return;
            }

            if (
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius <
                    brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius <
                    brick.y + brick.height
            ) {
                brick.alive = false;
                ball.vy *= -1;

                score += 10;
                scoreElement.textContent = score;

                if (
                    bricks.every(
                        item => !item.alive
                    )
                ) {
                    endGame(true);
                }
            }
        });

        if (ball.y > canvas.height + 20) {
            lives--;
            livesElement.textContent = lives;

            if (lives <= 0) {
                endGame(false);
                return;
            }

            resetBall();
        }

        draw();

        animation = requestAnimationFrame(update);
    }

    function keyDown(event) {
        keys[event.key] = true;
    }

    function keyUp(event) {
        keys[event.key] = false;
    }

    function mouseMove(event) {
        const rect = canvas.getBoundingClientRect();

        paddle.x =
            (event.clientX - rect.left) *
                (canvas.width / rect.width) -
            paddle.width / 2;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    canvas.addEventListener("mousemove", mouseMove);

    draw();
    animation = requestAnimationFrame(update);

    return () => {
        stopped = true;

        if (animation) {
            cancelAnimationFrame(animation);
        }

        window.removeEventListener("keydown", keyDown);
        window.removeEventListener("keyup", keyUp);
        canvas.removeEventListener("mousemove", mouseMove);
    };
}

/* =========================================================
   MINESWEEPER
   ========================================================= */

function startMinesweeper() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Mines: <b id="mineCount">10</b></span>
            <span>Flags: <b id="flagCount">0</b></span>
        </div>

        <div id="mineGrid" class="mine-grid"></div>

        <p style="margin-top:15px;">
            Left click = reveal | Right click = flag
        </p>
    `);

    const gridElement = document.getElementById("mineGrid");
    const mineCountElement =
        document.getElementById("mineCount");
    const flagCountElement =
        document.getElementById("flagCount");

    const size = 8;
    const totalMines = 10;

    let cells = [];
    let flags = 0;
    let gameOver = false;

    function createBoard() {
        cells = Array.from(
            { length: size * size },
            (_, index) => ({
                index,
                mine: false,
                revealed: false,
                flagged: false,
                number: 0
            })
        );

        const mineIndexes = shuffle(
            Array.from(
                { length: size * size },
                (_, index) => index
            )
        ).slice(0, totalMines);

        mineIndexes.forEach(index => {
            cells[index].mine = true;
        });

        cells.forEach(cell => {
            if (cell.mine) {
                return;
            }

            const neighbors = getMineNeighbors(
                cell.index
            );

            cell.number = neighbors.filter(
                item => cells[item].mine
            ).length;
        });
    }

    function getMineNeighbors(index) {
        const row = Math.floor(index / size);
        const col = index % size;
        const result = [];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) {
                    continue;
                }

                const nr = row + dr;
                const nc = col + dc;

                if (
                    nr >= 0 &&
                    nr < size &&
                    nc >= 0 &&
                    nc < size
                ) {
                    result.push(nr * size + nc);
                }
            }
        }

        return result;
    }

    function reveal(index) {
        const cell = cells[index];

        if (
            gameOver ||
            cell.revealed ||
            cell.flagged
        ) {
            return;
        }

        cell.revealed = true;

        if (cell.mine) {
            gameOver = true;

            cells.forEach(item => {
                if (item.mine) {
                    item.revealed = true;
                }
            });

            render();

            showMessage(
                "💣",
                "Boom!",
                "You hit a mine.",
                "Play Again",
                () => restartCurrentGame()
            );

            return;
        }

        if (cell.number === 0) {
            getMineNeighbors(index).forEach(
                neighbor => {
                    if (!cells[neighbor].mine) {
                        reveal(neighbor);
                    }
                }
            );
        }

        render();

        const safeCells = cells.filter(
            item => !item.mine
        );

        if (
            safeCells.every(
                item => item.revealed
            )
        ) {
            gameOver = true;

            saveHighScore(
                "minesweeper",
                Math.max(
                    1,
                    1000 - flags * 10
                )
            );

            showMessage(
                "🎉",
                "Board Cleared!",
                "You found all safe cells.",
                "Play Again",
                () => restartCurrentGame()
            );
        }
    }

    function toggleFlag(index, event) {
        event.preventDefault();

        const cell = cells[index];

        if (
            gameOver ||
            cell.revealed
        ) {
            return;
        }

        cell.flagged = !cell.flagged;

        flags += cell.flagged ? 1 : -1;

        flagCountElement.textContent = flags;

        render();
    }

    function render() {
        gridElement.innerHTML = "";

        cells.forEach(cell => {
            const button = document.createElement("button");

            button.className = "mine-cell";

            if (cell.revealed) {
                button.classList.add("revealed");

                if (cell.mine) {
                    button.classList.add("mine");
                    button.textContent = "💣";
                } else if (cell.number > 0) {
                    button.textContent =
                        cell.number;
                }
            } else if (cell.flagged) {
                button.textContent = "🚩";
            }

            button.addEventListener(
                "click",
                () => reveal(cell.index)
            );

            button.addEventListener(
                "contextmenu",
                event =>
                    toggleFlag(cell.index, event)
            );

            gridElement.appendChild(button);
        });

        mineCountElement.textContent =
            totalMines;
    }

    createBoard();
    render();

    return () => {};
}

/* =========================================================
   CONNECT FOUR
   ========================================================= */

function startConnectFour() {
    setGameContent(`
        <div class="game-info-bar">
            <span id="connectStatus">Red's turn</span>
        </div>

        <div id="connectBoard" class="connect-board"></div>
    `);

    const boardElement =
        document.getElementById("connectBoard");

    const statusElement =
        document.getElementById("connectStatus");

    const rows = 6;
    const cols = 7;

    let board = Array.from(
        { length: rows },
        () => Array(cols).fill("")
    );

    let player = "R";
    let gameOver = false;

    function render() {
        boardElement.innerHTML = "";

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement("button");

                cell.className = "connect-cell";

                const value = board[row][col];

                if (value === "R") {
                    cell.style.background = "#e05252";
                }

                if (value === "Y") {
                    cell.style.background = "#e6b84c";
                }

                cell.addEventListener("click", () => {
                    makeMove(col);
                });

                boardElement.appendChild(cell);
            }
        }
    }

    function makeMove(col) {
        if (gameOver) {
            return;
        }

        let targetRow = -1;

        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                targetRow = row;
                break;
            }
        }

        if (targetRow === -1) {
            return;
        }

        board[targetRow][col] = player;

        if (
            hasFour(
                targetRow,
                col,
                player
            )
        ) {
            gameOver = true;

            statusElement.textContent =
                `${player === "R" ? "Red" : "Yellow"} wins!`;

            saveHighScore(
                "connect4",
                player === "R" ? 1 : 0
            );

            render();

            showMessage(
                player === "R" ? "🔴" : "🟡",
                "Game Over",
                `${player === "R" ? "Red" : "Yellow"} wins!`,
                "Play Again",
                () => restartCurrentGame()
            );

            return;
        }

        if (
            board.every(
                row => row.every(Boolean)
            )
        ) {
            gameOver = true;
            statusElement.textContent = "Draw!";
            render();
            return;
        }

        player = player === "R" ? "Y" : "R";

        statusElement.textContent =
            `${player === "R" ? "Red" : "Yellow"}'s turn`;

        render();
    }

    function hasFour(row, col, value) {
        const directions = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1]
        ];

        for (const [dr, dc] of directions) {
            let count = 1;

            count += countDirection(
                row,
                col,
                dr,
                dc,
                value
            );

            count += countDirection(
                row,
                col,
                -dr,
                -dc,
                value
            );

            if (count >= 4) {
                return true;
            }
        }

        return false;
    }

    function countDirection(
        row,
        col,
        dr,
        dc,
        value
    ) {
        let count = 0;

        let r = row + dr;
        let c = col + dc;

        while (
            r >= 0 &&
            r < rows &&
            c >= 0 &&
            c < cols &&
            board[r][c] === value
        ) {
            count++;
            r += dr;
            c += dc;
        }

        return count;
    }

    render();

    return () => {};
}

/* =========================================================
   ROCK PAPER SCISSORS
   ========================================================= */

function startRPS() {
    setGameContent(`
        <h2>Choose Your Move</h2>

        <div class="choice-row">
            <button class="choice-button" data-choice="rock">✊</button>
            <button class="choice-button" data-choice="paper">✋</button>
            <button class="choice-button" data-choice="scissors">✌️</button>
        </div>

        <div class="game-info-bar" style="margin-top:22px;">
            <span>You: <b id="rpsPlayer">0</b></span>
            <span>Computer: <b id="rpsComputer">0</b></span>
        </div>

        <p id="rpsResult">Make your choice.</p>
    `);

    const buttons =
        document.querySelectorAll(".choice-button");

    const playerElement =
        document.getElementById("rpsPlayer");

    const computerElement =
        document.getElementById("rpsComputer");

    const resultElement =
        document.getElementById("rpsResult");

    let playerScore = 0;
    let computerScore = 0;

    const choices = [
        "rock",
        "paper",
        "scissors"
    ];

    function play(choice) {
        const computer =
            choices[randomInt(0, 2)];

        if (choice === computer) {
            resultElement.textContent =
                `Draw! Computer chose ${computer}.`;

            return;
        }

        const wins =
            (choice === "rock" && computer === "scissors") ||
            (choice === "paper" && computer === "rock") ||
            (choice === "scissors" && computer === "paper");

        if (wins) {
            playerScore++;

            resultElement.textContent =
                `You win! Computer chose ${computer}.`;
        } else {
            computerScore++;

            resultElement.textContent =
                `Computer wins! It chose ${computer}.`;
        }

        playerElement.textContent = playerScore;
        computerElement.textContent = computerScore;

        if (playerScore >= 5 || computerScore >= 5) {
            saveHighScore(
                "rps",
                playerScore * 100
            );
        }
    }

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            () => play(button.dataset.choice)
        );
    });

    return () => {};
}

/* =========================================================
   SIMON SAYS
   ========================================================= */

function startSimon() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Level: <b id="simonLevel">0</b></span>
            <span id="simonStatus">Press Start</span>
        </div>

        <button id="simonStart" class="game-button">
            Start Game
        </button>

        <div class="simon-grid">
            <button class="simon-button simon-red" data-index="0"></button>
            <button class="simon-button simon-blue" data-index="1"></button>
            <button class="simon-button simon-green" data-index="2"></button>
            <button class="simon-button simon-yellow" data-index="3"></button>
        </div>
    `);

    const buttons =
        document.querySelectorAll(".simon-button");

    const startButton =
        document.getElementById("simonStart");

    const levelElement =
        document.getElementById("simonLevel");

    const statusElement =
        document.getElementById("simonStatus");

    let sequence = [];
    let userIndex = 0;
    let playing = false;
    let timers = [];

    function wait(ms) {
        return new Promise(resolve => {
            const timer = setTimeout(resolve, ms);
            timers.push(timer);
        });
    }

    async function flash(index) {
        const button = buttons[index];

        button.classList.add("active");

        await wait(400);

        button.classList.remove("active");

        await wait(150);
    }

    async function playSequence() {
        playing = true;
        statusElement.textContent = "Watch...";

        for (const index of sequence) {
            await flash(index);
        }

        userIndex = 0;
        playing = false;

        statusElement.textContent = "Your turn!";
    }

    function nextLevel() {
        sequence.push(randomInt(0, 3));

        levelElement.textContent =
            sequence.length;

        playSequence();
    }

    function startGame() {
        sequence = [];
        userIndex = 0;

        startButton.disabled = true;

        nextLevel();
    }

    function clickHandler(event) {
        if (playing || !sequence.length) {
            return;
        }

        const index =
            Number(event.currentTarget.dataset.index);

        if (index !== sequence[userIndex]) {
            playing = true;

            const level = sequence.length - 1;

            saveHighScore("simon", level);

            showMessage(
                "🎵",
                "Game Over",
                `You reached level ${level}.`,
                "Play Again",
                () => restartCurrentGame()
            );

            return;
        }

        flash(index);

        userIndex++;

        if (userIndex >= sequence.length) {
            playing = true;

            statusElement.textContent =
                "Correct!";

            setTimeout(() => {
                if (!currentGame) {
                    return;
                }

                nextLevel();
            }, 600);
        }
    }

    startButton.addEventListener(
        "click",
        startGame
    );

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            clickHandler
        );
    });

    return () => {
        timers.forEach(timer => clearTimeout(timer));
    };
}

/* =========================================================
   WHACK-A-MOLE
   ========================================================= */

function startWhack() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="whackScore">0</b></span>
            <span>Time: <b id="whackTime">30</b>s</span>
        </div>

        <div id="whackGrid"></div>
    `);

    const grid = document.getElementById("whackGrid");
    const scoreElement =
        document.getElementById("whackScore");
    const timeElement =
        document.getElementById("whackTime");

    grid.style.display = "grid";
    grid.style.gridTemplateColumns =
        "repeat(3, minmax(70px, 100px))";
    grid.style.gap = "10px";
    grid.style.marginTop = "15px";

    let score = 0;
    let time = 30;
    let mole = -1;

    let interval = null;
    let timer = null;

    const cells = [];

    for (let i = 0; i < 9; i++) {
        const button = document.createElement("button");

        button.style.width = "90px";
        button.style.height = "90px";
        button.style.border = "0";
        button.style.borderRadius = "15px";
        button.style.background =
            "var(--surface-2)";
        button.style.fontSize = "35px";

        button.addEventListener("click", () => {
            if (i === mole) {
                score++;
                scoreElement.textContent = score;

                mole = -1;
                render();
            }
        });

        cells.push(button);
        grid.appendChild(button);
    }

    function render() {
        cells.forEach((cell, index) => {
            cell.textContent =
                index === mole ? "🐹" : "";
        });
    }

    function moveMole() {
        mole = randomInt(0, 8);
        render();
    }

    moveMole();

    interval = setInterval(moveMole, 700);

    timer = setInterval(() => {
        time--;
        timeElement.textContent = time;

        if (time <= 0) {
            clearInterval(interval);
            clearInterval(timer);

            saveHighScore("whack", score);

            showMessage(
                "🐹",
                "Time Up!",
                `You scored ${score}.`,
                "Play Again",
                () => restartCurrentGame()
            );
        }
    }, 1000);

    return () => {
        clearInterval(interval);
        clearInterval(timer);
    };
}

/* =========================================================
   SLIDING PUZZLE
   ========================================================= */

function startSlidingPuzzle() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Moves: <b id="slideMoves">0</b></span>
            <span>Goal: 1–8</span>
        </div>

        <div id="slideGrid"></div>

        <button id="slideShuffle"
                class="game-button"
                style="margin-top:18px;">
            Shuffle
        </button>
    `);

    const grid = document.getElementById("slideGrid");
    const movesElement =
        document.getElementById("slideMoves");
    const shuffleButton =
        document.getElementById("slideShuffle");

    grid.style.display = "grid";
    grid.style.gridTemplateColumns =
        "repeat(3, 85px)";
    grid.style.gap = "7px";

    let board = [];
    let moves = 0;

    function shuffleBoard() {
        board = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 0
        ];

        for (let i = 0; i < 150; i++) {
            const empty =
                board.indexOf(0);

            const neighbors =
                getSlideNeighbors(empty);

            const random =
                neighbors[
                    randomInt(0, neighbors.length - 1)
                ];

            [board[empty], board[random]] =
                [board[random], board[empty]];
        }

        moves = 0;
        movesElement.textContent = moves;

        render();
    }

    function getSlideNeighbors(index) {
        const row = Math.floor(index / 3);
        const col = index % 3;

        const result = [];

        if (row > 0) {
            result.push(index - 3);
        }

        if (row < 2) {
            result.push(index + 3);
        }

        if (col > 0) {
            result.push(index - 1);
        }

        if (col < 2) {
            result.push(index + 1);
        }

        return result;
    }

    function render() {
        grid.innerHTML = "";

        board.forEach((value, index) => {
            const button = document.createElement("button");

            button.textContent = value || "";

            button.style.width = "85px";
            button.style.height = "85px";
            button.style.border = "0";
            button.style.borderRadius = "13px";
            button.style.background =
                value
                    ? "var(--surface-2)"
                    : "transparent";
            button.style.color =
                "var(--text)";
            button.style.fontSize = "25px";
            button.style.fontWeight = "900";

            button.addEventListener(
                "click",
                () => move(index)
            );

            grid.appendChild(button);
        });
    }

    function move(index) {
        const empty =
            board.indexOf(0);

        if (
            !getSlideNeighbors(empty)
                .includes(index)
        ) {
            return;
        }

        [board[index], board[empty]] =
            [board[empty], board[index]];

        moves++;
        movesElement.textContent = moves;

        render();

        if (
            board.join(",") ===
            "1,2,3,4,5,6,7,8,0"
        ) {
            const score =
                Math.max(
                    1,
                    1000 - moves * 5
                );

            saveHighScore(
                "sliding",
                score
            );

            showMessage(
                "🧩",
                "Puzzle Solved!",
                `Solved in ${moves} moves.`,
                "Play Again",
                () => restartCurrentGame()
            );
        }
    }

    shuffleButton.addEventListener(
        "click",
        shuffleBoard
    );

    shuffleBoard();

    return () => {};
}

/* =========================================================
   COLOR MATCH
   ========================================================= */

function startColorMatch() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="colorScore">0</b></span>
            <span>Time: <b id="colorTime">30</b>s</span>
        </div>

        <h2 id="colorTarget">
            Find the color
        </h2>

        <div id="colorChoices"
             class="choice-row"></div>
    `);

    const scoreElement =
        document.getElementById("colorScore");

    const timeElement =
        document.getElementById("colorTime");

    const targetElement =
        document.getElementById("colorTarget");

    const choicesElement =
        document.getElementById("colorChoices");

    const colors = [
        {
            name: "Red",
            value: "#e05252"
        },
        {
            name: "Blue",
            value: "#4d8fe8"
        },
        {
            name: "Green",
            value: "#45ad76"
        },
        {
            name: "Yellow",
            value: "#e6b84c"
        },
        {
            name: "Purple",
            value: "#8c5cf5"
        },
        {
            name: "Orange",
            value: "#e88b42"
        }
    ];

    let score = 0;
    let time = 30;
    let target = null;

    let timer = null;

    function nextRound() {
        target =
            colors[
                randomInt(0, colors.length - 1)
            ];

        targetElement.textContent =
            `Find: ${target.name}`;

        choicesElement.innerHTML = "";

        const options = shuffle(colors).slice(0, 4);

        if (!options.includes(target)) {
            options[0] = target;
        }

        shuffle(options).forEach(color => {
            const button =
                document.createElement("button");

            button.className =
                "choice-button";

            button.style.background =
                color.value;

            button.textContent = "";

            button.addEventListener(
                "click",
                () => {
                    if (color.name === target.name) {
                        score++;
                        scoreElement.textContent =
                            score;
                    } else {
                        score = Math.max(
                            0,
                            score - 1
                        );

                        scoreElement.textContent =
                            score;
                    }

                    nextRound();
                }
            );

            choicesElement.appendChild(button);
        });
    }

    nextRound();

    timer = setInterval(() => {
        time--;

        timeElement.textContent = time;

        if (time <= 0) {
            clearInterval(timer);

            saveHighScore(
                "colormatch",
                score
            );

            showMessage(
                "🎨",
                "Time Up!",
                `Your score was ${score}.`,
                "Play Again",
                () => restartCurrentGame()
            );
        }
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}

/* =========================================================
   MATH SPRINT
   ========================================================= */

function startMathSprint() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="mathScore">0</b></span>
            <span>Time: <b id="mathTime">60</b>s</span>
        </div>

        <h2 id="mathQuestion"></h2>

        <input
            id="mathInput"
            class="game-input"
            type="number"
            placeholder="Answer"
            style="margin-top:18px;"
        >

        <button
            id="mathSubmit"
            class="game-button"
            style="margin-top:12px;"
        >
            Submit
        </button>

        <p id="mathFeedback"
           style="margin-top:12px;">
        </p>
    `);

    const scoreElement =
        document.getElementById("mathScore");

    const timeElement =
        document.getElementById("mathTime");

    const questionElement =
        document.getElementById("mathQuestion");

    const input =
        document.getElementById("mathInput");

    const submit =
        document.getElementById("mathSubmit");

    const feedback =
        document.getElementById("mathFeedback");

    let score = 0;
    let time = 60;
    let answer = 0;
    let timer = null;

    function nextQuestion() {
        const a = randomInt(1, 20);
        const b = randomInt(1, 20);

        const type = randomInt(1, 3);

        if (type === 1) {
            answer = a + b;
            questionElement.textContent =
                `${a} + ${b} = ?`;
        }

        if (type === 2) {
            const high = Math.max(a, b);
            const low = Math.min(a, b);

            answer = high - low;

            questionElement.textContent =
                `${high} − ${low} = ?`;
        }

        if (type === 3) {
            const x = randomInt(2, 10);
            const y = randomInt(2, 10);

            answer = x * y;

            questionElement.textContent =
                `${x} × ${y} = ?`;
        }

        input.value = "";
        input.focus();
    }

    function submitAnswer() {
        const value = Number(input.value);

        if (value === answer) {
            score++;
            feedback.textContent = "Correct! ✅";
        } else {
            feedback.textContent =
                `Wrong. Answer: ${answer}`;
        }

        scoreElement.textContent = score;

        nextQuestion();
    }

    submit.addEventListener(
        "click",
        submitAnswer
    );

    input.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                submitAnswer();
            }
        }
    );

    nextQuestion();

    timer = setInterval(() => {
        time--;

        timeElement.textContent = time;

        if (time <= 0) {
            clearInterval(timer);

            saveHighScore(
                "math",
                score
            );

            showMessage(
                "➗",
                "Time Up!",
                `You solved ${score} questions.`,
                "Play Again",
                () => restartCurrentGame()
            );
        }
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}

/* =========================================================
   TAP COUNTER
   ========================================================= */

function startTapCounter() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Taps: <b id="tapScore">0</b></span>
            <span>Time: <b id="tapTime">10</b>s</span>
        </div>

        <button
            id="tapButton"
            style="
                width:min(80vw,300px);
                height:220px;
                border:0;
                border-radius:25px;
                background:var(--primary);
                color:white;
                font-size:35px;
                font-weight:900;
                margin-top:15px;
            "
        >
            TAP!
        </button>
    `);

    const tapButton =
        document.getElementById("tapButton");

    const scoreElement =
        document.getElementById("tapScore");

    const timeElement =
        document.getElementById("tapTime");

    let score = 0;
    let time = 10;
    let timer = null;
    let stopped = false;

    tapButton.addEventListener("click", () => {
        if (stopped) {
            return;
        }

        score++;
        scoreElement.textContent = score;
    });

    timer = setInterval(() => {
        time--;

        timeElement.textContent = time;

        if (time <= 0) {
            stopped = true;
            clearInterval(timer);

            saveHighScore(
                "tap",
                score
            );

            tapButton.disabled = true;
            tapButton.textContent = "TIME UP";

            showMessage(
                "👆",
                "Time Up!",
                `You made ${score} taps.`,
                "Play Again",
                () => restartCurrentGame()
            );
        }
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}

/* =========================================================
   WORD GUESS
   ========================================================= */

function startWordGuess() {
    const wordList = [
        "APPLE",
        "GAMES",
        "PHONE",
        "MUSIC",
        "HOUSE",
        "WATER",
        "CLOUD",
        "TIGER",
        "ROBOT",
        "SPACE",
        "LIGHT",
        "RIVER"
    ];

    const word =
        wordList[
            randomInt(0, wordList.length - 1)
        ];

    setGameContent(`
        <div class="game-info-bar">
            <span>Wrong: <b id="wordWrong">0</b>/6</span>
            <span>Best: ${getHighScore("word")}</span>
        </div>

        <h2 id="wordDisplay"
            style="letter-spacing:8px;">
        </h2>

        <div id="letterButtons"
             class="choice-row"
             style="max-width:600px;">
        </div>
    `);

    const display =
        document.getElementById("wordDisplay");

    const wrongElement =
        document.getElementById("wordWrong");

    const letterArea =
        document.getElementById("letterButtons");

    let guessed = [];
    let wrong = 0;
    let finished = false;

    function renderWord() {
        display.textContent =
            word
                .split("")
                .map(letter =>
                    guessed.includes(letter)
                        ? letter
                        : "_"
                )
                .join(" ");
    }

    function finish(win) {
        finished = true;

        if (win) {
            saveHighScore(
                "word",
                Math.max(
                    1,
                    100 - wrong * 10
                )
            );
        }

        showMessage(
            win ? "🎉" : "🔤",
            win ? "Correct!" : "Game Over",
            win
                ? `You guessed ${word}.`
                : `The word was ${word}.`,
            "Play Again",
            () => restartCurrentGame()
        );
    }

    for (let code = 65; code <= 90; code++) {
        const letter =
            String.fromCharCode(code);

        const button =
            document.createElement("button");

        button.className =
            "game-button";

        button.textContent = letter;

        button.style.minWidth = "42px";

        button.addEventListener(
            "click",
            () => {
                if (
                    finished ||
                    guessed.includes(letter)
                ) {
                    return;
                }

                guessed.push(letter);

                button.disabled = true;
                button.style.opacity = "0.5";

                if (!word.includes(letter)) {
                    wrong++;

                    wrongElement.textContent =
                        wrong;

                    if (wrong >= 6) {
                        finish(false);
                        return;
                    }
                }

                renderWord();

                const complete =
                    word
                        .split("")
                        .every(
                            letter =>
                                guessed.includes(letter)
                        );

                if (complete) {
                    finish(true);
                }
            }
        );

        letterArea.appendChild(button);
    }

    renderWord();

    return () => {};
}

/* =========================================================
   DODGE BLOCKS
   ========================================================= */

function startDodgeBlocks() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="dodgeScore">0</b></span>
            <span>Best: ${getHighScore("dodge")}</span>
        </div>

        <canvas
            id="dodgeCanvas"
            class="game-canvas"
            width="400"
            height="500"
        ></canvas>

        <p style="margin-top:12px;">
            Move with Arrow Keys or A/D.
        </p>
    `);

    const canvas =
        document.getElementById("dodgeCanvas");

    const ctx =
        canvas.getContext("2d");

    const scoreElement =
        document.getElementById("dodgeScore");

    const player = {
        x: 180,
        y: 450,
        width: 40,
        height: 25,
        speed: 7
    };

    let blocks = [];
    let score = 0;
    let keys = {};
    let animation = null;
    let spawnTimer = 0;
    let stopped = false;

    function draw() {
        ctx.fillStyle = "#111827";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "#7c7df7";

        ctx.fillRect(
            player.x,
            player.y,
            player.width,
            player.height
        );

        blocks.forEach(block => {
            ctx.fillStyle = "#e05252";

            ctx.fillRect(
                block.x,
                block.y,
                block.width,
                block.height
            );
        });
    }

    function collision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function endGame() {
        stopped = true;

        if (animation) {
            cancelAnimationFrame(animation);
        }

        saveHighScore(
            "dodge",
            score
        );

        showMessage(
            "🚀",
            "Game Over",
            `You survived with ${score} points.`,
            "Play Again",
            () => restartCurrentGame()
        );
    }

    function update() {
        if (stopped) {
            return;
        }

        if (keys.ArrowLeft || keys.a) {
            player.x -= player.speed;
        }

        if (keys.ArrowRight || keys.d) {
            player.x += player.speed;
        }

        player.x = Math.max(
            0,
            Math.min(
                canvas.width - player.width,
                player.x
            )
        );

        spawnTimer++;

        if (spawnTimer >= 28) {
            spawnTimer = 0;

            blocks.push({
                x: randomInt(
                    0,
                    canvas.width - 35
                ),
                y: -30,
                width: randomInt(25, 45),
                height: 25,
                speed: randomInt(3, 6)
            });
        }

        blocks.forEach(block => {
            block.y += block.speed;

            if (collision(player, block)) {
                endGame();
            }
        });

        blocks =
            blocks.filter(
                block =>
                    block.y < canvas.height + 40
            );

        score++;
        scoreElement.textContent =
            Math.floor(score / 10);

        draw();

        animation =
            requestAnimationFrame(update);
    }

    function keyDown(event) {
        keys[event.key] = true;
    }

    function keyUp(event) {
        keys[event.key] = false;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    animation =
        requestAnimationFrame(update);

    return () => {
        stopped = true;

        if (animation) {
            cancelAnimationFrame(animation);
        }

        window.removeEventListener(
            "keydown",
            keyDown
        );

        window.removeEventListener(
            "keyup",
            keyUp
        );
    };
}

/* =========================================================
   COIN CATCHER
   ========================================================= */

function startCoinCatcher() {
    setGameContent(`
        <div class="game-info-bar">
            <span>Score: <b id="coinScore">0</b></span>
            <span>Lives: <b id="coinLives">3</b></span>
        </div>

        <canvas
            id="coinCanvas"
            class="game-canvas"
            width="420"
            height="500"
        ></canvas>

        <p style="margin-top:12px;">
            Move with Arrow Keys, A/D, or mouse.
        </p>
    `);

    const canvas =
        document.getElementById("coinCanvas");

    const ctx =
        canvas.getContext("2d");

    const scoreElement =
        document.getElementById("coinScore");

    const livesElement =
        document.getElementById("coinLives");

    const basket = {
        x: 175,
        y: 450,
        width: 70,
        height: 25,
        speed: 7
    };

    let objects = [];
    let score = 0;
    let lives = 3;
    let keys = {};
    let animation = null;
    let spawnTimer = 0;
    let stopped = false;

    function draw() {
        ctx.fillStyle = "#111827";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "#7c7df7";

        ctx.fillRect(
            basket.x,
            basket.y,
            basket.width,
            basket.height
        );

        objects.forEach(object => {
            ctx.font = "28px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                object.type === "coin"
                    ? "🪙"
                    : "💣",
                object.x,
                object.y
            );
        });
    }

    function collision(object) {
        return (
            object.x > basket.x &&
            object.x < basket.x + basket.width &&
            object.y > basket.y &&
            object.y < basket.y + basket.height
        );
    }

    function endGame() {
        stopped = true;

        if (animation) {
            cancelAnimationFrame(animation);
        }

        saveHighScore(
            "coin",
            score
        );

        showMessage(
            "🪙",
            "Game Over",
            `You collected ${score} coins.`,
            "Play Again",
            () => restartCurrentGame()
        );
    }

    function update() {
        if (stopped) {
            return;
        }

        if (keys.ArrowLeft || keys.a) {
            basket.x -= basket.speed;
        }

        if (keys.ArrowRight || keys.d) {
            basket.x += basket.speed;
        }

        basket.x = Math.max(
            0,
            Math.min(
                canvas.width - basket.width,
                basket.x
            )
        );

        spawnTimer++;

        if (spawnTimer >= 30) {
            spawnTimer = 0;

            objects.push({
                x: randomInt(20, canvas.width - 20),
                y: -20,
                speed: randomInt(3, 6),
                type:
                    Math.random() < 0.8
                        ? "coin"
                        : "bomb"
            });
        }

        objects.forEach(object => {
            object.y += object.speed;

            if (collision(object)) {
                object.hit = true;

                if (object.type === "coin") {
                    score++;
                    scoreElement.textContent =
                        score;
                } else {
                    lives--;

                    livesElement.textContent =
                        lives;

                    if (lives <= 0) {
                        endGame();
                    }
                }
            }
        });

        objects =
            objects.filter(
                object =>
                    !object.hit &&
                    object.y < canvas.height + 30
            );

        draw();

        animation =
            requestAnimationFrame(update);
    }

    function keyDown(event) {
        keys[event.key] = true;
    }

    function keyUp(event) {
        keys[event.key] = false;
    }

    function mouseMove(event) {
        const rect =
            canvas.getBoundingClientRect();

        basket.x =
            (event.clientX - rect.left) *
                (canvas.width / rect.width) -
            basket.width / 2;
    }

    window.addEventListener(
        "keydown",
        keyDown
    );

    window.addEventListener(
        "keyup",
        keyUp
    );

    canvas.addEventListener(
        "mousemove",
        mouseMove
    );

    animation =
        requestAnimationFrame(update);

    return () => {
        stopped = true;

        if (animation) {
            cancelAnimationFrame(animation);
        }

        window.removeEventListener(
            "keydown",
            keyDown
        );

        window.removeEventListener(
            "keyup",
            keyUp
        );

        canvas.removeEventListener(
            "mousemove",
            mouseMove
        );
    };
}

/* =========================================================
   APP STARTUP
   ========================================================= */

function initializeApp() {
    loadTheme();
    renderCategories();
    renderGameCards();

    const versionElement =
        document.querySelector(".version");

    if (versionElement) {
        versionElement.textContent =
            "Version 1.0.0";
    }

    const developerElement =
        document.querySelector(".developer");

    if (developerElement) {
        developerElement.textContent =
            "Developer: MASTERMIND";
    }
}

initializeApp();
