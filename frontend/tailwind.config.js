// tailwind.config.js

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          900: "#0f172a", // deep navy
        },
        accent: "#facc15", // yellow highlight
        bookCream: "#f5efe6", // soft background option
        bookstoreBrown: "#6b4f3f",
      },
    },
  },
  plugins: [],
};
