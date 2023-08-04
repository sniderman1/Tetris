const mainContainer = document.getElementById('mainContainer');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const gameOverDisplay = document.getElementById('gameOver');
const speedDisplay = document.getElementById('speed');
const clearedDisplay = document.getElementById('clearedDisplay');
const upNextContainer = document.getElementById('nextUp');
let start = false;
let isGameOver = false;

startBtn.onclick = () => {
    if(!start){
        start = true;
        startBtn.innerHTML = 'Pause';
        startBtn.style.backgroundColor = 'orange';
        main();          
    }
    else{
        start = false;
        startBtn.innerHTML = 'Start';
        startBtn.style.backgroundColor = 'green';
    }

}

restartBtn.onclick = () =>{
    restartGame();
}

const gridObj = {
    emptySpaces: [],
    rowCounts: {}
}

//Creates the gird on screen
window.onload = () =>{
    //Create display grid
    for(let i = 0; i < 4; i++){
        let newRow = document.createElement('div');
        newRow.className = 'gridRow';
        newRow.id = 'displayRow' + i;
        upNextContainer.appendChild(newRow);
        for(let j = 0; j < 4; j++){
            let girdBlock = document.createElement('div');
            girdBlock.className = 'block';
            girdBlock.id = 'displayRow' + i.toString() + 'col' + j.toString();
            newRow.appendChild(girdBlock);
        } 
    }
    //Create main grid
    for(let i = 0; i < 24; i++){
        let newRow = document.createElement('div');
        newRow.className = 'gridRow';
        newRow.id = 'girdRow' + i;
        gridObj.rowCounts[i] = 0;
        mainContainer.appendChild(newRow);
        for(let j = 0; j < 10; j++){
            gridObj.emptySpaces.push([i,j]); 
            if (i > 3){
                let girdBlock = document.createElement('div');
                girdBlock.className = 'block';
                girdBlock.id = 'row' + i.toString() + 'col' + j.toString();
                newRow.appendChild(girdBlock);
            }
        }
    }    
}

const shapes = [
    //row, col
    {
        name: 'L Shape',
        orientations: ['normal', 'right', 'down', 'left'],
        displayLocation: [3,1],
        normal: {
            b0: [0,0], 
            b1: [-2,0],
            b2: [-1,0],
            b3: [0,1]
        },
        right: {
            b0: [0,0], 
            b1: [0,1],
            b2: [0,2],
            b3: [1,0]  
        },
        down: {
            b0: [0,0], 
            b1: [1,0],
            b2: [2,0],
            b3: [0,-1]
        },
        left: {
            b0: [0,0], 
            b1: [0,-1],
            b2: [0,-2],
            b3: [-1,0]
        }
    },
    {
        name: 'Backwards L',
        orientations: ['normal', 'right', 'down', 'left'],
        displayLocation: [3,2],
        normal: {
            b0: [0,0], 
            b1: [-2,0],
            b2: [-1,0],
            b3: [0,-1]
        },
        right: {
            b0: [0,0], 
            b1: [0,1],
            b2: [0,2],
            b3: [-1,0]  
        },
        down: {
            b0: [0,0], 
            b1: [1,0],
            b2: [2,0],
            b3: [0,1]
        },
        left: {
            b0: [0,0], 
            b1: [0,-1],
            b2: [0,-2],
            b3: [1,0]
        }
    },
    {
        name: 'Square',
        orientations: ['normal'],
        displayLocation: [2,1],
        normal: {
            b0: [0,0],
            b1: [-1,0],
            b2: [-1,1],
            b3: [0,1]            
        }
    },
    {
        name: 'Backwards Z',
        orientations: ['normal', 'right'],
        displayLocation: [2,2],
        normal: {
            b0: [0,0],        
            b1: [-1,-1],
            b2: [0,-1],
            b3: [1,0]            
        },
        right: {
            b0: [0,0],        
            b1: [1,-1],
            b2: [0,1],
            b3: [1,0]
        }
    },
    {
        name: 'Z Shape',
        orientations: ['normal', 'right'],
        displayLocation: [2,1],
        normal: {
            b0: [0,0],        
            b1: [-1,1],
            b2: [0,1],
            b3: [1,0]            
        },
        right: {
            b0: [0,0],        
            b1: [1,1],
            b2: [0,-1],
            b3: [1,0]            
        },
    },
    {
        name: 'Stright',
        orientations: ['normal', 'right'],
        displayLocation: [2,3],
        normal: {
            b0: [0,0],
            b1: [0,-1],
            b2: [0,-2],
            b3: [0,-3]            
        },
        right: {
            b0: [0,0],
            b1: [-1,0],
            b2: [-2,0],
            b3: [-3,0]   
        }
    },
    {
        name: 'D Shape',
        orientations: ['normal', 'right', 'down', 'left'],
        displayLocation: [2,2],
        normal: {
            b0: [0,0], 
            b1: [-1,1],
            b2: [-1,-1],
            b3: [-1,0]  
        },
        right: {
            b0: [0,0], 
            b1: [1,-1],
            b2: [-1,-1],
            b3: [0,-1] 
        },
        down: {
            b0: [0,0], 
            b1: [1,1],
            b2: [1,-1],
            b3: [1,0]  
        },
        left: {
            b0: [0,0], 
            b1: [1,1],
            b2: [-1,1],
            b3: [0,1] 
        }
    }
];

