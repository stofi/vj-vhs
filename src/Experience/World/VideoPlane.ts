import * as THREE from 'three'
import Dropzone from '../Dropzone'
import Experience from '../Experience'
import UICanvas from '../UI/UICanvas'

export default class VideoPlane {
    experience: Experience
    scene: THREE.Scene
    dropzone: Dropzone
    plane: THREE.Mesh
    texture: THREE.Texture
    video: HTMLVideoElement
    ui: UICanvas

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.video = document.createElement('video')
        this.ui = new UICanvas()

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

        const element = this.ui.newElement('DROP A VIDEO', {
            align: 'center',
            x: 160,
            y: 100,
            size: 32,
        })

        this.dropzone = new Dropzone(this.experience.canvas, (file: File) => {
            // if file type is video
            if (file.type.indexOf('video') !== -1) {
                this.video.src = URL.createObjectURL(file)
                this.video.load() // must call after setting/changing source
                this.video.play()
                this.video.loop = true

                this.texture.needsUpdate = true
                element.text = ''
            }
        })

        this.scene.add(this.plane)
    }
}
