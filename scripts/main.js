const game = document.querySelector('.game');
const control = document.querySelector('.control-overlay')
const weaponObject = game.querySelector('.game__weapon');
const balloonTemplate = document.querySelector('.game__balloon-template').content;
const weaponStep = 20;
const explodedTime = 500;
const scoreBoard = document.querySelector('.game__scoreboard');
const poppedElement = scoreBoard.querySelector('#score-popped');
const missedElement = scoreBoard.querySelector('#score-missed');
const pointsElement = scoreBoard.querySelector('#score-points');
const timeLeftElement = scoreBoard.querySelector('#score-time-left');
const menuElement = document.querySelector('.menu')
const startGameBtn = menuElement.querySelector('#start-game');
const openSettingsBtn = menuElement.querySelector('#settings');
const settingsElement = document.querySelector('.settings');
const form = settingsElement.querySelector('.form')

const field = {
  object: '',
  width: '',
  height: ''
}

const penetrators = {
  needle: {
    name: 'Игла',
    class: 'game__weapon_type_needle',
    leftOffset: 0,
    pointyEndLength: 80,
    centerOffset: 10,
    difficulty: 'Сложно',
    typeWide: false,
  },
  bird: {
    name: 'Птичка',
    class: 'game__weapon_type_bird',
    leftOffset: 0,
    pointyEndLength: 80,
    centerOffset: 67,
    difficulty: 'Средне',
    typeWide: false,
  },
  sawBlade: {
    name: 'Пила',
    class: 'game__weapon_type_sawblade',
    leftOffset: 0,
    pointyEndLength: 100,
    centerOffset: 50,
    difficulty: 'Просто',
    typeWide: true,
  }
}

const currentWeapon = {
  object: weaponObject,
  leftOffset: 0,
  pointyEndLength: 0,
  centerOffset: 10,
}

const gameSettings = {
  time: 10,
  difficulty: 1,
  ongoing: false,
  controlMode: 'mouse',
  weapon: 'sawBlade',
  wind: false,
}

