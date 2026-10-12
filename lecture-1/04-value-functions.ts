import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

export const valueFunctions: Topic = {
  id: 'value-functions',
  title: 'Value functions',
  short: 'V and Q',
  summary: R`$V^\pi(s)$ and $Q^\pi(s,a)$ turn the random return into a number we can look up: how good a state, or a state-action pair, is when we then follow $\pi$.`,
  sections: [
    {
      id: 'v-and-q',
      title: 'State and action values',
      why: R`$G_t$ is random and only known after the episode ends. To decide now, we need its average from each state (or each state-action pair). That average is the value function, and comparing values is how we compare actions and policies.`,
      slides: [slide('L1', 32, 'How do we predict future success?')],
      slideNote: R`Row 3 is added: it links $V$ and $Q$, and is used in the Bellman derivation and in Lecture 2.`,
      rows: [
        {
          eq: R`V^\pi(s)=\mathbb E\big[G_t\mid S_t=s,\ \pi\big]`,
          notes: [
            term('State value function'),
            lab(R`"how good is it to be in state $s$?"`),
            tag(['I3'], R`average of the return over everything random: the policy's actions and the transitions`),
            shape(R`V^\pi:\ |\mathcal S|\times1\ \text{(one number per state)}`),
          ],
        },
        {
          eq: R`Q^\pi(s,a)=\mathbb E\big[G_t\mid S_t=s,\ A_t=a,\ \pi\big]`,
          notes: [
            term('Action value function (Q-function)'),
            lab(R`"how good is it to take $a$ in $s$, then follow $\pi$?"`),
            con(R`$a$ is fixed for the first step only; $\pi$ takes over from $t+1$`),
            shape(R`Q^\pi:\ |\mathcal S|\times|\mathcal A|`),
          ],
        },
        {
          eq: R`V^\pi(s)=\sum_a\pi(a\mid s)\,Q^\pi(s,a)`,
          notes: [
            tag(['I6', 'I9'], R`condition on the first action, then average it out with $\pi$`),
            tag(['I16'], R`state value $=$ policy-weighted action values`),
            shape(R`\big[1\times|\mathcal A|\big]\cdot\big[|\mathcal A|\times1\big]=1\times1\ \text{(row }s\text{ of }\pi\text{ dotted with row }s\text{ of }Q)`),
          ],
        },
      ],
      callouts: [
        {
          heading: 'Exam trap',
          text: R`Both measure expected future reward, not immediate reward. A state with a reward of 0 for leaving it can still have high value if it leads somewhere good.`,
        },
      ],
    },
    {
      id: 'gridworld',
      title: 'Values on the GridWorld',
      why: R`Seeing $V$ as a heat map builds the intuition for everything in Lecture 2: value leaks backwards from the reward, shrinking by $\gamma$ per step, so a greedy walk uphill on $V$ reaches the goal.`,
      slides: [
        slide('L1', 33, 'What do value functions look like visually?'),
        slide('L1', 34, 'How do values spread through the state space?'),
        slide('L1', 35, '🎮 Mentimeter Poll: All clear so far?'),
      ],
      slideNote: R`Figure slides. Rows 2 and 3 work out two printed values to show where the numbers come from; page 35 is a clarity poll only.`,
      pre: [
        text(R`$5\times5$ grid. $\mathcal S$: positions $(i,j)$; $\mathcal A=\{\text{Up, Down, Left, Right}\}$; $P$: deterministic moves; $R$: goal $+1$, trap $-1$, step $0$; $\gamma=0.9$.`),
        lab(R`start top-left, goal bottom-right, trap in the centre, walls around it`),
      ],
      rows: [
        {
          eq: R`V^{\pi}(s)\ \text{high near the goal, decreasing with distance}`,
          notes: [text(R`goal-adjacent cells are close to $+1$`), lab(R`value tells us which states are good to be in`)],
        },
        {
          eq: R`V(\text{next to goal})=1+\gamma\cdot\underbrace{0}_{V(\text{goal})}=1.00`,
          notes: [ex(R`Ex. printed value $1.00$`), tag(['C3'], R`goal is terminal, value 0; the $+1$ is paid on entering it`)],
        },
        {
          eq: R`V(\text{start})=\gamma^{7}\cdot1=0.9^7\approx0.48`,
          notes: [ex(R`Ex. printed value $0.48$: the shortest path is 8 moves, the $+1$ comes on move 8`), tag(['I11'], R`each step back multiplies by $\gamma$`)],
        },
      ],
      callouts: [
        {
          heading: 'Careful',
          text: R`The heat map is for one policy (here the optimal one). A different policy gives a different $V^\pi$ on the same grid.`,
        },
      ],
    },
  ],
};
