let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let game = document.querySelector(".game");

let cellSize = 28.5;
let rows = 20;
let cols = 10;
const COLOR = "white";
let lineColor = "#ccc";
let gameOver = false;
let playing = false;
let paused = false;
let mute = false;
let interval; // for start game
let interval2; // for move fast when press Space
let score = 0;

let cW = canvas.width = cellSize * cols;
let cH = canvas.height = cellSize * rows;
game.style = `width: ${cW}px; margin: auto`;
// Tạo mảng chứa các dạng hình
let pieces = [
    [Z, "red"],
    [S, "green"],
    [T, "purple"],
    [O, "yellow"],
    [L, "blue"],
    [I, "cyan"],
    [J, "orange"],
];
// Game board & hình
let board = new Array(rows);
let p = {};

let maxScore;

function checkMaxScore() {
    if (localStorage.getItem("maxScore")) {
        maxScore = localStorage.getItem("maxScore");
    } else {
        maxScore = 0;
        localStorage.setItem("maxScore", `${maxScore}`);
    }
    document.getElementById("max-score").innerText = maxScore;
}

function resetMaxScore() {
    localStorage.removeItem("maxScore");
    checkMaxScore();
}


// Sound tracks
let tetris = new Sounds("./sound/tetris.mp3");
let lose = new Sounds("./sound/game-over.mp3");
let clear = new Sounds("./sound/clear.mp3");
let move = new Sounds("./sound/move.mp3");
let bounce = new Sounds("./sound/bounce.mp3");
let rotate = new Sounds("./sound/rotate.mp3");
let audios = document.querySelectorAll("audio");

// Buttons
let newBtn = document.getElementById("new");
let playBtn = document.getElementById("play");
let pauseBtn = document.getElementById("pause");
let muteBtn = document.getElementById("mute");
let soundBtn = document.getElementById("sound-on");
let guideBtn = document.getElementById("guide");

function drawCell(x, y, color) {
    // Vẽ 2 hình chữ nhật đè lên nhau, 1 hình màu, 1 hình viền
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    ctx.strokeStyle = lineColor;// màu viền
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

}

// Tạo mảng 2 chiều chứa gameboard có kích thước rows x cols
function newGame() {
    for (let i = 0; i < rows; i++) {
        if (!board[i]) {
            board[i] = new Array(cols);// nếu tồn tại các mảng con của board rồi thì bỏ qua
        }
        for (let j = 0; j < cols; j++) {
            board[i][j] = COLOR;
        }
    }
    p = randomPiece();
    score = 0;
    document.getElementById("score").innerText = score;
    addControl();
    checkMaxScore();
}

newGame();

// Vẽ game-board
function drawBoard() {
    if (gameOver) {
        return;
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            drawCell(j, i, board[i][j]);
        }
    }
}

drawBoard();

// Tạo random 1 hình
function randomPiece() {
    let r = Math.floor(Math.random() * 100 * pieces.length / 100);
    return new Pieces(pieces[r][0], pieces[r][1]);
}

// Hàm thả rơi
function drop() {
    interval = setInterval(function () {
        checkGameOver();
        if (!gameOver) {
            p.moveDown();
        } else {
            clearInterval(interval);
        }

    }, 500);
}

// Bắt sự kiện điều khiển bằng bàn phím
function gameControl(evt) {
    if (!playing) {
        return;
    }
    evt.preventDefault(); // chống di chuyển khung hình bằng phím mũi tên
    if (evt.type === "keydown") {
        switch (evt.key) {
            case "ArrowLeft":
                p.moveLeft();
                break;
            case "ArrowRight":
                p.moveRight();
                break;
            case "ArrowDown":
                p.moveDown();
                break;
            case "ArrowUp":
                p.rotate();
                break;
            case " ": // bấm nút space
                interval2 = setInterval(() => {
                    p.moveDown()
                }, 1)// tăng tốc độ rơi nhanh hơn
                break;
        }
    }
    if (evt.type === "keyup") {
        switch (evt.key) {
            case " ":
                clearInterval(interval2);
                break;
        }
    }
    if (evt.type === "keypress") {
        switch (evt.key) {
            case " ":
                clearInterval(interval2);
                break;
        }
    }

}

function mouseControl(evt) {
    if (!playing) {
        return;
    }
    switch (evt.type) {
        case "click":
            p.rotate();
            break;
        case "contextmenu":
            evt.preventDefault();
            p.moveDown();
            break;
        case "mousemove":
            evt.preventDefault();
            break;

    }
}

// Thêm bắt sự kiện từ bàn phím và chuột
function addControl() {
    window.addEventListener("keydown", gameControl);
    window.addEventListener("keyup", gameControl);
    window.addEventListener("keypress", gameControl);
    canvas.addEventListener("mousemove", mouseControl);
    canvas.addEventListener("click", mouseControl);
    canvas.addEventListener("contextmenu", mouseControl);
}

