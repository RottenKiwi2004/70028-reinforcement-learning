import { R, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

export const policyIteration: Topic = {
  id: 'policy-iteration',
  title: 'Policy iteration',
  short: 'Policy iter.',
  summary: R`Alternate full policy evaluation with greedy improvement. Every round is at least as good as the last and there are finitely many policies, so it reaches $\pi^*$ in a finite number of rounds.`,
  sections: [
    {
      id: 'algorithm',
      title: 'Alternate evaluation and improvement',
      why: R`Evaluation needs a policy; improvement needs a value function. Feeding each into the other gives a loop that climbs towards the optimal policy, using only the two tools we already have.`,
      slides: [slide('L2', 36, 'What if we alternate between evaluation and improvement?')],
      rows: [
        {
          eq: R`\pi_0\ \text{arbitrary}`,
          notes: [text(R`1. initialise any policy`), shape(R`\pi_0:\ \text{one action per state}`)],
        },
        {
          eq: R`\pi_k\ \xrightarrow{\ \text{evaluate}\ }\ V^{\pi_k}`,
          notes: [text(R`2a. policy evaluation: iterate until convergence`), tag(['I17', 'I20'], R`repeated Bellman expectation backups`), shape(R`V^{\pi_k}:\ |\mathcal S|\times1`)],
        },
        {
          eq: R`\pi_{k+1}(s)=\arg\max_a Q^{\pi_k}(s,a)`,
          notes: [text(R`2b. policy improvement: act greedily`), tag(['I15'], R`$Q^{\pi_k}$ from $V^{\pi_k}$ by one-step look-ahead`), tag(['I19'], R`guarantees $\pi_{k+1}\ge\pi_k$`)],
        },
        {
          eq: R`\pi_{k+1}=\pi_k\ \Rightarrow\ \text{stop}`,
          notes: [text(R`3. stop when the policy is stable`), tag(['I18'], R`a stable greedy policy satisfies the Bellman optimality equation`)],
        },
      ],
      display: R`\pi_0\xrightarrow{\text{Eval}}V^{\pi_0}\xrightarrow{\text{Improve}}\pi_1\xrightarrow{\text{Eval}}V^{\pi_1}\xrightarrow{\text{Improve}}\cdots\to\pi^*`,
      callouts: [
        {
          heading: 'Exam trap',
          text: R`Stop on a stable policy, not on stable values within one evaluation. Also watch for ties in the $\arg\max$: break them consistently, or the policy can flip between equally good actions and never look stable.`,
        },
      ],
    },
    {
      id: 'why-optimal',
      title: 'Why it finds the optimal policy',
      why: R`An algorithm is only useful if it stops with the right answer. Two facts together give that: it never gets worse, and it cannot keep strictly improving forever.`,
      slides: [
        slide('L2', 37, 'Why does Policy Iteration find the optimal policy?'),
        slide('L2', 38, '🎮 Mentimeter Poll'),
        slide('L2', 39, '🎮 Mentimeter Poll: All clear so far?'),
      ],
      slideNote: R`Page 39 is a clarity poll only.`,
      rows: [
        {
          eq: R`V^{\pi_{k+1}}(s)\ge V^{\pi_k}(s)\quad\forall s`,
          notes: [term('Monotonic improvement'), tag(['I19'], R`each round is at least as good; strictly better unless already optimal`)],
        },
        {
          eq: R`\#\text{deterministic policies}=|\mathcal A|^{|\mathcal S|}`,
          notes: [
            term('Finite convergence'),
            lab(R`one of $|\mathcal A|$ choices in each of $|\mathcal S|$ states`),
            ex(R`Ex. 4 actions, 25 states: $4^{25}\approx10^{15}$ policies, but PI usually needs only a handful of rounds`),
          ],
        },
        {
          eq: R`\text{strict improvement}+\text{finitely many policies}\Rightarrow\pi^*\ \text{in finite time}`,
          notes: [lab(R`a strictly improving sequence cannot revisit a policy, so it must end`)],
        },
      ],
      callouts: [
        {
          heading: 'Poll',
          text: R`Answer B: finitely many policies, each improvement monotonically better. The Bellman equation being linear, $\gamma<1$, synchronous updates or episodic tasks are not the reason it terminates.`,
        },
      ],
    },
  ],
};
