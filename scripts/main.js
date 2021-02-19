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
const wind = game.querySelector('.game__wind');
const resultsElement = game.querySelector('.game__results');
const buttonRestart = resultsElement.querySelector('#restart');
const buttonBackToMenu = resultsElement.querySelector('#back-to-menu');
const congratsMessage = resultsElement.querySelector('.game__results-message');
const congratsImg = resultsElement.querySelector('.game__gif');

const field = {
  object: '',
  width: '',
  height: ''
}

const congratulations = ['Чтобы пропустить столько шаров, надо постараться.',
'Неплохо, но вы можете лучше!',
'Впечатляет! Вы великолепны!',
'Вы должно быть действительно ненавидите шары! Шикарный результат!'];

const penetrators = {
  needle: {
    name: 'Игла',
    class: 'game__weapon_type_needle',
    leftOffset: 0,
    pointyEndLength: 80,
    centerOffset: 10,
    difficulty: 'Сложно',
    typeWide: false,
    multiplier: 3,
  },
  bird: {
    name: 'Птичка',
    class: 'game__weapon_type_bird',
    leftOffset: 0,
    pointyEndLength: 80,
    centerOffset: 67,
    difficulty: 'Средне',
    typeWide: false,
    multiplier: 2,
  },
  sawBlade: {
    name: 'Пила',
    class: 'game__weapon_type_sawblade',
    leftOffset: 0,
    pointyEndLength: 100,
    centerOffset: 50,
    difficulty: 'Просто',
    typeWide: true,
    multiplier: 1,
  }
}

const currentWeapon = {
  object: '',
  leftOffset: 0,
  pointyEndLength: 0,
  centerOffset: 10,
}

const gameSettings = {
  time: 60,
  difficulty: 1,
  ongoing: false,
  controlMode: 'mouse',
  weapon: 'needle',
  wind: true,
}

const results = {
  missed: 0,
  popped: 0,
  points: 0,
  timeLeft: 0,
}

const currentGame = {
  stage: 1,
  wind: false
}


const ballonClasses = {
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

const windDirection = [-1, -1, -1, 0, 1, 1, 1];

const initiaizeField = () => {
  field.object = game;
  field.width = game.offsetWidth;
  field.height = game.offsetHeight
}



const moveWeapon = (direction,target=-1) => {
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
    results.points+=points*currentWeapon.multiplier*gameSettings.difficulty;
    poppedElement.textContent=results.popped;
    pointsElement.textContent=results.points;
  }
  else {
    results.missed++
    results.points-=(currentWeapon.multiplier*Math.pow(gameSettings.difficulty,3));
    if(results.points<0){results.points=0};
    missedElement.textContent=results.missed;
    pointsElement.textContent=results.points;
  }
}

const backToMenu = () => {
  game.classList.remove('game_visible');
  resultsElement.classList.remove('game__results_visible');
  menuElement.classList.add('menu_visible');
}

const clearResults = () => {
  results.popped=0;
  poppedElement.textContent=results.popped;
  results.missed=0;
  missedElement.textContent=results.missed;
  results.points=0;
  pointsElement.textContent=results.points;
};

const selectCongratsMessage = (rate, messages) =>{
  const mesCount = messages.length;
  const index = Math.round((mesCount-1)*rate);
  console.log(index);
  console.log(rate);

  return messages[index];
}

const setFinalScore = ({missed,popped,points}) => {
  const missedEl = resultsElement.querySelector('#results-missed');
  const poppedEl = resultsElement.querySelector('#results-popped');
  const pointsEl = resultsElement.querySelector('#results-points');
  missedEl.textContent = missed;
  poppedEl.textContent = popped;
  pointsEl.textContent = points;
  const totalBalloons = missed+popped;
  const rate = popped/totalBalloons;
  const message = selectCongratsMessage(rate, congratulations);
  congratsMessage.textContent = message;
  if (rate>0.5) {
    congratsImg.src='images/congrats-gif.gif'
  }
  else {

    congratsImg.src='images/sad-balloon.png'
  }

}



