import {
  ROUND_COUNT, ROUND_SECONDS, START_POSITIONS,
  makeRound, checkAnswer, secondsLeft, advanceRace, bearWon
} from './logic.mjs';

const words = {
  ru: {
    title: 'Зверогонка', welcome: 'Помоги мишке выиграть гонку!',
    instructions: 'Считай конусы и помоги мишке обогнать утку и ёжика!',
    start: 'Играть ▶', question: 'Сколько конусов на дороге?', seconds: 'с',
    correct: 'Верно! Мишка вырывается вперёд!',
    wrong: 'Ой! Утка и ёжик обогнали мишку!',
    timeout: 'Время вышло! Соперники обгоняют!',
    finishWin: 'Ура, мишка победил!', finishLose: 'Гонка закончилась! Попробуем ещё?',
    again: 'Играть ещё ↻', result: 'Правильных ответов: {stars} из {rounds}.',
    coneLabel: 'Дорожных конусов: {count}', choose: 'Выбери цифру', sound: 'Звук',
    timeLeft: 'Осталось {seconds} секунд', raceLabel: 'Гонка: мишка, утка и ёжик'
  },
  uk: {
    title: 'Звірогонка', welcome: 'Допоможи ведмедику виграти перегони!',
    instructions: 'Порахуй конуси та допоможи ведмедику обігнати качку й їжачка!',
    start: 'Грати ▶', question: 'Скільки конусів на дорозі?', seconds: 'с',
    correct: 'Правильно! Ведмедик виривається вперед!',
    wrong: 'Ой! Качка та їжачок обігнали ведмедика!',
    timeout: 'Час вийшов! Суперники обганяють!',
    finishWin: 'Ура, ведмедик переміг!', finishLose: 'Перегони завершилися! Спробуємо ще?',
    again: 'Грати ще ↻', result: 'Правильних відповідей: {stars} із {rounds}.',
    coneLabel: 'Дорожніх конусів: {count}', choose: 'Обери цифру', sound: 'Звук',
    timeLeft: 'Залишилося {seconds} секунд', raceLabel: 'Перегони: ведмедик, качка та їжачок'
  }
};

const $ = id => document.getElementById(id);
const screens = ['welcomeScreen', 'playScreen', 'finishScreen'];
let language = localStorage.getItem('animal-race-language') === 'uk' ? 'uk' : 'ru';
let soundOn = localStorage.getItem('animal-race-sound') !== 'off';
let roundIndex = 0;
let stars = 0;
let round = null;
let positions = { ...START_POSITIONS };
let resolved = false;
let lastOutcome = null;
let deadline = 0;
let ticker = null;
let advanceTimer = null;

function t(key, values = {}) {
  return words[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name]);
}

function showScreen(id) {
  screens.forEach(name => $(name).classList.toggle('active', name === id));
}

function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  $('languageButton').textContent = language === 'ru' ? 'УКР' : 'РУС';
  $('soundButton').setAttribute('aria-label', t('sound'));
  $('answers').setAttribute('aria-label', t('choose'));
  $('race-scene')?.setAttribute('aria-label', t('raceLabel'));
  if (round) $('countingArea').setAttribute('aria-label', t('coneLabel', { count: round.count }));
  if (lastOutcome) $('feedback').textContent = t(lastOutcome);
  if ($('finishScreen').classList.contains('active')) renderResult();
  if ($('playScreen').classList.contains('active') && !resolved) updateTimer();
}

function playTone(frequency, duration = 0.16) {
  if (!soundOn) return;
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.onended = () => context.close();
  } catch { /* Sound is optional. */ }
}

function renderPositions() {
  for (const [animal, id] of [['bear', 'bearCar'], ['duck', 'duckCar'], ['hedgehog', 'hedgehogCar']]) {
    $(id).style.left = `${Math.min(positions[animal], 89)}%`;
  }
}

