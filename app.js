const games = [
    {
        id: "snake",
        title: "Snake",
        icon: "🐍",
        category: "Arcade",
        description: "Eat food, grow longer and beat your score."
    },
    {
        id: "tictactoe",
        title: "Tic-Tac-Toe",
        icon: "⭕",
        category: "Puzzle",
        description: "Play X vs O against the computer."
    },
    {
        id: "2048",
        title: "2048",
        icon: "🔢",
        category: "Puzzle",
        description: "Combine matching numbers to reach 2048."
    },
    {
        id: "memory",
        title: "Memory Match",
        icon: "🧠",
        category: "Puzzle",
        description: "Find all matching pairs."
    },
    {
        id: "reaction",
        title: "Reaction Test",
        icon: "⚡",
        category: "Skill",
        description: "Test how quickly you can react."
    },
    {
        id: "guess",
        title: "Number Guess",
        icon: "🎯",
        category: "Puzzle",
        description: "Guess the hidden number."
    },
    {
        id: "pong",
        title: "Pong",
        icon: "🏓",
        category: "Arcade",
        description: "Classic paddle action."
    },
    {
        id: "breakout",
        title: "Breakout",
        icon: "🧱",
        category: "Arcade",
        description: "Break every brick with the ball."
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        icon: "💣",
        category: "Puzzle",
        description: "Clear the board without hitting mines."
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
        description: "Remember the color sequence."
    },
    {
        id: "whack",
        title: "Whack-a-Mole",
        icon: "🔨",
        category: "Arcade",
        description: "Tap the mole as fast as you can."
    },
    {
        id: "sliding",
        title: "Sliding Puzzle",
        icon: "🧩",
        category: "Puzzle",
        description: "Arrange the numbers in order."
    },
    {
        id: "colormatch",
        title: "Color Match",
        icon: "🌈",
        category: "Skill",
        description: "Choose the correct color."
    },
    {
        id: "math",
        title: "Math Sprint",
        icon: "➗",
        category: "Brain",
        description: "Solve as many math problems as possible."
    },
    {
        id: "tap",
        title: "Tap Counter",
        icon: "👆",
        category: "Arcade",
        description: "Tap as many times as possible."
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
        description: "Avoid falling blocks."
    },
    {
        id: "coin",
        title: "Coin Catcher",
        icon: "🪙",
        category: "Arcade",
        description: "Catch falling coins."
    },
    {
        id: "target",
        title: "Target Tap",
        icon: "🎯",
        category: "Skill",
        description: "Hit targets before time runs out."
    },
    {
        id: "lightsout",
        title: "Lights Out",
        icon: "💡",
        category: "Puzzle",
        description: "Turn off all the lights."
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
        description: "Type the displayed sentence quickly."
    },
    {
        id: "hangman",
        title: "Word Challenge",
        icon: "🔠",
        category: "Word",
        description: "Guess the hidden word letter by letter."
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
        description: "Solve quick calculations."
    },
    {
        id: "treasure",
        title: "Treasure Hunt",
        icon: "💎",
        category: "Puzzle",
        description: "Find the hidden treasure."
    }
];

let currentGame = null;
let cleanupGame = null;
let currentCategory = "All";

const scoresKey = "mgh_scores";
const themeKey = "mgh_theme";

const $ = (selector) => document.querySelector(selector);

function getScores() {
    try {
        return JSON.parse(localStorage.getItem(scoresKey)) || {};
    } catch {
        return {};
    }
}

function saveScores(scores) {
    localStorage.setItem(scoresKey, JSON.stringify(scores));
}

function getHighScore(gameId) {
    const scores = getScores();
    return scores[gameId] ?? 0;
}

function saveHighScore(gameId, score) {
    const scores = getScores();
    const oldScore = scores[gameId] ?? 0;

    if (score > oldScore) {
        scores[gameId] = score;
        saveScores(scores);
        return true;
    }

    return false;
}

function initializeApp() {
    setupTheme();
    setupCategories();
    renderGames();
    setupSearch();
    setupNavigation();
}

function setupTheme() {
    const savedTheme = localStorage.getItem(themeKey);

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        updateThemeButton();
    }

    const button = $("#themeToggle");

    if (button) {
        button.addEventListener("click", () => {
            document.body.classList.toggle("dark");

            const theme = document.body.classList.contains("dark")
                ? "dark"
                : "light";

            localStorage.setItem(themeKey, theme);
            updateThemeButton();
        });
    }
}

function updateThemeButton() {
    const button = $("#themeToggle");

    if (!button) {
        return;
    }

    button.textContent = document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";
}

