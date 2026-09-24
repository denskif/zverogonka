import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUND_COUNT, MAX_CONES, makeRound, checkAnswer } from '../logic.mjs';

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
