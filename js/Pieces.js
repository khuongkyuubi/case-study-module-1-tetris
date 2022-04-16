class Pieces {
    constructor(testromino, color) {
        this.testromino = testromino; // tên của mảng chứa hình (Z, O,..)
        this.color = color; // màu sắc của hình

        // this.testrominoN = 0; // vị trí bắt đầu bằng 0
        this.testrominoN = Math.floor(Math.random() * this.testromino.length);
        // console.log("index" + (this.testrominoN))// vị trí bắt đầu random
        this.activeTestromino = this.testromino[this.testrominoN]; // cũng là mảng, nhưng chứa phần tử testtromino đang được chọn để hiển thị

        this.x = this.getXAtBegin();
        // this.x = Math.floor((cols- this.testromino[0].length)/2); // tọa độ điểm bắt đầu vẽ
        // console.log(this.x)
        // this.y = this.testromino === O ?-3 : -this.testromino.length+1; // y = -2 để vẽ hình ngoài canvas
        // this.y = -this.testromino[this.testrominoN].length; // y = -2 để vẽ hình ngoài canvas
        this.y = this.getYAtBegin(); // y = -2 để vẽ hình ngoài canvas

    }

    getYAtBegin() {
        let yAtBegin = -this.activeTestromino.length
        let l = this.activeTestromino.length;
        let thisOne = this.testromino[this.testrominoN];
        let flag = true;
        for (let k = 0; k < thisOne[l - 1].length; k++) {
            if (thisOne[l - 1][k]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            yAtBegin++
        }
        return yAtBegin;
    }

    getXAtBegin() {
        let xAtBegin;
        if (this.activeTestromino.length % 2 && this.testromino !== T && this.testromino !== L) {
            xAtBegin = Math.floor((cols - this.testromino[0].length) / 2) + 1;
        } else {
            xAtBegin = Math.floor((cols - this.testromino[0].length) / 2);
        }

        return xAtBegin;


    }


    fill(color) {
        // duyệt qua mảng đang chứa khối hình đang vẽ
        for (let i = 0; i < this.activeTestromino.length; i++) {
            for (let j = 0; j < this.activeTestromino.length; j++) {
                // trường hợp phần tử có giá trị (tức == 1) thí mới vẽ
                if (this.activeTestromino[i][j]) {
                    drawCell(this.x + j, this.y + i, color)
                }
            }
        }
    }

    draw() {
        this.fill(this.color);
        // console.log(this.testrominoN);
        // console.log(this.activeTestromino);
        // console.log("y hien tai " + this.y);


    }

    unDraw() {
        this.fill(COLOR);
    }

    moveDown() {
        // va chạm thì di chuyển
        if (!this.collision(0, 1, this.activeTestromino)) {
            this.unDraw();
            this.y++;
            // console.log(this.y);
            this.draw();
            // console.log("this index" + this.testrominoN)
        }
        // không va chạm thì khóa chuyển động
        else {
            // sau khi khóa chuyển động thì tạo ra 1 hình mới
            this.stopMove();
            p = randomPiece();

        }
    }


    moveSound(){
        let move = new Sounds("./sound/move.mp3");
        move.sound.autoplay = false;
        // clear.play();
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


    moveFollowMouse(index) {


        if (!this.collision(1, 0, this.activeTestromino) && index < cols - 3) {
            this.unDraw();
            this.x = index;
            this.draw();
        }

    }

    stopMove() {
        for (let i = 0; i < this.activeTestromino.length; i++) {
            for (let j = 0; j < this.activeTestromino.length; j++) {
                // trường hợp phần tử có giá trị (tức == 1) thí mới vẽ
                // nếu ô được duyệt không có dữ liệu thì bỏ qua
                if (this.activeTestromino[i][j]) {
                    // so sánh vị trí hiện tạo với cạnh trên
                    if (this.y + i < 0) {
                        gameOver = true;
                        let lose = new Sounds("./sound/game-over.mp3");
                        lose.play();
                        tetris.stop();
                        break;

                    } else {
                        board[this.y + i][this.x + j] = this.color;

                    }
                }
            }
        }
        // Tính điểm cho game

        for (let i = 0; i < rows; i++) {
            let isFull = true;
            for (let j = 0; j < cols; j++) {
                // nếu mà các hàng đều có màu thì isFull là true
                isFull = isFull && (board[i][j] !== COLOR);
            }
            // nếu các hàng đều có màu
            // Đẩy các hàng ở trên hàng đấy xuống là xong (lúc này hàng trên sẽ bị trống), phải tạo 1 hàng mới cáu màu trắng ở trên đỉnh của gam board
            if (isFull) {
                clearInterval(interval);
                let clear = new Sounds("./sound/clear.mp3");
                clear.sound.autoplay = false;
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

        setTimeout(()=>{drawBoard();},100);

        document.getElementById("score").innerText = score;


    }

    // Xoay hình
    rotate() {
        // lấy ra hình kế tiếp để test
        let rotate = new Sounds("./sound/rotate.mp3");
        rotate.play();

        let nextIndex = (this.testrominoN + 1) % this.testromino.length;
        let nextPattern = this.testromino[nextIndex];
        let move = 0; // bước chuyển trong trường hợp hình tới bị va chạm
        // Kiểm tra xem cái hình có index là next Pattern có va chạm hay không
        this.unDraw();
        if (this.collision(0, 0, nextPattern)) {
            // trường hợp hình tới nextPattern bị va chạm
            if (this.x > cols / 2) {
                // nếu tọa độ x đang ở bên góc phải

                if (this.testrominoN === 3) {
                    move = -1;
                }
                if (this.testromino === I && board[this.y + 3][cols - 1]) {
                    move -= 1;

                }
            } else {
                // nếu hình đang ở bên góc trái

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

// check va chạm
    collision(x, y, piece) {
        // x giá trị dịch chuyển theo chiều x (bước dịch chuyển)
        // y giá trị dịch chuyển theo chiều y (bước dịch chuyển)
        // piece chính là hình (mảng hình )
        let bounce = new Sounds("./sound/bounce.mp3");
        bounce.sound.autoplay = false;

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece.length; j++) {
                if (!piece[i][j]) {
                    // bỏ qua nếu vị trí đó k có giá trị
                    continue;
                }
                let newX = this.x + j + x; // tọa độ X của 1 ô (có màu)
                let newY = this.y + i + y; // Tọa độ Y mới của 1 ô (có màu)

                if (newX < 0 || newX >= cols /*|| newY >= rows*/) {
                    return true;
                }
                if( newY >= rows) {
                    clearInterval(interval);
                    bounce.play();
                    return true;
                }

                if (newY < 0) {
                    continue;
                }

                // xử lý khi va chạm với hình khác
                if (board[newY][newX] !== COLOR) {
                    bounce.play();
                    clearInterval(interval);
                    // nếu trong bảng có màu khác màu nền (color), có nghĩa là có hình, tính là va chạm
                    return true
                }
            }
        }
        // không vi phạm các trường hợp trên có nghĩa là chưa v chạm
        return false;

    }

}