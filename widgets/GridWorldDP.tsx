import { useMemo, useState } from 'react';
import katex from 'katex';

// The lecture GridWorld (5×5): start top-left, walls, a trap (−1) and a goal (+1).
// Deterministic moves; bumping into a wall or the edge leaves the agent where it is.
// Rewards are paid on entering the trap or goal; both are terminal (value 0).

type Cell = [number, number];
type Mode = 'evaluate' | 'iterate';
type Action = 'U' | 'D' | 'L' | 'R';

const N = 5;
const GAMMA = 0.9;
const THETA = 1e-4;
const WALLS = new Set(['1,1', '1,2', '1,3', '2,3', '3,1', '3,3']);
const TERMINAL: Record<string, number> = { '2,2': -1, '4,4': 1 };
const START = '0,0';
const MOVES: Record<Action, Cell> = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };
const ARROW: Record<Action, string> = { U: '↑', D: '↓', L: '←', R: '→' };
const ACTIONS: Action[] = ['U', 'D', 'L', 'R'];

const key = (i: number, j: number) => `${i},${j}`;
const isWall = (i: number, j: number) => WALLS.has(key(i, j));
const isTerminal = (i: number, j: number) => key(i, j) in TERMINAL;

function step(i: number, j: number, a: Action): { ni: number; nj: number; r: number } {
  let ni = i + MOVES[a][0];
  let nj = j + MOVES[a][1];
  if (ni < 0 || ni >= N || nj < 0 || nj >= N || isWall(ni, nj)) {
    ni = i;
    nj = j;
  }
  return { ni, nj, r: TERMINAL[key(ni, nj)] ?? 0 };
}

const backup = (V: number[][], i: number, j: number, a: Action) => {
  const { ni, nj, r } = step(i, j, a);
  return r + GAMMA * V[ni][nj];
};

function sweep(V: number[][], mode: Mode, inPlace: boolean): { next: number[][]; delta: number } {
  const next = V.map((row) => row.slice());
  const read = inPlace ? next : V; // in-place reads the newest values (Gauss-Seidel)
  let delta = 0;
  // In-place sweeps run from the goal corner backwards, so fresh values are read in the same sweep.
  const order = Array.from({ length: N * N }, (_, n) => (inPlace ? N * N - 1 - n : n));
  for (const n of order) {
    const i = Math.floor(n / N);
    const j = n % N;
    if (isWall(i, j) || isTerminal(i, j)) continue;
    const v =
      mode === 'evaluate'
        ? backup(read, i, j, 'R') // policy to evaluate: always go right
        : Math.max(...ACTIONS.map((a) => backup(read, i, j, a)));
    delta = Math.max(delta, Math.abs(v - V[i][j]));
    next[i][j] = v;
  }
  return { next, delta };
}

function greedy(V: number[][], i: number, j: number): Action {
  let best: Action = 'U';
  let bestVal = -Infinity;
  for (const a of ACTIONS) {
    const v = backup(V, i, j, a);
    if (v > bestVal + 1e-9) {
      bestVal = v;
      best = a;
    }
  }
  return best;
}

const init = (v0: number) =>
  Array.from({ length: N }, (_, i) =>
    Array.from({ length: N }, (_, j) => (isWall(i, j) || isTerminal(i, j) ? 0 : v0)),
  );

function Tex({ tex }: { tex: string }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false }), [tex]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function cellColour(v: number): string {
  const x = Math.max(-1, Math.min(1, v));
  const pct = Math.round(Math.abs(x) * 70);
  const hue = x >= 0 ? 'var(--green)' : 'var(--red)';
  return `color-mix(in srgb, ${hue} ${pct}%, var(--paper))`;
}

const button: React.CSSProperties = {
  font: 'inherit',
  fontSize: 13,
  padding: '4px 10px',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  background: 'var(--paper)',
  color: 'var(--ink)',
  cursor: 'pointer',
};

