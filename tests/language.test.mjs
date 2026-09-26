import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGE_ROUNDS, LANGUAGE_WIN_SCORE, VOCABULARY, makeLanguageSession, languageWon } from '../language.mjs';
import { VERBS } from '../verbs.mjs';

test('noun and verb games each use five different Bulgarian words', () => {
  assert.equal(LANGUAGE_ROUNDS, 5);
  for (const vocabulary of [VOCABULARY, VERBS]) {
    assert.equal(vocabulary.length, 100);
    for (const field of ['id', 'bg', 'icon']) {
      assert.equal(new Set(vocabulary.map(word => word[field])).size, 100, `${field} must be unique`);
    }
    assert.ok(vocabulary.every(word => word.ru && word.uk && word.category));
    for (const random of [() => 0, () => 0.5, () => 0.999]) {
      const session = makeLanguageSession(vocabulary, random);
      assert.equal(session.length, 5);
      assert.equal(new Set(session.map(round => round.target.id)).size, 5);
      for (const round of session) {
        assert.ok(round.target.bg.length > 0);
        assert.equal(round.choices.length, 4);
        assert.equal(new Set(round.choices.map(choice => choice.id)).size, 4);
        assert.equal(new Set(round.choices.map(choice => choice.icon)).size, 4);
        assert.ok(round.choices.some(choice => choice.id === round.target.id));
        assert.equal(new Set(round.choices.map(choice => choice.category)).size, 4);
      }
    }
  }
});

test('four or five correct answers count as a language win', () => {
  assert.equal(LANGUAGE_WIN_SCORE, 4);
  for (let score = 0; score <= 5; score++) {
    assert.equal(languageWon(score), score >= 4);
  }
});
