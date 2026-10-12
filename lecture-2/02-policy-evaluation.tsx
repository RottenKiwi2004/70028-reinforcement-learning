import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';
import GridWorldDP from '../widgets/GridWorldDP';

const PROBLEM = 'Given a policy $\\pi$, how do we compute its value function?';

export const policyEvaluation: Topic = {
  id: 'policy-evaluation',
  title: 'Policy evaluation',
  short: 'Evaluation',
  summary: R`Computing $V^\pi$ for a fixed policy: the Bellman equation is a linear system that could be solved directly, but repeating it as an update rule converges to the same answer and scales better.`,
  sections: [
    {
      id: 'problem',
      title: 'The policy evaluation problem',
      why: R`Before we can improve a policy we must know how good it is. The Bellman equation pins $V^\pi$ down, but it is one equation per state, all coupled through $V^\pi(s')$.`,
      slides: [slide('L2', 8, PROBLEM), slide('L2', 9, PROBLEM)],
      slideNote: R`Pages 8 and 9 are identical builds.`,
      rows: [
        {
          eq: R`V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V^\pi(s')\big]`,
          notes: [tag(['I17'], R`Bellman expectation equation, written for every $s$`), lab(R`unknowns: the $|\mathcal S|$ numbers $V^\pi(s)$`)],
        },
        {
          eq: R`\begin{aligned}V^\pi(s_1)&=\textstyle\sum_a\pi(a\mid s_1)\sum_{s',r}P(s',r\mid s_1,a)[r+\gamma V^\pi(s')]\\V^\pi(s_2)&=\cdots\\V^\pi(s_3)&=\cdots\end{aligned}`,
          notes: [ex(R`Ex. a 3-state MDP gives 3 coupled equations`), text(R`$|\mathcal S|$ linear equations in $|\mathcal S|$ unknowns`)],
        },
      ],
    },
    {
      id: 'matrix',
      circ: 1,
      title: 'Direct solve in matrix form',
      why: R`"We could solve it directly" is worth seeing once: the system is $\mathbf v=\mathbf r^\pi+\gamma P^\pi\mathbf v$, solved by one matrix inverse. It shows why the answer is unique, and why it gets expensive for large $|\mathcal S|$.`,
      slides: [slide('L2', 8, PROBLEM)],
      slideNote: R`Not on the slides beyond "we could solve it directly". Added to show the shapes, and checked on the Lecture 1 example MDP.`,
      rows: [
        {
          eq: R`P^\pi_{ss'}=\sum_a\pi(a\mid s)\,P(s'\mid s,a),\qquad r^\pi_s=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\,R(s,a,s')`,
          notes: [
            tag(['I9'], R`average the dynamics and rewards over the policy's action`),
            shape(R`P^\pi:\ |\mathcal S|\times|\mathcal S|,\quad \mathbf r^\pi:\ |\mathcal S|\times1`),
          ],
        },
        {
          eq: R`\underbrace{\mathbf v}_{\htmlClass{c-green}{|\mathcal S|\times1}}=\underbrace{\mathbf r^\pi}_{\htmlClass{c-green}{|\mathcal S|\times1}}+\gamma\,\underbrace{P^\pi}_{\htmlClass{c-green}{|\mathcal S|\times|\mathcal S|}}\,\underbrace{\mathbf v}_{\htmlClass{c-green}{|\mathcal S|\times1}}`,
          notes: [lab(R`Bellman equation for all states at once`), lab(R`row $s$ of $P^\pi\mathbf v$ is the expected next-state value from $s$`)],
        },
        {
          eq: R`(I-\gamma P^\pi)\,\mathbf v=\mathbf r^\pi\ \Rightarrow\ \mathbf v=(I-\gamma P^\pi)^{-1}\mathbf r^\pi`,
          notes: [
            tag(['I21'], R`collect $\mathbf v$ on the left and invert`),
            ex(R`rearrange`),
            shape(R`(I-\gamma P^\pi)^{-1}:\ |\mathcal S|\times|\mathcal S|,\ \text{times }|\mathcal S|\times1=|\mathcal S|\times1`),
            warn(R`inverting costs about $|\mathcal S|^3$ operations: fine for 3 states, hopeless for millions`),
          ],
        },
        {
          eq: R`\mathbf r^\pi=\begin{bmatrix}5\\1.8\\5.2\end{bmatrix},\quad P^\pi=\begin{bmatrix}0&1&0\\0.3&0&0.7\\0&0&0.4\end{bmatrix}\ \Rightarrow\ \mathbf v\approx\begin{bmatrix}14.83\\10.92\\8.13\end{bmatrix}`,
          notes: [
            ex(R`Ex. Lecture 1 MDP, policy "always $a_1$", $\gamma=0.9$`),
            lab(R`$r^\pi_{S_2}=0.3(-1)+0.7(3)=1.8$; $r^\pi_{S_3}=0.4(-2)+0.6(10)=5.2$`),
            tag(['C3'], R`column $T$ dropped since $V(T)=0$; that is why row 3 sums to $0.4$`),
          ],
        },
      ],
    },
    {
      id: 'iterative',
      circ: 2,
      title: 'Iterative policy evaluation',
      why: R`Instead of inverting, use the Bellman equation as an update: plug in a guess on the right, get a better guess on the left. Each sweep costs only one pass over the states, and the guesses converge to $V^\pi$.`,
      slides: [slide('L2', 10, 'Iterative Policy Evaluation: The Algorithm')],
      rows: [
        {
          eq: R`V_0(s)=0\quad\forall s`,
          notes: [text(R`1. initialise (any values work)`), shape(R`V_0:\ |\mathcal S|\times1`)],
        },
        {
          eq: R`V_{k+1}(s)=\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma\,\htmlClass{c-orange}{V_k(s')}\big]\quad\forall s`,
          notes: [
            text(R`2. for $k=0,1,2,\dots$ update every state`),
            con(R`orange: the old estimate, held fixed during the sweep`),
            tag(['I17'], R`the Bellman equation with $V^\pi$ replaced by the current guess`),
            shape(R`\text{matrix form: }\mathbf v_{k+1}=\mathbf r^\pi+\gamma P^\pi\mathbf v_k`),
          ],
        },
        {
          eq: R`\max_s\big|V_{k+1}(s)-V_k(s)\big|<\theta`,
          notes: [text(R`3. stop when the largest change is tiny`), lab(R`$\theta$: small tolerance`)],
        },
        {
          eq: R`k\to\infty:\quad V_k\to V^\pi`,
          notes: [tag(['I20'], R`repeated backups converge to the fixed point, which is $V^\pi$`), ex(R`Ex. Lecture 1 MDP: $V_1=(5,\,1.8,\,5.2)$, $V_2=(6.62,\,6.43,\,7.07)$, ... heading to $(14.83,\,10.92,\,8.13)$`)],
        },
      ],
      callouts: [
        {
          heading: 'Intuition',
          text: R`$V_k(s)$ is the expected return if the episode were cut off after $k$ steps. Each sweep lets reward information travel one more step backwards.`,
        },
      ],
    },
    {
      id: 'sync-vs-inplace',
      title: 'Synchronous vs in-place updates',
      why: R`The update can read either last sweep's values or whatever is newest. The choice changes memory use and speed, not the answer.`,
      slides: [slide('L2', 11, 'Should we update all states at once or one at a time?')],
      rows: [
        {
          eq: R`V_{\text{new}}(s)\leftarrow\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V_{\text{old}}(s')\big]`,
          notes: [term('Synchronous (Jacobi)'), text(R`uses $V_k(s')$ for all next states; updates all states at once`), shape(R`\text{two arrays: }V_{\text{old}},V_{\text{new}}:\ |\mathcal S|\times1`)],
        },
        {
          eq: R`V(s)\leftarrow\sum_a\pi(a\mid s)\sum_{s',r}P(s',r\mid s,a)\big[r+\gamma V(s')\big]`,
          notes: [
            term('In-place (Gauss-Seidel)'),
            text(R`one state at a time, using the most recent values`),
            shape(R`\text{one array }V:\ |\mathcal S|\times1`),
            lab(R`often converges faster`),
            ex(R`Ex. GridWorld widget below: sweeping from the goal corner, "always right" converges in 2 sweeps instead of 5`),
            warn(R`the speed-up depends on sweep order: sweeping away from the goal reads only stale values and gains nothing`),
          ],
        },
      ],
    },
    {
      id: 'gridworld',
      title: 'Policy evaluation on GridWorld',
      why: R`Watching the sweeps makes the abstract update concrete: value appears first next to the goal and then moves back one cell per sweep. Try the widget below, including the two polls' scenarios.`,
      slides: [
        slide('L2', 12, 'Let’s see policy evaluation in action on GridWorld'),
        slide('L2', 13, 'Policy Evaluation Results: Values Propagate Backwards'),
      ],
      slideNote: R`Figure slides. The widget recreates the grid (layout read off the figures); its converged values match the slide.`,
      pre: [
        text(R`Same $5\times5$ GridWorld; policy to evaluate: always go right; $\gamma=0.9$.`),
        lab(R`values propagate backwards from the goal along the bottom row`),
      ],
      rows: [
        {
          eq: R`V^\pi(\text{bottom row})=(0.73,\ 0.81,\ 0.90,\ 1.00)`,
          notes: [ex(R`Ex. $0.9^3,0.9^2,0.9,1$: the cell $k$ steps from the goal gets $\gamma^{k-1}$`), tag(['C3'], R`goal value 0, $+1$ paid on entry`)],
        },
        {
          eq: R`V^\pi(\text{left of trap})=-1.00,\qquad V^\pi(\text{top row})=0`,
          notes: [lab(R`going right walks into the trap, or bumps the wall forever with reward 0`), warn(R`these are the values of a bad policy, not of the states themselves`)],
        },
      ],
      extra: <GridWorldDP mode="evaluate" />,
    },
    {
      id: 'check',
      title: 'Check: policy evaluation',
      why: R`The polls test the three ideas that matter: the start point does not matter, why in-place is faster, and what $V_k(s')$ stands for.`,
      slides: [
        slide('L2', 14, '🎮 Mentimeter Poll'),
        slide('L2', 15, '🎮 Mentimeter Poll'),
        slide('L2', 16, '🎮 Mentimeter Poll'),
        slide('L2', 17, '🎮 Mentimeter Poll: All clear so far?'),
      ],
      slideNote: R`Page 17 is a clarity poll only.`,
      rows: [
        {
          eq: R`V_0(s)=1000\ \Rightarrow\ V_k\to V^\pi`,
          notes: [lab(R`poll 1, answer C: converges to the correct values, from a different start`), tag(['I20'], R`the fixed point is unique; the gap shrinks by $\gamma$ each sweep`)],
        },
        {
          eq: R`V(s)\leftarrow\dots V(s')\ \text{(newest)}`,
          notes: [lab(R`poll 2, answer D: in-place immediately uses the most recent estimates`), warn(R`"less memory" is true but is not why it converges faster`)],
        },
        {
          eq: R`V_k(s')`,
          notes: [lab(R`poll 3, answer A: the current estimate of the next state's value`), warn(R`not the optimal value, not a reward, not a probability`)],
        },
      ],
    },
  ],
};
