let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let game = document.querySelector(".game");

let cellSize = 28.5; // 30x30
let rows = 20;
let cols = 10;
const COLOR = "white";
let lineColor = "#ccc";
let gameOver = false;
let playing = false;
let mute = false;
let interval; // for start game
let interval2; // for move fast when press ArrowDown
let score = 0;

let cW = canvas.width = cellSize * cols; // 300
let cH = canvas.height = cellSize * rows; // 600
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

// sound track

let tetris = new Sounds("./sound/tetris.mp3");
let lose = new Sounds("./sound/game-over.mp3");
let clear = new Sounds("./sound/clear.mp3");
let move = new Sounds("./sound/move.mp3");
let bounce = new Sounds("./sound/bounce.mp3");
let rotate = new Sounds("./sound/rotate.mp3");
let audios = document.querySelectorAll("audio");


// buttons
let newBtn = document.getElementById("new");
let playBtn = document.getElementById("play");
let pauseBtn = document.getElementById("pause");
let muteBtn = document.getElementById("mute");
let soundBtn = document.getElementById("sound-on");

function drawCell(x, y, color) {
    // Vẽ 2 hình chữ nhật đè lên nhau, 1 hình màu, 1 hình viền
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    ctx.strokeStyle = lineColor;// màu viền
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

}

// Tạo mảng 2 chiều chứa gameboard có kích thước rows x cols
// gán màu mặc định (white) cho từng ô

let board = new Array(rows);
let p = {};

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
}

newGame();

// Vẽ game-board
function drawBoard() {
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




// hàm thả rơi
function drop() {
    interval = setInterval(function () {
        checkGameOver();
        // console.log(gameOver);
        if (!gameOver) {
            p.moveDown();
            // checkGameOver();

        } else {
            clearInterval(interval);
            // makeCover();
        }

    }, 500)

}

// drop();

// Bắt sự kiện khi bấm chuột


function gameControl(evt) {
    if (!playing) {
        return
    }
    evt.preventDefault(); // chống di chuyển khung hình bằng phím mũi tên
    // console.log(evt.key);
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
                }, 1)// tăng tốc độ rơi
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
        // console.log(evt)
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
            for (let i = 0; i < cols; i++) {
                if (evt.offsetX <= (i + 1) * cellSize && evt.offsetX >= i * cellSize) {
                    p.moveFollowMouse(i);
                    // console.log(i)
                    // console.log(gameOver)
                }
            }
            break;

    }
}

// addControl();
function addControl() {
    window.addEventListener("keydown", gameControl);
    window.addEventListener("keyup", gameControl);
    window.addEventListener("keypress", gameControl);
    canvas.addEventListener("mousemove", mouseControl);
    canvas.addEventListener("click", mouseControl);
    canvas.addEventListener("contextmenu", mouseControl);
}


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
        console.log("Game over");
        makeCover();
    }
}

playBtn.onclick = () => {
    // p.unDraw();
    drawBoard(); // vẽ lại board game
    p.draw(); // vẽ lại hình game
    addControl();
    if (playBtn.innerText !== "Play") {
        playBtn.innerText = "Play";
        muteBtn.hidden = false;
    }
    drop();
    sound(this);
    if (!playing) {
        playing = true;
    }
    playBtn.hidden = true;
    newBtn.hidden = false;
    pauseBtn.hidden = false;

    if (audios[0].paused) {
        soundBtn.hidden = false;

    } else {
        muteBtn.hidden = false;
    }

};

pauseBtn.onclick = () => {
    // console.log(p.x);
    makeCover();
    clearInterval(interval);
    removeControl();
    tetris.stop();
    // playing = true;

    pauseBtn.hidden = true; // arrow function không có bind, nên không dùng được this
    playBtn.hidden = false;
    muteBtn.hidden = true;
    soundBtn.hidden = true;

};

newBtn.onclick = () => {
    removeControl();
    clearInterval(interval); // xóa interval để tránh duplicate gọi drop()
    clearInterval(interval2);
    newGame();
    drawBoard();
    gameOver = false;
    playing = true;
    mute = false;
    // restart audio at new game
    tetris.sound.pause();
    tetris.sound.currentTime = 0;
    addControl();
    drop();
    sound(this);
    // newBtn.hidden = true; // arrow function không có bind, nên không dùng được this
    pauseBtn.hidden = false;
    playBtn.hidden = true;
    muteBtn.hidden = false;
    soundBtn.hidden = true;
    // console.log("sound hidden:  "+muteBtn.hidden);
    // tetris.play();




};

// document.getElementById("play").addEventListener("click", sound);

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
            // tetris.stop();
            element.hidden = true;
            soundBtn.hidden = false;
            break;
        case "sound-on":
            mute = false;
            element.hidden = true;
            muteBtn.hidden = false;

        default:
            tetris.play();
            // document.getElementById("mute").hidden = false;
            tetris.sound.loop = true;
        // console.log(playing);
    }

}

function makeCover() {
    // tạo lớp mờ
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.rect(0, 0, cW, cH);
    ctx.fill();
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    // vẽ chữ trên lớp mờ đấy
    if (gameOver) {
        ctx.fillText("GAME OVER", cW / 2, cH / 2);
        // console.log("Why")
    } else {
        ctx.fillText("PAUSE", cW / 2, cH / 2);
    }


}








