import { R, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

export const whyRl: Topic = {
  id: 'why-rl',
  title: 'What makes RL different',
  short: 'Why RL',
  summary: R`Where reinforcement learning sits next to supervised and unsupervised learning, why it is harder, and the probability rules every later derivation leans on.`,
  sections: [
    {
      id: 'outcomes',
      title: 'Lecture goals',
      why: R`Before any maths, fix the target: by the end we want one framework (the MDP) and three tools (policies, value functions, Bellman equations) that every RL algorithm in the course is built from.`,
      slides: [slide('L1', 5, 'How does reinforcement learning actually work?')],
      pre: [
        text(R`Prerequisites: linear algebra, probability theory, calculus.`),
        text(R`Outcome 1: understand what makes RL different from other ML.`),
        text(R`Outcome 2: master the mathematical framework, the Markov Decision Process (MDP).`),
        text(R`Outcome 3: learn the core concepts: policies, value functions, Bellman equations.`),
      ],
      rows: [],
    },
    {
      id: 'toolkit',
      title: 'Probability toolkit',
      why: R`Value functions are expectations of random sums of rewards. Rewriting them (the Bellman equation, the improvement proof) is nothing more than these rules applied in the right order, so they are listed once here.`,
      slides: [slide('L1', 6, 'What mathematical tools do we need for RL?')],
      rows: [
        {
          eq: R`P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}`,
          notes: [term('Conditional probability'), tag(['I1'], R`restrict the world to the cases where $B$ happened`), shape(R`\text{all terms: scalars in }[0,1]`)],
        },
        {
          eq: R`P(A\cap B)=P(A\mid B)\,P(B)`,
          notes: [term('Chain rule'), tag(['I2'], R`I1 multiplied out; splits a joint into conditional times marginal`)],
        },
        {
          eq: R`\mathbb E[X]=\sum_x x\cdot P(X=x)`,
          notes: [term('Expectation'), tag(['I3'], R`probability-weighted average of the values`), shape(R`\mathbb E[X]:\ 1\times1`)],
        },
        {
          eq: R`\mathbb E[aX+bY]=a\,\mathbb E[X]+b\,\mathbb E[Y]`,
          notes: [term('Linearity'), tag(['I4'], R`lets us split "reward now + discounted future" into two expectations`)],
        },
        {
          eq: R`\mathbb E[X\mid Y]=\sum_x x\cdot P(X=x\mid Y)`,
          notes: [term('Conditional expectation'), tag(['I5'], R`same average, using the conditional distribution`), lab(R`a function of $Y$, so still random until $Y$ is known`)],
        },
        {
          eq: R`\mathbb E[X]=\mathbb E\big[\mathbb E[X\mid Y]\big]`,
          notes: [
            term('Law of total expectation'),
            tag(['I6'], R`average the inner average over $Y$`),
            ex(R`Ex. expected return now $=$ average over next states of the expected return from there`),
          ],
        },
      ],
    },
    {
      id: 'paradigms',
      title: 'RL among ML paradigms',
      why: R`The learning signal is what separates RL: instead of being told the right answer, the agent only gets a score for what it did. That one change explains every difficulty on the next slide.`,
      slides: [slide('L1', 7, 'How does RL fit with other types of machine learning?')],
      rows: [
        {
          eq: R`(x,y)\ \text{pairs}\ \to\ y=f(x)`,
          notes: [term('Supervised'), text(R`signal: labelled examples; goal: predict labels`), ex(R`Ex. image classification, language translation`)],
        },
        {
          eq: R`x\ \text{only}`,
          notes: [term('Unsupervised'), text(R`signal: unlabelled data; goal: find patterns (density, structure)`), ex(R`Ex. clustering, dimensionality reduction`)],
        },
        {
          eq: R`(s,a,R,s')`,
          notes: [
            term('Reinforcement'),
            text(R`signal: rewards; goal: maximise return by choosing optimal actions`),
            lab(R`state, action taken, reward received, next state`),
            ex(R`Ex. game playing, robot control`),
          ],
        },
      ],
    },
    {
      id: 'challenges',
      title: 'Why RL is hard',
      why: R`Knowing which difficulties are unique to RL tells us what the later machinery is for: discounting and value functions handle delayed consequences and credit assignment; exploration methods come later.`,
      slides: [slide('L1', 8, 'What makes RL uniquely challenging?')],
      pre: [
        term('Key RL challenges'),
        text(R`Delayed consequences: an action can pay off (or hurt) many steps later.`),
        text(R`Exploration vs exploitation: try something new, or use what already works.`),
        text(R`Credit assignment: which of the earlier actions caused this reward?`),
        text(R`Non-stationary: the agent's own actions change the data it sees.`),
        lab(R`Why supervised learning avoids these: immediate feedback per $(x,y)$ pair, a fixed dataset (no exploration), clear attribution of output to input, and a data distribution that does not move during training.`),
        warn(R`"Non-stationary data" here is caused by the policy changing. The environment's transition probabilities are still assumed stationary (see the transition function in the MDP topic).`),
      ],
      rows: [],
    },
  ],
};
