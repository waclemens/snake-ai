//base snake game saused from:
//https://www.educative.io/blog/javascript-snake-game-tutorial

const boardBorder = '#ffffff';
const boardBackground = '#000000';
const snakeBorder = '#000000';
const snakeBackground = '#04ff00';
const foodBorder = '#000000';
const foodBackground = '#ff0000';

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

const keys = {
  'up': UP_KEY,
  'down': DOWN_KEY,
  'left': LEFT_KEY,
  'right': RIGHT_KEY,
};

let snakeboardCtx;
let snakeboard;
let snake = [
  {x: 40, y: 0},
  {x: 30, y: 0},
  {x: 20, y: 0},
  {x: 10, y: 0},
];

let dx = 0; //horizontal velocity
let dy = 0; //vertical velocity

let score = 0;
let changingDirection = false; //true if changing direction
let food = {};

//init game
window.addEventListener('load', () => {
  snakeboard = document.querySelector('.snakeboard'); //get the canvas element
  snakeboardCtx = snakeboard.getContext('2d'); //return a two dimensional drawing context
  main(); //start game
  genFood();
  document.addEventListener('keydown', changeDirection);
});

//main function called repeatedly to keep the game running
const main = async () => {
  let isGameEnded = false;
  if(hasGameEnded()) {
    resetGame();
    isGameEnded = true;
  }
  changingDirection = false;

  await setTimeout(async () => {
    await clearBoard();
    await drawSnake();
    await drawFood();

    //await simpleAi();
    //await snakeMl();
    //await cycleAi();
    await cycleAiAdvance();
    
    await moveSnake();

    //await calcReward(isGameEnded);
    main(); //repeat
  }, 0)
};

const resetGame = () => {
  snake = [
    {x: 40, y: 0},
    {x: 30, y: 0},
    {x: 20, y: 0},
    {x: 10, y: 0},
  ];
  score = 0;
  dx = 10;
  dy = 0;
  genFood();
  document.querySelector('.score').innerHTML = score;
};

const sendMove = async (direction) => {
  let eventObj = document.createEvent('Events');
  eventObj.initEvent('keydown', true, true);
  eventObj.keyCode = keys[direction];
  document.dispatchEvent(eventObj);
};

//draw a border around the canvas
const clearBoard = async () => {
  snakeboardCtx.fillStyle = boardBackground; //select the color to fill the drawing
  snakeboardCtx.strokestyle = boardBorder; //select the color for the border of the canvas
  snakeboardCtx.fillRect(0, 0, snakeboard.width, snakeboard.height); //draw a 'filled' rectangle to cover the entire canvas
  snakeboardCtx.strokeRect(0, 0, snakeboard.width, snakeboard.height); //draw a 'border' around the entire canvas
};

//draw the snake on the canvas
const drawSnake = async () => {
  snake.forEach(drawSnakePart); //draw each part
};

const drawFood = async () => {
  snakeboardCtx.fillStyle = foodBackground;
  snakeboardCtx.strokestyle = foodBorder;
  snakeboardCtx.fillRect(food.x, food.y, 10, 10);
  snakeboardCtx.strokeRect(food.x, food.y, 10, 10);
};

//draw one snake part
const drawSnakePart = (snakePart) => {
  snakeboardCtx.fillStyle = snakeBackground; //set the color of the snake part
  snakeboardCtx.strokestyle = snakeBorder; //set the border color of the snake part

  //draw a 'filled' rectangle to represent the snake part at the coordinates
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
  if(snake.length === snakeboard.width / 10 * snakeboard.height / 10) {alert('You Win'); throw 'game ended...';}
  food['x'] = randomFood(0, snakeboard.width - 10); //generate a random number the food x-coordinate
  food['y'] = randomFood(0, snakeboard.height - 10); //generate a random number for the food y-coordinate
  
  //if the new food location is where the snake currently is, generate a new food location
  snake.forEach((part) => {
    const hasEaten = part.x == food.x && part.y == food.y;
    if(hasEaten) genFood();
  });
};

const changeDirection = (event) => {
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

const moveSnake = async () => {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy}; //create the new Snake's head
  snake.unshift(head); //add the new head to the beginning of snake body
  const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;

  if(hasEatenFood) {
    score += 1; //increase score
    document.querySelector('.score').innerHTML = score; //display score on screen
    genFood(); //generate new food location
  } 
  else {
    snake.pop(); //remove the last part of snake body
  }
};

//check if snake gana hit itself
const checkCollide = (pos) => {
    return (element) => element.x === pos.x && element.y === pos.y;
};
