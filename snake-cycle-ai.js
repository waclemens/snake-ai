const getStep = (pos) => {
  return (element) => element.x === pos.x && element.y === pos.y;
};

//just follows the ham circuit
const cycleAi = async () => {
  const head = {'x': snake[0].x, 'y': snake[0].y};
  const currentStep = HAMILTONIAN_CIRCUIT.findIndex(getStep(head));
  const nextStep = (currentStep + 1) % HAMILTONIAN_CIRCUIT.length;
  const nextPos = HAMILTONIAN_CIRCUIT[nextStep];
  const move = getMove(head, nextPos);
  sendMove(move);
};

let cooldown = Math.floor((1.004 ** score) - 1);
const cycleAiAdvance = async () => {
  if(cooldown <= 0) {await doShortCut(); cooldown = Math.floor((1.004 ** score) - 1); return;}
  
  await cycleAi();
  cooldown -= 1;
};

const doShortCut = async () => {
  const moves = getNextMoves();
  for(const move of moves) {
    if(move.isGood) {sendMove(move.dir); break;}
  }
};

const getNextMoves = () => {
  const head = {'x': snake[0].x, 'y': snake[0].y};
  const foodStep = HAMILTONIAN_CIRCUIT.findIndex(getStep(food));
  let moves = [
    {'pos': {'x': head.x, 'y': head.y - 10}, 'dir': 'up'},
    {'pos': {'x': head.x, 'y': head.y + 10}, 'dir': 'down'},
    {'pos': {'x': head.x - 10, 'y': head.y}, 'dir': 'left'},
    {'pos': {'x': head.x + 10, 'y': head.y}, 'dir': 'right'},
  ];

  for(let move of moves) {
    move['step'] = HAMILTONIAN_CIRCUIT.findIndex(getStep(move.pos));
    move['distance'] = getDistanceBetweenSteps(move['step'], foodStep);
  }

  moves.sort((a, b) => {return a.distance - b.distance;});

  return checkMoves(moves);
};

const checkMoves = (moves) => {
  const head = {'x': snake[0].x, 'y': snake[0].y};
  const tail = snake.filter((body) => body.x !== head.x || body.y !== head.y);
  const headStep = HAMILTONIAN_CIRCUIT.findIndex(getStep(head));
  const tailSteps = getTailSteps(tail);

  for(let move of moves) {
    if(move.distance < 0) {move['isGood'] = false; continue;}
    move['isGood'] = checkMove(move, headStep, tailSteps);
  }

  return moves;
};

const checkMove = (move, head, excludeSteps) => {
  if(move.step === -1) return false;
  if(snake.some(checkCollide(move.pos))) return false;

  for(const excludeStep of excludeSteps) {
    if(excludeStep >= move.step && excludeStep <= head) return false;
  }

  return true;
};

const getTailSteps = (tail) => {
  let steps = [];

  for(const part of tail) {
    steps.push(HAMILTONIAN_CIRCUIT.findIndex(getStep(part)));
  }

  return steps;
};

const getDistanceBetweenSteps = (start, end) => {
  const distance = (end - start) % HAMILTONIAN_CIRCUIT.length;
  const distanceGoingAround = (end - start) % HAMILTONIAN_CIRCUIT.length + HAMILTONIAN_CIRCUIT.length;

  if(distance < 0) return distanceGoingAround;
  return distance;
};

const getMove = (currPos, nextPos) => {
  const dx = nextPos.x - currPos.x;
  const dy = nextPos.y - currPos.y;

  if(dy === -10) return 'up';
  if(dy === 10) return 'down';
  if(dx === 10) return 'right';
  if(dx === -10) return 'left';
  throw 'how...';
};