window.addEventListener('keydown', function (e) {
    if(e.key == 's' || e.key == 'S' || e.key == 'ArrowDown'){
        moveDown();
    }
    else if(e.key == 'd' || e.key == 'D' || e.key == 'ArrowRight'){
        moveSide('right');
    }
    else if(e.key == 'a' || e.key == 'A' || e.key == 'ArrowLeft'){
        moveSide('left')
    }
    else if(e.key == 'w' || e.key == 'W' || e.key == 'ArrowUp'){
        rotate();
    }
  }, false);

let currentShape = JSON.parse(JSON.stringify(shapes[0]));
let checkShape = {};
let checkSqu = [];
let currentSqu = [3, 5];
const leftLimit = -1;
const rightLimit = 10;
const bottom = 24;
let choice = 0;
let randomNum = 0;
let randomNumCol = 0;
let isBottom = false;
let color = 'blue'
let orient = 'normal';
let rotateNum = 0;
let gameScore = 0;

const randomNumber = () => {
    randomNum = Math.floor(Math.random() * 7);
    randomNumCol = Math.floor(Math.random() * 6);
    displayNext();
}

const displayNext = () =>{
    let mainBlock = shapes[randomNum].displayLocation
    let thisColor = chooseColor(randomNumCol);
    console.log(randomNumCol)
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            document.getElementById('displayRow' + i + 'col' + j).className = 'block';
        }
    }
    for(let i = 0; i < 4; i++){
        let row = shapes[randomNum].normal['b' + i][0] + mainBlock[0];
        let col = shapes[randomNum].normal['b' + i][1] + mainBlock[1];
        document.getElementById('displayRow' + row + 'col' + col).classList.add(thisColor, 'border');
    }
}

const chooseShape = () => {
    choice = randomNum;
    currentShape = JSON.parse(JSON.stringify(shapes[choice][orient]));
    console.log(shapes[choice].name)
    let randomCol = randomNumCol;
    randomNumber();
    color = chooseColor(randomCol);
   console.log(randomCol, color) 
}

const chooseColor = (randomCol) =>{
    let thisColor;
    switch (randomCol){
        case 0:
            thisColor = 'blue';
            break;
        case 1: 
            thisColor = 'red';
            break;
        case 2: 
            thisColor = 'green';
            break;
        case 3: 
            thisColor = 'purple';
            break;
        case 4:
            thisColor = 'orange';
            break;
        case 5:
            thisColor = 'pink';
            break;
        default:
            thisColor = 'blue';
    }  
    return thisColor;  
}

