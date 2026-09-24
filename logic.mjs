export const ROUND_COUNT = 5;
export const MAX_CONES = 5;
export const START_POSITIONS = Object.freeze({ spider: 12, hulk: 7, loki: 3 });

export function makeRound(previousCount = null, random = Math.random) {
  const counts = Array.from({ length: MAX_CONES }, (_, i) => i + 1).filter(n => n !== previousCount);
  const count = counts[Math.floor(random() * counts.length)];
  const wrong = Array.from({ length: MAX_CONES }, (_, i) => i + 1)
    .filter(n => n !== count)
    .sort((a, b) => Math.abs(a - count) - Math.abs(b - count));
  const choices = [count, ...wrong.slice(0, 2)].sort(() => random() - 0.5);
  return { count, choices };
}

export function checkAnswer(round, answer) {
  return Number(answer) === round.count;
}

export function advanceRace(positions, correct) {
  return {
    spider: positions.spider + (correct ? 16 : 8),
    hulk: positions.hulk + (correct ? 10 : 20),
    loki: positions.loki + (correct ? 10 : 20)
  };
}

export function spiderWon(positions) {
  return positions.spider > positions.hulk && positions.spider > positions.loki;
}
