var canvas;
var context;

var ball = new Image();
var paddle = new Image();
var blockOrange = new Image();
var blockYellow = new Image();
var blockGreen = new Image();
var blockBlue = new Image();
var blockPurple = new Image();
var blockRed = new Image();

var ballHeight = 20;
var ballWidth = 20;
var paddleHeight = 10;
var paddleWidth = 350;

var ballX = 420+(paddleWidth/2);
var ballY = 568;
var paddleX = 420;
var paddleY = 588;

var ballMoveX = 2;
var ballMoveY = -4;
var ballMoving;

var paddleMoveX = 2;
var paddleMoveY = 2;
var paddleLeft;
var paddleRight;
var left;
var right;
var rightDown = false;
var leftDown = false;
var isLeft = 0;
var isRight = 0;

var blockWidth = 60;
var blockHeight = 20;
var numCols = 14; 
var numRows = 8;
var blocks;
var blocks2;
var blockColor;
var blockArray;
var i;	var j;

var paused = true;
var hit = false;
var once =0;
var h=0;
var score=0;
var winNum=0;

blocks = [[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0]];

blocks2 = [[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0],
		[5, 4, 3, 2, 1, 1, 0, 0]];


window.onload = function(){

	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	ball.onload = function(){
		context.drawImage(ball,ballX, ballY, ballWidth, ballHeight);
	};
	ball.src = "ball.png";

	paddle.onload = function(){
		context.drawImage(paddle, paddleX, paddleY, paddleWidth, paddleHeight);
	};
	paddle.src = "paddle.png";

	blockOrange.src = "block_orange.png";
	blockYellow.src = "block_yellow.png";
	blockGreen.src = "block_green.png";
	blockBlue.src = "block_blue.png";
	blockPurple.src = "block_purple.png";
	blockRed.src = "block_red.png";

	blockOrange.onload = function(){
		drawBlocks(blocks);
	}

	spaceToStart();
	printScore();

	document.addEventListener("keypress", function move(e){
		if(e.keyCode === 32 && paused){
			context.clearRect(300, 350, 300, -25);
			context.clearRect(300, 350, 300,10);

			play(blocks);
		}
	})

	document.addEventListener("keydown", function leftOrRight(p){
		if(p.keyCode === 37 && !(paused)){
			var movePaddleLeft = !(leftDown);
			paddleLeft(movePaddleLeft);
			leftDown = true;
		}

		if(p.keyCode === 39 && !(paused)){
			var movePaddleRight = !(rightDown);
			paddleRight(movePaddleRight);
			rightDown = true;
		}
	})

	document.addEventListener("keyup", function stopPaddle(p){
		if(p.keyCode === 37){
			clearInterval(left);
			leftDown = false;	
		}

		if(p.keyCode === 39){
			clearInterval(right);
			rightDown = false;
		}
	})
}