const createCheckShape = (dir) => {
    let isPossible = true;
    let tempShape = {};
    for (let i = 0; i < 4; i++){
        row = checkSqu[0] + shapes[choice][orient]['b' + i][0];
        col = checkSqu[1] + shapes[choice][orient]['b' + i][1];

        let emptySpaces = JSON.stringify(gridObj.emptySpaces);
        if(emptySpaces.indexOf('['+ row + ',' + col + ']') == -1){
            isPossible = false;          
            if(dir == 'down'){
                isBottom = true;

            }
            else if(dir == 'rotate'){
                if(rotateNum == 0){
                    rotateNum = shapes[choice].orientations.length - 1;
                }
                else{
                    rotateNum = rotateNum - 1;    
                }
                setOrientation();
            }
        }
        else if(col > leftLimit && col < rightLimit && row < bottom){
            tempShape['b' + i] = [row, col];   
        }
    }
    if(isBottom){
        bottomHit();    
    }
    else if(isPossible){
        checkShape = JSON.parse(JSON.stringify(tempShape));
        currentSqu = checkSqu;
        upDateScreen();
    }    
}

const moveDown = () =>{
    if(start && !isGameOver){
        checkSqu = [currentSqu[0] + 1, currentSqu[1]];
        if(!isBottom){
            createCheckShape('down');        
        }        
    }
}

const moveSide = (dir) =>{
    if(start && !isGameOver){
        if(dir == 'left'){
            checkSqu = [currentSqu[0], currentSqu[1] - 1];
        }
        else{
            checkSqu = [currentSqu[0], currentSqu[1] + 1];
        }
        createCheckShape(dir);        
    }
}

const rotate = () =>{
    if(start && !isGameOver){
        rotateNum ++  
        setOrientation();
        createCheckShape('rotate');        
    }
}

const setOrientation = () =>{
    if(rotateNum >= shapes[choice].orientations.length){
        rotateNum = 0
    }
    switch (rotateNum){
        case 0:
            orient = 'normal';
            break;
        case 1: 
            orient = 'right';
            break;
        case 2:
            orient = 'down';
            break;
        case 3:
            orient = 'left';
            break;
        default:
            orient = 'normal';
    }
}

const upDateScreen = () => {
    for (let i = 0; i < 2; i++){
        for (let j = 0; j < 4; j++){
            let row = currentShape['b' + j][0];
            let col = currentShape['b' + j][1];
            if(row > 3){
                if(i == 0){
                    document.getElementById('row' + row + 'col' + col).classList.remove(color, 'border');
                }
                else{
                    document.getElementById('row' + row + 'col' + col).classList.add(color, 'border');
                }
            }            
        }
        currentShape = JSON.parse(JSON.stringify(checkShape));
    }
}

const fullRows = [];

const bottomHit = () => {
    let isFullRow = false;
    for (let i = 0; i < 4; i ++){

        if(currentShape['b' + i][0] < 4){
            isGameOver = true;
            gameOverDisplay.innerHTML = 'GAME OVER';
        }

        let block = JSON.stringify(currentShape['b' + i]);
        for (let j = 0; j < gridObj.emptySpaces.length; j ++){
            if(block == JSON.stringify(gridObj.emptySpaces[j])){
                gridObj.emptySpaces.splice(j, 1);
                gridObj.rowCounts[currentShape['b' + i][0]]++;
                if(gridObj.rowCounts[currentShape['b' + i][0]] == 10){
                    isFullRow = true;
                    fullRows.push(currentShape['b' + i][0]);
                }
            }
        }
    }
    orient = 'normal';
    rotateNum = 0;
    isBottom = false;
    currentSqu = [3,5];
    if(isFullRow){
        clearRows();
    }
    chooseShape();
} 

const gameScoreDisplay = document.getElementById('gameScore');
let numberOfCleared = 0;

