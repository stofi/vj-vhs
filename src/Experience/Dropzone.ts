export default class Dropzone {
    element: HTMLElement
    onLoad: (file: File) => void
    file?: File

    activeClass = 'bg-neutral-600'

    constructor(
        element: HTMLElement,
        onLoad: (file: File) => void,
        activeClass?: string
    ) {
        this.element = element
        this.activeClass = activeClass || this.activeClass
        this.onLoad = onLoad
        this.addListeners()
    }
    addListeners() {
        this.element.ondragover = (event) => {
            event.preventDefault()
            event.stopPropagation()
        }
        this.element.ondrop = (event) => {
            event.preventDefault()
            event.stopPropagation()
            const dataTransfer = event.dataTransfer as DataTransfer
            if (dataTransfer.files && dataTransfer.files.length) {
                const file = dataTransfer.files[0]
                this.loadFile(file)
            }
            this.element.classList.remove(this.activeClass)
        }
        this.element.ondragenter = (event) => {
            event.preventDefault()
            event.stopPropagation()
            this.element.classList.add(this.activeClass)
        }
        this.element.ondragleave = (event) => {
            event.preventDefault()
            event.stopPropagation()
            this.element.classList.remove(this.activeClass)
        }
        this.element.ondragstart = (event) => {
            event.preventDefault()
            event.stopPropagation()
        }
        this.element.ondragend = (event) => {
            event.preventDefault()
            event.stopPropagation()
        }
    }
    loadFile(file: File) {
        this.file = file
        this.onLoad(file)
    }
}
