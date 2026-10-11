/**
 * Every project on the site. Each project is told through one or
 * more figures: an interactive isometric scene (components/work/scenes.tsx)
 * paired with what Chad did on that part.
 */

export type SceneKey =
  | "strike"
  | "board"
  | "enclosure"
  | "app"
  | "nas"
  | "stirling"
  | "v8"
  | "bridge"
  | "swipe"
  | "pipeline";

export type Discipline = "Products" | "Mechanisms" | "Software";

/** Each project owns one accent color (tokens in globals.css). */
export type Accent = "turf" | "cobalt" | "flame" | "race" | "violet" | "span";

export type Figure = {
  scene: SceneKey;
  title: string;
  /** What the animation shows. */
  caption: string;
  /** What Chad did on this part, in plain verbs. */
  did: string[];
};

export type Improvement = {
  area: string;
  problem: string;
  change: string;
  /** Why it matters for the score or the build. */
  result: string;
};

export type WorkItem = {
  id: string;
  title: string;
  discipline: Discipline;
  /** One or two lines: what the thing is. */
  summary: string;
  accent: Accent;
  tools: string[];
  figures: Figure[];
  /** Changes Chad made to an existing design, shown after the figures. */
  improvements?: Improvement[];
  /** Reflection shown on the project page after the figures. */
  lessons?: { challenges: string[]; learned: string[] };
};

export const disciplines: { name: Discipline; blurb: string }[] = [
  {
    name: "Products",
    blurb: "Hardware I built end to end: sensors, boards, housings, and the software on top.",
  },
  {
    name: "Mechanisms",
    blurb: "Parts and assemblies modeled and mated in CAD.",
  },
  {
    name: "Software",
    blurb: "Apps and the data behind them.",
  },
];

