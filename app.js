const games = [
    {
        id: "snake",
        title: "Snake",
        category: "Arcade",
        icon: "🐍",
        description: "Eat food and grow longer."
    },
    {
        id: "tictactoe",
        title: "Tic-Tac-Toe",
        category: "Board",
        icon: "⭕",
        description: "Beat the computer."
    },
    {
        id: "2048",
        title: "2048",
        category: "Puzzle",
        icon: "🔢",
        description: "Combine tiles to reach 2048."
    },
    {
        id: "memory",
        title: "Memory Match",
        category: "Puzzle",
        icon: "🧠",
        description: "Match all pairs."
    },
    {
        id: "reaction",
        title: "Reaction Test",
        category: "Skill",
        icon: "⚡",
        description: "Test your reaction speed."
    },
    {
        id: "numberguess",
        title: "Number Guess",
        category: "Puzzle",
        icon: "🎯",
        description: "Guess the secret number."
    },
    {
        id: "pong",
        title: "Pong",
        category: "Arcade",
        icon: "🏓",
        description: "Keep the ball away."
    },
    {
        id: "breakout",
        title: "Breakout",
        category: "Arcade",
        icon: "🧱",
        description: "Break every brick."
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        category: "Puzzle",
        icon: "💣",
        description: "Find the safe cells."
    },
    {
        id: "connect4",
        title: "Connect Four",
        category: "Board",
        icon: "🔴",
        description: "Connect four in a row."
    },
    {
        id: "rps",
        title: "Rock Paper Scissors",
        category: "Casual",
        icon: "✊",
        description: "Choose your move."
    },
    {
        id: "simon",
        title: "Simon Says",
        category: "Skill",
        icon: "🎨",
        description: "Remember the sequence."
    },
    {
        id: "whack",
        title: "Whack-a-Mole",
        category: "Arcade",
        icon: "🔨",
        description: "Hit the mole quickly."
    },
    {
        id: "sliding",
        title: "Sliding Puzzle",
        category: "Puzzle",
        icon: "🧩",
        description: "Put the numbers in order."
    },
    {
        id: "colormatch",
        title: "Color Match",
        category: "Skill",
        icon: "🌈",
        description: "Match the target color."
    },
    {
        id: "mathsprint",
        title: "Math Sprint",
        category: "Brain",
        icon: "➗",
        description: "Solve as many as you can."
    },
    {
        id: "tap",
        title: "Tap Counter",
        category: "Casual",
        icon: "👆",
        description: "Tap as fast as possible."
    },
    {
        id: "wordguess",
        title: "Word Guess",
        category: "Word",
        icon: "🔤",
        description: "Guess the hidden word."
    },
    {
        id: "dodge",
        title: "Dodge Blocks",
        category: "Arcade",
        icon: "🚀",
        description: "Avoid falling blocks."
    },
    {
        id: "coin",
        title: "Coin Catcher",
        category: "Arcade",
        icon: "🪙",
        description: "Catch the falling coins."
    }
];

const gameGrid = document.getElementById("gameGrid");
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const gameContainer = document.getElementById("gameContainer");

const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");

const currentGameTitle = document.getElementById("currentGameTitle");
const currentGameCategory = document.getElementById("currentGameCategory");
const currentGameIcon = document.getElementById("currentGameIcon");

let currentGame = null;
let cleanupGame = () => {};
let activeCategory = "All";

let scores = {};

try {
    scores = JSON.parse(
        localStorage.getItem("mgh_scores") || "{}"
    );
} catch {
    scores = {};
}


function saveScores() {
    localStorage.setItem(
        "mgh_scores",
        JSON.stringify(scores)
    );
}


function getHighScore(id) {
    return Number(scores[id] || 0);
}


function setHighScore(id, value) {
    value = Number(value) || 0;

    if (value > getHighScore(id)) {
        scores[id] = value;
        saveScores();
    }
}


function renderCategories() {
    const categoryArea =
        document.querySelector(".category-area");

    if (!categoryArea) {
        return;
    }

    const categories = [
        "All",
        ...new Set(games.map(game => game.category))
    ];

    categoryArea.innerHTML = categories
        .map(category => `
            <button
                type="button"
                class="category-button ${
                    category === activeCategory
                        ? "active"
                        : ""
                }"
                data-category="${category}"
            >
                ${category}
            </button>
        `)
        .join("");

    categoryArea
        .querySelectorAll(".category-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                activeCategory =
                    button.dataset.category;

                renderCategories();
                renderGames();

            });

        });
}


function renderGames() {
    const query =
        (searchInput?.value || "")
            .trim()
            .toLowerCase();

    const filteredGames = games.filter(game => {

        const categoryMatch =
            activeCategory === "All" ||
            game.category === activeCategory;

        const searchText = (
            game.title +
            " " +
            game.category +
            " " +
            game.description
        ).toLowerCase();

        return categoryMatch &&
            searchText.includes(query);
    });


    if (filteredGames.length === 0) {

        gameGrid.innerHTML = `
            <div class="no-results">
                No games found.
            </div>
        `;

        return;
    }


    gameGrid.innerHTML = filteredGames
        .map(game => `
            <article
                class="game-card"
                data-game="${game.id}"
            >

                <div class="game-card-top">

                    <div class="game-icon">
                        ${game.icon}
                    </div>

                    <span class="game-category">
                        ${game.category}
                    </span>

                </div>

                <h3>
                    ${game.title}
                </h3>

                <p>
                    ${game.description}
                </p>

                <button
                    class="play-button"
                    type="button"
                    data-play="${game.id}"
                >
                    Play ▶
                </button>

            </article>
        `)
        .join("");


    gameGrid
        .querySelectorAll("[data-play]")
        .forEach(button => {

            button.addEventListener("click", () => {

                openGame(button.dataset.play);

            });

        });
}


