import * as THREE from 'three'
import Dropzone from '../Dropzone'
import Experience from '../Experience'
import UICanvas, { Element } from '../UI/UICanvas'
import UIInput from '../UI/UIInput'

export default class VideoPlane {
    experience: Experience
    scene: THREE.Scene
    dropzone: Dropzone
    plane: THREE.Mesh
    texture: THREE.Texture
    video: HTMLVideoElement
    ui: UICanvas
    controls: UIInput
    element: Element
    fileInput: HTMLInputElement

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.video = document.createElement('video')
        this.ui = new UICanvas()
        this.controls = new UIInput()

        this.texture = new THREE.VideoTexture(this.video)
        this.texture.minFilter = THREE.LinearFilter
        this.texture.magFilter = THREE.LinearFilter
        this.texture.format = THREE.RGBAFormat

        this.texture.needsUpdate = true

        const geometry = new THREE.PlaneBufferGeometry(4, 3)
        const material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
        })

        this.texture.needsUpdate = true
        const plane = new THREE.Mesh(geometry, material)

        plane.scale.setScalar(0.05)
        plane.position.y = 0
        plane.position.z = -0.11

        this.plane = plane

        this.experience.camera.instance.add(plane)

        this.element = this.ui.newElement('DROP A VIDEO', {
            align: 'center',
            x: 160,
            y: 100,
            size: 32,
        })
        this.fileInput = document.createElement('input')
        this.fileInput.type = 'file'
        this.fileInput.accept = 'video/*'

        this.controls.on('enter', this.clickHandler.bind(this))
        this.controls.on('click', this.clickHandler.bind(this))

        this.experience.canvas.addEventListener(
            'click',
            this.clickHandler.bind(this)
        )

        this.fileInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement
            const file = target?.files?.[0] as File
            this.handleFile(file)
        })

        this.dropzone = new Dropzone(
            this.experience.canvas,
            this.handleFile.bind(this)
        )

        this.scene.add(this.plane)
    }
    handleFile(file: File) {
        // if file type is video

        if (file.type.indexOf('video') !== -1) {
            this.video.src = URL.createObjectURL(file)
            this.video.load() // must call after setting/changing source
            this.video.play()
            this.video.loop = true

            this.texture.needsUpdate = true
            this.element.text = ''
        }
    }
    clickHandler() {
        if (this.video.src) {
            this.video.play()
        } else {
            this.fileInput.click()
        }
    }
}
