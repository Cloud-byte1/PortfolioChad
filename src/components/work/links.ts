export const projectHref = (id: string) => `/projects/${id}`;

/** Shared name so a preview's figure morphs into the project page's first figure. */
export const sceneTransitionName = (id: string) => `scene-${id}`;

/** CSS variables that theme a block in a project's accent; scenes read --signal. */
export const accentStyle = (accent: string) =>
  ({
    "--accent": `var(--c-${accent})`,
    "--accent-ink": `var(--c-${accent}-ink)`,
    "--signal": `var(--c-${accent})`,
  }) as React.CSSProperties;
