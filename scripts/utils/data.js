const weaponStep = 20;
const explodedTime = 500;

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


export {weaponStep, explodedTime, field,
  congratulations, penetrators, currentWeapon,
  gameSettings, results, currentGame,
  ballonClasses, colors, sizes, points, windDirection};