function openGame(id) {

    const game =
        games.find(item => item.id === id);

    if (!game) {
        return;
    }


    cleanupGame();

    cleanupGame = () => {};

    currentGame = game;


    homeScreen.classList.remove("active");
    gameScreen.classList.add("active");


    currentGameTitle.textContent =
        game.title;

    currentGameCategory.textContent =
        game.category;

    currentGameIcon.textContent =
        game.icon;


    gameContainer.innerHTML = "";


    const launcher =
        gameLaunchers[game.id];

    if (launcher) {
        cleanupGame = launcher() || (() => {});
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function goHome() {

    cleanupGame();

    cleanupGame = () => {};

    currentGame = null;


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

    openGame(currentGame.id);
}


function showMessage(
    title,
    text,
    icon = "🎉"
) {

    const oldOverlay =
        document.querySelector(".message-overlay");

    if (oldOverlay) {
        oldOverlay.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "message-overlay";


    overlay.innerHTML = `
        <div class="message-box">

            <div class="message-icon">
                ${icon}
            </div>

            <h2>
                ${title}
            </h2>

            <p>
                ${text}
            </p>

            <div class="message-actions">

                <button
                    class="primary-button"
                    type="button"
                    data-restart
                >
                    Play Again
                </button>

                <button
                    class="secondary-button"
                    type="button"
                    data-back
                >
                    Back
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(overlay);


    overlay
        .querySelector("[data-restart]")
        .addEventListener("click", () => {

            overlay.remove();
            restartCurrentGame();

        });


    overlay
        .querySelector("[data-back]")
        .addEventListener("click", () => {

            overlay.remove();
            goHome();

        });
}


function applyTheme() {

    const dark =
        localStorage.getItem("mgh_theme") === "dark";

    document.body.classList.toggle(
        "dark-mode",
        dark
    );


    if (themeToggle) {

        themeToggle.textContent =
            dark ? "☀️" : "🌙";

    }
}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderGames
    );

}


if (backButton) {

    backButton.addEventListener(
        "click",
        goHome
    );

}


if (restartButton) {

    restartButton.addEventListener(
        "click",
        restartCurrentGame
    );

}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            const dark =
                document.body.classList.toggle(
                    "dark-mode"
                );

            localStorage.setItem(
                "mgh_theme",
                dark ? "dark" : "light"
            );

            themeToggle.textContent =
                dark ? "☀️" : "🌙";

        }
    );

}


/* =========================================================
   SNAKE
========================================================= */

function launchSnake() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Score</span>
            <strong class="score-value">0</strong>
        </div>

        <canvas
            class="game-canvas"
            id="snakeCanvas"
            width="360"
            height="360"
        ></canvas>

        <div class="direction-controls">

            <button data-direction="up">
                ▲
            </button>

            <div>
                <button data-direction="left">
                    ◀
                </button>

                <button data-direction="down">
                    ▼
                </button>

                <button data-direction="right">
                    ▶
                </button>
            </div>

        </div>
    `;


    const canvas =
        document.getElementById("snakeCanvas");

    const ctx =
        canvas.getContext("2d");

    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    const cellSize = 18;
    const cells = 20;


    let snake = [
        {
            x: 10,
            y: 10
        }
    ];


    let direction = {
        x: 1,
        y: 0
    };


    let nextDirection = {
        x: 1,
        y: 0
    };


    let food = {
        x: 5,
        y: 5
    };


    let score = 0;
    let timer = null;


    function placeFood() {

        do {

            food = {
                x: Math.floor(
                    Math.random() * cells
                ),
                y: Math.floor(
                    Math.random() * cells
                )
            };

        } while (
            snake.some(
                part =>
                    part.x === food.x &&
                    part.y === food.y
            )
        );

    }


    function draw() {

        ctx.fillStyle = "#10101a";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "#ff2bd6";

        ctx.fillRect(
            food.x * cellSize,
            food.y * cellSize,
            cellSize - 2,
            cellSize - 2
        );


        snake.forEach((part, index) => {

            ctx.fillStyle =
                index === 0
                    ? "#00f5ff"
                    : "#8b5cf6";


            ctx.fillRect(
                part.x * cellSize,
                part.y * cellSize,
                cellSize - 2,
                cellSize - 2
            );

        });

    }


    function changeDirection(newDirection) {

        if (
            newDirection.x === -direction.x &&
            newDirection.y === -direction.y
        ) {
            return;
        }

        nextDirection =
            newDirection;
    }


    function gameStep() {

        direction =
            nextDirection;


        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };


        const hitWall =
            head.x < 0 ||
            head.x >= cells ||
            head.y < 0 ||
            head.y >= cells;


        const hitBody =
            snake.some(
                part =>
                    part.x === head.x &&
                    part.y === head.y
            );


        if (hitWall || hitBody) {

            clearInterval(timer);

            setHighScore(
                "snake",
                score
            );

            showMessage(
                "Game Over",
                `Your score: ${score}`,
                "🐍"
            );

            return;
        }


        snake.unshift(head);


        if (
            head.x === food.x &&
            head.y === food.y
        ) {

            score++;

            scoreElement.textContent =
                score;

            placeFood();

        } else {

            snake.pop();

        }


        draw();

    }


    function keyboardHandler(event) {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            changeDirection({
                x: 0,
                y: -1
            });

        }


        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            changeDirection({
                x: 0,
                y: 1
            });

        }


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            changeDirection({
                x: -1,
                y: 0
            });

        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            changeDirection({
                x: 1,
                y: 0
            });

        }

    }


    document.addEventListener(
        "keydown",
        keyboardHandler
    );


    gameContainer
        .querySelectorAll(
            "[data-direction]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const directionMap = {

                        up: {
                            x: 0,
                            y: -1
                        },

                        down: {
                            x: 0,
                            y: 1
                        },

                        left: {
                            x: -1,
                            y: 0
                        },

                        right: {
                            x: 1,
                            y: 0
                        }

                    };


                    changeDirection(
                        directionMap[
                            button.dataset.direction
                        ]
                    );

                }
            );

        });


    placeFood();
    draw();


    timer =
        setInterval(
            gameStep,
            110
        );


    return () => {

        clearInterval(timer);

        document.removeEventListener(
            "keydown",
            keyboardHandler
        );

    };
}


/* =========================================================
   TIC TAC TOE
========================================================= */

function launchTicTacToe() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Status</span>
            <strong class="score-value">
                X
            </strong>
        </div>

        <div
            class="ttt-board"
            id="tttBoard"
        ></div>

        <p id="tttStatus">
            Your turn — X
        </p>
    `;


    const boardElement =
        document.getElementById("tttBoard");

    const statusElement =
        document.getElementById("tttStatus");


    let board =
        Array(9).fill("");


    function checkWinner(state) {

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


        for (const line of lines) {

            const [a, b, c] = line;


            if (
                state[a] &&
                state[a] === state[b] &&
                state[a] === state[c]
            ) {

                return state[a];

            }

        }


        if (
            state.every(
                value => value !== ""
            )
        ) {

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
                            class="ttt-cell"
                            data-index="${index}"
                        >
                            ${value}
                        </button>
                    `
                )
                .join("");


        boardElement
            .querySelectorAll("button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        playerMove(
                            Number(
                                button.dataset.index
                            )
                        );

                    }
                );

            });

    }


    function finish(result) {

        if (result === "draw") {

            statusElement.textContent =
                "Draw!";

        } else if (result === "X") {

            statusElement.textContent =
                "You win!";

            setHighScore(
                "tictactoe",
                1
            );

        } else {

            statusElement.textContent =
                "Computer wins!";

        }


        boardElement
            .querySelectorAll("button")
            .forEach(
                button =>
                    button.disabled = true
            );

    }


    function playerMove(index) {

        if (
            board[index] ||
            checkWinner(board)
        ) {
            return;
        }


        board[index] = "X";

        render();


        let result =
            checkWinner(board);


        if (result) {

            finish(result);
            return;

        }


        statusElement.textContent =
            "Computer thinking…";


        setTimeout(() => {

            const empty =
                board
                    .map(
                        (value, index) =>
                            value
                                ? null
                                : index
                    )
                    .filter(
                        index =>
                            index !== null
                    );


            if (!empty.length) {

                finish("draw");
                return;

            }


            const index =
                empty[
                    Math.floor(
                        Math.random() *
                        empty.length
                    )
                ];


            board[index] = "O";

            render();


            result =
                checkWinner(board);


            if (result) {

                finish(result);

            } else {

                statusElement.textContent =
                    "Your turn — X";

            }

        }, 350);

    }


    render();

    return () => {};

}


