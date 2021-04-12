//base snake game saused from:
//https://www.educative.io/blog/javascript-snake-game-tutorial

const boardBorder = '#ffffff';
const boardBackground = "#000000";
const snakeBorder = '#000000';
const snakeBackground = '#04ff00';
const foodBorder = '#000000';
const foodBackground = '#ff0000';

let snakeboardCtx;
let snakeboard;
let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200},
];

let score = 0;
let changingDirection = false; //true if changing direction

//horizontal velocity
let foodX;
let foodY;
let dx = 10;

let dy = 0; //vertical velocity

//init game
window.addEventListener("load", () => {
  snakeboard = document.querySelector(".snakeboard"); //get the canvas element
  snakeboardCtx = snakeboard.getContext("2d"); //return a two dimensional drawing context
  main(); //start game
  genFood();
  document.addEventListener("keydown", changeDirection);
});

//main function called repeatedly to keep the game running
const main = () => {
  if(hasGameEnded()) return;
  changingDirection = false;

  setTimeout(() => {
    clearBoard();
    drawFood();
    moveSnake();
    drawSnake();
    main(); //repeat
  }, 60)
};

//draw a border around the canvas
const clearBoard = () => {
  snakeboardCtx.fillStyle = boardBackground; //select the color to fill the drawing
  snakeboardCtx.strokestyle = boardBorder; //select the color for the border of the canvas
  snakeboardCtx.fillRect(0, 0, snakeboard.width, snakeboard.height); //draw a "filled" rectangle to cover the entire canvas
  snakeboardCtx.strokeRect(0, 0, snakeboard.width, snakeboard.height); //draw a "border" around the entire canvas
};

//draw the snake on the canvas
const drawSnake = () => {
  snake.forEach(drawSnakePart); //draw each part
};

const drawFood = () => {
  snakeboardCtx.fillStyle = foodBackground;
  snakeboardCtx.strokestyle = foodBorder;
  snakeboardCtx.fillRect(foodX, foodY, 10, 10);
  snakeboardCtx.strokeRect(foodX, foodY, 10, 10);
};

//draw one snake part
const drawSnakePart = (snakePart) => {
  snakeboardCtx.fillStyle = snakeBackground; //set the color of the snake part
  snakeboardCtx.strokestyle = snakeBorder; //set the border color of the snake part

  //draw a "filled" rectangle to represent the snake part at the coordinates
  snakeboardCtx.fillRect(snakePart.x, snakePart.y, 10, 10); //the part is located
  snakeboardCtx.strokeRect(snakePart.x, snakePart.y, 10, 10); //draw a border around the snake part
};

const hasGameEnded = () => {
  for(let i = 4; i < snake.length; i++) {
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
};

const randomFood = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
};

const genFood = () => {
  foodX = randomFood(0, snakeboard.width - 10); //generate a random number the food x-coordinate
  foodY = randomFood(0, snakeboard.height - 10); //generate a random number for the food y-coordinate
  
  //if the new food location is where the snake currently is, generate a new food location
  snake.forEach((part) => {
    const hasEaten = part.x == foodX && part.y == foodY;
    if(hasEaten) genFood();
  });
};

const changeDirection = (event) => {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if(changingDirection) return; //prevent the snake from reversing

  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if(keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if(keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if(keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if(keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

const moveSnake = () => {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy}; //create the new Snake's head
  snake.unshift(head); //add the new head to the beginning of snake body
  const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;

  if(hasEatenFood) {
    score += 1; //increase score
    document.querySelector('.score').innerHTML = score; //display score on screen
    genFood(); //generate new food location
  } 
  else {
    snake.pop(); //remove the last part of snake body
  }
};