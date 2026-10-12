import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

const BELLMAN = 'What is the fundamental relationship in value functions?';

export const bellman: Topic = {
  id: 'bellman',
  title: 'The Bellman equation',
  short: 'Bellman',
  summary: R`Derives $V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)[r+\gamma V^\pi(s')]$ in five steps from the definition of $V^\pi$: the value of a state written in terms of the values of the states one step later.`,
  sections: [
    {
      id: 'definition',
      circ: 1,
      title: 'Start from the definition',
      why: R`$V^\pi$ is defined through an infinite random sum, which we cannot compute directly. The plan is to peel off one step at a time until only one step of dynamics and the value function itself remain.`,
      slides: [
        slide('L1', 37, BELLMAN),
        slide('L1', 38, BELLMAN),
        slide('L1', 39, BELLMAN),
        slide('L1', 40, BELLMAN),
        slide('L1', 41, BELLMAN),
        slide('L1', 42, BELLMAN),
      ],
      slideNote: R`Pages 37 to 42 reveal one derivation line at a time; steps 1 to 5 here follow those lines, and step 3 also uses the starred side-derivation.`,
      rows: [
        {
          eq: R`V^\pi(s)=\mathbb E\big[G_t\mid S_t=s,\ \pi\big]`,
          notes: [lab(R`expected return from state $s$`), shape(R`1\times1`)],
        },
      ],
    },
    {
      id: 'split',
      circ: 2,
      title: 'Split off the first reward',
      why: R`Separating "reward now" from "everything after" exposes $G_{t+1}$, which is the same kind of object as $G_t$ but one step later. That self-similarity is what makes a recursion possible.`,
      slides: [slide('L1', 37, BELLMAN)],
      rows: [
        {
          eq: R`V^\pi(s)=\mathbb E\big[R_{t+1}+\gamma\,G_{t+1}\mid S_t=s,\ \pi\big]`,
          notes: [tag(['I11'], R`replace $G_t$ by reward now plus discounted return from $t+1$`), ex(R`break into immediate $+$ future`)],
        },
      ],
    },
    {
      id: 'tower',
      circ: 3,
      title: 'Condition on the next state',
      why: R`$\mathbb E[G_{t+1}]$ still depends on the whole future. Conditioning on where we land, $S_{t+1}$, replaces it by "expected return from $S_{t+1}$", which is exactly a value function. The Markov property says the earlier state no longer matters.`,
      slides: [slide('L1', 38, BELLMAN), slide('L1', 39, BELLMAN)],
      rows: [
        {
          eq: R`=\mathbb E\big[R_{t+1}\mid S_t=s,\pi\big]+\gamma\,\mathbb E\big[G_{t+1}\mid S_t=s,\pi\big]`,
          notes: [tag(['I4'], R`split the expectation of a sum; pull out the constant $\gamma$`), con(R`$\gamma$ is a constant`)],
        },
        {
          eq: R`=\mathbb E\big[R_{t+1}\mid S_t=s,\pi\big]+\gamma\,\mathbb E\Big[\mathbb E\big[G_{t+1}\mid S_{t+1},\htmlClass{c-orange}{S_t=s},\pi\big]\ \Big|\ S_t=s,\pi\Big]`,
          notes: [tag(['I6'], R`tower rule: average over $S_{t+1}$ of the expected return given $S_{t+1}$`), lab(R`inner expectation is a function of $S_{t+1}$`)],
        },
        {
          eq: R`=\mathbb E\big[R_{t+1}\mid S_t=s,\pi\big]+\gamma\,\mathbb E\Big[\mathbb E\big[G_{t+1}\mid S_{t+1},\pi\big]\ \Big|\ S_t=s,\pi\Big]`,
          notes: [tag(['I7'], R`given $S_{t+1}$, the future does not depend on $S_t$: the orange term drops`)],
        },
        {
          eq: R`=\mathbb E\Big[R_{t+1}+\gamma\,\mathbb E\big[G_{t+1}\mid S_{t+1},\pi\big]\ \Big|\ S_t=s,\pi\Big]`,
          notes: [tag(['I4'], R`linearity again, backwards: recombine into one expectation`)],
        },
      ],
    },
    {
      id: 'recursive',
      circ: 4,
      title: 'Recognise the value function',
      why: R`The inner expectation is the definition of $V^\pi$ at the next state. Swapping it in turns an expression about the infinite future into one step of reward plus a value we already have a name for.`,
      slides: [slide('L1', 40, BELLMAN)],
      rows: [
        {
          eq: R`V^\pi(s)=\mathbb E\big[R_{t+1}+\gamma\,V^\pi(S_{t+1})\mid S_t=s,\ \pi\big]`,
          notes: [lab(R`$\mathbb E[G_{t+1}\mid S_{t+1},\pi]=V^\pi(S_{t+1})$ by definition`), term('Bellman expectation equation (compact form)'), shape(R`V^\pi(S_{t+1}):\ \text{random scalar (depends on where we land)}`)],
        },
      ],
    },
    {
      id: 'expand',
      circ: 5,
      title: 'Write the expectation as sums',
      why: R`To compute anything, the abstract $\mathbb E$ must become sums over the two sources of randomness: which action the policy picks, then which next state and reward the environment returns.`,
      slides: [slide('L1', 41, BELLMAN), slide('L1', 42, BELLMAN)],
      display: R`V^\pi(s)=\underbrace{\sum_a\pi(a\mid s)}_{\text{agent's choice}}\ \underbrace{\sum_{s',r}P(s',r\mid s,a)}_{\text{environment's response}}\ \big[\underbrace{r}_{\text{now}}+\underbrace{\gamma V^\pi(s')}_{\text{later}}\big]`,
      rows: [
        {
          eq: R`=\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^\pi(s')\big]`,
          notes: [
            tag(['I9'], R`outer sum: average over the action drawn from $\pi$`),
            tag(['I2', 'I3'], R`inner sum: average over the next state and reward given $(s,a)$`),
            tag(['C4'], R`joint $P(s',r\mid s,a)$; summing over $r$ recovers $P(s'\mid s,a)$`),
            tag(['I17'], R`the Bellman expectation equation`),
          ],
        },
        {
          eq: R`=\sum_a\pi(a\mid s)\,Q^\pi(s,a),\qquad Q^\pi(s,a)=\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^\pi(s')\big]`,
          notes: [tag(['I15', 'I16'], R`the inner sum is $Q^\pi$`), lab(R`same equation, read as "average the action values"`)],
        },
      ],
      callouts: [
        {
          heading: 'Slide message',
          flag: 'I17',
          text: R`This equation is the foundation of all reinforcement learning algorithms. Lecture 2 turns it into an update rule.`,
        },
      ],
    },
    {
      id: 'backup',
      title: 'Backup diagram',
      why: R`The diagram is the Bellman equation drawn as a tree, read from the bottom up: values at the leaves are averaged, weighted by $P$ then by $\pi$, to give the value at the root. It is a quick way to check which sums go where.`,
      slides: [slide('L1', 43, 'How can we visualize the Bellman equation?')],
      slideNote: R`Figure slide; the rows describe the tree.`,
      pre: [text(R`Root: state $s$. Branches weighted by $\pi(a_1\mid s),\pi(a_2\mid s)$ to action nodes (squares). Each action branches, weighted by $P(s'\mid s,a)$, to next states $s_1..s_4$ (circles). Values flow backwards up the tree.`)],
      rows: [
        {
          eq: R`V(s)\ \leftarrow\ \sum_{a}\pi(a\mid s)\Big[\sum_{s'}P(s'\mid s,a)\big(r+\gamma V(s')\big)\Big]`,
          notes: [lab(R`bottom level: next-state values; middle: action values $Q^\pi(s,a)$; top: $V^\pi(s)$`), tag(['I15', 'I16'], R`each level is one of the two averages`)],
        },
      ],
    },
    {
      id: 'check',
      title: 'Check: the Bellman equation',
      why: R`The two polls target the most common slip: knowing what the equation relates, and putting $\gamma$ on the right term.`,
      slides: [slide('L1', 44, '🎮 Mentimeter Poll'), slide('L1', 45, '🎮 Mentimeter Poll')],
      rows: [
        {
          eq: R`V^\pi(s)\ \longleftrightarrow\ V^\pi(s')`,
          notes: [lab(R`poll 1, answer C: it relates current and future values`)],
        },
        {
          eq: R`\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)\,\htmlClass{c-red}{\gamma\big[r+V^\pi(s')\big]}`,
          notes: [warn(R`poll 2, answer C is the wrong step: it discounts the immediate reward too`), lab(R`correct: $r+\gamma V^\pi(s')$, the reward now is not discounted`)],
        },
      ],
    },
  ],
};
