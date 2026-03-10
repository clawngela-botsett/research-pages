import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Legacy colors for compatibility
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			// Modern futuristic gradients
  			'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  			'gradient-teal': 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
  			'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
  			// Cyber fashion theme colors
  			'cyber-bg': '#F4F2FB',
  			'cyber-panel': '#FFFFFF',
  			'cyber-line': '#E0D9F5',
  			'cyber-pink': '#FF2D6B',
  			'cyber-pink-soft': '#FF6B9D',
  			'cyber-purple': '#7C5CFF',
  			'cyber-dark': '#050814',
  			'cyber-muted': '#8C8CA3',
  			'cyber-success': '#4EF2C5',
  			'cyber-warning': '#FFC857',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: '1.25rem',
  			chip: '999px',
  		},
  		boxShadow: {
  			'cyber-soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
  		},
  		fontFamily: {
  			sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  			display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  			mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
