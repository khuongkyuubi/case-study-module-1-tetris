let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let game = document.querySelector(".game");



let cellSize = 30; // 30x30
let rows = 20;
let cols = 10;
const COLOR = "WHITE";
let lineColor = "#ccc";
let gameOver = false;
let interval;
let score = 0;

let cW = canvas.width = cellSize * cols; // 300
let cH = canvas.height = cellSize * rows; // 600
game.style = `width: ${cW}px; margin: auto`;


let pieces = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"],
];


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
for (let i = 0; i < rows; i++) {
    board[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
        board[i][j] = COLOR;
    }
}
// console.log(board);
drawCell(19, 9, "blue");

function drawBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            drawCell(j, i, board[i][j]);
        }
    }
}

drawBoard();

function randomPiece() {
    let r = Math.floor(Math.random() * 100 * pieces.length / 100);
    return new Pieces(pieces[r][0], pieces[r][1]);

}

let p = randomPiece();

// hàm thả rơi

function drop() {
    interval = setInterval(function () {
        if (!gameOver) {
            p.moveDown();
            checkGameOver();

        } else {
            clearInterval(interval);
        }

    }, 500)

}

drop();
// p.moveDown();

// Bắt sự kiện khi bấm chuột
window.addEventListener("keydown", gameControl);

function gameControl(evt) {
    evt.preventDefault(); // chống di chuyển khung hình bằng phím mũi tên
    // console.log(evt.key);
    switch (evt.key) {
        case "ArrowLeft":
            p.moveLeft();
            break;
        case "ArrowRight":
            p.moveRight();
            break;
        case "ArrowDown":
            p.moveDown();
            interval = setInterval(()=>{p.moveDown()},10)// tăng tốc độ rơi
            break;
        case "ArrowUp":
            p.rotate();
            // console.log(p.testrominoN);
            break;
    }

}

canvas.addEventListener("mousemove", mouseControl);
canvas.addEventListener("click", mouseControl);
canvas.addEventListener("contextmenu", mouseControl);


function mouseControl(evt) {
    if (evt.type === "click") {
        p.rotate();
    }
    if (evt.type === "contextmenu") {
        evt.preventDefault();
        p.moveDown();
    }
    if (evt.type === "mousemove") {
        // console.log(evt.offsetX);
        for (let i = 0; i < cols; i++) {
            if (evt.offsetX <= (i + 1) * cellSize && evt.offsetX >= i * cellSize) {
                p.moveFollowMouse(i);
                console.log(i)
            }
        }
    }


}

function checkGameOver() {
    if (gameOver) {
        canvas.removeEventListener("mousemove", mouseControl);
        canvas.removeEventListener("click", mouseControl);
        window.removeEventListener("keydown", gameControl);

        // alert("Game over");
        console.log("Game over");


    }


}

window.onload = () => {

}



// let theme = new Sounds("./sound/theme-sound.mp3")
// theme.audio.play();
// window.addEventListener("DOMContentLoaded", sound);
let tetris = new Sounds("./sound/tetris.mp3");

// window.addEventListener("mousemove", sound)
function sound() {
    // themeSound.play();
    console.log("Playsound");
    tetris.play();
    tetris.sound.loop = true;
    tetris.sound.DOMContentLoaded = () => {
    }
    // body.appendChild("audio");
}
sound();