/* =========================================================
   2048
========================================================= */

function launch2048() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Score</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <div
            class="grid-2048"
            id="grid2048"
        ></div>

        <p>
            Use arrow keys or swipe.
        </p>
    `;


    const grid =
        document.getElementById("grid2048");

    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let board =
        Array(16).fill(0);

    let score = 0;


    function addTile() {

        const empty =
            board
                .map(
                    (value, index) =>
                        value
                            ? null
                            : index
                )
                .filter(
                    index =>
                        index !== null
                );


        if (!empty.length) {
            return;
        }


        const index =
            empty[
                Math.floor(
                    Math.random() *
                    empty.length
                )
            ];


        board[index] =
            Math.random() < 0.9
                ? 2
                : 4;

    }


    function render() {

        grid.innerHTML =
            board
                .map(
                    value => `
                        <div class="tile-2048">
                            ${value || ""}
                        </div>
                    `
                )
                .join("");


        scoreElement.textContent =
            score;

    }


    function move(direction) {

        const before =
            board.join(",");


        for (
            let line = 0;
            line < 4;
            line++
        ) {

            let indexes;


            if (direction === "left") {

                indexes =
                    [0, 1, 2, 3]
                        .map(
                            n =>
                                line * 4 + n
                        );

            } else if (
                direction === "right"
            ) {

                indexes =
                    [3, 2, 1, 0]
                        .map(
                            n =>
                                line * 4 + n
                        );

            } else if (
                direction === "up"
            ) {

                indexes =
                    [0, 1, 2, 3]
                        .map(
                            n =>
                                n * 4 + line
                        );

            } else {

                indexes =
                    [3, 2, 1, 0]
                        .map(
                            n =>
                                n * 4 + line
                        );

            }


            let values =
                indexes
                    .map(
                        index =>
                            board[index]
                    )
                    .filter(
                        value =>
                            value !== 0
                    );


            for (
                let i = 0;
                i < values.length - 1;
                i++
            ) {

                if (
                    values[i] ===
                    values[i + 1]
                ) {

                    values[i] *= 2;

                    score +=
                        values[i];

                    values.splice(
                        i + 1,
                        1
                    );

                }

            }


            while (
                values.length < 4
            ) {

                values.push(0);

            }


            indexes.forEach(
                (index, position) => {

                    board[index] =
                        values[position];

                }
            );

        }


        if (
            before !==
            board.join(",")
        ) {

            addTile();

        }


        render();

    }


    function keyboardHandler(event) {

        const map = {

            ArrowLeft: "left",
            ArrowRight: "right",
            ArrowUp: "up",
            ArrowDown: "down"

        };


        const direction =
            map[event.key];


        if (!direction) {
            return;
        }


        event.preventDefault();

        move(direction);

    }


    document.addEventListener(
        "keydown",
        keyboardHandler
    );


    addTile();
    addTile();

    render();


    return () => {

        document.removeEventListener(
            "keydown",
            keyboardHandler
        );

    };

}


/* =========================================================
   MEMORY MATCH
========================================================= */

function launchMemory() {

    const symbols = [
        "🍎",
        "🚀",
        "🎮",
        "🐱",
        "⚽",
        "🌟",
        "🍕",
        "🦊"
    ];


    const deck =
        [...symbols, ...symbols]
            .sort(
                () =>
                    Math.random() - 0.5
            );


    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Moves</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <div
            class="memory-grid"
            id="memoryGrid"
        ></div>
    `;


    const grid =
        document.getElementById(
            "memoryGrid"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let firstCard = null;
    let locked = false;
    let moves = 0;
    let matched = 0;


    grid.innerHTML =
        deck
            .map(
                (symbol, index) => `
                    <button
                        class="memory-card"
                        data-index="${index}"
                    >
                        ?
                    </button>
                `
            )
            .join("");


    const cards =
        [...grid.children];


    cards.forEach(
        (card, index) => {

            card.addEventListener(
                "click",
                () => {

                    if (
                        locked ||
                        card.classList.contains(
                            "matched"
                        ) ||
                        card === firstCard
                    ) {
                        return;
                    }


                    card.textContent =
                        deck[index];

                    card.classList.add(
                        "revealed"
                    );


                    if (!firstCard) {

                        firstCard = card;

                        return;

                    }


                    moves++;

                    scoreElement.textContent =
                        moves;


                    const firstIndex =
                        Number(
                            firstCard.dataset.index
                        );


                    if (
                        deck[index] ===
                        deck[firstIndex]
                    ) {

                        card.classList.add(
                            "matched"
                        );

                        firstCard.classList.add(
                            "matched"
                        );


                        matched += 2;

                        firstCard = null;


                        if (
                            matched ===
                            deck.length
                        ) {

                            setHighScore(
                                "memory",
                                Math.max(
                                    1,
                                    100 - moves
                                )
                            );


                            showMessage(
                                "You Won!",
                                `Completed in ${moves} moves.`,
                                "🧠"
                            );

                        }

                    } else {

                        locked = true;


                        setTimeout(() => {

                            card.textContent =
                                "?";

                            firstCard.textContent =
                                "?";


                            card.classList.remove(
                                "revealed"
                            );

                            firstCard.classList.remove(
                                "revealed"
                            );


                            firstCard = null;
                            locked = false;

                        }, 650);

                    }

                }
            );

        }
    );


    return () => {};

}


/* =========================================================
   REACTION TEST
========================================================= */

