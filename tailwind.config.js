import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1565C0",
          50: "#EAF2FC",
          100: "#D0E3F8",
          200: "#A1C7F1",
          300: "#72AAE9",
          400: "#438EE2",
          500: "#1565C0",
          600: "#11529B",
          700: "#0D3F76",
          800: "#092C52",
          900: "#04192D",
          foreground: "#FFFFFF",
        },
        emergency: {
          DEFAULT: "#00B894",
          50: "#E6F9F5",
          100: "#B3EEE0",
          500: "#00B894",
          600: "#00966F",
          700: "#00745A",
        },
        danger: {
          DEFAULT: "#E53935",
          50: "#FDECEC",
          100: "#FAD1D0",
          500: "#E53935",
          600: "#C62828",
          700: "#A31F1C",
        },
        warning: {
          DEFAULT: "#F9A825",
          50: "#FEF6E3",
          100: "#FDEAB8",
          500: "#F9A825",
          600: "#D68E14",
        },
        accent: {
          DEFAULT: "#FF7043",
          50: "#FFEEE7",
          100: "#FFD3C1",
          500: "#FF7043",
          600: "#E85A2C",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
        },
        ink: {
          primary: "#1F2937",
          secondary: "#6B7280",
        },
        line: "#E5E7EB",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(31, 41, 55, 0.04), 0 1px 2px rgba(31, 41, 55, 0.06)",
        card: "0 8px 24px rgba(21, 101, 192, 0.08)",
        elevated: "0 16px 40px rgba(21, 101, 192, 0.12)",
        glow: "0 0 0 8px rgba(0, 184, 148, 0.12)",
      },
      keyframes: {
        "sos-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "sos-pulse": "sos-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 1.8s linear infinite",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1565C0 0%, #0D3F76 100%)",
        "gradient-emergency": "linear-gradient(135deg, #00B894 0%, #00745A 100%)",
        "gradient-danger": "linear-gradient(135deg, #E53935 0%, #A31F1C 100%)",
        "gradient-hero": "linear-gradient(135deg, #1565C0 0%, #1976D2 45%, #00B894 100%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