function play(blockArray){
	paused = false;
	var time = 10;
	var angle = ballMoveX;

	printScore();

	ballMoving = setInterval(function move(){
		context.clearRect(ballX, ballY, ballWidth, ballHeight);

		ballX += ballMoveX;
		ballY += ballMoveY;

		//make ball bounce off walls and bricks if it hit them
		if (ballX +ballWidth+ ballMoveX > canvas.width || ballX + ballMoveX < 0 ||
			hitX(blockArray)){

			ballMoveX = -ballMoveX;

			if(hitX(blockArray)){
				hit = false;
				drawBlocks(blockArray);

				if(winLevel(blockArray)){
					if (winNum === 1){
						nextLevel();
					}
					if (winNum === 2){
						winGame();
					}
				}
			}
		}

		if (ballY + ballMoveY < 0 || hitBlock(blockArray) || ballY+ballMoveY>620){
			
			if(ballY+ballMoveY>620){
				gameLost();
			}

			ballMoveY = -ballMoveY;
			
			if(hitBlock(blockArray)){
				hit = false;
				drawBlocks(blockArray);

				if(winLevel(blockArray)){
					if (winNum === 1){
						// winNum++;
						nextLevel(blocks2);

					}
					if (winNum === 2){
						winGame();
					}
				}
			}
		}

		//make ball bounce off paddle
		//when ball bounces off between left edge and 1/4 of paddle
		if (ballX + ballMoveX >= paddleX && 
			ballX + ballMoveX <= paddleX + Math.floor(paddleWidth / 4) && 
			ballY + 3 + ballHeight  > paddleY){

			angle = -4;
			time = 20;
			ballMoveY = -ballMoveY;
			ballMoveX = angle;
		}

		//when ball bounces off between 1/4 and 1/2 of the paddle
		else if (ballX + ballMoveX > paddleX + Math.floor(paddleWidth / 4) && 
				ballX + ballMoveX <= paddleX + Math.floor(paddleWidth / 2) &&
				ballY + 3 + ballHeight > paddleY) {
			
			angle = -2;
			time = 10;
			ballMoveY = -ballMoveY;
			ballMoveX = angle;
		}

		//when ball bounces off between 1/2 and 3/4 of the paddle
		else if (ballX + ballMoveX > paddleX + Math.floor(paddleWidth / 2) && 
				ballX + ballMoveX <= paddleX + Math.floor(3 * paddleWidth / 4) &&
				ballY + 3 + ballHeight > paddleY) {
			
			angle = 5;
			time = 10;
			ballMoveY = -ballMoveY;
			ballMoveX = angle;
		}

		//when ball bounces off between 3/4 and right edge of the paddle
		else if (ballX + ballMoveX > paddleX + Math.floor(3 * paddleWidth / 4) && 
				ballX + ballMoveX <= paddleX + paddleWidth &&
				ballY + 3 + ballHeight > paddleY) {
			
			angle = 4;
			time = 20;
			ballMoveY = -ballMoveY;
			ballMoveX = angle;
		}

		context.drawImage(ball, ballX, ballY, ballWidth, ballHeight);

		document.addEventListener("keypress", function(e){
			if (e.keyCode === 32 && !(paused)){
				pause();
			}

			document.addEventListener("keypress", function(e){
				if (e.keyCode === 32 && paused){
					context.clearRect(300, 350, 300, -25);
					context.clearRect(300, 350, 300,10);
					play(blockArray);
				}
			})
		})
	}, time);
}


function pause(){
	paused = true;
	clearInterval(ballMoving);
	context.fillStyle = "white";
	context.font = "25px Cambria";

	context.fillText("Press the spacebar to resume", 300, 350);
}


function paddleLeft(movePaddle){
	
	if(movePaddle){
		left = setInterval(function move(){
			context.clearRect(paddleX, paddleY, canvas.width, paddleHeight);

			if (paddleX < 0){
				paddleX = 0;
			}
			else{
				paddleX -= 7;
			}			
			context.drawImage(paddle, paddleX, paddleY, paddleWidth, paddleHeight);
		}, 1)
	}				
}


function paddleRight(movePaddle){
	
	if(movePaddle){
		right = setInterval(function move(){

			context.clearRect(paddleX, paddleY, canvas.width, paddleHeight);

			if (paddleX > (canvas.width - paddleWidth)){
				paddleX = (canvas.width - paddleWidth);
			}
			else{
				paddleX += 7;
			}
			context.drawImage(paddle, paddleX, paddleY, paddleWidth, paddleHeight);
		}, 1)
	}
}


function drawBlocks(blockArray){
	blockColor = [blockOrange, blockYellow, blockGreen, blockBlue, blockPurple, blockRed];

	for(i=0; i<numCols; i++){
			for(j=0; j<numRows; j++){
				if(blocks[i][j] >= 0){
					context.drawImage(blockColor[blocks[i][j]], 
						i*blockWidth, j*blockHeight, blockWidth, blockHeight);
				}
				if(blocks[i][j] === -1){
					context.clearRect(i*blockWidth, j*blockHeight, blockWidth, blockHeight);
				}
			}
		}
}

function hitBlock(blockArray){
	var h=0;

	for(i=0; i<numCols; i++){
		for(j=0; j<numRows; j++){

			if(((ballX+ballMoveX) >= (i*blockWidth)) && 
				((ballX+ballMoveX) <= ((i*blockWidth)+blockWidth))){

				if((ballY+ballMoveY) <= ((j*blockHeight)+blockHeight-2) &&
					(ballY+ballMoveY) >= ((j*blockHeight)) ||
					ballY+ballMoveY+ballHeight >= (j*blockHeight) &&
					ballY+ballMoveY+ballHeight <= (j*blockHeight)+blockHeight+2){

					if(blockArray[i][j] > -1){

						if(blockArray[i][j] === 0){
							score += 10;
						}
						score += 20*blockArray[i][j];

						if(blockArray[i][j] === 5 && once === 0){
							once += 1;
								paddleWidth = (paddleWidth/2);
								context.clearRect(paddleX, paddleY, canvas.width, paddleHeight);
								context.drawImage(paddle, paddleX, paddleY, paddleWidth, paddleHeight);
						}

						h = 1;
						blockArray[i][j] = -1;
						hit = true;
					}
					else{
						if(h===1)
							ballMoveY = -ballMoveY;
					}
				}
			}
		}
	}
	printScore();
	return hit;
}


