var objDiv = null;
var gameArea = document.getElementById("game-area");
var player = document.getElementById("image");
gameArea.style.width = (player.offsetWidth * 25).toString() + "px";
var gameAreaWidth = gameArea.offsetWidth;
gameArea.style.height = (player.offsetWidth * 13).toString();
var gameAreaHeight = gameArea.offsetHeight;
var playerWidth = player.offsetWidth;
var playerHeight = player.offsetHeight;
let freeCoordinateToMove = [];
let forbiddenCoordinate = [];


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
        objDiv.style.left = parseInt(objDiv.style.left) - 10 + 'px';
    }
}

function moveUp() {
    if (objDiv.style.top !== '0px' && checkCoordinate(objDiv.style.left, objDiv.style.top, "up") === true) {
        objDiv.style.top = parseInt(objDiv.style.top) - 10 + 'px';
    }

}

function moveRight() {
    if (objDiv.style.left !== countGameAreaSize(gameAreaWidth) && checkCoordinate(objDiv.style.left, objDiv.style.top, "right") === true) {
        objDiv.style.left = parseInt(objDiv.style.left) + 10 + 'px';
    }

}

function moveDown() {
    if (objDiv.style.top !== countGameAreaSize(gameAreaHeight) && checkCoordinate(objDiv.style.left, objDiv.style.top, "down") === true) {
        objDiv.style.top = parseInt(objDiv.style.top) + 10 + 'px';
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

function createFire(left, top) {

}

function getBombCoordinate(left,top) {
    let list = [];
    console.log(typeof(left), typeof(top))
    if(left%20 !== 0){
        list.push(left + 10);
        list.push(top);
    }
    else if(top % 20 !== 0){
        list.push(left);
        list.push(top + 10);
    }

    else {
        list.push(left);
        list.push(top);
    }
    return list
}

function createBomb() {
    const gameArea = document.getElementById("game-area");
    var bomb = document.createElement("div");
    bomb.innerHTML = `<img src="/static/images/bomb.png" alt="bomb" width="20px" height="20px">`;
    bomb.classList.add("bomb");
    let newcoord = getBombCoordinate(parseInt(objDiv.style.left.slice(0, -2)),parseInt(objDiv.style.top.slice(0, -2)));
    bomb.style.left = setBombCoordinate(newcoord[0]);
    bomb.style.top = setBombCoordinate(newcoord[1]);
    gameArea.appendChild(bomb);
    let coordinate = bomb.style.left.slice(0, -2) + '-' + bomb.style.top.slice(0, -2);
    forbiddenCoordinate.push(coordinate);

    setTimeout(function deleteBomb() {
        createFire(bomb.style.left, bomb.style.top);
        bomb.remove();
        forbiddenCoordinate.pop(coordinate);
    }, 2000)


}

function setBombCoordinate(playerCoordinate) {
    return (playerCoordinate).toString() + "px";
}

function placeTombs() {
    let basePxWidth = playerWidth + 8;
    let basePxHeight = playerHeight + 8;
    for (let row = 0; row < (gameAreaWidth - playerWidth) / (2 * playerWidth); row++) {
        for (let column = 0; column < (gameAreaHeight - playerHeight) / (2 * playerHeight); column++) {
            let tomb = createTomb();
            tomb.innerHTML = `<img src="/static/images/tomb.png" alt="player" width="20px" height="20px">`;
            tomb.style.width = playerWidth.toString() + "px";
            tomb.style.height = playerWidth.toString() + "px";
            tomb.style.top = (column * 2 * playerHeight + 20).toString() + "px";
            tomb.style.left = (row * 2 * playerWidth + 20).toString() + "px";
            saveTakenCoordinate(column * 2 * playerHeight + basePxHeight - 8, row * 2 * playerWidth + basePxWidth - 8);
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
    let coordinate = width.toString() + "-" + height.toString();
    forbiddenCoordinate.push(coordinate);
    let coordinate1 = (width - 10).toString() + "-" + height.toString();
    forbiddenCoordinate.push(coordinate1);
    let coordinate2 = (width - 10).toString() + "-" + (height - 10).toString();
    forbiddenCoordinate.push(coordinate2);
    let coordinate3 = (width - 10).toString() + "-" + (height + 10).toString();
    forbiddenCoordinate.push(coordinate3);
    let coordinate4 = width.toString() + "-" + (height - 10).toString();
    forbiddenCoordinate.push(coordinate4);
    let coordinate5 = width.toString() + "-" + (height + 10).toString();
    forbiddenCoordinate.push(coordinate5);
    let coordinate6 = (width + 10).toString() + "-" + (height - 10).toString();
    forbiddenCoordinate.push(coordinate6);
    let coordinate7 = (width + 10).toString() + "-" + (height + 10).toString();
    forbiddenCoordinate.push(coordinate7);
    let coordinate8 = (width + 10).toString() + "-" + height.toString();
    forbiddenCoordinate.push(coordinate8);

    // let indexOfItem = freeCoordinateToMove.indexOf(coordinate)
    // freeCoordinateToMove.splice(indexOfItem, 1);

}

function checkCoordinate(left, top, directionOfMove) {
    if (directionOfMove === "left") {
        let string = (parseInt(left.slice(0, -2)) - 20).toString() + "-" + (parseInt(top.slice(0, -2))).toString();
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    } else if (directionOfMove === "right") {
        let string = (parseInt(left.slice(0, -2)) + 20).toString() + "-" + (parseInt(top.slice(0, -2))).toString();
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    } else if (directionOfMove === "down") {
        let string = (parseInt(left.slice(0, -2))).toString() + "-" + (parseInt(top.slice(0, -2)) + 20).toString();
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    } else if (directionOfMove === "up") {
        let string = (parseInt(left.slice(0, -2))).toString() + "-" + (parseInt(top.slice(0, -2)) - 20).toString();
        if (forbiddenCoordinate.indexOf(string) !== -1) {
            return false
        } else {
            return true
        }
    }
}


function init() {
    objDiv = document.getElementById("image");
    objDiv.innerHTML = `<img src="/static/images/Bman_F_f00.png" alt="player" width="20px" height="20px">`;
    objDiv.style.position = 'relative';
    objDiv.style.left = '0px';
    objDiv.style.top = '0px';
    saveFreeToMoveCoordinate();
    console.log(forbiddenCoordinate);
    placeTombs()

}


window.onload = init;