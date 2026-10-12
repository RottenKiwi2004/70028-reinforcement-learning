import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

const BEST = 'What defines the best possible policy?';
const REL = 'Relationship Between Optimal Functions';

export const optimal: Topic = {
  id: 'optimal',
  title: 'Optimal policies and values',
  short: 'Optimality',
  summary: R`How to compare policies, what an optimal policy is, the optimal value functions $V^*$ and $Q^*$, how they relate, and why acting greedily on $Q^*$ is optimal.`,
  sections: [
    {
      id: 'comparing',
      title: 'Comparing policies',
      why: R`"Better policy" needs a precise meaning before we can search for the best one. Comparing value functions state by state gives that meaning.`,
      slides: [slide('L1', 47, BEST), slide('L1', 48, BEST)],
      pre: [
        text(R`Key question: among all policies, which gives the highest expected return?`),
        ex(R`Ex. random actions: low return; go toward goal: higher; go toward goal and avoid traps: higher still`),
      ],
      rows: [
        {
          eq: R`\pi\ge\pi'\iff V^\pi(s)\ge V^{\pi'}(s)\quad\text{for ALL }s\in\mathcal S`,
          notes: [
            term('Comparing policies'),
            lab(R`compare policies by comparing their value functions`),
            shape(R`V^\pi,V^{\pi'}:\ |\mathcal S|\times1,\ \text{compared entry by entry}`),
          ],
        },
      ],
      callouts: [
        {
          heading: 'Careful',
          text: R`"For ALL states" matters: if $\pi$ wins in some states and $\pi'$ in others, neither is $\ge$ the other. The order is partial, not total.`,
        },
      ],
    },
    {
      id: 'optimal-policy',
      title: 'Optimal policy',
      why: R`With a way to compare, the target of RL becomes concrete: a policy that is never beaten in any state. The existence result tells us the search is not hopeless.`,
      slides: [slide('L1', 49, BEST)],
      rows: [
        {
          eq: R`\pi^*\ge\pi\quad\text{for all policies }\pi`,
          notes: [term('Optimal policy'), text(R`at least as good as every other policy in every state`)],
        },
      ],
      pre: [
        text(R`Good news: for finite MDPs, at least one optimal policy always exists.`),
        text(R`There may be several optimal policies, but they all achieve the same values.`),
      ],
    },
    {
      id: 'optimal-values',
      title: 'Optimal value functions',
      why: R`Because every optimal policy shares one value function, we can talk about "the best achievable value" without naming a policy. That object is what the algorithms in Lecture 2 compute.`,
      slides: [slide('L1', 50, 'Optimal Value Functions')],
      rows: [
        {
          eq: R`V^*(s)\doteq\max_\pi V^\pi(s)\quad\forall s\in\mathcal S`,
          notes: [term('Optimal state-value function'), lab(R`best possible expected return starting from $s$`), shape(R`V^*:\ |\mathcal S|\times1`)],
        },
        {
          eq: R`Q^*(s,a)\doteq\max_\pi Q^\pi(s,a)\quad\forall s,a`,
          notes: [
            term('Optimal action-value function'),
            lab(R`best possible return from $s$ after taking $a$ first, then acting optimally`),
            shape(R`Q^*:\ |\mathcal S|\times|\mathcal A|`),
          ],
        },
      ],
    },
    {
      id: 'relations',
      circ: 1,
      title: 'Linking V* and Q*',
      why: R`Each optimal function can be written with the other. Substituting one into the other removes $Q^*$ and leaves an equation in $V^*$ alone, the Bellman optimality equation, which value iteration will use as its update.`,
      slides: [slide('L1', 51, REL), slide('L1', 52, REL)],
      slideNote: R`Row 3 is added: it substitutes row 2 into row 1, the form used in Lecture 2's value iteration.`,
      rows: [
        {
          eq: R`V^*(s)=\max_a Q^*(s,a)`,
          notes: [tag(['I18'], R`value of a state $=$ value of its best action`), shape(R`\text{max over row }s\text{ of }Q^*:\ 1\times|\mathcal A|\to1\times1`)],
        },
        {
          eq: R`Q^*(s,a)=\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^*(s')\big]`,
          notes: [tag(['I15', 'I18'], R`one-step look-ahead, then act optimally from $s'$`), lab(R`immediate reward $+$ discounted value of where you end up`)],
        },
        {
          eq: R`V^*(s)=\max_a\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^*(s')\big]`,
          notes: [
            term('Bellman optimality equation'),
            ex(R`substitute row 2 into row 1`),
            warn(R`compare with the expectation equation: $\max_a$ replaces $\sum_a\pi(a\mid s)$, so this is no longer linear`),
          ],
        },
      ],
    },
    {
      id: 'greedy',
      title: 'Acting optimally from Q*',
      why: R`Knowing $Q^*$ would solve the problem completely: the long-term thinking is already inside the numbers, so the agent only needs to pick the largest one in each state.`,
      slides: [slide('L1', 53, 'Finding an Optimal Policy')],
      rows: [
        {
          eq: R`\pi^*(s)=\arg\max_a Q^*(s,a)`,
          notes: [
            term('Greedy policy'),
            tag(['I13'], R`this action achieves $\max_a Q^*(s,a)=V^*(s)$`),
            shape(R`\arg\max\text{ returns an action; }\max\text{ returns a value}`),
          ],
        },
      ],
      pre: [
        text(R`$Q^*(s,a)$ gives the long-term value of each action and already accounts for all future rewards.`),
        text(R`So being greedy, picking the best action right now, is optimal for the long term.`),
        warn(R`Greedy on $Q^*$ is optimal. Greedy on immediate reward, or on some other policy's $Q^\pi$, is not optimal in general.`),
      ],
    },
    {
      id: 'deep-rl',
      title: 'From tables to neural networks',
      why: R`Tables only work when the state space is small. Deep RL keeps exactly the same equations but replaces the table with a network, which is the path the rest of the course takes.`,
      slides: [slide('L1', 54, 'How does this connect to modern deep reinforcement learning?')],
      rows: [
        {
          eq: R`V(s),\ Q(s,a)\ \text{stored in a table}`,
          notes: [term('Tabular RL'), text(R`exact Bellman updates; works for small $|\mathcal S|$, $|\mathcal A|$`), shape(R`Q:\ |\mathcal S|\times|\mathcal A|\ \text{entries}`)],
        },
        {
          eq: R`V(s)\approx V_\theta(s),\qquad Q(s,a)\approx Q_\theta(s,a)`,
          notes: [term('Deep RL'), text(R`approximate Bellman updates; scales to huge state spaces`), shape(R`\theta:\ \text{network weights, size independent of }|\mathcal S|`)],
        },
      ],
      pre: [text(R`Same maths, different representation: tables to networks, exact to approximate, small problems to complex ones.`)],
    },
    {
      id: 'takeaways',
      title: 'Lecture 1 takeaways',
      why: R`A one-screen recap of the chain of ideas, each built on the previous one, ready for Lecture 2 which turns the Bellman equations into algorithms.`,
      slides: [slide('L1', 55, 'What are the key concepts we’ve learned today?'), slide('L1', 56, 'Reading and Resources')],
      pre: [
        text(R`MDPs: formalise RL problems with states, actions, rewards.`),
        text(R`Policies: the agent's behaviour, deterministic or stochastic.`),
        text(R`Returns: long-term success measured with discounted rewards.`),
        text(R`Value functions: predict future success from states or state-action pairs.`),
        text(R`Bellman equations: recursive relationships between values.`),
        text(R`Optimal policies: maximum expected return, defined through optimal value functions.`),
        lab(R`Reading: Sutton and Barto, chapters 1 to 3; especially 3.3 (returns), 3.5 (policies and value functions), 3.6 (optimal policies).`),
      ],
      rows: [],
    },
  ],
};