function setupCategories() {
    const area = $(".category-area");

    if (!area) {
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

    area.innerHTML = categories.map(category => `
        <button
            type="button"
            class="category-button ${category === "All" ? "active" : ""}"
            data-category="${category}"
        >
            ${category}
        </button>
    `).join("");

    area.querySelectorAll(".category-button").forEach(button => {
        button.addEventListener("click", () => {
            currentCategory = button.dataset.category;

            area.querySelectorAll(".category-button").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderGames();
        });
    });
}

function setupSearch() {
    const input = $("#searchInput");

    if (!input) {
        return;
    }

    input.addEventListener("input", renderGames);
}

function renderGames() {
    const grid = $("#gameGrid");

    if (!grid) {
        return;
    }

    const search = ($("#searchInput")?.value || "")
        .trim()
        .toLowerCase();

    const filtered = games.filter(game => {
        const categoryMatch =
            currentCategory === "All" ||
            game.category === currentCategory;

        const searchMatch =
            game.title.toLowerCase().includes(search) ||
            game.description.toLowerCase().includes(search) ||
            game.category.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div style="font-size:3rem;">🔎</div>
                <h3>No games found</h3>
                <p>Try another search.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(game => `
        <article class="game-card">
            <div class="game-card-top">
                <div class="game-icon">${game.icon}</div>
                <span class="game-category">${game.category}</span>
            </div>

            <h3>${game.title}</h3>

            <p>${game.description}</p>

            <button
                type="button"
                class="play-button"
                data-game="${game.id}"
            >
                Play
            </button>
        </article>
    `).join("");

    grid.querySelectorAll(".play-button").forEach(button => {
        button.addEventListener("click", () => {
            openGame(button.dataset.game);
        });
    });
}

function setupNavigation() {
    $("#backButton")?.addEventListener("click", closeGame);

    $("#restartButton")?.addEventListener("click", () => {
        if (currentGame) {
            openGame(currentGame.id);
        }
    });
}

function openGame(gameId) {
    const game = games.find(item => item.id === gameId);

    if (!game) {
        return;
    }

    if (cleanupGame) {
        cleanupGame();
        cleanupGame = null;
    }

    currentGame = game;

    $("#currentGameIcon").textContent = game.icon;
    $("#currentGameTitle").textContent = game.title;
    $("#currentGameCategory").textContent = game.category;

    $("#homeScreen").classList.remove("active");
    $("#gameScreen").classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    createGame(gameId);
}

function closeGame() {
    if (cleanupGame) {
        cleanupGame();
        cleanupGame = null;
    }

    currentGame = null;

    $("#gameScreen").classList.remove("active");
    $("#homeScreen").classList.add("active");

    $("#gameContainer").innerHTML = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function createGame(gameId) {
    const container = $("#gameContainer");

    container.innerHTML = "";

    switch (gameId) {
        case "snake":
            cleanupGame = createSnake(container);
            break;

        case "tictactoe":
            cleanupGame = createTicTacToe(container);
            break;

        case "2048":
            cleanupGame = create2048(container);
            break;

        case "memory":
            cleanupGame = createMemory(container);
            break;

        case "reaction":
            cleanupGame = createReaction(container);
            break;

        case "guess":
            cleanupGame = createNumberGuess(container);
            break;

        case "pong":
            cleanupGame = createPong(container);
            break;

        case "breakout":
            cleanupGame = createBreakout(container);
            break;

        case "minesweeper":
            cleanupGame = createMinesweeper(container);
            break;

        case "connect4":
            cleanupGame = createConnectFour(container);
            break;

        case "rps":
            cleanupGame = createRPS(container);
            break;

        case "simon":
            cleanupGame = createSimon(container);
            break;

        case "whack":
            cleanupGame = createWhack(container);
            break;

        case "sliding":
            cleanupGame = createSlidingPuzzle(container);
            break;

        case "colormatch":
            cleanupGame = createColorMatch(container);
            break;

        case "math":
            cleanupGame = createMathSprint(container);
            break;

        case "tap":
            cleanupGame = createTapCounter(container);
            break;

        case "word":
            cleanupGame = createWordGuess(container);
            break;

        case "dodge":
            cleanupGame = createDodgeBlocks(container);
            break;

        case "coin":
            cleanupGame = createCoinCatcher(container);
            break;

        case "target":
            cleanupGame = createTargetTap(container);
            break;

        case "lightsout":
            cleanupGame = createLightsOut(container);
            break;

        case "higherlower":
            cleanupGame = createHigherLower(container);
            break;

        case "dice":
            cleanupGame = createDiceDuel(container);
            break;

        case "coinflip":
            cleanupGame = createCoinFlip(container);
            break;

        case "typing":
            cleanupGame = createTypingSprint(container);
            break;

        case "hangman":
            cleanupGame = createHangman(container);
            break;

        case "colorhunt":
            cleanupGame = createColorHunt(container);
            break;

        case "quickmath":
            cleanupGame = createQuickMath(container);
            break;

        case "treasure":
            cleanupGame = createTreasureHunt(container);
            break;

        default:
            container.innerHTML = `
                <div class="message-box">
                    <div class="message-icon">🎮</div>
                    <h2>Coming Soon</h2>
                    <p>This game will be added soon.</p>
                </div>
            `;
    }
}

function gameLayout(content) {
    return `
        <div style="width:100%;max-width:800px;margin:auto;">
            ${content}
        </div>
    `;
}

function infoBar(score, best = null) {
    return `
        <div class="game-info-bar">
            <div>
                <small>Score</small>
                <strong class="score-value" id="gameScore">${score}</strong>
            </div>
            ${
                best !== null
                    ? `
                    <div>
                        <small>Best</small>
                        <strong class="score-value" id="gameBest">${best}</strong>
                    </div>
                    `
                    : ""
            }
        </div>
    `;
}

function createSnake(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("snake"))}

        <canvas
            id="snakeCanvas"
            class="game-canvas"
            width="400"
            height="400"
            style="max-width:100%;background:#111;border-radius:20px;display:block;margin:auto;"
        ></canvas>

        <div class="direction-controls" style="margin-top:20px;">
            <button class="game-button" data-dir="up">⬆️</button>
            <div>
                <button class="game-button" data-dir="left">⬅️</button>
                <button class="game-button" data-dir="down">⬇️</button>
                <button class="game-button" data-dir="right">➡️</button>
            </div>
        </div>

        <p style="text-align:center;margin-top:15px;">
            Use arrow keys or buttons.
        </p>
    `);

    const canvas = $("#snakeCanvas");
    const ctx = canvas.getContext("2d");

    let snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    let food = randomGridPosition();
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let score = 0;
    let timer = null;
    let running = true;

    function randomGridPosition() {
        return {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };
    }

    function resetFood() {
        do {
            food = randomGridPosition();
        } while (
            snake.some(part => part.x === food.x && part.y === food.y)
        );
    }

    function draw() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, 400, 400);

        ctx.fillStyle = "#ff4d6d";
        ctx.fillRect(food.x * 20, food.y * 20, 18, 18);

        snake.forEach((part, index) => {
            ctx.fillStyle = index === 0 ? "#5b5cf0" : "#7d7ff5";
            ctx.fillRect(part.x * 20, part.y * 20, 18, 18);
        });
    }

    function end() {
        running = false;
        clearInterval(timer);

        saveHighScore("snake", score);

        container.insertAdjacentHTML("beforeend", `
            <div class="message-overlay">
                <div class="message-box">
                    <div class="message-icon">🐍</div>
                    <h2>Game Over</h2>
                    <p>Your score: ${score}</p>
                    <button class="primary-button" onclick="document.querySelector('#restartButton').click()">
                        Play Again
                    </button>
                </div>
            </div>
        `);
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

        if (
            head.x < 0 ||
            head.x >= 20 ||
            head.y < 0 ||
            head.y >= 20 ||
            snake.some(part => part.x === head.x && part.y === head.y)
        ) {
            end();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            $("#gameScore").textContent = score;
            resetFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function setDirection(dir) {
        const directions = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };

        const selected = directions[dir];

        if (
            selected.x === -direction.x &&
            selected.y === -direction.y
        ) {
            return;
        }

        nextDirection = selected;
    }

    const keyHandler = event => {
        const map = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right"
        };

        if (map[event.key]) {
            event.preventDefault();
            setDirection(map[event.key]);
        }
    };

    document.addEventListener("keydown", keyHandler);

    container.querySelectorAll("[data-dir]").forEach(button => {
        button.addEventListener("click", () => {
            setDirection(button.dataset.dir);
        });
    });

    draw();
    timer = setInterval(tick, 120);

    return () => {
        clearInterval(timer);
        document.removeEventListener("keydown", keyHandler);
    };
}

function createTicTacToe(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("tictactoe"))}

        <div id="tttStatus" style="text-align:center;font-size:1.2rem;font-weight:700;margin:15px;">
            Your turn
        </div>

        <div class="ttt-board" id="tttBoard"></div>

        <div style="text-align:center;margin-top:20px;">
            <button class="game-button" id="tttReset">New Game</button>
        </div>
    `);

    const boardElement = $("#tttBoard");
    const status = $("#tttStatus");
    const reset = $("#tttReset");

    let board = Array(9).fill("");
    let gameOver = false;

    function render() {
        boardElement.innerHTML = board.map((value, index) => `
            <button
                class="ttt-cell"
                data-index="${index}"
                type="button"
            >
                ${value}
            </button>
        `).join("");

        boardElement.querySelectorAll(".ttt-cell").forEach(cell => {
            cell.addEventListener("click", () => {
                playerMove(Number(cell.dataset.index));
            });
        });
    }

    function winner(b) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const [a, c, d] of lines) {
            if (b[a] && b[a] === b[c] && b[a] === b[d]) {
                return b[a];
            }
        }

        return b.every(Boolean) ? "draw" : null;
    }

    function finish(result) {
        gameOver = true;

        if (result === "X") {
            status.textContent = "You win! 🎉";
            saveHighScore("tictactoe", getHighScore("tictactoe") + 1);
        } else if (result === "O") {
            status.textContent = "Computer wins!";
        } else {
            status.textContent = "Draw!";
        }
    }

    function playerMove(index) {
        if (gameOver || board[index]) {
            return;
        }

        board[index] = "X";

        let result = winner(board);

        if (result) {
            render();
            finish(result);
            return;
        }

        status.textContent = "Computer thinking...";
        render();

        setTimeout(() => {
            if (gameOver) {
                return;
            }

            const empty = board
                .map((value, i) => value ? null : i)
                .filter(value => value !== null);

            if (empty.length) {
                const move = empty[Math.floor(Math.random() * empty.length)];
                board[move] = "O";
            }

            result = winner(board);

            if (result) {
                finish(result);
            } else {
                status.textContent = "Your turn";
            }

            render();
        }, 350);
    }

    function newGame() {
        board = Array(9).fill("");
        gameOver = false;
        status.textContent = "Your turn";
        render();
    }

    reset.addEventListener("click", newGame);

    newGame();

    return () => {};
}

