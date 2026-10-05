/**
 * Interactive isometric scenes for each project figure.
 *
 * Every scene is a pure function of SceneState:
 *   t  idle loop position in [0, 1) (its speed can be scaled by `rate`)
 *   a  progress of the click-triggered action in [0, 1), or -1 when idle
 *   n  how many times the action has been triggered
 * SceneView owns the clocks. Isometric axes: x → down-right, y → down-left,
 * z → up. Faces and lines take their colors from the .scene classes in
 * globals.css so light and dark mode both work.
 */
import type { ReactNode } from "react";
import type { SceneKey } from "@/data/work";

export type SceneState = { t: number; a: number; n: number };

export type SceneSpec = {
  render: (s: SceneState) => ReactNode;
  /** Idle loop length in ms. */
  duration: number;
  /** Idle frame shown before playing and under reduced motion. */
  rest: number;
  /** Click action length in ms. */
  action: number;
  /** What a click does, used as the button label. */
  verb: string;
  status: (s: SceneState) => string;
  /** Idle clock speed multiplier while the action runs. */
  rate?: (a: number) => number;
};

type Pt = [number, number];
type P3 = [number, number, number];

const C30 = Math.cos(Math.PI / 6);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const r1 = (n: number) => Math.round(n * 10) / 10;
const r3 = (n: number) => Math.round(n * 1000) / 1000;
const pulse = (t: number, k = 1) => 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * k);

const toD = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L");

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

function along3(pts: P3[], f: number): P3 {
  const lens = pts.slice(1).map((p, i) =>
    Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1], p[2] - pts[i][2])
  );
  let remaining = clamp01(f) * lens.reduce((x, y) => x + y, 0);
  for (let i = 0; i < lens.length; i++) {
    if (remaining <= lens[i]) {
      const k = lens[i] === 0 ? 0 : remaining / lens[i];
      const [a, b] = [pts[i], pts[i + 1]];
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
    }
    remaining -= lens[i];
  }
  return pts[pts.length - 1];
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const p1: Pt = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const p2: Pt = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];
  const large = a2 - a1 > Math.PI ? 1 : 0;
  return `M${r1(p1[0])},${r1(p1[1])} A${r1(r)},${r1(r)} 0 ${large} 1 ${r1(p2[0])},${r1(p2[1])}`;
}

/* ------------------------------------------------------------------ */
/* Isometric toolkit                                                    */
/* ------------------------------------------------------------------ */

function makeIso(ox: number, oy: number, s: number) {
  const p = (x: number, y: number, z: number): Pt => [
    ox + (x - y) * C30 * s,
    oy + (x + y) * 0.5 * s - z * s,
  ];
  const pts = (list: P3[]) =>
    list
      .map(([x, y, z]) => p(x, y, z))
      .map(([a, b]) => `${r1(a)},${r1(b)}`)
      .join(" ");
  const m = (a: number, b: number, c: number, d: number, at: Pt) =>
    `matrix(${r3(a)} ${r3(b)} ${r3(c)} ${r3(d)} ${r1(at[0])} ${r1(at[1])})`;
  return {
    s,
    p,
    pts,
    /** Local (u, v) → world (x + u, y + v, z): a horizontal surface. */
    top: (x: number, y: number, z: number) => m(C30 * s, 0.5 * s, -C30 * s, 0.5 * s, p(x, y, z)),
    /** Local (u, v) → world (x + u, y, z − v): the face looking down-left. */
    front: (x: number, y: number, z: number) => m(C30 * s, 0.5 * s, 0, s, p(x, y, z)),
  };
}
type Iso = ReturnType<typeof makeIso>;

function IsoBox({
  iso,
  x,
  y,
  z,
  w,
  d,
  h,
  top = "face-t",
  left = "face-l",
  right = "face-r",
  opacity,
}: {
  iso: Iso;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  top?: string;
  left?: string;
  right?: string;
  opacity?: number;
}) {
  const X = x + w;
  const Y = y + d;
  const Z = z + h;
  return (
    <g opacity={opacity}>
      <polygon className={`edge ${left}`} points={iso.pts([[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]])} />
      <polygon className={`edge ${right}`} points={iso.pts([[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]])} />
      <polygon className={`edge ${top}`} points={iso.pts([[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]])} />
    </g>
  );
}

/** Vertical cylinder (or frustum when r2 differs). */
function IsoCyl({
  iso,
  cx,
  cy,
  z,
  r,
  h,
  r2 = r,
  side = "face-l",
  cap = "face-t",
  opacity,
}: {
  iso: Iso;
  cx: number;
  cy: number;
  z: number;
  r: number;
  h: number;
  r2?: number;
  side?: string;
  cap?: string;
  opacity?: number;
}) {
  const [bx, by] = iso.p(cx, cy, z);
  const [tx, ty] = iso.p(cx, cy, z + h);
  const k1 = Math.SQRT2 * C30 * iso.s;
  const k2 = Math.SQRT2 * 0.5 * iso.s;
  const [a1, b1] = [k1 * r, k2 * r];
  const [a2, b2] = [k1 * r2, k2 * r2];
  return (
    <g opacity={opacity}>
      <path
        className={`edge ${side}`}
        d={`M${r1(bx - a1)},${r1(by)} A${r1(a1)},${r1(b1)} 0 0 0 ${r1(bx + a1)},${r1(by)} L${r1(tx + a2)},${r1(ty)} A${r1(a2)},${r1(b2)} 0 0 1 ${r1(tx - a2)},${r1(ty)} Z`}
      />
      <ellipse className={`edge ${cap}`} cx={r1(tx)} cy={r1(ty)} rx={r1(a2)} ry={r1(b2)} />
    </g>
  );
}

