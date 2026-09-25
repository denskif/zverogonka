import {
  ROUND_COUNT, START_POSITIONS,
  makeRound, checkAnswer, advanceRace, spiderWon
} from './logic.mjs';
import { LANGUAGE_ROUNDS, VOCABULARY, makeLanguageSession, languageWon } from './language.mjs';

const words = {
  ru: {
    title: 'Играй и учись', menu: 'Меню', menuTitle: 'Во что сыграем?',
    raceMode: 'Гонки', raceModeHint: 'Считай конусы', learnMode: 'Учить язык', learnModeHint: 'Слушай болгарские слова',
    question: 'Сколько конусов на дороге?',
    correct: 'Верно! Человек-паук бежит быстрее!',
    wrong: 'Ой! Халк и Локи обогнали!',
    finishWin: 'Ура, Человек-паук победил!', finishLose: 'Гонка закончилась! Попробуем ещё?',
    again: 'Играть ещё ↻', result: 'Правильных ответов: {stars} из {rounds}.',
    coneLabel: 'Дорожных конусов: {count}', choose: 'Выбери цифру', sound: 'Звук',
    raceLabel: 'Гонка: Человек-паук, Халк и Локи',
    learnTitle: 'Слушай и выбирай!', learnInstruction: 'Какую картинку назвали по-болгарски?',
    replay: '🔊 Слушать ещё', pictureGroup: 'Выбери картинку', scoreLabel: 'Правильные ответы',
    learnCorrect: 'Верно! Молодец!', learnWrong: 'Попробуем следующее слово!',
    learnFinishWin: 'Отлично! Ты выиграл!', learnFinishLose: 'Хорошая попытка! Сыграем ещё?',
    speechUnavailable: 'Не удалось воспроизвести слово. Проверьте звук и болгарский голос в настройках iPad.'
  },
  uk: {
    title: 'Грай і навчайся', menu: 'Меню', menuTitle: 'У що пограємо?',
    raceMode: 'Перегони', raceModeHint: 'Порахуй конуси', learnMode: 'Вчити мову', learnModeHint: 'Слухай болгарські слова',
    question: 'Скільки конусів на дорозі?',
    correct: 'Правильно! Людина-павук біжить швидше!',
    wrong: 'Ой! Галк і Локі обігнали!',
    finishWin: 'Ура, Людина-павук перемогла!', finishLose: 'Перегони завершилися! Спробуємо ще?',
    again: 'Грати ще ↻', result: 'Правильних відповідей: {stars} із {rounds}.',
    coneLabel: 'Дорожніх конусів: {count}', choose: 'Обери цифру', sound: 'Звук',
    raceLabel: 'Перегони: Людина-павук, Галк та Локі',
    learnTitle: 'Слухай і обирай!', learnInstruction: 'Яку картинку назвали болгарською?',
    replay: '🔊 Слухати ще', pictureGroup: 'Обери картинку', scoreLabel: 'Правильні відповіді',
    learnCorrect: 'Правильно! Молодець!', learnWrong: 'Спробуємо наступне слово!',
    learnFinishWin: 'Чудово! Ти переміг!', learnFinishLose: 'Гарна спроба! Зіграємо ще?',
    speechUnavailable: 'Не вдалося відтворити слово. Перевірте звук і болгарський голос у налаштуваннях iPad.'
  }
};

const $ = id => document.getElementById(id);
const screens = ['menuScreen', 'playScreen', 'finishScreen', 'learnScreen', 'learnFinishScreen'];
let language = localStorage.getItem('animal-race-language') === 'uk' ? 'uk' : 'ru';
let soundOn = localStorage.getItem('animal-race-sound') !== 'off';
let roundIndex = 0;
let stars = 0;
let round = null;
let positions = { ...START_POSITIONS };
let resolved = false;
let lastOutcome = null;
let advanceTimer = null;
let languageSession = [];
let languageRoundIndex = 0;
let languageScore = 0;
let languageResolved = false;
let languageAdvanceTimer = null;
let speechRepeatTimer = null;
let lastLanguageOutcome = null;

function t(key, values = {}) {
  return words[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name]);
}

function showScreen(id) {
  screens.forEach(name => $(name).classList.toggle('active', name === id));
  $('game').dataset.screen = id;
}

function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  $('languageButton').textContent = language === 'ru' ? 'УКР' : 'РУС';
  $('homeButton').setAttribute('aria-label', t('menu'));
  $('soundButton').setAttribute('aria-label', t('sound'));
  $('answers').setAttribute('aria-label', t('choose'));
  $('pictureGrid').setAttribute('aria-label', t('pictureGroup'));
  $('learnStarsLabel').setAttribute('aria-label', t('scoreLabel'));
  $('race-scene')?.setAttribute('aria-label', t('raceLabel'));
  if (round) $('countingArea').setAttribute('aria-label', t('coneLabel', { count: round.count }));
  if (lastOutcome) $('feedback').textContent = t(lastOutcome);
  if ($('finishScreen').classList.contains('active')) renderResult();
  if (lastLanguageOutcome) $('learnFeedback').textContent = t(lastLanguageOutcome);
  $('pictureGrid').querySelectorAll('button').forEach(button => {
    const word = VOCABULARY.find(item => item.id === button.dataset.word);
    if (word) button.setAttribute('aria-label', word[language]);
  });
  if ($('learnFinishScreen').classList.contains('active')) renderLanguageResult();
  if (!$('speechNote').hidden) $('speechNote').textContent = t('speechUnavailable');
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
  coneGrid.style.setProperty('--columns', round.count);
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
  stopLanguageSpeech();
  clearTimeout(languageAdvanceTimer);
  clearTimeout(advanceTimer);
  roundIndex = 0;
  stars = 0;
  positions = { ...START_POSITIONS };
  round = makeRound();
  showScreen('playScreen');
  renderRound();
}