function create2048(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("2048"))}

        <div
            id="grid2048"
            class="grid-2048"
            style="max-width:400px;margin:auto;"
        ></div>

        <p style="text-align:center;margin-top:15px;">
            Use arrow keys or swipe.
        </p>
    `);

    const gridElement = $("#grid2048");

    let board = [];
    let score = 0;

    function start() {
        board = Array(16).fill(0);
        score = 0;

        addTile();
        addTile();

        render();
    }

    function addTile() {
        const empty = board
            .map((value, index) => value === 0 ? index : null)
            .filter(index => index !== null);

        if (!empty.length) {
            return;
        }

        const index = empty[Math.floor(Math.random() * empty.length)];

        board[index] = Math.random() < 0.9 ? 2 : 4;
    }

    function render() {
        gridElement.innerHTML = board.map(value => `
            <div
                class="tile-2048"
                style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    min-height:70px;
                    border-radius:12px;
                    font-size:1.5rem;
                    font-weight:800;
                    background:${value ? "#777" : "#ddd"};
                    color:#fff;
                "
            >
                ${value || ""}
            </div>
        `).join("");

        $("#gameScore").textContent = score;
    }

    function slideLine(line) {
        const filtered = line.filter(value => value !== 0);

        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                score += filtered[i];
                filtered.splice(i + 1, 1);
            }
        }

        while (filtered.length < 4) {
            filtered.push(0);
        }

        return filtered;
    }

    function move(direction) {
        const old = board.join(",");

        if (direction === "left") {
            for (let row = 0; row < 4; row++) {
                board[row * 4] =
                    slideLine(board.slice(row * 4, row * 4 + 4))[0];

                const line = slideLine(
                    board.slice(row * 4, row * 4 + 4)
                );

                for (let i = 0; i < 4; i++) {
                    board[row * 4 + i] = line[i];
                }
            }
        }

        if (direction === "right") {
            for (let row = 0; row < 4; row++) {
                const line = slideLine(
                    board
                        .slice(row * 4, row * 4 + 4)
                        .reverse()
                ).reverse();

                for (let i = 0; i < 4; i++) {
                    board[row * 4 + i] = line[i];
                }
            }
        }

        if (direction === "up") {
            for (let col = 0; col < 4; col++) {
                const line = slideLine([
                    board[col],
                    board[col + 4],
                    board[col + 8],
                    board[col + 12]
                ]);

                for (let i = 0; i < 4; i++) {
                    board[col + i * 4] = line[i];
                }
            }
        }

        if (direction === "down") {
            for (let col = 0; col < 4; col++) {
                const line = slideLine([
                    board[col + 12],
                    board[col + 8],
                    board[col + 4],
                    board[col]
                ]).reverse();

                for (let i = 0; i < 4; i++) {
                    board[col + i * 4] = line[i];
                }
            }
        }

        if (old !== board.join(",")) {
            addTile();
            render();

            if (board.includes(2048)) {
                saveHighScore("2048", score);
            }
        }
    }

    const keyHandler = event => {
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
    };

    document.addEventListener("keydown", keyHandler);

    start();

    return () => {
        document.removeEventListener("keydown", keyHandler);
    };
}

function createMemory(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("memory"))}

        <div
            id="memoryGrid"
            class="memory-grid"
            style="max-width:500px;margin:auto;"
        ></div>

        <p id="memoryStatus" style="text-align:center;margin-top:15px;">
            Find all pairs.
        </p>
    `);

    const symbols = [
        "🍎",
        "🍌",
        "🍇",
        "🍉",
        "🍒",
        "🥝",
        "🍓",
        "🥥"
    ];

    let cards = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5);

    let flipped = [];
    let matched = [];
    let moves = 0;
    let locked = false;

    const grid = $("#memoryGrid");
    const status = $("#memoryStatus");

    function render() {
        grid.innerHTML = cards.map((symbol, index) => {
            const visible =
                flipped.includes(index) ||
                matched.includes(index);

            return `
                <button
                    class="memory-card"
                    data-index="${index}"
                    type="button"
                    style="
                        min-height:75px;
                        font-size:2rem;
                        border-radius:15px;
                    "
                >
                    ${visible ? symbol : "?"}
                </button>
            `;
        }).join("");

        grid.querySelectorAll(".memory-card").forEach(card => {
            card.addEventListener("click", () => {
                flip(Number(card.dataset.index));
            });
        });

        $("#gameScore").textContent = matched.length / 2;
    }

    function flip(index) {
        if (
            locked ||
            flipped.includes(index) ||
            matched.includes(index)
        ) {
            return;
        }

        flipped.push(index);
        render();

        if (flipped.length === 2) {
            moves++;
            locked = true;

            const [a, b] = flipped;

            if (cards[a] === cards[b]) {
                matched.push(a, b);
                flipped = [];
                locked = false;
                render();

                if (matched.length === cards.length) {
                    const score = Math.max(1, 100 - moves);
                    saveHighScore("memory", score);
                    status.textContent = `Completed in ${moves} moves! 🎉`;
                }
            } else {
                setTimeout(() => {
                    flipped = [];
                    locked = false;
                    render();
                }, 700);
            }
        }
    }

    render();

    return () => {};
}

function createReaction(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("reaction"))}

        <div
            id="reactionBox"
            class="reaction-box waiting"
            style="
                min-height:280px;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                border-radius:25px;
                cursor:pointer;
                padding:30px;
            "
        >
            <div>
                <div style="font-size:4rem;">⚡</div>
                <h2 id="reactionText">Click to start</h2>
                <p>Wait for the signal.</p>
            </div>
        </div>
    `);

    const box = $("#reactionBox");
    const textElement = $("#reactionText");

    let timer = null;
    let startTime = 0;
    let state = "idle";

    function start() {
        clearTimeout(timer);

        state = "waiting";
        box.className = "reaction-box waiting";
        textElement.textContent = "Wait...";

        const delay = 1000 + Math.random() * 3000;

        timer = setTimeout(() => {
            state = "ready";
            startTime = performance.now();

            box.className = "reaction-box ready";
            textElement.textContent = "CLICK NOW!";
        }, delay);
    }

    function click() {
        if (state === "idle" || state === "finished") {
            start();
            return;
        }

        if (state === "waiting") {
            clearTimeout(timer);
            state = "finished";
            textElement.textContent = "Too early! Try again.";
            return;
        }

        if (state === "ready") {
            const reactionTime = Math.round(performance.now() - startTime);

            state = "finished";
            $("#gameScore").textContent = reactionTime;
            textElement.textContent = `${reactionTime} ms`;

            const scores = getScores();

            if (!scores.reaction || reactionTime < scores.reaction) {
                scores.reaction = reactionTime;
                saveScores(scores);
            }
        }
    }

    box.addEventListener("click", click);

    return () => {
        clearTimeout(timer);
    };
}

function createNumberGuess(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("guess"))}

        <div style="text-align:center;">
            <h2>Guess a number from 1 to 100</h2>

            <input
                id="guessInput"
                class="game-input"
                type="number"
                min="1"
                max="100"
                placeholder="Enter number"
            >

            <button id="guessButton" class="game-button">
                Guess
            </button>

            <p id="guessMessage" style="font-size:1.2rem;margin-top:20px;">
                Good luck!
            </p>

            <p id="guessAttempts">Attempts: 0</p>
        </div>
    `);

    const input = $("#guessInput");
    const button = $("#guessButton");
    const message = $("#guessMessage");
    const attemptsElement = $("#guessAttempts");

    let target = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    function guess() {
        const value = Number(input.value);

        if (value < 1 || value > 100) {
            message.textContent = "Enter a number between 1 and 100.";
            return;
        }

        attempts++;
        attemptsElement.textContent = `Attempts: ${attempts}`;

        if (value === target) {
            const score = Math.max(1, 101 - attempts);
            $("#gameScore").textContent = score;
            saveHighScore("guess", score);

            message.textContent = `Correct! 🎉 The number was ${target}.`;

            button.disabled = true;
            input.disabled = true;
        } else if (value < target) {
            message.textContent = "Too low ⬆️";
        } else {
            message.textContent = "Too high ⬇️";
        }
    }

    button.addEventListener("click", guess);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            guess();
        }
    });

    return () => {};
}

function createPong(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("pong"))}

        <canvas
            id="pongCanvas"
            class="game-canvas"
            width="600"
            height="400"
            style="max-width:100%;background:#111;border-radius:20px;display:block;margin:auto;"
        ></canvas>

        <p style="text-align:center;">
            Move your paddle with the mouse or touch.
        </p>
    `);

    const canvas = $("#pongCanvas");
    const ctx = canvas.getContext("2d");

    let playerY = 160;
    let ball = {
        x: 300,
        y: 200,
        dx: 4,
        dy: 3
    };

    let score = 0;
    let animation;
    let running = true;

    function resetBall() {
        ball = {
            x: 300,
            y: 200,
            dx: Math.random() > 0.5 ? 4 : -4,
            dy: Math.random() > 0.5 ? 3 : -3
        };
    }

    function movePlayer(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleY = canvas.height / rect.height;

        playerY = (event.clientY - rect.top) * scaleY - 50;

        playerY = Math.max(
            0,
            Math.min(canvas.height - 100, playerY)
        );
    }

    function draw() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, 600, 400);

        ctx.fillStyle = "#fff";
        ctx.fillRect(20, playerY, 12, 100);

        const aiY = ball.y - 50;

        ctx.fillRect(568, aiY, 12, 100);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "30px sans-serif";
        ctx.fillText(score, 285, 40);
    }

    function update() {
        if (!running) {
            return;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y <= 8 || ball.y >= 392) {
            ball.dy *= -1;
        }

        const aiY = ball.y - 50;

        if (
            ball.x <= 32 &&
            ball.x >= 20 &&
            ball.y >= playerY &&
            ball.y <= playerY + 100
        ) {
            ball.dx = Math.abs(ball.dx);
        }

        if (
            ball.x >= 556 &&
            ball.x <= 568 &&
            ball.y >= aiY &&
            ball.y <= aiY + 100
        ) {
            ball.dx = -Math.abs(ball.dx);
        }

        if (ball.x < 0) {
            score = 0;
            resetBall();
        }

        if (ball.x > 600) {
            score++;
            $("#gameScore").textContent = score;
            saveHighScore("pong", score);
            resetBall();
        }

        draw();
        animation = requestAnimationFrame(update);
    }

    canvas.addEventListener("mousemove", movePlayer);
    canvas.addEventListener("touchmove", event => {
        event.preventDefault();
        movePlayer(event.touches[0]);
    }, { passive: false });

    update();

    return () => {
        running = false;
        cancelAnimationFrame(animation);
    };
}

function createBreakout(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("breakout"))}

        <canvas
            id="breakoutCanvas"
            class="game-canvas"
            width="600"
            height="450"
            style="max-width:100%;background:#111;border-radius:20px;display:block;margin:auto;"
        ></canvas>

        <p style="text-align:center;">
            Use mouse, touch or arrow keys.
        </p>
    `);

    const canvas = $("#breakoutCanvas");
    const ctx = canvas.getContext("2d");

    let paddleX = 250;
    let ball = {
        x: 300,
        y: 380,
        dx: 4,
        dy: -4
    };

    let bricks = [];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 8; col++) {
            bricks.push({
                x: 40 + col * 65,
                y: 40 + row * 30,
                width: 55,
                height: 20,
                alive: true
            });
        }
    }

    let score = 0;
    let animation;
    let running = true;

    function movePaddle(clientX) {
        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;

        paddleX = (clientX - rect.left) * scale - 50;

        paddleX = Math.max(
            0,
            Math.min(canvas.width - 100, paddleX)
        );
    }

    function draw() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bricks.forEach(brick => {
            if (!brick.alive) {
                return;
            }

            ctx.fillStyle = "#5b5cf0";
            ctx.fillRect(
                brick.x,
                brick.y,
                brick.width,
                brick.height
            );
        });

        ctx.fillStyle = "#fff";
        ctx.fillRect(paddleX, 420, 100, 12);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    function update() {
        if (!running) {
            return;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x <= 8 || ball.x >= 592) {
            ball.dx *= -1;
        }

        if (ball.y <= 8) {
            ball.dy *= -1;
        }

        if (
            ball.y >= 410 &&
            ball.y <= 432 &&
            ball.x >= paddleX &&
            ball.x <= paddleX + 100
        ) {
            ball.dy = -Math.abs(ball.dy);
        }

        bricks.forEach(brick => {
            if (
                brick.alive &&
                ball.x > brick.x &&
                ball.x < brick.x + brick.width &&
                ball.y > brick.y &&
                ball.y < brick.y + brick.height
            ) {
                brick.alive = false;
                ball.dy *= -1;
                score++;
                $("#gameScore").textContent = score;
                saveHighScore("breakout", score);
            }
        });

        if (ball.y > 450) {
            ball.x = 300;
            ball.y = 380;
            ball.dx = 4;
            ball.dy = -4;
        }

        if (bricks.every(brick => !brick.alive)) {
            running = false;
        }

        draw();
        animation = requestAnimationFrame(update);
    }

    const keyHandler = event => {
        if (event.key === "ArrowLeft") {
            paddleX -= 25;
        }

        if (event.key === "ArrowRight") {
            paddleX += 25;
        }

        paddleX = Math.max(
            0,
            Math.min(canvas.width - 100, paddleX)
        );
    };

    document.addEventListener("keydown", keyHandler);

    canvas.addEventListener("mousemove", event => {
        movePaddle(event.clientX);
    });

    canvas.addEventListener("touchmove", event => {
        event.preventDefault();
        movePaddle(event.touches[0].clientX);
    }, { passive: false });

    update();

    return () => {
        running = false;
        cancelAnimationFrame(animation);
        document.removeEventListener("keydown", keyHandler);
    };
}

