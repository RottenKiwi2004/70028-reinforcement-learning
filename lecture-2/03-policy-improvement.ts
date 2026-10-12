import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

const PROOF = 'Why does the Policy Improvement Theorem work?';
const proofPages = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((p) => slide('L2', p, PROOF));

export const policyImprovement: Topic = {
  id: 'policy-improvement',
  title: 'Policy improvement',
  short: 'Improvement',
  summary: R`Given $V^\pi$, acting greedily with respect to $Q^\pi$ gives a policy that is at least as good in every state. The Policy Improvement Theorem proves it by unrolling one-step improvements into the whole future.`,
  sections: [
    {
      id: 'greedy',
      title: 'Greedy policy improvement',
      why: R`Evaluation tells us how good each state is under $\pi$. The natural next move is to steer toward better states: in each state pick the action with the best one-step look-ahead. We then need proof that this really helps.`,
      slides: [slide('L2', 19, 'Given a value function $V^\\pi$, how do we make the policy better?')],
      rows: [
        {
          eq: R`\pi'(s)=\arg\max_a Q^\pi(s,a)=\arg\max_a\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^\pi(s')\big]`,
          notes: [
            term('Greedy policy improvement'),
            tag(['I15'], R`$Q^\pi$ computed from $V^\pi$ by a one-step look-ahead (needs the model $P$)`),
            shape(R`Q^\pi:\ |\mathcal S|\times|\mathcal A|;\ \pi':\ \text{one action per state}`),
          ],
        },
      ],
      pre: [text(R`Idea: if we know how valuable each state is under the current policy, choose actions that lead to more valuable states.`)],
    },
    {
      id: 'theorem',
      title: 'Policy Improvement Theorem',
      why: R`The theorem turns a local, one-step check into a global guarantee. If switching to $\pi'$ for just the first step never hurts, then following $\pi'$ forever never hurts either.`,
      slides: [slide('L2', 20, 'The Policy Improvement Theorem')],
      rows: [
        {
          eq: R`Q^\pi\big(s,\pi'(s)\big)\ge V^\pi(s)\quad\forall s\ \ \Longrightarrow\ \ V^{\pi'}(s)\ge V^\pi(s)\quad\forall s`,
          notes: [
            term('Policy Improvement Theorem'),
            tag(['I19'], R`stated for deterministic $\pi$ and $\pi'$`),
            lab(R`left: take $\pi'(s)$ once, then follow $\pi$; right: follow $\pi'$ always`),
          ],
        },
      ],
    },
    {
      id: 'proof-start',
      circ: 1,
      title: 'Proof: one step of the new policy',
      why: R`The proof starts from the assumption and rewrites $Q^\pi$ so that the first action comes from $\pi'$. This sets up a pattern that can be repeated at the next state.`,
      slides: proofPages,
      slideNote: R`Pages 21 to 31 reveal the proof line by line; steps 1 to 4 group those lines.`,
      rows: [
        {
          eq: R`V^\pi(s)\le Q^\pi\big(s,\pi'(s)\big)`,
          notes: [lab(R`the assumption`)],
        },
        {
          eq: R`=\mathbb E\big[R_{t+1}+\gamma V^\pi(S_{t+1})\mid S_t=s,\ A_t=\pi'(s)\big]`,
          notes: [tag(['I15'], R`definition of $Q^\pi$: one step, then values under $\pi$`)],
        },
        {
          eq: R`=\mathbb E_{\pi'}\big[R_{t+1}+\gamma V^\pi(S_{t+1})\mid S_t=s\big]`,
          notes: [lab(R`"first action from $\pi'$" written as an expectation under $\pi'$`), con(R`only the first step uses $\pi'$ so far`)],
        },
      ],
    },
    {
      id: 'proof-again',
      circ: 2,
      title: 'Proof: apply the assumption again',
      why: R`$V^\pi(S_{t+1})$ appears inside, and the assumption holds at every state, including $S_{t+1}$. Applying it there pushes $\pi'$ one step further into the future.`,
      slides: proofPages,
      rows: [
        {
          eq: R`\le\mathbb E_{\pi'}\big[R_{t+1}+\gamma\,Q^\pi\big(S_{t+1},\pi'(S_{t+1})\big)\mid S_t=s\big]`,
          notes: [tag(['I19'], R`assumption at the state $S_{t+1}$`), tag(['I14'], R`a bigger term inside an expectation (weights $\ge0$, $\gamma\ge0$) gives a bigger expectation`)],
        },
        {
          eq: R`=\mathbb E_{\pi'}\Big[R_{t+1}+\gamma\,\mathbb E\big[R_{t+2}+\gamma V^\pi(S_{t+2})\mid S_{t+1},A_{t+1}=\pi'(S_{t+1})\big]\ \Big|\ S_t=s\Big]`,
          notes: [tag(['I15'], R`expand $Q^\pi$ at $S_{t+1}$`)],
        },
        {
          eq: R`=\mathbb E_{\pi'}\Big[R_{t+1}+\gamma\,\mathbb E_{\pi'}\big[R_{t+2}+\gamma V^\pi(S_{t+2})\mid S_{t+1}\big]\ \Big|\ S_t=s\Big]`,
          notes: [lab(R`inner expectation now also under $\pi'$`)],
        },
      ],
    },
    {
      id: 'proof-collapse',
      circ: 3,
      title: 'Proof: collapse the nested expectation',
      why: R`Nested expectations are hard to read. The Markov property and the tower rule merge them into a single expectation of a two-step return, so the pattern becomes visible.`,
      slides: proofPages,
      rows: [
        {
          eq: R`=\mathbb E_{\pi'}\Big[R_{t+1}+\gamma\,\mathbb E_{\pi'}\big[R_{t+2}+\gamma V^\pi(S_{t+2})\mid \htmlClass{c-orange}{S_t},S_{t+1}\big]\ \Big|\ S_t=s\Big]`,
          notes: [tag(['I7'], R`adding $S_t$ to the condition changes nothing once $S_{t+1}$ is known`)],
        },
        {
          eq: R`=\mathbb E_{\pi'}\big[R_{t+1}+\gamma R_{t+2}+\gamma^2V^\pi(S_{t+2})\mid S_t=s\big]`,
          notes: [tag(['I4'], R`pull $R_{t+1}$ and $\gamma$ through`), tag(['I6'], R`tower rule removes the inner expectation`)],
        },
      ],
    },
    {
      id: 'proof-unroll',
      circ: 4,
      title: 'Proof: unroll to the end',
      why: R`Each repetition swaps one more $V^\pi$ for a real reward collected under $\pi'$. In the limit only rewards under $\pi'$ remain, which is the definition of $V^{\pi'}$.`,
      slides: proofPages,
      rows: [
        {
          eq: R`\le\mathbb E_{\pi'}\big[R_{t+1}+\gamma R_{t+2}+\gamma^2R_{t+3}+\gamma^3V^\pi(S_{t+3})\mid S_t=s\big]`,
          notes: [ex(R`continue the pattern: steps 2 and 3 again`)],
        },
        {
          eq: R`\le\mathbb E_{\pi'}\big[R_{t+1}+\gamma R_{t+2}+\gamma^2R_{t+3}+\gamma^3R_{t+4}+\dots\mid S_t=s\big]`,
          notes: [lab(R`the leftover $\gamma^kV^\pi$ term vanishes as $k$ grows (for $\gamma<1$)`)],
        },
        {
          eq: R`=V^{\pi'}(s)\qquad\Rightarrow\qquad V^\pi(s)\le V^{\pi'}(s)`,
          notes: [lab(R`definition of $V^{\pi'}$: expected return following $\pi'$`), tag(['I19'], R`theorem proved`)],
        },
      ],
      callouts: [
        {
          heading: 'Poll: why unrolling works',
          text: R`Answer E: the same logic applies at each future state, because the assumption holds for all $s$. Greedy is not claimed optimal here, and the Markov property is only one ingredient.`,
        },
      ],
    },
    {
      id: 'greedy-check',
      circ: 5,
      title: 'Greedy satisfies the theorem',
      why: R`The theorem needs its assumption checked. For the greedy policy it holds automatically, because a maximum is at least as big as the value of the action $\pi$ would have taken.`,
      slides: [
        slide('L2', 32, 'Why does greedy improvement work?'),
        slide('L2', 33, '🎮 Mentimeter Poll'),
        slide('L2', 34, '🎮 Mentimeter Poll: All clear so far?'),
      ],
      slideNote: R`Page 33 is the unrolling poll (callout above); page 34 is a clarity poll only.`,
      rows: [
        {
          eq: R`Q^\pi\big(s,\pi'(s)\big)=Q^\pi\big(s,\arg\max_a Q^\pi(s,a)\big)`,
          notes: [ex(R`substitute the greedy action`)],
        },
        {
          eq: R`=\max_a Q^\pi(s,a)`,
          notes: [tag(['I13'], R`plugging in the maximiser gives the maximum`)],
        },
        {
          eq: R`\ge Q^\pi\big(s,\pi(s)\big)`,
          notes: [tag(['I12'], R`the max beats the old policy's action`)],
        },
        {
          eq: R`=V^\pi(s)`,
          notes: [tag(['I16'], R`deterministic $\pi$: $V^\pi(s)=Q^\pi(s,\pi(s))$`), lab(R`assumption holds for all $s$, so $V^{\pi'}\ge V^\pi$`)],
        },
      ],
      callouts: [
        {
          heading: 'What if nothing improves?',
          flag: 'I18',
          text: R`If greedy gives $V^{\pi'}=V^\pi$, then $V^\pi(s)=\max_a\sum_{s',r}P(s',r\mid s,a)[r+\gamma V^\pi(s')]$: the Bellman optimality equation. So the policy was already optimal. This is why policy iteration can stop when the policy stops changing.`,
        },
      ],
    },
  ],
};
