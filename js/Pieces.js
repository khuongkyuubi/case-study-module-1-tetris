class Pieces {
    constructor(testromino, color) {
        this.testromino = testromino;
        this.color = color;
        this.testrominoN = Math.floor(Math.random() * this.testromino.length);
        this.activeTestromino = this.testromino[this.testrominoN];
        this.x = 3;
        this.y = this.getYAtBegin(); // y = -2 để vẽ hình ngoài canvas
    }

    getYAtBegin() {
        let length = this.activeTestromino.length;
        for (let i = length - 1; i >= 0; i--) {
            for (let j = 0; j < length; j++) {
                if (this.activeTestromino[i][j]) {
                    return -(i + 1); // i: index của mảng có giá trị cuối cùng trong hình (đáy của hình)
                }
            }
        }
    }

    fill(color) {
        for (let i = 0; i < this.activeTestromino.length; i++) {
            for (let j = 0; j < this.activeTestromino.length; j++) {
                if (this.activeTestromino[i][j]) {
                    drawCell(this.x + j, this.y + i, color)
                }
            }
        }
    }

    draw() {
        this.fill(this.color);
    }

    unDraw() {
        this.fill(COLOR);
    }

    // Check va chạm
    collision(x, y, piece) {
        let newX; // tọa độ x của 1 ô có màu trong mảng hình
        let newY; // tọa độ y của 1 ô có màu trong mảng hình
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece.length; j++) {
                if (!piece[i][j]) {
                    continue;
                }
                newX = this.x + j + x;
                newY = this.y + i + y;

                if (newX < 0 || newX >= cols) {
                    return true;
                }
                if (newY >= rows) {
                    clearInterval(interval2);
                    bounce.play();
                    return true;
                }

                if (newY < 0) {
                    continue;
                }

                // Xử lý khi va chạm với hình khác
                if (board[newY][newX] !== COLOR) {
                    bounce.play();
                    clearInterval(interval2);
                    return true
                }
            }
        }
        return false;

    }

    moveDown() {
        if (!this.collision(0, 1, this.activeTestromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.stopMove();
            p = randomPiece();

        }
    }

    moveSound() {
        return move;
    }

    moveLeft() {
        if (!this.collision(-1, 0, this.activeTestromino)) {
            this.unDraw();
            this.x--;
            this.draw();
            this.moveSound().play();
        }
    }

    moveRight() {
        if (!this.collision(1, 0, this.activeTestromino)) {
            this.unDraw();
            this.x++;
            this.draw();
            this.moveSound().play();
        }
    }


    rotate() {
        rotate.play();
        let nextIndex = (this.testrominoN + 1) % this.testromino.length;
        let nextPattern = this.testromino[nextIndex];
        let move = 0; // Bước chuyển trong trường hợp hình tới bị va chạm
        this.unDraw();
        if (this.collision(0, 0, nextPattern)) {
            if (this.x > cols / 2) {
                if (this.testrominoN === 3) {
                    move = -1;
                }
                if (this.testromino === I && board[this.y + 3][cols - 1]) {
                    move -= 1;
                }
            } else {
                if (this.testrominoN === 1) {
                    move = +1;
                }
                if (this.testromino === I && board[this.y + 3][0]) {
                    move += 1;
                }
            }
        }
        this.x += move;
        this.testrominoN = nextIndex;
        this.activeTestromino = this.testromino[this.testrominoN];
        this.draw();
    }

    stopMove() {
        for (let i = 0; i < this.activeTestromino.length; i++) {
            for (let j = 0; j < this.activeTestromino.length; j++) {
                if (this.activeTestromino[i][j]) {
                    if (this.y + i < 0) {
                        gameOver = true;
                        tetris.stop();
                        lose.play();
                        break;

                    } else {
                        board[this.y + i][this.x + j] = this.color;
                    }
                }
            }
        }

        // Tính điểm cho game
        let isFull = false;
        for (let i = 0; i < rows; i++) {
            isFull = true;
            for (let j = 0; j < cols; j++) {
                isFull = isFull && (board[i][j] !== COLOR);
                if (!isFull) {
                    break;
                }
            }
            if (isFull) {
                clearInterval(interval2);
                clear.play();
                for (let y = i; y > 1; y--) {
                    for (let j = 0; j < cols; j++) {
                        board[y][j] = board[y - 1][j];
                    }
                }
                for (let c = 0; c < cols; c++) {
                    board[0][c] = COLOR;
                }
                score += 10;
            }
        }
        setTimeout(() => {
            drawBoard();
        }, 100);
        if (maxScore < score) {
            maxScore = score;
            localStorage.setItem("maxScore", `${maxScore}`);
        }
        document.getElementById("score").innerText = score;
        checkMaxScore();
    }
}