function stopLanguageSpeech() {
  clearTimeout(speechRepeatTimer);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function speakCurrentWord() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    $('speechNote').hidden = false;
    $('speechNote').textContent = t('speechUnavailable');
    return;
  }
  const word = languageSession[languageRoundIndex]?.target;
  if (!word || languageResolved) return;
  try {
    const speech = window.speechSynthesis;
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(word.bg);
    utterance.lang = 'bg-BG';
    utterance.rate = 0.82;
    utterance.onerror = event => {
      if (event.error === 'canceled' || event.error === 'interrupted' || languageResolved) return;
      $('speechNote').hidden = false;
      $('speechNote').textContent = t('speechUnavailable');
    };
    const bulgarianVoice = speech.getVoices().find(voice => voice.lang.toLowerCase().startsWith('bg'));
    if (bulgarianVoice) utterance.voice = bulgarianVoice;
    speech.speak(utterance);
  } catch {
    $('speechNote').hidden = false;
    $('speechNote').textContent = t('speechUnavailable');
  }
}

function replayWord() {
  clearTimeout(speechRepeatTimer);
  speakCurrentWord();
}

function renderLanguageRound() {
  languageResolved = false;
  lastLanguageOutcome = null;
  $('learnFeedback').textContent = '';
  $('learnFeedback').className = 'feedback';
  $('speechNote').hidden = true;
  $('learnRoundLabel').textContent = `${languageRoundIndex + 1} / ${LANGUAGE_ROUNDS}`;
  $('learnStarsLabel').textContent = `⭐ ${languageScore}`;
  $('learnProgressFill').style.width = `${languageRoundIndex / LANGUAGE_ROUNDS * 100}%`;
  $('pictureGrid').replaceChildren();
  const colors = ['#e7f4ff', '#fff0dc', '#edecff', '#e5f7e7'];
  languageSession[languageRoundIndex].choices.forEach((word, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'picture-button';
    button.dataset.word = word.id;
    button.style.setProperty('--picture-bg', colors[index]);
    button.setAttribute('aria-label', word[language]);
    const picture = document.createElement('span');
    picture.className = 'picture-illustration';
    picture.setAttribute('aria-hidden', 'true');
    picture.textContent = word.icon;
    button.append(picture);
    button.addEventListener('click', () => answerLanguage(word.id, button));
    $('pictureGrid').append(button);
  });
  stopLanguageSpeech();
  speakCurrentWord();
  speechRepeatTimer = setTimeout(speakCurrentWord, 3000);
}

function answerLanguage(wordId, button) {
  if (languageResolved) return;
  languageResolved = true;
  stopLanguageSpeech();
  const correct = wordId === languageSession[languageRoundIndex].target.id;
  if (correct) languageScore++;
  lastLanguageOutcome = correct ? 'learnCorrect' : 'learnWrong';
  button.classList.add(correct ? 'right' : 'wrong');
  $('pictureGrid').querySelectorAll('button').forEach(choice => {
    choice.disabled = true;
    if (!correct && choice.dataset.word === languageSession[languageRoundIndex].target.id) choice.classList.add('right');
  });
  $('learnFeedback').textContent = t(lastLanguageOutcome);
  $('learnFeedback').className = `feedback ${correct ? 'success' : 'retry'}`;
  $('learnStarsLabel').textContent = `⭐ ${languageScore}`;
  $('learnProgressFill').style.width = `${(languageRoundIndex + 1) / LANGUAGE_ROUNDS * 100}%`;
  playTone(correct ? 660 : 260);
  languageAdvanceTimer = setTimeout(() => {
    languageRoundIndex++;
    if (languageRoundIndex === LANGUAGE_ROUNDS) {
      renderLanguageResult();
      showScreen('learnFinishScreen');
    } else {
      renderLanguageRound();
    }
  }, 1350);
}

function renderLanguageResult() {
  const won = languageWon(languageScore);
  $('learnFinishScreen').classList.toggle('won', won);
  $('learnFinishTitle').textContent = t(won ? 'learnFinishWin' : 'learnFinishLose');
  $('learnFinishArt').textContent = won ? '🎧 🏆 ✨' : '🎧 🌟';
  $('learnResultText').textContent = t('result', { stars: languageScore, rounds: LANGUAGE_ROUNDS });
}

function startLanguageGame() {
  clearTimeout(advanceTimer);
  clearTimeout(languageAdvanceTimer);
  stopLanguageSpeech();
  languageSession = makeLanguageSession();
  languageRoundIndex = 0;
  languageScore = 0;
  showScreen('learnScreen');
  renderLanguageRound();
}

function goMenu() {
  clearTimeout(advanceTimer);
  clearTimeout(languageAdvanceTimer);
  stopLanguageSpeech();
  showScreen('menuScreen');
}

$('raceModeButton').addEventListener('click', startGame);
$('learnModeButton').addEventListener('click', startLanguageGame);
$('homeButton').addEventListener('click', goMenu);
$('againButton').addEventListener('click', startGame);
$('learnAgainButton').addEventListener('click', startLanguageGame);
$('replayButton').addEventListener('click', replayWord);
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
showScreen('menuScreen');
renderLanguage();
