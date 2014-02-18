var addPlayers, addBall, randRange, gameStart, updateScore, addScores;
var player1, player1s, y1, player2, player2s, y2;

var ball, ballX, ballY, reset, cDiv, continuePrompt;

var p1Lost = false;
var p2Lost = false;

var gameStarted = false;

var winningScore = 5;

randRange = function(min, max) {
  return Math.floor((Math.random()*max)+min);
}

reset = {
  ball: function() {
    ballX = window.innerWidth/2-12;
    ballY = window.innerHeight/2-12;
    ball.style.top = ballY+"px";
    ball.style.left = ballX+"px";
    gameStarted = false;
  },
  scores: function() {
    player1s.style.left = "90px";
    player1s.style.top = "100px";
    player1s.innerHTML = "0";
    player2s.style.right = "90px";
    player2s.style.top = "100px";
    player2s.innerHTML = "0";
  },
};

updateScore = function(winner) {

  if (winner === "Player 1" && player1s.innerHTML < winningScore) {
    player1s.innerHTML++;
    cDiv.innerHTML = winner+" scored!";
    continuePrompt(true);
  } else if (winner === "Player 2" && player2s.innerHTML < winningScore) {
    player2s.innerHTML++;
    cDiv.innerHTML = winner+" scored!";
    continuePrompt(true);
  }

  reset.ball();
  if (parseInt(player1s.innerHTML) == winningScore) {
    player2s.innerHTML = "GAME OVER!";
  } else if (parseInt(player2s.innerHTML) == winningScore) {
    player1s.innerHTML = "GAME OVER!";
  } else { return; }

  cDiv.innerHTML = winner+" won the game!<br/><br/>Press space to play again";
  gameStarted = false;

  var waitForClick = setInterval(function() {
    if (gameStarted) {
      reset.scores();
      clearInterval(waitForClick);
    }
  }, 200);

}

continuePrompt = function(state) {

  if (state) {
    cDiv.style.display = "block";
  } else {
    cDiv.style.display = "none";
  }

}

moveBall = function() {
  var vx, vy, direction, angle, accel;
  var playerHasWon = false;
  var difficultyFactor = 1.1;
  var maxVeloctiy = 7;
  if (p1Lost) { direction = "right"; }
  else { direction = "left"; }
  vx = 1; // initial x velocity
  var initialDir = (randRange(0, 100)%10 >= 5)? -1 : 1; // should the ball go up or down?
  vy = randRange(0.75*100, (vx+1)*100)/100*initialDir; // definitely not horizonal!

  var initMove = setInterval(function() {

    ballX += ((direction==="left")? -1 : 1) * vx;
    ballY += ((direction==="left")? -1 : 1) * vy;
    ball.style.left = ballX+"px";
    ball.style.top = ballY+"px";

    if (ballY <= 0) {
      vy = -1*vy;
    } else if (ballY >= window.innerHeight-24) {
      vy = -1*vy;
    }

    if (ballX <= 24) {
      if (y1 <= ballY+24 && y1 >= ballY-130) {
        console.log("p1 -> hit");
        if (vy < maxVeloctiy) {
          vy = -1*vy*difficultyFactor;
        }
        if (vx < maxVeloctiy) {
          vx *= difficultyFactor;
        }
        direction = "right";
      } else if (ballX <= 0) {
        updateScore("Player 2");
        p1Lost = true;
        p2Lost = false;
        clearInterval(initMove);
      }
    }
    
    else if (ballX >= window.innerWidth-48) {
      if (y2 <= ballY+12 && y2 >= ballY-130) {
        console.log("p2 -> hit");
        if (vy < maxVeloctiy) {
          vy = -1*vy*difficultyFactor;
        }
        if (vx < maxVeloctiy) {
          vx *= difficultyFactor;
        }
        direction = "left";
      } else if (ballX >= window.innerWidth){
        updateScore("Player 1");
        p1Lost = false;
        p2Lost = true;
        clearInterval(initMove);
      }
    }

  }, 0);
}

addPlayers = function() {

  player1 = document.createElement("div");
  player1.id = "paddle";
  player1.style.left = "0";
  player1.style.top = window.innerHeight/2-75+"px"
  player2 = document.createElement("div");
  player2.id = "paddle";
  player2.style.right = "0";
  player2.style.top = window.innerHeight/2-75+"px"

  document.body.insertBefore(player1, document.body.firstChild);
  document.body.insertBefore(player2, document.body.firstChild);

}

addScores = function() {

  player1s = document.createElement("div");
  player1s.id = "score";
  player1s.style.left = "90px";
  player1s.style.top = "100px";
  player1s.innerHTML = "0";
  player2s = document.createElement("div");
  player2s.id = "score";
  player2s.style.right = "90px";
  player2s.style.top = "100px";
  player2s.innerHTML = "0";
  document.body.insertBefore(player1s, document.body.firstChild);
  document.body.insertBefore(player2s, document.body.firstChild);

}

addBall = function() {

  ball = document.createElement("div");
  ball.id = "ball";
  ballX = window.innerWidth/2-12; //12 -> ball-width
  ballY = window.innerHeight/2-12;
  ball.style.top = ballY+"px";
  ball.style.left = ballX+"px";
  document.body.insertBefore(ball, document.body.firstChild);

}

addContinueDiv = function() {

  cDiv = document.createElement("div");
  cDiv.id = "pressSpaceBox";
  cDiv.style.top = window.innerHeight/2-200+"px";
  cDiv.style.left = window.innerWidth/2-400+"px";
  cDiv.innerHTML = "PONG<br/><br/>press SPACE to play";
  document.body.insertBefore(cDiv, document.body.firstChild);

}

gameStart = function() {

  addPlayers();
  addBall();
  addScores();
  addContinueDiv();
  continuePrompt(true);

}


onMouseMove = function(e) {
  y1 = e.y-75;
  if (y1 <= 0) { y1 = 0; }
  if (y1 >= window.innerHeight-130) { y1 = window.innerHeight-130; }
  y2 = e.y-75;
  if (y2 <= 0) { y2 = 0; }
  if (y2 >= window.innerHeight-130) { y2 = window.innerHeight-130; }
  player1.style.top = y1+"px"; //75 -> paddle-height
  player2.style.top = y2+"px";
}

onKeyDown = function(e) { // let space be used to continue

  if (e.which == 32 && !gameStarted) {
    gameStarted = true;
    continuePrompt(false);
    moveBall();
  }

}

onMouseDown = function(e) { // also allow click to continue

  if (!gameStarted) {
    gameStarted = true;
    continuePrompt(false);
    moveBall();
  }

}

document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("mousedown", onMouseDown, false);
  document.getElementById("center").style.left = window.innerWidth/2-3+"px"; //3 -> center-width
  gameStart();
});
