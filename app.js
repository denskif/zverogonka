import { ROUND_COUNT, makeRound, checkAnswer } from './logic.mjs';

const words = {
  ru: { title: 'Зверогонка', welcome: 'Помоги мишке выиграть гонку!', instructions: 'Считай дорожные конусы и выбирай правильную цифру.', start: 'Играть ▶', question: 'Сколько конусов на дороге?', correct: 'Верно! Машина едет быстрее!', tryAgain: 'Попробуй ещё раз', finish: 'Ура, мишка на финише!', again: 'Играть ещё ↻', result: 'Ты помог мишке и собрал {stars} звёзд!', coneLabel: 'Дорожных конусов: {count}', choose: 'Выбери цифру', sound: 'Звук' },
  uk: { title: 'Звірогонка', welcome: 'Допоможи ведмедику виграти перегони!', instructions: 'Порахуй дорожні конуси та обери правильну цифру.', start: 'Грати ▶', question: 'Скільки конусів на дорозі?', correct: 'Правильно! Машина їде швидше!', tryAgain: 'Спробуй ще раз', finish: 'Ура, ведмедик на фініші!', again: 'Грати ще ↻', result: 'Ти допоміг ведмедику та зібрав {stars} зірок!', coneLabel: 'Дорожніх конусів: {count}', choose: 'Обери цифру', sound: 'Звук' }
};

const $ = id => document.getElementById(id);
const screens = ['welcomeScreen', 'playScreen', 'finishScreen'];
let language = localStorage.getItem('animal-race-language') === 'uk' ? 'uk' : 'ru';
let soundOn = localStorage.getItem('animal-race-sound') !== 'off';
let roundIndex = 0;
let stars = 0;
let round = null;
let answered = false;
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
  if (round) $('countingArea').setAttribute('aria-label', t('coneLabel', { count: round.count }));
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

function renderRound() {
  answered = false;
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('roundLabel').textContent = `${roundIndex + 1} / ${ROUND_COUNT}`;
  $('starsLabel').textContent = `⭐ ${stars}`;
  $('progressFill').style.width = `${roundIndex / ROUND_COUNT * 100}%`;
  $('raceCar').style.left = `${7 + roundIndex * 15}%`;
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
}

function answer(number, button) {
  if (answered) return;
  if (!checkAnswer(round, number)) {
    button.classList.add('wrong');
    button.disabled = true;
    $('feedback').textContent = t('tryAgain');
    $('feedback').className = 'feedback retry';
    playTone(260);
    return;
  }
  answered = true;
  stars++;
  button.classList.add('right');
  $('answers').querySelectorAll('button').forEach(choice => { choice.disabled = true; });
  $('feedback').textContent = t('correct');
  $('feedback').className = 'feedback success';
  $('starsLabel').textContent = `⭐ ${stars}`;
  $('raceCar').style.left = `${7 + (roundIndex + 1) * 15}%`;
  $('progressFill').style.width = `${(roundIndex + 1) / ROUND_COUNT * 100}%`;
  playTone(660);
  advanceTimer = setTimeout(() => {
    roundIndex++;
    if (roundIndex === ROUND_COUNT) {
      renderResult();
      showScreen('finishScreen');
    } else {
      round = makeRound(round.count);
      renderRound();
    }
  }, 1150);
}

function renderResult() {
  $('resultText').textContent = t('result', { stars });
}

function startGame() {
  clearTimeout(advanceTimer);
  roundIndex = 0;
  stars = 0;
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
