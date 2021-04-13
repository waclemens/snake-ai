//first attempt at ai, no research, out the butt programming, kinda terrible
const simpleAi = async () => {
  let nextMove = undefined;
  const head = {x: snake[0].x, y: snake[0].y};
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  let futureVel = {x: 0, y: 0};

  //goto food
  if(head.x < food.x) {
    nextMove = 'right';
    futureVel.x = 10;
    futureVel.y = 0;
  }
  else if(head.x > food.x) {
    nextMove = 'left';
    futureVel.x = -10;
    futureVel.y = 0;
  }
  else if(head.y < food.y) {
    nextMove = 'down';
    futureVel.x = 0;
    futureVel.y = 10;
  }
  else if(head.y > food.y) {
    nextMove = 'up';
    futureVel.x = 0;
    futureVel.y = -10;
  }

  //check if snake gana hit itself
  const checkCollide = (pos) => {
      return (element) => element.x === pos.x && element.y === pos.y;
  };
  const futureHead = {x: snake[0].x + futureVel.x, y: snake[0].y + futureVel.y};
  const willCollide = snake.some(checkCollide(futureHead));

  //generate future move cross
  if(willCollide) {
    let futurePos = {
      up: [],
      down: [],
      left: [],
      right: [],
    };
    for(let i = head.x + 10; i <= snakeboard.width - 10; i += 10) {
      futurePos.right.push({x: i, y: head.y});
    }
    for(let i = head.y + 10; i <= snakeboard.height - 10; i += 10) {
      futurePos.down.push({x: head.x, y: i});
    }
    for(let i = head.x - 10; i >= 0; i -= 10) {
      futurePos.left.push({x: i, y: head.y});
    }
    for(let i = head.y - 10; i >= 0; i -= 10) {
      futurePos.up.push({x: head.x, y: i});
    }

    let collisionSet = {
      up: [],
      down: [],
      left: [],
      right: [],
    };

    Object.entries(futurePos).forEach(([direction, posSet]) => {
      posSet.forEach(pos => {
        const willCollide = snake.some(checkCollide(pos));
        collisionSet[direction].push(willCollide);
      });
    });

    let survivalMode = false;
    if(collisionSet.up.length > 0 && !collisionSet.up.includes(true)) nextMove = 'up';
    else if(collisionSet.down.length > 0 && !collisionSet.down.includes(true)) nextMove = 'down';
    else if(collisionSet.left.length > 0 && !collisionSet.left.includes(true)) nextMove = 'left';
    else if(collisionSet.right.length > 0 && !collisionSet.right.includes(true)) nextMove = 'right';
    else survivalMode = true;

    let countTillCollide = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    };

    if(survivalMode) {
      Object.entries(collisionSet).forEach(([direction, boolSet]) => {
        let foundFirstCollide = false;
        boolSet.forEach(isCollision => {
          if(foundFirstCollide) return;
          if(isCollision && !foundFirstCollide) {
            countTillCollide[direction] +=1;
            foundFirstCollide = true;
            return;
          }
          if(!foundFirstCollide) {
            countTillCollide[direction] +=1;
          }
        });
      });

      const survivalMove = Object.keys(countTillCollide).reduce((a, b) => countTillCollide[a] > countTillCollide[b] ? a : b);
      nextMove = survivalMove;
    }
  }

  sendMove(nextMove);
};