function createMinesweeper(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("minesweeper"))}

        <div
            id="mineGrid"
            class="mine-grid"
            style="max-width:420px;margin:auto;"
        ></div>

        <p id="mineStatus" style="text-align:center;margin-top:15px;">
            Clear all safe cells.
        </p>
    `);

    const size = 8;
    const mineCount = 10;

    let mines = [];
    let revealed = Array(size * size).fill(false);
    let gameOver = false;

    const grid = $("#mineGrid");
    const status = $("#mineStatus");

    function setup() {
        mines = [];

        while (mines.length < mineCount) {
            const index = Math.floor(Math.random() * size * size);

            if (!mines.includes(index)) {
                mines.push(index);
            }
        }

        revealed.fill(false);
        gameOver = false;

        render();
    }

    function adjacent(index) {
        const row = Math.floor(index / size);
        const col = index % size;

        let count = 0;

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (
                    r < 0 ||
                    r >= size ||
                    c < 0 ||
                    c >= size
                ) {
                    continue;
                }

                const neighbor = r * size + c;

                if (mines.includes(neighbor)) {
                    count++;
                }
            }
        }

        return count;
    }

    function reveal(index) {
        if (gameOver || revealed[index]) {
            return;
        }

        if (mines.includes(index)) {
            gameOver = true;

            mines.forEach(mine => {
                revealed[mine] = true;
            });

            status.textContent = "Boom! Try again.";
            render();
            return;
        }

        revealed[index] = true;

        if (adjacent(index) === 0) {
            const row = Math.floor(index / size);
            const col = index % size;

            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (
                        r >= 0 &&
                        r < size &&
                        c >= 0 &&
                        c < size
                    ) {
                        reveal(r * size + c);
                    }
                }
            }
        }

        const safeCells = size * size - mineCount;

        if (
            revealed.filter(Boolean).length >= safeCells
        ) {
            gameOver = true;
            status.textContent = "You cleared the board! 🎉";
            saveHighScore("minesweeper", 1);
        }

        render();
    }

    function render() {
        grid.innerHTML = "";

        for (let i = 0; i < size * size; i++) {
            const button = document.createElement("button");

            button.className = "mine-cell";

            if (revealed[i]) {
                button.classList.add("revealed");

                if (mines.includes(i)) {
                    button.classList.add("mine");
                    button.textContent = "💣";
                } else {
                    const number = adjacent(i);
                    button.textContent = number || "";
                }
            } else {
                button.textContent = "";
            }

            button.addEventListener("click", () => reveal(i));

            grid.appendChild(button);
        }
    }

    setup();

    return () => {};
}

function createConnectFour(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("connect4"))}

        <p id="connectStatus" style="text-align:center;font-weight:700;">
            Red player's turn
        </p>

        <div
            id="connectBoard"
            class="connect-board"
            style="max-width:500px;margin:auto;"
        ></div>

        <div style="text-align:center;margin-top:15px;">
            <button id="connectReset" class="game-button">
                New Game
            </button>
        </div>
    `);

    const boardElement = $("#connectBoard");
    const status = $("#connectStatus");

    let board = Array(42).fill("");
    let player = "R";
    let over = false;

    function render() {
        boardElement.innerHTML = board.map((value, index) => `
            <button
                class="connect-cell"
                data-index="${index}"
                type="button"
                style="
                    border-radius:50%;
                    aspect-ratio:1;
                    background:${
                        value === "R"
                            ? "#e63946"
                            : value === "Y"
                                ? "#ffd166"
                                : "rgba(255,255,255,.18)"
                    };
                "
            ></button>
        `).join("");

        boardElement.querySelectorAll(".connect-cell").forEach(cell => {
            cell.addEventListener("click", () => {
                drop(Number(cell.dataset.index) % 7);
            });
        });
    }

    function drop(column) {
        if (over) {
            return;
        }

        for (let row = 5; row >= 0; row--) {
            const index = row * 7 + column;

            if (!board[index]) {
                board[index] = player;

                if (checkWin(player)) {
                    status.textContent =
                        `${player === "R" ? "Red" : "Yellow"} wins! 🎉`;

                    over = true;
                } else if (board.every(Boolean)) {
                    status.textContent = "Draw!";
                    over = true;
                } else {
                    player = player === "R" ? "Y" : "R";

                    status.textContent =
                        `${player === "R" ? "Red" : "Yellow"} player's turn`;
                }

                render();
                return;
            }
        }
    }

    function checkWin(value) {
        const directions = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1]
        ];

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                for (const [dr, dc] of directions) {
                    let count = 0;

                    for (let step = 0; step < 4; step++) {
                        const r = row + dr * step;
                        const c = col + dc * step;

                        if (
                            r >= 0 &&
                            r < 6 &&
                            c >= 0 &&
                            c < 7 &&
                            board[r * 7 + c] === value
                        ) {
                            count++;
                        }
                    }

                    if (count === 4) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    $("#connectReset").addEventListener("click", () => {
        board = Array(42).fill("");
        player = "R";
        over = false;
        status.textContent = "Red player's turn";
        render();
    });

    render();

    return () => {};
}