const results = {
  missed: 0,
  popped: 0,
  points: 0,
  timeLeft: 0,
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

const points = {
  's': 3,
  'm': 2,
  'l': 1,
}

const initiaizeField = () => {
  field.object = game;
  field.width = game.offsetWidth;
  field.height = game.offsetHeight
}


const selectWeapon = () => { //TODO

}


const moveWeapon = (direction,target=-1) => { //TODO
  let offset = currentWeapon.leftOffset;
  if(target===-1)
  {
    offset = direction==='left' ? offset-weaponStep : offset+weaponStep;
  }
  else
  {
    offset=target-game.offsetLeft-(currentWeapon.centerOffset);
  }
  currentWeapon.leftOffset=offset;
  offset+='px';
  currentWeapon.object.style.left=offset;
}

const updateResults = (penetrated, points=0) => {
  if(penetrated) {
    results.popped++
    results.points+=points;
    poppedElement.textContent=results.popped;
    pointsElement.textContent=results.points;
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

const finishGame = () => {
  gameSettings.ongoing=false;
}

const updateTimer = (time) => {
  results.timeLeft = time;
  timeLeftElement.textContent = time + ' с';

}

const applyWeapon = () => {
  const weaponName = gameSettings.weapon;
  weaponObject.className='';
  weaponObject.className=`game__weapon ${penetrators[weaponName].class}`;
  currentWeapon.centerOffset = penetrators[weaponName].centerOffset;
  currentWeapon.leftOffset = penetrators[weaponName].leftOffset;
  currentWeapon.pointyEndLength = penetrators[weaponName].pointyEndLength;
  currentWeapon.typeWide = penetrators[weaponName].typeWide;
}

const beginGame = () => {
  game.classList.add('game_visible');
  control.classList.add('control-overlay_visible');
  menuElement.classList.remove('menu_visible');
  initiaizeField();
  applyWeapon();
  startGame(gameSettings.time,gameSettings.difficulty);
  control.addEventListener('pointermove',mouseHandler);
}

const openSettings = () => {
  settingsElement.classList.add('settings_visible');
  menuElement.classList.remove('menu_visible');
  form.addEventListener('submit', submitSettings);
}

const setSettings = () => {
  const control = form.querySelector('input[name="control"]:checked').value;
  const weapon = form.querySelector('input[name="tool"]:checked').value;
  const wind = form.querySelector('input[name="wind"]:checked').value;
  const time = form.querySelector('input[name="time"]:checked').value;
  const difficulty = form.querySelector('input[name="difficulty"]:checked').value;
  gameSettings.time = time;
  gameSettings.weapon = weapon;
  gameSettings.wind = wind;
  gameSettings.difficulty = difficulty;
  gameSettings.controlMode = control
}

const submitSettings = (e) => {
  e.preventDefault();
  setSettings();
  settingsElement.classList.remove('settings_visible');
  menuElement.classList.add('menu_visible');
  form.removeEventListener('submit', submitSettings);
}

const startGame = (time,difficulty) => {
  clearResults();
  gameSettings.ongoing=true;
  const firstStage = time/6;
  const secondStage = time/3;
  const thirdStage = time-(time/4);
  for(let i=0;i<time;i++) {
    let multiplier = 1;
    let step = 1;
    switch (true){
      case (i>thirdStage) :
        multiplier = 2;
        step = 3
        break;
      case (i>secondStage) :
        multiplier = 2;
        step = 2;
        break;
      case (i>firstStage) :
        multiplier = 2;
        step = 1;
        break;
    }

    for(let n=0;n<(multiplier*difficulty);n++)
    {
      const color = randomType(colors);
      const size = randomType(sizes);
      const speed = randomSpeed(difficulty);
      const position = randomPosition(field.width);
      setTimeout(function(){
        updateTimer(time-i-1);
        launchBalloon(color, size, speed, position, step);},i*1000);
    }
  };
}

const mouseHandler = (e) =>{
  moveWeapon('right',e.offsetX);
}

const randomType = (types) =>{
  const index = Math.round((Math.random()*types.length));
  return types[index];
}

const randomPosition = (max)=>{
  return Math.round(Math.random()*max);
}

const randomSpeed = (difficulty) =>{
  const result = Math.random() * (difficulty - difficulty/2) + difficulty/2 + 1;
  return Math.pow(result, 4);
}

const keyHandler = (e) =>{
  switch (e.key) {
    case 'ArrowLeft' :
      moveWeapon('left');
      break;
    case 'ArrowRight' :
      moveWeapon('right');
      break;
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
  balloon.points = points[size];
  return balloon;
}

const launchBalloon = (color='yellow', size='m', speed=1, position=0, step=1) => {
  const balloon = createBallon(color, size, position);
  moveBalloon(balloon, speed, step);
}

const checkForWeapon = (object) => {
  const w = {};
  const b = {};
  if(currentWeapon.typeWide) {
    w.x1 = currentWeapon.object.offsetLeft;
    w.x2 = currentWeapon.object.offsetWidth+currentWeapon.object.offsetLeft;
    b.y2 = object.bottomPosition;
  } else {
    w.x1 = currentWeapon.object.offsetLeft+currentWeapon.centerOffset;
    w.x2 = currentWeapon.object.offsetLeft+currentWeapon.centerOffset+1;
    b.y2 = object.bottomPosition+object.offsetHeight+1;
  }
  w.y1 = field.height-currentWeapon.object.offsetHeight+currentWeapon.pointyEndLength;
  w.y2 = field.height-currentWeapon.object.offsetHeight;
  b.x1 = object.offsetLeft;
  b.x2 = object.leftPosition+object.offsetWidth;
  b.y1 = object.bottomPosition+object.offsetHeight;
  if(w.x1>b.x2||b.x1>w.x2||w.y2>b.y1||b.y2>w.y1) {
    return false;
  }
  else {
    return true
  }
}

const killBalloon = (object, violent) =>{
  if(violent) {
    object.classList.add(ballonSettings['exploded']);
    updateResults(true, object.points);
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

const moveBalloon = (object, speed, step) => {
  setTimeout(function(){
    object.bottomPosition+=step;
    object.style.bottom = object.bottomPosition+'px';
    const impaled=checkForWeapon(object)
    if(impaled||object.bottomPosition>(field.height))
    {
      killBalloon(object,impaled)
    }
    else{
      moveBalloon(object, speed, step)
    }
  },50/speed);
}



document.addEventListener('keydown', keyHandler);



const init = () => {
  startGameBtn.addEventListener('click', beginGame);
  openSettingsBtn.addEventListener('click',openSettings);
}

init()
