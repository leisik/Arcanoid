var pattern;
var xPos = 275;
var yPos = 525;
var step = 10;
var img = new Image();
img.src = 'player.png';
var ballPosX = 300;
var ballPosY = 250;
var ballVelX = 0;
var ballVelY = 0;
var initialXvelocity = 15;

//var hit = new Audio("no.wav");
var points = 0;

var right = true;
var upwards = false;
var gameover = false;

var allBlocks = [];
var blockHeight = 15;
var numberInArray = 0;

var ballsRadius = 3;
var ballLineWIdth = 2;
var bs = ballLineWIdth + ballsRadius; // ball size

var numberOfBlockInRow = 10;
var blockHeight = 15;
var blockWidth;
var spaceBetweenBlocks = 2;

class block{
    constructor(x,y, col) {
        this.x = x;
        this.y = y;
        this.color = col;
    }
}

var restartBtn = document.getElementById('restart');
restartBtn.addEventListener("click", function() {  
    ballVelY = 10; 
    drawInitialBoard();
    gameover = false;
    document.getElementById('game-over').style.display = "none";
    points = 0;
});
    
window.onload = function() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    document.addEventListener("keydown", keyPush);
    document.onmousemove = handleMouseMove;
    redundancylvl();
    drawInitialBoard();
    pattern = context.createPattern(img, 'repeat');
    setInterval(game, 1000/30);
    //game();
}

function redundancylvl() {
    blockWidth = (canvas.width - (numberOfBlockInRow+1)*spaceBetweenBlocks - 30) / numberOfBlockInRow;
}

function drawInitialBoard() {
    numberInArray = 0;
    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < numberOfBlockInRow; j++) {
            if(i == 0) color = "red";
            else if(i == 1) color = "yellow";
            else if(i == 2) color = "blue";
            else if(i == 3) color = "purple";
            else if(i == 4) color = "green";
            context.fillStyle = color;
            context.fillRect(18 + j*(blockWidth+spaceBetweenBlocks), 125 + i*(blockHeight+spaceBetweenBlocks), blockWidth, blockHeight);
            
            allBlocks[numberInArray] = new block(18 + j*(blockWidth+spaceBetweenBlocks), 125 + i*(blockHeight+spaceBetweenBlocks), color);
            numberInArray++;
        }
    }
    context.fillStyle = "aqua";
    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(ballPosX,ballPosY, ballsRadius, 0,2*Math.PI);
    context.stroke();
    context.fill();
    
    context.fillStyle = '#f9a602'
    context.fillRect(xPos, yPos, 80, 20);
}

function draw() {
    for(var i = 0; i < allBlocks.length; i++) {
        context.fillStyle = allBlocks[i].color;
        context.fillRect(allBlocks[i].x, allBlocks[i].y, blockWidth, blockHeight);
    }
}

function game() {
    if(!gameover) {
        // clear out the whole board
        context.clearRect(0,0,canvas.width, canvas.height);
        //context.fillStyle = pattern;

        //draw the player 
        context.fillStyle = '#f9a602'
        context.fillRect(xPos, yPos, 80, 20);

        //draw the ball
        context.fillStyle = "aqua";
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(ballPosX,ballPosY, ballsRadius, 0,2*Math.PI);
        context.stroke();
        context.fill();

        draw();
        //drawBlocks();

        ballPosY += ballVelY;
        ballPosX += ballVelX; 

        //check if ball is reflected by block and determine which part of block was hit by ball

        if(ballPosY >= yPos-10 && ballPosY <= yPos+10 && ballPosX >= xPos && ballPosX <= xPos + 25) {
            ballVelY = -10;
            ballVelX = -chooseAngle(xPos)*initialXvelocity;
            //console.log(ballVelX);

        }

        if(ballPosY >= yPos-10 && ballPosY <= yPos+10 && ballPosX >= xPos + 25 && ballPosX <= xPos + 55) {
            ballVelY = -10;
            ballVelX = 0;
            chooseAngle(xPos);
            //console.log(ballPosX, xPos);
        }

        if(ballPosY >= yPos-10 && ballPosY <= yPos+10 && ballPosX >= xPos + 55 && ballPosX <= xPos + 80) {
            chooseAngle(xPos);
            ballVelY = -10;
            ballVelX = chooseAngle(xPos)*initialXvelocity;
            //console.log(chooseAngle(xPos));
        }

        //check if ball is bouncing of upper wall
        if(ballPosY == 20) {
            ballVelY = 10;
        }

        //check if ball is bouncing of right wall
        if(ballPosX >= canvas.width - 15) {
            ballVelX = -5;
        }

        //check if ball is bouncing of left wall
        if(ballPosX <= 15) {
            ballVelX = 5;
        }

        // ball falls down
        if(ballPosY == canvas.height) {
            gameOver();
        }


        var sizeAr = allBlocks.length - 1;
        if(ballPosY <= allBlocks[sizeAr].y + 2*blockWidth){
            //console.log(allBlocks);
            for(var i = 0; i < allBlocks.length; i++) {
                if(ballPosY <= allBlocks[i].y + 2*blockHeight && ballPosY >= allBlocks[i].y && ballPosX >= allBlocks[i].x && ballPosX<= allBlocks[i].x + blockWidth && ballVelY < 0) {
                    //console.log("hit");
                    allBlocks.splice(i,1);
                    ballVelY = 10;
                    points++;
                }
                
                else if(ballPosY >= allBlocks[i].y - blockHeight/2 && ballPosY <= allBlocks[i].y + blockHeight/2&& ballPosX >= allBlocks[i].x && ballPosX <= allBlocks[i].x + blockWidth && ballVelY > 0) {
                    //console.log("hit");
                    allBlocks.splice(i,1);
                    ballVelY = -10;
                    points++;
                    console.log("od gory");
                }
            }
        }
        document.getElementById('score-board').innerHTML = '<p>score: ' + points + '<p>';
        if(points >= 50) {
            win();
        }
    }
    else {
        gameOver();
    }
}

function chooseAngle(m_position) {
    var mnoznik = ballPosX - m_position;
    if(mnoznik >= 45) {
        mnoznik = mnoznik - 45;
    }

    return Math.abs(0.87 -(mnoznik * 0.04133));
    
}

function win() {
    document.getElementById('game-over').innerHTML = '<h1>You win!</h1>';
    document.getElementById('game-over').style.display = "block";
    ballPosX = 300;
    ballPosY = 250;
    ballVelX = 0;
    ballVelY = 0;
    
}
function gameOver() {
    document.getElementById('game-over').style.display = "block";
    document.getElementById('score').innerHTML = 'Your score is: <span>' + points + '</span>';
    gameover = true;
    ballPosX = 300;
    ballPosY = 250;
    ballVelX = 0;
    ballVelY = 0;
    
}

// controls with keyboard
function keyPush(e) {
    var keyCode = e.keyCode;
    if(keyCode == 13) {
        ballVelY = 10; 
		drawInitialBoard();
		gameover = false;
		document.getElementById('game-over').style.display = "none";
		points = 0;
    }
}

// controls with mouse
function handleMouseMove(event) {
    xPos = event.pageX - 30 -(window.innerWidth - canvas.width)/2;
    if(xPos <= 15){
        xPos = 15;
    }
    if(xPos >= canvas.width - 95){
        xPos = canvas.width - 95;
    }
}