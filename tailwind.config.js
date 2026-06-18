/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // AeonikPro substitute (headings) and body share Inter; the medium
        // weight is the signature — never bold.
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Aurora Teal — dark cosmic system, single sparse accent.
        canvas: "#02110d", // void canvas (page background)
        surface: "#05150f", // midnight surface (cards, nav pill)
        elevated: "#08231a", // deep pine (most elevated / button fill)
        "mint-white": "#eafff7", // primary text
        ash: "#8fb3a8", // secondary text
        fog: "#6f9389", // tertiary text / metadata
        steel: "#3f5249", // deepest muted / disabled
        accent: "#2dd4bf", // teal — the single chromatic signal
        "accent-deep": "#0f766e", // supporting teal (decorative only)
      },
      borderRadius: {
        // Locked to the design set — never 8/12/24 for the wrong element.
        btn: "5px",
        input: "5px",
        card: "16px",
        badge: "32px",
        pill: "999px",
      },
      boxShadow: {
        // Rim-light inset glows instead of drop shadows.
        rim: "inset 0 0 24px rgba(234, 255, 247, 0.04)",
        "rim-2": "inset 0 0 24px rgba(234, 255, 247, 0.06)",
        glow: "inset 0 -7px 11px rgba(45, 212, 191, 0.12)",
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.33" }],
        "body-sm": ["14px", { lineHeight: "1.43" }],
        body: ["16px", { lineHeight: "1.5" }],
        "body-lg": ["18px", { lineHeight: "1.56" }],
        subheading: ["24px", { lineHeight: "1.33" }],
        "heading-sm": ["32px", { lineHeight: "1.25", letterSpacing: "-0.2px" }],
        heading: ["48px", { lineHeight: "1.17", letterSpacing: "-0.3px" }],
        "heading-lg": ["56px", { lineHeight: "1.14", letterSpacing: "-0.4px" }],
        display: ["72px", { lineHeight: "1.11", letterSpacing: "-0.5px" }],
      },
    },
  },
  plugins: [],
};
