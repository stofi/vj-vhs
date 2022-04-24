import * as THREE from 'three'

import type Sizes from './Utils/Sizes'

import Experience from './Experience'

class Camera {
    experience: Experience
    sizes: Sizes
    scene: THREE.Scene
    canvas: HTMLCanvasElement
    instance!: THREE.PerspectiveCamera
    initialPosition = new THREE.Vector3(0, 0, 0)
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
    }

    private setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            70,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.initialPosition.set(0, 0, 0)
        this.scene.add(this.instance)
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
}

export default Camera
