var player, playerScore, cpu, cpuScore, vx, vy, ball, ballX, ballY, cDiv, continuePrompt, upPressed, downPressed, y1, y2, isTouchDevice;
var gameOver = false;
var paddleHeight = 130;
var ballHeight = 24;
var p1Lost = false;
var gameStarted = false;

var randRange = function(min, max) {
    return Math.floor((Math.random()*max)+min);
}

var reset = {
    ball: function() {
        ballX = window.innerWidth/2-12;
        ballY = window.innerHeight/2-12;
        ball.style.top = ballY+"px";
        ball.style.left = ballX+"px";
        gameStarted = false;
    },
    scores: function() {
        playerScore.style.left = "90px";
        playerScore.style.top = "100px";
        playerScore.innerHTML = "0";
        cpuScore.style.right = "90px";
        cpuScore.style.top = "100px";
        cpuScore.innerHTML = "0";
    },
};

var updateScore = function(winner) {

    var winningScore = 5;
    var deviceGesture = (isTouchDevice)? "Tap to continue" : "Press space to continue";
    if (winner === "Player 1" && playerScore.innerHTML < winningScore) {
        playerScore.innerHTML++;
        cDiv.innerHTML = winner+" scored!<br/><br/>"+deviceGesture;
        continuePrompt(true);
    } else if (winner === "CPU" && cpuScore.innerHTML < winningScore) {
        cpuScore.innerHTML++;
        cDiv.innerHTML = winner+" scored!<br/><br/>"+deviceGesture;
        continuePrompt(true);
    }

    reset.ball();
    if (parseInt(playerScore.innerHTML) == winningScore) {
        cpuScore.innerHTML = "GAME OVER!";
    } else if (parseInt(cpuScore.innerHTML) == winningScore) {
        playerScore.innerHTML = "GAME OVER!";
    } else { return; }

    cDiv.innerHTML = winner+" won the game!<br/><br/>Press space to play again";
    continuePrompt(true);
    gameOver = true;
    gameStarted = false;

}

var continuePrompt = function(state) {

    if (state) {
        cDiv.style.display = "block";
    } else {
        cDiv.style.display = "none";
    }

}

var moveCpuToMiddle = function() {

    if (y2+paddleHeight-ballHeight === ballY) return;
    if (y2+paddleHeight-ballHeight > ballY) {
        var goUp = setInterval(function() {
            y2 -= 1;
            cpu.style.top = y2+"px";
            if (y2+63 <= ballY) {
                clearInterval(goUp);
            }
        }, 4)
    } else {
        var goDown = setInterval(function() {
            y2 += 1;
            cpu.style.top = y2+"px";
            if (y2+63 >= ballY) {
                clearInterval(goDown);
            }
        }, 4);
    }

}

var cpuHit;
var computer = function() {
    var above;
    var speed;
    if (isTouchDevice) {
        speed = 0.0035 * (window.innerWidth);
    } else {
        speed = 0.85;
    }
    var moveCPU = setInterval(function() {
        above = y2 > ballY - paddleHeight/2 + ballHeight/2;
        if (above && y2 >= 0) {
            if (!cpuHit) {
                y2 -= speed*Math.abs(vy)*Math.abs(ballX/window.innerWidth) + 1;
            } else {
                y2 -= speed*Math.abs(vy)*Math.abs(ballX/window.innerWidth)*0.3;
            }
            cpu.style.top = y2+"px";
        } else if (y2 <= window.innerHeight-paddleHeight) {
            if (!cpuHit) {
                y2 += speed*Math.abs(vy)*Math.abs(ballX/window.innerWidth) + 1;
            } else {
                y2 += speed*Math.abs(vy)*Math.abs(ballX/window.innerWidth)*0.3;
            }
            cpu.style.top = y2+"px";
        }
        if (!gameStarted) {
            moveCpuToMiddle();
            clearInterval(moveCPU);
        }
    }, 4);
}

var moveBall = function() {
    if (gameOver) {
        gameOver = false;
        reset.scores();
    }
    computer();
    var direction;
    var difficultyFactor = 1.1;
    var maxXVelocity, maxYVelocity;
    if (isTouchDevice) {
        maxXVelocity = 5;
        maxYVelocity = 2;
    } else {
        maxXVelocity = 5;
        maxYVelocity = 3;
    }
    var delay = false;
    if (p1Lost) {
        direction = "right";
    } else {
        direction = "left";
    }
    var initialDir = (randRange(0, 100)%10 >= 5)? -1 : 1;
    vx = 2; // initial x velocity
    vy = randRange(20, 60)/100*initialDir;
    var up = upPressed;
    var spin = 0;
    var spinFactor = 0.05;

    var initMove = setInterval(function() {

        if (upPressed) {
            if (!up || y1 <= 0) {
                spin = 0;
            }
            up = true;
            spin += spinFactor;

        } else if (downPressed) {
            if (up || y1 >= window.innerHeight-paddleHeight) {
                spin = 0;
            }
            up = false;
            spin -= spinFactor;
        } else {
            spin = 0;
        }

        if (!delay) {
            if (ballY <= 0 || ballY >= window.innerHeight-ballHeight) {
                delay = true;
                setTimeout(function() { // keep the ball from being flipped twice
                    delay = false;
                }, 50);
                if (ballY <= 0) {
                    vy = -1*vy;
                } else if (ballY >= window.innerHeight-ballHeight) {
                    vy = -1*vy;
                }
            }
        }

        ballX += ((direction==="left")? -1 : 1) * vx;
        ball.style.left = ballX+"px";
        ballY += ((direction==="left")? -1 : 1) * vy;
        if (ballY < 0) {
            ballY = 0;
        } else if (ballY > window.innerHeight-ballHeight) {
            ballY = window.innerHeight-ballHeight;
        }
        ball.style.top = ballY+"px";

        if (ballX <= ballHeight) {
            cpuHit = false;
            if (y1 <= ballY+ballHeight && y1 >= ballY-paddleHeight) {
                if (vy < maxYVelocity) {
                    vy = -1*vy*difficultyFactor+spin;
                    spin = 0;
                } else {
                    vy = -1*vy;
                    spin = 0;
                }
                if (vx < maxXVelocity) {
                    vx *= difficultyFactor;
                }
                direction = "right";
            } else if (ballX <= 0) {
                updateScore("CPU"); // player 2 wins
                p1Lost = true;
                clearInterval(initMove);
            }
        }

        else if (ballX >= window.innerWidth-ballHeight*2) {
            cpuHit = true;
            if (y2 <= ballY+ballHeight && y2 >= ballY-paddleHeight) {
                if (vy < maxYVelocity) {
                    vy *= -1*difficultyFactor;
                } else {
                    vy *= -1;
                }
                if (vx < maxXVelocity) {
                    vx *= difficultyFactor;
                }
                direction = "left";
            } else if (ballX >= window.innerWidth-ballHeight){
                updateScore("Player 1"); // player 1 wins
                p1Lost = false;
                clearInterval(initMove);
            }
        }

    }, 4);

}

