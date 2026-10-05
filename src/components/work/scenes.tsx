/**
 * Animated line drawings for each project. Every scene is a pure function
 * of t in [0, 1); SceneView owns the clock. Colors come from the .scene
 * classes in globals.css so light and dark mode both work.
 */
import type { ReactNode } from "react";
import type { SceneKey } from "@/data/work";

type Pt = [number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const r1 = (n: number) => Math.round(n * 10) / 10;

const toD = (pts: Pt[]) =>
  "M" + pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L");

const poly = (pts: Pt[]) => pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ");

function polyLength(pts: Pt[]) {
  let length = 0;
  for (let i = 1; i < pts.length; i++) {
    length += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return length;
}

function pointAlong(pts: Pt[], f: number): Pt {
  let remaining = clamp01(f) * polyLength(pts);
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const step = Math.hypot(bx - ax, by - ay);
    if (remaining <= step) {
      const k = step === 0 ? 0 : remaining / step;
      return [ax + (bx - ax) * k, ay + (by - ay) * k];
    }
    remaining -= step;
  }
  return pts[pts.length - 1];
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const p1: Pt = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const p2: Pt = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];
  return `M${r1(p1[0])},${r1(p1[1])} A${r1(r)},${r1(r)} 0 0 1 ${r1(p2[0])},${r1(p2[1])}`;
}

/* ------------------------------------------------------------------ */
/* FairLie mat: strike → pads → radar → BLE → phone                     */
/* ------------------------------------------------------------------ */

const PAD_X = [0, 1, 2, 3, 4, 5].map((i) => 80 + i * 21);
const PAD_LOAD = [0.35, 0.55, 0.8, 1, 0.85, 0.6];
const BALL_X = 214;

function clubAt(t: number) {
  if (t < 0.45) {
    const s = seg(t, 0, 0.45);
    const x = lerp(-12, BALL_X - 8, s * s);
    const y = 90 + ((x - (BALL_X - 8)) / 210) ** 2 * 46;
    return { x, y, o: smooth(seg(t, 0, 0.08)) };
  }
  const f = seg(t, 0.45, 0.62);
  const x = lerp(BALL_X - 8, BALL_X + 100, f);
  const y = 90 - (f * f) * 26;
  return { x, y, o: 1 - f };
}

