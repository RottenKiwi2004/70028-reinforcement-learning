import { R, con, ex, lab, shape, slide, tag, term, text, warn } from 'principia';
import type { Topic } from 'principia';

export const mdp: Topic = {
  id: 'mdp',
  title: 'Markov decision processes',
  short: 'MDP',
  summary: R`The tuple $(\mathcal S,\mathcal A,P,R)$ that describes any RL problem, the agent-environment loop, episodes, the Markov property, and how to read an MDP as a graph or as one transition and one reward matrix per action.`,
  sections: [
    {
      id: 'definition',
      title: 'The MDP tuple',
      why: R`We need one precise object that captures "make a decision, the world responds randomly, get a score, repeat". Once a problem is written as these four pieces, every algorithm in the course applies to it.`,
      slides: [slide('L1', 10, 'How do we formalize sequential decision making problems?')],
      display: R`\text{MDP}=(\mathcal S,\ \mathcal A,\ P,\ R)`,
      rows: [
        {
          eq: R`\mathcal S`,
          notes: [term('States'), text(R`all possible situations`), shape(R`|\mathcal S|=n\ \text{states}`)],
        },
        {
          eq: R`\mathcal A`,
          notes: [term('Actions'), text(R`all possible decisions`), shape(R`|\mathcal A|=m\ \text{actions}`)],
        },
        {
          eq: R`P(s'\mid s,a)`,
          notes: [
            term('Transition probabilities'),
            text(R`how actions change states`),
            lab(R`$s$: now, $a$: chosen action, $s'$: where we land`),
            shape(R`\text{one number per }(s,a,s'):\ n\times m\times n\ \text{table}`),
          ],
        },
        {
          eq: R`R(s,a,s')`,
          notes: [term('Reward function'), text(R`immediate feedback for one transition`), shape(R`n\times m\times n\ \text{table of scalars}`)],
        },
      ],
      callouts: [{ heading: 'Slide message', text: R`If you can specify $(\mathcal S,\mathcal A,P,R)$, you can apply RL.` }],
    },
    {
      id: 'loop',
      title: 'Agent-environment loop',
      why: R`The loop fixes the order in which things happen, and therefore the time indices. Getting $R_{t+1}$ versus $R_t$ right now avoids off-by-one errors in every return and Bellman equation later.`,
      slides: [slide('L1', 11, 'What does the agent-environment interaction look like?')],
      rows: [
        {
          eq: R`S_t\ \xrightarrow{\ \text{agent picks }A_t\ }\ R_{t+1},\ S_{t+1}`,
          notes: [
            text(R`1. agent observes $s_t$; 2. agent takes $a_t$; 3. environment gives $r_{t+1}$; 4. environment moves to $s_{t+1}$; 5. repeat`),
            tag(['C2'], R`reward for the action at time $t$ carries index $t+1$`),
            tag(['C1'], R`capitals are random, lower-case are observed values`),
          ],
        },
      ],
      callouts: [{ heading: 'Goal', text: R`Learn to maximise cumulative reward, not the next reward.` }],
    },
    {
      id: 'episodes',
      title: 'Episodes',
      why: R`Whether interaction stops decides whether a plain sum of rewards is finite. That is why the next topic needs discounting for continuing tasks.`,
      slides: [slide('L1', 12, 'Do tasks have natural start and end points?')],
      rows: [
        {
          eq: R`S_0,A_0,R_1,S_1,A_1,R_2,S_2,\dots,S_T`,
          notes: [term('Episode'), text(R`a complete sequence from the start to a terminal state $S_T$`), tag(['C2'], R`each $R$ sits after the action that earned it`)],
        },
      ],
      pre: [
        term('Episodic'),
        ex(R`Ex. chess game, robot reaching a goal, Atari game: clear start and end`),
        term('Continuing'),
        ex(R`Ex. stock trading, server management, autonomous driving: no terminal state`),
        lab(R`Why this matters: affects how returns and value functions are defined.`),
      ],
    },
    {
      id: 'examples',
      title: 'States, actions, rewards in practice',
      why: R`Filling in the tuple for real systems shows the framework is general, and that choosing the state and the reward is a modelling decision you make, not something handed to you.`,
      slides: [
        slide('L1', 13, 'What do states, actions, and rewards look like in practice?'),
        slide('L1', 14, 'What do states, actions, and rewards look like in practice?'),
        slide('L1', 15, 'What do states, actions, and rewards look like in practice?'),
        slide('L1', 16, 'What do states, actions, and rewards look like in practice?'),
        slide('L1', 17, 'What do states, actions, and rewards look like in practice?'),
      ],
      slideNote: R`Pages 13 to 17 are one slide revealed in steps; page 17 has all answers.`,
      pre: [
        term('Atari Breakout'),
        text(R`states: pixel observations; actions: left, right, fire; rewards: $+1$ per brick hit`),
        term('Autonomous driving'),
        text(R`states: camera, lidar, GPS; actions: steering, throttle, brake; rewards: safe, efficient driving`),
        term('Robot manipulation'),
        text(R`states: joint angles, object poses; actions: joint torques or velocities; rewards: task completion`),
        term('Recommendation systems'),
        text(R`states: user history, context; actions: recommend items; rewards: clicks, purchases, ratings`),
      ],
      rows: [],
    },
    {
      id: 'finite',
      title: 'Finite MDPs',
      why: R`With finitely many states and actions, $P$, $R$, $V$ and $Q$ become tables and matrices we can write down and solve exactly. Everything continuous later builds on this picture.`,
      slides: [slide('L1', 18, 'Why start with finite state and action spaces?')],
      rows: [
        {
          eq: R`|\mathcal S|=n<\infty,\qquad |\mathcal A|=m<\infty`,
          notes: [term('Finite MDP'), shape(R`V:\ n\times1,\quad Q:\ n\times m,\quad P^a:\ n\times n`)],
        },
      ],
      pre: [
        text(R`Mathematical tractability: everything is a matrix or table.`),
        text(R`Exact solutions: optimal policies can be found exactly.`),
        text(R`Clear intuition: easy to visualise.`),
        text(R`Foundation for continuous problems, which often discretise or generalise these ideas.`),
      ],
    },
    {
      id: 'dynamics',
      title: 'Transition function',
      why: R`Outcomes are uncertain, so we describe the world by a probability for every possible next state. The three properties listed are exactly what the later algorithms are allowed to assume.`,
      slides: [slide('L1', 19, 'How do we model uncertainty in state transitions?')],
      rows: [
        {
          eq: R`P(s'\mid s,a)=\Pr\big[S_{t+1}=s'\mid S_t=s,\ A_t=a\big]`,
          notes: [term('Dynamics'), tag(['C1'], R`$S_{t+1}$ random, $s'$ a particular value`), shape(R`\text{scalar in }[0,1]`)],
        },
        {
          eq: R`\sum_{s'\in\mathcal S}P(s'\mid s,a)=1\quad\forall s,a`,
          notes: [tag(['I8'], R`for each fixed $(s,a)$ the next state must be somewhere`), text(R`probability distribution`)],
        },
      ],
      pre: [
        text(R`Stationary: transition probabilities do not change over time.`),
        text(R`Markovian: the next state depends only on the current state and action.`),
      ],
      callouts: [
        {
          heading: 'Deterministic vs stochastic',
          text: R`GridWorld: $P(s'\mid s,\text{Right})=1$ for the cell to the right. Sticky GridWorld: $0.9$ to the right, $0.1$ to stay put. Both are valid MDPs.`,
        },
      ],
    },
    {
      id: 'markov',
      title: 'The Markov property',
      why: R`If the next state depended on the whole history, every equation would need the entire past. The Markov property lets the current state stand in for it, which is what makes the recursive Bellman equation possible.`,
      slides: [slide('L1', 20, 'Why is the Markov property so important?')],
      rows: [
        {
          eq: R`P(s_{t+1}\mid s_t,a_t,\htmlClass{c-orange}{s_{t-1},a_{t-1},\dots,s_0,a_0})=P(s_{t+1}\mid s_t,a_t)`,
          notes: [term('Markov property'), tag(['I7'], R`the orange history drops out`), lab(R`"the future is independent of the past given the present"`)],
        },
      ],
      pre: [
        text(R`The current state holds all the information needed to predict the future.`),
        text(R`No need to remember the full history: makes the problem tractable.`),
        ex(R`Ex. Markovian: tic-tac-toe; chess, provided en passant and castling rights are part of the state`),
        ex(R`Ex. Non-Markovian: a single Atari frame (no velocity), stock prices, poker (hidden cards)`),
        warn(R`Markov is a property of how you define the state. A single frame is not Markov; stacking several frames gives velocity and can make it (approximately) Markov.`),
      ],
    },
    {
      id: 'graph',
      title: 'Transition graph',
      why: R`A picture of the dynamics makes it easy to see where an action can lead and what it pays, and to check the probabilities. The same MDP is turned into matrices next.`,
      slides: [slide('L1', 21, 'How can we visualize MDP structure?')],
      slideNote: R`Figure slide. The rows below read the arrows off the figure.`,
      pre: [
        text(R`Circles: states. Dots: actions ($a_1$ or $a_2$). Arrows out of a dot: possible next states, labelled with probability $p$ and reward $r$. Square: terminal state, no outgoing arrows.`),
      ],
      rows: [
        {
          eq: R`S_2\xrightarrow{a_1}\begin{cases}S_1 & p=0.3,\ r=-1\\ S_3 & p=0.7,\ r=+3\end{cases}`,
          notes: [tag(['I8'], R`$0.3+0.7=1$: the $p$'s leaving one dot sum to 1`), lab(R`one action can lead to several states: stochastic`)],
        },
        {
          eq: R`S_3\xrightarrow{a_1}\begin{cases}T & p=0.6,\ r=+10\\ S_3 & p=0.4,\ r=-2\end{cases}`,
          notes: [lab(R`$T$ ends the episode`), tag(['C3'], R`no arrows leave $T$, so it has no future reward`)],
        },
      ],
    },
    {
      id: 'matrices',
      title: 'Matrix form: one P and one R per action',
      why: R`Writing the graph as matrices is what lets us compute: each row of $P^a$ is the distribution of next states, so averaging values over next states becomes a matrix-vector product in Lecture 2.`,
      slides: [
        slide('L1', 22, 'How do we represent MDPs mathematically?'),
        slide('L1', 23, '🎮 Mentimeter Poll'),
        slide('L1', 24, '🎮 Mentimeter Poll: All clear so far?'),
      ],
      slideNote: R`Page 24 is a clarity poll only.`,
      rows: [
        {
          eq: R`P^a_{ij}=P(S_{t+1}=j\mid S_t=i,\ A_t=a)`,
          notes: [
            lab(R`row $i$: where you are; column $j$: where you go`),
            shape(R`P^a:\ |\mathcal S|\times|\mathcal S|`),
            tag(['I8'], R`every row of every $P^a$ sums to 1`),
          ],
        },
        {
          eq: R`R^a_{ij}=\mathbb E\big[R_{t+1}\mid S_t=i,\ A_t=a,\ S_{t+1}=j\big]`,
          notes: [tag(['I5'], R`expected reward for that one transition`), shape(R`R^a:\ |\mathcal S|\times|\mathcal S|`), lab(R`a dot in the slide means the transition cannot happen`)],
        },
        {
          eq: R`P^{a_1}=\begin{array}{c|cccc}&S_1&S_2&S_3&T\\\hline S_1&0&1&0&0\\S_2&0.3&0&0.7&0\\S_3&0&0&0.4&0.6\end{array}`,
          notes: [ex(R`Ex. the graph above, action $a_1$`), shape(R`3\times4:\ \text{rows }S_1..S_3,\ \text{columns }S_1..T`), con(R`no row for $T$: nothing leaves it`)],
        },
        {
          eq: R`P^{a_2}=\begin{array}{c|cccc}&S_1&S_2&S_3&T\\\hline S_1&1&0&0&0\\S_2&0&1&0&0\\S_3&1&0&0&0\end{array}`,
          notes: [ex(R`Ex. action $a_2$: stay in $S_1$ ($r=0$), stay in $S_2$ ($r=+4$), or $S_3$ back to $S_1$ ($r=0$)`)],
        },
        {
          eq: R`R^{a_1}=\begin{array}{c|cccc}&S_1&S_2&S_3&T\\\hline S_1&\cdot&+5&\cdot&\cdot\\S_2&-1&\cdot&+3&\cdot\\S_3&\cdot&\cdot&-2&+10\end{array}`,
          notes: [lab(R`rewards only where $P^{a_1}_{ij}>0$`)],
        },
      ],
      callouts: [
        {
          heading: 'Poll: recycling robot',
          flag: 'I8',
          text: R`Which is $P^{\text{search}}$? Answer C: High row $(0.7,\ 0.3)$, Low row $(0.4,\ 0.6)$. Trap: option B puts the recharge arrow ($p=1.0$, Low to High) into the search matrix; that arrow belongs to a different action. Option A is the transpose: its columns, not rows, sum to 1.`,
          eq: R`P^{\text{search}}=\begin{array}{c|cc}&\text{High}&\text{Low}\\\hline\text{High}&0.7&0.3\\\text{Low}&0.4&0.6\end{array}`,
        },
      ],
    },
  ],
};
