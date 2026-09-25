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
  { id: 'butterfly', bg: 'пеперуда', ru: 'бабочка', uk: 'метелик', icon: '🦋', category: 'animal' },
  { id: 'tree', bg: 'дърво', ru: 'дерево', uk: 'дерево', icon: '🌳', category: 'nature' },
  { id: 'sun', bg: 'слънце', ru: 'солнце', uk: 'сонце', icon: '☀️', category: 'weather' },
  { id: 'house', bg: 'къща', ru: 'дом', uk: 'будинок', icon: '🏠', category: 'place' },
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
  { id: 'egg', bg: 'яйце', ru: 'яйцо', uk: 'яйце', icon: '🥚', category: 'food' },
  { id: 'grapes', bg: 'грозде', ru: 'виноград', uk: 'виноград', icon: '🍇', category: 'food' },
  { id: 'potato', bg: 'картоф', ru: 'картофель', uk: 'картопля', icon: '🥔', category: 'food' },
  { id: 'kiwi', bg: 'киви', ru: 'киви', uk: 'ківі', icon: '🥝', category: 'food' },
  { id: 'cucumber', bg: 'краставица', ru: 'огурец', uk: 'огірок', icon: '🥒', category: 'food' },
  { id: 'lemon', bg: 'лимон', ru: 'лимон', uk: 'лимон', icon: '🍋', category: 'food' },
  { id: 'carrot', bg: 'морков', ru: 'морковь', uk: 'морква', icon: '🥕', category: 'food' },
  { id: 'peach', bg: 'праскова', ru: 'персик', uk: 'персик', icon: '🍑', category: 'food' },
  { id: 'melon', bg: 'пъпеш', ru: 'дыня', uk: 'диня', icon: '🍈', category: 'food' },
  { id: 'cherry', bg: 'череша', ru: 'черешня', uk: 'черешня', icon: '🍒', category: 'food' },
  { id: 'garlic', bg: 'чесън', ru: 'чеснок', uk: 'часник', icon: '🧄', category: 'food' },
  { id: 'rice', bg: 'ориз', ru: 'рис', uk: 'рис', icon: '🍚', category: 'food' },
  { id: 'cheese', bg: 'кашкавал', ru: 'сыр', uk: 'сир', icon: '🧀', category: 'food' },
  { id: 'sandwich', bg: 'сандвич', ru: 'сэндвич', uk: 'сендвіч', icon: '🥪', category: 'food' },
  { id: 'burger', bg: 'хамбургер', ru: 'гамбургер', uk: 'гамбургер', icon: '🍔', category: 'food' },
  { id: 'spaghetti', bg: 'спагети', ru: 'спагетти', uk: 'спагеті', icon: '🍝', category: 'food' },
  { id: 'salad', bg: 'салата', ru: 'салат', uk: 'салат', icon: '🥗', category: 'food' },
  { id: 'croissant', bg: 'кроасан', ru: 'круассан', uk: 'круасан', icon: '🥐', category: 'food' },
  { id: 'honey', bg: 'мед', ru: 'мёд', uk: 'мед', icon: '🍯', category: 'food' },
  { id: 'milk', bg: 'мляко', ru: 'молоко', uk: 'молоко', icon: '🥛', category: 'food' },
  { id: 'tea', bg: 'чай', ru: 'чай', uk: 'чай', icon: '🍵', category: 'food' },
  { id: 'juice', bg: 'сок', ru: 'сок', uk: 'сік', icon: '🧃', category: 'food' },
  { id: 'soup', bg: 'супа', ru: 'суп', uk: 'суп', icon: '🥣', category: 'food' },
  { id: 'horse', bg: 'кон', ru: 'лошадь', uk: 'кінь', icon: '🐴', category: 'animal' },
  { id: 'rabbit', bg: 'заек', ru: 'заяц', uk: 'заєць', icon: '🐰', category: 'animal' },
  { id: 'turtle', bg: 'костенурка', ru: 'черепаха', uk: 'черепаха', icon: '🐢', category: 'animal' },
  { id: 'mouse', bg: 'мишка', ru: 'мышь', uk: 'миша', icon: '🐭', category: 'animal' },
  { id: 'parrot', bg: 'папагал', ru: 'попугай', uk: 'папуга', icon: '🦜', category: 'animal' },
  { id: 'fish', bg: 'риба', ru: 'рыба', uk: 'риба', icon: '🐟', category: 'animal' },
  { id: 'chick', bg: 'пиле', ru: 'цыплёнок', uk: 'курча', icon: '🐥', category: 'animal' },
  { id: 'airplane', bg: 'самолет', ru: 'самолёт', uk: 'літак', icon: '✈️', category: 'transport' },
  { id: 'ship', bg: 'кораб', ru: 'корабль', uk: 'корабель', icon: '🚢', category: 'transport' },
  { id: 'taxi', bg: 'такси', ru: 'такси', uk: 'таксі', icon: '🚕', category: 'transport' },
  { id: 'tram', bg: 'трамвай', ru: 'трамвай', uk: 'трамвай', icon: '🚋', category: 'transport' },
  { id: 'metro', bg: 'метро', ru: 'метро', uk: 'метро', icon: '🚇', category: 'transport' },
  { id: 'hat', bg: 'шапка', ru: 'шапка', uk: 'шапка', icon: '🧢', category: 'clothes' },
  { id: 'socks', bg: 'чорапи', ru: 'носки', uk: 'шкарпетки', icon: '🧦', category: 'clothes' },
  { id: 'sneakers', bg: 'маратонки', ru: 'кроссовки', uk: 'кросівки', icon: '👟', category: 'clothes' },
  { id: 'dress', bg: 'рокля', ru: 'платье', uk: 'сукня', icon: '👗', category: 'clothes' },
  { id: 'tshirt', bg: 'тениска', ru: 'футболка', uk: 'футболка', icon: '👕', category: 'clothes' },
  { id: 'jeans', bg: 'дънки', ru: 'джинсы', uk: 'джинси', icon: '👖', category: 'clothes' },
  { id: 'glove', bg: 'ръкавица', ru: 'перчатка', uk: 'рукавичка', icon: '🧤', category: 'clothes' },
  { id: 'scarf', bg: 'шал', ru: 'шарф', uk: 'шарф', icon: '🧣', category: 'clothes' },
  { id: 'coat', bg: 'палто', ru: 'пальто', uk: 'пальто', icon: '🧥', category: 'clothes' },
  { id: 'sunglasses', bg: 'слънчеви очила', ru: 'солнечные очки', uk: 'сонцезахисні окуляри', icon: '🕶️', category: 'clothes' },
  { id: 'bed', bg: 'легло', ru: 'кровать', uk: 'ліжко', icon: '🛏️', category: 'object' },
  { id: 'sofa', bg: 'диван', ru: 'диван', uk: 'диван', icon: '🛋️', category: 'object' },
  { id: 'spoon', bg: 'лъжица', ru: 'ложка', uk: 'ложка', icon: '🥄', category: 'object' },
  { id: 'fork', bg: 'вилица', ru: 'вилка', uk: 'виделка', icon: '🍴', category: 'object' },
  { id: 'door', bg: 'врата', ru: 'дверь', uk: 'двері', icon: '🚪', category: 'object' },
  { id: 'bathtub', bg: 'вана', ru: 'ванна', uk: 'ванна', icon: '🛁', category: 'object' },
  { id: 'shower', bg: 'душ', ru: 'душ', uk: 'душ', icon: '🚿', category: 'object' },
  { id: 'computer', bg: 'компютър', ru: 'компьютер', uk: "комп'ютер", icon: '💻', category: 'object' },
  { id: 'television', bg: 'телевизор', ru: 'телевизор', uk: 'телевізор', icon: '📺', category: 'object' },
  { id: 'telephone', bg: 'телефон', ru: 'телефон', uk: 'телефон', icon: '📱', category: 'object' },
  { id: 'key', bg: 'ключ', ru: 'ключ', uk: 'ключ', icon: '🔑', category: 'object' },
  { id: 'guitar', bg: 'китара', ru: 'гитара', uk: 'гітара', icon: '🎸', category: 'object' },
  { id: 'mirror', bg: 'огледало', ru: 'зеркало', uk: 'дзеркало', icon: '🪞', category: 'object' },
  { id: 'window', bg: 'прозорец', ru: 'окно', uk: 'вікно', icon: '🪟', category: 'object' },
  { id: 'soap', bg: 'сапун', ru: 'мыло', uk: 'мило', icon: '🧼', category: 'object' },
  { id: 'snow', bg: 'сняг', ru: 'снег', uk: 'сніг', icon: '❄️', category: 'weather' },
  { id: 'cloud', bg: 'облак', ru: 'облако', uk: 'хмара', icon: '☁️', category: 'weather' },
  { id: 'rain', bg: 'дъжд', ru: 'дождь', uk: 'дощ', icon: '🌧️', category: 'weather' },
  { id: 'sea', bg: 'море', ru: 'море', uk: 'море', icon: '🌊', category: 'nature' },
  { id: 'mountain', bg: 'планина', ru: 'гора', uk: 'гора', icon: '⛰️', category: 'nature' },
  { id: 'river', bg: 'река', ru: 'река', uk: 'річка', icon: '🏞️', category: 'nature' },
  { id: 'beach', bg: 'плаж', ru: 'пляж', uk: 'пляж', icon: '🏖️', category: 'place' },
  { id: 'grass', bg: 'трева', ru: 'трава', uk: 'трава', icon: '🌱', category: 'nature' },
  { id: 'school', bg: 'училище', ru: 'школа', uk: 'школа', icon: '🏫', category: 'place' },
  { id: 'hospital', bg: 'болница', ru: 'больница', uk: 'лікарня', icon: '🏥', category: 'place' },
  { id: 'shop', bg: 'магазин', ru: 'магазин', uk: 'магазин', icon: '🏪', category: 'place' },
  { id: 'hotel', bg: 'хотел', ru: 'отель', uk: 'готель', icon: '🏨', category: 'place' },
  { id: 'church', bg: 'църква', ru: 'церковь', uk: 'церква', icon: '⛪', category: 'place' }
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
