import { R } from 'principia';
import type { Identity } from 'principia';

// Shared identity index for 70028. Tags in topics refer to these ids.
export const identities: Identity[] = [
  // ── Probability ─────────────────────────────────────────────
  {
    id: 'I1',
    area: 'Probability',
    tex: R`P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}`,
    note: R`Conditional probability. Holds when $P(B)>0$; all terms are scalars in $[0,1]$.`,
  },
  {
    id: 'I2',
    area: 'Probability',
    tex: R`P(A\cap B)=P(A\mid B)\,P(B)`,
    note: R`Product (chain) rule: I1 rearranged. Used to split a joint probability into a conditional times a marginal.`,
  },
  {
    id: 'I3',
    area: 'Probability',
    tex: R`\mathbb E[X]=\sum_x x\,P(X=x)`,
    note: R`Expectation of a discrete random variable: a probability-weighted average of its values (scalar).`,
  },
  {
    id: 'I4',
    area: 'Probability',
    tex: R`\mathbb E[aX+bY]=a\,\mathbb E[X]+b\,\mathbb E[Y]`,
    note: R`Linearity of expectation. Holds for any $X,Y$, independent or not; $a,b$ are constants.`,
  },
  {
    id: 'I5',
    area: 'Probability',
    tex: R`\mathbb E[X\mid Y]=\sum_x x\,P(X=x\mid Y)`,
    note: R`Conditional expectation. It is a function of $Y$, so it is itself a random variable until $Y$ is fixed.`,
  },
  {
    id: 'I6',
    area: 'Probability',
    tex: R`\mathbb E[X]=\mathbb E\big[\mathbb E[X\mid Y]\big]`,
    note: R`Law of total expectation (tower rule). Also holds with extra conditioning: $\mathbb E[X\mid Z]=\mathbb E[\mathbb E[X\mid Y,Z]\mid Z]$.`,
  },
  {
    id: 'I7',
    area: 'Probability',
    tex: R`P(S_{t+1}\mid S_t,A_t,S_{t-1},A_{t-1},\dots,S_0,A_0)=P(S_{t+1}\mid S_t,A_t)`,
    note: R`Markov property: once the present state and action are known, the history adds no information about the next state.`,
  },
  {
    id: 'I8',
    area: 'Probability',
    tex: R`\sum_{s'\in\mathcal S}P(s'\mid s,a)=1`,
    note: R`A distribution sums to 1. In matrix form each row of $P^a$ $(|\mathcal S|\times|\mathcal S|)$ sums to 1, for every $s$ and $a$.`,
  },
  {
    id: 'I9',
    area: 'Probability',
    tex: R`\mathbb E_{a\sim\pi(\cdot\mid s)}[f(a)]=\sum_a \pi(a\mid s)\,f(a)`,
    note: R`Averaging over the policy: expectation over the agent's random action is a $\pi$-weighted sum (I3 applied to the action).`,
  },

  // ── Algebra & calculus ───────────────────────────────────────
  {
    id: 'I10',
    area: 'Algebra & calculus',
    tex: R`\sum_{k=0}^{\infty}\gamma^k=\dfrac{1}{1-\gamma}`,
    note: R`Geometric series. Converges only for $|\gamma|<1$; with $\gamma=1$ the sum is infinite.`,
  },
  {
    id: 'I11',
    area: 'Algebra & calculus',
    tex: R`G_t=R_{t+1}+\gamma\,G_{t+1}`,
    note: R`Return recursion: factor one $\gamma$ out of every term after the first. All quantities are scalars.`,
  },

  // ── Optimisation ────────────────────────────────────────────
  {
    id: 'I12',
    area: 'Optimisation',
    tex: R`\max_a f(a)\ \ge\ f(a')\quad\text{for every }a'`,
    note: R`The maximum is at least as large as any single element. Holds for any finite set of actions.`,
  },
  {
    id: 'I13',
    area: 'Optimisation',
    tex: R`f\big(\arg\max_a f(a)\big)=\max_a f(a)`,
    note: R`Plugging the maximiser back in gives the maximum. $\arg\max$ returns an action; $\max$ returns a value.`,
  },
  {
    id: 'I14',
    area: 'Optimisation',
    tex: R`\text{if }f_k\le g_k\ \forall k\ \text{and weights }w_k\ge0:\ \sum_k w_k f_k\le\sum_k w_k g_k`,
    note: R`Non-negative weighted sums (expectations) preserve $\le$. Lets an inequality inside an expectation be pulled outside.`,
  },

  // ── Reinforcement learning results ───────────────────────────
  {
    id: 'I15',
    area: 'RL results',
    tex: R`Q^\pi(s,a)=\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^\pi(s')\big]`,
    note: R`One-step look-ahead: an action's value is its expected reward plus the discounted value of where it lands, then following $\pi$.`,
  },
  {
    id: 'I16',
    area: 'RL results',
    tex: R`V^\pi(s)=\sum_a\pi(a\mid s)\,Q^\pi(s,a)`,
    note: R`A state's value is the policy-weighted average of its action values. For deterministic $\pi$: $V^\pi(s)=Q^\pi(s,\pi(s))$.`,
  },
  {
    id: 'I17',
    area: 'RL results',
    tex: R`V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^\pi(s')\big]`,
    note: R`Bellman expectation equation: I15 substituted into I16. One equation per state, so $|\mathcal S|$ linear equations in $|\mathcal S|$ unknowns.`,
  },
  {
    id: 'I18',
    area: 'RL results',
    tex: R`V^*(s)=\max_a Q^*(s,a),\qquad Q^*(s,a)=\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^*(s')\big]`,
    note: R`Optimal values: the best state value is the best action value; combined they give the Bellman optimality equation (a max replaces the $\pi$-average).`,
  },
  {
    id: 'I19',
    area: 'RL results',
    tex: R`Q^\pi(s,\pi'(s))\ge V^\pi(s)\ \forall s\ \Rightarrow\ V^{\pi'}(s)\ge V^\pi(s)\ \forall s`,
    note: R`Policy Improvement Theorem, for deterministic $\pi,\pi'$. One-step improvement everywhere implies improvement forever.`,
  },
  {
    id: 'I20',
    area: 'RL results',
    tex: R`V_{k+1}=\mathcal T V_k\ \Rightarrow\ V_k\to V\ \text{as }k\to\infty`,
    note: R`Repeating a Bellman backup converges to its unique fixed point from any start. Holds for $\gamma<1$ (or when every episode terminates).`,
  },
  {
    id: 'I21',
    area: 'Linear algebra',
    tex: R`(I-\gamma P^\pi)\,\mathbf v=\mathbf r^\pi\ \Rightarrow\ \mathbf v=(I-\gamma P^\pi)^{-1}\mathbf r^\pi`,
    note: R`Matrix form of the Bellman expectation equation. $P^\pi$: $|\mathcal S|\times|\mathcal S|$, $\mathbf v,\mathbf r^\pi$: $|\mathcal S|\times1$. Invertible when $\gamma<1$ since rows of $P^\pi$ sum to at most 1.`,
  },

  // ── Conventions ─────────────────────────────────────────────
  {
    id: 'C1',
    area: 'Conventions',
    tex: R`S_t,\ A_t,\ R_t\ \text{(random)}\quad\text{vs}\quad s,\ a,\ r\ \text{(values)}`,
    note: R`Capitals are random variables at time $t$; lower-case letters are particular values they can take.`,
  },
  {
    id: 'C2',
    area: 'Conventions',
    tex: R`S_t\xrightarrow{A_t}R_{t+1},\,S_{t+1}`,
    note: R`The reward for the action taken at time $t$ is indexed $t+1$: it arrives together with the next state.`,
  },
  {
    id: 'C3',
    area: 'Conventions',
    tex: R`V(\text{terminal})=0`,
    note: R`A terminal state has no future rewards, so its value is 0. Rewards for reaching it are paid on the transition into it.`,
  },
  {
    id: 'C4',
    area: 'Conventions',
    tex: R`P(s',r\mid s,a)\ \text{vs}\ P(s'\mid s,a),\ R(s,a,s')`,
    note: R`The joint form lists next state and reward together; summing it over $r$ gives $P(s'\mid s,a)$. Both describe the same dynamics.`,
  },
];
