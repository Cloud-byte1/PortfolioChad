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
  | "swipe"
  | "pipeline";

export type Discipline = "Products" | "Mechanisms" | "Software";

/** Each project owns one accent color (tokens in globals.css). */
export type Accent = "turf" | "cobalt" | "flame" | "race" | "violet";

export type Figure = {
  scene: SceneKey;
  title: string;
  /** What the animation shows. */
  caption: string;
  /** What Chad did on this part, in plain verbs. */
  did: string[];
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

