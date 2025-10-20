/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}","./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
   extend: { colors: { primary: '#4F46E5', secondary: '#10B981', bgGradientStart: '#EFF6FF', bgGradientEnd: '#DBEAFE' } }
  },
  plugins: [],
}