function StrikeScene({ t }: { t: number }) {
  const club = clubAt(t);
  const loads = PAD_X.map((px, i) => {
    const hit = 0.45 * Math.sqrt((px + 12) / (BALL_X + 4));
    return t >= hit ? Math.exp(-(t - hit) / 0.14) * PAD_LOAD[i] : 0;
  });
  const flight = seg(t, 0.45, 0.58);
  const ballX = BALL_X + flight * 130;
  const ballO = t < 0.45 ? 1 : t < 0.6 ? 1 : seg(t, 0.88, 0.98);
  const speed = Math.round(112 * smooth(seg(t, 0.8, 0.9)));
  const readoutO = 1 - seg(t, 0.94, 1);

  return (
    <>
      {/* mat outline: arced end where the golfer stands, point toward target */}
      <path
        className="ln fill-paper"
        d="M40,60 L232,60 L264,90 L232,120 L40,120 Q54,90 40,60 Z"
      />
      <line className="ln faint" x1="52" y1="90" x2="258" y2="90" strokeDasharray="2 4" />

      {PAD_X.map((x, i) => (
        <g key={x}>
          <rect className="ln fill-paper" x={x - 7} y={83} width={14} height={14} rx={2} />
          <rect
            className="fill-sig"
            x={x - 7}
            y={83}
            width={14}
            height={14}
            rx={2}
            opacity={loads[i] * 0.9}
          />
        </g>
      ))}

      {/* radar pod on the long side, control cassette on the other */}
      <rect className="ln fill-paper" x="132" y="45" width="28" height="10" rx="2" />
      <text x="146" y="40" textAnchor="middle">60 GHz radar</text>
      {[0, 1, 2].map((k) => {
        const p = seg(t, 0.46 + k * 0.05, 0.66 + k * 0.05);
        if (p <= 0 || p >= 1) return null;
        return (
          <path
            key={k}
            className="ln sig"
            d={arcPath(146, 55, 8 + p * 70, -0.15, 1.1)}
            opacity={1 - p}
          />
        );
      })}

      <rect className="ln fill-paper" x="112" y="123" width="46" height="12" rx="2" />
      <text x="135" y="148" textAnchor="middle">control cassette</text>

      {/* ball */}
      <circle className="ln fill-paper" cx={ballX} cy={90} r={4.5} opacity={ballO} />

      {/* club head with a short motion trail */}
      {[3, 2, 1, 0].map((k) => {
        const c = clubAt(Math.max(0, t - k * 0.012));
        return (
          <rect
            key={k}
            className={k === 0 ? "ln fill-paper" : "ln faint"}
            x={c.x - 9}
            y={c.y - 4}
            width={18}
            height={8}
            rx={2.5}
            opacity={club.o * (k === 0 ? 1 : 0.5 - k * 0.12)}
          />
        );
      })}

      {/* BLE packets to the phone */}
      {[0, 1, 2, 3].map((k) => {
        const p = seg(t, 0.62 + k * 0.04, 0.78 + k * 0.04);
        if (p <= 0 || p >= 1) return null;
        const [x, y] = pointAlong(
          [
            [158, 129],
            [230, 140],
            [278, 134],
          ],
          p
        );
        return <circle key={k} className="fill-sig" cx={x} cy={y} r={2} opacity={Math.sin(Math.PI * p)} />;
      })}
      <rect className="ln fill-paper" x="280" y="106" width="30" height="54" rx="6" />
      <g opacity={readoutO}>
        <text className="t-ink t-num" x="295" y="133" textAnchor="middle" fontSize="11">
          {speed > 0 ? speed : "--"}
        </text>
        <text x="295" y="143" textAnchor="middle" fontSize="6">mph</text>
      </g>

      {/* live pressure readout */}
      <g>
        {loads.map((l, i) => (
          <rect
            key={i}
            className="fill-sig"
            x={22 + i * 10}
            y={170 - Math.max(1, l * 26)}
            width={7}
            height={Math.max(1, l * 26)}
            rx={1}
            opacity={0.25 + l * 0.75}
          />
        ))}
        <line className="ln faint" x1="20" y1="170.5" x2="80" y2="170.5" />
        <text x="86" y="169">pressure</text>
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Control board: traces route, then signals flow                      */
/* ------------------------------------------------------------------ */

const TRACES: Pt[][] = [
  [[130, 70], [104, 70], [96, 78], [46, 78]],
  [[92, 72], [100, 72], [108, 62], [130, 62]],
  [[86, 44], [130, 44]],
  [[48, 128], [74, 128], [74, 84]],
  [[200, 40], [212, 40], [218, 48], [224, 48]],
  [[165, 82], [165, 96], [171, 102], [203, 102], [203, 112]],
  [[182, 82], [182, 92], [237, 92], [237, 112]],
  [[203, 128], [203, 144]],
  [[237, 128], [237, 144]],
  [[146, 82], [146, 124], [128, 140], [128, 144]],
  [[200, 30], [262, 30], [270, 38], [276, 38]],
  [[200, 56], [256, 56], [266, 64], [276, 64]],
  [[200, 70], [250, 70], [258, 90], [276, 90]],
];
const TRACE_LEN = TRACES.map(polyLength);

function Chip({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}) {
  return (
    <g>
      <rect className="ln fill-paper" x={x} y={y} width={w} height={h} rx={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 2.5} textAnchor="middle" fontSize="6.5">
        {label}
      </text>
    </g>
  );
}

function BoardScene({ t }: { t: number }) {
  const fade = 1 - seg(t, 0.93, 1);
  return (
    <>
      <rect className="ln fill-muted" x="30" y="16" width="260" height="148" rx="6" />
      {[
        [40, 26],
        [280, 26],
        [40, 154],
        [280, 154],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} className="ln faint" cx={cx} cy={cy} r={5} />
      ))}

      {TRACES.map((pts, i) => {
        const p = smooth(seg(t, i * 0.025, i * 0.025 + 0.18));
        return (
          <path
            key={i}
            className="ln"
            d={toD(pts)}
            strokeWidth={1.6}
            strokeDasharray={TRACE_LEN[i]}
            strokeDashoffset={TRACE_LEN[i] * (1 - p)}
            opacity={fade}
          />
        );
      })}

      {t > 0.5 && t < 0.93
        ? TRACES.map((pts, i) => {
            const f = ((t - 0.5) * 2.4 + i * 0.37) % 1;
            const [x, y] = pointAlong(i % 3 === 0 ? [...pts].reverse() : pts, f);
            return (
              <circle
                key={i}
                className="fill-sig"
                cx={x}
                cy={y}
                r={2}
                opacity={Math.sin(Math.PI * f) * seg(t, 0.5, 0.56)}
              />
            );
          })
        : null}

      {/* ESP32-S3 module with its antenna keep-out */}
      <rect className="ln fill-paper" x="130" y="22" width="70" height="60" rx="2" />
      <rect className="ln faint" x="134" y="25" width="62" height="12" strokeDasharray="2 2" />
      <text className="t-ink" x="165" y="58" textAnchor="middle" fontSize="8">ESP32-S3</text>

      <rect className="ln fill-paper" x="30" y="70" width="16" height="22" rx="2" />
      <text x="38" y="102" textAnchor="middle" fontSize="6.5">USB-C</text>
      <Chip x={60} y={64} w={32} h={20} label="charge" />
      <Chip x={62} y={36} w={24} h={16} label="3.3 V" />
      <Chip x={34} y={120} w={14} h={16} label="" />
      <text x="41" y="146" textAnchor="middle" fontSize="6.5">Li-Po</text>
      <Chip x={224} y={40} w={26} h={18} label="IMU" />
      <Chip x={190} y={112} w={26} h={16} label="ADC" />
      <Chip x={224} y={112} w={26} h={16} label="ADC" />
      <Chip x={184} y={144} w={72} h={10} label="pressure pads 0–5" />
      <Chip x={98} y={144} w={60} h={10} label="camera" />
      {[38, 64, 90].map((y) => (
        <rect key={y} className="ln fill-paper" x="276" y={y - 7} width="12" height="14" rx="1.5" />
      ))}
      <text x="289" y="108" textAnchor="end" fontSize="6.5">radar, temp</text>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Housing: lid lifts, board comes out, goes back, lid screws down      */
/* ------------------------------------------------------------------ */

const ISO_S = 0.62;
const iso = (x: number, y: number, z: number): Pt => [
  160 + (x - y) * 0.866 * ISO_S,
  104 + (x + y) * 0.5 * ISO_S - z * ISO_S,
];

function Box({
  x0,
  x1,
  y0,
  y1,
  z0,
  z1,
  topClass = "ln fill-paper",
}: {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z0: number;
  z1: number;
  topClass?: string;
}) {
  return (
    <g>
      <polygon
        className="ln fill-muted"
        points={poly([iso(x1, y0, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x1, y0, z1)])}
      />
      <polygon
        className="ln fill-paper"
        points={poly([iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y1, z1)])}
      />
      <polygon
        className={topClass}
        points={poly([iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1)])}
      />
    </g>
  );
}