function createRPS(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("rps"))}

        <div style="text-align:center;">
            <h2 id="rpsResult">Choose your move</h2>

            <div class="choice-row" style="margin-top:25px;">
                <button class="choice-button" data-choice="rock">✊ Rock</button>
                <button class="choice-button" data-choice="paper">✋ Paper</button>
                <button class="choice-button" data-choice="scissors">✌️ Scissors</button>
            </div>

            <p id="rpsDetails" style="margin-top:20px;"></p>
        </div>
    `);

    const result = $("#rpsResult");
    const details = $("#rpsDetails");

    let score = 0;

    const choices = ["rock", "paper", "scissors"];

    function play(player) {
        const computer =
            choices[Math.floor(Math.random() * choices.length)];

        if (player === computer) {
            result.textContent = "Draw!";
        } else if (
            (player === "rock" && computer === "scissors") ||
            (player === "paper" && computer === "rock") ||
            (player === "scissors" && computer === "paper")
        ) {
            score++;
            result.textContent = "You win! 🎉";
        } else {
            result.textContent = "Computer wins!";
        }

        $("#gameScore").textContent = score;

        saveHighScore("rps", score);

        details.textContent =
            `You: ${player} | Computer: ${computer}`;
    }

    container.querySelectorAll("[data-choice]").forEach(button => {
        button.addEventListener("click", () => {
            play(button.dataset.choice);
        });
    });

    return () => {};
}

function createSimon(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("simon"))}

        <div
            id="simonGrid"
            class="simon-grid"
            style="max-width:400px;margin:auto;"
        >
            <button class="simon-button simon-red" data-color="red"></button>
            <button class="simon-button simon-blue" data-color="blue"></button>
            <button class="simon-button simon-green" data-color="green"></button>
            <button class="simon-button simon-yellow" data-color="yellow"></button>
        </div>

        <p id="simonStatus" style="text-align:center;margin-top:20px;">
            Press Start
        </p>

        <div style="text-align:center;">
            <button id="simonStart" class="game-button">
                Start
            </button>
        </div>
    `);

    const colors = ["red", "blue", "green", "yellow"];
    const sequence = [];
    let userIndex = 0;
    let playing = false;
    let score = 0;

    const status = $("#simonStatus");

    function flash(color) {
        const button = container.querySelector(
            `[data-color="${color}"]`
        );

        if (!button) {
            return Promise.resolve();
        }

        button.classList.add("active");

        return new Promise(resolve => {
            setTimeout(() => {
                button.classList.remove("active");
                resolve();
            }, 350);
        });
    }

    async function showSequence() {
        playing = false;
        status.textContent = "Watch carefully...";

        for (const color of sequence) {
            await flash(color);
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        userIndex = 0;
        playing = true;
        status.textContent = "Your turn!";
    }

    async function nextRound() {
        sequence.push(
            colors[Math.floor(Math.random() * colors.length)]
        );

        score = sequence.length - 1;
        $("#gameScore").textContent = score;

        await showSequence();
    }

    function fail() {
        playing = false;
        status.textContent = "Wrong! Game over.";

        saveHighScore("simon", score);
    }

    container.querySelectorAll(".simon-button").forEach(button => {
        button.addEventListener("click", async () => {
            if (!playing) {
                return;
            }

            const selected = button.dataset.color;

            await flash(selected);

            if (selected !== sequence[userIndex]) {
                fail();
                return;
            }

            userIndex++;

            if (userIndex === sequence.length) {
                playing = false;

                setTimeout(() => {
                    nextRound();
                }, 400);
            }
        });
    });

    $("#simonStart").addEventListener("click", () => {
        sequence.length = 0;
        score = 0;
        $("#gameScore").textContent = 0;
        nextRound();
    });

    return () => {};
}

function createWhack(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("whack"))}

        <div
            id="whackGrid"
            style="
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:10px;
                max-width:450px;
                margin:auto;
            "
        ></div>

        <p id="whackTime" style="text-align:center;margin-top:15px;">
            Time: 20
        </p>
    `);

    const grid = $("#whackGrid");
    const timeElement = $("#whackTime");

    let score = 0;
    let time = 20;
    let mole = -1;
    let interval;
    let timer;

    function render() {
        grid.innerHTML = "";

        for (let i = 0; i < 9; i++) {
            const button = document.createElement("button");

            button.className = "game-button";
            button.style.minHeight = "90px";
            button.textContent = i === mole ? "🐹" : "⬜";

            button.addEventListener("click", () => {
                if (i === mole && time > 0) {
                    score++;
                    $("#gameScore").textContent = score;
                    saveHighScore("whack", score);
                    newMole();
                }
            });

            grid.appendChild(button);
        }
    }

    function newMole() {
        mole = Math.floor(Math.random() * 9);
        render();
    }

    newMole();

    interval = setInterval(newMole, 700);

    timer = setInterval(() => {
        time--;
        timeElement.textContent = `Time: ${time}`;

        if (time <= 0) {
            clearInterval(interval);
            clearInterval(timer);
            mole = -1;
            render();
        }
    }, 1000);

    return () => {
        clearInterval(interval);
        clearInterval(timer);
    };
}

function createSlidingPuzzle(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("sliding"))}

        <div
            id="slidingGrid"
            style="
                display:grid;
                grid-template-columns:repeat(4,1fr);
                gap:6px;
                max-width:400px;
                margin:auto;
            "
        ></div>

        <p id="slidingStatus" style="text-align:center;margin-top:15px;">
            Arrange 1 to 15.
        </p>
    `);

    const grid = $("#slidingGrid");
    const status = $("#slidingStatus");

    let tiles = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 0
    ];

    let moves = 0;

    function shuffle() {
        for (let i = 0; i < 200; i++) {
            const empty = tiles.indexOf(0);
            const neighbors = getNeighbors(empty);

            const move =
                neighbors[Math.floor(Math.random() * neighbors.length)];

            [tiles[empty], tiles[move]] =
                [tiles[move], tiles[empty]];
        }

        moves = 0;
        render();
    }

    function getNeighbors(index) {
        const row = Math.floor(index / 4);
        const col = index % 4;

        const result = [];

        if (row > 0) result.push(index - 4);
        if (row < 3) result.push(index + 4);
        if (col > 0) result.push(index - 1);
        if (col < 3) result.push(index + 1);

        return result;
    }

    function render() {
        grid.innerHTML = tiles.map((value, index) => `
            <button
                class="game-button"
                data-index="${index}"
                style="
                    min-height:75px;
                    font-size:1.4rem;
                    ${value === 0 ? "visibility:hidden;" : ""}
                "
            >
                ${value}
            </button>
        `).join("");

        grid.querySelectorAll("[data-index]").forEach(button => {
            button.addEventListener("click", () => {
                move(Number(button.dataset.index));
            });
        });

        $("#gameScore").textContent = moves;
    }

    function move(index) {
        const empty = tiles.indexOf(0);

        if (!getNeighbors(empty).includes(index)) {
            return;
        }

        [tiles[empty], tiles[index]] =
            [tiles[index], tiles[empty]];

        moves++;

        render();

        if (
            tiles.every(
                (value, index) =>
                    value === (index === 15 ? 0 : index + 1)
            )
        ) {
            status.textContent = `Solved in ${moves} moves! 🎉`;
            saveHighScore("sliding", Math.max(1, 1000 - moves));
        }
    }

    shuffle();

    return () => {};
}

function createColorMatch(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("colormatch"))}

        <div style="text-align:center;">
            <h2 id="colorTarget">Find: RED</h2>

            <div
                id="colorOptions"
                style="
                    display:grid;
                    grid-template-columns:repeat(2,1fr);
                    gap:15px;
                    max-width:450px;
                    margin:25px auto;
                "
            ></div>

            <p id="colorStatus">Choose the matching color.</p>
        </div>
    `);

    const colors = [
        { name: "RED", value: "#ef476f" },
        { name: "BLUE", value: "#118ab2" },
        { name: "GREEN", value: "#06d6a0" },
        { name: "YELLOW", value: "#ffd166" },
        { name: "PURPLE", value: "#8338ec" },
        { name: "ORANGE", value: "#fb8500" }
    ];

    const targetElement = $("#colorTarget");
    const options = $("#colorOptions");
    const status = $("#colorStatus");

    let target;
    let score = 0;

    function next() {
        target = colors[Math.floor(Math.random() * colors.length)];

        targetElement.textContent = `Find: ${target.name}`;

        const selected = [
            target,
            ...colors
                .filter(color => color !== target)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
        ].sort(() => Math.random() - 0.5);

        options.innerHTML = selected.map(color => `
            <button
                type="button"
                data-name="${color.name}"
                style="
                    min-height:100px;
                    border:0;
                    border-radius:20px;
                    background:${color.value};
                    cursor:pointer;
                "
            ></button>
        `).join("");

        options.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                if (button.dataset.name === target.name) {
                    score++;
                    status.textContent = "Correct! 🎉";
                    $("#gameScore").textContent = score;
                    saveHighScore("colormatch", score);
                    next();
                } else {
                    score = Math.max(0, score - 1);
                    status.textContent = "Wrong!";
                    $("#gameScore").textContent = score;
                }
            });
        });
    }

    next();

    return () => {};
}

function createMathSprint(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("math"))}

        <div style="text-align:center;">
            <h2 id="mathQuestion"></h2>

            <input
                id="mathAnswer"
                class="game-input"
                type="number"
                placeholder="Answer"
            >

            <button id="mathSubmit" class="game-button">
                Submit
            </button>

            <p id="mathTimer">Time: 30</p>
            <p id="mathStatus">Solve quickly!</p>
        </div>
    `);

    const question = $("#mathQuestion");
    const answer = $("#mathAnswer");
    const submit = $("#mathSubmit");
    const timerElement = $("#mathTimer");
    const status = $("#mathStatus");

    let correctAnswer = 0;
    let score = 0;
    let time = 30;
    let timer;

    function nextQuestion() {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;

        const operations = ["+", "-", "×"];
        const op =
            operations[Math.floor(Math.random() * operations.length)];

        if (op === "+") {
            correctAnswer = a + b;
        }

        if (op === "-") {
            correctAnswer = a - b;
        }

        if (op === "×") {
            correctAnswer = a * b;
        }

        question.textContent = `${a} ${op} ${b} = ?`;
        answer.value = "";
        answer.focus();
    }

    function check() {
        if (time <= 0) {
            return;
        }

        if (Number(answer.value) === correctAnswer) {
            score++;
            status.textContent = "Correct! 🎉";
            $("#gameScore").textContent = score;
            saveHighScore("math", score);
        } else {
            status.textContent = "Try again!";
        }

        nextQuestion();
    }

    submit.addEventListener("click", check);

    answer.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            check();
        }
    });

    timer = setInterval(() => {
        time--;
        timerElement.textContent = `Time: ${time}`;

        if (time <= 0) {
            clearInterval(timer);
            status.textContent = `Time's up! Score: ${score}`;
            answer.disabled = true;
            submit.disabled = true;
        }
    }, 1000);

    nextQuestion();

    return () => {
        clearInterval(timer);
    };
}

