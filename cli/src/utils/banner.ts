import gradient from 'gradient-string'
import { version } from './version.js'

const BANNER = `
  ██╗   ██╗██╗     ██╗     ███╗   ██╗████████╗
  ██║   ██║██║     ██║     ████╗  ██║╚══██╔══╝
  ██║   ██║██║     ██║     ██╔██╗ ██║   ██║
  ╚██╗ ██╔╝██║     ██║     ██║╚██╗██║   ██║
   ╚████╔╝ ███████╗███████╗██║ ╚████║   ██║
    ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝
`

const vllntGradient = gradient(['#7c3aed', '#2563eb', '#06b6d4'])

export function showBanner(): void {
  console.log(vllntGradient(BANNER))
  console.log(`  v${version} — Agent-first development\n`)
}