function updateTimer() {
  if (resolved) return;
  const now = Date.now();
  const seconds = secondsLeft(deadline, now);
  $('timerText').textContent = seconds;
  $('timerRow').setAttribute('aria-label', t('timeLeft', { seconds }));
  $('timerFill').style.width = `${Math.max(0, (deadline - now) / (ROUND_SECONDS * 1000) * 100)}%`;
  $('timerRow').classList.toggle('danger', seconds <= 3);
  if (now >= deadline) finishRound('timeout');
}

function renderRound() {
  resolved = false;
  lastOutcome = null;
  $('timerRow').style.visibility = 'visible';
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('roundLabel').textContent = `${roundIndex + 1} / ${ROUND_COUNT}`;
  $('starsLabel').textContent = `⭐ ${stars}`;
  $('progressFill').style.width = `${roundIndex / ROUND_COUNT * 100}%`;
  renderPositions();
  $('countingArea').replaceChildren();
  $('countingArea').setAttribute('aria-label', t('coneLabel', { count: round.count }));
  for (let i = 0; i < round.count; i++) {
    const cone = document.createElement('span');
    cone.className = 'cone';
    cone.setAttribute('aria-hidden', 'true');
    $('countingArea').append(cone);
  }
  $('answers').replaceChildren();
  for (const number of round.choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = number;
    button.addEventListener('click', () => answer(number, button));
    $('answers').append(button);
  }
  deadline = Date.now() + ROUND_SECONDS * 1000;
  clearInterval(ticker);
  updateTimer();
  ticker = setInterval(updateTimer, 100);
}

function answer(number, button) {
  if (resolved) return;
  if (Date.now() >= deadline) { finishRound('timeout'); return; }
  finishRound(checkAnswer(round, number) ? 'correct' : 'wrong', button);
}

function finishRound(outcome, button = null) {
  if (resolved) return;
  resolved = true;
  clearInterval(ticker);
  lastOutcome = outcome;
  const correct = outcome === 'correct';
  if (correct) stars++;
  if (button) button.classList.add(correct ? 'right' : 'wrong');
  $('answers').querySelectorAll('button').forEach(choice => { choice.disabled = true; });
  $('feedback').textContent = t(outcome);
  $('feedback').className = `feedback ${correct ? 'success' : 'retry'}`;
  $('timerRow').style.visibility = 'hidden';
  $('starsLabel').textContent = `⭐ ${stars}`;
  $('progressFill').style.width = `${(roundIndex + 1) / ROUND_COUNT * 100}%`;
  positions = advanceRace(positions, correct);
  renderPositions();
  playTone(correct ? 660 : 260);
  advanceTimer = setTimeout(() => {
    roundIndex++;
    if (roundIndex === ROUND_COUNT) {
      renderResult();
      showScreen('finishScreen');
    } else {
      round = makeRound(round.count);
      renderRound();
    }
  }, 1350);
}

function renderResult() {
  const won = bearWon(positions);
  $('finishTitle').textContent = t(won ? 'finishWin' : 'finishLose');
  $('finishArt').textContent = won ? '🏁 🐻 🏆' : '🏁 🦆 🦔 🐻';
  $('resultText').textContent = t('result', { stars, rounds: ROUND_COUNT });
}

function startGame() {
  clearInterval(ticker);
  clearTimeout(advanceTimer);
  roundIndex = 0;
  stars = 0;
  positions = { ...START_POSITIONS };
  round = makeRound();
  showScreen('playScreen');
  renderRound();
}

$('startButton').addEventListener('click', startGame);
$('againButton').addEventListener('click', startGame);
$('languageButton').addEventListener('click', () => {
  language = language === 'ru' ? 'uk' : 'ru';
  localStorage.setItem('animal-race-language', language);
  renderLanguage();
});
$('soundButton').addEventListener('click', () => {
  soundOn = !soundOn;
  localStorage.setItem('animal-race-sound', soundOn ? 'on' : 'off');
  $('soundButton').textContent = soundOn ? '🔊' : '🔇';
  $('soundButton').setAttribute('aria-pressed', String(soundOn));
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && $('playScreen').classList.contains('active')) updateTimer();
});
$('soundButton').textContent = soundOn ? '🔊' : '🔇';
$('soundButton').setAttribute('aria-pressed', String(soundOn));
renderLanguage();
