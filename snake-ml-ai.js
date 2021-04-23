const moves = ['up', 'down', 'left', 'right'];
var env = {};
env.getNumStates = () => { return 12; }
env.getMaxNumActions = () => { return 4; }
let reward = 0.0;
let prevScore = 0;
let prevDist = 0.0;

//create the DQN agent
var spec = { alpha: 0.01 } //see full options on DQN page
agent = new RL.DQNAgent(env, spec); 

const snakeMl = async () => {
  const state = getGameState();
  const action = agent.act(state);
  const head = {'x': snake[0].x, 'y': snake[0].y};
  
  sendMove(moves[action]);
  prevDist = calcDist(head);
};

const getGameState = async () => {
  let state = [0,0,0,0,0,0,0,0,0,0,0,0];
  const head = {'x': snake[0].x, 'y': snake[0].y};

  const posUp = {'x': head.x, 'y': head.y - 10};
  const posDown = {'x': head.x, 'y': head.y + 10};
  const posLeft = {'x': head.x - 10, 'y': head.y};
  const posRight = {'x': head.x + 10, 'y': head.y};

  const nextToToptWall = head.y === 0;
  const nextToBottomWall = head.y === snakeboard.height - 10;
  const nextToLeftWall = head.x === 0;
  const nextToRightWall = head.x === snakeboard.width - 10;

  const obsticleUp = snake.some(checkCollide(posUp));
  const obsticleDown = snake.some(checkCollide(posDown));
  const obsticleLeft = snake.some(checkCollide(posLeft));
  const obsticleRight = snake.some(checkCollide(posRight));

  if(head.y > food.y) state[0] = 1; //food up snake
  if(head.y < food.y) state[1] = 1; //food down snake
  if(head.x > food.x) state[2] = 1; //food left of snake
  if(head.x < food.x) state[3] = 1; //food right of snake

  //check walls
  if(nextToToptWall) state[4] = 1; //obsticle directly up
  if(nextToBottomWall) state[5] = 1; //obsticle directly down
  if(nextToLeftWall) state[6] = 1; //obsticle directly left
  if(nextToRightWall) state[7] = 1; //obsticle directly right
  //check snake body
  if(obsticleUp) state[4] = 1; //obsticle directly up
  if(obsticleDown) state[5] = 1; //obsticle directly down
  if(obsticleLeft) state[6] = 1; //obsticle directly left
  if(obsticleRight) state[7] = 1; //obsticle directly right

  if(dy === -10) state[8] = 1; //moving up
  if(dy === 10) state[9] = 1; //moving down
  if(dx === -10) state[10] = 1; //moving left
  if(dx === 10) state[11] = 1; //moving right

  return state;
};

const calcReward = async (isGameEnded) => {
  const head = {'x': snake[0].x, 'y': snake[0].y};
  const currDist = calcDist(head);

  if(prevScore < score) reward += 10, prevScore = score;
  if(prevDist > currDist) reward += 1;
  if(prevDist < currDist) reward -= 1;
  if(isGameEnded) reward -= 100;
  await agent.learn(reward);

  if(isGameEnded) reward = 0.0, prevScore = 0, prevDist = 0.0;
};

const calcDist = (pos) => {
  return (((pos.x - food.x) ** 2) + ((pos.y - food.y) ** 2)) ** (1/2);
};
