// Simple, pictureable Bulgarian actions. Forms are first-person present tense, as in A1 dictionaries.
// Each scene shows an action without displaying the Bulgarian word to the child.
const rows = `
walk|ходя|ходить|ходити|🚶|movement
run|тичам|бегать|бігати|🏃|movement
jump|скачам|прыгать|стрибати|🤸|movement
swim|плувам|плавать|плавати|🏊|movement
climb|катеря се|карабкаться|дертися|🧗|movement
dance|танцувам|танцевать|танцювати|💃|movement
crawl|пълзя|ползать|повзати|👶 ➡️|movement
fall|падам|падать|падати|🧒 ⬇️|movement
sit|сядам|садиться|сідати|🧒 🪑|movement
stand|стоя|стоять|стояти|🧍|movement
sleep|спя|спать|спати|😴|daily
wake|събуждам се|просыпаться|прокидатися|⏰ 🛌|daily
eat|ям|есть|їсти|🧒 🍎|daily
drink|пия|пить|пити|🧒 🥛|daily
wash|мия се|мыться|митися|🧒 🧼|daily
bathe|къпя се|купаться|купатися|🛁 🧒|daily
dress|обличам се|одеваться|одягатися|🧒 👕|daily
undress|събличам се|раздеваться|роздягатися|👕 ➡️ 🧒|daily
comb|сресвам се|расчёсываться|розчісуватися|🪮 🧒|daily
rest|почивам|отдыхать|відпочивати|🛋️ 😌|daily
smile|усмихвам се|улыбаться|усміхатися|😊|feelings
laugh|смея се|смеяться|сміятися|😂|feelings
cry|плача|плакать|плакати|😭|feelings
cough|кашлям|кашлять|кашляти|😷 💨|feelings
breathe|дишам|дышать|дихати|🫁 💨|feelings
yawn|прозявам се|зевать|позіхати|🥱|feelings
sneeze|кихам|чихать|чхати|🤧|feelings
fear|страхувам се|бояться|боятися|😨|feelings
rejoice|радвам се|радоваться|радіти|🤩|feelings
get_angry|сърдя се|сердиться|сердитися|😠|feelings
read|чета|читать|читати|🧒 📖|learning
write|пиша|писать|писати|✍️ 📓|learning
draw|рисувам|рисовать|малювати|🧒 🖍️|learning
color|оцветявам|раскрашивать|розфарбовувати|🎨 🖍️|learning
cut|режа|резать|різати|✂️ 📄|learning
glue|лепя|клеить|клеїти|🧴 📄|learning
build|строя|строить|будувати|🧱 🏠|learning
count|броя|считать|рахувати|🧮 👆|learning
study|уча|учиться|вчитися|🧒 📚|learning
think|мисля|думать|думати|🤔 💭|learning
clean|чистя|чистить|чистити|🧽 ✨|home
sweep|мета|подметать|підмітати|🧹|home
launder|пера|стирать|прати|🧺 👕|home
iron|гладя|гладить|прасувати|👕 ♨️|home
cook|готвя|готовить|готувати|👩‍🍳 🍲|home
bake|пека|печь|пекти|🧑‍🍳 🥧|home
stir|бъркам|размешивать|розмішувати|🥄 🥣|home
pour|наливам|наливать|наливати|🫗 🥛|home
open|отварям|открывать|відчиняти|🫳 🚪|home
close|затварям|закрывать|зачиняти|🚪 🔒|home
speak|говоря|говорить|говорити|🗣️ 💬|social
listen|слушам|слушать|слухати|👂 🎵|social
sing|пея|петь|співати|🎤 🎶|social
clap|пляскам|хлопать|плескати|👏|social
wave|махам|махать|махати|👋|social
hug|прегръщам|обнимать|обіймати|🫂|social
kiss|целувам|целовать|цілувати|😘|social
help|помагам|помогать|допомагати|🤝|social
ask|питам|спрашивать|запитувати|🙋 ❓|social
answer|отговарям|отвечать|відповідати|🙋 💬|social
play|играя|играть|грати|🧒 🧸|play
kick|ритам|пинать|копати|🦶 ⚽|play
throw|хвърлям|бросать|кидати|🤾|play
catch|хващам|ловить|ловити|👐 ⚾|play
roll|търкалям|катить|котити|🏀 ➡️|play
swing|люлея се|качаться|гойдатися|🧒 🎠|play
slide|пързалям се|скатываться|спускатися з гірки|🧒 🛝|play
cycle|карам|ехать на велосипеде|їхати велосипедом|🚴|play
win|побеждавам|побеждать|перемагати|🏆 🙌|play
train|тренирам|тренироваться|тренуватися|🏃 💪|play
peel|беля|чистить фрукт|чистити фрукт|🍌 🔪|food_action
chew|дъвча|жевать|жувати|😬 🍞|food_action
taste|опитвам|пробовать еду|куштувати їжу|🥄 😋|food_action
breakfast|закусвам|завтракать|снідати|🥞 ☀️|food_action
lunch|обядвам|обедать|обідати|🍲 ☀️|food_action
dinner|вечерям|ужинать|вечеряти|🍽️ 🌙|food_action
shop|пазарувам|покупать продукты|купувати продукти|🛒 🧒|food_action
buy|купувам|покупать|купувати|🛍️ 💰|food_action
sell|продавам|продавать|продавати|🏪 💰|food_action
feed|храня|кормить|годувати|🧒 🥕 🐰|food_action
plant|садя|сажать|садити|🧑‍🌾 🌱|nature_action
water|поливам|поливать|поливати|🪴 🚿|nature_action
dig|копая|копать|копати|🧑‍🌾 🕳️|nature_action
pick|бера|собирать ягоды|збирати ягоди|🧺 🍓|nature_action
smell|мириша|нюхать|нюхати|👃 🌸|nature_action
pet|галя|гладить животное|гладити тварину|🫳 🐶|nature_action
fish|ловя|ловить рыбу|ловити рибу|🎣 🐟|nature_action
watch|гледам|смотреть|дивитися|👀 📺|nature_action
search|търся|искать|шукати|🔎 🧸|nature_action
find|намирам|находить|знаходити|🔎 🎁|nature_action
drive|шофирам|водить машину|водити машину|🧑 🚗|travel
travel|пътувам|путешествовать|подорожувати|🧳 ✈️|travel
fly|летя|летать|літати|🐦 🪽|travel
sail|плавам|плыть на корабле|плисти на кораблі|🚢 🌊|travel
board|качвам се|садиться в транспорт|сідати в транспорт|🧒 🚌 ⬆️|travel
get_off|слизам|выходить из транспорта|виходити з транспорту|🧒 🚌 ⬇️|travel
enter|влизам|входить|заходити|🚶 🚪|travel
exit|излизам|выходить|виходити|🚪 🚶|travel
arrive|пристигам|прибывать|прибувати|🚆 🏁|travel
leave|тръгвам|отправляться|вирушати|🧳 🚶|travel
`.trim().split('\n');

export const VERBS = Object.freeze(rows.map(row => {
  const [id, bg, ru, uk, icon, category] = row.split('|');
  return Object.freeze({ id, bg, ru, uk, icon, category });
}));