function launchReaction() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Reaction</span>
            <strong class="score-value">
                0 ms
            </strong>
        </div>

        <div
            class="reaction-box waiting"
            id="reactionBox"
        >
            Tap to start
        </div>

        <p id="reactionText">
            Wait for green.
        </p>
    `;


    const boxElement =
        document.getElementById(
            "reactionBox"
        );


    const textElement =
        document.getElementById(
            "reactionText"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let timer = null;
    let startTime = 0;
    let waiting = false;
    let ready = false;


    boxElement.addEventListener(
        "click",
        () => {

            if (!waiting && !ready) {

                waiting = true;
                ready = false;


                boxElement.className =
                    "reaction-box waiting";

                boxElement.textContent =
                    "Wait…";


                timer =
                    setTimeout(
                        () => {

                            waiting = false;
                            ready = true;

                            boxElement.className =
                                "reaction-box ready";

                            boxElement.textContent =
                                "CLICK!";

                            startTime =
                                performance.now();

                        },
                        1000 +
                        Math.random() * 2500
                    );


                return;

            }


            if (waiting) {

                clearTimeout(timer);

                waiting = false;

                boxElement.textContent =
                    "Too soon!";

                textElement.textContent =
                    "Tap to try again.";

                return;

            }


            if (ready) {

                const reaction =
                    Math.round(
                        performance.now() -
                        startTime
                    );


                ready = false;

                scoreElement.textContent =
                    `${reaction} ms`;


                textElement.textContent =
                    "Good! Tap to try again.";


                if (
                    getHighScore(
                        "reaction"
                    ) === 0 ||
                    reaction <
                    getHighScore(
                        "reaction"
                    )
                ) {

                    scores.reaction =
                        reaction;

                    saveScores();

                }


                boxElement.className =
                    "reaction-box waiting";

                boxElement.textContent =
                    `${reaction} ms`;

            }

        }
    );


    return () => {

        clearTimeout(timer);

    };

}


/* =========================================================
   NUMBER GUESS
========================================================= */

function launchNumberGuess() {

    const secret =
        Math.floor(
            Math.random() * 100
        ) + 1;


    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Attempts</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <h3>
            Guess a number from 1 to 100
        </h3>

        <input
            class="game-input"
            id="guessInput"
            type="number"
            min="1"
            max="100"
            placeholder="Enter number"
        >

        <button
            class="game-button"
            id="guessButton"
            type="button"
        >
            Guess
        </button>

        <p id="guessMessage"></p>
    `;


    const input =
        document.getElementById(
            "guessInput"
        );


    const button =
        document.getElementById(
            "guessButton"
        );


    const message =
        document.getElementById(
            "guessMessage"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let attempts = 0;


    function guess() {

        const number =
            Number(input.value);


        if (
            !Number.isInteger(number) ||
            number < 1 ||
            number > 100
        ) {

            message.textContent =
                "Enter a number between 1 and 100.";

            return;

        }


        attempts++;

        scoreElement.textContent =
            attempts;


        if (number === secret) {

            message.textContent =
                `Correct! The number was ${secret}.`;


            setHighScore(
                "numberguess",
                Math.max(
                    1,
                    101 - attempts
                )
            );


            button.disabled = true;
            input.disabled = true;


        } else if (number < secret) {

            message.textContent =
                "Too low!";


        } else {

            message.textContent =
                "Too high!";

        }

    }


    button.addEventListener(
        "click",
        guess
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                guess();

            }

        }
    );


    return () => {};

}


/* =========================================================
   ROCK PAPER SCISSORS
========================================================= */

function launchRPS() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Your Wins</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <div class="choice-row">

            <button
                class="choice-button"
                data-choice="rock"
                type="button"
            >
                ✊ Rock
            </button>

            <button
                class="choice-button"
                data-choice="paper"
                type="button"
            >
                ✋ Paper
            </button>

            <button
                class="choice-button"
                data-choice="scissors"
                type="button"
            >
                ✌️ Scissors
            </button>

        </div>

        <p id="rpsResult">
            Choose your move.
        </p>
    `;


    const result =
        document.getElementById(
            "rpsResult"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let wins = 0;


    gameContainer
        .querySelectorAll(
            "[data-choice]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const player =
                        button.dataset.choice;


                    const choices = [
                        "rock",
                        "paper",
                        "scissors"
                    ];


                    const computer =
                        choices[
                            Math.floor(
                                Math.random() *
                                choices.length
                            )
                        ];


                    let message;


                    if (
                        player ===
                        computer
                    ) {

                        message =
                            "Draw!";

                    } else if (

                        (
                            player === "rock" &&
                            computer === "scissors"
                        ) ||

                        (
                            player === "paper" &&
                            computer === "rock"
                        ) ||

                        (
                            player === "scissors" &&
                            computer === "paper"
                        )

                    ) {

                        wins++;

                        message =
                            "You win!";

                    } else {

                        message =
                            "Computer wins!";

                    }


                    scoreElement.textContent =
                        wins;


                    setHighScore(
                        "rps",
                        wins
                    );


                    result.textContent =
                        `You: ${player} • Computer: ${computer} • ${message}`;

                }
            );

        });


    return () => {};

}


/* =========================================================
   TAP COUNTER
========================================================= */

function launchTap() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Taps</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <button
            class="game-button"
            id="tapButton"
            type="button"
        >
            TAP!
        </button>

        <p>
            Tap as many times as possible.
        </p>
    `;


    const button =
        document.getElementById(
            "tapButton"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let taps = 0;


    button.addEventListener(
        "click",
        () => {

            taps++;

            scoreElement.textContent =
                taps;


            setHighScore(
                "tap",
                taps
            );

        }
    );


    return () => {};

}


/* =========================================================
   MATH SPRINT
========================================================= */

function launchMathSprint() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Points</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <h2 id="mathQuestion">
            Loading...
        </h2>

        <input
            class="game-input"
            id="mathAnswer"
            type="number"
            placeholder="Answer"
        >

        <button
            class="game-button"
            id="mathButton"
            type="button"
        >
            Submit
        </button>

        <p id="mathMessage"></p>
    `;


    const question =
        document.getElementById(
            "mathQuestion"
        );


    const answer =
        document.getElementById(
            "mathAnswer"
        );


    const button =
        document.getElementById(
            "mathButton"
        );


    const message =
        document.getElementById(
            "mathMessage"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let score = 0;
    let correctAnswer = 0;


    function newQuestion() {

        const a =
            Math.floor(
                Math.random() * 20
            ) + 1;


        const b =
            Math.floor(
                Math.random() * 20
            ) + 1;


        const operations = [
            "+",
            "-",
            "×"
        ];


        const operation =
            operations[
                Math.floor(
                    Math.random() *
                    operations.length
                )
            ];


        if (operation === "+") {

            correctAnswer =
                a + b;

        } else if (
            operation === "-"
        ) {

            correctAnswer =
                a - b;

        } else {

            correctAnswer =
                a * b;

        }


        question.textContent =
            `${a} ${operation} ${b} = ?`;


        answer.value = "";

        answer.focus();

    }


    function checkAnswer() {

        if (
            Number(answer.value) ===
            correctAnswer
        ) {

            score++;

            message.textContent =
                "Correct!";

            setHighScore(
                "mathsprint",
                score
            );

        } else {

            message.textContent =
                `Correct answer: ${correctAnswer}`;

        }


        scoreElement.textContent =
            score;


        newQuestion();

    }


    button.addEventListener(
        "click",
        checkAnswer
    );


    answer.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                checkAnswer();

            }

        }
    );


    newQuestion();

    return () => {};

}


/* =========================================================
   WORD GUESS
========================================================= */

function launchWordGuess() {

    const words = [
        "APPLE",
        "ROBOT",
        "GAMES",
        "SPACE",
        "MOUSE",
        "TIGER",
        "PLANT",
        "PHONE"
    ];


    const word =
        words[
            Math.floor(
                Math.random() *
                words.length
            )
        ];


    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Tries</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <h2 id="wordDisplay"></h2>

        <input
            class="game-input"
            id="letterInput"
            maxlength="1"
            placeholder="Enter a letter"
        >

        <button
            class="game-button"
            id="letterButton"
            type="button"
        >
            Guess
        </button>

        <p id="wordMessage">
            Guess the hidden word.
        </p>
    `;


    const display =
        document.getElementById(
            "wordDisplay"
        );


    const input =
        document.getElementById(
            "letterInput"
        );


    const button =
        document.getElementById(
            "letterButton"
        );


    const message =
        document.getElementById(
            "wordMessage"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    const guessed =
        new Set();


    let tries = 0;


    function renderWord() {

        display.textContent =
            [...word]
                .map(
                    letter =>
                        guessed.has(letter)
                            ? letter
                            : "_"
                )
                .join(" ");

    }


    function guessLetter() {

        const letter =
            input.value
                .trim()
                .toUpperCase();


        if (
            !/^[A-Z]$/.test(letter)
        ) {

            message.textContent =
                "Enter one letter.";

            return;

        }


        if (
            guessed.has(letter)
        ) {

            message.textContent =
                "You already tried that letter.";

            return;

        }


        guessed.add(letter);

        tries++;


        scoreElement.textContent =
            tries;


        renderWord();


        if (
            [...word].every(
                letter =>
                    guessed.has(letter)
            )
        ) {

            message.textContent =
                "You guessed the word!";


            setHighScore(
                "wordguess",
                Math.max(
                    1,
                    10 - tries
                )
            );


            button.disabled = true;
            input.disabled = true;


        } else if (
            word.includes(letter)
        ) {

            message.textContent =
                "Correct letter!";

        } else {

            message.textContent =
                "That letter is not in the word.";

        }


        input.value = "";
        input.focus();

    }


    button.addEventListener(
        "click",
        guessLetter
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                guessLetter();

            }

        }
    );


    renderWord();

    return () => {};

}