function EnclosureScene({ t }: { t: number }) {
  const lidZ =
    t < 0.5
      ? lerp(20, 80, smooth(seg(t, 0.08, 0.22)))
      : lerp(80, 20, smooth(seg(t, 0.68, 0.8)));
  const boardZ =
    t < 0.5
      ? lerp(8, 46, smooth(seg(t, 0.22, 0.36)))
      : lerp(46, 8, smooth(seg(t, 0.55, 0.68)));
  const screwsIn = t < 0.5 ? 1 - seg(t, 0, 0.08) : smooth(seg(t, 0.8, 0.94));
  const screwO = t < 0.5 ? 1 - seg(t, 0.05, 0.09) : seg(t, 0.8, 0.84);
  const labelO = seg(t, 0.34, 0.4) * (1 - seg(t, 0.52, 0.56));
  const spin = t * Math.PI * 16;

  const inner = { x0: -75, x1: 75, y0: -45, y1: 45 };
  const hull: Pt[] = [
    iso(inner.x0, inner.y1, 20),
    iso(inner.x1, inner.y1, 20),
    iso(inner.x1, inner.y0, 20),
    [iso(inner.x1, inner.y0, 20)[0], -200],
    [iso(inner.x0, inner.y1, 20)[0], -200],
  ];

  return (
    <>
      <defs>
        <clipPath id="tray-opening">
          <polygon points={poly(hull)} />
        </clipPath>
      </defs>

      {/* cassette tray with its open cavity */}
      <Box x0={-80} x1={80} y0={-50} y1={50} z0={0} z1={20} />
      <polygon
        className="ln fill-muted"
        points={poly([
          iso(inner.x0, inner.y0, 20),
          iso(inner.x1, inner.y0, 20),
          iso(inner.x1, inner.y1, 20),
          iso(inner.x0, inner.y1, 20),
        ])}
      />
      <path
        className="ln faint"
        d={toD([iso(inner.x1, inner.y0, 3), iso(inner.x0, inner.y0, 3), iso(inner.x0, inner.y1, 3)])}
      />
      <line
        className="ln faint"
        x1={iso(inner.x0, inner.y0, 20)[0]}
        y1={iso(inner.x0, inner.y0, 20)[1]}
        x2={iso(inner.x0, inner.y0, 3)[0]}
        y2={iso(inner.x0, inner.y0, 3)[1]}
      />

      {/* control board */}
      <g clipPath={boardZ < 22 ? "url(#tray-opening)" : undefined}>
        <Box x0={-68} x1={68} y0={-38} y1={38} z0={boardZ} z1={boardZ + 2} />
        <Box x0={-30} x1={10} y0={-30} y1={0} z0={boardZ + 2} z1={boardZ + 5} />
        <Box x0={24} x1={40} y0={-20} y1={-6} z0={boardZ + 2} z1={boardZ + 4} />
        <Box x0={24} x1={40} y0={8} y1={22} z0={boardZ + 2} z1={boardZ + 4} />
        <Box x0={-60} x1={-48} y0={10} y1={30} z0={boardZ + 2} z1={boardZ + 6} topClass="ln fill-sig-soft" />
      </g>

      {/* lid */}
      <Box x0={-80} x1={80} y0={-50} y1={50} z0={lidZ} z1={lidZ + 3} />

      {/* screws */}
      {screwO > 0
        ? [
            [-70, -40],
            [70, -40],
            [-70, 40],
            [70, 40],
          ].map(([x, y]) => {
            const lift = (1 - screwsIn) * 22;
            const [cx, cy] = iso(x, y, lidZ + 3 + lift);
            const a = spin * (t < 0.5 ? -1 : 1);
            return (
              <g key={`${x}-${y}`} opacity={screwO}>
                <ellipse className="ln fill-paper" cx={cx} cy={cy} rx={3.6} ry={2.1} />
                <line
                  className="ln"
                  x1={cx - Math.cos(a) * 2.6}
                  y1={cy - Math.sin(a) * 1.4}
                  x2={cx + Math.cos(a) * 2.6}
                  y2={cy + Math.sin(a) * 1.4}
                />
              </g>
            );
          })
        : null}

      <g opacity={labelO}>
        <path className="ln faint" d={toD([iso(80, -50, 81), [262, 14]])} />
        <text x="266" y="16">screw-down lid</text>
        <path className="ln faint" d={toD([iso(68, -38, 48), [262, 56]])} />
        <text x="266" y="58">board</text>
        <path className="ln faint" d={toD([iso(80, 50, 10), [232, 160]])} />
        <text x="236" y="163">160 × 100 × 20 mm</text>
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* iPhone app: packet arrives, score and numbers fill in               */
/* ------------------------------------------------------------------ */

const TREND = [62, 66, 64, 71, 69, 76, 74, 80];

function AppScene({ t }: { t: number }) {
  const reset = 1 - seg(t, 0.92, 1);
  const score = smooth(seg(t, 0.18, 0.5));
  const ringLen = 2 * Math.PI * 24;
  const metric = (a: number) => smooth(seg(t, a, a + 0.2));
  const newPoint = smooth(seg(t, 0.6, 0.76));
  const pts: Pt[] = [...TREND, 87].map((v, i) => [
    230 + i * 9,
    150 - (v - 55) * 1.6,
  ]);
  const shown = pts.slice(0, TREND.length);
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2];

  return (
    <>
      {/* mat and incoming packets */}
      <path className="ln fill-paper" d="M14,82 L70,82 L80,90 L70,98 L14,98 Q18,90 14,82 Z" />
      <text x="40" y="112" textAnchor="middle">mat + radar</text>
      {[0, 1, 2].map((k) => {
        const p = seg(t, k * 0.04, 0.16 + k * 0.04);
        if (p <= 0 || p >= 1) return null;
        return (
          <circle key={k} className="fill-sig" cx={lerp(82, 108, p)} cy={90} r={2} opacity={Math.sin(Math.PI * p)} />
        );
      })}

      {/* phone */}
      <rect className="ln fill-paper" x="110" y="8" width="100" height="164" rx="14" />
      <rect className="ln faint" x="148" y="13" width="24" height="5" rx="2.5" />
      <circle className="fill-sig" cx="124" cy="30" r="2" opacity={0.5 + 0.5 * Math.sin(t * Math.PI * 8)} />
      <text x="129" y="32" fontSize="6.5">Mat connected</text>

      <circle className="ln faint" cx="160" cy="66" r="24" strokeWidth={4} />
      <circle
        className="ln sig"
        cx="160"
        cy="66"
        r="24"
        strokeWidth={4}
        strokeDasharray={ringLen}
        strokeDashoffset={ringLen * (1 - 0.87 * score * reset)}
        transform="rotate(-90 160 66)"
      />
      <text className="t-ink t-num" x="160" y="70" textAnchor="middle" fontSize="13" fontWeight="700">
        {Math.round(87 * score * reset)}
      </text>
      <text x="160" y="100" textAnchor="middle" fontSize="6.5">strike score</text>

      {[
        ["Ball speed", 112, "mph", 0.4],
        ["Club speed", 84, "mph", 0.46],
        ["Carry", 168, "yd", 0.52],
      ].map(([label, value, unit, at], i) => {
        const m = metric(at as number) * reset;
        const y = 118 + i * 16;
        return (
          <g key={label as string} opacity={0.35 + 0.65 * m}>
            <line className="ln faint" x1="120" y1={y + 5} x2="200" y2={y + 5} />
            <text x="120" y={y} fontSize="6.5">{label}</text>
            <text className="t-ink t-num" x="200" y={y} textAnchor="end" fontSize="7">
              {m > 0.02 ? `${Math.round((value as number) * m)} ${unit}` : "--"}
            </text>
          </g>
        );
      })}

      {/* progress trend picks up the new session */}
      <text x="230" y="60">progress</text>
      <path className="ln faint" d={toD(shown)} />
      {shown.map(([x, y], i) => (
        <circle key={i} className="fill-ink" cx={x} cy={y} r={1.6} opacity={0.6} />
      ))}
      <path
        className="ln sig"
        d={toD([prev, [lerp(prev[0], last[0], newPoint), lerp(prev[1], last[1], newPoint)]])}
        opacity={reset}
      />
      <circle className="fill-sig" cx={last[0]} cy={last[1]} r={2.6 * newPoint * reset} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* NAS: files leave the SSD, get sorted by type                        */
/* ------------------------------------------------------------------ */

const NAS_FILES: ("photo" | "doc")[] = ["photo", "doc", "photo", "photo", "doc", "photo"];

function FileIcon({ x, y, kind }: { x: number; y: number; kind: "photo" | "doc" }) {
  return (
    <g transform={`translate(${r1(x - 7)} ${r1(y - 9)})`}>
      <path className="ln fill-paper" d="M0,0 L10,0 L14,4 L14,18 L0,18 Z" />
      {kind === "photo" ? (
        <path className="ln sig" d="M2.5,14 L6,9.5 L8.5,12 L10,10.5 L12,14" />
      ) : (
        <path className="ln faint" d="M3,7 L11,7 M3,10 L11,10 M3,13 L9,13" />
      )}
    </g>
  );
}

function Folder({ x, y, label, bump }: { x: number; y: number; label: string; bump: number }) {
  const s = 1 + bump * 0.08;
  return (
    <g transform={`translate(${x} ${y}) scale(${r1(s * 100) / 100})`}>
      <path className="ln fill-paper" d="M-20,-12 L-6,-12 L-2,-8 L20,-8 L20,14 L-20,14 Z" />
      <text x="0" y="26" textAnchor="middle">{label}</text>
    </g>
  );
}

function NasScene({ t }: { t: number }) {
  const files = NAS_FILES.map((kind, i) => {
    const start = i * 0.1;
    const p = seg(t, start, start + 0.42);
    const target: Pt = kind === "photo" ? [264, 52] : [264, 122];
    const route: Pt[] = [
      [62, 90],
      [160, 90],
      [200, 90],
      target,
    ];
    return { kind, p, pos: pointAlong(route, smooth(p)), inside: p > 0.32 && p < 0.62 };
  });
  const busy = files.some((f) => f.inside);

  return (
    <>
      {/* SSD */}
      <rect className="ln fill-paper" x="20" y="74" width="44" height="32" rx="3" />
      <rect className="ln faint" x="26" y="80" width="20" height="8" rx="1" />
      <text x="42" y="120" textAnchor="middle">SSD</text>

      {files.map((f, i) =>
        f.p > 0 && f.p < 1 ? <FileIcon key={i} x={f.pos[0]} y={f.pos[1]} kind={f.kind} /> : null
      )}

      {/* mini-ITX server */}
      <rect className="ln fill-paper" x="128" y="34" width="62" height="112" rx="4" />
      {[54, 78].map((y, i) => (
        <g key={y}>
          <rect className="ln fill-muted" x="136" y={y} width="46" height="16" rx="2" />
          <circle
            className="fill-sig"
            cx="174"
            cy={y + 8}
            r="2"
            opacity={busy ? (Math.sin(t * Math.PI * 40 + i * 2) > 0 ? 1 : 0.25) : 0.2}
          />
        </g>
      ))}
      <circle className="ln faint" cx="159" cy="122" r="9" />
      <text x="159" y="158" textAnchor="middle">8 TB NAS</text>
      <text x="96" y="112" textAnchor="middle">ingest</text>

      <Folder x={264} y={52} label="Photos" bump={landingPulse("photo", t)} />
      <Folder x={264} y={122} label="Coursework" bump={landingPulse("doc", t)} />
    </>
  );
}

/** Brief 0→1→0 bump when a file of this kind lands in its folder. */
function landingPulse(kind: "photo" | "doc", t: number) {
  let pulse = 0;
  NAS_FILES.forEach((k, i) => {
    if (k !== kind) return;
    const since = t - (i * 0.1 + 0.42);
    if (since >= 0 && since < 0.06) pulse = Math.max(pulse, Math.sin((since / 0.06) * Math.PI));
  });
  return pulse;
}

/* ------------------------------------------------------------------ */
/* Stirling engine: crank-slider kinematics, displacer leads by 90°     */
/* ------------------------------------------------------------------ */

const CRANK: Pt = [182, 140];
const CRANK_R = 13;

function slider(axisX: number, pin: Pt, rod: number) {
  const dx = axisX - pin[0];
  return pin[1] - Math.sqrt(rod * rod - dx * dx);
}

function StirlingScene({ t }: { t: number }) {
  const theta = t * Math.PI * 2;
  const pinD: Pt = [CRANK[0] + CRANK_R * Math.cos(theta), CRANK[1] + CRANK_R * Math.sin(theta)];
  const pinP: Pt = [
    CRANK[0] + CRANK_R * Math.cos(theta - Math.PI / 2),
    CRANK[1] + CRANK_R * Math.sin(theta - Math.PI / 2),
  ];
  // Axis offsets and rod lengths chosen so both pistons stay inside their bores.
  const dispX = 150;
  const powX = 214;
  const dispY = slider(dispX, pinD, 80);
  const powY = slider(powX, pinP, 72);
  const hotShare = clamp01((dispY - 52) / 29);

  return (
    <>
      {/* displacer cylinder: hot end on top, cooling fins at the bottom */}
      <rect className="ln fill-paper" x="126" y="14" width="48" height="78" rx="2" />
      <rect
        className="fill-sig"
        x="127"
        y="15"
        width="46"
        height={Math.max(0, dispY - 24 - 15)}
        opacity={0.12 + hotShare * 0.22}
      />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          className="ln sig"
          d={`M${136 + k * 14},10 q3,-3 0,-6 q-3,-3 0,-6`}
          opacity={0.4 + 0.6 * Math.abs(Math.sin(theta + k))}
        />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <line key={k} className="ln faint" x1="120" y1={72 + k * 5} x2="126" y2={72 + k * 5} />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <line key={`r${k}`} className="ln faint" x1="174" y1={72 + k * 5} x2="180" y2={72 + k * 5} />
      ))}
      <text x="114" y="24" textAnchor="end">hot</text>
      <text x="114" y="84" textAnchor="end">cold</text>

      <rect className="ln fill-muted" x={dispX - 20} y={dispY - 24} width="40" height="24" rx="2" />
      <text x={dispX} y={dispY - 9.5} textAnchor="middle" fontSize="6.5">displacer</text>

      {/* gas passage to the power cylinder */}
      <path className="ln faint" d="M174,36 L190,36 L190,24 L214,24 L214,30" />

      {/* power cylinder */}
      <rect className="ln fill-paper" x="200" y="30" width="28" height="66" rx="2" />
      <rect className="ln fill-muted" x={powX - 12} y={powY - 12} width="24" height="12" rx="1.5" />
      <text x="236" y="52">power piston</text>

      {/* rods */}
      <line className="ln" x1={dispX} y1={dispY} x2={pinD[0]} y2={pinD[1]} />
      <line className="ln" x1={powX} y1={powY} x2={pinP[0]} y2={pinP[1]} />

      {/* flywheel */}
      <circle className="ln fill-paper" cx={CRANK[0]} cy={CRANK[1]} r="32" />
      <circle className="ln faint" cx={CRANK[0]} cy={CRANK[1]} r="27" />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = theta + (k * Math.PI) / 3;
        return (
          <line
            key={k}
            className="ln faint"
            x1={CRANK[0] + Math.cos(a) * 6}
            y1={CRANK[1] + Math.sin(a) * 6}
            x2={CRANK[0] + Math.cos(a) * 27}
            y2={CRANK[1] + Math.sin(a) * 27}
          />
        );
      })}
      <line className="ln" x1={CRANK[0]} y1={CRANK[1]} x2={pinD[0]} y2={pinD[1]} />
      <line className="ln" x1={CRANK[0]} y1={CRANK[1]} x2={pinP[0]} y2={pinP[1]} />
      <path className="ln sig" d={arcPath(CRANK[0], CRANK[1], 20, theta - Math.PI / 2, theta)} />
      <circle className="fill-ink" cx={CRANK[0]} cy={CRANK[1]} r="2.5" />
      <circle className="ln fill-paper" cx={pinD[0]} cy={pinD[1]} r="2.6" />
      <circle className="ln fill-paper" cx={pinP[0]} cy={pinP[1]} r="2.6" />
      <text x="222" y="150">90° phase</text>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Universal joint: real output angle, speed-ratio trace                */
