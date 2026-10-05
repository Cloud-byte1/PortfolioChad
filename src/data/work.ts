/**
 * Everything shown in the CAD Lab. Each entry pairs an animated scene
 * (see components/work/scenes.tsx) with what Chad actually did on it.
 */

export type SceneKey =
  | "strike"
  | "board"
  | "enclosure"
  | "app"
  | "nas"
  | "stirling"
  | "ujoint"
  | "swipe"
  | "pipeline";

export type Discipline = "Mechanical" | "Electronics" | "Software";

export type WorkItem = {
  id: string;
  title: string;
  discipline: Discipline;
  /** One line: what the thing is. */
  summary: string;
  /** What Chad did, in plain verbs. */
  did: string[];
  tools: string[];
  scene: SceneKey;
  /** Short caption under the animation explaining what's moving. */
  caption: string;
  /** Show on the home page. */
  featured?: boolean;
  /** Show the 3D viewer on this project's page. */
  hasModel?: boolean;
};

export const disciplines: { name: Discipline; blurb: string }[] = [
  {
    name: "Mechanical",
    blurb: "Parts, assemblies, and housings: modeled, mated, and printed.",
  },
  {
    name: "Electronics",
    blurb: "Sensor systems and the board that ties them together.",
  },
  {
    name: "Software",
    blurb: "Firmware, apps, and tools that turn hardware into something usable.",
  },
];