function createTapCounter(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("tap"))}

        <div style="text-align:center;">
            <div
                id="tapButton"
                style="
                    width:min(300px,80vw);
                    height:min(300px,80vw);
                    margin:30px auto;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#5b5cf0;
                    color:white;
                    font-size:2rem;
                    font-weight:800;
                    cursor:pointer;
                    user-select:none;
                "
            >
                TAP!
            </div>

            <p id="tapTime">Time: 10</p>
        </div>
    `);

    const button = $("#tapButton");
    const timeElement = $("#tapTime");

    let score = 0;
    let time = 10;
    let timerStarted = false;
    let timer;

    function startTimer() {
        if (timerStarted) {
            return;
        }

        timerStarted = true;

        timer = setInterval(() => {
            time--;
            timeElement.textContent = `Time: ${time}`;

            if (time <= 0) {
                clearInterval(timer);
                button.textContent = `Score: ${score}`;
                saveHighScore("tap", score);
            }
        }, 1000);
    }

    button.addEventListener("click", () => {
        if (time <= 0) {
            return;
        }

        startTimer();

        score++;
        $("#gameScore").textContent = score;
    });

    return () => {
        clearInterval(timer);
    };
}

function createWordGuess(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("word"))}

        <div style="text-align:center;">
            <h2 id="wordDisplay"></h2>

            <input
                id="wordInput"
                class="game-input"
                type="text"
                maxlength="1"
                placeholder="Letter"
            >

            <button id="wordButton" class="game-button">
                Guess
            </button>

            <p id="wordStatus"></p>
            <p id="wordLetters"></p>
        </div>
    `);

    const words = [
        "APPLE",
        "HOUSE",
        "PLANE",
        "MUSIC",
        "LIGHT",
        "WATER",
        "GREEN",
        "TIGER",
        "ROBOT",
        "PHONE"
    ];

    const word = words[Math.floor(Math.random() * words.length)];

    let guessed = [];
    let score = 0;
    let mistakes = 0;

    const display = $("#wordDisplay");
    const input = $("#wordInput");
    const button = $("#wordButton");
    const status = $("#wordStatus");
    const letters = $("#wordLetters");

    function render() {
        display.textContent = word
            .split("")
            .map(letter =>
                guessed.includes(letter) ? letter : "_"
            )
            .join(" ");

        letters.textContent =
            `Guessed: ${guessed.join(", ") || "None"}`;

        $("#gameScore").textContent = score;
    }

    function guess() {
        const letter = input.value.trim().toUpperCase();

        if (!/^[A-Z]$/.test(letter)) {
            return;
        }

        input.value = "";

        if (guessed.includes(letter)) {
            return;
        }

        guessed.push(letter);

        if (word.includes(letter)) {
            score++;
            status.textContent = "Correct! 🎉";
        } else {
            mistakes++;
            score = Math.max(0, score - 1);
            status.textContent = "Not in the word.";
        }

        render();

        if (word.split("").every(letter => guessed.includes(letter))) {
            status.textContent =
                `You found the word: ${word}! 🎉`;

            saveHighScore("word", score);
            input.disabled = true;
            button.disabled = true;
        }

        if (mistakes >= 6) {
            status.textContent =
                `Game over! The word was ${word}.`;

            input.disabled = true;
            button.disabled = true;
        }
    }

    button.addEventListener("click", guess);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            guess();
        }
    });

    render();

    return () => {};
}

function createDodgeBlocks(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("dodge"))}

        <canvas
            id="dodgeCanvas"
            class="game-canvas"
            width="400"
            height="500"
            style="max-width:100%;background:#111;border-radius:20px;display:block;margin:auto;"
        ></canvas>

        <p style="text-align:center;">
            Move left and right to dodge blocks.
        </p>
    `);

    const canvas = $("#dodgeCanvas");
    const ctx = canvas.getContext("2d");

    let player = {
        x: 180,
        y: 450,
        width: 40,
        height: 40
    };

    let blocks = [];
    let score = 0;
    let keys = {};
    let animation;
    let running = true;
    let spawnTimer = 0;

    const keyDown = event => {
        keys[event.key] = true;
    };

    const keyUp = event => {
        keys[event.key] = false;
    };

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function draw() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, 400, 500);

        ctx.fillStyle = "#5b5cf0";
        ctx.fillRect(
            player.x,
            player.y,
            player.width,
            player.height
        );

        ctx.fillStyle = "#ff4d6d";

        blocks.forEach(block => {
            ctx.fillRect(
                block.x,
                block.y,
                block.width,
                block.height
            );
        });
    }

    function update() {
        if (!running) {
            return;
        }

        if (keys.ArrowLeft) {
            player.x -= 6;
        }

        if (keys.ArrowRight) {
            player.x += 6;
        }

        player.x = Math.max(
            0,
            Math.min(360, player.x)
        );

        spawnTimer++;

        if (spawnTimer > 35) {
            spawnTimer = 0;

            blocks.push({
                x: Math.random() * 370,
                y: -30,
                width: 30,
                height: 30,
                speed: 3 + Math.random() * 3
            });
        }

        blocks.forEach(block => {
            block.y += block.speed;
        });

        blocks = blocks.filter(block => block.y < 530);

        for (const block of blocks) {
            if (
                player.x < block.x + block.width &&
                player.x + player.width > block.x &&
                player.y < block.y + block.height &&
                player.y + player.height > block.y
            ) {
                running = false;
                saveHighScore("dodge", score);

                container.insertAdjacentHTML("beforeend", `
                    <div class="message-overlay">
                        <div class="message-box">
                            <div class="message-icon">🚧</div>
                            <h2>Game Over</h2>
                            <p>Score: ${score}</p>
                        </div>
                    </div>
                `);

                break;
            }
        }

        score++;
        $("#gameScore").textContent = Math.floor(score / 10);

        draw();

        animation = requestAnimationFrame(update);
    }

    update();

    return () => {
        running = false;
        cancelAnimationFrame(animation);
        document.removeEventListener("keydown", keyDown);
        document.removeEventListener("keyup", keyUp);
    };
}

function createCoinCatcher(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("coin"))}

        <canvas
            id="coinCanvas"
            class="game-canvas"
            width="400"
            height="500"
            style="max-width:100%;background:#111;border-radius:20px;display:block;margin:auto;"
        ></canvas>

        <p style="text-align:center;">
            Move the basket with your finger or mouse.
        </p>
    `);

    const canvas = $("#coinCanvas");
    const ctx = canvas.getContext("2d");

    let basketX = 170;
    let coins = [];
    let score = 0;
    let animation;
    let running = true;

    function moveBasket(clientX) {
        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;

        basketX =
            (clientX - rect.left) * scale - 40;

        basketX = Math.max(
            0,
            Math.min(320, basketX)
        );
    }

    canvas.addEventListener("mousemove", event => {
        moveBasket(event.clientX);
    });

    canvas.addEventListener("touchmove", event => {
        event.preventDefault();
        moveBasket(event.touches[0].clientX);
    }, { passive: false });

    function draw() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, 400, 500);

        ctx.fillStyle = "#5b5cf0";
        ctx.fillRect(basketX, 450, 80, 20);

        coins.forEach(coin => {
            ctx.fillStyle = "#ffd166";
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function update() {
        if (!running) {
            return;
        }

        if (Math.random() < 0.04) {
            coins.push({
                x: 10 + Math.random() * 380,
                y: -10,
                speed: 3 + Math.random() * 2
            });
        }

        coins.forEach(coin => {
            coin.y += coin.speed;
        });

        coins = coins.filter(coin => {
            if (
                coin.y >= 440 &&
                coin.x >= basketX &&
                coin.x <= basketX + 80
            ) {
                score++;
                $("#gameScore").textContent = score;
                saveHighScore("coin", score);
                return false;
            }

            return coin.y < 520;
        });

        draw();

        animation = requestAnimationFrame(update);
    }

    update();

    return () => {
        running = false;
        cancelAnimationFrame(animation);
    };
}

function createTargetTap(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("target"))}

        <div
            id="targetArea"
            style="
                position:relative;
                height:450px;
                max-width:650px;
                margin:auto;
                border-radius:25px;
                overflow:hidden;
                background:rgba(91,92,240,.08);
            "
        ></div>

        <p id="targetTime" style="text-align:center;">
            Time: 20
        </p>
    `);

    const area = $("#targetArea");
    const timeElement = $("#targetTime");

    let score = 0;
    let time = 20;
    let interval;
    let timer;

    function spawn() {
        area.innerHTML = `
            <button
                id="targetButton"
                style="
                    position:absolute;
                    width:65px;
                    height:65px;
                    border:0;
                    border-radius:50%;
                    background:#ff4d6d;
                    cursor:pointer;
                    font-size:1.5rem;
                "
            >
                🎯
            </button>
        `;

        const button = $("#targetButton");

        button.style.left =
            `${Math.random() * Math.max(0, area.clientWidth - 70)}px`;

        button.style.top =
            `${Math.random() * Math.max(0, area.clientHeight - 70)}px`;

        button.addEventListener("click", () => {
            score++;
            $("#gameScore").textContent = score;
            saveHighScore("target", score);
            spawn();
        });
    }

    spawn();

    interval = setInterval(spawn, 1200);

    timer = setInterval(() => {
        time--;
        timeElement.textContent = `Time: ${time}`;

        if (time <= 0) {
            clearInterval(interval);
            clearInterval(timer);
            area.innerHTML = `
                <div style="
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:2rem;
                    font-weight:800;
                ">
                    Time Up! 🎉
                </div>
            `;
        }
    }, 1000);

    return () => {
        clearInterval(interval);
        clearInterval(timer);
    };
}

function createLightsOut(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("lightsout"))}

        <div
            id="lightsGrid"
            style="
                display:grid;
                grid-template-columns:repeat(5,1fr);
                gap:7px;
                max-width:400px;
                margin:auto;
            "
        ></div>

        <p id="lightsStatus" style="text-align:center;margin-top:15px;">
            Turn off all lights.
        </p>
    `);

    const grid = $("#lightsGrid");
    const status = $("#lightsStatus");

    let board = Array(25).fill(false);
    let moves = 0;

    function setup() {
        board = Array(25).fill(false);

        for (let i = 0; i < 12; i++) {
            toggle(Math.floor(Math.random() * 25), false);
        }

        moves = 0;
        render();
    }

    function toggle(index, countMove = true) {
        const row = Math.floor(index / 5);
        const col = index % 5;

        const indexes = [index];

        if (row > 0) indexes.push(index - 5);
        if (row < 4) indexes.push(index + 5);
        if (col > 0) indexes.push(index - 1);
        if (col < 4) indexes.push(index + 1);

        indexes.forEach(i => {
            board[i] = !board[i];
        });

        if (countMove) {
            moves++;
            $("#gameScore").textContent = moves;
        }
    }

    function render() {
        grid.innerHTML = board.map((on, index) => `
            <button
                data-index="${index}"
                type="button"
                style="
                    aspect-ratio:1;
                    border:0;
                    border-radius:12px;
                    cursor:pointer;
                    background:${on ? "#ffd166" : "#444"};
                    box-shadow:${on ? "0 0 18px rgba(255,209,102,.5)" : "none"};
                "
            >
                ${on ? "💡" : ""}
            </button>
        `).join("");

        grid.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                toggle(Number(button.dataset.index));
                render();

                if (board.every(value => !value)) {
                    status.textContent =
                        `Solved in ${moves} moves! 🎉`;

                    saveHighScore(
                        "lightsout",
                        Math.max(1, 1000 - moves)
                    );
                }
            });
        });
    }

    setup();

    return () => {};
}

