let catImg = document.getElementById('cat');
let hungerBar = document.getElementById('hunger');
let boredomBar = document.getElementById('boredom');
let sleepinessBar = document.getElementById('sleepiness');
let questionBlock = document.getElementById('secretQuestion');

let currentRequest = null;
let isBusy = false;

let secretcheck = 0

function setInitialValues() {
  hungerBar.value = 20;
  boredomBar.value = 20;
  sleepinessBar.value = 20;
}

function randomDecrease() {
  let stats = ['hunger', 'boredom', 'sleepiness'];
  let stat = stats[Math.floor(Math.random() * stats.length)];

  if (stat === 'hunger' && hungerBar.value > 0) hungerBar.value -= 10;
  if (stat === 'boredom' && boredomBar.value > 0) boredomBar.value -= 10;
  if (stat === 'sleepiness' && sleepinessBar.value > 0) sleepinessBar.value -= 10;

  updateRequest();
}

function updateRequest() {
  let needs = [];
  if (hungerBar.value < 100) needs.push('feed');
  if (boredomBar.value < 100) needs.push('play');
  if (sleepinessBar.value < 100) needs.push('wash');

  if (needs.length > 0) {
    currentRequest = needs[Math.floor(Math.random() * needs.length)];
    displayRequest();
  } else {
    currentRequest = null;
    hideRequest();
  }
}

function displayRequest() {
  let text = '';
  switch (currentRequest) {
    case 'feed': text = 'Покорми меня!🥩'; break;
    case 'play': text = 'Погладь меня!✋'; break;
    case 'wash': text = 'Помой меня!🛁'; break;
  }
  document.getElementById('statusText').textContent = text;
}

function hideRequest() {
  document.getElementById('statusText').textContent = '';
}

function feedCat() {
  if (currentRequest !== 'feed' || isBusy) return;
  doAction('assets/cat_eat.png', hungerBar);
}

function playWithCat() {
  if (currentRequest !== 'play' || isBusy) return;
  doAction('assets/cat_play.png', boredomBar);
}

function washCat() {
  if (currentRequest !== 'wash' || isBusy) return;
  doAction('assets/cat_wash.png', sleepinessBar);
}

function doAction(imgSrc, bar) {
  isBusy = true;
  catImg.src = imgSrc;
  bar.value += 10;
  checkForSecret()
  setTimeout(() => {
    catImg.src = 'assets/cat_idle.png';
    isBusy = false;
    updateRequest();
  }, 1500);
}

function checkForSecret() {
  if (hungerBar.value === 100 && boredomBar.value === 100 && sleepinessBar.value === 100) {
    questionBlock.style.display = 'flex';
  }
}

function toggleSecretMenu() {
  let menu = document.getElementById('secretMenu');
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

function submitSecret() {
  let code = document.getElementById('secretCode').value.trim();
  if (code === '090125') {
    showSecretDialog();
    catImg.src = 'assets/cat_play.png';
  } else {
    alert('❌ Неверный код!');
  }
}

function showSecretDialog() {
  document.getElementById('secretText').innerHTML = 'Ты разблокировала секретную комнату, нажми <a href="https://t.me/paranoidghoul">сюда</a>';
  document.getElementById('secretDialog').style.display = 'flex';
}

function closeSecretDialog() {
  document.getElementById('secretDialog').style.display = 'none';
}


function acceptSecret() {
  alert('😸 Код от комнаты, подсказка: дата нашего знакомства в формате ДДММГГ🔐!');
  questionBlock.style.display = 'none';
}

function declineSecret() {
  alert('😾 Может в другой раз!');
  questionBlock.style.display = 'none';
}

// старт игры


window.onload = function() {
  setTimeout(() => {
    document.getElementById('splashScreen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('splashScreen').style.display = 'none';
      // Показать диалог сразу после загрузки
      showGameDialog();
    }, 1000);
  }, 2000);
}


const dialogScript = [
  {
    text: "Мяу! Привет, меня зовут Чаек☕",
    answers: ["Дальше"]
  },
  {
    text: "Ты любишь котиков?😸",
    answers: ["Да!"]
  },
  {
    text: "Мяу! Я очень вредный кот, и вечно что-то хочу: кушать,играть и мыться! Ты уверена что выдержишь меня?😺",
    answers: ["Да!"]
  },
  {
    text: "Мяу! Нууу, посмотрим. Если ты сможешь то я расскажу тебе кое что)😺",
    answers: ["Пошли уже!"]
  }
];

let dialogStep = 0;

function showGameDialog() {
  const dialog = dialogScript[dialogStep];
  document.getElementById('gameDialogText').textContent = dialog.text;

  const buttonsDiv = document.getElementById('gameDialogButtons');
  buttonsDiv.innerHTML = '';
  dialog.answers.forEach((answerText, index) => {
    const btn = document.createElement('button');
    btn.textContent = answerText;
    btn.onclick = () => handleDialogAnswer(index);
    buttonsDiv.appendChild(btn);
  });

  document.getElementById('gameDialog').style.display = 'flex';
}

function handleDialogAnswer(index) {
  dialogStep++;
  if (dialogStep >= dialogScript.length) {
    document.getElementById('gameDialog').style.display = 'none';
    setInitialValues();
    setInterval(randomDecrease, 5000);
    // игра уже запущена — диалог исчезает, всё продолжается
  } else {
    showGameDialog();
  }
}
