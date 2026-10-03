export const site = {
  name: "Chad Carmichael",
  shortName: "Chad",
  title: "Mechanical Engineering Student",
  email: "CGC24B@FSU.EDU",
  phone: "954.487.0472",
  location: "Broward, Florida · Florida State University",
  tagline:
    "Junior mechanical engineering student into robotics, automation, CAD, and embedded systems — looking for internships and co-ops where I can contribute early and learn fast.",
  roles: [
    "Mechanical Engineering · FSU",
    "CAD & embedded builder",
    "Robotics & automation",
  ],
  photo: "/avatar/chad-linkedin.jpg",
  character: "/avatar/chad-pixel.png",
  resume: "/resume",
  resumeFile: "/resume/Chad_Carmichael_Resume.pdf",
  social: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/chad-carmichael-4475b726b",
    resume: "/resume",
  },
} as const;

export const about = {
  heading: "About",
  bullets: [
    "I’m Chad Carmichael — a junior mechanical engineering student at Florida State University (Vires Scholar, IB Diploma) passionate about robotics and automation.",
    "I work across mechanical systems, SolidWorks CAD, embedded software (ESP32 / nRF52840), and team-based product builds like FairLie.",
    "I want internship or co-op roles where I can apply CAD, sensors, and manufacturing docs early — and learn from engineers shipping real hardware.",
  ],
} as const;

export const connect = [
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "#contact" },
  { label: "GitHub", href: "https://github.com/" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chad-carmichael-4475b726b",
  },
  { label: "Email", href: "mailto:CGC24B@FSU.EDU" },
] as const;

export const experience = [
  {
    company: "Florida State University",
    role: "B.S. Mechanical Engineering · Expected May 2029",
    period: "Present",
    detail: "Vires Scholar — $16,000 merit scholarship over 8 semesters.",
  },
  {
    company: "EZclickAI & C2x Visuals",
    role: "Co-Founder",
    period: "Ongoing",
    detail:
      "Scaled client brands to 1M+ combined views; grew one client’s revenue 50% in a month via brand + content rebuild.",
  },
] as const;

export const projects = [
  {
    title: "FairLie",
    description:
      "Smart golf training mat — 3-board embedded system (ESP32-S3, XIAO nRF52840, Pro Micro) fusing pressure sensors, 9-axis IMU, and 60GHz radar with BLE telemetry toward an iOS companion app.",
    stack: ["ESP32", "SolidWorks", "BLE", "SwiftUI"],
    href: "#contact",
  },
  {
    title: "Personal NAS Server",
    description:
      "Mini-ITX NAS with 8TB storage and a custom ingest tool (built in Cursor) that auto-organizes photography and coursework off an SSD. Enclosure designed in SolidWorks.",
    stack: ["SolidWorks", "Cursor", "Systems"],
    href: "#contact",
  },
  {
    title: "SolidWorks CAD Lab",
    description:
      "Interactive mechanical assemblies, part studies, and design documentation collected in a dedicated CAD workspace.",
    stack: ["SolidWorks", "CAD", "3D Models"],
    href: "/cad",
  },
] as const;

export type SkillItem = {
  id: string;
  label: string;
  logo: string;
  color: string;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming",
    items: [
      { id: "cpp", label: "C++", logo: "/logos/cplusplus.svg", color: "#00599C" },
      { id: "matlab", label: "MATLAB", logo: "/logos/matlab.svg", color: "#E16737" },
      { id: "python", label: "Python", logo: "/logos/python.svg", color: "#3776AB" },
      { id: "react-native", label: "React Native", logo: "/logos/react.svg", color: "#61DAFB" },
      { id: "expo", label: "Expo", logo: "/logos/expo.svg", color: "#4630EB" },
      { id: "swiftui", label: "SwiftUI", logo: "/logos/swift.svg", color: "#F05138" },
      { id: "cursor", label: "Cursor", logo: "/logos/cursor.svg", color: "#8B8B8B" },
      { id: "llms", label: "LLMs / ChatGPT API", logo: "/logos/openai.svg", color: "#10A37F" },
    ],
  },
  {
    title: "CAD Software",
    items: [
      { id: "solidworks", label: "SolidWorks", logo: "/logos/solidworks.png", color: "#D32F2F" },
      { id: "inventor", label: "Inventor", logo: "/logos/inventor.svg", color: "#D99B21" },
      { id: "autocad", label: "AutoCAD", logo: "/logos/autocad.svg", color: "#E51050" },
      { id: "fusion360", label: "Fusion 360", logo: "/logos/fusion360.png", color: "#F28C28" },
      { id: "autodesk", label: "Autodesk", logo: "/logos/autodesk.svg", color: "#0696D7" },
      { id: "kicad", label: "KiCad", logo: "/logos/kicad.svg", color: "#314CB0" },
    ],
  },
  {
    title: "Productivity Software",
    items: [
      { id: "excel", label: "Microsoft Excel", logo: "/logos/excel.svg", color: "#217346" },
    ],
  },
];
