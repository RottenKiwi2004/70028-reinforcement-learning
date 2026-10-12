import { R, defineNotebook } from 'principia';
import { identities } from './identities';

export default defineNotebook({
  title: '70028 Reinforcement Learning',
  decks: [
    { id: 'L1', label: 'Week 1 · Markov Decision Processes', pages: 57 },
    { id: 'L2', label: 'Week 2 · Dynamic Programming', pages: 62 },
  ],
  identities,
  indexWhy: R`RL derivations lean on a handful of probability rules (linearity, the tower rule, the Markov property) and a few Bellman results again and again. Each one is written once here, and every step that uses it points back.`,
  folders: {
    'lecture-1': 'Lecture 1 · Markov Decision Processes',
    'lecture-2': 'Lecture 2 · Dynamic Programming',
  },
  defaultFile: 'lecture-1/01-why-rl.ts',
});
