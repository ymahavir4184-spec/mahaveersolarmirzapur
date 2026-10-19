/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary, #0062FF)",
          "primary-dark": "var(--brand-primary-dark, #004ecc)",
          secondary: "var(--brand-secondary, #0EA5E9)",
          text: "var(--brand-text, #0F172A)",
          background: "var(--brand-background, #FFFFFF)",
          ice: "var(--brand-ice, #F0F7FF)",
          navy: "var(--brand-navy, #0B192C)",
          muted: "var(--brand-muted, #64748B)",
          card: "var(--brand-card, #FFFFFF)",
          border: "var(--brand-border, #E2E8F0)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 1px 4px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 12px 30px -4px rgba(0, 98, 255, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.05)",
        elevated: "0 4px 24px -4px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.06)",
        "glow-primary": "0 8px 32px -8px rgba(0, 98, 255, 0.35)",
        "glow-lg": "0 16px 48px -12px rgba(0, 98, 255, 0.4)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0062FF 0%, #0EA5E9 100%)",
        "gradient-navy": "linear-gradient(135deg, #051022 0%, #0B192C 60%, #0d2145 100%)",
        "gradient-ice": "linear-gradient(180deg, #eef5ff 0%, #f5f9ff 50%, #ffffff 100%)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "scale-in": "scale-in 0.4s ease-out both",
        float: "float 3.5s ease-in-out infinite",
        shimmer: "shimmer 1.8s infinite linear",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 98, 255, 0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(0, 98, 255, 0.12)" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
