import { EventEmitter } from '../../Utils/EventEmitter'

class Sizes extends EventEmitter {
    width!: number
    height!: number
    pixelRatio!: number
    maxPixelRatio = 1

    constructor() {
        super()
        this.setSizes()

        //if window has ?lowres=true, then set maxPixelRatio to 1

        window.addEventListener('resize', this.setSizes.bind(this))
    }

    private setSizes() {
        if (!window.location.hash.match('lowres')) {
            this.maxPixelRatio = 2
        }
        // width is greater than height in 4:3 ratio
        const ratio = 4 / 3
        if (window.innerWidth > window.innerHeight * ratio) {
            this.width = window.innerHeight * ratio
            this.height = window.innerHeight
        } else {
            this.width = window.innerWidth
            this.height = window.innerWidth / ratio
        }

        // this.width = window.innerWidth
        // this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, this.maxPixelRatio)
        this.trigger('resize')
    }
}

export default Sizes