/* =========================================================
   COLOR MATCH
========================================================= */

function launchColorMatch() {

    const colors = [
        "Red",
        "Blue",
        "Green",
        "Yellow",
        "Purple",
        "Orange"
    ];


    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Points</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <h2 id="colorTarget">
            Color
        </h2>

        <div
            class="choice-row"
            id="colorChoices"
        ></div>

        <p id="colorMessage">
            Choose the matching color.
        </p>
    `;


    const target =
        document.getElementById(
            "colorTarget"
        );


    const choices =
        document.getElementById(
            "colorChoices"
        );


    const message =
        document.getElementById(
            "colorMessage"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let score = 0;
    let currentColor = "";


    function nextRound() {

        currentColor =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        target.textContent =
            currentColor;


        const shuffled =
            [...colors]
                .sort(
                    () =>
                        Math.random() - 0.5
                )
                .slice(0, 4);


        if (
            !shuffled.includes(
                currentColor
            )
        ) {

            shuffled[
                Math.floor(
                    Math.random() *
                    shuffled.length
                )
            ] = currentColor;

        }


        choices.innerHTML =
            shuffled
                .map(
                    color => `
                        <button
                            class="choice-button"
                            type="button"
                            data-color="${color}"
                        >
                            ${color}
                        </button>
                    `
                )
                .join("");


        choices
            .querySelectorAll(
                "[data-color]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            button.dataset.color ===
                            currentColor
                        ) {

                            score++;

                            message.textContent =
                                "Correct!";

                            setHighScore(
                                "colormatch",
                                score
                            );

                        } else {

                            message.textContent =
                                "Wrong!";

                        }


                        scoreElement.textContent =
                            score;


                        nextRound();

                    }
                );

            });

    }


    nextRound();

    return () => {};

}


/* =========================================================
   WHACK A MOLE
========================================================= */

function launchWhack() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Hits</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <div
            class="memory-grid"
            id="moleGrid"
        ></div>

        <p id="moleTimer">
            10 seconds
        </p>
    `;


    const grid =
        document.getElementById(
            "moleGrid"
        );


    const timerText =
        document.getElementById(
            "moleTimer"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let score = 0;
    let seconds = 10;
    let moleIndex = -1;


    let moveTimer = null;
    let countdownTimer = null;


    grid.innerHTML =
        Array.from(
            { length: 9 },
            (_, index) => `
                <button
                    class="memory-card"
                    data-mole="${index}"
                    type="button"
                >
                    🕳️
                </button>
            `
        )
        .join("");


    const cells =
        [...grid.children];


    function moveMole() {

        cells.forEach(
            cell =>
                cell.textContent = "🕳️"
        );


        moleIndex =
            Math.floor(
                Math.random() *
                cells.length
            );


        cells[moleIndex].textContent =
            "🐹";

    }


    cells.forEach(
        cell => {

            cell.addEventListener(
                "click",
                () => {

                    if (
                        Number(
                            cell.dataset.mole
                        ) === moleIndex
                    ) {

                        score++;

                        scoreElement.textContent =
                            score;

                        setHighScore(
                            "whack",
                            score
                        );

                        moveMole();

                    }

                }
            );

        }
    );


    moveMole();


    moveTimer =
        setInterval(
            moveMole,
            650
        );


    countdownTimer =
        setInterval(() => {

            seconds--;

            timerText.textContent =
                `${seconds} seconds`;


            if (seconds <= 0) {

                clearInterval(
                    moveTimer
                );

                clearInterval(
                    countdownTimer
                );


                showMessage(
                    "Time Up!",
                    `Hits: ${score}`,
                    "🔨"
                );

            }

        }, 1000);


    return () => {

        clearInterval(
            moveTimer
        );

        clearInterval(
            countdownTimer
        );

    };

}


/* =========================================================
   SLIDING PUZZLE
========================================================= */

function launchSliding() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Sliding Puzzle</span>
            <strong class="score-value">
                4 × 4
            </strong>
        </div>

        <div
            class="game-2048"
            id="slidingGrid"
        ></div>

        <p>
            Move the tiles into order.
        </p>
    `;


    const grid =
        document.getElementById(
            "slidingGrid"
        );


    let board = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 0
    ];


    function shuffle() {

        for (
            let i = board.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                board[i],
                board[j]
            ] = [
                board[j],
                board[i]
            ];

        }


        if (
            board.every(
                (value, index) =>
                    value ===
                    (index + 1) % 16
            )
        ) {

            shuffle();

        }

    }


    function render() {

        grid.innerHTML =
            board
                .map(
                    (value, index) => `
                        <button
                            class="tile-2048"
                            data-index="${index}"
                            type="button"
                        >
                            ${value || ""}
                        </button>
                    `
                )
                .join("");


        grid
            .querySelectorAll("button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        move(
                            Number(
                                button.dataset.index
                            )
                        );

                    }
                );

            });

    }


    function move(index) {

        const empty =
            board.indexOf(0);


        const row =
            Math.floor(index / 4);


        const col =
            index % 4;


        const emptyRow =
            Math.floor(empty / 4);


        const emptyCol =
            empty % 4;


        const adjacent =
            Math.abs(row - emptyRow) +
            Math.abs(col - emptyCol);


        if (adjacent !== 1) {
            return;
        }


        [
            board[index],
            board[empty]
        ] = [
            board[empty],
            board[index]
        ];


        render();


        const solved =
            board.every(
                (value, i) =>
                    value ===
                    (i + 1) % 16
            );


        if (solved) {

            setHighScore(
                "sliding",
                1
            );


            showMessage(
                "Solved!",
                "Puzzle completed.",
                "🧩"
            );

        }

    }


    shuffle();
    render();

    return () => {};

}


/* =========================================================
   SIMON SAYS
========================================================= */

function launchSimon() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Level</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <div
            class="simon-grid"
            id="simonGrid"
        >

            <button
                class="simon-button simon-red"
                data-color="0"
                type="button"
            ></button>

            <button
                class="simon-button simon-blue"
                data-color="1"
                type="button"
            ></button>

            <button
                class="simon-button simon-green"
                data-color="2"
                type="button"
            ></button>

            <button
                class="simon-button simon-yellow"
                data-color="3"
                type="button"
            ></button>

        </div>

        <p id="simonMessage">
            Press Start.
        </p>

        <button
            class="game-button"
            id="simonStart"
            type="button"
        >
            Start
        </button>
    `;


    const buttons =
        [
            ...document.querySelectorAll(
                "#simonGrid .simon-button"
            )
        ];


    const message =
        document.getElementById(
            "simonMessage"
        );


    const startButton =
        document.getElementById(
            "simonStart"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let sequence = [];
    let playerIndex = 0;
    let playing = false;


    function sleep(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );

    }


    async function flash(index) {

        buttons[index].classList.add(
            "active"
        );


        await sleep(400);


        buttons[index].classList.remove(
            "active"
        );


        await sleep(150);

    }


    async function playSequence() {

        playing = true;

        playerIndex = 0;

        message.textContent =
            "Watch the sequence…";


        for (
            const index of sequence
        ) {

            await flash(index);

        }


        playing = false;

        message.textContent =
            "Your turn!";

    }


    async function startGame() {

        sequence = [];

        scoreElement.textContent =
            "0";


        startButton.disabled =
            true;


        addStep();

        await playSequence();

    }


    function addStep() {

        sequence.push(
            Math.floor(
                Math.random() * 4
            )
        );

    }


    buttons.forEach(
        (button, index) => {

            button.addEventListener(
                "click",
                async () => {

                    if (playing) {
                        return;
                    }


                    if (
                        Number(
                            button.dataset.color
                        ) !==
                        sequence[playerIndex]
                    ) {

                        message.textContent =
                            "Wrong! Game over.";

                        startButton.disabled =
                            false;

                        setHighScore(
                            "simon",
                            sequence.length - 1
                        );

                        return;

                    }


                    await flash(index);

                    playerIndex++;


                    if (
                        playerIndex ===
                        sequence.length
                    ) {

                        const level =
                            sequence.length;


                        scoreElement.textContent =
                            level;


                        setHighScore(
                            "simon",
                            level
                        );


                        addStep();

                        await sleep(300);

                        await playSequence();

                    }

                }
            );

        }
    );


    startButton.addEventListener(
        "click",
        startGame
    );


    return () => {};

}