const clearRows = () => {
    fullRows.sort();
    fullRows.reverse();

    //Clears out the full rows, turns rowCounts on that row to 0, and pushes those spaces back to emptySpaces


    //Loops through fullRows, removes the highest fullRow color class and adds the spaces to the emptySpaces
    //Then loops through each row above the fullRow. Updates the rowCounts to the row above it. Shifts the
    //the color from the current row to the row below it, remove that space from the emptySpaces and adds
    //the current space to the empty spaces.
    for(let i = 0; i < fullRows.length; i++){

        let rowCounts = gridObj.rowCounts;        
        let row = fullRows[i];

        rowCounts[row] = 0;

        //Loops through each col in the current fullRow, remove the color class,
        //and adds that space to the emptySpaces
        for(let m = 0; m < 10; m++){
            document.getElementById('row' + row + 'col' + m).className = 'block';
            gridObj.emptySpaces.push([row, m]);
        }

        let emptySpaces = JSON.stringify(gridObj.emptySpaces);

        //loops through each row above the current fullRow in reverse order.
        for(let j = fullRows[i]; j > -1; j--){

            //row 3 to 0 are not elements in the window. So they do not need updating.
            if(j < 4){
                rowCounts[j] = 0;
            }
            else{
                rowCounts[j] = rowCounts[j - 1];
                //updating the emptySpaces and element classes
                for(let k = 0; k < 10; k++){
                    //if the current space is not found in the emptySpaces it needs to be updated
                    if(emptySpaces.indexOf('['+ j + ',' + k + ']') == -1){

                        //gets the color of the current space and then removes the color class from the space
                        let thisColor = document.getElementById('row' + j + 'col' + k).classList[1];
                        document.getElementById('row' + j + 'col' + k).className = 'block';

                        //Adds that color to the space below it and adds the current space to the emptySpaces
                        document.getElementById('row' + (j + 1) + 'col' + k).classList.add(thisColor, 'border');
                        gridObj.emptySpaces.push([j, k]);

                        //Loops through the entire emptySpaces to find the index of the current space and removes
                        //it from that array.
                        let block = JSON.stringify([(j + 1), k]);
                        for (let l = 0; l < gridObj.emptySpaces.length; l ++){
                            if(block == JSON.stringify(gridObj.emptySpaces[l])){
                                gridObj.emptySpaces.splice(l, 1);
                            }
                        }
                    }
                }                    
            }
            
            
        }
        //increase the row number to the other rows in fullRows to move them down by one row. 
        for(let n = 0; n < fullRows.length; n++){
            fullRows[n] = fullRows[n] + 1;
        }  
    }
    numberOfCleared = numberOfCleared + fullRows.length;
    clearedDisplay.innerHTML = numberOfCleared;
    gameScore = gameScore + ((100 * fullRows.length)*fullRows.length * (6 - (speed/100)));  
    gameScoreDisplay.innerHTML = gameScore; 
    fullRows.length = 0;          
    setSpeed();   
}


const startMove = () => {
    randomNumber();
    chooseShape();
    for(let i = 0; i < 4; i++){
        row = currentSqu[0] + currentShape['b' + i][0];
        col = currentSqu[1] + currentShape['b' + i][1];
        currentShape['b' + i][0] = row;
        currentShape['b' + i][1] = col;
    }
}

let speed = 500;
let isChaningSpeed = false;

const setSpeed = () =>{
    if(numberOfCleared % 10 == 0 && speed > 199){
        console.log('speed',speed)
        speed = speed - 100;
        speedDisplay.innerHTML = speed;
        isChaningSpeed = true;
        main();
    }
}

let firstClick = true;

const main = () => {
    if(firstClick){
        startMove(); 
        firstClick = false;       
    }
    let id = null;
    clearInterval(id);
    id = setInterval(frame, speed);
    function frame(){
        if(start == true && !isGameOver && !isChaningSpeed){
            moveDown();
        }
        else{
            isChaningSpeed = false;
            clearInterval(id);
        }    
    }  
}

const restartGame = () => {
    isChaningSpeed = false;
    numberOfCleared = 0;
    speed = 500;
    speedDisplay.innerHTML = speed;
    clearedDisplay.innerHTML = numberOfCleared;
    gameOverDisplay.innerHTML = '';
    gameScoreDisplay.innerHTML = '0';
    startBtn.innerHTML = 'Start';
    firstClick = true;
    choice = 0;
    isBottom = false;
    color = 'blue'
    orient = 'normal';
    rotateNum = 0;
    gameScore = 0;
    start = false;
    isGameOver = false;
    currentShape = JSON.parse(JSON.stringify(shapes[0]));
    checkShape = {};
    checkSqu = [];
    currentSqu = [3, 5];
    fullRows.length = 0;
    gridObj.emptySpaces.length = 0;
    gridObj.rowCounts.length = 0;
    for(let i = 0; i < 24; i++){
        gridObj.rowCounts[i] = 0;
        for(let j = 0; j < 10; j++){
            gridObj.emptySpaces.push([i,j]);
            if(i > 3){
                document.getElementById('row' + i + 'col' + j).className = 'block';                
            }
        }
    }
}
