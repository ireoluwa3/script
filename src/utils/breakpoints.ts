// breakpoints.ts
export const breakpoints = {
  // Extra small devices (portrait phones)
  xs: { max: "639px" },
  // Small devices (landscape phones)
  sm: "640px",
  // Medium devices (tablets)
  md: "768px",
  // Medium devices (portrait tablets)
  mdp: { raw: "(min-width: 768px) and (orientation: portrait)" },
  // Medium devices (landscape tablets)
  mdl: { raw: "(min-width: 768px) and (orientation: landscape)" },
  // Large devices (desktops)
  lg: "1024px",
  // Extra large devices (large desktops)
  xl: "1280px",
  // Extra extra large devices
  xxl: "1536px",
  // Portrait tablets
  ptablet: {
    raw: "(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)",
  },
  // Landscape tablets
  ltablet: {
    raw: "(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)",
  },
  // Portrait small devices
  smdp: { raw: "(min-width: 640px) and (orientation: portrait)" },
  // Landscape small devices
  smdl: { raw: "(min-width: 640px) and (orientation: landscape)" },
  // High Resolution devices
  hdpi: {
    raw: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
  },
};
