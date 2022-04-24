import * as THREE from 'three'
import Experience from '../Experience'

interface ElementOptions {
    type: string
    align: CanvasTextAlign
    x: number
    y: number
    width: number
    height: number
    size: number
    active: boolean
    maxWidth: number
    maxHeight: number
    lineHeight: number
    color: string
    z: number
    draw: (ctx: CanvasRenderingContext2D) => void
}

interface ElementOptionsOptional {
    type?: string
    align?: CanvasTextAlign
    x?: number
    y?: number
    width?: number
    height?: number
    size?: number
    active?: boolean
    maxWidth?: number
    maxHeight?: number
    lineHeight?: number
    color?: string
    z?: number
    draw?: (ctx: CanvasRenderingContext2D) => void
}
export interface Element {
    text: string
    options: ElementOptions
    id: number
}

let instance: UICanvas
let id = 0

class UICanvas {
    experience!: Experience
    texture!: THREE.Texture

    width = 320
    height = 240

    canvas?: HTMLCanvasElement
    context?: CanvasRenderingContext2D

    elements: Element[] = []

    constructor() {
        if (instance) return instance
        instance = this
        this.experience = new Experience()
        this.createTextCanvas()
        this.addUIPlane()
    }

    createTextCanvas() {
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

        const width = 320
        const height = 240

        this.canvas.width = width
        this.canvas.height = height
        this.canvas.style.width = width + 'px'
        this.canvas.style.height = height + 'px'
        this.updateTextCanvas()
        this.texture = new THREE.Texture(this.canvas)
        return this.canvas
    }

    updateTextCanvas() {
        const context = this.context as CanvasRenderingContext2D
        const canvas = this.canvas as HTMLCanvasElement

        if (!context || !canvas) return

        context.clearRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = 'transparent'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)

        this.elements
            .slice()
            .sort((a, b) => a.options.z - b.options.z)
            .forEach((element) => {
                if (!element.options.active) return
                // determin if text is multiline
                if (element.options.type === 'text') {
                    const isMultiline = element.text.indexOf('\n') !== -1
                    if (isMultiline) {
                        this.drawMultilineText(
                            element.text,
                            element.options.x,
                            element.options.y,
                            element.options.size,
                            element.options.align,
                            element.options.maxWidth,
                            element.options.maxHeight,
                            element.options.lineHeight
                        )
                    } else {
                        this.drawText(
                            element.text,
                            element.options.align,
                            element.options.x,
                            element.options.y,
                            element.options.size
                        )
                    }
                } else if (element.options.type === 'image') {
                    //
                } else if (element.options.type === 'custom') {
                    this.drawCustom(
                        element.options.x,
                        element.options.y,
                        element.options.width,
                        element.options.height,
                        element.options.draw
                    )
                } else if (element.options.type === 'box') {
                    this.drawBox(
                        element.options.x,
                        element.options.y,
                        element.options.width,
                        element.options.height,
                        element.options.color
                    )
                }
            })

        if (!this.texture) return
        this.texture.needsUpdate = true
    }

    drawBox(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string
    ) {
        const context = this.context as CanvasRenderingContext2D
        const canvas = this.canvas as HTMLCanvasElement

        if (!context || !canvas) return

        context.fillStyle = color
        context.fillRect(x, y, width, height)
    }

    drawCustom(
        x: number,
        y: number,
        width: number,
        height: number,
        draw: (ctx: CanvasRenderingContext2D) => void
    ) {
        const context = this.context as CanvasRenderingContext2D
        const canvas = this.canvas as HTMLCanvasElement

        if (!context || !canvas) return
        // offset by x,y
        context.save()
        context.translate(x, y)

        draw(context)

        context.restore()
    }

    drawText(
        text: string,
        align: CanvasTextAlign = 'right',
        x?: number,
        y?: number,
        size = 14
    ) {
        const context = this.context as CanvasRenderingContext2D
        const canvas = this.canvas as HTMLCanvasElement

        if (!context || !canvas) return
        const font = 'VCR OSD Mono'
        const fontSize = size

        context.font = `${fontSize}px ${font}`
        context.textAlign = align
        context.textBaseline = 'bottom'

        // add stroke
        context.strokeStyle = 'black'
        context.lineWidth = 3

        context.fillStyle = 'white'
        const textXOffset = x || 0
        const textYOffset = y || 0

        const textX =
            align === 'center'
                ? this.width / 2
                : align === 'left'
                ? textXOffset
                : this.width - textXOffset

        context.strokeText(text, textX, fontSize + textYOffset)
        context.fillText(text, textX, fontSize + textYOffset)
    }

    drawMultilineText(
        text: string,
        x: number,
        y: number,
        size = 14,
        align: CanvasTextAlign = 'left',
        maxWidth = 32,
        maxHeight = 12,
        lineHeight = 1.2
    ) {
        // TODO: Calculate this based on the text
        const maxCharactersPerLine = maxWidth
        const maxLines = maxHeight

        const lines = text
            .split('\n')
            .map((line) => {
                // if line is too long, split it at maxCharactersPerLine
                if (line.length > maxCharactersPerLine) {
                    return line.slice(0, maxCharactersPerLine)
                }

                return line
            })
            .slice(0, maxLines)
        lines.forEach((line, index) => {
            this.drawText(line, align, x, y + index * size * lineHeight, size)
        })
    }

    newElement(text: string, options: ElementOptionsOptional = {}) {
        const defaultOptions: ElementOptions = {
            type: 'text',
            align: 'left',
            x: 0,
            y: 0,
            size: 14,
            active: true,
            maxWidth: 32,
            maxHeight: 12,
            lineHeight: 1.2,
            z: 0,
            width: 0,
            height: 0,
            color: 'white',
            draw: (ctx) => {
                //
            },
        }
        this.elements.push({
            text,
            options: {
                ...defaultOptions,
                ...options,
            },
            id: id++,
        })

        return this.elements[this.elements.length - 1]
    }
    deleteElement(element: Element) {
        element.options.active = false
        this.elements = this.elements.filter((e) => e.id !== element.id)
    }
    deactivateElement(element: Element) {
        element.options.active = false
    }
    getTexture() {
        return this.texture
    }

    addUIPlane() {
        if (!this.texture) return
        const geometry = new THREE.PlaneBufferGeometry(4, 3)
        const material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
        })
        this.texture.needsUpdate = true
        const plane = new THREE.Mesh(geometry, material)
        plane.scale.setScalar(0.05)
        plane.position.y = 0
        plane.position.z = -0.1

        this.experience.camera.instance.add(plane)
    }

    resize() {
        // noop
    }

    update() {
        this.updateTextCanvas()
    }
}
export default UICanvas
