var objDiv = null;
var gameArea = document.getElementById("game-area");
var player = document.getElementById("image");
var widthNum = 25;
var heightNum = 13;
gameArea.style.width = (player.offsetWidth * widthNum).toString() + "px";
var gameAreaWidth = gameArea.offsetWidth;
gameArea.style.height = (player.offsetWidth * heightNum).toString();
var gameAreaHeight = gameArea.offsetHeight;
var playerWidth = player.offsetWidth;
var playerHeight = player.offsetHeight;
let freeCoordinateToMove = [];
let forbiddenCoordinate = [];
let walls = [];


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

function moveUp() {
    if (objDiv.style.top !== '0px' && checkCoordinate(objDiv.style.left, objDiv.style.top, "up") === true) {
        objDiv.style.top = parseInt(objDiv.style.top) - 10 + 'px';
    }

}


// --------------------Game elements--------------------------//
function saveFreeToMoveCoordinate() {
    for (let i = 0; i < gameAreaWidth / playerWidth; i++) {
        for (let n = 0; n < gameAreaHeight / playerHeight; n++) {
            let coordinate = (i * 20).toString() + "-" + (n * 20).toString();
            freeCoordinateToMove.push(coordinate)
        }
    }
}

function createFire(left, top) {
    let leftCoordinate = parseInt(left.slice(0, -2));
    let topCoordinate = parseInt(top.slice(0, -2));
    let centerCoordinateToCheck = leftCoordinate.toString() + "-" + topCoordinate.toString();
    let rightCoordinateToCheck = (leftCoordinate + 20).toString() + "-" + topCoordinate.toString();
    let leftCoordinateToCheck = (leftCoordinate - 20).toString() + "-" + topCoordinate.toString();
    let topCoordinateToCheck = leftCoordinate.toString() + "-" + (topCoordinate - 20).toString();
    let downCoordinateToCheck = leftCoordinate.toString() + "-" + (topCoordinate + 20).toString();
    let wallDivs = document.querySelectorAll(".wall");
    let playerCoordinateToCheck = player.offsetLeft.toString() + "-" + player.offsetTop.toString();

    for (let wallDiv of wallDivs) {
        let wallCoordinateToCheck = wallDiv.offsetLeft.toString() + "-" + wallDiv.offsetTop.toString();
        if (rightCoordinateToCheck === wallCoordinateToCheck ||
            leftCoordinateToCheck === wallCoordinateToCheck ||
            topCoordinateToCheck === wallCoordinateToCheck ||
            downCoordinateToCheck === wallCoordinateToCheck) {
            wallDiv.remove();
            let indexOfWall = forbiddenCoordinate.indexOf(wallCoordinateToCheck);
            forbiddenCoordinate.splice(indexOfWall, 1);

        }
    }
    if (rightCoordinateToCheck === playerCoordinateToCheck ||
        leftCoordinateToCheck === playerCoordinateToCheck ||
        topCoordinateToCheck === playerCoordinateToCheck ||
        downCoordinateToCheck === playerCoordinateToCheck ||
        centerCoordinateToCheck === playerCoordinateToCheck) {
        alert("You are dead bitch")
    }
}

function getBombCoordinate(left, top) {
    let list = [];
    if (left % 20 !== 0) {
        list.push(left + 10);
        list.push(top);
    } else if (top % 20 !== 0) {
        list.push(left);
        list.push(top + 10);
    } else {
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
    let newCoord = getBombCoordinate(parseInt(objDiv.style.left.slice(0, -2)), parseInt(objDiv.style.top.slice(0, -2)));
    bomb.style.left = setBombCoordinate(newCoord[0]);
    bomb.style.top = setBombCoordinate(newCoord[1]);
    gameArea.appendChild(bomb);
    let coordinate = bomb.style.left.slice(0, -2) + '-' + bomb.style.top.slice(0, -2);
    forbiddenCoordinate.push(coordinate);

    setTimeout(function deleteBomb() {
        createFire(bomb.style.left, bomb.style.top, bomb);
        setTimeout(function changeToFlame() {
            bomb.remove();
        }, 300);
        bomb.innerHTML = `<img src="/static/images/Flame_f00.png" alt="flame" width="20px" height="20px">`;
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

    let indexOfItem1 = freeCoordinateToMove.indexOf(coordinate);
    freeCoordinateToMove.splice(indexOfItem1, 1);


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

function addWallsCoordinate(top, left) {
    let coordinate = left.toString() + "-" + top.toString();
    forbiddenCoordinate.push(coordinate);

}

function createWallElement() {
    let wall = document.createElement("div");
    wall.classList.add("wall");
    wall.innerHTML = `<img src="/static/images/brick.png" alt="player" width="20px" height="20px">`;
    return wall
}


function placeWallElement() {
    let numOfWalls = ~~(widthNum * heightNum / 3);
    for (let i = 1; i <= numOfWalls; i++) {
        let wall = createWallElement();
        let index = Math.floor(Math.random() * freeCoordinateToMove.length);
        while (index === 0 || index === 1 || index === 13) {
            index = Math.floor(Math.random() * freeCoordinateToMove.length);
        }
        let coordinateInString = freeCoordinateToMove[index];

        freeCoordinateToMove.splice(index, 1);
        let array = coordinateInString.split("-");
        wall.style.width = (player.offsetWidth).toString() + "px";
        wall.style.height = (player.offsetHeight).toString() + "px";
        wall.style.top = array[1] + "px";
        wall.style.left = array[0] + "px";
        addWallsCoordinate(array[1], array[0]);
        gameArea.appendChild(wall);
        walls.push(array[1] + "-" + array[0])

    }

}

function init() {
    objDiv = document.getElementById("image");
    objDiv.innerHTML = `<img src="/static/images/Bman_F_f00.png" alt="player" width="20px" height="20px">`;
    objDiv.style.position = 'relative';
    objDiv.style.left = '0px';
    objDiv.style.top = '0px';
    saveFreeToMoveCoordinate();
    freeCoordinateToMove.splice(0, 1);
    freeCoordinateToMove.splice(0, 1);
    freeCoordinateToMove.splice(11, 1);
    placeTombs();
    placeWallElement();

}


window.onload = init;