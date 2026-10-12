import { R, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

export const gpi: Topic = {
  id: 'gpi',
  title: 'Generalised policy iteration and the limits of DP',
  short: 'GPI',
  summary: R`Every algorithm so far, and most later ones, interleaves evaluation and improvement at some granularity. DP itself needs a perfect model and a sweep over every state, which is why model-free methods and function approximation come next.`,
  sections: [
    {
      id: 'gpi',
      title: 'The GPI pattern',
      why: R`Policy iteration and value iteration look different but share one skeleton. Naming it lets us recognise later algorithms (Q-learning, actor-critic) as variations of something we already understand.`,
      slides: [slide('L2', 52, 'What’s the big picture pattern behind these algorithms?')],
      rows: [
        {
          eq: R`\pi\ \underset{\text{improvement: }\pi\leftarrow\text{greedy}(V)}{\overset{\text{evaluation: }V\to V^\pi}{\rightleftarrows}}\ V`,
          notes: [
            term('Generalised Policy Iteration (GPI)'),
            text(R`evaluation and improvement interact, whatever the granularity`),
            tag(['I17'], R`evaluation: make $V$ consistent with $\pi$`),
            tag(['I19'], R`improvement: make $\pi$ greedy with respect to $V$`),
          ],
        },
        {
          eq: R`V=V^\pi\ \text{and}\ \pi=\text{greedy}(V)\ \Rightarrow\ V=V^*,\ \pi=\pi^*`,
          notes: [tag(['I18'], R`both satisfied at once means the Bellman optimality equation holds`), lab(R`the two processes work toward the same goal from different directions`)],
        },
      ],
      callouts: [{ heading: 'Slide message', text: R`Almost all RL algorithms follow the GPI pattern.` }],
    },
    {
      id: 'examples',
      title: 'GPI in different forms',
      why: R`Placing each algorithm on the same spectrum shows that the choice is only how much evaluation to do before improving, and over which states.`,
      slides: [slide('L2', 53, 'Examples of GPI in Action')],
      pre: [
        term('Seen so far'),
        text(R`Policy iteration: complete evaluation, then improvement.`),
        text(R`Value iteration: one-step evaluation, then improvement.`),
        text(R`Asynchronous DP: update states individually, in any order.`),
        term('Coming later'),
        text(R`Q-learning: implicit evaluation via Q-updates, $\epsilon$-greedy improvement.`),
        text(R`Actor-critic: continuous evaluation and improvement.`),
        text(R`Policy gradient: direct policy improvement with value estimation.`),
      ],
      rows: [],
    },
    {
      id: 'async',
      title: 'Asynchronous DP',
      why: R`Full sweeps waste time on states that barely change or are never visited. Updating selectively focuses computation where it matters, and still converges.`,
      slides: [slide('L2', 54, 'Can we be more flexible about which states to update?')],
      rows: [
        {
          eq: R`\text{pick }s,\quad V(s)\leftarrow\max_a\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V(s')\big]`,
          notes: [term('Asynchronous DP'), lab(R`one state at a time, in any order (in-place)`), shape(R`\text{one entry of }V:\ |\mathcal S|\times1\ \text{changes per update}`)],
        },
      ],
      pre: [
        text(R`Random: pick states uniformly at random.`),
        text(R`Prioritised: update states with the largest value changes first.`),
        text(R`Real-time: update states along simulated trajectories.`),
        warn(R`Convergence guarantee: only if every state keeps being updated (infinitely often). Never touching a state means its value never improves.`),
      ],
    },
    {
      id: 'limits',
      title: 'Why DP is not enough',
      why: R`DP is exact but makes two strong demands: the full model, and a value stored for every state. Seeing where those break explains why the rest of the course exists.`,
      slides: [
        slide('L2', 55, 'Why can’t we just use Dynamic Programming for everything?'),
        slide('L2', 56, 'The Curse of Dimensionality: Why DP Doesn’t Scale'),
      ],
      rows: [
        {
          eq: R`P(s'\mid s,a),\ R(s,a,s')\ \text{known exactly}`,
          notes: [term('Perfect model required'), ex(R`Ex. robotics needs perfect physics; finance a perfect market model; game rules might be unknown`)],
        },
        {
          eq: R`\text{one sweep}\sim|\mathcal S|\cdot|\mathcal A|\cdot|\mathcal S|\ \text{operations}`,
          notes: [term('Computational complexity'), lab(R`every state, every action, every next state`), shape(R`\text{reads all of }P^a:\ |\mathcal S|\times|\mathcal S|\ \text{for each }a`)],
        },
        {
          eq: R`|\mathcal S|=256^{210\times160}\approx10^{80\,900}`,
          notes: [
            term('Curse of dimensionality'),
            ex(R`Ex. Atari screen: $210\times160$ pixels, 256 values each`),
            ex(R`Ex. backgammon about $10^{20}$ states; Go about $10^{170}$; a 10-joint robot about $10^{30}$`),
            lab(R`the state count grows exponentially with the number of variables describing a state`),
          ],
        },
      ],
      callouts: [
        {
          heading: 'Checking the slide figure',
          text: R`The slide prints the Atari count as about $10^{1\,000\,000}$. With 256 values per pixel it is $256^{33\,600}=10^{33\,600\log_{10}256}\approx10^{80\,900}$. The $10^{1\,000\,000}$ figure would need far more pixels or colour values. Either way: no table can hold it.`,
        },
      ],
    },
    {
      id: 'forward',
      title: 'How modern RL gets around it',
      why: R`Each limitation has a matching fix: learn from experience instead of a model, and approximate values instead of storing them all. The Bellman equations stay the same throughout.`,
      slides: [
        slide('L2', 57, 'How do modern RL methods overcome these limitations?'),
        slide('L2', 58, '🎮 Mentimeter Poll'),
        slide('L2', 59, '🎮 Mentimeter Poll: All clear so far?'),
      ],
      slideNote: R`Page 59 is a clarity poll only.`,
      rows: [
        {
          eq: R`\text{no }P,R:\ \text{learn from samples }(s,a,r,s')`,
          notes: [term('Model-free methods'), text(R`Monte Carlo methods; temporal-difference learning (Q-learning)`)],
        },
        {
          eq: R`V(s)\approx V_\theta(s)`,
          notes: [term('Function approximation'), text(R`neural networks instead of tables`), shape(R`\theta:\ \text{weights, far fewer than }|\mathcal S|`)],
        },
      ],
      callouts: [
        {
          heading: 'Poll',
          text: R`Answer C: in GPI, evaluation and improvement work toward the same goal from different directions. They are not competitors, and neither has to finish before the other starts.`,
        },
      ],
    },
    {
      id: 'takeaways',
      title: 'Lecture 2 takeaways',
      why: R`A recap of the toolkit for solving a known MDP exactly, before Lecture 3 drops the assumption that the model is known.`,
      slides: [slide('L2', 60, 'What have we learned today?'), slide('L2', 61, 'Reading and Resources')],
      pre: [
        text(R`Dynamic programming: exact algorithms for solving MDPs.`),
        text(R`Policy evaluation: compute the value function of a given policy.`),
        text(R`Policy improvement: make a policy better using its value function.`),
        text(R`Policy iteration: alternate evaluation and improvement.`),
        text(R`Value iteration: optimal values directly, by one-step max updates.`),
        text(R`GPI: unifies the evaluation-improvement pattern.`),
        lab(R`Reading: Sutton and Barto chapter 4: 4.1 policy evaluation, 4.2 improvement, 4.3 policy iteration, 4.4 value iteration, 4.5 asynchronous DP, 4.6 GPI.`),
      ],
      rows: [],
    },
  ],
};
