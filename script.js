// variables to hold tower elements and game state
let numDisks = 3;
let moves = [];
let towers = [[], [], []];
let stepCount = 0; 

const startSound = new Audio('./audio/start.wav');
const moveSound = new Audio('./audio/move.wav');
const doneSound = new Audio('./audio/done.wav');

startSound.volume = 0.65;
moveSound.volume = 0.45;
doneSound.volume = 0.7;

// clear towers and prepare for a new game
function resetTowers() {
    towers = [[], [], []];
    document.getElementById("tower1").innerHTML = '';
    document.getElementById("tower2").innerHTML = '';
    document.getElementById("tower3").innerHTML = '';
    stepCount = 0;
}

// recursively generate moves for solving towers of hanoi
function hanoi(n, from, to, aux) {
    if (n === 0) return;
    hanoi(n - 1, from, aux, to);
    moves.push([from, to]);
    hanoi(n - 1, aux, to, from);
}

// initialize the game with the specified number of disks
function startGame() {
    // reset towers and moves
    resetTowers();
    moves = [];

    // get the number of disks from user input and initialize the game
    numDisks = parseInt(document.getElementById("numDisks").value);

    // ensure number of disks is between 1 and 10 inclusive
    if (numDisks > 10 || numDisks < 1) {
        return
    }

    startSound.play(); 

    for (let i = numDisks; i >= 1; i--) {
        const disk = document.createElement("div");
        disk.className = "disk";
        disk.dataset.size = i;
        disk.textContent = i;
        towers[0].push(disk);
        document.getElementById("tower1").appendChild(disk);
    }
    
    // generate moves and reset the move counter and message
    hanoi(numDisks, 0, 2, 1);
    document.getElementById("stepsInfo").textContent = `Steps: 0`;
    document.getElementById("completeMessage").textContent = '';

    // start animation after a small delay to show the initial state
    setTimeout(animateMoves, 1000); 
}

// animate each move automatically
function animateMoves() {
    if (moves.length === 0) {
        
        doneSound.currentTime = 0;
        doneSound.play();

        document.getElementById("completeMessage").textContent = 'Game Complete!';
        return;
    }

    moveSound.currentTime = 0;
    moveSound.play();

    // perform next move
    const [from, to] = moves.shift();
    const disk = towers[from].pop();
    towers[to].push(disk);
    
    // move disk visually between towers
    document.getElementById(`tower${from + 1}`).removeChild(disk);
    document.getElementById(`tower${to + 1}`).appendChild(disk);
    
    // update step counter after each move
    stepCount++;
    document.getElementById("stepsInfo").textContent = `Steps: ${stepCount}`;

    // schedule next move after delay
    setTimeout(animateMoves, 500);
}