function createHigherLower(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("higherlower"))}

        <div style="text-align:center;">
            <div style="font-size:1.2rem;">Current Number</div>

            <div
                id="higherNumber"
                style="
                    font-size:4rem;
                    font-weight:900;
                    margin:20px;
                "
            >
                50
            </div>

            <button id="higherButton" class="game-button">
                ⬆️ Higher
            </button>

            <button id="lowerButton" class="game-button">
                ⬇️ Lower
            </button>

            <p id="higherStatus">Guess the next number.</p>
        </div>
    `);

    const numberElement = $("#higherNumber");
    const status = $("#higherStatus");

    let current = Math.floor(Math.random() * 100) + 1;
    let score = 0;
    let over = false;

    numberElement.textContent = current;

    function play(direction) {
        if (over) {
            return;
        }

        const next = Math.floor(Math.random() * 100) + 1;

        const correct =
            direction === "higher"
                ? next > current
                : next < current;

        if (next === current) {
            status.textContent = "Same number! Continue.";
        } else if (correct) {
            score++;
            status.textContent = "Correct! 🎉";
        } else {
            over = true;
            status.textContent =
                `Wrong! Final score: ${score}`;

            saveHighScore("higherlower", score);
        }

        current = next;
        numberElement.textContent = current;
        $("#gameScore").textContent = score;
    }

    $("#higherButton").addEventListener(
        "click",
        () => play("higher")
    );

    $("#lowerButton").addEventListener(
        "click",
        () => play("lower")
    );

    return () => {};
}

function createDiceDuel(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("dice"))}

        <div style="text-align:center;">
            <div
                style="
                    display:flex;
                    justify-content:center;
                    gap:50px;
                    flex-wrap:wrap;
                    margin:30px;
                "
            >
                <div>
                    <h3>You</h3>
                    <div id="playerDice" style="font-size:5rem;">🎲</div>
                </div>

                <div>
                    <h3>Computer</h3>
                    <div id="computerDice" style="font-size:5rem;">🎲</div>
                </div>
            </div>

            <button id="diceRoll" class="game-button">
                Roll Dice
            </button>

            <p id="diceStatus">Ready!</p>
        </div>
    `);

    const playerDice = $("#playerDice");
    const computerDice = $("#computerDice");
    const status = $("#diceStatus");

    let score = 0;

    const faces = [
        "⚀",
        "⚁",
        "⚂",
        "⚃",
        "⚄",
        "⚅"
    ];

    function roll() {
        const player = Math.floor(Math.random() * 6) + 1;
        const computer = Math.floor(Math.random() * 6) + 1;

        playerDice.textContent = faces[player - 1];
        computerDice.textContent = faces[computer - 1];

        if (player > computer) {
            score++;
            status.textContent = "You win! 🎉";
        } else if (player < computer) {
            status.textContent = "Computer wins!";
        } else {
            status.textContent = "Draw!";
        }

        $("#gameScore").textContent = score;
        saveHighScore("dice", score);
    }

    $("#diceRoll").addEventListener("click", roll);

    return () => {};
}

function createCoinFlip(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("coinflip"))}

        <div style="text-align:center;">
            <div
                id="coinDisplay"
                style="
                    font-size:6rem;
                    margin:30px;
                "
            >
                🪙
            </div>

            <button class="game-button" data-side="heads">
                Heads
            </button>

            <button class="game-button" data-side="tails">
                Tails
            </button>

            <p id="coinStatus">Choose a side.</p>
        </div>
    `);

    const display = $("#coinDisplay");
    const status = $("#coinStatus");

    let score = 0;

    function flip(choice) {
        const result =
            Math.random() < 0.5
                ? "heads"
                : "tails";

        display.textContent =
            result === "heads" ? "🙂" : "🪙";

        if (choice === result) {
            score++;
            status.textContent = "Correct! 🎉";
        } else {
            status.textContent = `It was ${result}.`;
        }

        $("#gameScore").textContent = score;
        saveHighScore("coinflip", score);
    }

    container.querySelectorAll("[data-side]").forEach(button => {
        button.addEventListener("click", () => {
            flip(button.dataset.side);
        });
    });

    return () => {};
}

function createTypingSprint(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("typing"))}

        <div style="text-align:center;">
            <h2 id="typingText"></h2>

            <textarea
                id="typingInput"
                class="game-input"
                style="width:100%;min-height:120px;margin-top:20px;"
                placeholder="Start typing here..."
            ></textarea>

            <p id="typingTime">Time: 30</p>
            <p id="typingStatus">Type the sentence exactly.</p>
        </div>
    `);

    const sentences = [
        "Mastermind Games Hub is fun.",
        "Play free games offline.",
        "Every game starts with an idea.",
        "Keep playing and improve your score.",
        "Welcome to the game hub."
    ];

    const target =
        sentences[Math.floor(Math.random() * sentences.length)];

    const textElement = $("#typingText");
    const input = $("#typingInput");
    const status = $("#typingStatus");
    const timeElement = $("#typingTime");

    textElement.textContent = target;

    let time = 30;
    let started = false;
    let timer;

    function startTimer() {
        if (started) {
            return;
        }

        started = true;

        timer = setInterval(() => {
            time--;
            timeElement.textContent = `Time: ${time}`;

            if (time <= 0) {
                clearInterval(timer);
                input.disabled = true;
                status.textContent = "Time's up!";
            }
        }, 1000);
    }

    input.addEventListener("input", () => {
        startTimer();

        const typed = input.value;

        let correct = 0;

        for (
            let i = 0;
            i < Math.min(typed.length, target.length);
            i++
        ) {
            if (typed[i] === target[i]) {
                correct++;
            }
        }

        $("#gameScore").textContent = correct;

        if (typed === target) {
            clearInterval(timer);

            const score = Math.max(
                1,
                Math.round((correct / target.length) * 100)
            );

            $("#gameScore").textContent = score;
            saveHighScore("typing", score);

            status.textContent = "Completed! 🎉";
            input.disabled = true;
        }
    });

    return () => {
        clearInterval(timer);
    };
}

