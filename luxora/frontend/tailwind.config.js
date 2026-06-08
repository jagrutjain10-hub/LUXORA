/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: { DEFAULT: "#0a0a0a", 50: "#f5f5f5", 100: "#e8e8e8", 200: "#d0d0d0", 300: "#a8a8a8", 400: "#717171", 500: "#4a4a4a", 600: "#2d2d2d", 700: "#1a1a1a", 800: "#111111", 900: "#0a0a0a" },
        champagne: { DEFAULT: "#c9a96e", 50: "#fdf8f0", 100: "#f7edd8", 200: "#efd8b0", 300: "#e3be81", 400: "#d4a055", 500: "#c9a96e", 600: "#b8832e", 700: "#996924", 800: "#7a5420", 900: "#5c3f1a" },
        ivory: { DEFAULT: "#f5f0e8", 50: "#fdfcfa", 100: "#faf7f2", 200: "#f5f0e8", 300: "#ede4d5", 400: "#ddd0bb", 500: "#c8b99a" },
        sand: { DEFAULT: "#e8dfd0", 50: "#faf8f5", 100: "#f2ece3", 200: "#e8dfd0", 300: "#d8ccb8", 400: "#c3b499", 500: "#ab9876" },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-jost)", "system-ui", "sans-serif"],
        mono: ["monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(3rem,8vw,7rem)", { lineHeight: "1.05" }],
        "display-xl": ["clamp(2.5rem,6vw,5.5rem)", { lineHeight: "1.08" }],
        "display-lg": ["clamp(2rem,4.5vw,4rem)", { lineHeight: "1.1" }],
        "display-md": ["clamp(1.75rem,3.5vw,3rem)", { lineHeight: "1.15" }],
        "display-sm": ["clamp(1.5rem,2.5vw,2.25rem)", { lineHeight: "1.2" }],
        "label-xs": ["0.65rem", { letterSpacing: "0.2em" }],
        "label-sm": ["0.75rem", { letterSpacing: "0.18em" }],
        "label-md": ["0.875rem", { letterSpacing: "0.15em" }],
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1000": "1000ms",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        "luxury": "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
        "luxury-lg": "0 40px 100px rgba(0,0,0,0.2)",
        "card": "0 2px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.12)",
        "gold-glow": "0 0 40px rgba(201,169,110,0.2)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "marquee": "marquee 25s linear infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(32px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};