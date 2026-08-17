import { defineConfig } from 'unocss'
import { presetMini } from 'unocss'
import { presetAttributify } from 'unocss'
import { presetWebFonts } from 'unocss'
import theme from './src/theme.ts'

export default defineConfig({
	rules: [
		['bg-dot-fade',  {
			'background-color': 'oklch(99% 0 0)',
      'background-image': 'linear-gradient(to right, oklch(99% 0 0), oklch(99% 0 0 / 0)), radial-gradient(oklch(7% 0 0) 1px, transparent 0)',
		  'background-size': '100% 100%, 40px 40px',
		  'background-position': '0 0, 0 0'
		}]
	],
	content: {
		pipeline: {
			include: ["src/**/*.{js,jsx,ts,tsx,html}"]
		}
	},
	presets: [
		presetMini(),
		presetAttributify(),
		presetWebFonts({
			provider: 'bunny',
			fonts: {
				sans: 'Space Grotesk:400,500,600',
				mono: 'Google Sans Code',
			} 
		})
	],
	theme
})