/* =========================================================
   CANVAS GAMES
========================================================= */

function launchCanvasGame(type) {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Score</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <canvas
            class="game-canvas"
            id="gameCanvas"
            width="420"
            height="300"
        ></canvas>

        <p>
            Use keyboard controls.
        </p>
    `;


    const canvas =
        document.getElementById(
            "gameCanvas"
        );


    const ctx =
        canvas.getContext("2d");


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let score = 0;
    let animationId = null;


    const keys = {};


    function keyDown(event) {

        keys[event.key] = true;

    }


    function keyUp(event) {

        keys[event.key] = false;

    }


    document.addEventListener(
        "keydown",
        keyDown
    );


    document.addEventListener(
        "keyup",
        keyUp
    );


    if (type === "pong") {

        let paddleY = 120;

        let ballX = 210;
        let ballY = 150;

        let ballVX = 4;
        let ballVY = 3;


        function drawPong() {

            ctx.fillStyle =
                "#10101a";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            if (keys.ArrowUp) {

                paddleY -= 5;

            }


            if (keys.ArrowDown) {

                paddleY += 5;

            }


            paddleY =
                Math.max(
                    0,
                    Math.min(
                        220,
                        paddleY
                    )
                );


            ballX += ballVX;
            ballY += ballVY;


            if (
                ballY <= 7 ||
                ballY >= 293
            ) {

                ballVY *= -1;

            }


            if (
                ballX <= 25 &&
                ballY >= paddleY &&
                ballY <= paddleY + 80
            ) {

                ballVX =
                    Math.abs(ballVX);

                score++;

                scoreElement.textContent =
                    score;

                setHighScore(
                    "pong",
                    score
                );

            }


            if (ballX > 420) {

                ballX = 210;
                ballY = 150;

            }


            if (ballX < 0) {

                cancelAnimationFrame(
                    animationId
                );


                showMessage(
                    "Game Over",
                    `Score: ${score}`,
                    "🏓"
                );


                return;

            }


            ctx.fillStyle =
                "#00f5ff";


            ctx.fillRect(
                15,
                paddleY,
                10,
                80
            );


            ctx.fillStyle =
                "#ff2bd6";


            ctx.beginPath();

            ctx.arc(
                ballX,
                ballY,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();


            animationId =
                requestAnimationFrame(
                    drawPong
                );

        }


        drawPong();


    } else if (type === "breakout") {

        let paddleX = 160;

        let ballX = 210;
        let ballY = 260;

        let ballVX = 3;
        let ballVY = -3;


        const bricks = [];


        for (
            let row = 0;
            row < 4;
            row++
        ) {

            for (
                let col = 0;
                col < 7;
                col++
            ) {

                bricks.push({
                    x: 20 + col * 56,
                    y: 30 + row * 25,
                    alive: true
                });

            }

        }


        function drawBreakout() {

            ctx.fillStyle =
                "#10101a";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            if (keys.ArrowLeft) {

                paddleX -= 6;

            }


            if (keys.ArrowRight) {

                paddleX += 6;

            }


            paddleX =
                Math.max(
                    0,
                    Math.min(
                        320,
                        paddleX
                    )
                );


            ballX += ballVX;
            ballY += ballVY;


            if (
                ballX <= 7 ||
                ballX >= 413
            ) {

                ballVX *= -1;

            }


            if (ballY <= 7) {

                ballVY *= -1;

            }


            if (
                ballY >= 270 &&
                ballY <= 290 &&
                ballX >= paddleX &&
                ballX <= paddleX + 100
            ) {

                ballVY =
                    -Math.abs(ballVY);

            }


            for (
                const brick of bricks
            ) {

                if (
                    brick.alive &&
                    ballX >= brick.x &&
                    ballX <= brick.x + 48 &&
                    ballY >= brick.y &&
                    ballY <= brick.y + 18
                ) {

                    brick.alive = false;

                    ballVY *= -1;

                    score++;

                    scoreElement.textContent =
                        score;

                    setHighScore(
                        "breakout",
                        score
                    );

                    break;

                }

            }


            if (ballY > 300) {

                cancelAnimationFrame(
                    animationId
                );


                showMessage(
                    "Game Over",
                    `Score: ${score}`,
                    "🧱"
                );


                return;

            }


            bricks.forEach(
                brick => {

                    if (!brick.alive) {
                        return;
                    }


                    ctx.fillStyle =
                        "#8b5cf6";


                    ctx.fillRect(
                        brick.x,
                        brick.y,
                        48,
                        18
                    );

                }
            );


            ctx.fillStyle =
                "#00f5ff";


            ctx.fillRect(
                paddleX,
                280,
                100,
                10
            );


            ctx.fillStyle =
                "#ff2bd6";


            ctx.beginPath();

            ctx.arc(
                ballX,
                ballY,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();


            if (
                bricks.every(
                    brick =>
                        !brick.alive
                )
            ) {

                cancelAnimationFrame(
                    animationId
                );


                showMessage(
                    "You Won!",
                    `Score: ${score}`,
                    "🧱"
                );


                return;

            }


            animationId =
                requestAnimationFrame(
                    drawBreakout
                );

        }


        drawBreakout();


    } else {

        let playerX = 190;

        let playerY = 250;

        let obstacles = [];

        let lastSpawn = 0;


        function drawDodge() {

            ctx.fillStyle =
                "#10101a";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            if (
                keys.ArrowLeft ||
                keys.a
            ) {

                playerX -= 5;

            }


            if (
                keys.ArrowRight ||
                keys.d
            ) {

                playerX += 5;

            }


            playerX =
                Math.max(
                    0,
                    Math.min(
                        380,
                        playerX
                    )
                );


            if (
                performance.now() -
                lastSpawn >
                700
            ) {

                obstacles.push({
                    x: Math.floor(
                        Math.random() *
                        390
                    ),
                    y: -20,
                    size: 20,
                    speed:
                        2 +
                        Math.random() * 2
                });


                lastSpawn =
                    performance.now();

            }


            obstacles.forEach(
                obstacle => {

                    obstacle.y +=
                        obstacle.speed;

                }
            );


            obstacles =
                obstacles.filter(
                    obstacle =>
                        obstacle.y < 320
                );


            for (
                const obstacle of obstacles
            ) {

                if (
                    playerX <
                        obstacle.x +
                        obstacle.size &&
                    playerX + 20 >
                        obstacle.x &&
                    playerY <
                        obstacle.y +
                        obstacle.size &&
                    playerY + 20 >
                        obstacle.y
                ) {

                    cancelAnimationFrame(
                        animationId
                    );


                    showMessage(
                        "Game Over",
                        `Score: ${score}`,
                        "🚀"
                    );


                    return;

                }

            }


            score += 1;

            scoreElement.textContent =
                Math.floor(
                    score / 10
                );


            ctx.fillStyle =
                "#00f5ff";


            ctx.fillRect(
                playerX,
                playerY,
                20,
                20
            );


            ctx.fillStyle =
                "#ff2bd6";


            obstacles.forEach(
                obstacle => {

                    ctx.fillRect(
                        obstacle.x,
                        obstacle.y,
                        obstacle.size,
                        obstacle.size
                    );

                }
            );


            animationId =
                requestAnimationFrame(
                    drawDodge
                );

        }


        drawDodge();

    }


    return () => {

        cancelAnimationFrame(
            animationId
        );


        document.removeEventListener(
            "keydown",
            keyDown
        );


        document.removeEventListener(
            "keyup",
            keyUp
        );

    };

}


/* =========================================================
   MINESWEEPER
========================================================= */

function launchMinesweeper() {

    const size = 8;
    const mineCount = 10;

    const total =
        size * size;


    const mines =
        new Set();


    while (
        mines.size <
        mineCount
    ) {

        mines.add(
            Math.floor(
                Math.random() *
                total
            )
        );

    }


    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Safe Cells</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <div
            class="mine-grid"
            id="mineGrid"
        ></div>

        <p id="mineMessage">
            Find all safe cells.
        </p>
    `;


    const grid =
        document.getElementById(
            "mineGrid"
        );


    const message =
        document.getElementById(
            "mineMessage"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let safeCells = 0;
    let gameOver = false;


    grid.innerHTML =
        Array.from(
            { length: total },
            (_, index) => `
                <button
                    class="mine-cell"
                    data-index="${index}"
                    type="button"
                >
                    ?
                </button>
            `
        )
        .join("");


    function countNearbyMines(index) {

        const row =
            Math.floor(index / size);

        const col =
            index % size;


        let count = 0;


        for (
            let dr = -1;
            dr <= 1;
            dr++
        ) {

            for (
                let dc = -1;
                dc <= 1;
                dc++
            ) {

                if (
                    dr === 0 &&
                    dc === 0
                ) {
                    continue;
                }


                const r =
                    row + dr;

                const c =
                    col + dc;


                if (
                    r >= 0 &&
                    r < size &&
                    c >= 0 &&
                    c < size
                ) {

                    const neighbor =
                        r * size + c;


                    if (
                        mines.has(
                            neighbor
                        )
                    ) {

                        count++;

                    }

                }

            }

        }


        return count;

    }


    grid
        .querySelectorAll("button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (gameOver) {
                        return;
                    }


                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (
                        button.classList.contains(
                            "revealed"
                        )
                    ) {
                        return;
                    }


                    button.classList.add(
                        "revealed"
                    );


                    if (
                        mines.has(index)
                    ) {

                        button.textContent =
                            "💣";

                        button.classList.add(
                            "mine"
                        );


                        gameOver = true;

                        message.textContent =
                            "Mine found! Restart to try again.";


                        grid
                            .querySelectorAll(
                                "button"
                            )
                            .forEach(
                                cell =>
                                    cell.disabled = true
                            );


                        return;

                    }


                    const nearby =
                        countNearbyMines(
                            index
                        );


                    button.textContent =
                        nearby || "✓";


                    safeCells++;


                    scoreElement.textContent =
                        safeCells;


                    if (
                        safeCells ===
                        total - mineCount
                    ) {

                        gameOver = true;


                        setHighScore(
                            "minesweeper",
                            safeCells
                        );


                        showMessage(
                            "You Won!",
                            "All safe cells found.",
                            "💣"
                        );

                    }

                }
            );

        });


    return () => {};

}


