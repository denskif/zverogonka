export const LANGUAGE_ROUNDS = 5;
export const LANGUAGE_WIN_SCORE = 4;

// Familiar A1 nouns. Bulgarian is used only for speech; translations label picture buttons for accessibility.
export const VOCABULARY = Object.freeze([
  { id: 'dog', bg: 'куче', ru: 'собака', uk: 'собака', icon: '🐶', category: 'animal' },
  { id: 'cat', bg: 'котка', ru: 'кошка', uk: 'кішка', icon: '🐱', category: 'animal' },
  { id: 'book', bg: 'книга', ru: 'книга', uk: 'книга', icon: '📖', category: 'object' },
  { id: 'chair', bg: 'стол', ru: 'стул', uk: 'стілець', icon: '🪑', category: 'object' },
  { id: 'cup', bg: 'чаша', ru: 'чашка', uk: 'чашка', icon: '☕', category: 'object' },
  { id: 'pencil', bg: 'молив', ru: 'карандаш', uk: 'олівець', icon: '✏️', category: 'object' },
  { id: 'car', bg: 'кола', ru: 'машина', uk: 'машина', icon: '🚗', category: 'transport' },
  { id: 'bus', bg: 'автобус', ru: 'автобус', uk: 'автобус', icon: '🚌', category: 'transport' },
  { id: 'train', bg: 'влак', ru: 'поезд', uk: 'поїзд', icon: '🚆', category: 'transport' },
  { id: 'flower', bg: 'цвете', ru: 'цветок', uk: 'квітка', icon: '🌼', category: 'nature' },
  { id: 'butterfly', bg: 'пеперуда', ru: 'бабочка', uk: 'метелик', icon: '🦋', category: 'nature' },
  { id: 'tree', bg: 'дърво', ru: 'дерево', uk: 'дерево', icon: '🌳', category: 'nature' },
  { id: 'sun', bg: 'слънце', ru: 'солнце', uk: 'сонце', icon: '☀️', category: 'nature' },
  { id: 'house', bg: 'къща', ru: 'дом', uk: 'будинок', icon: '🏠', category: 'object' },
  { id: 'icecream', bg: 'сладолед', ru: 'мороженое', uk: 'морозиво', icon: '🍦', category: 'food' },
  { id: 'apple', bg: 'ябълка', ru: 'яблоко', uk: 'яблуко', icon: '🍎', category: 'food' },
  { id: 'banana', bg: 'банан', ru: 'банан', uk: 'банан', icon: '🍌', category: 'food' },
  { id: 'orange', bg: 'портокал', ru: 'апельсин', uk: 'апельсин', icon: '🍊', category: 'food' },
  { id: 'strawberry', bg: 'ягода', ru: 'клубника', uk: 'полуниця', icon: '🍓', category: 'food' },
  { id: 'watermelon', bg: 'диня', ru: 'арбуз', uk: 'кавун', icon: '🍉', category: 'food' },
  { id: 'pear', bg: 'круша', ru: 'груша', uk: 'груша', icon: '🍐', category: 'food' },
  { id: 'tomato', bg: 'домат', ru: 'помидор', uk: 'помідор', icon: '🍅', category: 'food' },
  { id: 'mushroom', bg: 'гъба', ru: 'гриб', uk: 'гриб', icon: '🍄', category: 'food' },
  { id: 'pizza', bg: 'пица', ru: 'пицца', uk: 'піца', icon: '🍕', category: 'food' },
  { id: 'cake', bg: 'торта', ru: 'торт', uk: 'торт', icon: '🎂', category: 'food' },
  { id: 'bread', bg: 'хляб', ru: 'хлеб', uk: 'хліб', icon: '🍞', category: 'food' },
  { id: 'chocolate', bg: 'шоколад', ru: 'шоколад', uk: 'шоколад', icon: '🍫', category: 'food' },
  { id: 'egg', bg: 'яйце', ru: 'яйцо', uk: 'яйце', icon: '🥚', category: 'food' }
]);

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.min(random(), 0.999999999) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function makeLanguageSession(random = Math.random) {
  const targets = shuffle(VOCABULARY, random).slice(0, LANGUAGE_ROUNDS);
  const categories = [...new Set(VOCABULARY.map(word => word.category))];
  return targets.map(target => {
    const otherCategories = shuffle(categories.filter(category => category !== target.category), random).slice(0, 3);
    const distractors = otherCategories.map(category =>
      shuffle(VOCABULARY.filter(word => word.category === category), random)[0]
    );
    return { target, choices: shuffle([target, ...distractors], random) };
  });
}

export function languageWon(correctCount) {
  return correctCount >= LANGUAGE_WIN_SCORE;
}
