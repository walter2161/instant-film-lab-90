import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
		backgroundImage: {
			'gradient-hero': 'var(--gradient-hero)',
			'gradient-card': 'var(--gradient-card)',
			'gradient-primary': 'var(--gradient-primary)',
			'gradient-glass': 'var(--gradient-glass)',
			'radial-vignette': 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)'
		},
		boxShadow: {
			'glow': 'var(--shadow-glow)',
			'card': 'var(--shadow-card)',
			'intense': 'var(--shadow-intense)'
		},
		transitionTimingFunction: {
			'smooth': 'var(--transition-smooth)',
			'bounce': 'var(--transition-bounce)'
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		scale: {
			'102': '1.02',
		},
		keyframes: {
			'accordion-down': {
				from: { height: '0' },
				to: { height: 'var(--radix-accordion-content-height)' }
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0' }
			},
			// Cinema Zoom Animations
			'cinema-zoom-in': {
				'0%': { transform: 'scale(1)' },
				'100%': { transform: 'scale(1.15)' }
			},
			'cinema-zoom-out': {
				'0%': { transform: 'scale(1.15)' },
				'100%': { transform: 'scale(1)' }
			},
			'cinema-slow-zoom': {
				'0%': { transform: 'scale(1)' },
				'100%': { transform: 'scale(1.08)' }
			},
			// Cinema Pan Animations
			'cinema-pan-left': {
				'0%': { transform: 'scale(1.2) translateX(5%)' },
				'100%': { transform: 'scale(1.2) translateX(-5%)' }
			},
			'cinema-pan-right': {
				'0%': { transform: 'scale(1.2) translateX(-5%)' },
				'100%': { transform: 'scale(1.2) translateX(5%)' }
			},
			'cinema-pan-up': {
				'0%': { transform: 'scale(1.2) translateY(5%)' },
				'100%': { transform: 'scale(1.2) translateY(-5%)' }
			},
			'cinema-pan-down': {
				'0%': { transform: 'scale(1.2) translateY(-5%)' },
				'100%': { transform: 'scale(1.2) translateY(5%)' }
			},
			// Ken Burns Animations
			'ken-burns-tl': {
				'0%': { transform: 'scale(1) translate(0, 0)' },
				'100%': { transform: 'scale(1.2) translate(-3%, -3%)' }
			},
			'ken-burns-tr': {
				'0%': { transform: 'scale(1) translate(0, 0)' },
				'100%': { transform: 'scale(1.2) translate(3%, -3%)' }
			},
			'ken-burns-bl': {
				'0%': { transform: 'scale(1) translate(0, 0)' },
				'100%': { transform: 'scale(1.2) translate(-3%, 3%)' }
			},
			'ken-burns-br': {
				'0%': { transform: 'scale(1) translate(0, 0)' },
				'100%': { transform: 'scale(1.2) translate(3%, 3%)' }
			},
			// Drift Animation
			'cinema-drift': {
				'0%': { transform: 'scale(1.1) translate(-1%, -1%)' },
				'50%': { transform: 'scale(1.12) translate(1%, 0.5%)' },
				'100%': { transform: 'scale(1.1) translate(-0.5%, 1%)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			// Cinema Animations
			'cinema-zoom-in': 'cinema-zoom-in 12s ease-out forwards',
			'cinema-zoom-out': 'cinema-zoom-out 12s ease-out forwards',
			'cinema-slow-zoom': 'cinema-slow-zoom 12s ease-out forwards',
			'cinema-pan-left': 'cinema-pan-left 12s ease-out forwards',
			'cinema-pan-right': 'cinema-pan-right 12s ease-out forwards',
			'cinema-pan-up': 'cinema-pan-up 12s ease-out forwards',
			'cinema-pan-down': 'cinema-pan-down 12s ease-out forwards',
			'ken-burns-tl': 'ken-burns-tl 12s ease-out forwards',
			'ken-burns-tr': 'ken-burns-tr 12s ease-out forwards',
			'ken-burns-bl': 'ken-burns-bl 12s ease-out forwards',
			'ken-burns-br': 'ken-burns-br 12s ease-out forwards',
			'cinema-drift': 'cinema-drift 12s ease-in-out forwards'
		}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
