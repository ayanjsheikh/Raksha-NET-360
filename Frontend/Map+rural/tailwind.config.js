/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./maps/**/*.{ts,tsx}",
    "./caregiver/**/*.{ts,tsx}",
    "./integration/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1565C0",
        "emergency-green": "#00B894",
        danger: "#E53935",
        warning: "#F9A825",
        accent: "#FF7043",
        bg: "#F8FAFC",
      },
      boxShadow: {
        card: "0 4px 20px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