// Bỏ bắt sự kiện từ bàn phím và chuột
function removeControl() {
    window.removeEventListener("keydown", gameControl);
    window.removeEventListener("keyup", gameControl);
    window.removeEventListener("keypress", gameControl);
    canvas.removeEventListener("mousemove", mouseControl);
    canvas.removeEventListener("click", mouseControl);
    canvas.removeEventListener("contextmenu", mouseControl);
}

function checkGameOver() {
    if (gameOver) {
        clearInterval(interval);
        clearInterval(interval2);
        removeControl();
        playing = false;
        playBtn.hidden = true;
        pauseBtn.hidden = true;
        soundBtn.hidden = true;
        muteBtn.hidden = true;
        newBtn.hidden = false;
        guideBtn.hidden = false;
        makeCover();
    }
}

// Thực hiện các hành động khi các nút có sự kiện onclick
playBtn.onclick = () => {
    drawBoard(); // vẽ lại board game
    p.draw(); // vẽ lại hình game
    addControl();
    if (playBtn.innerText !== "Play") {
        playBtn.innerText = "Play";
        muteBtn.hidden = false;
    }
    drop();
    sound(this);
    paused = false;
    if (!playing) {
        playing = true;
    }
    playBtn.hidden = true;
    newBtn.hidden = false;
    guideBtn.hidden = true;
    pauseBtn.hidden = false;
    guideBtn.ariaPressed = "false";
    guideBtn.hidden = true;

    if (audios[0].paused) {
        soundBtn.hidden = false;

    } else {
        muteBtn.hidden = false;
    }
};

pauseBtn.onclick = () => {
    playing = false;
    paused = true;
    makeCover();
    clearInterval(interval);
    removeControl();
    tetris.stop();
    pauseBtn.hidden = true; // arrow function không có bind, nên không dùng được this
    playBtn.hidden = false;
    muteBtn.hidden = true;
    soundBtn.hidden = true;
    guideBtn.hidden = false;
};

newBtn.onclick = () => {
    gameOver = false;
    playing = true;
    removeControl();
    clearInterval(interval); // Xóa interval để mỗi lần new không bị duplicate interval, làm tốc độ rơi nhanh hơn
    clearInterval(interval2);
    newGame();
    drawBoard();
    addControl();
    drop();
    tetris.sound.pause();
    tetris.sound.currentTime = 0;
    sound(this); // play nhạc nền khi ấn new
    if (audios[0].paused) {
        soundBtn.hidden = false;
    } else {
        sound(this); // play lại nhạc sau khi pause() ở trên
        muteBtn.hidden = false;
    }
    pauseBtn.hidden = false;
    playBtn.hidden = true;
    guideBtn.hidden = true;
    guideBtn.ariaPressed = "false";
};

guideBtn.onclick = () => {
    if (guideBtn.ariaPressed === "true") {
        if (gameOver) {
            gameOver = false;
            drawBoard();
            gameOver = true;
        } else {
            drawBoard();
        }
        p.draw();
        makeCover();
        guideBtn.ariaPressed = "false";
    } else {
        if (gameOver) {
            gameOver = false;
            drawBoard();
            gameOver = true;
        } else {
            drawBoard();
        }
        p.draw();
        guideMenu();
        guideBtn.ariaPressed = "true";
    }
}


// Function phát âm thanh
function sound(element) {
    if (gameOver) {
        return;
    }
    switch (element.id) {
        case "mute":
            mute = true;
            for (let i = 0; i < audios.length; i++) {
                audios[i].pause();
            }
            element.hidden = true;
            soundBtn.hidden = false;
            break;
        case "sound-on":
            mute = false;
            element.hidden = true;
            muteBtn.hidden = false;

        default:
            tetris.play();
            tetris.sound.loop = true;
    }

}

// Tạo lớp mờ khi gamve over hoặc pause
function makeCover() {
    if (paused || gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.rect(0, 0, cW, cH);
        ctx.fill();
        ctx.font = "30px Verdana";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        // vẽ chữ trên lớp mờ đấy
        if (gameOver) {
            ctx.fillText("GAME OVER", cW / 2, cH / 2);
        } else if (paused) {
            ctx.fillText("PAUSE", cW / 2, cH / 2);
        }
    }
}

function guideMenu() {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.rect(0, 0, cW, cH);
    ctx.fill();
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    ctx.fillText(`Hướng dẫn`, 20, cH / 10);
    ctx.font = "20px Verdana";
    ctx.textAlign = "start";
    ctx.fillText(`Bấm các phím:`, 20, 100);
    ctx.fillText(`Trái - Phải để di chuyển`, 20, 130);
    ctx.fillText(`Lên để xoay`, 20, 160);
    ctx.fillText(`Xuống để đi nhanh`, 20, 190);
    ctx.fillText(`Space để đi siêu nhanh`, 20, 220);
}



