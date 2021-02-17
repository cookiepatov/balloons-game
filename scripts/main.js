const game = document.querySelector('.game');
const control = game.querySelector('.game__control-overlay')
const needleObject = game.querySelector('.game__needle');
const balloonTemplate = document.querySelector('.game__balloon-template').content;
const animationStep = 1;
const needleStep = 20;
const explodedTime = 500;
const scoreBoard = document.querySelector('.game__scoreboard');
const poppedElement = scoreBoard.querySelector('#score-popped');
const missedElement = scoreBoard.querySelector('#score-missed');
const field = {
  object: game,
  width: game.offsetWidth,
  height: game.offsetHeight,
}

const needle = {
  object: needleObject,
  leftOffset: 0,
  pointyEndlength: 80,
}

const gameSettings = {
  time: 60,
  difficulty: 2,
  ongoing: false,
}

const results = {
  missed: 0,
  popped: 0,
}


const ballonSettings = {
  'red':'game__balloon_color_red',
  'blue':'game__balloon_color_blue',
  'green':'game__balloon_color_green',
  'purple':'game__balloon_color_purple',
  'yellow':'game__balloon_color_yellow',
  's':'game__balloon_size_small',
  'm':'game__balloon_size_middle',
  'l':'game__balloon_size_large',
  'exploded':'game__balloon_exploded'
}

const colors = ['red','blue','green','purple','yellow'];

const sizes = ['s', 'm', 'l'];

const moveNeedle = (direction,target=-1) => {
  let offset = needle.leftOffset;
  if(target===-1)
  {
    offset = direction==='left' ? offset-needleStep : offset+needleStep;
  }
  else
  {
    offset=target;
  }
  needle.leftOffset=offset;
  offset+='px';
  needle.object.style.left=offset;
}

const updateResults = (penetrated) =>{
  if(penetrated) {
    results.popped++
    poppedElement.textContent=results.popped;
  }
  else {
    results.missed++
    missedElement.textContent=results.missed;
  }
}



const clearResults = () => {
  results.popped=0;
  poppedElement.textContent=results.popped;
  results.missed=0;
  missedElement.textContent=results.missed;
};

const finishGame = () =>{
  gameSettings.ongoing=false;
}

const startGame = (time,difficulty) =>{
  clearResults();
  gameSettings.ongoing=true;
  const firstStage = time/6;
  const secondStage = time/3;
  const thirdStage = time-(time/4);
  for(let i=0;i<time;i++) {
    let multiplier;
    switch (true){
      case (i>thirdStage) :
        multiplier=4;
        break;
      case (i>secondStage) :
        multiplier=3;
        break;
      case (i>firstStage) :
        multiplier = 2;
        break;
      default :
        multiplier = 1;
    }
    for(let n=0;n<multiplier;n++)
    {
      const color = randomType(colors);
      const size = randomType(sizes);
      const speed = randomSpeed(i*difficulty);
      const position = randomPosition(field.width);
      setTimeout(function(){
        launchBalloon(color, size, speed,position);},i*1000);
    }
  };
}

const mouseHandler = (e) =>{
  moveNeedle('right',e.offsetX);
}

const randomType = (types) =>{
  const index = Math.round((Math.random()*types.length));
  return types[index];
}

const randomPosition = (max)=>{
  return Math.round(Math.random()*max);
}

const randomSpeed = (difficulty) =>{
  const result = Math.random() * (difficulty - difficulty/2) + difficulty/2 +10
  console.log(result)
  return result;
}

const keyHandler = (e) =>{
  switch (e.key) {
    case 'ArrowLeft' :
      moveNeedle('left');
      break;
    case 'ArrowRight' :
      moveNeedle('right');
      break;
    case ' ' :
      if(!gameSettings.ongoing){
        startGame(gameSettings.time,gameSettings.difficulty);
      }

  }
}

const createBallon = (color, size, position) => {
  const balloon = balloonTemplate.querySelector('.game__balloon').cloneNode(true);
  balloon.classList.add(ballonSettings[color], ballonSettings[size]);
  balloon.style.bottom=0;
  balloon.bottomPosition=0;
  field.object.appendChild(balloon);
  balloon.leftPosition=(position+balloon.offsetWidth)>field.width ? field.width-balloon.offsetWidth : position;
  balloon.style.left=balloon.leftPosition+'px';
  return balloon;
}

const launchBalloon = (color='yellow', size='m', speed=1, position=0) => {
  const balloon = createBallon(color, size, position);
  moveBalloon(balloon, speed);
}

const checkForNeedle = (object) => {
  const needleXPos=needle.leftOffset+(needle.object.offsetWidth/2);
  const needleYPos=field.height-needle.object.offsetHeight;
  const objectStart= object.leftPosition;
  const objectFinish=object.leftPosition+object.offsetWidth;
  const objectTop=object.bottomPosition+object.offsetHeight;
  if(needleXPos>objectStart&&
    needleXPos<objectFinish&&
    needleYPos<objectTop&&((objectTop-needleYPos)<needle.pointyEndlength))
    {

      return true
  }
  return false;
}

const killBalloon = (object, violent) =>{
  if(violent) {
    object.classList.add(ballonSettings['exploded']);
    updateResults(true);
    setTimeout(function(){
      object.remove();
      if(game.querySelector('.game__balloon')===null)
      {
        finishGame();
      }
    },explodedTime);
  }
  else{
    updateResults(false);
    object.remove();
    if(game.querySelector('.game__balloon')===null)
    {
      finishGame();
    }
  }
}

const moveBalloon = (object, speed) => {
  setTimeout(function(){
    object.bottomPosition+=animationStep;
    object.style.bottom = object.bottomPosition+'px';
    const impaled=checkForNeedle(object)
    if(impaled||object.bottomPosition>(field.height))
    {
      killBalloon(object,impaled)
    }
    else{
      moveBalloon(object, speed)
    }
  },50/speed);
}

control.addEventListener('pointermove',mouseHandler);

document.addEventListener('keydown', keyHandler);