var create  = {

    playerScore: function() {
        player = document.createElement("div");
        player.id = "paddle";
        player.style.left = "0";
        player.style.top = window.innerHeight/2-paddleHeight/2+"px";
        cpu = document.createElement("div");
        cpu.id = "paddle";
        cpu.style.right = "0";
        cpu.style.top = window.innerHeight/2-paddleHeight/2+"px";
        if (isTouchDevice) {
            paddleHeight = 80;
            cpu.style.height = player.style.height = paddleHeight+"px";
        }
        y1 = y2 = window.innerHeight/2-paddleHeight/2;

            document.body.insertBefore(player, document.body.firstChild);
        document.body.insertBefore(cpu, document.body.firstChild);
    },
    scores: function() {
        playerScore = document.createElement("div");
        playerScore.id = "score";
        playerScore.style.left = "90px";
        playerScore.style.top = "100px";
        playerScore.innerHTML = "0";
        cpuScore = document.createElement("div");
        cpuScore.id = "score";
        cpuScore.style.right = "90px";
        cpuScore.style.top = "100px";
        cpuScore.innerHTML = "0";
        document.body.insertBefore(playerScore, document.body.firstChild);
        document.body.insertBefore(cpuScore, document.body.firstChild);
    },
    ball: function() {
        ball = document.createElement("div");
        ball.id = "ball";
        ballX = window.innerWidth/2-ballHeight/2; //12 -> ball-width
        ballY = window.innerHeight/2-ballHeight/2;
        ball.style.top = ballY+"px";
        ball.style.left = ballX+"px";
        document.body.insertBefore(ball, document.body.firstChild);
    },
    mainText: function() {
        cDiv = document.createElement("div");
        cDiv.id = "pressSpaceBox";
        cDiv.style.top = window.innerHeight/2-200+"px";
        cDiv.style.left = window.innerWidth/2-400+"px";
        if (isTouchDevice) {
            cDiv.style.fontSize = "11pt";
            cDiv.innerHTML = "PONG<br/><br/>Tap to play!";
        } else {
            cDiv.innerHTML = "PONG<br/><br/>press SPACE to play!";
        }
        document.body.insertBefore(cDiv, document.body.firstChild);
    }

}

var gameStart = function() {

    create.playerScore();
    create.ball();
    create.scores();
    create.mainText();
    continuePrompt(true);

}

var keyMovement = function() {

    var keySpeed = 5;
    setInterval(function() {
        if (upPressed) {
            if (y1 >= 0) {
                y1 -= keySpeed;
            }
        }
        if (downPressed) {
            if (y1 <= window.innerHeight-paddleHeight) {
                y1 += keySpeed;
            }
        }
        player.style.top = y1+"px";
    }, 4);

}

var onKeyUp = function(e) {

    switch (e.which) {
        case 38: case 75:
            upPressed = false;
        case 40: case 74:
            downPressed = false;
    }

}

var onKeyPress = function(e) {

    switch (e.which) {
        case 38: case 75: // up arrow + k
            upPressed = true;
            break;
        case 40: case 74: // down arrow + j
            downPressed = true;
            break;
    }
    if (e.which == 32 && !gameStarted) {
        gameStarted = true;
        continuePrompt(false);
        moveBall();
    }

}

var mobileTouch = function(e) {
    e.preventDefault();
    if (!gameStarted) {
        gameStarted = true;
        continuePrompt(false);
        moveBall();
    }
}

var mobileTouchMove = function(e) {
    e.preventDefault();
    y1 = e.pageY-paddleHeight/2;
    player.style.top = y1+"px";
}

document.addEventListener("DOMContentLoaded", function() {
    isTouchDevice = ('ontouchstart' in window || 'onmsgesturechange' in window);
    if (isTouchDevice) {
        document.addEventListener("touchstart", mobileTouch, false);
        document.addEventListener("touchmove", mobileTouchMove, false);
    } else {
        document.addEventListener("keydown", onKeyPress, false);
        document.addEventListener("keyup", onKeyUp, false);
        keyMovement();
    }
    document.getElementById("center").style.left = window.innerWidth/2-5+"px";
    gameStart();
});
