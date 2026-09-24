import {
  ROUND_COUNT, START_POSITIONS,
  makeRound, checkAnswer, advanceRace, spiderWon
} from './logic.mjs';

const words = {
  ru: {
    title: 'Супергонка', welcome: 'Помоги Человеку-пауку выиграть гонку!',
    instructions: 'Считай конусы и обгоняй Халка и Локи!',
    start: 'Играть ▶', question: 'Сколько конусов на дороге?',
    correct: 'Верно! Человек-паук бежит быстрее!',
    wrong: 'Ой! Халк и Локи обогнали!',
    finishWin: 'Ура, Человек-паук победил!', finishLose: 'Гонка закончилась! Попробуем ещё?',
    again: 'Играть ещё ↻', result: 'Правильных ответов: {stars} из {rounds}.',
    coneLabel: 'Дорожных конусов: {count}', choose: 'Выбери цифру', sound: 'Звук',
    raceLabel: 'Гонка: Человек-паук, Халк и Локи'
  },
  uk: {
    title: 'Суперперегони', welcome: 'Допоможи Людині-павуку виграти перегони!',
    instructions: 'Порахуй конуси та обжени Галка й Локі!',
    start: 'Грати ▶', question: 'Скільки конусів на дорозі?',
    correct: 'Правильно! Людина-павук біжить швидше!',
    wrong: 'Ой! Галк і Локі обігнали!',
    finishWin: 'Ура, Людина-павук перемогла!', finishLose: 'Перегони завершилися! Спробуємо ще?',
    again: 'Грати ще ↻', result: 'Правильних відповідей: {stars} із {rounds}.',
    coneLabel: 'Дорожніх конусів: {count}', choose: 'Обери цифру', sound: 'Звук',
    raceLabel: 'Перегони: Людина-павук, Галк та Локі'
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
  for (const [runner, id] of [['spider', 'spiderRunner'], ['hulk', 'hulkRunner'], ['loki', 'lokiRunner']]) {
    $(id).style.left = `min(${Math.min(positions[runner], 92)}%, calc(100% - var(--runner-width) - 5px))`;
  }
}

function clearEffects() {
  $('raceEffect').className = 'race-effect';
  for (const id of ['spiderRunner', 'hulkRunner', 'lokiRunner']) $(id).classList.remove('boost', 'dust');
}

function renderRound() {
  resolved = false;
  lastOutcome = null;
  clearEffects();
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('roundLabel').textContent = `${roundIndex + 1} / ${ROUND_COUNT}`;
  $('starsLabel').textContent = `⭐ ${stars}`;
  $('progressFill').style.width = `${roundIndex / ROUND_COUNT * 100}%`;
  renderPositions();
  $('countingArea').replaceChildren();
  $('countingArea').setAttribute('aria-label', t('coneLabel', { count: round.count }));
  const coneGrid = document.createElement('div');
  coneGrid.className = 'cone-grid';
  coneGrid.style.setProperty('--columns', Math.min(round.count, 5));
  for (let i = 0; i < round.count; i++) {
    const cone = document.createElement('span');
    cone.className = 'cone';
    cone.setAttribute('aria-hidden', 'true');
    coneGrid.append(cone);
  }
  $('countingArea').append(coneGrid);
  $('answers').replaceChildren();
  for (const number of round.choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = number;
    button.addEventListener('click', () => answer(number, button));
    $('answers').append(button);
  }
}

function answer(number, button) {
  if (resolved) return;
  finishRound(checkAnswer(round, number) ? 'correct' : 'wrong', button);
}

function finishRound(outcome, button = null) {
  if (resolved) return;
  resolved = true;
  lastOutcome = outcome;
  const correct = outcome === 'correct';
  if (correct) stars++;
  if (button) button.classList.add(correct ? 'right' : 'wrong');
  $('answers').querySelectorAll('button').forEach(choice => { choice.disabled = true; });
  $('feedback').textContent = t(outcome);
  $('feedback').className = `feedback ${correct ? 'success' : 'retry'}`;
  $('starsLabel').textContent = `⭐ ${stars}`;
  $('progressFill').style.width = `${(roundIndex + 1) / ROUND_COUNT * 100}%`;
  positions = advanceRace(positions, correct);
  renderPositions();
  clearEffects();
  $('raceEffect').classList.add(correct ? 'boost' : 'overtake');
  if (correct) $('spiderRunner').classList.add('boost');
  else {
    $('hulkRunner').classList.add('dust');
    $('lokiRunner').classList.add('dust');
  }
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
  const won = spiderWon(positions);
  $('finishScreen').classList.toggle('won', won);
  $('finishTitle').textContent = t(won ? 'finishWin' : 'finishLose');
  $('finishArt').textContent = won ? '🏁 🕷️ 🏆' : '🏁 💚 👑 🕷️';
  $('resultText').textContent = t('result', { stars, rounds: ROUND_COUNT });
}

function startGame() {
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
$('soundButton').textContent = soundOn ? '🔊' : '🔇';
$('soundButton').setAttribute('aria-pressed', String(soundOn));
renderLanguage();
