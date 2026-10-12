import { useMemo, useState } from 'react';
import katex from 'katex';

// Slide example "Saving money": reward −100 today, then +5 every day after.
// G_0 = −100 + 5γ + 5γ² + … = −100 + 5γ/(1−γ). Saving pays off only if γ > 100/105.

function Tex({ tex }: { tex: string }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false }), [tex]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const K = 30; // bars shown

export default function DiscountedReturn() {
  const [g, setG] = useState(0.9);
  const weights = Array.from({ length: K }, (_, k) => Math.pow(g, k));
  const G = g >= 1 ? Infinity : -100 + (5 * g) / (1 - g);
  const horizon = g >= 1 ? Infinity : 1 / (1 - g);
  const breakEven = 100 / 105;

  return (
    <div style={{ fontFamily: 'var(--f-body)', color: 'var(--ink)', margin: '8px 0', fontSize: 13 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Tex tex={String.raw`\gamma=${g.toFixed(3)}`} />
        <input
          type="range"
          min={0}
          max={0.995}
          step={0.005}
          value={g}
          onChange={(e) => setG(Number(e.target.value))}
          style={{ flex: 1, maxWidth: 320 }}
        />
      </label>

      <div style={{ marginTop: 10, color: 'var(--ink-2)' }}>
        Weight <Tex tex={String.raw`\gamma^k`} /> on the reward <Tex tex={String.raw`k`} /> steps ahead (first {K} steps)
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80, marginTop: 4 }}>
        {weights.map((w, k) => (
          <div
            key={k}
            title={`k=${k}: ${w.toFixed(3)}`}
            style={{ width: 9, height: Math.max(1, w * 80), background: 'var(--teal)', borderRadius: 2 }}
          />
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        Effective horizon <Tex tex={String.raw`\tfrac{1}{1-\gamma}\approx`} />{' '}
        <b>{Number.isFinite(horizon) ? horizon.toFixed(1) : 'infinite'}</b> steps
      </div>

      <div style={{ marginTop: 10, padding: 10, border: '1px solid var(--rule)', borderRadius: 6, maxWidth: 520 }}>
        <div>
          Saving money: <Tex tex={String.raw`G_0=-100+5\gamma+5\gamma^2+\dots=-100+\dfrac{5\gamma}{1-\gamma}`} />
        </div>
        <div style={{ marginTop: 6 }}>
          <Tex tex={String.raw`G_0=`} />{' '}
          <b style={{ color: G > 0 ? 'var(--green)' : 'var(--red)' }}>{Number.isFinite(G) ? G.toFixed(1) : 'infinite'}</b>{' '}
          {G > 0 ? '· saving is worth it' : '· saving is not worth it'}
        </div>
        <div style={{ marginTop: 6, color: 'var(--ink-2)' }}>
          Break-even at <Tex tex={String.raw`\gamma=\tfrac{100}{105}\approx${breakEven.toFixed(3)}`} />: a more
          impatient agent never saves.
        </div>
      </div>
    </div>
  );
}