export const work: WorkItem[] = [
  {
    id: "fairlie",
    title: "FairLie",
    discipline: "Products",
    summary:
      "A smart golf training mat (built under the TurfTrack name) that reads every strike with pressure pads, an IMU, and 60 GHz radar, then scores it on an iPhone app. I worked on the sensors, the board, the printed housings, and the app.",
    accent: "turf",
    tools: ["ESP-IDF / C", "KiCad", "Fusion 360", "CadQuery", "SwiftUI", "BLE", "Supabase"],
    figures: [
      {
        scene: "strike",
        title: "Sensing a strike",
        caption:
          "The club crosses six pressure pads heel to toe, the radar pod reads ball speed, and the strike goes to the phone over BLE.",
        did: [
          "Architected a 3-board sensor system (ESP32-S3, XIAO nRF52840, Pro Micro nRF52840) fusing 6 pressure sensors, a 9-axis IMU, and a 60 GHz radar.",
          "Wrote ESP-IDF firmware split into sensor sampling, strike detection, IMU, radar, scoring, and BLE modules.",
          "Merged each mat strike with the radar reading from the previous 0.75 s so ball speed lands on the right swing.",
          "Debugged communication, sensor, and integration issues across the microcontrollers and sensor modules during prototype bring-up.",
          "Wrote Python scripts to process, visualize, and validate sensor telemetry during system testing.",
        ],
      },
      {
        scene: "board",
        title: "Control board",
        caption:
          "Power, sensors, camera, and radar all route back to the ESP32-S3 module on one custom board.",
        did: [
          "Drew the schematic in KiCad across four sheets: power, MCU, sensors, and camera.",
          "Designed a USB-C charging and Li-Po power path with a P-FET switchover and 3.3 V regulation.",
          "Read 6 pressure channels through two ADS1115 ADCs with RC input filters, plus an IMU and Qwiic ports for radar and temperature.",
          "Autorouted with Freerouting, then prepared the BOM and assembly files for fabrication.",
          "Brought up a perfboard prototype first, testing each subsystem in stages.",
        ],
      },
      {
        scene: "enclosure",
        title: "Printed housings",
        caption:
          "The control cassette opens, the board comes out, goes back onto its standoffs, and the lid screws down.",
        did: [
          "Resized the control cassette to 160 × 100 × 20 mm with a screw-down lid after the first shell couldn’t fit the board.",
          "Designed a camera pod with a print-in-place hinge and a push-push latch, with no extra hardware.",
          "Moved the radar pod to the middle of the long side and routed a wire channel under the turf.",
          "Swapped trapped M3 nuts for printed self-tapping bosses, and checked every part watertight before export.",
        ],
      },
      {
        scene: "app",
        title: "iPhone app",
        caption: "A strike arrives over BLE and the app scores it.",
        did: [
          "Built the SwiftUI app that connects to the mat and the radar board over BLE and reconnects on its own.",
          "Added practice, progress, and a Clubhouse with leaderboards and challenges.",
          "Set up email and Sign in with Apple accounts on Supabase, a guest mode that stays on the phone, and account deletion.",
          "Labeled simulated swings clearly and kept them out of uploads and rankings.",
        ],
      },
    ],
  },
  {
    id: "asce-bridge",
    title: "ASCE printed bridge",
    discipline: "Mechanisms",
    summary:
      "A plain-PLA bridge for the FAMU-FSU ASCE-FES 3D printing team in the ASCE Bridging the Future competition. The score rewards a light, stiff span that assembles quickly, and it charges you for extra plastic.",
    accent: "span",
    tools: ["SolidWorks", "PLA", "Slicing", "Fit testing"],
    lessons: {
      challenges: [
        "A socket that measures right in CAD prints tight, because PLA shrinks as it cools.",
        "Putting more people on assembly can cost points. The clock is multiplied by the number of constructors, and a repair pass is charged at 1.5×.",
        "Strength past the 70 lb test cap only adds weight, while the deck still has to carry 25 lb without a local punch-through.",
      ],
      learned: [
        "Orientation, walls, and infill are part of the structure. Layer lines are the weak plane.",
        "A coupon of the joint is cheaper than a full bridge when the fit is wrong.",
        "Each scoring term says what to cut: load over weight, 25 lb over deflection over weight, and constructor-minutes.",
      ],
    },
    figures: [
      {
        scene: "bridge",
        title: "Print, then load",
        caption:
          "The head lays PLA along the chords. Click to set the midspan load and watch the truss take it.",
        did: [
          "Held the model to the competition envelope: a 20 in clear span, no more than 24 in long, 6 in wide, and 8 in tall, with a 3.5 in vehicle passage and a continuous printed deck.",
          "Split the span into pieces that fit the printer bed and the 8.7 × 8.7 × 6.5 in parts box, and joined them with mechanical connections only.",
          "Embossed the school name into a printed face so the design score is not marked down for a missing label.",
        ],
      },
    ],
    improvements: [
      {
        area: "Weight",
        problem: "Members that carried little load were printed as heavy as the ones that carried a lot.",
        change: "Removed material from the low-load members and kept it where the truss actually works.",
        result: "Capacity is divided by weight, and strength past the 70 lb cap earns nothing, so every gram cut raises the score.",
      },
      {
        area: "Print strength",
        problem: "Layer lines are the weak plane in a PLA part, and parts printed in the wrong direction split along them.",
        change: "Set orientation, wall count, and infill so the layer lines follow the load path, and kept supports off the mating faces.",
        result: "Stronger members at the same weight, with clean joint faces that seat without sanding.",
      },
      {
        area: "Joint fit",
        problem: "Sockets that measured right in CAD printed tight because PLA shrinks as it cools.",
        change: "Opened the socket clearance for shrinkage and printed small connection coupons to check the fit first.",
        result: "Fit problems show up on a coupon that prints in minutes instead of on a full bridge.",
      },
      {
        area: "Stiffness",
        problem: "Under the 25 lb stiffness check, the center load plate could punch through the deck instead of loading the truss.",
        change: "Tied the load plate into the truss so the load spreads into the chords.",
        result: "The span deflects as one structure, which keeps measured deflection down and the deck intact.",
      },
      {
        area: "Assembly time",
        problem: "Assembly time is multiplied by the number of constructors, and a repair pass is charged at 1.5×.",
        change: "Cut the joint count and simplified the seating motion so each piece goes in one way.",
        result: "Fewer people can build it faster, with less chance of a costly repair.",
      },
    ],
  },
  {
    id: "nas",
    title: "Personal NAS server",
    discipline: "Products",
    summary:
      "A mini-ITX file server with 8 TB of storage and a program that sorts my files for me.",
    accent: "cobalt",
    tools: ["SolidWorks", "Cursor", "Systems"],
    figures: [
      {
        scene: "nas",
        title: "Ingest and sort",
        caption:
          "Files leave the SSD, pass through the server, and land in photos or coursework.",
        did: [
          "Designed and assembled a Mini-ITX NAS with 8 TB of storage, fitting the motherboard, storage, cooling, and power together.",
          "Designed the enclosure in SolidWorks around component clearances, airflow, cable routing, and serviceability.",
          "Wrote software in Cursor that automatically ingests photos and coursework from removable storage and files each one in the right place.",
        ],
      },
    ],
  },
  {
    id: "stirling-engine",
    title: "Stirling engine",
    discipline: "Mechanisms",
    summary:
      "A multi-component Stirling engine modeled and assembled in SolidWorks from engineering drawings, with full technical drawings and a BOM.",
    accent: "flame",
    tools: ["SolidWorks"],
    lessons: {
      challenges: [
        "Turning the engineering drawings into accurate parts, matching every dimension, tolerance, and thread on the print.",
        "Mating 46 parts so the crank, displacer, and power piston actually move together, with the displacer running 90° ahead of the power piston.",
        "Modeling the threaded screws, dowel pins, and O-rings, and getting the fits between parts right.",
      ],
      learned: [
        "How to read a drawing package closely and build exactly to it.",
        "How mates drive motion in an assembly, and how a Stirling engine’s 90° phase moves heat between the hot and cold ends.",
        "How to document an assembly with exploded views, drawings, and a BOM so someone else could build it.",
      ],
    },
    figures: [
      {
        scene: "stirling",
        title: "Displacer and power piston",
        caption:
          "Real crank-slider motion. The displacer leads the power piston by 90°, shuttling gas between the hot and cold ends.",
        did: [
          "Modeled and assembled a multi-component Stirling engine in SolidWorks from engineering drawings.",
          "Designed the threaded, toleranced, and interfacing components so the parts fit and move together.",
          "Produced assembled and exploded technical drawings with BOM documentation.",
        ],
      },
    ],
  },
  {
    id: "v8-engine",
    title: "V8 engine",
    discipline: "Mechanisms",
    summary:
      "A multi-component V8 engine modeled and assembled in SolidWorks from engineering drawings.",
    accent: "race",
    tools: ["SolidWorks"],
    lessons: {
      challenges: [
        "Keeping eight pistons and connecting rods in sync with one crankshaft using the right mates.",
        "Lining up the block, crankshaft, and bottom end so nothing interferes as the engine turns.",
      ],
      learned: [
        "Building subassemblies first, piston and connecting rod, then crank and pistons, makes a big assembly manageable and easier to debug.",
        "How to document assembly order with drawings and exploded views.",
      ],
    },
    figures: [
      {
        scene: "v8",
        title: "Crank and pistons",
        caption:
          "Two banks of four at 90° on a cross-plane crankshaft. Each cylinder glows as it fires.",
        did: [
          "Modeled and assembled a V8 in SolidWorks from engineering drawings, including the pistons, connecting rods, crankshaft, and cylinder block.",
          "Built constrained assemblies that account for component fit, alignment, and mechanical motion.",
          "Produced engineering drawings and exploded views that document how the parts go together and in what order.",
        ],
      },
    ],
  },
  {
    id: "college-app",
    title: "College discovery app",
    discipline: "Software",
    summary:
      "A full-stack iOS app for discovering universities by swiping, plus an LLM pipeline that cleaned 300,000+ raw records into 1,000+ validated profiles.",
    accent: "violet",
    tools: ["React Native", "Expo", "Python", "ChatGPT API"],
    figures: [
      {
        scene: "swipe",
        title: "Swipe to decide",
        caption: "Swipe right to save a school, left to pass.",
        did: [
          "Built and deployed the app with React Native and Expo.",
          "Designed the swipe interface for browsing schools one card at a time.",
        ],
      },
      {
        scene: "pipeline",
        title: "LLM data cleanup",
        caption:
          "Messy records ride in, get cleaned and checked, and only validated profiles come out.",
        did: [
          "Helped architect the pipeline around the ChatGPT API to clean and normalize 300,000+ raw records.",
          "Filtered and validated the output into 1,000+ structured profiles ready for analysis.",
        ],
      },
    ],
  },
];