/* ------------------------------------------------------------------ */

const BETA = Math.PI / 6;
const ratio = (th: number) =>
  Math.cos(BETA) / (1 - Math.sin(BETA) ** 2 * Math.cos(th) ** 2);
const PLOT = { x0: 208, x1: 304, y0: 40, y1: 128 };
const plotY = (r: number) => lerp(PLOT.y1, PLOT.y0, (r - 0.84) / (1.18 - 0.84));
const CURVE: Pt[] = Array.from({ length: 73 }, (_, i) => {
  const th = (i / 72) * Math.PI * 2;
  return [lerp(PLOT.x0, PLOT.x1, i / 72), plotY(ratio(th))];
});

function UJointScene({ t }: { t: number }) {
  const th1 = t * Math.PI * 2;
  const th2 = Math.atan2(Math.sin(th1), Math.cos(th1) * Math.cos(BETA));
  const J: Pt = [112, 86];
  const dir: Pt = [Math.cos(BETA), Math.sin(BETA)];
  const nrm: Pt = [-dir[1], dir[0]];
  const outEnd: Pt = [J[0] + dir[0] * 92, J[1] + dir[1] * 92];
  const fork1 = 11 * Math.cos(th1);
  const fork2 = 11 * Math.sin(th2);
  const mark1 = 6 * Math.sin(th1);
  const mark2 = 6 * Math.cos(th2);
  const traced = CURVE.slice(0, Math.max(2, Math.floor(t * 72) + 1));
  const now: Pt = [lerp(PLOT.x0, PLOT.x1, t), plotY(ratio(th1))];

  return (
    <>
      {/* input shaft */}
      <rect className="ln fill-paper" x="18" y={J[1] - 6} width={J[0] - 30} height="12" rx="2" />
      <circle className="fill-sig" cx="56" cy={J[1] + mark1} r="2.2" opacity={Math.cos(th1) > 0 ? 1 : 0.25} />
      <path className="ln" d={`M${J[0] - 12},${J[1] - fork1} L${J[0] + 2},${J[1] - fork1} M${J[0] - 12},${J[1] + fork1} L${J[0] + 2},${J[1] + fork1}`} />

      {/* output shaft, 30° off axis */}
      <polygon
        className="ln fill-paper"
        points={poly([
          [J[0] + dir[0] * 12 + nrm[0] * 6, J[1] + dir[1] * 12 + nrm[1] * 6],
          [outEnd[0] + nrm[0] * 6, outEnd[1] + nrm[1] * 6],
          [outEnd[0] - nrm[0] * 6, outEnd[1] - nrm[1] * 6],
          [J[0] + dir[0] * 12 - nrm[0] * 6, J[1] + dir[1] * 12 - nrm[1] * 6],
        ])}
      />
      <circle
        className="fill-sig"
        cx={J[0] + dir[0] * 56 + nrm[0] * mark2}
        cy={J[1] + dir[1] * 56 + nrm[1] * mark2}
        r="2.2"
        opacity={Math.sin(th2) > 0 ? 1 : 0.25}
      />
      <path
        className="ln"
        d={`M${r1(J[0] - dir[0] * 2 + nrm[0] * fork2)},${r1(J[1] - dir[1] * 2 + nrm[1] * fork2)} L${r1(J[0] + dir[0] * 12 + nrm[0] * fork2)},${r1(J[1] + dir[1] * 12 + nrm[1] * fork2)} M${r1(J[0] - dir[0] * 2 - nrm[0] * fork2)},${r1(J[1] - dir[1] * 2 - nrm[1] * fork2)} L${r1(J[0] + dir[0] * 12 - nrm[0] * fork2)},${r1(J[1] + dir[1] * 12 - nrm[1] * fork2)}`}
      />
      <circle className="ln fill-paper" cx={J[0]} cy={J[1]} r="5" />
      <path className="ln faint" d={`M${J[0]},${J[1]} L${J[0] + 40},${J[1]}`} strokeDasharray="2 3" />
      <path className="ln faint" d={arcPath(J[0], J[1], 30, 0, BETA)} />
      <text x={J[0] + 38} y={J[1] + 9}>30°</text>
      <text x="24" y={J[1] + 24}>input</text>
      <text x={outEnd[0] - 14} y={outEnd[1] + 16}>output</text>

      {/* speed ratio plot */}
      <line className="ln faint" x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} />
      <line className="ln faint" x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} />
      <line className="ln faint" x1={PLOT.x0} y1={plotY(1)} x2={PLOT.x1} y2={plotY(1)} strokeDasharray="2 3" />
      <text x={PLOT.x0 - 4} y={plotY(1) + 2.5} textAnchor="end" fontSize="6.5">1.0</text>
      <path className="ln faint" d={toD(CURVE)} opacity={0.5} />
      <path className="ln sig" d={toD([...traced, now])} />
      <circle className="fill-sig" cx={now[0]} cy={now[1]} r="2.6" />
      <text x={PLOT.x0} y={PLOT.y0 - 8}>output ÷ input speed</text>
      <text x={PLOT.x1} y={PLOT.y1 + 12} textAnchor="end">one turn</text>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Swipe app: save one school, pass on the next                        */
