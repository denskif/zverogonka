import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROUND_COUNT, MAX_CONES, ROUND_SECONDS, START_POSITIONS,
  makeRound, checkAnswer, secondsLeft, advanceRace, bearWon
} from '../logic.mjs';

test('five short rounds with countable values', () => {
  assert.equal(ROUND_COUNT, 5);
  assert.equal(MAX_CONES, 5);
  for (let i = 0; i < 100; i++) {
    const round = makeRound(null, () => i / 100);
    assert.ok(round.count >= 1 && round.count <= 5);
    assert.equal(round.choices.length, 3);
    assert.equal(new Set(round.choices).size, 3);
    assert.ok(round.choices.includes(round.count));
  }
});

test('consecutive rounds show a different number of cones', () => {
  for (let previous = 1; previous <= 5; previous++) {
    for (const random of [0, 0.25, 0.5, 0.75, 0.999]) {
      assert.notEqual(makeRound(previous, () => random).count, previous);
    }
  }
});

test('only the exact number advances the car', () => {
  const round = { count: 3, choices: [2, 3, 4] };
  assert.equal(checkAnswer(round, 3), true);
  assert.equal(checkAnswer(round, 2), false);
  assert.equal(checkAnswer(round, 4), false);
});

test('ten-second countdown stops at zero, including after a delayed tick', () => {
  const deadline = 20_000;
  assert.equal(ROUND_SECONDS, 10);
  assert.equal(secondsLeft(deadline, 10_000), 10);
  assert.equal(secondsLeft(deadline, 19_001), 1);
  assert.equal(secondsLeft(deadline, 20_000), 0);
  assert.equal(secondsLeft(deadline, 27_000), 0);
});

test('a missed round lets both rivals overtake the bear', () => {
  const afterMiss = advanceRace(START_POSITIONS, false);
  assert.ok(afterMiss.duck > afterMiss.bear);
  assert.ok(afterMiss.hedgehog > afterMiss.bear);
  assert.equal(bearWon(afterMiss), false);
  assert.deepEqual(START_POSITIONS, { bear: 12, duck: 7, hedgehog: 3 });
});

test('the bear can catch up by answering later rounds correctly', () => {
  let positions = advanceRace(START_POSITIONS, false);
  for (let i = 0; i < 4; i++) positions = advanceRace(positions, true);
  assert.equal(bearWon(positions), true);
});
