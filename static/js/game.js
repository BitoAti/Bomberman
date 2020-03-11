var objDiv = null;
var gameArea = document.getElementById("game-area");
var player = document.getElementById("image");
var gameAreaWidth = gameArea.offsetWidth;
player.style.width = (gameAreaWidth / 51).toString() + "px";
player.style.height = (gameAreaWidth / 51).toString() + "px";
gameArea.style.height = (player.offsetWidth * 25).toString();
var gameAreaHeight = gameArea.offsetHeight;
var playerWidth = player.offsetWidth;
var playerHeight = player.offsetHeight;
let freeCoordinateToMove = []
let forbiddenCoordinate = []


// getBoundingClientRect()


// ------------------------Movement---------------------------//
function getKeyAndMove(e) {
    var key_code = e.which || e.keyCode;
    switch (key_code) {
        case 37: //left arrow key
            moveLeft();
            break;
        case 38: //Up arrow key
            moveUp();
            break;
        case 39: //right arrow key
            moveRight();
            break;
        case 40: //down arrow key
            moveDown();
            break;
        case 32: //space down
            createBomb();
            break;
    }
}


function moveLeft() {
    if (objDiv.style.left !== '0px' && checkCoordinate(objDiv.style.left, objDiv.style.top, "left") === true) {
        objDiv.style.left = parseInt(objDiv.style.left) - 5 + 'px';
    }
}

function moveUp() {
    if (objDiv.style.top !== '0px' && checkCoordinate(objDiv.style.left, objDiv.style.top, "up") === true) {
        objDiv.style.top = parseInt(objDiv.style.top) - 5 + 'px';
    }

}

function moveRight() {
    if (objDiv.style.left !== countGameAreaSize(gameAreaWidth) && checkCoordinate(objDiv.style.left, objDiv.style.top, "right") === true) {
        objDiv.style.left = parseInt(objDiv.style.left) + 5 + 'px';
    }

}

function moveDown() {
    if (objDiv.style.top !== countGameAreaSize(gameAreaHeight) && checkCoordinate(objDiv.style.left, objDiv.style.top, "down") === true) {
        objDiv.style.top = parseInt(objDiv.style.top) + 5 + 'px';
    }

}

// --------------------Game elements--------------------------//
function saveFreeToMoveCoordinate() {

    for (let i = 0; i < gameAreaWidth / playerWidth; i++) {
        for (let n = 0; n < gameAreaHeight / playerHeight; n++) {
            let coordinate = (i * 20).toString() + "-" + (n * 20).toString()
            freeCoordinateToMove.push(coordinate)
        }
    }
}

function createBomb() {
    const gameArea = document.getElementById("game-area");
    const bomb = document.createElement("div");
    bomb.classList.add("bomb");
    bomb.style.left = setBombCoordinate(objDiv.style.left);
    bomb.style.top = setBombCoordinate(objDiv.style.top);
    gameArea.appendChild(bomb)
}

function setBombCoordinate(playerCoordinate) {
    let num = parseInt(playerCoordinate.slice(0, -2));
    return (num + 8).toString() + "px";
}

function placeTombs() {
    let basePxWidth = playerWidth + 8;
    let basePxHeight = playerHeight + 8;
    for (let row = 0; row < (gameAreaWidth - playerWidth) / (2 * playerWidth); row++) {
        for (let column = 0; column < (gameAreaHeight - playerHeight) / (2 * playerHeight); column++) {
            let tomb = createTomb();
            tomb.style.width = playerWidth.toString() + "px";
            tomb.style.height = playerWidth.toString() + "px";
            tomb.style.top = (column * 2 * playerHeight + basePxWidth).toString() + "px";
            tomb.style.left = (row * 2 * playerWidth + basePxHeight).toString() + "px";
            saveTakenCoordinate(column * 2 * playerHeight + basePxHeight - 8, row * 2 * playerWidth + basePxWidth - 8)
            tomb.classList.add("tomb");
            gameArea.appendChild(tomb)
        }
    }
}

function createTomb() {
    let tomb = document.createElement("div");
    tomb.classList.add("tomb");
    return tomb
}

function countGameAreaSize(size) {
    return (size - playerHeight).toString() + "px";
}


function saveTakenCoordinate(height, width) {
    let coordinate = width.toString() + "-" + height.toString()
    // let indexOfItem = freeCoordinateToMove.indexOf(coordinate)
    // freeCoordinateToMove.splice(indexOfItem, 1);
    forbiddenCoordinate.push(coordinate)

}

function checkCoordinate(left, top, directionOfMove) {
    if (directionOfMove === "left") {
        let string = (parseInt(left.slice(0, -2)) - 20).toString() + "-" + (parseInt(top.slice(0, -2))).toString()
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    } else if (directionOfMove === "right") {
        let string = (parseInt(left.slice(0, -2)) + 20).toString() + "-" + (parseInt(top.slice(0, -2))).toString()
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    } else if (directionOfMove === "down") {
        let string = (parseInt(left.slice(0, -2))).toString() + "-" + (parseInt(top.slice(0, -2)) + 20).toString()
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    } else if (directionOfMove === "up") {
        let string = (parseInt(left.slice(0, -2))).toString() + "-" + (parseInt(top.slice(0, -2)) - 20).toString()
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    }
}


function init() {
    objDiv = document.getElementById("image");
    objDiv.style.position = 'relative';
    objDiv.style.left = '0px';
    objDiv.style.top = '0px';
    saveFreeToMoveCoordinate()
    placeTombs()

}


window.onload = init;