function Label({
  at,
  children,
  anchor = "middle",
  dy = 0,
}: {
  at: Pt;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  dy?: number;
}) {
  return (
    <text x={r1(at[0])} y={r1(at[1] + dy)} textAnchor={anchor}>
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* FairLie: a strike crosses the pads, radar reads the ball, BLE sends  */
/* ------------------------------------------------------------------ */

const MI = makeIso(152, 104, 0.78);
const MAT_SHAPE = "M-120,-50 L80,-50 L120,0 L80,50 L-120,50 Q-104,0 -120,-50 Z";
const PAD_U = [0, 1, 2, 3, 4, 5].map((i) => -84 + i * 22);
const PAD_LOAD = [0.35, 0.55, 0.8, 1, 0.85, 0.6];
const BALL_X = 62;

function clubAt(a: number) {
  if (a < 0.45) {
    const s = seg(a, 0, 0.45);
    return { x: lerp(-190, BALL_X - 14, s * s), y: lerp(26, 0, smooth(s)), z: 7, o: smooth(seg(a, 0, 0.06)) };
  }
  const f = seg(a, 0.45, 0.62);
  return { x: lerp(BALL_X - 14, 170, f), y: lerp(0, -12, f), z: 7 + f * 40, o: 1 - f };
}

function StrikeScene({ t, a }: SceneState) {
  const acting = a >= 0;
  const loads = PAD_U.map((u, i) => {
    if (!acting) return 0;
    const hit = 0.45 * Math.sqrt((u + 190) / (BALL_X - 14 + 190));
    return a >= hit ? Math.exp(-(a - hit) / 0.14) * PAD_LOAD[i] : 0;
  });
  const flight = acting ? seg(a, 0.45, 0.6) : 0;
  const ball: P3 = [BALL_X + flight * 290, 0, 12 + 110 * flight * (1 - 0.45 * flight)];
  const ballO = !acting || a < 0.6 ? 1 : seg(a, 0.86, 0.96);
  const speed = acting ? Math.round(112 * smooth(seg(a, 0.8, 0.92))) : 0;
  const ledOn = acting ? 1 : pulse(t, 2) > 0.5 ? 1 : 0.25;
  const [bx, by] = MI.p(...ball);
  const led = MI.p(4, 60, 11);

  return (
    <>
      {/* radar pod sits behind the mat on its long side */}
      <IsoBox iso={MI} x={-12} y={-64} z={0} w={34} d={14} h={13} />
      <g transform={MI.top(5, -57, 13)}>
        <circle className="ln sig" r={r1(6 + pulse(t) * 4)} opacity={acting ? 0 : r1(0.5 * (1 - pulse(t)) * 100) / 100} />
      </g>
      <Label at={MI.p(5, -64, 13)} dy={-8}>60 GHz radar</Label>

      {/* mat: the base outline sits one thickness below the turf surface */}
      <g transform={MI.top(0, 0, 0)}>
        <path className="edge face-l" d={MAT_SHAPE} />
      </g>
      <g transform={MI.top(0, 0, 6)}>
        <path className="edge face-t" d={MAT_SHAPE} />
        <line className="ln faint" x1="-108" y1="0" x2="112" y2="0" strokeDasharray="2 4" />
        {PAD_U.map((u, i) => (
          <g key={u}>
            <rect className="edge face-l" x={u - 8} y={-8} width={16} height={16} rx={2} />
            <rect className="fill-sig" x={u - 8} y={-8} width={16} height={16} rx={2} opacity={r1(loads[i] * 95) / 100} />
          </g>
        ))}
        {ballO > 0 && ball[0] < 118 ? (
          <ellipse className="fill-ink" cx={r1(ball[0])} cy={0} rx={7} ry={7} opacity={r1(12 * ballO) / 100} />
        ) : null}
        {acting
          ? [0, 1, 2].map((k) => {
              const p = seg(a, 0.46 + k * 0.05, 0.7 + k * 0.05);
              if (p <= 0 || p >= 1) return null;
              return <path key={k} className="ln sig" d={arcPath(5, -50, 10 + p * 120, 0.15, 1.35)} opacity={r1((1 - p) * 100) / 100} />;
            })
          : null}
      </g>

      {/* club head with a short trail */}
      {acting
        ? [3, 2, 1, 0].map((k) => {
            const c = clubAt(Math.max(0, a - k * 0.012));
            const o = clubAt(a).o * (k === 0 ? 1 : 0.35 - k * 0.08);
            return o > 0 ? (
              <IsoBox key={k} iso={MI} x={c.x - 12} y={c.y - 6} z={c.z} w={24} d={12} h={9} opacity={r1(o * 100) / 100} />
            ) : null;
          })
        : null}

      {/* ball */}
      <g opacity={ballO}>
        <circle className="edge face-t" cx={r1(bx)} cy={r1(by)} r={5} />
        <circle className="fill-ink" cx={r1(bx - 1.6)} cy={r1(by - 1.6)} r={1.2} opacity={0.18} />
      </g>

      {/* control cassette on the near side, with its status LED */}
      <IsoBox iso={MI} x={-46} y={52} z={0} w={62} d={16} h={11} />
      <circle className="fill-sig" cx={r1(led[0])} cy={r1(led[1])} r={1.9} opacity={ledOn} />
      <Label at={MI.p(-15, 68, 0)} dy={13}>control cassette</Label>

      {/* phone readout */}
      <IsoBox iso={MI} x={112} y={66} z={0} w={34} d={62} h={5} />
      <g transform={MI.top(112, 66, 5)}>
        <rect className="screen" x={3} y={3} width={28} height={56} rx={4} />
        <text className="t-ink t-num" x={17} y={30} textAnchor="middle" fontSize="12" fontWeight="700">
          {speed > 0 ? speed : "--"}
        </text>
        <text x={17} y={40} textAnchor="middle" fontSize="6">mph</text>
      </g>

      {/* BLE packets from the cassette to the phone */}
      {acting
        ? [0, 1, 2, 3].map((k) => {
            const f = seg(a, 0.62 + k * 0.04, 0.78 + k * 0.04);
            if (f <= 0 || f >= 1) return null;
            const w: P3 = [lerp(-15, 129, f), lerp(60, 97, f), lerp(11, 5, f) + Math.sin(Math.PI * f) * 34];
            const [x, y] = MI.p(...w);
            return <circle key={k} className="fill-sig" cx={r1(x)} cy={r1(y)} r={2.2} opacity={r1(Math.sin(Math.PI * f) * 100) / 100} />;
          })
        : null}

      {/* live pressure readout */}
      {loads.map((l, i) => (
        <rect
          key={i}
          className="fill-sig"
          x={14 + i * 9}
          y={r1(226 - Math.max(1, l * 26))}
          width={6}
          height={r1(Math.max(1, l * 26))}
          rx={1}
          opacity={r1((0.25 + l * 0.75) * 100) / 100}
        />
      ))}
      <line className="ln faint" x1="12" y1="226.5" x2="68" y2="226.5" />
      <text x="72" y="226">pressure</text>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Control board                                                       */
/* ------------------------------------------------------------------ */

const BI = makeIso(160, 112, 0.6);
// Board layout in its own 2D coordinates (the board spans 30..290 × 16..164).
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
type Part = { x: number; y: number; w: number; d: number; h: number; z?: number; label?: string };
const PARTS: Part[] = [
  { x: 130, y: 22, w: 70, d: 60, h: 3 },
  { x: 136, y: 40, w: 58, d: 38, h: 6, z: 8, label: "ESP32-S3" },
  { x: 60, y: 64, w: 32, d: 20, h: 3, label: "charge" },
  { x: 62, y: 36, w: 24, d: 16, h: 3, label: "3.3 V" },
  { x: 224, y: 40, w: 26, d: 18, h: 3, label: "IMU" },
  { x: 190, y: 112, w: 26, d: 16, h: 3, label: "ADC" },
  { x: 224, y: 112, w: 26, d: 16, h: 3, label: "ADC" },
  { x: 26, y: 70, w: 20, d: 22, h: 8 },
  { x: 34, y: 120, w: 14, d: 16, h: 7 },
  { x: 98, y: 144, w: 60, d: 10, h: 4 },
  { x: 184, y: 144, w: 72, d: 10, h: 7 },
  { x: 276, y: 31, w: 12, d: 14, h: 6 },
  { x: 276, y: 57, w: 12, d: 14, h: 6 },
  { x: 276, y: 83, w: 12, d: 14, h: 6 },
].sort((p, q) => p.x + p.w / 2 + p.y + p.d / 2 - (q.x + q.w / 2 + q.y + q.d / 2));

function BoardScene({ t, a }: SceneState) {
  const acting = a >= 0;
  const ledOn = acting || pulse(t, 2) > 0.5;
  return (
    <>
      <IsoBox iso={BI} x={-130} y={-74} z={0} w={260} d={148} h={5} top="face-pcb" />
      <g transform={BI.top(-160, -90, 5)}>
        {[[40, 26], [280, 26], [40, 154], [280, 154]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} className="edge face-r" cx={cx} cy={cy} r={6} />
        ))}
        {TRACES.map((pts, i) => {
          const p = acting ? smooth(seg(a, i * 0.02, i * 0.02 + 0.22)) : 1;
          return (
            <path
              key={i}
              className="trace"
              d={toD(pts)}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={r3(1 - p)}
            />
          );
        })}
        {acting && a > 0.45
          ? TRACES.map((pts, i) => {
              const f = ((a - 0.45) * 3 + i * 0.37) % 1;
              const [x, y] = pointAlong(i % 3 === 0 ? [...pts].reverse() : pts, f);
              return (
                <circle
                  key={i}
                  className="fill-sig"
                  cx={r1(x)}
                  cy={r1(y)}
                  r={3}
                  opacity={r1(Math.sin(Math.PI * f) * seg(a, 0.45, 0.5) * 100) / 100}
                />
              );
            })
          : null}
        <text x="36" y="104" textAnchor="middle" fontSize="8">USB-C</text>
        <text x="41" y="148" textAnchor="middle" fontSize="8">Li-Po</text>
        <text x="128" y="164" textAnchor="middle" fontSize="8">camera</text>
        <text x="220" y="164" textAnchor="middle" fontSize="8">pressure pads</text>
        <text x="270" y="112" textAnchor="middle" fontSize="8">radar, temp</text>
      </g>

      {PARTS.map((part, i) => {
        const x = part.x - 160;
        const y = part.y - 90;
        const z = part.z ?? 5;
        return (
          <g key={i}>
            <IsoBox iso={BI} x={x} y={y} z={z} w={part.w} d={part.d} h={part.h} />
            {part.label ? (
              <g transform={BI.top(x, y, z + part.h)}>
                <text
                  className="t-ink"
                  x={part.w / 2}
                  y={part.d / 2 + 3}
                  textAnchor="middle"
                  fontSize={part.label === "ESP32-S3" ? 10 : 8}
                >
                  {part.label}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}

      {/* RGB status LED */}
      <IsoBox iso={BI} x={86} y={-66} z={5} w={9} d={9} h={3} top={ledOn ? "face-sig" : "face-t"} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Housing: the cassette opens, board comes out and goes back           */
/* ------------------------------------------------------------------ */

const EI = makeIso(160, 142, 0.72);

function EnclosureScene({ t, a }: SceneState) {
  const acting = a >= 0;
  const k = acting ? a : 0.97;
  const lidZ = k < 0.5 ? lerp(20, 80, smooth(seg(k, 0.08, 0.22))) : lerp(80, 20, smooth(seg(k, 0.68, 0.8)));
  const boardZ = k < 0.5 ? lerp(8, 46, smooth(seg(k, 0.22, 0.36))) : lerp(46, 8, smooth(seg(k, 0.55, 0.68)));
  const screwsIn = k < 0.5 ? 1 - seg(k, 0, 0.08) : smooth(seg(k, 0.8, 0.94));
  const screwO = k < 0.5 ? 1 - seg(k, 0.05, 0.09) : seg(k, 0.8, 0.84);
  const labelO = acting ? seg(k, 0.34, 0.4) * (1 - seg(k, 0.52, 0.56)) : 0;
  const spin = k * Math.PI * 16;
  const light = EI.p(56, 30, lidZ + 3);

  const inner = { x0: -75, x1: 75, y0: -45, y1: 45 };
  const hull: Pt[] = [
    EI.p(inner.x0, inner.y1, 20),
    EI.p(inner.x1, inner.y1, 20),
    EI.p(inner.x1, inner.y0, 20),
    [EI.p(inner.x1, inner.y0, 20)[0], -300],
    [EI.p(inner.x0, inner.y1, 20)[0], -300],
  ];

  return (
    <>
      <defs>
        <clipPath id="tray-opening">
          <polygon points={hull.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ")} />
        </clipPath>
      </defs>

      <IsoBox iso={EI} x={-80} y={-50} z={0} w={160} d={100} h={20} />
      <polygon
        className="edge face-r"
        points={EI.pts([
          [inner.x0, inner.y0, 20],
          [inner.x1, inner.y0, 20],
          [inner.x1, inner.y1, 20],
          [inner.x0, inner.y1, 20],
        ])}
      />

      <g clipPath={boardZ < 22 ? "url(#tray-opening)" : undefined}>
        <IsoBox iso={EI} x={-68} y={-38} z={boardZ} w={136} d={76} h={2} top="face-pcb" />
        <IsoBox iso={EI} x={-30} y={-30} z={boardZ + 2} w={40} d={30} h={4} />
        <IsoBox iso={EI} x={24} y={-20} z={boardZ + 2} w={16} d={14} h={2} />
        <IsoBox iso={EI} x={24} y={8} z={boardZ + 2} w={16} d={14} h={2} />
        <IsoBox iso={EI} x={-60} y={10} z={boardZ + 2} w={12} d={20} h={5} top="face-sig-soft" />
      </g>

      <IsoBox iso={EI} x={-80} y={-50} z={lidZ} w={160} d={100} h={3} />
      {/* light pipe for the status LED */}
      <circle
        className="fill-sig"
        cx={r1(light[0])}
        cy={r1(light[1])}
        r={2}
        opacity={acting ? 0.9 : r1((0.25 + 0.75 * pulse(t)) * 100) / 100}
      />

      {screwO > 0
        ? [[-70, -40], [70, -40], [-70, 40], [70, 40]].map(([x, y]) => {
            const lift = (1 - screwsIn) * 22;
            const [cx, cy] = EI.p(x, y, lidZ + 3 + lift);
            const ang = spin * (k < 0.5 ? -1 : 1);
            return (
              <g key={`${x}-${y}`} opacity={r1(screwO * 100) / 100}>
                <ellipse className="edge face-t" cx={r1(cx)} cy={r1(cy)} rx={3.8} ry={2.2} />
                <line
                  className="ln"
                  x1={r1(cx - Math.cos(ang) * 2.7)}
                  y1={r1(cy - Math.sin(ang) * 1.5)}
                  x2={r1(cx + Math.cos(ang) * 2.7)}
                  y2={r1(cy + Math.sin(ang) * 1.5)}
                />
              </g>
            );
          })
        : null}

      <g opacity={r1(labelO * 100) / 100}>
        <path className="ln faint" d={toD([EI.p(80, -50, 82), [262, 22]])} />
        <text x="266" y="24">lid</text>
        <path className="ln faint" d={toD([EI.p(68, -38, 48), [262, 70]])} />
        <text x="266" y="72">board</text>
        <path className="ln faint" d={toD([EI.p(80, 50, 10), [236, 214]])} />
        <text x="240" y="217">160 × 100 × 20 mm</text>
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* iPhone app: a strike arrives and gets scored                         */
/* ------------------------------------------------------------------ */

const AI = makeIso(206, 66, 0.95);
const MINI_MAT = "M0,0 L50,0 L62,14 L50,28 L0,28 Q6,14 0,0 Z";

function AppScene({ t, a, n }: SceneState) {
  const acting = a >= 0;
  const score = acting ? smooth(seg(a, 0.18, 0.5)) : n > 0 ? 1 : 0;
  const metric = (at: number) => (acting ? smooth(seg(a, at, at + 0.2)) : n > 0 ? 1 : 0);

  return (
    <>
      {/* mat that sends the strike */}
      <g transform={AI.top(-100, 60, 0)}>
        <path className="edge face-l" d={MINI_MAT} />
      </g>
      <g transform={AI.top(-100, 60, 4)}>
        <path className="edge face-t" d={MINI_MAT} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            className={acting && a < 0.2 ? "fill-sig" : "edge face-l"}
            x={6 + i * 7}
            y={11}
            width={5}
            height={6}
            rx={1}
          />
        ))}
      </g>
      <Label at={AI.p(-38, 88, 0)} dy={16}>mat + radar</Label>

      {/* phone lying flat */}
      <IsoBox iso={AI} x={0} y={0} z={0} w={70} d={140} h={7} />
      <g transform={AI.top(0, 0, 7)}>
        <rect className="screen" x={4} y={4} width={62} height={132} rx={7} />
        <circle className="fill-sig" cx={10} cy={14} r={2} opacity={acting ? 1 : r1((0.35 + 0.65 * pulse(t)) * 100) / 100} />
        <text x={15} y={16} fontSize="5.5">Mat connected</text>
        <circle className="ring faint" cx={35} cy={44} r={15} />
        <circle
          className="ring sig"
          cx={35}
          cy={44}
          r={15}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={r3(1 - 0.87 * score)}
          transform="rotate(-90 35 44)"
        />
        <text className="t-ink t-num" x={35} y={48} textAnchor="middle" fontSize="12" fontWeight="700">
          {Math.round(87 * score)}
        </text>
        <text x={35} y={70} textAnchor="middle" fontSize="5.5">strike score</text>
        {(
          [
            ["Ball speed", 112, "mph", 0.4],
            ["Club speed", 84, "mph", 0.46],
            ["Carry", 168, "yd", 0.52],
          ] as const
        ).map(([label, value, unit, at], i) => {
          const m = metric(at);
          const y = 88 + i * 15;
          return (
            <g key={label} opacity={r1((0.4 + 0.6 * m) * 100) / 100}>
              <line className="ln faint" x1={9} y1={y + 4} x2={61} y2={y + 4} />
              <text x={9} y={y} fontSize="5.5">{label}</text>
              <text className="t-ink t-num" x={61} y={y} textAnchor="end" fontSize="6">
                {m > 0.02 ? `${Math.round(value * m)} ${unit}` : "--"}
              </text>
            </g>
          );
        })}
      </g>

      {acting
        ? [0, 1, 2].map((k) => {
            const f = seg(a, k * 0.04, 0.16 + k * 0.04);
            if (f <= 0 || f >= 1) return null;
            const w: P3 = [lerp(-70, 20, f), lerp(74, 60, f), lerp(4, 7, f) + Math.sin(Math.PI * f) * 30];
            const [x, y] = AI.p(...w);
            return <circle key={k} className="fill-sig" cx={r1(x)} cy={r1(y)} r={2.2} opacity={r1(Math.sin(Math.PI * f) * 100) / 100} />;
          })
        : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* NAS: files leave the SSD, go through the server, land in trays       */
/* ------------------------------------------------------------------ */

const NI = makeIso(160, 150, 0.8);
const NAS_FILES: ("photo" | "doc")[] = ["photo", "doc", "photo", "photo", "doc", "photo"];
const TRAYS = {
  photo: { x: 58, y: -86, label: "Photos" },
  doc: { x: 86, y: -22, label: "Coursework" },
} as const;

function NasTray({ kind, count }: { kind: "photo" | "doc"; count: number }) {
  const tray = TRAYS[kind];
  return (
    <g>
      <IsoBox iso={NI} x={tray.x} y={tray.y} z={0} w={44} d={30} h={12} top="face-r" />
      {Array.from({ length: count }, (_, k) => (
        <IsoBox
          key={k}
          iso={NI}
          x={tray.x + 16}
          y={tray.y + 8}
          z={12 + k * 2.4}
          w={12}
          d={14}
          h={2.4}
          top={kind === "photo" ? "face-sig-soft" : "face-t"}
        />
      ))}
      <Label at={NI.p(tray.x + 44, tray.y, 12)} anchor="start" dy={-4}>
        {tray.label}
      </Label>
    </g>
  );
}

function NasScene({ t, a, n }: SceneState) {
  const acting = a >= 0;
  const files = NAS_FILES.map((kind, i) => {
    const p = acting ? seg(a, i * 0.1, i * 0.1 + 0.42) : n > 0 ? 1 : 0;
    const tray = TRAYS[kind];
    const route: P3[] = [
      [-100, 22, 8],
      [-60, 4, 34],
      [-25, 0, 34],
      [25, -6, 34],
      [tray.x + 22, tray.y + 15, 26],
      [tray.x + 22, tray.y + 15, 12],
    ];
    return { kind, p, pos: along3(route, smooth(p)) };
  });
  const busy = files.some((f) => f.p > 0 && f.p < 1);
  const landed = (kind: "photo" | "doc") => files.filter((f) => f.kind === kind && f.p >= 1).length;
  const ssdLed = NI.p(-88, 34, 6);

  return (
    <>
      <NasTray kind="photo" count={landed("photo")} />

      {/* mini-ITX case with drive bays on its front face */}
      <IsoBox iso={NI} x={-25} y={-20} z={0} w={50} d={40} h={92} />
      <g transform={NI.front(-25, 20, 92)}>
        {[12, 30].map((v, i) => (
          <g key={v}>
            <rect className="edge face-r" x={6} y={v} width={38} height={13} rx={1.5} />
            <circle
              className="fill-sig"
              cx={38}
              cy={v + 6.5}
              r={2}
              opacity={
                busy
                  ? Math.sin(t * Math.PI * 60 + i * 2) > 0
                    ? 1
                    : 0.2
                  : r1((0.25 + 0.6 * pulse(t, 0.5 + i * 0.3)) * 100) / 100
              }
            />
          </g>
        ))}
        <circle className="ln faint" cx={25} cy={66} r={11} />
        <circle className="ln faint" cx={25} cy={66} r={4} />
        <text x={25} y={88} textAnchor="middle" fontSize="6.5">8 TB</text>
      </g>

      {/* SSD */}
      <IsoBox iso={NI} x={-120} y={12} z={0} w={36} d={22} h={8} />
      <circle className="fill-sig" cx={r1(ssdLed[0])} cy={r1(ssdLed[1])} r={1.6} opacity={busy ? 1 : 0.4} />
      <Label at={NI.p(-102, 34, 0)} dy={14}>SSD</Label>

      <NasTray kind="doc" count={landed("doc")} />

      {files.map((f, i) => {
        if (f.p <= 0 || f.p >= 1) return null;
        const [x, y, z] = f.pos;
        if (x > -27 && x < 27) return null; // inside the case
        return (
          <IsoBox
            key={i}
            iso={NI}
            x={x - 6}
            y={y - 7}
            z={z}
            w={12}
            d={14}
            h={2.4}
            top={f.kind === "photo" ? "face-sig-soft" : "face-t"}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Stirling engine: crank-slider kinematics on a vertical plane         */
/* ------------------------------------------------------------------ */

const SI = makeIso(156, 178, 0.6);
// The mechanism is laid out in 2D plane coordinates (u right, v down) and
// mapped onto the world plane y = 0 with x = u − 182, z = 196 − v.
const CRANK: Pt = [182, 140];
const CRANK_R = 13;
const DISP_U = 150;
const POW_U = 214;
const wz = (v: number) => 196 - v;

function slider(axisU: number, pin: Pt, rod: number) {
  const du = axisU - pin[0];
  return pin[1] - Math.sqrt(rod * rod - du * du);
}

function Flywheel({ y, face }: { y: number; face: string }) {
  return (
    <g transform={SI.front(-182, y, 196)}>
      <circle className={`edge ${face}`} cx={CRANK[0]} cy={CRANK[1]} r={32} />
    </g>
  );
}

function StirlingScene({ t, a }: SceneState) {
  const theta = t * Math.PI * 2;
  const heat = a >= 0 ? Math.sin(Math.PI * a) : 0;
  const pinD: Pt = [CRANK[0] + CRANK_R * Math.cos(theta), CRANK[1] + CRANK_R * Math.sin(theta)];
  const pinP: Pt = [
    CRANK[0] + CRANK_R * Math.cos(theta - Math.PI / 2),
    CRANK[1] + CRANK_R * Math.sin(theta - Math.PI / 2),
  ];
  const dispV = slider(DISP_U, pinD, 80);
  const powV = slider(POW_U, pinP, 72);
  const hotShare = clamp01((dispV - 52) / 29);
  const hotTop = SI.p(DISP_U - 182, 0, wz(14));

  return (
    <>
      <IsoBox iso={SI} x={-120} y={-44} z={0} w={200} d={88} h={10} />
      {/* back frame the cylinders hang from */}
      <IsoBox iso={SI} x={-66} y={-40} z={10} w={124} d={8} h={172} />
      {/* flywheel bearing post */}
      <IsoBox iso={SI} x={-6} y={-18} z={10} w={12} d={10} h={44} />

      <Flywheel y={-6} face="face-r" />
      <Flywheel y={0} face="face-t" />
      <g transform={SI.front(-182, 0, 196)}>
        <circle className="ln faint" cx={CRANK[0]} cy={CRANK[1]} r={26} />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const ang = theta + (k * Math.PI) / 3;
          return (
            <line
              key={k}
              className="ln faint"
              x1={r1(CRANK[0] + Math.cos(ang) * 6)}
              y1={r1(CRANK[1] + Math.sin(ang) * 6)}
              x2={r1(CRANK[0] + Math.cos(ang) * 26)}
              y2={r1(CRANK[1] + Math.sin(ang) * 26)}
            />
          );
        })}
        <path className="ln sig" d={arcPath(CRANK[0], CRANK[1], 19, theta - Math.PI / 2, theta)} />
        <line className="ln" x1={CRANK[0]} y1={CRANK[1]} x2={r1(pinD[0])} y2={r1(pinD[1])} />
        <line className="ln" x1={CRANK[0]} y1={CRANK[1]} x2={r1(pinP[0])} y2={r1(pinP[1])} />
        <line className="ln" x1={DISP_U} y1={r1(dispV)} x2={r1(pinD[0])} y2={r1(pinD[1])} />
        <line className="ln" x1={POW_U} y1={r1(powV)} x2={r1(pinP[0])} y2={r1(pinP[1])} />
        <circle className="edge face-t" cx={r1(pinD[0])} cy={r1(pinD[1])} r={2.6} />
        <circle className="edge face-t" cx={r1(pinP[0])} cy={r1(pinP[1])} r={2.6} />
        <circle className="fill-ink" cx={CRANK[0]} cy={CRANK[1]} r={2.4} />
      </g>

      {/* power piston inside its cylinder */}
      <IsoCyl iso={SI} cx={POW_U - 182} cy={0} z={wz(powV)} r={12} h={12} />
      <IsoCyl iso={SI} cx={POW_U - 182} cy={0} z={wz(96)} r={14} h={66} side="glass" cap="glass" />

      {/* displacer, hot gas above it, and its cylinder */}
      <IsoCyl iso={SI} cx={DISP_U - 182} cy={0} z={wz(dispV)} r={21} h={24} />
      <IsoCyl
        iso={SI}
        cx={DISP_U - 182}
        cy={0}
        z={wz(dispV) + 24}
        r={23}
        h={Math.max(0.1, wz(14) - wz(dispV) - 24)}
        side="face-sig-soft"
        cap="face-sig-soft"
        opacity={r1((0.35 + hotShare * 0.4) * 100) / 100}
      />
      <IsoCyl iso={SI} cx={DISP_U - 182} cy={0} z={wz(92)} r={24} h={78} side="glass" cap="glass" />
      <ellipse
        className="fill-sig"
        cx={r1(hotTop[0])}
        cy={r1(hotTop[1])}
        rx={r1(Math.SQRT2 * C30 * SI.s * 24)}
        ry={r1(Math.SQRT2 * 0.5 * SI.s * 24)}
        opacity={r1((0.15 + heat * 0.7) * 100) / 100}
      />
      {[0, 1, 2].map((k) => {
        const [x, y] = SI.p(DISP_U - 182 - 14 + k * 14, 0, wz(14) + 6);
        return (
          <path
            key={k}
            className="ln sig"
            d={`M${r1(x)},${r1(y)} q3,-4 0,-8 q-3,-4 0,-8`}
            opacity={r1((0.3 + 0.7 * Math.max(heat, Math.abs(Math.sin(theta + k)) * 0.6)) * 100) / 100}
          />
        );
      })}

      <Label at={SI.p(DISP_U - 182 - 34, 0, wz(22))} anchor="end">hot end</Label>
      <Label at={SI.p(POW_U - 182 + 14, 0, wz(60))} anchor="start" dy={4}>power piston</Label>
      <Label at={SI.p(32, 0, wz(170))} anchor="start" dy={10}>flywheel</Label>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Universal joint: click to change the shaft angle                     */
/* ------------------------------------------------------------------ */

const UJ = makeIso(120, 150, 0.82);
const U_ANGLES = [30, 45, 15];
const PLOT = { x0: 210, x1: 306, y0: 34, y1: 96 };
const JZ = 70;

function ujointBeta({ a, n }: SceneState) {
  const cur = U_ANGLES[n % U_ANGLES.length];
  const prev = U_ANGLES[(n - 1 + U_ANGLES.length) % U_ANGLES.length];
  const deg = a >= 0 && n > 0 ? lerp(prev, cur, smooth(a)) : cur;
  return (deg * Math.PI) / 180;
}

function UShafts({
  y,
  detail,
  beta,
  th1,
  th2,
}: {
  y: number;
  detail: boolean;
  beta: number;
  th1: number;
  th2: number;
}) {
  const dir: Pt = [Math.cos(beta), Math.sin(beta)];
  const nrm: Pt = [-dir[1], dir[0]];
  const outLen = 96;
  const fork1 = 9 * Math.cos(th1);
  const fork2 = 9 * Math.sin(th2);
  const face = detail ? "face-t" : "face-r";
  const shaft = [
    [dir[0] * 12 + nrm[0] * 6, dir[1] * 12 + nrm[1] * 6],
    [dir[0] * outLen + nrm[0] * 6, dir[1] * outLen + nrm[1] * 6],
    [dir[0] * outLen - nrm[0] * 6, dir[1] * outLen - nrm[1] * 6],
    [dir[0] * 12 - nrm[0] * 6, dir[1] * 12 - nrm[1] * 6],
  ]
    .map(([x, yy]) => `${r1(x)},${r1(yy)}`)
    .join(" ");
  const forkOut = (sign: number) =>
    `M${r1(-dir[0] * 2 + sign * nrm[0] * fork2)},${r1(-dir[1] * 2 + sign * nrm[1] * fork2)} L${r1(dir[0] * 14 + sign * nrm[0] * fork2)},${r1(dir[1] * 14 + sign * nrm[1] * fork2)}`;

  return (
    <g transform={UJ.front(0, y, JZ)}>
      <rect className={`edge ${face}`} x={-104} y={-6} width={92} height={12} rx={2} />
      <polygon className={`edge ${face}`} points={shaft} />
      {detail ? (
        <>
          <circle className="fill-sig" cx={-60} cy={r1(5 * Math.sin(th1))} r={2.4} opacity={Math.cos(th1) > 0 ? 1 : 0.25} />
          <circle
            className="fill-sig"
            cx={r1(dir[0] * 56 + nrm[0] * 5 * Math.cos(th2))}
            cy={r1(dir[1] * 56 + nrm[1] * 5 * Math.cos(th2))}
            r={2.4}
            opacity={Math.sin(th2) > 0 ? 1 : 0.25}
          />
          <path className="ln" d={`M-14,${r1(-fork1)} L2,${r1(-fork1)} M-14,${r1(fork1)} L2,${r1(fork1)}`} />
          <path className="ln" d={`${forkOut(1)} ${forkOut(-1)}`} />
          <circle className="edge face-t" cx={0} cy={0} r={5} />
          <path className="ln faint" d="M0,0 L36,0" strokeDasharray="2 3" />
          <path className="ln sig" d={arcPath(0, 0, 28, 0, beta)} />
        </>
      ) : null}
    </g>
  );
}

function UJointScene(s: SceneState) {
  const beta = ujointBeta(s);
  const th1 = s.t * Math.PI * 2;
  const th2 = Math.atan2(Math.sin(th1), Math.cos(th1) * Math.cos(beta));
  const ratio = (th: number) => Math.cos(beta) / (1 - Math.sin(beta) ** 2 * Math.cos(th) ** 2);
  const lo = Math.cos(beta);
  const hi = 1 / Math.cos(beta);
  const plotY = (r: number) => lerp(PLOT.y1, PLOT.y0, (r - 0.68) / (1.45 - 0.68));
  const curve: Pt[] = Array.from({ length: 61 }, (_, i) => [
    lerp(PLOT.x0, PLOT.x1, i / 60),
    plotY(ratio((i / 60) * Math.PI * 2)),
  ]);
  const now: Pt = [lerp(PLOT.x0, PLOT.x1, s.t), plotY(ratio(th1))];
  const bU = Math.cos(beta) * 64;
  const bV = Math.sin(beta) * 64;

  return (
    <>
      <IsoBox iso={UJ} x={-120} y={-30} z={0} w={220} d={60} h={8} />
      {/* bearing blocks */}
      <IsoBox iso={UJ} x={-80} y={-12} z={8} w={16} d={24} h={JZ - 8 - 6} />
      <IsoBox iso={UJ} x={bU - 8} y={-12} z={8} w={16} d={24} h={Math.max(4, JZ - bV - 8 - 6)} />
      <UShafts y={-3} detail={false} beta={beta} th1={th1} th2={th2} />
      <UShafts y={3} detail beta={beta} th1={th1} th2={th2} />
      <Label at={UJ.p(36, 6, JZ)} anchor="start" dy={-4}>
        {Math.round((beta * 180) / Math.PI)}°
      </Label>

      {/* speed ratio plot */}
      <text x={PLOT.x0} y={PLOT.y0 - 8}>output ÷ input speed</text>
      <line className="ln faint" x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} />
      <line className="ln faint" x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} />
      <line className="ln faint" x1={PLOT.x0} y1={r1(plotY(1))} x2={PLOT.x1} y2={r1(plotY(1))} strokeDasharray="2 3" />
      <text x={PLOT.x0 - 4} y={r1(plotY(1) + 2.5)} textAnchor="end" fontSize="6.5">1.0</text>
      <path className="ln faint" d={toD(curve)} />
      <path className="ln sig" d={toD([...curve.slice(0, Math.floor(s.t * 60) + 1), now])} />
      <circle className="fill-sig" cx={r1(now[0])} cy={r1(now[1])} r={2.6} />
      <text x={PLOT.x1} y={PLOT.y1 + 11} textAnchor="end" fontSize="6.5">
        {lo.toFixed(2)}× to {hi.toFixed(2)}×
      </text>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Swipe app: a standing phone with a card stack                        */
/* ------------------------------------------------------------------ */

const WI = makeIso(158, 212, 0.95);

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
      transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${r3(scale)})`}
      opacity={r1(opacity * 100) / 100}
    >
      <rect className="ln fill-paper" x="-30" y="-46" width="60" height="92" rx="6" />
      <path className="ln" d="M-16,-12 L0,-24 L16,-12 Z M-13,-12 L-13,4 M-6,-12 L-6,4 M6,-12 L6,4 M13,-12 L13,4 M-18,4 L18,4" />
      <rect className="fill-ink" x="-20" y="16" width="34" height="4" rx="2" opacity={0.75} />
      <rect className="fill-muted-fg" x="-20" y="25" width="24" height="3" rx="1.5" />
      <rect className="fill-muted-fg" x="-20" y="32" width="30" height="3" rx="1.5" />
      {badge && badge.o > 0 ? (
        <g opacity={r1(badge.o * 100) / 100}>
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

function SwipeScene({ t, a }: SceneState) {
  const acting = a >= 0;
  const out1 = acting ? smooth(seg(a, 0.08, 0.36)) : 0;
  const up1 = acting ? smooth(seg(a, 0.32, 0.44)) : 0;
  const out2 = acting ? smooth(seg(a, 0.56, 0.84)) : 0;
  const up2 = acting ? smooth(seg(a, 0.8, 0.92)) : 0;
  const wobble = acting ? 0 : Math.sin(t * Math.PI * 2) * 2.5;
  const cx = 42;
  const stack = (depth: number) => ({ y: 88 + depth * 5, s: 1 - depth * 0.05, o: 1 - depth * 0.25 });

  const cards: ReactNode[] = [];
  [3, 2, 1].forEach((base) => {
    const d = Math.max(0, base - up1 - up2);
    const st = stack(d);
    cards.push(
      <SchoolCard key={base} x={cx} y={st.y} rot={0} scale={st.s} opacity={base === 3 ? up1 * st.o : st.o} />
    );
  });
  if (out1 < 1) {
    cards.push(
      <SchoolCard
        key="first"
        x={cx + out1 * 110}
        y={88 - out1 * 10}
        rot={out1 * 18 + wobble}
        scale={1}
        opacity={1 - seg(out1, 0.6, 1)}
        badge={{ kind: "save", o: acting ? seg(a, 0.06, 0.14) : 0 }}
      />
    );
  }
  if (acting && up1 > 0 && out2 < 1) {
    const st = stack(Math.max(0, 1 - up1));
    cards.push(
      <SchoolCard
        key="second"
        x={cx - out2 * 110}
        y={st.y - out2 * 10}
        rot={-out2 * 18}
        scale={st.s}
        opacity={1 - seg(out2, 0.6, 1)}
        badge={{ kind: "pass", o: seg(a, 0.54, 0.62) }}
      />
    );
  }

  return (
    <>
      {/* stand behind the phone */}
      <IsoBox iso={WI} x={-22} y={-34} z={0} w={44} d={26} h={36} />
      <IsoBox iso={WI} x={-42} y={-5} z={0} w={84} d={10} h={176} />
      <g transform={WI.front(-42, 5, 176)}>
        <clipPath id="swipe-screen">
          <rect x={5} y={8} width={74} height={160} rx={8} />
        </clipPath>
        <rect className="screen" x={5} y={8} width={74} height={160} rx={8} />
        <g clipPath="url(#swipe-screen)">{cards}</g>
      </g>
      <text x="36" y="120" className={out2 > 0.05 && out2 < 1 ? "t-ink" : ""}>Pass</text>
      <path className="ln faint" d="M60,128 L34,128 M40,124 L34,128 L40,132" />
      <text x="262" y="120" className={out1 > 0.05 && out1 < 1 ? "t-sig" : ""}>Save</text>
      <path className="ln faint" d="M258,128 L284,128 M278,124 L284,128 L278,132" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Data pipeline: messy records on a belt, clean profiles out           */
/* ------------------------------------------------------------------ */

const LI = makeIso(160, 150, 0.74);
const RAW = Array.from({ length: 10 }, (_, i) => ({
  w: 8 + ((i * 7) % 12),
  d: 7 + ((i * 5) % 9),
  h: 3 + ((i * 3) % 7),
  dy: ((i * 11) % 9) - 4,
  offset: i / 10,
}));

function PipelineScene({ t, a, n }: SceneState) {
  const acting = a >= 0;
  const raw = acting ? Math.round(300000 * a) : n > 0 ? 300000 : 0;
  const out = acting ? Math.round(1000 * a) : n > 0 ? 1000 : 0;

  return (
    <>
      <text x="14" y="22">{raw > 0 ? `${raw.toLocaleString("en-US")} records` : "300,000+ raw records"}</text>
      <text x="306" y="22" textAnchor="end">
        {out > 0 ? `${out.toLocaleString("en-US")} profiles` : "1,000+ profiles"}
      </text>

      <IsoBox iso={LI} x={-180} y={-14} z={0} w={150} d={28} h={8} />
      {RAW.map((r, i) => {
        const f = (t * 2 + r.offset) % 1;
        return (
          <IsoBox
            key={i}
            iso={LI}
            x={-178 + f * 150}
            y={r.dy - r.d / 2}
            z={8}
            w={r.w}
            d={r.d}
            h={r.h}
            top={i % 4 === 0 ? "face-sig-soft" : "face-t"}
            opacity={r1(seg(f, 0, 0.08) * 100) / 100}
          />
        );
      })}

      <IsoBox iso={LI} x={-30} y={-32} z={0} w={60} d={64} h={66} />
      <g transform={LI.front(-30, 32, 66)}>
        <rect className="screen" x={7} y={10} width={46} height={24} rx={3} />
        <text className="t-ink" x={30} y={21} textAnchor="middle" fontSize="7.5">LLM</text>
        <text x={30} y={29} textAnchor="middle" fontSize="5.5">clean + validate</text>
        {[0, 1, 2].map((k) => (
          <circle
            key={k}
            className="fill-sig"
            cx={22 + k * 8}
            cy={46}
            r={2}
            opacity={r1((0.25 + 0.75 * Math.max(0, Math.sin(t * Math.PI * (acting ? 40 : 8) - k * 0.9))) * 100) / 100}
          />
        ))}
      </g>

      <IsoBox iso={LI} x={30} y={-14} z={0} w={150} d={28} h={8} />
      {[0, 1, 2, 3].map((j) => {
        const f = (t + j / 4) % 1;
        const x = 34 + f * 140;
        return (
          <g key={j} opacity={r1((1 - seg(f, 0.88, 1)) * 100) / 100}>
            <IsoBox iso={LI} x={x} y={-9} z={8} w={20} d={18} h={3} />
            <g transform={LI.top(x, -9, 11)}>
              <circle className="ln" cx={5} cy={9} r={3} />
              <line className="ln" x1={10} y1={6} x2={17} y2={6} />
              <line className="ln faint" x1={10} y1={10} x2={16} y2={10} />
            </g>
          </g>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */

export const scenes: Record<SceneKey, SceneSpec> = {
  strike: {
    render: (s) => <StrikeScene {...s} />,
    duration: 2400,
    rest: 0,
    action: 3800,
    verb: "Take a swing",
    status: ({ a, n }) =>
      a < 0
        ? n === 0
          ? "Ready. Click to take a swing."
          : "Ready for another swing."
        : a < 0.45
          ? "Club coming through…"
          : a < 0.62
            ? "Strike. Pads fire heel to toe while the radar reads the ball."
            : a < 0.82
              ? "Sending the strike to the phone over BLE"
              : "Example strike: 112 mph ball speed",
  },
  board: {
    render: (s) => <BoardScene {...s} />,
    duration: 2000,
    rest: 0,
    action: 3400,
    verb: "Power up the board",
    status: ({ a }) =>
      a < 0
        ? "13 nets routed. Click to power it up."
        : a < 0.45
          ? "Routing traces out from the ESP32-S3…"
          : "Power, sensors, camera, and radar talking to the MCU",
  },
  enclosure: {
    render: (s) => <EnclosureScene {...s} />,
    duration: 2600,
    rest: 0,
    action: 5600,
    verb: "Open the cassette",
    status: ({ a, n }) =>
      a < 0
        ? n === 0
          ? "Sealed. Click to open the cassette."
          : "Sealed again."
        : a < 0.22
          ? "Backing out the screws and lifting the lid"
          : a < 0.55
            ? "Board out of its 160 × 100 × 20 mm cassette"
            : a < 0.8
              ? "Board back on its standoffs"
              : "Driving the self-tapping screws",
  },
  app: {
    render: (s) => <AppScene {...s} />,
    duration: 2200,
    rest: 0,
    action: 3600,
    verb: "Send a strike",
    status: ({ a, n }) =>
      a < 0
        ? n === 0
          ? "Waiting for a strike. Click to send one."
          : "Score 87, ball 112 mph, carry 168 yd"
        : a < 0.18
          ? "Strike received over BLE"
          : a < 0.5
            ? "Scoring the strike"
            : "Filling in ball speed, club speed, and carry",
  },
  nas: {
    render: (s) => <NasScene {...s} />,
    duration: 3000,
    rest: 0,
    action: 4600,
    verb: "Ingest the SSD",
    status: ({ a, n }) =>
      a < 0
        ? n === 0
          ? "SSD plugged in. Click to ingest it."
          : "Sorted: 4 photos and 2 coursework files"
        : "Ingesting and sorting files…",
  },
  stirling: {
    render: (s) => <StirlingScene {...s} />,
    duration: 2800,
    rest: 0.12,
    action: 5000,
    verb: "Add heat",
    rate: (a) => (a < 0 ? 1 : 1 + 2.4 * Math.sin(Math.PI * a)),
    status: ({ a }) =>
      a < 0
        ? "Idling. Click to add heat."
        : a < 0.3
          ? "Heating the hot end"
          : a < 0.7
            ? "Running fast, displacer 90° ahead of the power piston"
            : "Cooling back down",
  },
  ujoint: {
    render: (s) => <UJointScene {...s} />,
    duration: 4200,
    rest: 0.6,
    action: 900,
    verb: "Change the shaft angle",
    status: ({ n }) => `${U_ANGLES[n % U_ANGLES.length]}° shaft angle. Click to change it.`,
  },
  swipe: {
    render: (s) => <SwipeScene {...s} />,
    duration: 3000,
    rest: 0,
    action: 3400,
    verb: "Swipe through schools",
    status: ({ a }) => (a < 0 ? "Click to swipe through schools." : a < 0.5 ? "Saved to your list" : "Passed"),
  },
  pipeline: {
    render: (s) => <PipelineScene {...s} />,
    duration: 9000,
    rest: 0.3,
    action: 4200,
    verb: "Run a batch",
    rate: (a) => (a < 0 ? 1 : 5),
    status: ({ a, n }) =>
      a < 0
        ? n === 0
          ? "Click to run a batch."
          : "1,000+ validated profiles from 300,000+ records"
        : "Cleaning records with the ChatGPT API",
  },
};
