(() => {
    "use strict";

    /* =========================================================
       MASTERMIND GAMES HUB
       Complete replacement app.js
       ========================================================= */

    const GAMES = [
        ["snake", "Snake", "Arcade", "🐍"],
        ["tictactoe", "Tic Tac Toe", "Board", "⭕"],
        ["2048", "2048", "Puzzle", "🔢"],
        ["memory", "Memory Match", "Puzzle", "🧠"],
        ["reaction", "Reaction Test", "Arcade", "⚡"],
        ["guess", "Guess Number", "Puzzle", "🎯"],
        ["pong", "Pong", "Arcade", "🏓"],
        ["breakout", "Breakout", "Arcade", "🧱"],
        ["minesweeper", "Minesweeper", "Puzzle", "💣"],
        ["connect4", "Connect Four", "Board", "🔴"],
        ["rps", "Rock Paper Scissors", "Classic", "✊"],
        ["simon", "Simon", "Memory", "🎵"],
        ["whack", "Whack-a-Mole", "Arcade", "🔨"],
        ["sliding", "Sliding Puzzle", "Puzzle", "🧩"],
        ["colormatch", "Color Match", "Puzzle", "🎨"],
        ["math", "Math Challenge", "Brain", "➗"],
        ["tap", "Tap Fast", "Arcade", "👆"],
        ["word", "Word Scramble", "Word", "🔤"],
        ["dodge", "Dodge", "Arcade", "🚀"],
        ["coin", "Coin Collector", "Arcade", "🪙"],
        ["target", "Target Shooter", "Arcade", "🎯"],
        ["lightsout", "Lights Out", "Puzzle", "💡"],
        ["higherlower", "Higher Lower", "Classic", "⬆️"],
        ["dice", "Dice Roller", "Classic", "🎲"],
        ["coinflip", "Coin Flip", "Classic", "🪙"],
        ["typing", "Typing Test", "Word", "⌨️"],
        ["hangman", "Hangman", "Word", "📝"],
        ["colorhunt", "Color Hunt", "Puzzle", "🌈"],
        ["quickmath", "Quick Math", "Brain", "⚡"],
        ["treasure", "Treasure Hunt", "Puzzle", "💎"]
    ];

    const $ = (selector, root = document) => root.querySelector(selector);

    const state = {
        currentGame: null,
        cleanup: () => {},
        category: "All",
        scoresKey: "mgh_scores",
        themeKey: "mgh_theme"
    };

    /* =========================================================
       HELPERS
       ========================================================= */

    function make(tag, attrs = {}, text = "") {
        const el = document.createElement(tag);

        Object.entries(attrs).forEach(([key, value]) => {
            if (key === "class") {
                el.className = value;
            } else if (key === "html") {
                el.innerHTML = value;
            } else if (key.startsWith("data-")) {
                el.setAttribute(key, value);
            } else {
                el[key] = value;
            }
        });

        if (text !== "") el.textContent = text;

        return el;
    }

    function button(text, handler, className = "game-action") {
        const btn = make("button", {
            type: "button",
            class: className
        }, text);

        btn.addEventListener("click", handler);
        return btn;
    }

    function randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(array) {
        const a = [...array];

        for (let i = a.length - 1; i > 0; i--) {
            const j = randomInt(i + 1);
            [a[i], a[j]] = [a[j], a[i]];
        }

        return a;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function getScores() {
        try {
            return JSON.parse(localStorage.getItem(state.scoresKey)) || {};
        } catch {
            return {};
        }
    }

    function saveScores(scores) {
        try {
            localStorage.setItem(state.scoresKey, JSON.stringify(scores));
        } catch {
            /* Storage may be disabled. Game still works. */
        }
    }

    function getHighScore(id) {
        return Number(getScores()[id] || 0);
    }

    function saveHighScore(id, score) {
        score = Number(score) || 0;

        if (score <= 0) return;

        const scores = getScores();

        if (score > Number(scores[id] || 0)) {
            scores[id] = score;
            saveScores(scores);
        }
    }

    function infoBar(items) {
        const bar = make("div", { class: "info-bar" });

        items.forEach(([label, value]) => {
            const item = make("div", { class: "info-item" });

            const small = make("span", {}, label);
            const strong = make("strong", {}, String(value));

            item.append(small, strong);
            bar.appendChild(item);
        });

        return bar;
    }

    function gameLayout(help = "") {
        const wrap = make("div", { class: "game-layout" });
        const board = make("div", { class: "game-board" });
        const side = make("div", { class: "game-help" });

        if (help) {
            side.innerHTML = `<strong>How to play</strong><p>${help}</p>`;
        }

        wrap.append(board, side);

        return {
            wrap,
            board,
            side
        };
    }

    function message(container, title, text, restartHandler) {
        const overlay = make("div", { class: "game-overlay" });
        const box = make("div", { class: "game-message" });

        box.append(
            make("h3", {}, title),
            make("p", {}, text),
            button("Play Again", restartHandler)
        );

        overlay.appendChild(box);
        container.appendChild(overlay);

        return overlay;
    }

    function showHighScore(id, element) {
        if (element) {
            element.textContent = `Best: ${getHighScore(id)}`;
        }
    }

    function enableSwipe(element, callback) {
        let startX = 0;
        let startY = 0;

        function start(e) {
            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
        }

        function end(e) {
            const point = e.changedTouches ? e.changedTouches[0] : e;

            const dx = point.clientX - startX;
            const dy = point.clientY - startY;

            if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;

            if (Math.abs(dx) > Math.abs(dy)) {
                callback(dx > 0 ? "right" : "left");
            } else {
                callback(dy > 0 ? "down" : "up");
            }
        }

        element.addEventListener("touchstart", start, { passive: true });
        element.addEventListener("touchend", end, { passive: true });

        return () => {
            element.removeEventListener("touchstart", start);
            element.removeEventListener("touchend", end);
        };
    }

    function finishGame(id, score, title, text, container, restart) {
        saveHighScore(id, score);

        message(
            container,
            title,
            `${text}${getHighScore(id) > 0 ? ` Best score: ${getHighScore(id)}.` : ""}`,
            restart
        );
    }

    /* =========================================================
       THEME
       ========================================================= */

    function updateThemeButton() {
        const btn = $("#themeToggle");
        if (!btn) return;

        const dark = document.body.classList.contains("dark-mode");

        btn.textContent = dark ? "☀️" : "🌙";
        btn.setAttribute(
            "aria-label",
            dark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    function setupTheme() {
        let saved = null;

        try {
            saved = localStorage.getItem(state.themeKey);
        } catch {
            saved = null;
        }

        if (saved === "dark") {
            document.body.classList.add("dark-mode");
        }

        const btn = $("#themeToggle");

        if (!btn) return;

        btn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            try {
                localStorage.setItem(
                    state.themeKey,
                    document.body.classList.contains("dark-mode")
                        ? "dark"
                        : "light"
                );
            } catch {
                /* Ignore storage error */
            }

            updateThemeButton();
        });

        updateThemeButton();
    }

    /* =========================================================
       HOME / SEARCH / CATEGORIES
       ========================================================= */

    function setupCategories() {
        const area = $(".category-area");
        if (!area) return;

        const categories = [
            "All",
            "Arcade",
            "Puzzle",
            "Board",
            "Classic",
            "Memory",
            "Brain",
            "Word"
        ];

        area.innerHTML = "";

        categories.forEach(category => {
            const btn = make(
                "button",
                {
                    type: "button",
                    class: "category-button"
                },
                category
            );

            if (category === "All") {
                btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
                state.category = category;

                area.querySelectorAll(".category-button").forEach(item => {
                    item.classList.toggle(
                        "active",
                        item === btn
                    );
                });

                renderGames($("#searchInput")?.value || "");
            });

            area.appendChild(btn);
        });
    }

    function renderGames(query = "") {
        const grid = $("#gameGrid");
        if (!grid) return;

        grid.innerHTML = "";

        const q = query.trim().toLowerCase();

        const filtered = GAMES.filter(game => {
            const [id, name, category] = game;

            const categoryMatch =
                state.category === "All" ||
                category === state.category;

            const searchMatch =
                !q ||
                name.toLowerCase().includes(q) ||
                category.toLowerCase().includes(q) ||
                id.toLowerCase().includes(q);

            return categoryMatch && searchMatch;
        });

        if (!filtered.length) {
            const empty = make("div", {
                class: "empty-search"
            });

            empty.innerHTML = `
                <div style="font-size:3rem">🔎</div>
                <h3>No games found</h3>
                <p>Try another search or category.</p>
            `;

            grid.appendChild(empty);
            return;
        }

        filtered.forEach(([id, name, category, icon]) => {
            const card = make("button", {
                type: "button",
                class: "game-card"
            });

            card.innerHTML = `
                <div class="game-card-icon">${icon}</div>
                <div class="game-card-body">
                    <h3>${name}</h3>
                    <p>${category}</p>
                </div>
                <div class="game-card-arrow">→</div>
            `;

            card.addEventListener("click", () => openGame(id));

            grid.appendChild(card);
        });
    }

    function setupSearch() {
        const input = $("#searchInput");
        if (!input) return;

        input.addEventListener("input", () => {
            renderGames(input.value);
        });
    }

    function setupNavigation() {
        $("#backButton")?.addEventListener("click", closeGame);

        $("#restartButton")?.addEventListener("click", () => {
            if (state.currentGame) {
                openGame(state.currentGame);
            }
        });
    }

    function openGame(id) {
        const game = GAMES.find(item => item[0] === id);
        if (!game) return;

        state.cleanup?.();
        state.cleanup = () => {};
        state.currentGame = id;

        const [gameId, title, category, icon] = game;

        $("#currentGameIcon").textContent = icon;
        $("#currentGameTitle").textContent = title;
        $("#currentGameCategory").textContent = category;

        $("#homeScreen")?.classList.remove("active");
        $("#gameScreen")?.classList.add("active");

        const container = $("#gameContainer");
        container.innerHTML = "";

        const builder = BUILDERS[gameId];

        if (builder) {
            const cleanup = builder(container);

            if (typeof cleanup === "function") {
                state.cleanup = cleanup;
            }
        } else {
            container.innerHTML = `
                <div class="game-help">
                    <h3>Coming soon</h3>
                    <p>This game is not available yet.</p>
                </div>
            `;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function closeGame() {
        state.cleanup?.();
        state.cleanup = () => {};
        state.currentGame = null;

        $("#gameContainer").innerHTML = "";

        $("#gameScreen")?.classList.remove("active");
        $("#homeScreen")?.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    /* =========================================================
       1. SNAKE
       ========================================================= */

    function createSnake(container) {
        const wrap = gameLayout(
            "Use Arrow keys or WASD. On mobile, use the direction buttons or swipe."
        );

        const canvas = make("canvas", {
            id: "snakeCanvas",
            class: "game-canvas"
        });

        canvas.width = 360;
        canvas.height = 360;

        const ctx = canvas.getContext("2d");

        const scoreText = make("span");
        const bestText = make("span");

        wrap.board.append(
            infoBar([
                ["Score", "0"],
                ["Best", getHighScore("snake")]
            ]),
            canvas
        );

        const controls = make("div", {
            class: "direction-controls"
        });

        const dirs = [
            ["↑", "up"],
            ["←", "left"],
            ["↓", "down"],
            ["→", "right"]
        ];

        dirs.forEach(([symbol, direction]) => {
            const b = button(
                symbol,
                () => changeDirection(direction),
                "direction-button"
            );

            controls.appendChild(b);
        });

        wrap.board.appendChild(controls);
        container.appendChild(wrap.wrap);

        const size = 18;
        const cells = 20;

        let snake;
        let food;
        let direction;
        let nextDirection;
        let score;
        let timer;
        let running;

        function reset() {
            snake = [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 }
            ];

            food = createFood();
            direction = "right";
            nextDirection = "right";
            score = 0;
            running = true;

            wrap.board.querySelector(".info-bar").innerHTML = "";
            wrap.board.querySelector(".info-bar").append(
                infoBar([
                    ["Score", score],
                    ["Best", getHighScore("snake")]
                ]).children[0],
                infoBar([
                    ["Best", getHighScore("snake")]
                ]).children[0]
            );

            clearInterval(timer);
            timer = setInterval(step, 115);

            draw();
        }

        function createFood() {
            let p;

            do {
                p = {
                    x: randomInt(cells),
                    y: randomInt(cells)
                };
            } while (
                snake?.some(s => s.x === p.x && s.y === p.y)
            );

            return p;
        }

        function changeDirection(newDir) {
            const opposite = {
                up: "down",
                down: "up",
                left: "right",
                right: "left"
            };

            if (opposite[newDir] !== direction) {
                nextDirection = newDir;
            }
        }

        function step() {
            if (!running) return;

            direction = nextDirection;

            const head = {
                ...snake[0]
            };

            if (direction === "up") head.y--;
            if (direction === "down") head.y++;
            if (direction === "left") head.x--;
            if (direction === "right") head.x++;

            const hitWall =
                head.x < 0 ||
                head.x >= cells ||
                head.y < 0 ||
                head.y >= cells;

            const hitSelf = snake.some(
                s => s.x === head.x && s.y === head.y
            );

            if (hitWall || hitSelf) {
                running = false;
                clearInterval(timer);

                finishGame(
                    "snake",
                    score,
                    "Game Over",
                    `Your score is ${score}.`,
                    container,
                    reset
                );

                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                food = createFood();
            } else {
                snake.pop();
            }

            updateInfo();
            draw();
        }

        function updateInfo() {
            const bar = wrap.board.querySelector(".info-bar");
            if (!bar) return;

            const items = bar.querySelectorAll(".info-item");

            if (items[0]) {
                items[0].querySelector("strong").textContent = score;
            }

            if (items[1]) {
                items[1].querySelector("strong").textContent =
                    getHighScore("snake");
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle =
                document.body.classList.contains("dark-mode")
                    ? "#151827"
                    : "#f7f7fb";

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle =
                document.body.classList.contains("dark-mode")
                    ? "#282c40"
                    : "#e2e2ec";

            for (let i = 0; i <= cells; i++) {
                ctx.beginPath();
                ctx.moveTo(i * size, 0);
                ctx.lineTo(i * size, canvas.height);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, i * size);
                ctx.lineTo(canvas.width, i * size);
                ctx.stroke();
            }

            ctx.fillStyle = "#e74c3c";

            ctx.beginPath();
            ctx.arc(
                food.x * size + size / 2,
                food.y * size + size / 2,
                size * 0.35,
                0,
                Math.PI * 2
            );
            ctx.fill();

            snake.forEach((part, index) => {
                ctx.fillStyle =
                    index === 0 ? "#5b5cf0" : "#7475f5";

                ctx.fillRect(
                    part.x * size + 1,
                    part.y * size + 1,
                    size - 2,
                    size - 2
                );
            });
        }

        function keydown(e) {
            const map = {
                ArrowUp: "up",
                ArrowDown: "down",
                ArrowLeft: "left",
                ArrowRight: "right",
                w: "up",
                W: "up",
                s: "down",
                S: "down",
                a: "left",
                A: "left",
                d: "right",
                D: "right"
            };

            if (map[e.key]) {
                e.preventDefault();
                changeDirection(map[e.key]);
            }
        }

        document.addEventListener("keydown", keydown);

        const removeSwipe = enableSwipe(
            canvas,
            changeDirection
        );

        reset();

        return () => {
            clearInterval(timer);
            document.removeEventListener("keydown", keydown);
            removeSwipe();
        };
    }

    /* =========================================================
       2. TIC TAC TOE
       ========================================================= */

    function createTicTacToe(container) {
        const wrap = gameLayout(
            "You are X. Click an empty square. The computer plays O."
        );

        const board = make("div", {
            class: "ttt-board"
        });

        const status = make("p", {
            class: "game-status"
        }, "Your turn");

        wrap.board.append(status, board);
        container.appendChild(wrap.wrap);

        let cells;
        let gameOver = false;

        function start() {
            board.innerHTML = "";
            gameOver = false;
            status.textContent = "Your turn";

            cells = Array(9).fill("");

            for (let i = 0; i < 9; i++) {
                const cell = make("button", {
                    type: "button",
                    class: "ttt-cell"
                });

                cell.addEventListener("click", () => playerMove(i));

                board.appendChild(cell);
            }
        }

        function playerMove(index) {
            if (gameOver || cells[index]) return;

            cells[index] = "X";
            draw();

            const result = checkWinner(cells);

            if (result) {
                end(result);
                return;
            }

            status.textContent = "Computer thinking...";

            setTimeout(() => {
                if (gameOver) return;

                computerMove();
            }, 300);
        }

        function computerMove() {
            const empty = cells
                .map((v, i) => v ? -1 : i)
                .filter(i => i >= 0);

            if (!empty.length) {
                end("draw");
                return;
            }

            let move = findWinningMove("O");

            if (move < 0) {
                move = findWinningMove("X");
            }

            if (move < 0 && !cells[4]) {
                move = 4;
            }

            if (move < 0) {
                const corners = [0, 2, 6, 8]
                    .filter(i => !cells[i]);

                if (corners.length) {
                    move = corners[randomInt(corners.length)];
                }
            }

            if (move < 0) {
                move = empty[randomInt(empty.length)];
            }

            cells[move] = "O";
            draw();

            const result = checkWinner(cells);

            if (result) {
                end(result);
            } else {
                status.textContent = "Your turn";
            }
        }

        function findWinningMove(player) {
            for (const i of cells
                .map((v, i) => v ? -1 : i)
                .filter(i => i >= 0)) {

                cells[i] = player;

                const wins = checkWinner(cells) === player;

                cells[i] = "";

                if (wins) return i;
            }

            return -1;
        }

        function checkWinner(b) {
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

            for (const [a, b1, c] of wins) {
                if (
                    b[a] &&
                    b[a] === b[b1] &&
                    b[a] === b[c]
                ) {
                    return b[a];
                }
            }

            return b.every(Boolean) ? "draw" : null;
        }

        function draw() {
            [...board.children].forEach((cell, i) => {
                cell.textContent = cells[i];
                cell.disabled = Boolean(cells[i]) || gameOver;
            });
        }

        function end(result) {
            gameOver = true;

            if (result === "X") {
                finishGame(
                    "tictactoe",
                    1,
                    "You Win!",
                    "Nice move.",
                    container,
                    start
                );
            } else if (result === "O") {
                message(
                    container,
                    "Computer Wins",
                    "Try again and make a different strategy.",
                    start
                );
            } else {
                message(
                    container,
                    "Draw",
                    "Nobody won this round.",
                    start
                );
            }
        }

        start();

        return () => {};
    }

    /* =========================================================
       3. 2048
       ========================================================= */

    function create2048(container) {
        const wrap = gameLayout(
            "Use Arrow keys, WASD, or swipe. Combine equal tiles to reach 2048."
        );

        const board = make("div", {
            class: "board-2048"
        });

        const scoreBox = make("div", {
            class: "game-score"
        }, "Score: 0");

        wrap.board.append(scoreBox, board);
        container.appendChild(wrap.wrap);

        let grid;
        let score;
        let over;
        let removeSwipe;

        function start() {
            grid = Array.from({ length: 4 }, () =>
                Array(4).fill(0)
            );

            score = 0;
            over = false;

            board.innerHTML = "";

            addTile();
            addTile();

            draw();
        }

        function addTile() {
            const empty = [];

            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (!grid[r][c]) {
                        empty.push([r, c]);
                    }
                }
            }

            if (!empty.length) return;

            const [r, c] =
                empty[randomInt(empty.length)];

            grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }

        function slideLine(line) {
            const values = line.filter(Boolean);
            const result = [];
            let gained = 0;

            for (let i = 0; i < values.length; i++) {
                if (values[i] === values[i + 1]) {
                    const v = values[i] * 2;
                    result.push(v);
                    gained += v;
                    i++;
                } else {
                    result.push(values[i]);
                }
            }

            while (result.length < 4) {
                result.push(0);
            }

            return {
                result,
                gained
            };
        }

        function move(dir) {
            if (over) return;

            const before = JSON.stringify(grid);
            let gained = 0;

            if (dir === "left" || dir === "right") {
                for (let r = 0; r < 4; r++) {
                    let line = [...grid[r]];

                    if (dir === "right") {
                        line.reverse();
                    }

                    const moved = slideLine(line);
                    gained += moved.gained;

                    let result = moved.result;

                    if (dir === "right") {
                        result.reverse();
                    }

                    grid[r] = result;
                }
            } else {
                for (let c = 0; c < 4; c++) {
                    let line = [];

                    for (let r = 0; r < 4; r++) {
                        line.push(grid[r][c]);
                    }

                    if (dir === "down") {
                        line.reverse();
                    }

                    const moved = slideLine(line);
                    gained += moved.gained;

                    let result = moved.result;

                    if (dir === "down") {
                        result.reverse();
                    }

                    for (let r = 0; r < 4; r++) {
                        grid[r][c] = result[r];
                    }
                }
            }

            if (JSON.stringify(grid) !== before) {
                score += gained;
                addTile();
                draw();

                if (grid.flat().includes(2048)) {
                    over = true;

                    finishGame(
                        "2048",
                        score,
                        "2048 Reached!",
                        `You reached 2048 with ${score} points.`,
                        container,
                        start
                    );

                    return;
                }
            }

            if (!canMove()) {
                over = true;

                finishGame(
                    "2048",
                    score,
                    "Game Over",
                    `No more moves. Final score: ${score}.`,
                    container,
                    start
                );
            }
        }

        function canMove() {
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (!grid[r][c]) return true;

                    if (
                        c < 3 &&
                        grid[r][c] === grid[r][c + 1]
                    ) return true;

                    if (
                        r < 3 &&
                        grid[r][c] === grid[r + 1][c]
                    ) return true;
                }
            }

            return false;
        }

        function draw() {
            board.innerHTML = "";

            grid.flat().forEach(value => {
                const tile = make("div", {
                    class: "tile-2048"
                }, value ? String(value) : "");

                if (value) {
                    tile.dataset.value = value;
                }

                board.appendChild(tile);
            });

            scoreBox.textContent = `Score: ${score}`;
        }

        function keydown(e) {
            const map = {
                ArrowLeft: "left",
                ArrowRight: "right",
                ArrowUp: "up",
                ArrowDown: "down",
                a: "left",
                A: "left",
                d: "right",
                D: "right",
                w: "up",
                W: "up",
                s: "down",
                S: "down"
            };

            if (map[e.key]) {
                e.preventDefault();
                move(map[e.key]);
            }
        }

        document.addEventListener("keydown", keydown);

        removeSwipe = enableSwipe(board, move);

        start();

        return () => {
            document.removeEventListener("keydown", keydown);
            removeSwipe();
        };
    }

    /* =========================================================
       4. MEMORY
       ========================================================= */

    function createMemory(container) {
        const wrap = gameLayout(
            "Click two cards to find matching pairs."
        );

        const board = make("div", {
            class: "memory-board"
        });

        const status = make("p", {
            class: "game-status"
        }, "Find all pairs.");

        wrap.board.append(status, board);
        container.appendChild(wrap.wrap);

        let cards;
        let first = null;
        let locked = false;
        let pairs = 0;
        let moves = 0;

        const symbols = [
            "🍎", "🚀", "🐱", "🌟",
            "⚽", "🎵", "🍕", "🦄"
        ];

        function start() {
            const values = shuffle([
                ...symbols,
                ...symbols
            ]);

            board.innerHTML = "";

            first = null;
            locked = false;
            pairs = 0;
            moves = 0;

            cards = [];

            values.forEach((value, index) => {
                const card = make("button", {
                    type: "button",
                    class: "memory-card"
                });

                card.dataset.value = value;
                card.innerHTML = `<span>?</span>`;

                card.addEventListener("click", () =>
                    flip(card)
                );

                board.appendChild(card);
                cards.push(card);
            });

            status.textContent = "Find all 8 pairs.";
        }

        function flip(card) {
            if (
                locked ||
                card.classList.contains("matched") ||
                card === first
            ) return;

            card.classList.add("flipped");
            card.innerHTML =
                `<span>${card.dataset.value}</span>`;

            if (!first) {
                first = card;
                return;
            }

            moves++;
            locked = true;

            if (first.dataset.value === card.dataset.value) {
                first.classList.add("matched");
                card.classList.add("matched");

                pairs++;
                first = null;
                locked = false;

                status.textContent =
                    `Pairs: ${pairs}/8 • Moves: ${moves}`;

                if (pairs === 8) {
                    finishGame(
                        "memory",
                        Math.max(1, 1000 - moves * 10),
                        "You Won!",
                        `All pairs found in ${moves} moves.`,
                        container,
                        start
                    );
                }
            } else {
                const previous = first;
                first = null;

                setTimeout(() => {
                    previous.classList.remove("flipped");
                    card.classList.remove("flipped");

                    previous.innerHTML = "<span>?</span>";
                    card.innerHTML = "<span>?</span>";

                    locked = false;

                    status.textContent =
                        `Pairs: ${pairs}/8 • Moves: ${moves}`;
                }, 650);
            }
        }

        start();

        return () => {};
    }

    /* =========================================================
       5. REACTION TEST
       ========================================================= */

    function createReaction(container) {
        const wrap = gameLayout(
            "Wait until the box turns green, then click as quickly as possible."
        );

        const area = make("div", {
            class: "target-area"
        });

        const btn = make("button", {
            type: "button",
            class: "target-button"
        }, "START");

        area.appendChild(btn);
        wrap.board.appendChild(area);

        const status = make("p", {
            class: "game-status"
        }, "Click START.");

        wrap.board.appendChild(status);
        container.appendChild(wrap.wrap);

        let state = "idle";
        let timeout;
        let startedAt;

        function reset() {
            clearTimeout(timeout);

            state = "idle";
            btn.textContent = "START";
            btn.disabled = false;
            status.textContent = "Click START.";
        }

        btn.addEventListener("click", () => {
            if (state === "idle") {
                state = "waiting";
                btn.textContent = "WAIT...";
                status.textContent = "Wait for green...";

                timeout = setTimeout(() => {
                    state = "ready";
                    startedAt = performance.now();

                    btn.textContent = "CLICK!";
                    btn.dataset.ready = "true";
                    status.textContent = "GO!";
                }, randomBetween(1500, 4000));

                return;
            }

            if (state === "waiting") {
                clearTimeout(timeout);

                state = "idle";
                btn.textContent = "TOO SOON";
                status.textContent =
                    "Too soon! Click START to try again.";

                setTimeout(reset, 900);
                return;
            }

            if (state === "ready") {
                const reaction =
                    Math.round(performance.now() - startedAt);

                state = "idle";
                btn.dataset.ready = "false";
                btn.textContent = `${reaction} ms`;
                status.textContent =
                    `${reaction} ms reaction time.`;

                setTimeout(reset, 1200);
            }
        });

        reset();

        return () => clearTimeout(timeout);
    }

    /* =========================================================
       6. GUESS NUMBER
       ========================================================= */

    function createGuess(container) {
        const wrap = gameLayout(
            "Guess the hidden number from 1 to 100. You have 7 attempts."
        );

        const input = make("input", {
            type: "number",
            min: "1",
            max: "100",
            placeholder: "Enter 1-100"
        });

        const submit = button("Guess", check);
        const restart = button("New Game", start);

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(
            status,
            input,
            submit,
            restart
        );

        container.appendChild(wrap.wrap);

        let secret;
        let attempts;

        function start() {
            secret = randomBetween(1, 100);
            attempts = 0;
            input.value = "";
            input.disabled = false;
            submit.disabled = false;
            status.textContent = "Guess a number from 1 to 100.";
        }

        function check() {
            const value = Number(input.value);

            if (
                !Number.isInteger(value) ||
                value < 1 ||
                value > 100
            ) {
                status.textContent =
                    "Enter a whole number between 1 and 100.";
                return;
            }

            attempts++;

            if (value === secret) {
                input.disabled = true;
                submit.disabled = true;

                finishGame(
                    "guess",
                    Math.max(1, 100 - attempts * 10),
                    "Correct!",
                    `You found the number in ${attempts} attempts.`,
                    container,
                    start
                );

                return;
            }

            if (attempts >= 7) {
                input.disabled = true;
                submit.disabled = true;

                message(
                    container,
                    "Out of Attempts",
                    `The number was ${secret}.`,
                    start
                );

                return;
            }

            status.textContent =
                value < secret
                    ? "Too low!"
                    : "Too high!";
        }

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") check();
        });

        start();

        return () => {};
    }

    /* =========================================================
       7. PONG
       ========================================================= */

    function createPong(container) {
        const wrap = gameLayout(
            "Move your paddle with W/S or Arrow Up/Down. Score 5 points to win."
        );

        const canvas = make("canvas", {
            class: "game-canvas"
        });

        canvas.width = 640;
        canvas.height = 360;

        wrap.board.appendChild(canvas);
        container.appendChild(wrap.wrap);

        const ctx = canvas.getContext("2d");

        let playerY;
        let aiY;
        let ball;
        let playerScore;
        let aiScore;
        let animation;
        let running;
        const keys = {};

        function start() {
            playerY = 135;
            aiY = 135;

            ball = {
                x: 320,
                y: 180,
                vx: Math.random() > 0.5 ? 4 : -4,
                vy: randomBetween(-3, 3) || 2
            };

            playerScore = 0;
            aiScore = 0;
            running = true;

            cancelAnimationFrame(animation);
            loop();
        }

        function resetBall(direction) {
            ball = {
                x: 320,
                y: 180,
                vx: direction * 4,
                vy: randomBetween(-3, 3) || 2
            };
        }

        function update() {
            if (!running) return;

            if (keys.ArrowUp || keys.w || keys.W) {
                playerY -= 6;
            }

            if (keys.ArrowDown || keys.s || keys.S) {
                playerY += 6;
            }

            playerY = clamp(playerY, 0, 280);

            aiY +=
                (ball.y - (aiY + 40)) * 0.06;

            aiY = clamp(aiY, 0, 280);

            ball.x += ball.vx;
            ball.y += ball.vy;

            if (ball.y <= 8 || ball.y >= 352) {
                ball.vy *= -1;
            }

            if (
                ball.x < 42 &&
                ball.x > 28 &&
                ball.y > playerY &&
                ball.y < playerY + 80 &&
                ball.vx < 0
            ) {
                ball.vx = Math.abs(ball.vx) * 1.03;
                ball.vy +=
                    (ball.y - (playerY + 40)) * 0.05;
            }

            if (
                ball.x > 598 &&
                ball.x < 612 &&
                ball.y > aiY &&
                ball.y < aiY + 80 &&
                ball.vx > 0
            ) {
                ball.vx = -Math.abs(ball.vx) * 1.03;
                ball.vy +=
                    (ball.y - (aiY + 40)) * 0.05;
            }

            if (ball.x < -20) {
                aiScore++;
                resetBall(1);
            }

            if (ball.x > 660) {
                playerScore++;
                resetBall(-1);
            }

            if (playerScore >= 5 || aiScore >= 5) {
                running = false;

                const playerWon = playerScore > aiScore;

                if (playerWon) {
                    finishGame(
                        "pong",
                        playerScore,
                        "You Win!",
                        `Final score ${playerScore}-${aiScore}.`,
                        container,
                        start
                    );
                } else {
                    message(
                        container,
                        "Game Over",
                        `Final score ${playerScore}-${aiScore}.`,
                        start
                    );
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, 640, 360);

            ctx.fillStyle = "#10111a";
            ctx.fillRect(0, 0, 640, 360);

            ctx.strokeStyle = "#555";
            ctx.setLineDash([8, 10]);

            ctx.beginPath();
            ctx.moveTo(320, 0);
            ctx.lineTo(320, 360);
            ctx.stroke();

            ctx.setLineDash([]);

            ctx.fillStyle = "#fff";
            ctx.fillRect(20, playerY, 12, 80);
            ctx.fillRect(608, aiY, 12, 80);

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = "32px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(
                `${playerScore}   ${aiScore}`,
                320,
                45
            );
        }

        function loop() {
            update();
            draw();

            if (running) {
                animation = requestAnimationFrame(loop);
            }
        }

        function keydown(e) {
            keys[e.key] = true;
        }

        function keyup(e) {
            keys[e.key] = false;
        }

        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup);

        start();

        return () => {
            running = false;
            cancelAnimationFrame(animation);
            document.removeEventListener("keydown", keydown);
            document.removeEventListener("keyup", keyup);
        };
    }

    /* =========================================================
       8. BREAKOUT
       ========================================================= */

    function createBreakout(container) {
        const wrap = gameLayout(
            "Move the paddle with Arrow keys, A/D, or your mouse. Break all blocks."
        );

        const canvas = make("canvas", {
            class: "game-canvas"
        });

        canvas.width = 640;
        canvas.height = 420;

        wrap.board.appendChild(canvas);
        container.appendChild(wrap.wrap);

        const ctx = canvas.getContext("2d");

        let paddleX;
        let ball;
        let bricks;
        let score;
        let lives;
        let animation;
        let running;
        const keys = {};

        function start() {
            paddleX = 270;

            ball = {
                x: 320,
                y: 350,
                vx: 4,
                vy: -4
            };

            bricks = [];

            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 10; c++) {
                    bricks.push({
                        x: 35 + c * 58,
                        y: 45 + r * 28,
                        w: 50,
                        h: 18,
                        alive: true
                    });
                }
            }

            score = 0;
            lives = 3;
            running = true;

            cancelAnimationFrame(animation);
            loop();
        }

        function update() {
            if (!running) return;

            if (keys.ArrowLeft || keys.a || keys.A) {
                paddleX -= 7;
            }

            if (keys.ArrowRight || keys.d || keys.D) {
                paddleX += 7;
            }

            paddleX = clamp(paddleX, 0, 540);

            ball.x += ball.vx;
            ball.y += ball.vy;

            if (ball.x < 8 || ball.x > 632) {
                ball.vx *= -1;
            }

            if (ball.y < 8) {
                ball.vy *= -1;
            }

            if (
                ball.y > 385 &&
                ball.y < 410 &&
                ball.x > paddleX &&
                ball.x < paddleX + 100 &&
                ball.vy > 0
            ) {
                ball.vy = -Math.abs(ball.vy);

                ball.vx +=
                    (ball.x - (paddleX + 50)) * 0.04;
            }

            bricks.forEach(brick => {
                if (!brick.alive) return;

                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brick.w &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brick.h &&
                    ball.vy < 0
                ) {
                    brick.alive = false;
                    ball.vy *= -1;
                    score += 10;
                }
            });

            if (bricks.every(b => !b.alive)) {
                running = false;

                finishGame(
                    "breakout",
                    score,
                    "You Win!",
                    `All blocks cleared. Score: ${score}.`,
                    container,
                    start
                );

                return;
            }

            if (ball.y > 440) {
                lives--;

                if (lives <= 0) {
                    running = false;

                    finishGame(
                        "breakout",
                        score,
                        "Game Over",
                        `Final score: ${score}.`,
                        container,
                        start
                    );

                    return;
                }

                ball = {
                    x: 320,
                    y: 350,
                    vx: 4 * (Math.random() > 0.5 ? 1 : -1),
                    vy: -4
                };
            }
        }

        function draw() {
            ctx.clearRect(0, 0, 640, 420);

            ctx.fillStyle = "#111522";
            ctx.fillRect(0, 0, 640, 420);

            bricks.forEach(brick => {
                if (!brick.alive) return;

                ctx.fillStyle = "#6c63ff";
                ctx.fillRect(
                    brick.x,
                    brick.y,
                    brick.w,
                    brick.h
                );
            });

            ctx.fillStyle = "#fff";
            ctx.fillRect(paddleX, 395, 100, 12);

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = "18px sans-serif";
            ctx.fillText(
                `Score: ${score}   Lives: ${lives}`,
                15,
                25
            );
        }

        function loop() {
            update();
            draw();

            if (running) {
                animation = requestAnimationFrame(loop);
            }
        }

        function keydown(e) {
            keys[e.key] = true;
        }

        function keyup(e) {
            keys[e.key] = false;
        }

        function mousemove(e) {
            const rect = canvas.getBoundingClientRect();
            const x =
                (e.clientX - rect.left) *
                (canvas.width / rect.width);

            paddleX = clamp(x - 50, 0, 540);
        }

        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup);
        canvas.addEventListener("mousemove", mousemove);

        start();

        return () => {
            running = false;
            cancelAnimationFrame(animation);

            document.removeEventListener("keydown", keydown);
            document.removeEventListener("keyup", keyup);
            canvas.removeEventListener("mousemove", mousemove);
        };
    }

    /* =========================================================
       9. MINESWEEPER
       ========================================================= */

    function createMinesweeper(container) {
        const wrap = gameLayout(
            "Reveal every safe cell. Avoid the hidden mines."
        );

        const board = make("div", {
            class: "mine-board"
        });

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(status, board);
        container.appendChild(wrap.wrap);

        const size = 8;
        const mineCount = 10;

        let cells;
        let gameOver;

        function start() {
            cells = Array.from({ length: size * size }, () => ({
                mine: false,
                open: false,
                count: 0
            }));

            gameOver = false;

            const indexes = shuffle(
                Array.from({ length: size * size }, (_, i) => i)
            );

            indexes.slice(0, mineCount).forEach(i => {
                cells[i].mine = true;
            });

            cells.forEach((cell, i) => {
                if (cell.mine) return;

                const r = Math.floor(i / size);
                const c = i % size;

                let count = 0;

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (!dr && !dc) continue;

                        const nr = r + dr;
                        const nc = c + dc;

                        if (
                            nr >= 0 &&
                            nr < size &&
                            nc >= 0 &&
                            nc < size
                        ) {
                            const ni = nr * size + nc;

                            if (cells[ni].mine) count++;
                        }
                    }
                }

                cell.count = count;
            });

            draw();
            status.textContent = "Find all safe cells.";
        }

        function draw() {
            board.innerHTML = "";

            cells.forEach((cell, i) => {
                const btn = make("button", {
                    type: "button",
                    class: "mine-cell"
                });

                if (cell.open) {
                    btn.classList.add("open");

                    btn.textContent =
                        cell.mine
                            ? "💣"
                            : cell.count
                                ? cell.count
                                : "";
                }

                btn.addEventListener("click", () =>
                    reveal(i)
                );

                board.appendChild(btn);
            });
        }

        function reveal(index) {
            if (gameOver || cells[index].open) return;

            const cell = cells[index];

            if (cell.mine) {
                cell.open = true;
                gameOver = true;

                cells.forEach(c => {
                    if (c.mine) c.open = true;
                });

                draw();

                message(
                    container,
                    "Boom!",
                    "You found a mine.",
                    start
                );

                return;
            }

            flood(index);
            draw();

            const safe =
                cells.filter(c => !c.mine).length;

            const opened =
                cells.filter(c => c.open && !c.mine).length;

            status.textContent =
                `Safe cells: ${opened}/${safe}`;

            if (opened === safe) {
                gameOver = true;

                finishGame(
                    "minesweeper",
                    100,
                    "You Win!",
                    "Every safe cell is open.",
                    container,
                    start
                );
            }
        }

        function flood(index) {
            const queue = [index];
            const visited = new Set();

            while (queue.length) {
                const current = queue.shift();

                if (visited.has(current)) continue;
                visited.add(current);

                const cell = cells[current];

                if (cell.mine || cell.open) continue;

                cell.open = true;

                if (cell.count !== 0) continue;

                const r = Math.floor(current / size);
                const c = current % size;

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;

                        if (
                            nr >= 0 &&
                            nr < size &&
                            nc >= 0 &&
                            nc < size
                        ) {
                            queue.push(nr * size + nc);
                        }
                    }
                }
            }
        }

        start();

        return () => {};
    }

    /* =========================================================
       10. CONNECT FOUR
       ========================================================= */

    function createConnect4(container) {
        const wrap = gameLayout(
            "You are red. Drop pieces into a column and connect four."
        );

        const board = make("div", {
            class: "connect4-board"
        });

        const status = make("p", {
            class: "game-status"
        }, "Your turn.");

        wrap.board.append(status, board);
        container.appendChild(wrap.wrap);

        const rows = 6;
        const cols = 7;

        let grid;
        let gameOver;

        function start() {
            grid = Array.from({ length: rows }, () =>
                Array(cols).fill(0)
            );

            gameOver = false;
            status.textContent = "Your turn.";
            draw();
        }

        function draw() {
            board.innerHTML = "";

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cell = make("button", {
                        type: "button",
                        class: "connect-cell"
                    });

                    if (grid[r][c] === 1) {
                        cell.classList.add("red");
                    }

                    if (grid[r][c] === 2) {
                        cell.classList.add("yellow");
                    }

                    cell.addEventListener("click", () =>
                        playColumn(c)
                    );

                    board.appendChild(cell);
                }
            }
        }

        function playColumn(col) {
            if (gameOver) return;

            const row = findRow(col);

            if (row < 0) return;

            grid[row][col] = 1;
            draw();

            if (winner(1)) {
                gameOver = true;

                finishGame(
                    "connect4",
                    100,
                    "You Win!",
                    "Four connected pieces!",
                    container,
                    start
                );

                return;
            }

            if (full()) {
                gameOver = true;

                message(
                    container,
                    "Draw",
                    "The board is full.",
                    start
                );

                return;
            }

            status.textContent = "Computer turn...";

            setTimeout(() => {
                if (gameOver) return;

                computerMove();
            }, 350);
        }

        function computerMove() {
            let col = findWinningColumn(2);

            if (col < 0) {
                col = findWinningColumn(1);
            }

            if (col < 0) {
                const possible = [];

                for (let c = 0; c < cols; c++) {
                    if (findRow(c) >= 0) {
                        possible.push(c);
                    }
                }

                col =
                    possible[randomInt(possible.length)];
            }

            const row = findRow(col);

            if (row >= 0) {
                grid[row][col] = 2;
            }

            draw();

            if (winner(2)) {
                gameOver = true;

                message(
                    container,
                    "Computer Wins",
                    "Try another round.",
                    start
                );

                return;
            }

            if (full()) {
                gameOver = true;

                message(
                    container,
                    "Draw",
                    "The board is full.",
                    start
                );

                return;
            }

            status.textContent = "Your turn.";
        }

        function findWinningColumn(player) {
            for (let c = 0; c < cols; c++) {
                const r = findRow(c);

                if (r < 0) continue;

                grid[r][c] = player;

                const wins = winner(player);

                grid[r][c] = 0;

                if (wins) return c;
            }

            return -1;
        }

        function findRow(col) {
            for (let r = rows - 1; r >= 0; r--) {
                if (!grid[r][col]) return r;
            }

            return -1;
        }

        function winner(player) {
            const directions = [
                [0, 1],
                [1, 0],
                [1, 1],
                [1, -1]
            ];

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (grid[r][c] !== player) continue;

                    for (const [dr, dc] of directions) {
                        let count = 1;

                        for (let k = 1; k < 4; k++) {
                            const nr = r + dr * k;
                            const nc = c + dc * k;

                            if (
                                nr < 0 ||
                                nr >= rows ||
                                nc < 0 ||
                                nc >= cols ||
                                grid[nr][nc] !== player
                            ) {
                                break;
                            }

                            count++;
                        }

                        if (count >= 4) return true;
                    }
                }
            }

            return false;
        }

        function full() {
            return grid[0].every(Boolean);
        }

        start();

        return () => {};
    }

    /* =========================================================
       11. ROCK PAPER SCISSORS
       ========================================================= */

    function createRps(container) {
        const wrap = gameLayout(
            "Choose rock, paper, or scissors."
        );

        const result = make("p", {
            class: "game-status"
        }, "Make your choice.");

        const area = make("div", {
            class: "game-options"
        });

        const choices = [
            ["✊ Rock", "rock"],
            ["✋ Paper", "paper"],
            ["✌️ Scissors", "scissors"]
        ];

        choices.forEach(([label, value]) => {
            area.appendChild(
                button(label, () => play(value))
            );
        });

        wrap.board.append(result, area);
        container.appendChild(wrap.wrap);

        function play(player) {
            const options = [
                "rock",
                "paper",
                "scissors"
            ];

            const computer =
                options[randomInt(3)];

            if (player === computer) {
                result.textContent =
                    `Computer chose ${computer}. Draw!`;
                return;
            }

            const wins =
                (player === "rock" && computer === "scissors") ||
                (player === "paper" && computer === "rock") ||
                (player === "scissors" && computer === "paper");

            result.textContent = wins
                ? `Computer chose ${computer}. You win!`
                : `Computer chose ${computer}. Computer wins.`;
        }

        return () => {};
    }

    /* =========================================================
       12. SIMON
       ========================================================= */

    function createSimon(container) {
        const wrap = gameLayout(
            "Watch the sequence and repeat it by clicking the same colors."
        );

        const board = make("div", {
            class: "simon-board"
        });

        const status = make("p", {
            class: "game-status"
        }, "Press Start.");

        const startButton = button(
            "Start",
            start
        );

        const colors = [
            ["green", "🟢"],
            ["red", "🔴"],
            ["yellow", "🟡"],
            ["blue", "🔵"]
        ];

        colors.forEach(([color, icon], index) => {
            const btn = make("button", {
                type: "button",
                class: "simon-button",
                "data-color": color
            }, icon);

            btn.addEventListener("click", () =>
                playerInput(index)
            );

            board.appendChild(btn);
        });

        wrap.board.append(
            status,
            board,
            startButton
        );

        container.appendChild(wrap.wrap);

        let sequence = [];
        let playerIndex = 0;
        let accepting = false;
        let timer;

        function start() {
            clearTimeout(timer);

            sequence = [];
            playerIndex = 0;
            accepting = false;

            nextRound();
        }

        function nextRound() {
            sequence.push(randomInt(4));
            playerIndex = 0;
            accepting = false;

            status.textContent =
                `Round ${sequence.length}`;

            playSequence();
        }

        function playSequence() {
            let i = 0;

            function playNext() {
                if (i >= sequence.length) {
                    accepting = true;
                    status.textContent = "Your turn!";
                    return;
                }

                flash(sequence[i]);

                i++;

                timer = setTimeout(
                    playNext,
                    650
                );
            }

            playNext();
        }

        function flash(index) {
            const btn =
                board.children[index];

            btn.classList.add("active");

            setTimeout(() => {
                btn.classList.remove("active");
            }, 300);
        }

        function playerInput(index) {
            if (!accepting) return;

            flash(index);

            if (index !== sequence[playerIndex]) {
                accepting = false;

                const score =
                    Math.max(1, sequence.length - 1);

                finishGame(
                    "simon",
                    score,
                    "Game Over",
                    `You completed ${score} rounds.`,
                    container,
                    start
                );

                return;
            }

            playerIndex++;

            if (playerIndex === sequence.length) {
                accepting = false;
                status.textContent = "Correct!";

                setTimeout(nextRound, 500);
            }
        }

        return () => clearTimeout(timer);
    }

    /* =========================================================
       13. WHACK A MOLE
       ========================================================= */

    function createWhack(container) {
        const wrap = gameLayout(
            "Click the mole whenever it appears. You have 30 seconds."
        );

        const board = make("div", {
            class: "whack-board"
        });

        const status = make("p", {
            class: "game-status"
        });

        const startButton = button(
            "Start",
            start
        );

        wrap.board.append(
            status,
            board,
            startButton
        );

        container.appendChild(wrap.wrap);

        let mole = -1;
        let score = 0;
        let time = 30;
        let timer;
        let mover;

        function start() {
            clearInterval(timer);
            clearInterval(mover);

            score = 0;
            time = 30;
            mole = -1;

            board.innerHTML = "";

            for (let i = 0; i < 9; i++) {
                const cell = make("button", {
                    type: "button",
                    class: "whack-cell"
                }, "🕳️");

                cell.addEventListener("click", () => {
                    if (i === mole) {
                        score++;
                        mole = -1;
                        draw();
                    }
                });

                board.appendChild(cell);
            }

            draw();

            timer = setInterval(() => {
                time--;

                status.textContent =
                    `Score: ${score} • Time: ${time}s`;

                if (time <= 0) {
                    clearInterval(timer);
                    clearInterval(mover);

                    finishGame(
                        "whack",
                        score,
                        "Time Up!",
                        `You whacked ${score} moles.`,
                        container,
                        start
                    );
                }
            }, 1000);

            mover = setInterval(() => {
                mole = randomInt(9);
                draw();
            }, 650);
        }

        function draw() {
            [...board.children].forEach((cell, i) => {
                cell.textContent =
                    i === mole ? "🐹" : "🕳️";
            });

            status.textContent =
                `Score: ${score} • Time: ${time}s`;
        }

        status.textContent =
            "Press Start to begin.";

        return () => {
            clearInterval(timer);
            clearInterval(mover);
        };
    }

    /* =========================================================
       14. SLIDING PUZZLE
       ========================================================= */

    function createSliding(container) {
        const wrap = gameLayout(
            "Move tiles into numerical order. Click a tile next to the empty space."
        );

        const board = make("div", {
            class: "sliding-board"
        });

        const status = make("p", {
            class: "game-status"
        });

        const restart = button(
            "Shuffle",
            start
        );

        wrap.board.append(
            status,
            board,
            restart
        );

        container.appendChild(wrap.wrap);

        let tiles;
        let moves;

        function start() {
            tiles = [
                1, 2, 3, 4,
                5, 6, 7, 8,
                0
            ];

            for (let i = 0; i < 100; i++) {
                const empty =
                    tiles.indexOf(0);

                const neighbors =
                    getNeighbors(empty);

                const move =
                    neighbors[randomInt(neighbors.length)];

                [tiles[empty], tiles[move]] =
                    [tiles[move], tiles[empty]];
            }

            moves = 0;
            draw();
        }

        function getNeighbors(index) {
            const r = Math.floor(index / 3);
            const c = index % 3;
            const list = [];

            if (r > 0) list.push(index - 3);
            if (r < 2) list.push(index + 3);
            if (c > 0) list.push(index - 1);
            if (c < 2) list.push(index + 1);

            return list;
        }

        function draw() {
            board.innerHTML = "";

            tiles.forEach((value, index) => {
                const cell = make("button", {
                    type: "button",
                    class: "slide-cell"
                }, value ? String(value) : "");

                cell.addEventListener("click", () =>
                    move(index)
                );

                board.appendChild(cell);
            });

            status.textContent =
                `Moves: ${moves}`;
        }

        function move(index) {
            const empty = tiles.indexOf(0);

            if (!getNeighbors(empty).includes(index)) {
                return;
            }

            [tiles[index], tiles[empty]] =
                [tiles[empty], tiles[index]];

            moves++;
            draw();

            if (
                tiles.join(",") ===
                "1,2,3,4,5,6,7,8,0"
            ) {
                finishGame(
                    "sliding",
                    Math.max(1, 500 - moves),
                    "Solved!",
                    `Solved in ${moves} moves.`,
                    container,
                    start
                );
            }
        }

        start();

        return () => {};
    }

    /* =========================================================
       15. COLOR MATCH
       ========================================================= */

    function createColorMatch(container) {
        const wrap = gameLayout(
            "Click the button whose text matches the displayed target color."
        );

        const target = make("h2", {
            class: "game-status"
        });

        const options = make("div", {
            class: "game-options"
        });

        wrap.board.append(target, options);
        container.appendChild(wrap.wrap);

        const colors = [
            "Red",
            "Blue",
            "Green",
            "Yellow",
            "Purple",
            "Orange"
        ];

        let score = 0;
        let round = 0;

        function start() {
            score = 0;
            round = 0;
            next();
        }

        function next() {
            round++;

            if (round > 10) {
                finishGame(
                    "colormatch",
                    score,
                    "Finished!",
                    `You scored ${score}/10.`,
                    container,
                    start
                );

                return;
            }

            const correct =
                colors[randomInt(colors.length)];

            target.textContent =
                `Choose: ${correct}`;

            options.innerHTML = "";

            shuffle(colors).forEach(color => {
                options.appendChild(
                    button(color, () => {
                        if (color === correct) {
                            score++;
                        }

                        next();
                    })
                );
            });
        }

        start();

        return () => {};
    }

    /* =========================================================
       16. MATH CHALLENGE
       ========================================================= */

    function createMath(container) {
        const wrap = gameLayout(
            "Solve 10 quick arithmetic questions."
        );

        const question = make("h2");
        const input = make("input", {
            type: "number",
            placeholder: "Answer"
        });

        const submit = button(
            "Submit",
            check
        );

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(
            question,
            input,
            submit,
            status
        );

        container.appendChild(wrap.wrap);

        let answer;
        let score;
        let round;

        function start() {
            score = 0;
            round = 0;
            next();
        }

        function next() {
            round++;

            if (round > 10) {
                finishGame(
                    "math",
                    score,
                    "Finished!",
                    `You got ${score}/10 correct.`,
                    container,
                    start
                );

                return;
            }

            const a = randomBetween(2, 20);
            const b = randomBetween(2, 20);
            const op =
                ["+", "-", "×"][randomInt(3)];

            if (op === "+") {
                answer = a + b;
            } else if (op === "-") {
                answer = a - b;
            } else {
                answer = a * b;
            }

            question.textContent =
                `${a} ${op} ${b} = ?`;

            input.value = "";
            input.focus();

            status.textContent =
                `Question ${round}/10`;
        }

        function check() {
            if (Number(input.value) === answer) {
                score++;
                status.textContent = "Correct!";
            } else {
                status.textContent =
                    `Wrong. Answer: ${answer}`;
            }

            setTimeout(next, 450);
        }

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") check();
        });

        start();

        return () => {};
    }

    /* =========================================================
       17. TAP FAST
       ========================================================= */

    function createTap(container) {
        const wrap = gameLayout(
            "Tap the button as many times as possible in 10 seconds."
        );

        const scoreText = make("h2", {}, "0");
        const btn = make("button", {
            type: "button",
            class: "target-button"
        }, "START");

        const status = make("p", {
            class: "game-status"
        }, "Press START.");

        wrap.board.append(
            scoreText,
            btn,
            status
        );

        container.appendChild(wrap.wrap);

        let score = 0;
        let time = 10;
        let running = false;
        let timer;

        btn.addEventListener("click", () => {
            if (!running) {
                start();
                return;
            }

            score++;
            scoreText.textContent = score;
        });

        function start() {
            clearInterval(timer);

            score = 0;
            time = 10;
            running = true;

            scoreText.textContent = "0";
            btn.textContent = "TAP!";
            status.textContent = "10 seconds!";

            timer = setInterval(() => {
                time--;

                status.textContent =
                    `${time} seconds left`;

                if (time <= 0) {
                    running = false;
                    clearInterval(timer);

                    btn.textContent = "START";

                    finishGame(
                        "tap",
                        score,
                        "Time Up!",
                        `You tapped ${score} times.`,
                        container,
                        start
                    );
                }
            }, 1000);
        }

        return () => clearInterval(timer);
    }

    /* =========================================================
       18. WORD SCRAMBLE
       ========================================================= */

    function createWord(container) {
        const wrap = gameLayout(
            "Unscramble the letters to find the hidden word."
        );

        const wordDisplay = make("h2");
        const input = make("input", {
            type: "text",
            placeholder: "Your answer",
            autocomplete: "off"
        });

        const submit = button(
            "Check",
            check
        );

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(
            wordDisplay,
            input,
            submit,
            status
        );

        container.appendChild(wrap.wrap);

        const words = [
            "planet",
            "garden",
            "orange",
            "rocket",
            "puzzle",
            "school",
            "dragon",
            "button",
            "banana",
            "window"
        ];

        let answer;
        let round;
        let score;

        function start() {
            round = 0;
            score = 0;
            next();
        }

        function next() {
            round++;

            if (round > 10) {
                finishGame(
                    "word",
                    score,
                    "Finished!",
                    `You solved ${score}/10 words.`,
                    container,
                    start
                );

                return;
            }

            answer =
                words[randomInt(words.length)];

            let scrambled = shuffle(
                answer.split("")
            ).join("");

            while (
                scrambled === answer &&
                answer.length > 1
            ) {
                scrambled = shuffle(
                    answer.split("")
                ).join("");
            }

            wordDisplay.textContent = scrambled;
            input.value = "";
            status.textContent =
                `Word ${round}/10`;
            input.focus();
        }

        function check() {
            const value =
                input.value.trim().toLowerCase();

            if (value === answer) {
                score++;
                status.textContent = "Correct!";
            } else {
                status.textContent =
                    `Answer: ${answer}`;
            }

            setTimeout(next, 550);
        }

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") check();
        });

        start();

        return () => {};
    }

    /* =========================================================
       19. DODGE
       ========================================================= */

    function createDodge(container) {
        const wrap = gameLayout(
            "Move left and right to avoid falling blocks."
        );

        const canvas = make("canvas", {
            class: "game-canvas"
        });

        canvas.width = 420;
        canvas.height = 500;

        wrap.board.appendChild(canvas);
        container.appendChild(wrap.wrap);

        const ctx = canvas.getContext("2d");

        let player;
        let obstacles;
        let score;
        let animation;
        let running;
        let spawnTimer;
        const keys = {};

        function start() {
            player = {
                x: 190,
                y: 450,
                w: 40,
                h: 25,
                speed: 6
            };

            obstacles = [];
            score = 0;
            running = true;

            clearInterval(spawnTimer);
            cancelAnimationFrame(animation);

            spawnTimer = setInterval(() => {
                obstacles.push({
                    x: randomBetween(0, 390),
                    y: -25,
                    w: 30,
                    h: 25,
                    speed: randomBetween(3, 6)
                });
            }, 500);

            loop();
        }

        function update() {
            if (!running) return;

            if (keys.ArrowLeft || keys.a || keys.A) {
                player.x -= player.speed;
            }

            if (keys.ArrowRight || keys.d || keys.D) {
                player.x += player.speed;
            }

            player.x = clamp(
                player.x,
                0,
                canvas.width - player.w
            );

            obstacles.forEach(o => {
                o.y += o.speed;
            });

            obstacles = obstacles.filter(
                o => o.y < canvas.height + 30
            );

            for (const o of obstacles) {
                if (
                    player.x < o.x + o.w &&
                    player.x + player.w > o.x &&
                    player.y < o.y + o.h &&
                    player.y + player.h > o.y
                ) {
                    running = false;
                    clearInterval(spawnTimer);

                    finishGame(
                        "dodge",
                        score,
                        "Game Over",
                        `You survived with ${score} points.`,
                        container,
                        start
                    );

                    return;
                }
            }

            score++;
        }

        function draw() {
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.fillStyle = "#111522";
            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.fillStyle = "#5b5cf0";
            ctx.fillRect(
                player.x,
                player.y,
                player.w,
                player.h
            );

            ctx.fillStyle = "#e74c3c";

            obstacles.forEach(o => {
                ctx.fillRect(
                    o.x,
                    o.y,
                    o.w,
                    o.h
                );
            });

            ctx.fillStyle = "#fff";
            ctx.font = "18px sans-serif";
            ctx.fillText(
                `Score: ${score}`,
                15,
                25
            );
        }

        function loop() {
            update();
            draw();

            if (running) {
                animation =
                    requestAnimationFrame(loop);
            }
        }

        function keydown(e) {
            keys[e.key] = true;
        }

        function keyup(e) {
            keys[e.key] = false;
        }

        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup);

        start();

        return () => {
            running = false;
            clearInterval(spawnTimer);
            cancelAnimationFrame(animation);

            document.removeEventListener(
                "keydown",
                keydown
            );

            document.removeEventListener(
                "keyup",
                keyup
            );
        };
    }

    /* =========================================================
       20. COIN COLLECTOR
       ========================================================= */

    function createCoin(container) {
        const wrap = gameLayout(
            "Click coins before they disappear. Get as many as possible in 20 seconds."
        );

        const area = make("div", {
            class: "target-area"
        });

        const coin = make("button", {
            type: "button",
            class: "target-button"
        }, "🪙");

        area.appendChild(coin);

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(area, status);
        container.appendChild(wrap.wrap);

        let score = 0;
        let time = 20;
        let timer;
        let moveTimer;
        let running;

        function start() {
            clearInterval(timer);
            clearInterval(moveTimer);

            score = 0;
            time = 20;
            running = true;

            moveCoin();

            timer = setInterval(() => {
                time--;

                status.textContent =
                    `Coins: ${score} • Time: ${time}s`;

                if (time <= 0) {
                    running = false;

                    clearInterval(timer);
                    clearInterval(moveTimer);

                    finishGame(
                        "coin",
                        score,
                        "Time Up!",
                        `You collected ${score} coins.`,
                        container,
                        start
                    );
                }
            }, 1000);

            moveTimer = setInterval(
                moveCoin,
                700
            );
        }

        function moveCoin() {
            if (!running) return;

            coin.style.position = "absolute";
            coin.style.left =
                `${randomBetween(5, 80)}%`;
            coin.style.top =
                `${randomBetween(10, 80)}%`;
        }

        coin.addEventListener("click", () => {
            if (!running) return;

            score++;
            moveCoin();

            status.textContent =
                `Coins: ${score} • Time: ${time}s`;
        });

        start();

        return () => {
            clearInterval(timer);
            clearInterval(moveTimer);
        };
    }

    /* =========================================================
       21. TARGET
       ========================================================= */

    function createTarget(container) {
        const wrap = gameLayout(
            "Click the moving target as many times as possible in 20 seconds."
        );

        const area = make("div", {
            class: "target-area"
        });

        const target = make("button", {
            type: "button",
            class: "target-button"
        }, "🎯");

        area.appendChild(target);

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(area, status);
        container.appendChild(wrap.wrap);

        let score = 0;
        let time = 20;
        let running;
        let timer;

        function start() {
            clearInterval(timer);

            score = 0;
            time = 20;
            running = true;

            place();

            timer = setInterval(() => {
                time--;

                status.textContent =
                    `Hits: ${score} • Time: ${time}s`;

                if (time <= 0) {
                    running = false;
                    clearInterval(timer);

                    finishGame(
                        "target",
                        score,
                        "Finished!",
                        `You hit the target ${score} times.`,
                        container,
                        start
                    );
                }
            }, 1000);
        }

        function place() {
            target.style.position = "absolute";
            target.style.left =
                `${randomBetween(5, 80)}%`;
            target.style.top =
                `${randomBetween(5, 80)}%`;
        }

        target.addEventListener("click", () => {
            if (!running) return;

            score++;
            place();

            status.textContent =
                `Hits: ${score} • Time: ${time}s`;
        });

        start();

        return () => clearInterval(timer);
    }

    /* =========================================================
       22. LIGHTS OUT
       ========================================================= */

    function createLightsOut(container) {
        const wrap = gameLayout(
            "Turn every light off. Clicking a cell also toggles its neighbors."
        );

        const board = make("div", {
            class: "lights-board"
        });

        const status = make("p", {
            class: "game-status"
        });

        const restart = button(
            "New Puzzle",
            start
        );

        wrap.board.append(
            status,
            board,
            restart
        );

        container.appendChild(wrap.wrap);

        let lights;
        let moves;

        function start() {
            lights = Array(25)
                .fill(false)
                .map(() => Math.random() > 0.55);

            moves = 0;

            if (!lights.some(Boolean)) {
                lights[randomInt(25)] = true;
            }

            draw();
        }

        function draw() {
            board.innerHTML = "";

            lights.forEach((on, index) => {
                const cell = make("button", {
                    type: "button",
                    class: "light-cell"
                });

                if (on) {
                    cell.classList.add("on");
                    cell.textContent = "💡";
                }

                cell.addEventListener("click", () =>
                    toggle(index)
                );

                board.appendChild(cell);
            });

            status.textContent =
                `Moves: ${moves}`;
        }

        function toggle(index) {
            const r = Math.floor(index / 5);
            const c = index % 5;

            const positions = [
                [r, c],
                [r - 1, c],
                [r + 1, c],
                [r, c - 1],
                [r, c + 1]
            ];

            positions.forEach(([nr, nc]) => {
                if (
                    nr >= 0 &&
                    nr < 5 &&
                    nc >= 0 &&
                    nc < 5
                ) {
                    lights[nr * 5 + nc] =
                        !lights[nr * 5 + nc];
                }
            });

            moves++;
            draw();

            if (!lights.some(Boolean)) {
                finishGame(
                    "lightsout",
                    Math.max(1, 100 - moves),
                    "Solved!",
                    `Solved in ${moves} moves.`,
                    container,
                    start
                );
            }
        }

        start();

        return () => {};
    }

    /* =========================================================
       23. HIGHER LOWER
       ========================================================= */

    function createHigherLower(container) {
        const wrap = gameLayout(
            "Guess whether the next number will be higher or lower."
        );

        const number = make("h2");
        const status = make("p", {
            class: "game-status"
        });

        const options = make("div", {
            class: "game-options"
        });

        const high = button(
            "⬆ Higher",
            () => guess("higher")
        );

        const low = button(
            "⬇ Lower",
            () => guess("lower")
        );

        options.append(high, low);

        wrap.board.append(
            number,
            status,
            options
        );

        container.appendChild(wrap.wrap);

        let current;
        let score;

        function start() {
            current = randomBetween(1, 99);
            score = 0;

            draw();
        }

        function draw() {
            number.textContent = current;
            status.textContent =
                `Score: ${score}`;
        }

        function guess(direction) {
            const next =
                randomBetween(1, 100);

            const correct =
                direction === "higher"
                    ? next > current
                    : next < current;

            if (!correct || next === current) {
                finishGame(
                    "higherlower",
                    score,
                    "Game Over",
                    `The next number was ${next}.`,
                    container,
                    start
                );

                return;
            }

            score++;
            current = next;
            draw();
        }

        start();

        return () => {};
    }

    /* =========================================================
       24. DICE
       ========================================================= */

    function createDice(container) {
        const wrap = gameLayout(
            "Roll the dice. Try to beat your previous best."
        );

        const display = make("div", {
            class: "dice-display"
        }, "🎲");

        const result = make("p", {
            class: "game-status"
        }, "Roll the dice.");

        const roll = button(
            "Roll Dice",
            doRoll
        );

        wrap.board.append(
            display,
            result,
            roll
        );

        container.appendChild(wrap.wrap);

        let total = 0;

        function doRoll() {
            const value = randomBetween(1, 6);

            display.textContent =
                ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][value - 1];

            total += value;

            result.textContent =
                `You rolled ${value}. Total: ${total}`;
        }

        return () => {};
    }

    /* =========================================================
       25. COIN FLIP
       ========================================================= */

    function createCoinFlip(container) {
        const wrap = gameLayout(
            "Choose heads or tails and flip the coin."
        );

        const display = make("div", {
            class: "dice-display"
        }, "🪙");

        const result = make("p", {
            class: "game-status"
        }, "Choose a side.");

        const options = make("div", {
            class: "game-options"
        });

        options.append(
            button("Heads", () => flip("Heads")),
            button("Tails", () => flip("Tails"))
        );

        wrap.board.append(
            display,
            result,
            options
        );

        container.appendChild(wrap.wrap);

        function flip(choice) {
            const outcome =
                Math.random() < 0.5
                    ? "Heads"
                    : "Tails";

            display.textContent =
                outcome === "Heads"
                    ? "🪙 H"
                    : "🪙 T";

            result.textContent =
                `It was ${outcome}. ${
                    choice === outcome
                        ? "You guessed correctly!"
                        : "Try again."
                }`;
        }

        return () => {};
    }

    /* =========================================================
       26. TYPING TEST
       ========================================================= */

    function createTyping(container) {
        const wrap = gameLayout(
            "Type the displayed sentence as accurately and quickly as possible."
        );

        const text = make("p", {
            class: "typing-text"
        });

        const input = make("input", {
            type: "text",
            placeholder: "Start typing...",
            autocomplete: "off",
            spellcheck: "false"
        });

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(
            text,
            input,
            status
        );

        container.appendChild(wrap.wrap);

        const sentences = [
            "Games are a great way to practice focus.",
            "Small steps can lead to big improvements.",
            "Keep calm and enjoy the challenge.",
            "Practice makes progress every day.",
            "Welcome to the mastermind games hub."
        ];

        let target;
        let startTime;
        let started;

        function start() {
            target =
                sentences[randomInt(sentences.length)];

            text.textContent = target;
            input.value = "";
            status.textContent =
                "Type the sentence above.";
            started = false;
            input.focus();
        }

        input.addEventListener("input", () => {
            if (!started) {
                started = true;
                startTime = performance.now();
            }

            const value = input.value;

            if (target.startsWith(value)) {
                status.textContent =
                    `${value.length}/${target.length} characters`;
            } else {
                status.textContent =
                    "Check your typing.";
            }

            if (value === target) {
                const seconds =
                    (performance.now() - startTime) / 1000;

                const wpm =
                    Math.max(
                        1,
                        Math.round(
                            (target.length / 5) /
                            (seconds / 60)
                        )
                    );

                input.disabled = true;

                finishGame(
                    "typing",
                    wpm,
                    "Completed!",
                    `Your speed was about ${wpm} WPM.`,
                    container,
                    () => {
                        input.disabled = false;
                        start();
                    }
                );
            }
        });

        start();

        return () => {};
    }

    /* =========================================================
       27. HANGMAN
       ========================================================= */

    function createHangman(container) {
        const wrap = gameLayout(
            "Guess the hidden word one letter at a time."
        );

        const word = make("h2");
        const input = make("input", {
            type: "text",
            maxlength: "1",
            placeholder: "A-Z",
            autocomplete: "off"
        });

        const guess = button(
            "Guess",
            makeGuess
        );

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(
            word,
            input,
            guess,
            status
        );

        container.appendChild(wrap.wrap);

        const words = [
            "javascript",
            "computer",
            "keyboard",
            "puzzle",
            "monster",
            "rainbow",
            "football",
            "galaxy"
        ];

        let answer;
        let guessed;
        let mistakes;

        function start() {
            answer =
                words[randomInt(words.length)];

            guessed = new Set();
            mistakes = 0;

            input.value = "";
            input.disabled = false;
            guess.disabled = false;

            draw();
        }

        function draw() {
            word.textContent =
                answer
                    .split("")
                    .map(ch =>
                        guessed.has(ch) ? ch : "_"
                    )
                    .join(" ");

            status.textContent =
                `Mistakes: ${mistakes}/6`;
        }

        function makeGuess() {
            const letter =
                input.value.trim().toLowerCase();

            input.value = "";

            if (!/^[a-z]$/.test(letter)) return;

            if (guessed.has(letter)) return;

            guessed.add(letter);

            if (!answer.includes(letter)) {
                mistakes++;
            }

            draw();

            const won =
                answer
                    .split("")
                    .every(ch => guessed.has(ch));

            if (won) {
                input.disabled = true;
                guess.disabled = true;

                finishGame(
                    "hangman",
                    Math.max(1, 100 - mistakes * 10),
                    "You Win!",
                    `The word was "${answer}".`,
                    container,
                    start
                );

                return;
            }

            if (mistakes >= 6) {
                input.disabled = true;
                guess.disabled = true;

                message(
                    container,
                    "Game Over",
                    `The word was "${answer}".`,
                    start
                );
            }
        }

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                makeGuess();
            }
        });

        start();

        return () => {};
    }

    /* =========================================================
       28. COLOR HUNT
       ========================================================= */

    function createColorHunt(container) {
        const wrap = gameLayout(
            "Click the color name that matches the displayed color."
        );

        const title = make("h2", {}, "Find the matching color");
        const target = make("div", {
            class: "target-area"
        });

        const options = make("div", {
            class: "game-options"
        });

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(
            title,
            target,
            options,
            status
        );

        container.appendChild(wrap.wrap);

        const colors = [
            ["Red", "#e74c3c"],
            ["Blue", "#3498db"],
            ["Green", "#2ecc71"],
            ["Yellow", "#f1c40f"],
            ["Purple", "#9b59b6"],
            ["Orange", "#e67e22"]
        ];

        let correct;
        let score;
        let round;

        function start() {
            score = 0;
            round = 0;
            next();
        }

        function next() {
            round++;

            if (round > 10) {
                finishGame(
                    "colorhunt",
                    score,
                    "Finished!",
                    `You matched ${score}/10.`,
                    container,
                    start
                );

                return;
            }

            correct =
                colors[randomInt(colors.length)];

            target.style.background =
                correct[1];

            options.innerHTML = "";

            shuffle(colors).forEach(([name]) => {
                options.appendChild(
                    button(name, () => {
                        if (name === correct[0]) {
                            score++;
                        }

                        next();
                    })
                );
            });

            status.textContent =
                `Round ${round}/10 • Score ${score}`;
        }

        start();

        return () => {};
    }

    /* =========================================================
       29. QUICK MATH
       ========================================================= */

    function createQuickMath(container) {
        const wrap = gameLayout(
            "Solve as many simple math questions as possible in 30 seconds."
        );

        const question = make("h2");
        const input = make("input", {
            type: "number",
            placeholder: "Answer"
        });

        const submit = button(
            "Answer",
            check
        );

        const status = make("p", {
            class: "game-status"
        });

        wrap.board.append(
            question,
            input,
            submit,
            status
        );

        container.appendChild(wrap.wrap);

        let answer;
        let score;
        let time;
        let timer;
        let running;

        function start() {
            clearInterval(timer);

            score = 0;
            time = 30;
            running = true;

            input.disabled = false;
            submit.disabled = false;

            next();

            timer = setInterval(() => {
                time--;

                status.textContent =
                    `Score: ${score} • Time: ${time}s`;

                if (time <= 0) {
                    running = false;
                    clearInterval(timer);

                    input.disabled = true;
                    submit.disabled = true;

                    finishGame(
                        "quickmath",
                        score,
                        "Time Up!",
                        `You solved ${score} questions.`,
                        container,
                        start
                    );
                }
            }, 1000);
        }

        function next() {
            const a = randomBetween(1, 20);
            const b = randomBetween(1, 20);

            const operation =
                ["+", "-", "×"][randomInt(3)];

            if (operation === "+") {
                answer = a + b;
            } else if (operation === "-") {
                answer = a - b;
            } else {
                answer = a * b;
            }

            question.textContent =
                `${a} ${operation} ${b} = ?`;

            input.value = "";
            input.focus();

            status.textContent =
                `Score: ${score} • Time: ${time}s`;
        }

        function check() {
            if (!running) return;

            if (Number(input.value) === answer) {
                score++;
            }

            next();
        }

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") check();
        });

        start();

        return () => clearInterval(timer);
    }

    /* =========================================================
       30. TREASURE HUNT
       ========================================================= */

    function createTreasure(container) {
        const wrap = gameLayout(
            "Find the hidden treasure by opening cells. Avoid traps."
        );

        const board = make("div", {
            class: "mine-board"
        });

        const status = make("p", {
            class: "game-status"
        }, "Find the treasure!");

        wrap.board.append(
            status,
            board
        );

        container.appendChild(wrap.wrap);

        const total = 25;
        let treasure;
        let traps;
        let opened;
        let gameOver;

        function start() {
            treasure = randomInt(total);

            traps = new Set();

            while (traps.size < 5) {
                const n = randomInt(total);

                if (n !== treasure) {
                    traps.add(n);
                }
            }

            opened = new Set();
            gameOver = false;

            draw();
        }

        function draw() {
            board.innerHTML = "";

            for (let i = 0; i < total; i++) {
                const cell = make("button", {
                    type: "button",
                    class: "mine-cell"
                });

                if (opened.has(i)) {
                    cell.classList.add("open");

                    if (i === treasure) {
                        cell.textContent = "💎";
                    } else if (traps.has(i)) {
                        cell.textContent = "💥";
                    } else {
                        cell.textContent = "·";
                    }
                }

                cell.addEventListener("click", () =>
                    open(i)
                );

                board.appendChild(cell);
            }

            status.textContent =
                `Opened: ${opened.size}/${total}`;
        }

        function open(index) {
            if (
                gameOver ||
                opened.has(index)
            ) return;

            opened.add(index);

            if (index === treasure) {
                gameOver = true;
                draw();

                finishGame(
                    "treasure",
                    Math.max(1, 100 - opened.size * 2),
                    "Treasure Found!",
                    `You found the treasure in ${opened.size} moves.`,
                    container,
                    start
                );

                return;
            }

            if (traps.has(index)) {
                gameOver = true;
                draw();

                message(
                    container,
                    "Trap!",
                    "You opened a trap.",
                    start
                );

                return;
            }

            draw();
        }

        start();

        return () => {};
    }

    /* =========================================================
       GAME MAP
       ========================================================= */

    const BUILDERS = {
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
        rps: createRps,
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

    /* =========================================================
       START APP
       ========================================================= */

    function initializeApp() {
        setupTheme();
        setupCategories();
        setupSearch();
        setupNavigation();
        renderGames();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeApp
        );
    } else {
        initializeApp();
    }

})();