export default function GridWorldDP({ mode = 'iterate' }: { mode?: Mode }) {
  const [v0, setV0] = useState(0);
  const [inPlace, setInPlace] = useState(false);
  const [V, setV] = useState(() => init(0));
  const [k, setK] = useState(0);
  const [delta, setDelta] = useState<number | null>(null);

  const reset = (start = v0, place = inPlace) => {
    setV(init(start));
    setK(0);
    setDelta(null);
    setV0(start);
    setInPlace(place);
  };

  const once = () => {
    const { next, delta: d } = sweep(V, mode, inPlace);
    setV(next);
    setK(k + 1);
    setDelta(d);
  };

  const converge = () => {
    let cur = V;
    let n = k;
    let d = Infinity;
    while (d >= THETA && n < 2000) {
      const out = sweep(cur, mode, inPlace);
      cur = out.next;
      d = out.delta;
      n++;
    }
    setV(cur);
    setK(n);
    setDelta(d);
  };

  const done = delta !== null && delta < THETA;
  const update =
    mode === 'evaluate'
      ? String.raw`V_{k+1}(s)=r+\gamma V_k(s')\ \ \text{with }a=\text{Right}`
      : String.raw`V_{k+1}(s)=\max_a\big[r+\gamma V_k(s')\big]`;

  return (
    <div style={{ fontFamily: 'var(--f-body)', color: 'var(--ink)', margin: '8px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 8 }}>
        {mode === 'evaluate' ? 'Policy evaluation of “always go right”' : 'Value iteration'} ·{' '}
        <Tex tex={update} /> · <Tex tex={String.raw`\gamma=0.9`} />
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${N}, 56px)`,
            gap: 3,
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
          }}
        >
          {V.flatMap((row, i) =>
            row.map((v, j) => {
              const kk = key(i, j);
              const wall = isWall(i, j);
              const term = isTerminal(i, j);
              const arrow = !wall && !term ? (mode === 'evaluate' ? ARROW.R : k > 0 ? ARROW[greedy(V, i, j)] : '') : '';
              return (
                <div
                  key={kk}
                  style={{
                    height: 56,
                    borderRadius: 4,
                    border: kk === START ? '2px solid var(--teal)' : '1px solid var(--rule)',
                    background: wall
                      ? 'var(--ink-2)'
                      : term
                        ? TERMINAL[kk] > 0
                          ? 'var(--green)'
                          : 'var(--red)'
                        : cellColour(v),
                    color: term ? 'var(--paper)' : 'var(--ink)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {wall ? null : term ? (
                    <span>{TERMINAL[kk] > 0 ? 'goal +1' : 'trap −1'}</span>
                  ) : (
                    <>
                      <span>{Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2)}</span>
                      <span style={{ color: 'var(--teal)', fontSize: 14 }}>{arrow}</span>
                    </>
                  )}
                </div>
              );
            }),
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, minWidth: 200 }}>
          <div>
            <b>k = {k}</b>
            {delta !== null && (
              <span style={{ color: 'var(--ink-2)' }}>
                {' '}
                · largest change {delta < 1e-3 ? delta.toExponential(1) : delta.toFixed(3)}
              </span>
            )}
          </div>
          {done && <div style={{ color: 'var(--green)' }}>Converged (change below 0.0001)</div>}
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={button} onClick={once}>
              One sweep
            </button>
            <button style={button} onClick={converge}>
              Run to convergence
            </button>
            <button style={button} onClick={() => reset()}>
              Reset
            </button>
          </div>
          <label>
            <input type="checkbox" checked={inPlace} onChange={(e) => reset(v0, e.target.checked)} /> In-place
            (Gauss-Seidel) sweep, starting from the goal corner
          </label>
          <label>
            <input type="checkbox" checked={v0 === 1000} onChange={(e) => reset(e.target.checked ? 1000 : 0, inPlace)} />{' '}
            Start every state at 1000 instead of 0
          </label>
          <div style={{ color: 'var(--ink-2)', maxWidth: 260 }}>
            {mode === 'evaluate'
              ? 'Watch the bottom row fill in from the goal backwards, one cell per sweep. States whose “right” bumps a wall stay at 0 forever.'
              : 'Each sweep pushes the goal’s +1 one step further back; the arrows (greedy action) settle before the numbers do.'}
          </div>
        </div>
      </div>
    </div>
  );
}
