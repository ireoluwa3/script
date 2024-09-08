import plugin from "tailwindcss/plugin";
import { indigo, sky, teal, amber, rose } from "tailwindcss/colors";
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

import svgToDataUri from "mini-svg-data-uri";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx}",
  "./src/layouts/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
  "./themes/**/**/*.{js,ts,jsx,tsx,html}",
];
export const darkMode = "class";
export const theme = {
  extend: {
    container: {
      center: true,
    },

    fontSize: {
      xs: "0.6rem", // Smaller than default 0.75rem
      sm: "0.7rem", // Smaller than default 0.875rem
      md: "0.75rem", // Smaller than default 1rem
      base: "0.8rem", // Smaller than default 1rem
      lg: "0.9rem", // Smaller than default 1.125rem
      xl: "1rem", // Smaller than default 1.25rem
      "2xl": "1.2rem", // Smaller than default 1.5rem
      "3xl": "1.4rem", // Smaller than default 1.875rem
      "4xl": "1.6rem", // Smaller than default 2.25rem
      "5xl": "1.8rem", // Smaller than default 3rem
      "6xl": "2rem", // Smaller than default 4rem
      "7xl": "2.2rem", // Smaller than default 5rem
      "8xl": "2.4rem", // Smaller than default 6rem
      "9xl": "2.6rem", // Smaller than default 8rem
      "10xl": "2.8rem", // Smaller than default 10rem
    },
    // spacing * 0.8
    spacing: {
      sm: "6.4px", // 80% of the default 8px
      md: "9.6px", // 80% of the default 12px
      lg: "12px", // 80% of the default 16px
      xl: "16px", // 80% of the default 24px
      px: "0.75px", // 80% of the default 1px
      0.5: "0.1rem", // 80% of 0.125rem
      1: "0.2rem", // 80% of 0.25rem
      1.5: "0.3rem", // 80% of 0.375rem
      2: "0.4rem", // 80% of 0.5rem
      2.5: "0.5rem", // 80% of 0.625rem
      3: "0.6rem", // 80% of 0.75rem
      3.5: "0.7rem", // 80% of 0.875r
      4: "0.8rem", // 80% of 1rem
      5: "1rem", // 80% of 1.25rem
      6: "1.2rem", // 80% of 1.5rem
      7: "1.4rem", // 80% of 1.75rem
      8: "1.6rem", // 80% of 2rem
      9: "1.8rem", // 80% of 2.25rem
      10: "2rem", // 80% of 2.5rem
      11: "2.2rem", // 80% of 2.75rem
      12: "2.4rem", // 80% of 3rem
      14: "2.8rem", // 80% of 3.5rem
      16: "3.2rem", // 80% of 4rem
      20: "4rem", // 80% of 5rem
      24: "4.8rem", // 80% of 6rem
      28: "5.6rem", // 80% of 7rem
      32: "6.4rem", // 80% of 8rem
      36: "7.2rem", // 80% of 9rem
      40: "8rem", // 80% of 10rem
      44: "8.8rem", // 80% of 11rem
      48: "9.6rem", // 80% of 12rem
      52: "10.4rem", // 80% of 13rem
      56: "11.2rem", // 80% of 14rem
      60: "12rem", // 80% of 15rem
      64: "12.8rem", // 80% of 16rem
      72: "14.4rem", // 80% of 18rem
      80: "16rem", // 80% of 20rem
      96: "19.2rem", // 80% of 24rem
    },

    screens: {
      // Extra small devices (portrait phones)
      xss: { max: "280px" },
      xs: { min: "280px", max: "479px" },
      // Small devices (landscape phones)
      sm: "480px",
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
    },

    fontFamily: {
      sans: ["var(--font-inter)"],
    },
    colors: {
      muted: {
        50: "#f9f9fa",
        100: "#f3f3f4",
        150: "#ededee",
        200: "#dfdfe1",
        300: "#cfcfd3",
        400: "#9e9ea7",
        500: "#6e6e76",
        600: "#4b4b55",
        700: "#3f3f46",
        800: "#27272a",
        850: "#252529",
        900: "#1c1c1f",
        950: "#141416",
        1000: "#0b0b0d",
      },
      primary: indigo,
      info: sky,
      success: teal,
      warning: amber,
      danger: rose,
    },

    typography: (theme) => {
      return {
        DEFAULT: {
          css: [
            {
              maxWidth: "inherit",
              lineHeight: theme("lineHeight.snug"),
              // These default styles are overridden in global.css
              h1: {
                color: theme("colors.zinc.800"),
                marginTop: theme("margin.8"),
                marginBottom: theme("margin.6"),
              },
              h2: {
                color: theme("colors.zinc.800"),
                marginTop: theme("margin.8"),
                marginBottom: theme("margin.6"),
              },
              h3: {
                color: theme("colors.zinc.800"),
                marginTop: theme("margin.6"),
                marginBottom: theme("margin.4"),
              },
              h4: {
                color: theme("colors.zinc.800"),
                marginTop: theme("margin.6"),
                marginBottom: theme("margin.4"),
              },
              h5: {
                color: "var(--tw-prose-headings)",
                marginTop: theme("margin.6"),
                marginBottom: theme("margin.4"),
              },
              h6: {
                color: "var(--tw-prose-headings)",
                marginTop: theme("margin.6"),
                marginBottom: theme("margin.4"),
              },
              figcaption: {
                margin: 0,
                paddingTop: theme("padding.4"),
                paddingBottom: theme("padding.4"),
                textAlign: "center",
                backgroundColor: theme("colors.omega.800"),
                color: theme("colors.omega.400"),
              },
              ":is(h1, h2, h3, h4, h5, h6):first-child": {
                marginTop: "0",
              },
              "figure:first-child > img": {
                marginTop: "0",
              },
              blockquote: {
                fontWeight: theme("fontWeight.normal"),
              },
              a: {
                textDecoration: "none",
              },
              th: {
                backgroundColor: theme("colors.omega.800"),
              },
              "td, th": {
                paddingTop: theme("padding.2"),
                paddingBottom: theme("padding.2"),
                paddingRight: theme("padding.4"),
                paddingLeft: theme("padding.4"),
              },
              code: {
                fontWeight: theme("fontWeight.normal"),
              },
              "code::before": {
                content: '""',
              },
              "code::after": {
                content: '""',
              },
              "ul > li > *:first-child": {
                margin: 0,
              },
              "ul > li > *:last-child": {
                margin: 0,
              },
            },
          ],
        },
        dark: {
          css: [
            {
              color: theme("colors.zinc.200"),
              h1: { color: theme("colors.zinc.200") },
              h2: { color: theme("colors.zinc.200") },
              h3: { color: theme("colors.zinc.200") },
              h4: { color: theme("colors.zinc.200") },
              h5: { color: "var(--tw-prose-headings)" },
              h6: { color: "var(--tw-prose-headings)" },
              figcaption: {
                backgroundColor: theme("colors.omega.800"),
                color: theme("colors.omega.400"),
              },
              th: {
                backgroundColor: theme("colors.omega.800"),
              },
              blockquote: {
                fontWeight: theme("fontWeight.normal"),
                color: theme("colors.zinc.200"),
              },
              a: {
                textDecoration: "none",
              },
            },
          ],
        },
      };
    },
    gridTemplateColumns: {
      fluid:
        "repeat(auto-fit, minmax(var(--tw-fluid-col-min, 20rem), var(--tw-fluid-col-max, 1fr)))",
    },
    keyframes: {
      indeterminate: {
        "0%": { "margin-left": "-10%" },
        "100%": { "margin-left": "100%" },
      },
      "circle-chart-fill": {
        to: {
          "stroke-dasharray": "0 100",
        },
      },
      wave: {
        "0%": {
          transform: "scale(1)",
          opacity: "1",
        },

        "25%": {
          transform: "scale(1)",
          opacity: "1",
        },

        "100%": {
          transform: "scale(4.5)",
          opacity: "0",
        },
      },
      fadeInUp: {
        from: {
          transform: "translate3d(0, 20px, 0)",
        },

        to: {
          transform: "translate3d(0, 0, 0)",
          opacity: 1,
        },
      },
      fadeInLeft: {
        from: {
          transform: "translate3d(20px, 0, 0)",
          opacity: "0",
        },
        to: {
          transform: "translate3d(0, 0, 0)",
          opacity: "1",
        },
      },
      spinAround: {
        from: {
          transform: "rotate(0deg)",
        },

        to: {
          transform: "rotate(359deg)",
        },
      },
      spotlight: {
        "0%": {
          opacity: 0,
          transform: "translate(-72%, -62%) scale(0.5)",
        },
        "100%": {
          opacity: 1,
          transform: "translate(-50%,-40%) scale(1)",
        },
      },
      "fade-in": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      "grow-in": {
        "0%": { transform: "scale(0)" },
        "100%": { transform: "scale(1)" },
      },
      typing: {
        "0%": { width: 0 },
        "100%": { width: "100%" },
      },
      "blink-caret": {
        "50%": { opacity: 0 },
      },
    },
    animation: {
      "spin-slow": "spin 3s linear infinite",
      "spin-fast": "spin 0.65s linear infinite",
      indeterminate: "indeterminate 1s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      spotlight: "spotlight 2s ease .75s 1 forwards",
      "fade-in": "fade-in 0.5s ease-in forwards",
      "grow-in": "grow-in 0.25s ease-in-out forwards",
      blink: "blink-caret .75s steps(17, end) infinite",
      typewriter: "typing 2s steps(30, end)",
    },
  },
};
export const plugins = [
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@tailwindcss/typography"),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@tailwindcss/aspect-ratio"),
  addVariablesForColors,
  plugin(({ addComponents, addVariant }) => {
    //target progress container
    addVariant("progress-container", "&::-webkit-progress-bar");

    // before bg
    addVariant("before", "&::before");

    // after bg
    addVariant("after", "&::after");

    //target progress bar/inner
    addVariant("progress-bar", [
      "&::-webkit-progress-value",
      "&::-moz-progress-bar",
      "&::-ms-fill",
    ]);

    addComponents({
      ".slimscroll::-webkit-scrollbar": {
        width: "6px",
      },
      ".slimscroll::-webkit-scrollbar-thumb": {
        "border-radius": ".75rem",
        background: "rgba(0, 0, 0, 0.1)",
      },
      ".slimscroll-opaque::-webkit-scrollbar-thumb": {
        background: "rgba(0, 0, 0, 0) !important",
      },
      ".mask": {
        "mask-size": "contain",
        "mask-repeat": "no-repeat",
        "mask-position": "center",
      },
      ".mask-hex": {
        "mask-image":
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjQuNzg2IDE4MS40Yy05LjE5NiAwLTIwLjA2My02LjY4Ny0yNS4wNzktMTQuMjFMMy43NjIgMTA1LjMzYy01LjAxNi04LjM2LTUuMDE2LTIwLjkgMC0yOS4yNTlsMzUuOTQ1LTYxLjg2QzQ0LjcyMyA1Ljg1MSA1NS41OSAwIDY0Ljc4NiAwaDcxLjA1NWM5LjE5NiAwIDIwLjA2MyA2LjY4OCAyNS4wNzkgMTQuMjExbDM1Ljk0NSA2MS44NmM0LjE4IDguMzYgNC4xOCAyMC44OTkgMCAyOS4yNThsLTM1Ljk0NSA2MS44NmMtNC4xOCA4LjM2LTE1Ljg4MyAxNC4yMTEtMjUuMDc5IDE0LjIxMUg2NC43ODZ6Ii8+PC9zdmc+')",
      },
      ".mask-hexed": {
        "mask-image":
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgyIiBoZWlnaHQ9IjIwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLjMgNjUuNDg2YzAtOS4xOTYgNi42ODctMjAuMDYzIDE0LjIxMS0yNS4wNzhsNjEuODYtMzUuOTQ2YzguMzYtNS4wMTYgMjAuODk5LTUuMDE2IDI5LjI1OCAwbDYxLjg2IDM1Ljk0NmM4LjM2IDUuMDE1IDE0LjIxMSAxNS44ODIgMTQuMjExIDI1LjA3OHY3MS4wNTVjMCA5LjE5Ni02LjY4NyAyMC4wNjMtMTQuMjExIDI1LjA3OWwtNjEuODYgMzUuOTQ1Yy04LjM2IDQuMTgtMjAuODk5IDQuMTgtMjkuMjU4IDBsLTYxLjg2LTM1Ljk0NUM2LjE1MSAxNTcuNDQuMyAxNDUuNzM3LjMgMTM2LjU0VjY1LjQ4NnoiLz48L3N2Zz4=')",
      },
      ".mask-deca": {
        "mask-image":
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOTYgMGw1OC43NzkgMTkuMDk4IDM2LjMyNyA1MHY2MS44MDRsLTM2LjMyNyA1MEw5NiAyMDBsLTU4Ljc3OS0xOS4wOTgtMzYuMzI3LTUwVjY5LjA5OGwzNi4zMjctNTB6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')",
      },
      ".mask-blob": {
        "mask-image":
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDBDMjAgMCAwIDIwIDAgMTAwczIwIDEwMCAxMDAgMTAwIDEwMC0yMCAxMDAtMTAwUzE4MCAwIDEwMCAweiIvPjwvc3ZnPg==')",
      },
      ".mask-diamond": {
        "mask-image":
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDBsMTAwIDEwMC0xMDAgMTAwTDAgMTAweiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')",
      },
    });
  }),
  function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        "bg-grid": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-grid-small": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-dot": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
          )}")`,
        }),
      },
      { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
    );
  },
];

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
