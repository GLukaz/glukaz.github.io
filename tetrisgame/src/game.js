class Game extends Phaser.Scene {
    _grid = [];

    _gridWidth = 16;
    _gridHeight = 10;

    _gridCenterX = config.width / 2;
    _gridCenterY = config.height / 2 + 100;

    _gridPosX;
    _gridPosY;

    _tileSize = 50;

    _bigBox
    _smallBox
    _letter
    _allPieces = [];

    _currentPieces = [];

    _current;

    _timer = 1000;
    _delay = 300;

    _freezePieces = [];

    _moving = false;

    _bg;
    _ground;
    _lastPiecesDown = [];

    _isGameOver = false;

    _btnUsePiece;
    _btnOtherPiece;

    _isSpawningAllowed = true;

    _score = 0;


    constructor() {
        super('game');
    }

    preload() {
        //this.load.image('grid', 'assets/images/grid.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('btn_use_piece', 'assets/images/btn_usar_pieza.png');
        this.load.image('btn_other_piece', 'assets/images/btn_otra_pieza.png');
        this.load.image('bg', 'assets/images/fondo_tablero_800x600.png');
        this.load.image('letter', 'assets/images/sobre_100x100.png');
        this.load.image('small_box', 'assets/images/caja_100x300.png');
        this.load.image('big_box', 'assets/images/caja_200x200.png');

        this.load.audio('click','assets/sounds/Mountain_Audio_8.mp3')
    }

    create() {
        this.createGrid();
        this.createPieces();

        this._bg = this.add.image(this._gridCenterX, this._gridCenterY, 'bg').setOrigin(0.5);
        this._bg.setDisplaySize(this._gridWidth * this._tileSize, this._gridHeight * this._tileSize);


        this._ground = this.add.image(this._gridCenterX, this._gridPosY + (this._gridHeight * this._tileSize), 'ground').setOrigin(0.5, 0);
        this._ground.setDisplaySize(this._gridWidth * this._tileSize, 25);

        // this.drawGrid();

        this._sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this._leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this._rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this._downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);


        this._btnOtherPiece = this.add.image(this._gridCenterX - 200, 150, 'btn_other_piece').setScale(0.35).setOrigin(0.5);        
        this._btnUsePiece = this.add.image(this._gridCenterX + 200, 150, 'btn_use_piece').setScale(0.35).setOrigin(0.5);

        this._previewPiece = this.add.image(this._gridCenterX , 150, this._currentPieces[this._currentPieces.length - 1].boxType).setScale(0.5).setOrigin(0.5);

        this._btnUsePiece.setInteractive();
        this._btnUsePiece.on("pointerdown", ()=>{
            if(this._isSpawningAllowed){
                this.sound.play('click');
                this.spawnPiece();
                this._isSpawningAllowed = false;
                this._btnUsePiece.setVisible(false);
                this._btnOtherPiece.setVisible(false);
                this._previewPiece.setVisible(false);

            }
        });

        this._btnOtherPiece.setInteractive();
        this._btnOtherPiece.on("pointerdown", ()=>{
            if(this._isSpawningAllowed){
                this.sound.play('click');
                //discard piece
                this._currentPieces.pop();

                if(this._currentPieces.length > 1)
                    //show other piece
                    this._previewPiece.setTexture(this._currentPieces[this._currentPieces.length - 1].boxType);
                else
                    this.gameOver();
                
            }
        });
    }

    createPieces = function () {
        this._bigBox = {};
        this._smallBox = {};
        this._letter = {};

        this._bigBox.rectPiece = new Phaser.Geom.Rectangle(0, 0, this._tileSize * 2, this._tileSize * 2);
        this._smallBox.rectPiece = new Phaser.Geom.Rectangle(0, 0, this._tileSize, this._tileSize * 3);
        this._letter.rectPiece = new Phaser.Geom.Rectangle(0, 0, this._tileSize, this._tileSize);

        this._bigBox.boxType = 'big_box';
        this._smallBox.boxType = 'small_box';
        this._letter.boxType = 'letter';

        this._allPieces = [this._bigBox, this._smallBox, this._letter];

        for (let i = 0; i < 9; i++) {
            this._currentPieces.push(this._allPieces[0]);
            this._currentPieces.push(this._allPieces[1]);
            this._currentPieces.push(this._allPieces[2]);
        }

        Phaser.Utils.Array.Shuffle(this._currentPieces);
    }

    createGrid = function () {

        this._gridPosX = this._gridCenterX - (this._tileSize * this._gridWidth / 2);
        this._gridPosY = this._gridCenterY - (this._tileSize * this._gridHeight / 2);

        for (var i = 0; i < this._gridHeight; i++) {
            this._grid[i] = [];

            for (var j = 0; j < this._gridWidth; j++) {
                this._grid[i][j] = 0;
            }
        }
    }


    drawGrid = function () {
        this._grid.forEach((y, yIndex) => {
            y.forEach((x, xIndex) => {
                this.add.image(this._gridPosX + xIndex * this._tileSize, this._gridPosY + yIndex * this._tileSize, 'grid')
                    .setOrigin(0)
                    .setAlpha(0.2)
                    .setDisplaySize(this._tileSize, this._tileSize);
            });
        });
    }

    getRotatedWidth(piece) {
        if (piece.angle == 90 || piece.angle == -90)
            return piece.displayHeight;
        else
            return piece.displayWidth;
    }

    getRotatedHeight(piece) {
        if (piece.angle == 90 || piece.angle == -90)
            return piece.displayWidth;
        else
            return piece.displayHeight;
    }

    moveDown = (mute = false) => {
        if(!mute && window.parent.audio_clic)
            window.parent.audio_clic.play();
        if (!this.freeze())
            this._current.y += this._tileSize;
    }

    isFreezeCollisionRotation = function (piece) {
        piece.angle += 90;

        let freeze = this.isFreezeCollisionDown(piece);
        let colGridLeft = piece.x - (this.getRotatedWidth(piece) / 2) < this._gridPosX;
        let colGridRight = piece.x + (this.getRotatedWidth(piece) / 2) > this._gridPosX + (this._gridWidth * this._tileSize);
        let colGridBottom = piece.y + (this.getRotatedHeight(piece) / 2) > this._gridPosY + (this._gridHeight * this._tileSize);

        piece.angle -= 90;

        return freeze || colGridLeft || colGridRight || colGridBottom;
    }

    isFreezeCollisionDown = function (piece) {
        this._lastPiecesDown = []; /** clear the last pieces collision */
        let nextY = piece.y + (this.getRotatedHeight(piece) / 2);
        let y = piece.y + (this.getRotatedHeight(piece) / 2);
        /** Store the pieces that collided down with the last piece */
        this._lastPiecesDown = this._freezePieces.filter((element) => {
            let elementTop = element.y - (this.getRotatedHeight(element) / 2);
            let elementBottom = element.y + (this.getRotatedHeight(element) / 2);
            let elementLeft = element.x - (this.getRotatedWidth(element) / 2);
            let elementRight = element.x + (this.getRotatedWidth(element) / 2);
            let pieceLeft = piece.x - (this.getRotatedWidth(piece) / 2);
            let pieceRight = piece.x + (this.getRotatedWidth(piece) / 2);
            let colisionDown = nextY >= elementTop && y <= elementBottom && elementRight > pieceLeft && elementLeft < pieceRight;

            return colisionDown;
        });

        return this._lastPiecesDown.length > 0;
    }

    isFreezeCollisionRight = function (piece) {
        let nextX = piece.x + (this.getRotatedWidth(piece) / 2) + this._tileSize;
        let x = piece.x + (this.getRotatedWidth(piece) / 2);
        return this._freezePieces.some((element) => {
            let elementBottom = element.y + (this.getRotatedHeight(element) / 2);
            let elementTop = element.y - (this.getRotatedHeight(element) / 2);
            let elementLeft = element.x - (this.getRotatedWidth(element) / 2);
            let elementRight = element.x + (this.getRotatedWidth(element) / 2);
            let pieceBottom = piece.y + (this.getRotatedHeight(piece) / 2);
            let pieceTop = piece.y - (this.getRotatedHeight(piece) / 2);
            return nextX <= elementRight && x >= elementLeft && elementTop < pieceBottom && elementBottom > pieceTop;
        });
    }

    isFreezeCollisionLeft = function (piece) {
        let nextX = piece.x - (this.getRotatedWidth(piece) / 2) - this._tileSize;
        let x = piece.x - (this.getRotatedWidth(piece) / 2);
        return this._freezePieces.some((element) => {
            let elementBottom = element.y + (this.getRotatedHeight(element) / 2);
            let elementTop = element.y - (this.getRotatedHeight(element) / 2);
            let elementLeft = element.x - (this.getRotatedWidth(element) / 2);
            let elementRight = element.x + (this.getRotatedWidth(element) / 2);
            let pieceBottom = piece.y + (this.getRotatedHeight(piece) / 2);
            let pieceTop = piece.y - (this.getRotatedHeight(piece) / 2);
            return nextX >= elementLeft && x <= elementRight && elementTop < pieceBottom && elementBottom > pieceTop;
        });
    }

    gameOver() {
        console.log("Game Over :(");
        console.log("score: ",this._score);
        this._isGameOver = true;
        this._btnUsePiece.setVisible(false);
        this._btnOtherPiece.setVisible(false);
        this._previewPiece.setVisible(false);
        if(window.parent.modal_resultado)
            window.parent.modal_resultado(this._score);
    }

    gameWin(){
        console.log("Game Win!");
        console.log("score: ",this._score);
        this._isGameOver = true;
        this._btnUsePiece.setVisible(false);
        this._btnOtherPiece.setVisible(false);
        this._previewPiece.setVisible(false);
        if(window.parent.modal_resultado)
            window.parent.modal_resultado(this._score);    
    }

    checkGameOver(piece) {
        let top = piece.y - (this.getRotatedHeight(piece) / 2);
        let pieceOnTop = top < this._gridPosY;

        let pieceOverLetter = piece.boxType != "letter" && this._lastPiecesDown.some((last) => {
            return last.boxType == "letter";
        });

        return pieceOnTop || pieceOverLetter;
    }

    freeze = function () {
        let nextY = this._current.y + (this.getRotatedHeight(this._current) / 2) + this._tileSize;
        let gridBottom = this._gridPosY + (this._gridHeight * this._tileSize);
        if (nextY > gridBottom || this.isFreezeCollisionDown(this._current)) {
            this._freezePieces.push(this._current);
            if (this.checkGameOver(this._current))
                this.gameOver();
            else{
                this._score += 10;
                this._isSpawningAllowed= true;                
                this._btnUsePiece.setVisible(true);
                this._btnOtherPiece.setVisible(true);
                this._previewPiece.setVisible(true);
                if(this._currentPieces.length > 1)                    
                    //show the next preview
                    this._previewPiece.setTexture(this._currentPieces[this._currentPieces.length - 1].boxType);
                else
                    this.gameWin();

            }
            return true;
        }
        return false;

    }
    spawnPiece = () => {
        this._current = this._currentPieces.pop();

        let piece = this._current.boxType;
        let rectangle = this._current.rectPiece;

        this._current = this.add.image(this._gridPosX + this._current.rectPiece.width / 2, this._gridPosY + (this._current.rectPiece.height / 2) - this._current.rectPiece.height, this._current.boxType)
            .setOrigin(0.5)
            .setDisplaySize(this._current.rectPiece.width, this._current.rectPiece.height);

        this._current.rotatePiece = () => {
            if(window.parent.audio_clic)
                window.parent.audio_clic.play();
            if (!this.isFreezeCollisionRotation(this._current))
                this._current.angle += 90;
        }

        this._current.boxType = piece;
        this._current.rectPiece = rectangle;

        console.log(this._current.x, this._current.y, this._current.boxType);

        let divRight = parent.document.getElementById('parent_btn_inicia_mueve_der');
        if(divRight)
            divRight.onclick = this.moveRight;

        let divLeft = parent.document.getElementById('parent_btn_inicia_mueve_izq');
        if(divLeft)
            divLeft.onclick = this.moveLeft;

        let divDown = parent.document.getElementById('parent_btn_inicia_mueve_abajo');
        if(divDown)
            divDown.onclick = this.moveDown;
        
        let divRotate = parent.document.getElementById('parent_btn_inicia_rotar');
        if(divRotate)
            divRotate.onclick = this._current.rotatePiece;

        console.log("divRight: ", divRight);
        

    }

    moveLeft = () => {
        if(window.parent.audio_clic)
            window.parent.audio_clic.play();
        if (this._current.x - (this.getRotatedWidth(this._current) / 2) - this._tileSize >= this._gridPosX &&
            !this.isFreezeCollisionLeft(this._current))
            this._current.x -= this._tileSize;

    }

    moveRight = () => {
        if(window.parent.audio_clic)
            window.parent.audio_clic.play();
        if (this._current.x + (this.getRotatedWidth(this._current) / 2) + this._tileSize <= this._gridPosX + (this._gridWidth * this._tileSize) &&
            !this.isFreezeCollisionRight(this._current))
            this._current.x += this._tileSize;
    }

    update(time, delta) {
        if (this._isGameOver || this._isSpawningAllowed)
            return;
        this._delay -= delta;
        this._timer -= delta;

        if (this._delay < 0) {
            if (this._sKey.isDown) {
                this._current.rotatePiece();
                this._delay = 300;
                return;
            }
            else if (this._leftKey.isDown) {
                this.moveLeft();
                this._delay = 100;
                return;
            }
            else if (this._rightKey.isDown) {
                this.moveRight();
                this._delay = 100;
                return;
            }
            else if (this._downKey.isDown) {
                this.moveDown();
                this._delay = 100;
                return;
            }
        }



        if (this._timer < 0) {
            this._timer = 1000;
            this.moveDown(true);
            return;
        }
    }
}


const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    //backgroundColor: '#f5de00',
    transparent:true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    width: 900,
    height: 800,
    scene: Game
};

const game = new Phaser.Game(config);