/* =========================================================
   CONNECT FOUR
========================================================= */

function launchConnectFour() {

    const rows = 6;
    const cols = 7;


    let board =
        Array.from(
            { length: rows },
            () =>
                Array(cols).fill("")
        );


    let currentPlayer = "🔴";
    let gameFinished = false;


    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Turn</span>
            <strong class="score-value">
                🔴
            </strong>
        </div>

        <div
            class="connect-board"
            id="connectBoard"
        ></div>

        <p id="connectMessage">
            Player 🔴 starts.
        </p>
    `;


    const boardElement =
        document.getElementById(
            "connectBoard"
        );


    const message =
        document.getElementById(
            "connectMessage"
        );


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    function checkWin(player) {

        for (
            let row = 0;
            row < rows;
            row++
        ) {

            for (
                let col = 0;
                col < cols;
                col++
            ) {

                if (
                    board[row][col] !==
                    player
                ) {
                    continue;
                }


                const directions = [
                    [0, 1],
                    [1, 0],
                    [1, 1],
                    [1, -1]
                ];


                for (
                    const [
                        dr,
                        dc
                    ] of directions
                ) {

                    let count = 1;


                    for (
                        let step = 1;
                        step < 4;
                        step++
                    ) {

                        const r =
                            row +
                            dr *
                            step;


                        const c =
                            col +
                            dc *
                            step;


                        if (
                            r >= 0 &&
                            r < rows &&
                            c >= 0 &&
                            c < cols &&
                            board[r][c] ===
                                player
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


    function render() {

        boardElement.innerHTML =
            board
                .flatMap(
                    (row, rowIndex) =>
                        row.map(
                            (value, colIndex) => `
                                <button
                                    class="connect-cell"
                                    data-row="${rowIndex}"
                                    data-col="${colIndex}"
                                    type="button"
                                >
                                    ${value || "•"}
                                </button>
                            `
                        )
                )
                .join("");


        boardElement
            .querySelectorAll(
                ".connect-cell"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        drop(
                            Number(
                                button.dataset.col
                            )
                        );

                    }
                );

            });

    }


    function drop(col) {

        if (gameFinished) {
            return;
        }


        for (
            let row = rows - 1;
            row >= 0;
            row--
        ) {

            if (
                !board[row][col]
            ) {

                board[row][col] =
                    currentPlayer;


                if (
                    checkWin(
                        currentPlayer
                    )
                ) {

                    gameFinished =
                        true;


                    message.textContent =
                        `${currentPlayer} wins!`;


                    setHighScore(
                        "connect4",
                        1
                    );


                    render();

                    return;

                }


                if (
                    board
                        .flat()
                        .every(
                            cell =>
                                cell !== ""
                        )
                ) {

                    gameFinished =
                        true;


                    message.textContent =
                        "Draw!";


                    render();

                    return;

                }


                currentPlayer =
                    currentPlayer ===
                    "🔴"
                        ? "🟡"
                        : "🔴";


                scoreElement.textContent =
                    currentPlayer;


                message.textContent =
                    `${currentPlayer}'s turn.`;


                render();

                return;

            }

        }

    }


    render();

    return () => {};

}


