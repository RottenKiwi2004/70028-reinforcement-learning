import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';
import DiscountedReturn from '../widgets/DiscountedReturn';

export const policiesReturns: Topic = {
  id: 'policies-returns',
  title: 'Policies and returns',
  short: 'Returns',
  summary: R`A policy is how the agent chooses actions; the discounted return $G_t$ is the single number that scores everything that happens afterwards. $\gamma$ sets how far ahead the agent cares.`,
  sections: [
    {
      id: 'policy',
      title: 'Policies',
      why: R`The MDP describes the world but not the agent. A policy is the agent's behaviour written as a rule, and RL is the search for the best such rule.`,
      slides: [slide('L1', 26, 'How do agents choose actions?')],
      rows: [
        {
          eq: R`a=\pi(s)`,
          notes: [term('Deterministic policy'), text(R`one fixed action per state`), shape(R`\pi:\ \text{a table of }|\mathcal S|\text{ actions}`)],
        },
        {
          eq: R`a\sim\pi(a\mid s)`,
          notes: [
            term('Stochastic policy'),
            text(R`a distribution over actions in each state`),
            tag(['I8'], R`$\sum_a\pi(a\mid s)=1$ for each $s$, same rule as for $P$`),
            shape(R`\pi:\ |\mathcal S|\times|\mathcal A|,\ \text{rows sum to 1}`),
          ],
        },
      ],
      pre: [
        ex(R`Ex. Random: uniform over actions. Greedy: always head for the goal. Safe: avoid traps at all costs. Optimal: maximise cumulative reward.`),
      ],
      callouts: [{ heading: 'Goal of RL', text: R`Find the optimal policy $\pi^*$.` }],
    },
    {
      id: 'total-reward',
      title: 'Scoring long-term consequences',
      why: R`A single reward cannot judge a decision whose payoff comes later. We need one number that adds up everything that follows, so that "was it worth it?" has an answer.`,
      slides: [slide('L1', 27, 'How do we measure total reward over time?')],
      rows: [
        {
          eq: R`\underbrace{-100}_{\text{today}},\ \underbrace{+5}_{\text{tomorrow}},\ \underbrace{+5}_{\text{next day}},\ \dots`,
          notes: [ex(R`Ex. saving money: pay 100 now, earn 5 interest per day`), lab(R`judged on the first reward alone, saving looks terrible`), text(R`we need to sum ALL future rewards`)],
        },
      ],
    },
    {
      id: 'return',
      title: 'Discounted return',
      why: R`An undiscounted sum can be infinite for continuing tasks, which makes comparing policies meaningless. Shrinking each later reward by $\gamma$ keeps the sum finite and encodes a preference for sooner rewards.`,
      slides: [slide('L1', 28, 'Why do we discount future rewards?')],
      slideNote: R`Rows 2 and 3 are added: the bound shows why $\gamma<1$ makes returns finite, and the recursion is the step the Bellman equation uses.`,
      rows: [
        {
          eq: R`G_t=R_{t+1}+\gamma R_{t+2}+\gamma^2R_{t+3}+\dots=\sum_{k=0}^{\infty}\gamma^kR_{t+k+1}`,
          notes: [
            term('Discounted return'),
            lab(R`reward $k$ steps after the first gets weight $\gamma^k$`),
            tag(['C2'], R`the sum starts at $R_{t+1}$, the reward for $A_t$`),
            shape(R`G_t:\ 1\times1\ \text{(random scalar)}`),
            con(R`$\gamma\in[0,1]$ is a fixed constant`),
          ],
        },
        {
          eq: R`|G_t|\le\sum_{k=0}^{\infty}\gamma^k R_{\max}=\dfrac{R_{\max}}{1-\gamma}`,
          notes: [tag(['I10'], R`geometric series, finite only when $\gamma<1$`), lab(R`$R_{\max}$: largest reward size`), ex(R`Ex. $\gamma=0.9$: at most $10R_{\max}$; effective horizon about 10 steps`)],
        },
        {
          eq: R`G_t=R_{t+1}+\gamma\big(R_{t+2}+\gamma R_{t+3}+\dots\big)=R_{t+1}+\gamma\,G_{t+1}`,
          notes: [tag(['I11'], R`factor one $\gamma$ out of every later term`), lab(R`reward now $+$ discounted return from the next step`), text(R`this recursion is the seed of the Bellman equation`)],
        },
      ],
      pre: [
        text(R`Mathematical convenience: ensures finite returns.`),
        text(R`Uncertainty: future rewards are less certain.`),
        text(R`Preference: immediate rewards are preferred.`),
        ex(R`Ex. $\gamma=0$: myopic; $\gamma=0.9$: balanced; $\gamma=1$: far-sighted`),
      ],
      extra: <DiscountedReturn />,
      callouts: [
        {
          heading: 'Exam trap: no discounting',
          flag: 'I10',
          text: R`$\gamma=1$ is only safe for episodic tasks, where the sum stops at $T$. In a continuing task the return can be infinite.`,
        },
      ],
    },
    {
      id: 'gamma-zero',
      title: 'Check: zero discount',
      why: R`Pushing $\gamma$ to an extreme is the quickest way to test whether the definition of $G_t$ has sunk in.`,
      slides: [slide('L1', 29, '🎮 Mentimeter Poll'), slide('L1', 30, '🎮 Mentimeter Poll: All clear so far?')],
      slideNote: R`Page 30 is a clarity poll only.`,
      rows: [
        {
          eq: R`\gamma=0:\quad G_t=R_{t+1}+0\cdot R_{t+2}+\dots=R_{t+1}`,
          notes: [lab(R`answer D: only immediate rewards matter`), ex(R`Ex. the saver never saves: $G_0=-100$`)],
        },
      ],
      callouts: [
        {
          heading: 'Why the other options fail',
          text: R`States do not all get the same value (immediate rewards still differ); the Bellman equation stays valid (its future term is just multiplied by 0); and $\gamma$ says nothing about whether the policy is deterministic.`,
        },
      ],
    },
  ],
};