function createHangman(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("hangman"))}

        <div style="text-align:center;">
            <div
                id="hangmanWord"
                style="
                    font-size:2.2rem;
                    letter-spacing:8px;
                    margin:30px;
                "
            ></div>

            <input
                id="hangmanInput"
                class="game-input"
                type="text"
                maxlength="1"
                placeholder="Letter"
            >

            <button id="hangmanButton" class="game-button">
                Guess
            </button>

            <p id="hangmanStatus"></p>
            <p id="hangmanLives">Lives: 6</p>
        </div>
    `);

    const words = [
        "GAMES",
        "MASTER",
        "COMPUTER",
        "PUZZLE",
        "ARCADE",
        "PLAYER",
        "MONKEY",
        "PLANET",
        "ROCKET",
        "TIGER"
    ];

    const word =
        words[Math.floor(Math.random() * words.length)];

    const wordElement = $("#hangmanWord");
    const input = $("#hangmanInput");
    const button = $("#hangmanButton");
    const status = $("#hangmanStatus");
    const livesElement = $("#hangmanLives");

    let guessed = [];
    let lives = 6;

    function render() {
        wordElement.textContent = word
            .split("")
            .map(letter =>
                guessed.includes(letter) ? letter : "_"
            )
            .join(" ");

        livesElement.textContent = `Lives: ${lives}`;
        $("#gameScore").textContent = guessed.filter(
            letter => word.includes(letter)
        ).length;
    }

    function guess() {
        const letter = input.value.toUpperCase().trim();

        input.value = "";

        if (!/^[A-Z]$/.test(letter)) {
            return;
        }

        if (guessed.includes(letter)) {
            return;
        }

        guessed.push(letter);

        if (!word.includes(letter)) {
            lives--;
            status.textContent = "Wrong letter!";
        } else {
            status.textContent = "Correct! 🎉";
        }

        render();

        if (word.split("").every(letter => guessed.includes(letter))) {
            status.textContent = `You won! The word was ${word}.`;
            saveHighScore("hangman", lives * 10);
            input.disabled = true;
            button.disabled = true;
        }

        if (lives <= 0) {
            status.textContent =
                `Game over! The word was ${word}.`;

            input.disabled = true;
            button.disabled = true;
        }
    }

    button.addEventListener("click", guess);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            guess();
        }
    });

    render();

    return () => {};
}

function createColorHunt(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("colorhunt"))}

        <div style="text-align:center;">
            <h2 id="huntTitle">Find the color</h2>

            <div
                id="huntOptions"
                style="
                    display:grid;
                    grid-template-columns:repeat(3,1fr);
                    gap:12px;
                    max-width:450px;
                    margin:30px auto;
                "
            ></div>

            <p id="huntStatus"></p>
        </div>
    `);

    const colors = [
        ["Red", "#ef476f"],
        ["Blue", "#118ab2"],
        ["Green", "#06d6a0"],
        ["Yellow", "#ffd166"],
        ["Purple", "#8338ec"],
        ["Orange", "#fb8500"]
    ];

    const options = $("#huntOptions");
    const title = $("#huntTitle");
    const status = $("#huntStatus");

    let target;
    let score = 0;

    function next() {
        target =
            colors[Math.floor(Math.random() * colors.length)];

        title.textContent = `Find: ${target[0]}`;

        const choices = [
            target,
            ...colors
                .filter(color => color[0] !== target[0])
                .sort(() => Math.random() - 0.5)
                .slice(0, 5)
        ].sort(() => Math.random() - 0.5);

        options.innerHTML = choices.map(color => `
            <button
                type="button"
                data-color="${color[0]}"
                style="
                    height:90px;
                    border:0;
                    border-radius:18px;
                    background:${color[1]};
                    cursor:pointer;
                "
            ></button>
        `).join("");

        options.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                if (button.dataset.color === target[0]) {
                    score++;
                    status.textContent = "Correct! 🎉";
                    $("#gameScore").textContent = score;
                    saveHighScore("colorhunt", score);
                    next();
                } else {
                    score = Math.max(0, score - 1);
                    status.textContent = "Wrong!";
                    $("#gameScore").textContent = score;
                }
            });
        });
    }

    next();

    return () => {};
}

function createQuickMath(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("quickmath"))}

        <div style="text-align:center;">
            <h2 id="quickQuestion"></h2>

            <div
                id="quickOptions"
                style="
                    display:grid;
                    grid-template-columns:repeat(2,1fr);
                    gap:12px;
                    max-width:400px;
                    margin:25px auto;
                "
            ></div>

            <p id="quickStatus"></p>
        </div>
    `);

    const question = $("#quickQuestion");
    const options = $("#quickOptions");
    const status = $("#quickStatus");

    let answer = 0;
    let score = 0;

    function next() {
        const a = Math.floor(Math.random() * 12) + 1;
        const b = Math.floor(Math.random() * 12) + 1;

        const operations = ["+", "-", "×"];
        const operation =
            operations[Math.floor(Math.random() * operations.length)];

        if (operation === "+") {
            answer = a + b;
        }

        if (operation === "-") {
            answer = a - b;
        }

        if (operation === "×") {
            answer = a * b;
        }

        question.textContent =
            `${a} ${operation} ${b} = ?`;

        const answers = new Set([answer]);

        while (answers.size < 4) {
            answers.add(
                answer +
                Math.floor(Math.random() * 11) - 5
            );
        }

        options.innerHTML = [...answers]
            .sort(() => Math.random() - 0.5)
            .map(value => `
                <button
                    class="game-button"
                    data-answer="${value}"
                >
                    ${value}
                </button>
            `)
            .join("");

        options.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                if (Number(button.dataset.answer) === answer) {
                    score++;
                    status.textContent = "Correct! 🎉";
                } else {
                    status.textContent = "Wrong!";
                }

                $("#gameScore").textContent = score;
                saveHighScore("quickmath", score);

                next();
            });
        });
    }

    next();

    return () => {};
}

function createTreasureHunt(container) {
    container.innerHTML = gameLayout(`
        ${infoBar(0, getHighScore("treasure"))}

        <div style="text-align:center;">
            <h2>Find the hidden treasure 💎</h2>

            <div
                id="treasureGrid"
                style="
                    display:grid;
                    grid-template-columns:repeat(5,1fr);
                    gap:8px;
                    max-width:450px;
                    margin:25px auto;
                "
            ></div>

            <p id="treasureStatus">
                Choose a tile.
            </p>
        </div>
    `);

    const grid = $("#treasureGrid");
    const status = $("#treasureStatus");

    const treasure =
        Math.floor(Math.random() * 25);

    let attempts = 0;
    let found = false;

    function render() {
        grid.innerHTML = "";

        for (let i = 0; i < 25; i++) {
            const button = document.createElement("button");

            button.className = "game-button";
            button.style.minHeight = "65px";
            button.textContent = "❓";

            button.addEventListener("click", () => {
                if (found) {
                    return;
                }

                attempts++;

                if (i === treasure) {
                    found = true;
                    button.textContent = "💎";
                    status.textContent =
                        `Treasure found in ${attempts} attempts! 🎉`;

                    $("#gameScore").textContent =
                        Math.max(1, 100 - attempts);

                    saveHighScore(
                        "treasure",
                        Math.max(1, 100 - attempts)
                    );

                    grid.querySelectorAll("button").forEach(
                        item => item.disabled = true
                    );
                } else {
                    button.textContent = "❌";

                    const treasureRow =
                        Math.floor(treasure / 5);

                    const treasureCol =
                        treasure % 5;

                    const row =
                        Math.floor(i / 5);

                    const col =
                        i % 5;

                    const distance =
                        Math.abs(treasureRow - row) +
                        Math.abs(treasureCol - col);

                    status.textContent =
                        distance <= 2
                            ? "Very close! 🔥"
                            : distance <= 4
                                ? "Getting warmer! 🌡️"
                                : "Far away! ❄️";
                }
            });

            grid.appendChild(button);
        }
    }

    render();

    return () => {};
}

document.addEventListener("DOMContentLoaded", initializeApp);