const setUpCongratsWindow = () => {
  resultsElement.classList.add('game__results_visible');
  setFinalScore(results);
  wind.classList.add('game__wind_noclip');
  buttonRestart.addEventListener('click', beginGame);
  buttonBackToMenu.addEventListener('click', backToMenu);
}



const finishGame = () => {
  gameSettings.ongoing=false;
  setWind(0);
  control.removeEventListener('pointermove',mouseHandler);
  document.removeEventListener('keydown', keyHandler);
  control.classList.remove('control-overlay_visible');
  setUpCongratsWindow();
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
  currentWeapon.multiplier = penetrators[weaponName].multiplier;
  currentWeapon.object = weaponObject;
}

const initializeControls = (controlType) => {
  if(controlType==='mouse') {
    control.classList.add('control-overlay_visible');
    control.addEventListener('pointermove',mouseHandler);
  } else{
    document.addEventListener('keydown', keyHandler);
  }
}

const beginGame = () => {
  resultsElement.classList.remove('game__results_visible');
  game.classList.add('game_visible');
  menuElement.classList.remove('menu_visible');
  initiaizeField();
  applyWeapon();
  startGame(gameSettings.time,gameSettings.difficulty);
  initializeControls(gameSettings.controlMode);
  wind.classList.remove('game__wind_noclip');
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

const setWind = (direction) => {
  switch (direction){
    case (-1):
      wind.classList.remove('game__wind_type_right');
      wind.classList.add('game__wind_type_left');
      break;
    case (0):
      wind.classList.remove('game__wind_type_right');
      wind.classList.remove('game__wind_type_left');
      break
    case (1):
      wind.classList.add('game__wind_type_right');
      wind.classList.remove('game__wind_type_left');
      break
  }
  currentGame.wind = direction;
}

const setWindDirections = (time) => {
  const windChanges = gameSettings.difficulty*4
  for (let i=time/windChanges;i<time;i+=time/windChanges){
    setTimeout(function(){
      setWind(randomType(windDirection));
    },i*1000);
  }
}

const startGame = (time,difficulty) => {
  clearResults();
  gameSettings.ongoing=true;
  const firstStage = Math.round(time/6);
  const secondStage = Math.round(time/3);
  const thirdStage = Math.round(time-(time/4));
  if (gameSettings.wind) {
    setWindDirections(time)
  }
  for(let i=0;i<time;i++) {
    let multiplier = 1;
    let step = 1;
    switch (i){
      case (thirdStage) :
        multiplier = 2;
        step = 3
        currentGame.stage = 3;
        break;
      case (secondStage) :
        multiplier = 2;
        step = 2;
        currentGame.stage = 2;
        break;
      case (firstStage) :
        multiplier = 2;
        step = 1;
        currentGame.stage = 1;
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
  const index = Math.floor((Math.random()*types.length));
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
  balloon.classList.add(ballonClasses[color], ballonClasses[size]);
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
    object.classList.add(ballonClasses['exploded']);
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

const windAffection = (object, wind) => {
  const leftOffset = object.offsetLeft;
  const rightOffset = field.width-object.offsetLeft-object.offsetWidth;
  let step;
  if (wind==-1) {
    step = leftOffset/500;
    object.leftPosition-=0.5*step;
  }
  else {
    step = rightOffset/500;
    object.leftPosition+=0.5*step;
  }
  object.style.left = object.leftPosition+'px';
}

const moveBalloon = (object, speed, step) => {
  setTimeout(function(){
    if(currentGame.wind){
      windAffection(object,currentGame.wind);
    }
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




const init = () => {
  startGameBtn.addEventListener('click', beginGame);
  openSettingsBtn.addEventListener('click',openSettings);
}

init()
