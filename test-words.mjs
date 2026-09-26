import { VERBS } from './verbs.mjs';

// A small, separate collection for trying new picture styles without changing the main verb game.
const sceneIds = ['run', 'eat', 'drink', 'read', 'write', 'sleep', 'swim', 'dance', 'cook', 'wash', 'cycle', 'water'];

export const TEST_VOCABULARY = Object.freeze(sceneIds.map(id => {
  const word = VERBS.find(item => item.id === id);
  if (!word) throw new Error(`Unknown test word: ${id}`);
  return Object.freeze({ ...word, image: `./assets/test-scenes/${id}.svg` });
}));
