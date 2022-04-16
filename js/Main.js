let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let cellSize = 30; // 30x30
let rows = 20;
let cols = 10;
let color =  "white";
let lineColor = "#ccc";

let cW = canvas.width = cellSize * cols; // 300
let cH = canvas.height = cellSize * rows; // 600

// ctx.beginPath();
// ctx.moveTo(0,0);
// ctx.lineWidth =2;
/*

for (let i = 1; i < rows; i++) {
    ctx.moveTo(0,cellSize*i);
    ctx.lineTo(cW, cellSize*i);
    ctx.stroke();

}
for (let i = 1; i < cols; i++) {
    ctx.moveTo(cellSize*i, 0);
    ctx.lineTo( cellSize*i,cH);
    ctx.stroke();
}
*/

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
        board[i][j] = color;
    }
}
console.log(board);
drawCell(19,9, "blue" );
function drawBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            drawCell(j,i, board[j][i] );
        }
    }
}
drawBoard();