/* ------------------------------------------------------------------ */

function SchoolCard({
  x,
  y,
  rot,
  scale,
  opacity,
  badge,
}: {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
  badge?: { kind: "save" | "pass"; o: number };
}) {
  return (
    <g
      transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${r1(scale * 100) / 100})`}
      opacity={opacity}
    >
      <rect className="ln fill-paper" x="-30" y="-46" width="60" height="92" rx="6" />
      <path className="ln" d="M-16,-12 L0,-24 L16,-12 Z M-13,-12 L-13,4 M-6,-12 L-6,4 M6,-12 L6,4 M13,-12 L13,4 M-18,4 L18,4" />
      <rect className="fill-ink" x="-20" y="16" width="34" height="4" rx="2" opacity={0.75} />
      <rect className="fill-muted-fg" x="-20" y="25" width="24" height="3" rx="1.5" />
      <rect className="fill-muted-fg" x="-20" y="32" width="30" height="3" rx="1.5" />
      {badge && badge.o > 0 ? (
        <g opacity={badge.o}>
          <rect
            className={badge.kind === "save" ? "ln sig fill-paper" : "ln fill-paper"}
            x={badge.kind === "save" ? -26 : 2}
            y="-42"
            width="24"
            height="11"
            rx="2"
          />
          <text
            className={badge.kind === "save" ? "t-sig" : "t-ink"}
            x={badge.kind === "save" ? -14 : 14}
            y="-34"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="700"
          >
            {badge.kind === "save" ? "Save" : "Pass"}
          </text>
        </g>
      ) : null}
    </g>
  );
}

function SwipeScene({ t }: { t: number }) {
  const out1 = smooth(seg(t, 0.12, 0.36));
  const up1 = smooth(seg(t, 0.32, 0.44));
  const out2 = smooth(seg(t, 0.58, 0.82));
  const up2 = smooth(seg(t, 0.78, 0.9));
  const stack = (depth: number) => ({ y: 92 + depth * 5, s: 1 - depth * 0.05, o: 1 - depth * 0.25 });

  const cards: ReactNode[] = [];
  // deepest first so the top card paints last
  const depthOf = (base: number) => base - up1 - up2;
  [3, 2, 1].forEach((base) => {
    const d = Math.max(0, depthOf(base));
    const st = stack(d);
    cards.push(
      <SchoolCard key={base} x={160} y={st.y} rot={0} scale={st.s} opacity={base === 3 ? up1 * st.o : st.o} />
    );
  });
  if (out1 < 1) {
    cards.push(
      <SchoolCard
        key="first"
        x={160 + out1 * 120}
        y={92 - out1 * 10}
        rot={out1 * 18}
        scale={1}
        opacity={1 - seg(out1, 0.6, 1)}
        badge={{ kind: "save", o: seg(t, 0.08, 0.16) }}
      />
    );
  }
  const secondX = 160 - out2 * 120;
  if (out2 < 1) {
    // the second card is the one that moved up into the top slot
    cards.push(
      <SchoolCard
        key="second"
        x={secondX}
        y={stack(Math.max(0, 1 - up1)).y - out2 * 10}
        rot={-out2 * 18}
        scale={stack(Math.max(0, 1 - up1)).s}
        opacity={(1 - seg(out2, 0.6, 1)) * (up1 > 0 ? 1 : 0)}
        badge={{ kind: "pass", o: seg(t, 0.54, 0.62) }}
      />
    );
  }

  return (
    <>
      <rect className="ln fill-paper" x="116" y="6" width="88" height="168" rx="13" />
      <rect className="ln faint" x="148" y="11" width="24" height="5" rx="2.5" />
      <clipPath id="phone-screen">
        <rect x="117" y="7" width="86" height="166" rx="12" />
      </clipPath>
      <g clipPath="url(#phone-screen)">{cards}</g>
      <text x="96" y="92" textAnchor="end" className={out2 > 0.05 && out2 < 1 ? "t-ink" : ""}>
        Pass
      </text>
      <text x="224" y="92" className={out1 > 0.05 && out1 < 1 ? "t-sig" : ""}>
        Save
      </text>
      <path className="ln faint" d="M100,100 L72,100 M78,96 L72,100 L78,104" />
      <path className="ln faint" d="M220,100 L248,100 M242,96 L248,100 L242,104" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Data pipeline: messy rows in, validated profiles out                 */
/* ------------------------------------------------------------------ */

const RAW_ROWS = Array.from({ length: 16 }, (_, i) => ({
  y: 40 + ((i * 37) % 100),
  w: 14 + ((i * 13) % 22),
  tilt: ((i * 7) % 9) - 4,
  offset: i / 16,
}));

function PipelineScene({ t }: { t: number }) {
  return (
    <>
      <text x="20" y="28">300,000+ raw records</text>
      {RAW_ROWS.map((row, i) => {
        const p = (t * 2 + row.offset) % 1;
        const x = lerp(10, 124, p);
        const y = lerp(row.y, 90, p * p);
        return (
          <rect
            key={i}
            className={i % 5 === 0 ? "fill-sig" : "fill-muted-fg"}
            x={x}
            y={y}
            width={row.w * (1 - p * 0.4)}
            height={3}
            rx={1.5}
            transform={`rotate(${r1(row.tilt * (1 - p))} ${r1(x)} ${r1(y)})`}
            opacity={Math.sin(Math.PI * p) * 0.9}
          />
        );
      })}

      <rect className="ln fill-paper" x="128" y="62" width="64" height="56" rx="6" />
      <text className="t-ink" x="160" y="86" textAnchor="middle" fontSize="7.5">LLM clean</text>
      <text x="160" y="96" textAnchor="middle" fontSize="6.5">+ validate</text>
      {[0, 1, 2].map((k) => (
        <circle
          key={k}
          className="fill-sig"
          cx={152 + k * 8}
          cy={106}
          r={1.8}
          opacity={0.3 + 0.7 * Math.max(0, Math.sin(t * Math.PI * 8 - k * 0.9))}
        />
      ))}

      <text x="208" y="28">1,000+ profiles</text>
      <clipPath id="profile-window">
        <rect x="200" y="36" width="110" height="132" />
      </clipPath>
      <g clipPath="url(#profile-window)">
        {[0, 1, 2, 3, 4].map((j) => {
          const p = (t + j / 5) % 1;
          const y = lerp(170, 30, p);
          const fromBox = seg(p, 0, 0.12);
          return (
            <g key={j} opacity={Math.min(1, fromBox * 3) * (1 - seg(p, 0.85, 1))}>
              <rect className="ln fill-paper" x={208} y={y} width={92} height={22} rx={4} />
              <circle className="ln" cx={219} cy={y + 11} r={5} />
              <rect className="fill-ink" x={229} y={y + 6} width={40} height={3.5} rx={1.5} opacity={0.75} />
              <rect className="fill-muted-fg" x={229} y={y + 13} width={56} height={3} rx={1.5} />
            </g>
          );
        })}
      </g>
      <path className="ln faint" d="M192,90 L204,90" />
    </>
  );
}

/* ------------------------------------------------------------------ */

export type SceneSpec = {
  render: (t: number) => ReactNode;
  /** Loop length in ms. */
  duration: number;
  /** Frame shown before playing and under reduced motion. */
  rest: number;
};

export const scenes: Record<SceneKey, SceneSpec> = {
  strike: { render: (t) => <StrikeScene t={t} />, duration: 3800, rest: 0.88 },
  board: { render: (t) => <BoardScene t={t} />, duration: 5200, rest: 0.7 },
  enclosure: { render: (t) => <EnclosureScene t={t} />, duration: 5600, rest: 0.45 },
  app: { render: (t) => <AppScene t={t} />, duration: 4200, rest: 0.85 },
  nas: { render: (t) => <NasScene t={t} />, duration: 4400, rest: 0.25 },
  stirling: { render: (t) => <StirlingScene t={t} />, duration: 2600, rest: 0.12 },
  ujoint: { render: (t) => <UJointScene t={t} />, duration: 4200, rest: 0.6 },
  swipe: { render: (t) => <SwipeScene t={t} />, duration: 3800, rest: 0.22 },
  pipeline: { render: (t) => <PipelineScene t={t} />, duration: 4600, rest: 0.4 },
};