export const work: WorkItem[] = [
  {
    id: "fairlie-mat",
    title: "FairLie smart golf mat",
    discipline: "Electronics",
    summary:
      "A training mat that reads every strike through pressure sensors, an IMU, and 60 GHz radar.",
    did: [
      "Architected a 3-board sensor system (ESP32-S3, XIAO nRF52840, Pro Micro nRF52840) fusing 6 pressure sensors, a 9-axis IMU, and a 60 GHz radar.",
      "Wrote ESP-IDF firmware split into sensor sampling, strike detection, IMU, radar, scoring, and BLE modules.",
      "Merged each mat strike with the radar reading from the previous 0.75 s so ball speed lands on the right swing.",
      "Built Strike Lab, a browser test bench with a small backend for logging practice sessions.",
    ],
    tools: ["ESP-IDF / C", "BLE", "Arduino", "Node"],
    scene: "strike",
    caption:
      "Heel-to-toe pressure pads fire as the club passes, the radar pod reads ball speed, and the result is sent to the phone over BLE.",
    featured: true,
  },
  {
    id: "fairlie-board",
    title: "TurfTrack control board",
    discipline: "Electronics",
    summary:
      "The custom PCB inside the mat: power, MCU, sensors, and camera on one board.",
    did: [
      "Laid out the schematic in KiCad across four sheets: power, MCU, sensors, and camera.",
      "Designed a USB-C charging and Li-Po power path with a P-FET switchover and 3.3 V regulation.",
      "Read 6 pressure channels through two ADS1115 ADCs with RC input filters, plus an IMU and Qwiic ports for radar and temperature.",
      "Autorouted with Freerouting, then prepared the BOM and assembly files for a contract manufacturer.",
      "Brought up a perfboard prototype first, testing each subsystem in stages before committing to copper.",
    ],
    tools: ["KiCad", "Freerouting", "PCB assembly"],
    scene: "board",
    caption:
      "Traces route out from the ESP32-S3 module to each subsystem, then signals start flowing.",
    featured: true,
  },
  {
    id: "fairlie-housings",
    title: "FairLie housings",
    discipline: "Mechanical",
    summary:
      "3D-printed enclosures for the electronics, camera, and radar, plus ground spikes and alignment clips.",
    did: [
      "Resized the control cassette to 160 × 100 × 20 mm with a screw-down lid after the first shell couldn’t fit the board.",
      "Designed a camera pod with a print-in-place hinge and a push-push latch: no extra hardware.",
      "Moved the radar pod to the middle of the long side and routed a wire channel under the turf.",
      "Swapped trapped M3 nuts for printed self-tapping bosses, and checked every part watertight before export.",
    ],
    tools: ["Fusion 360", "CadQuery", "3D printing"],
    scene: "enclosure",
    caption:
      "The cassette opens, the board drops onto its standoffs, and the lid screws back down.",
  },
  {
    id: "stirling-engine",
    title: "Stirling engine",
    discipline: "Mechanical",
    summary:
      "A full engine assembly modeled in SolidWorks, alongside a V8 engine study.",
    did: [
      "Modeled each part and mated the assembly so the flywheel drives both pistons.",
      "Set the displacer and power piston about 90° out of phase, which is what moves heat between the hot and cold ends.",
      "Modeled a V8 engine as a second assembly study.",
    ],
    tools: ["SolidWorks"],
    scene: "stirling",
    caption:
      "Real crank-slider motion: the displacer leads the power piston by 90°, shuttling gas from the hot end to the cold end.",
    featured: true,
    hasModel: true,
  },
  {
    id: "universal-joint",
    title: "Universal joint assemblies",
    discipline: "Mechanical",
    summary:
      "Inventor assemblies of a universal shaft, crank, and slide mechanism.",
    did: [
      "Modeled the yokes, pins, connecting rod, crank handle, and base as separate parts.",
      "Assembled the universal joint and set the shaft angle with constraints.",
      "Used drive constraints to animate the crank and slide through their range.",
    ],
    tools: ["Autodesk Inventor"],
    scene: "ujoint",
    caption:
      "At a 30° shaft angle the output speeds up and slows down twice per turn. The trace plots that speed ratio.",
  },
  {
    id: "nas",
    title: "Personal NAS server",
    discipline: "Software",
    summary:
      "A mini-ITX file server with 8 TB of storage and a program that sorts my files for me.",
    did: [
      "Built a mini-ITX NAS with 8 TB of storage.",
      "Wrote an ingest program in Cursor that pulls photos and coursework off an SSD and files each one in the right place.",
      "Designed the server enclosure in SolidWorks.",
    ],
    tools: ["SolidWorks", "Cursor", "Systems"],
    scene: "nas",
    caption:
      "Files leave the SSD and get sorted into photos or coursework as they land on the server.",
    featured: true,
  },
  {
    id: "fairlie-app",
    title: "FairLie iPhone app",
    discipline: "Software",
    summary:
      "The SwiftUI companion app that turns mat and radar data into a strike score.",
    did: [
      "Connected to the mat and the radar board over BLE, reconnecting automatically when the link drops.",
      "Built practice, progress, and a Clubhouse with leaderboards and challenges.",
      "Added email and Sign in with Apple accounts on Supabase, a guest mode that stays on the phone, and account deletion.",
      "Labeled simulated swings clearly and kept them out of uploads and rankings.",
    ],
    tools: ["SwiftUI", "BLE", "Supabase"],
    scene: "app",
    caption:
      "A strike arrives over BLE and the score and swing numbers fill in.",
  },
  {
    id: "college-app",
    title: "College discovery app",
    discipline: "Software",
    summary: "A full-stack iOS app for finding universities by swiping.",
    did: [
      "Built and deployed the app with React Native and Expo.",
      "Designed the swipe interface for browsing schools one card at a time.",
    ],
    tools: ["React Native", "Expo"],
    scene: "swipe",
    caption: "Swipe right to save a school, left to pass.",
  },
  {
    id: "data-pipeline",
    title: "LLM data cleanup",
    discipline: "Software",
    summary:
      "An automated pipeline that cleaned 300,000+ raw records into 1,000+ validated profiles.",
    did: [
      "Helped architect the pipeline around the ChatGPT API to clean and normalize messy records.",
      "Filtered and validated the output into a structured set of profiles ready for analysis.",
    ],
    tools: ["Python", "ChatGPT API"],
    scene: "pipeline",
    caption:
      "Raw rows stream in, get normalized, and only validated profiles come out the other side.",
  },
];

export const featuredWork = work.filter((item) => item.featured);
