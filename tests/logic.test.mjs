import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUND_COUNT, MAX_CONES, START_POSITIONS, makeRound, checkAnswer, advanceRace, spiderWon } from '../logic.mjs';

test('five rounds with countable values', () => {
  assert.equal(ROUND_COUNT, 5);
  assert.equal(MAX_CONES, 10);
  for (let i = 0; i < 100; i++) {
    const round = makeRound(null, () => i / 100);
    assert.ok(round.count >= 1 && round.count <= 10);
    assert.equal(round.choices.length, 3);
    assert.equal(new Set(round.choices).size, 3);
    assert.ok(round.choices.includes(round.count));
  }
});

test('consecutive rounds show a different number of cones', () => {
  for (let previous = 1; previous <= 10; previous++) {
    for (const random of [0, 0.25, 0.5, 0.75, 0.999]) {
      assert.notEqual(makeRound(previous, () => random).count, previous);
    }
  }
});

test('only the exact number advances the runner, including ten', () => {
  const round = { count: 10, choices: [8, 9, 10] };
  assert.equal(checkAnswer(round, 10), true);
  assert.equal(checkAnswer(round, 9), false);
  assert.equal(checkAnswer(round, 8), false);
});

test('a missed round lets both rivals overtake the central runner', () => {
  const afterMiss = advanceRace(START_POSITIONS, false);
  assert.ok(afterMiss.hulk > afterMiss.spider);
  assert.ok(afterMiss.loki > afterMiss.spider);
  assert.equal(spiderWon(afterMiss), false);
  assert.deepEqual(START_POSITIONS, { spider: 12, hulk: 7, loki: 3 });
});

test('the central runner can catch up by answering later rounds correctly', () => {
  let positions = advanceRace(START_POSITIONS, false);
  for (let i = 0; i < 4; i++) positions = advanceRace(positions, true);
  assert.equal(spiderWon(positions), true);
});

test('five rounds still produce a meaningful finish order', () => {
  let positions = { ...START_POSITIONS };
  for (let i = 0; i < 5; i++) positions = advanceRace(positions, i < 3);
  assert.equal(spiderWon(positions), false);
  positions = { ...START_POSITIONS };
  for (let i = 0; i < 5; i++) positions = advanceRace(positions, i < 4);
  assert.equal(spiderWon(positions), true);
});
