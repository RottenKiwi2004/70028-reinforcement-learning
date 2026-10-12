import { R, ex, lab, slide, tag, term, text } from 'principia';
import type { Topic } from 'principia';

export const dpIntro: Topic = {
  id: 'dp-intro',
  title: 'Dynamic programming',
  short: 'DP',
  summary: R`Lecture 2 turns the Bellman equations into algorithms. Dynamic programming solves a big problem by reusing answers to smaller ones, and for a known MDP it gives exact optimal values and policies.`,
  sections: [
    {
      id: 'goals',
      title: 'From equations to algorithms',
      why: R`Lecture 1 told us what $V^\pi$, $V^*$ and $\pi^*$ satisfy, but not how to compute them. This lecture is the "how", assuming we know the model $P$ and $R$.`,
      slides: [slide('L2', 5, 'How do we turn the Bellman equations into working algorithms?')],
      pre: [
        text(R`Transform Bellman equations into practical algorithms.`),
        text(R`Master Policy Iteration and Value Iteration.`),
        text(R`Understand the computational foundations of all RL.`),
      ],
      rows: [],
    },
    {
      id: 'what-is-dp',
      title: 'What dynamic programming is',
      why: R`The Bellman equation writes a state's value using its successors' values, which is exactly the "reuse smaller answers" structure DP exploits. Storing $V$ in a table and updating it is DP.`,
      slides: [slide('L2', 6, 'What is Dynamic Programming?')],
      rows: [
        {
          eq: R`V(s)\ \text{built from stored}\ V(s')`,
          notes: [
            term('Dynamic Programming (DP)'),
            text(R`break a problem into subproblems, solve each once, store the results`),
            tag(['I17'], R`the Bellman equation supplies the subproblem structure`),
          ],
        },
      ],
      pre: [
        ex(R`Ex. Fibonacci numbers: store previous results instead of recomputing`),
        ex(R`Ex. shortest paths: Dijkstra and Bellman-Ford`),
        ex(R`Ex. RL: solving MDPs via Bellman equations`),
        lab(R`DP gives exact algorithms for optimal policies and value functions, given the model.`),
      ],
    },
  ],
};