/* =========================================================
   DODGE BLOCKS
========================================================= */

function launchDodge() {

    return launchCanvasGame(
        "dodge"
    );

}


/* =========================================================
   COIN CATCHER
========================================================= */

function launchCoinCatcher() {

    gameContainer.innerHTML = `
        <div class="game-info-bar">
            <span>Coins</span>
            <strong class="score-value">
                0
            </strong>
        </div>

        <canvas
            class="game-canvas"
            id="coinCanvas"
            width="420"
            height="300"
        ></canvas>

        <p>
            Use ← and → to catch coins.
        </p>
    `;


    const canvas =
        document.getElementById(
            "coinCanvas"
        );


    const ctx =
        canvas.getContext("2d");


    const scoreElement =
        gameContainer.querySelector(
            ".score-value"
        );


    let playerX = 190;
    let coins = [];
    let score = 0;
    let animationId = null;
    let lastSpawn = 0;


    const keys = {};


    function keyDown(event) {

        keys[event.key] = true;

    }


    function keyUp(event) {

        keys[event.key] = false;

    }


    document.addEventListener(
        "keydown",
        keyDown
    );


    document.addEventListener(
        "keyup",
        keyUp
    );


    function loop() {

        ctx.fillStyle =
            "#10101a";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        if (
            keys.ArrowLeft
        ) {

            playerX -= 6;

        }


        if (
            keys.ArrowRight
        ) {

            playerX += 6;

        }


        playerX =
            Math.max(
                0,
                Math.min(
                    370,
                    playerX
                )
            );


        if (
            performance.now() -
            lastSpawn >
            650
        ) {

            coins.push({
                x:
                    10 +
                    Math.random() *
                    390,

                y: -10,

                speed:
                    2 +
                    Math.random() * 2
            });


            lastSpawn =
                performance.now();

        }


        coins.forEach(
            coin => {

                coin.y +=
                    coin.speed;

            }
        );


        for (
            const coin of coins
        ) {

            if (
                coin.x >
                    playerX &&
                coin.x <
                    playerX + 50 &&
                coin.y >
                    250 &&
                coin.y <
                    290
            ) {

                coin.caught = true;

                score++;

                scoreElement.textContent =
                    score;


                setHighScore(
                    "coin",
                    score
                );

            }

        }


        coins =
            coins.filter(
                coin =>
                    !coin.caught &&
                    coin.y < 320
            );


        ctx.fillStyle =
            "#00f5ff";


        ctx.fillRect(
            playerX,
            270,
            50,
            15
        );


        ctx.fillStyle =
            "#ffd700";


        coins.forEach(
            coin => {

                ctx.beginPath();

                ctx.arc(
                    coin.x,
                    coin.y,
                    8,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }
        );


        animationId =
            requestAnimationFrame(
                loop
            );

    }


    loop();


    return () => {

        cancelAnimationFrame(
            animationId
        );


        document.removeEventListener(
            "keydown",
            keyDown
        );


        document.removeEventListener(
            "keyup",
            keyUp
        );

    };

}


/* =========================================================
   GAME LAUNCHERS
========================================================= */

const gameLaunchers = {

    snake:
        launchSnake,

    tictactoe:
        launchTicTacToe,

    "2048":
        launch2048,

    memory:
        launchMemory,

    reaction:
        launchReaction,

    numberguess:
        launchNumberGuess,

    pong:
        () =>
            launchCanvasGame(
                "pong"
            ),

    breakout:
        () =>
            launchCanvasGame(
                "breakout"
            ),

    minesweeper:
        launchMinesweeper,

    connect4:
        launchConnectFour,

    rps:
        launchRPS,

    simon:
        launchSimon,

    whack:
        launchWhack,

    sliding:
        launchSliding,

    colormatch:
        launchColorMatch,

    mathsprint:
        launchMathSprint,

    tap:
        launchTap,

    wordguess:
        launchWordGuess,

    dodge:
        launchDodge,

    coin:
        launchCoinCatcher

};


/* =========================================================
   INITIALIZE
========================================================= */

function initializeApp() {

    renderCategories();

    renderGames();

    applyTheme();

}


initializeApp();