function hitX(blockArray){
	var h=0;

	for(i=0; i<numCols; i++){
		for(j=0; j<numRows; j++){

			if((ballY+ballMoveY+ballHeight) >= ((j*blockHeight)+blockHeight-2) &&
				(ballY+ballMoveY) <= (j*blockHeight)){

				if(((ballX+ballMoveX) >= (i*blockWidth)) && 
					((ballX+ballMoveX) <= ((i*blockWidth)+blockWidth)) ||
					((ballX+ballMoveX+ballWidth) >= (i*blockWidth)) &&
					(ballX+ballMoveX+ballWidth) <= ((i*blockWidth)+blockWidth)){

					if(blockArray[i][j] > -1){

						if(blockArray[i][j] === 0){
							score += 10;
						}
						score += 20*blockArray[i][j];

						if(blockArray[i][j] === 5 && once === 0){
							once += 1;
								paddleWidth = (paddleWidth/2);
								context.clearRect(paddleX, paddleY, canvas.width, paddleHeight);
								context.drawImage(paddle, paddleX, paddleY, paddleWidth, paddleHeight);
						}

						h = 1;
						blockArray[i][j] = -1;
						hit = true;
					}

					else{
						if(h===1)
							ballMoveY = -ballMoveY;
					}
				}
			}
		}
	}
	printScore();
	return hit;
}


function printScore(){

	context.clearRect(0, 623, canvas.width, -20);
	context.fillStyle = "white";
	context.font = "20px Cambria";

	context.fillText("Score:" + score, 0, 623);
}

function gameLost(){

	clearInterval(ballMoving);
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "red";
	context.font = "50px Cambria";

	context.fillText("YOU LOSE! \n GAME OVER!!!", 100, 300);

	context.fillStyle = "white";
	context.font = "25px Cambria";
	context.fillText("Press enter to replay!", 100, 400);

	document.addEventListener("keypress", function move(e){
		if(e.keyCode === 13){
			window.location.reload();
		}
	})
}


function winLevel(blockArray){

	for(i=0; i<numCols; i++){
		for(j=0; j<numRows; j++){

			if(blockArray[i][j] > -1){
				return false;
			}
		}
	}
	winNum += 1;
	return true;
}

function winGame(){
	clearInterval(ballMoving);
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "blue";
	context.font = "50px Cambria";

	context.fillText("YOU WIN! \n YAAYYY!!!", 100, 300);

	context.fillStyle = "white";
	context.font = "25px Cambria";
	context.fillText("Press enter to replay!", 100, 400);

	document.addEventListener("keypress", function move(e){
		if(e.keyCode === 13){
			window.location.reload();
		}
	})

}

function nextLevel(blocks2){

	clearInterval(ballMoving);
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "blue";
	context.font = "50px Cambria";

	context.fillText("LEVEL UP!", 100, 300);

	context.fillStyle = "white";
	context.font = "25px Cambria";
	context.fillText("Press enter to next level!", 250, 350);

	document.addEventListener("keypress", function move(e){
		if(e.keyCode === 13){
			ballX = 420+(paddleWidth/2);
			ballY = 568;
			paddleX = 420;
			paddleY = 588;

			context.clearRect(0, 0, canvas.width, canvas.height);

			blocks2 = [[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0],
				[5, 4, 3, 2, 1, 1, 0, 0]];

			// context.drawImage(ball,ballX, ballY, ballWidth, ballHeight);
			context.drawImage(paddle, paddleX, paddleY, paddleWidth, paddleHeight);
			drawBlocks(blocks2);
			
			play(blocks2);
			// window.location.reload();
		}
	})
	
}

function spaceToStart(){
	
	context.fillStyle = "white";
	context.font = "25px Cambria";

	context.fillText("Press the spacebar to start", 300, 350);
}
