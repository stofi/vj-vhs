import './entry.css'
import './style.css'

import Experience from './Experience/Experience'

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

new Experience(canvas)
