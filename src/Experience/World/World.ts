import type Resources from '../Utils/Resources'

import * as THREE from 'three'
import Experience from '../Experience'
import UICanvas from '../UI/UICanvas'
import VideoPlane from './VideoPlane'

class World {
    experience: Experience
    scene: THREE.Scene
    resources: Resources
    uiTexture!: THREE.Texture
    ui?: UICanvas
    videoPlane?: VideoPlane

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.resources.on('ready', this.onReady.bind(this))
    }

    private onReady() {
        this.ui = new UICanvas()
        // add blue background
        this.videoPlane = new VideoPlane()
    }

    resize() {
        // noop
    }

    update() {
        this.ui?.update()
    }
}
export default World
