import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';
import GridWorldDP from '../widgets/GridWorldDP';

export const valueIteration: Topic = {
  id: 'value-iteration',
  title: 'Value iteration',
  short: 'Value iter.',
  summary: R`Cut policy evaluation down to a single sweep and fold the greedy step into it: the update becomes the Bellman optimality equation with a $\max$, converging straight to $V^*$, from which $\pi^*$ is read off.`,
  sections: [
    {
      id: 'waste',
      title: 'The waste in policy iteration',
      why: R`Policy iteration runs evaluation to full precision and then throws the policy away. If the next policy only needs the rough shape of the values, most of that work is wasted.`,
      slides: [
        slide('L2', 41, 'Why do full policy evaluation if we’re going to change the policy anyway?'),
        slide('L2', 42, 'What if we don’t wait for full convergence?'),
      ],
      pre: [
        text(R`Policy evaluation might take 100 or more sweeps to converge.`),
        text(R`The policy is changed immediately after, so that precision is thrown away.`),
        text(R`Early sweeps already give the "general shape" of the values.`),
        lab(R`Extreme case: do just one sweep of evaluation before improving. That is value iteration.`),
      ],
      rows: [],
    },
    {
      id: 'truncation',
      circ: 1,
      title: 'From one sweep to the max',
      why: R`Doing one evaluation sweep and then the greedy step, in the same update, replaces the policy's weighted average over actions by the best action. That single change is the whole difference between the two algorithms.`,
      slides: [slide('L2', 43, 'From Policy Iteration to Value Iteration')],
      rows: [
        {
          eq: R`V_{k+1}(s)=\htmlClass{c-orange}{\sum_a\pi(a\mid s)}\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V_k(s')\big]`,
          notes: [lab(R`reminder: policy evaluation step, average over the policy`), tag(['I17'], R`Bellman expectation backup`)],
        },
        {
          eq: R`V_{k+1}(s)=\htmlClass{c-orange}{\max_a}\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V_k(s')\big]`,
          notes: [
            term('Value iteration update'),
            ex(R`replace the average by the greedy choice`),
            tag(['I18'], R`Bellman optimality equation used as an update`),
            shape(R`\text{per state: max over }|\mathcal A|\text{ look-aheads};\ V_k:\ |\mathcal S|\times1`),
          ],
        },
      ],
      pre: [
        term('Spectrum of truncation'),
        text(R`Policy iteration: complete evaluation, then improvement.`),
        text(R`Truncated policy iteration: partial evaluation, then improvement.`),
        text(R`Value iteration: one-step evaluation, then improvement.`),
      ],
    },
    {
      id: 'algorithm',
      circ: 2,
      title: 'The value iteration algorithm',
      why: R`Written out, the algorithm needs no policy until the very end: iterate the max update until values settle, then extract the greedy policy once.`,
      slides: [slide('L2', 44, 'The Value Iteration Algorithm')],
      rows: [
        {
          eq: R`V_0(s)=0\quad\forall s`,
          notes: [text(R`1. initialise`), shape(R`V_0:\ |\mathcal S|\times1`)],
        },
        {
          eq: R`V_{k+1}(s)=\max_a\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V_k(s')\big]\quad\forall s`,
          notes: [text(R`2. for $k=0,1,2,\dots$`), tag(['I20'], R`converges to the unique fixed point $V^*$`)],
        },
        {
          eq: R`\max_s\big|V_{k+1}(s)-V_k(s)\big|<\theta`,
          notes: [text(R`3. stop when changes are tiny`)],
        },
        {
          eq: R`\pi^*(s)=\arg\max_a\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^*(s')\big]`,
          notes: [text(R`4. extract the policy`), tag(['I13', 'I18'], R`greedy on $Q^*$ built from $V^*$`)],
        },
      ],
      callouts: [
        {
          heading: 'Key difference',
          text: R`Policy evaluation: weighted sum over the policy. Value iteration: $\max$ over actions. The intermediate $V_k$ need not be the value of any policy.`,
        },
      ],
    },
    {
      id: 'gridworld',
      title: 'Value iteration on GridWorld',
      why: R`This is the first time we compute an optimal policy. Stepping through the sweeps shows value spreading out from the goal in every direction, and the arrows settling on the shortest safe path.`,
      slides: [
        slide('L2', 45, 'The Moment You’ve Been Waiting For...'),
        slide('L2', 46, 'Reminder of GridWorld Setup'),
        slide('L2', 47, 'Value Iteration in Action: GridWorld'),
        slide('L2', 48, 'Value Iteration Results: Optimal Values and Policy'),
      ],
      slideNote: R`Figure slides. The widget recreates them; its converged values equal the printed $V^*$.`,
      pre: [
        text(R`Values propagate faster than under "always right" evaluation: each state picks its best action every sweep.`),
        lab(R`value iteration finds both $V^*$ and $\pi^*$ in one algorithm`),
      ],
      rows: [
        {
          eq: R`V^*=\begin{array}{ccccc}0.48&0.53&0.59&0.66&0.73\\0.53&\blacksquare&\blacksquare&\blacksquare&0.81\\0.59&0.53&\htmlClass{c-red}{0}&\blacksquare&0.90\\0.66&\blacksquare&0.81&\blacksquare&1.00\\0.73&0.81&0.90&1.00&\htmlClass{c-green}{0}\end{array}`,
          notes: [
            ex(R`Ex. printed $V^*$; $\blacksquare$ = wall, red = trap, green = goal`),
            tag(['C3'], R`terminal cells show 0`),
            shape(R`V^*:\ |\mathcal S|\times1,\ \text{drawn on the grid}`),
          ],
        },
        {
          eq: R`V^*(\text{right of start})=0.9\cdot V^*(\text{2 right of start})=0.9\cdot0.59=0.53`,
          notes: [ex(R`Ex. step reward 0, so each value is $\gamma$ times the best neighbour`), tag(['I18'], R`the max picks the neighbour on the shortest path`)],
        },
        {
          eq: R`\pi^*(\text{left of trap})=\text{Left},\quad V^*=0.9\times0.59=0.53`,
          notes: [warn(R`moving right would enter the trap ($-1$); the max steers away from it`)],
        },
      ],
      extra: <GridWorldDP mode="iterate" />,
    },
    {
      id: 'check',
      title: 'Check: value iteration',
      why: R`The poll checks the one idea that defines value iteration: the max does two jobs at once.`,
      slides: [slide('L2', 49, '🎮 Mentimeter Poll'), slide('L2', 50, '🎮 Mentimeter Poll: All clear so far?')],
      slideNote: R`Page 50 is a clarity poll only.`,
      rows: [
        {
          eq: R`\max_a\big[\underbrace{\textstyle\sum_{s',r}P(\cdot)[r+\gamma V_k(s')]}_{\text{one evaluation step}}\big]`,
          notes: [lab(R`answer C: the max does evaluation and improvement simultaneously`), warn(R`not the Bellman expectation equation (that one averages over $\pi$)`)],
        },
      ],
    },
  ],
};
