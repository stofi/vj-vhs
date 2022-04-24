import type Sizes from './Utils/Sizes'
import type Camera from './Camera'
import * as gui from 'lil-gui'

import * as THREE from 'three'

import Experience from './Experience'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js'

import FXShader from './Shaders/FX'
import NoiseShader from './Shaders/Noise'
import ProcessingShader from './Shaders/Processing'

class Renderer {
    experience: Experience
    canvas: HTMLCanvasElement
    sizes: Sizes
    scene: THREE.Scene
    camera: Camera
    instance!: THREE.WebGLRenderer
    effects!: EffectComposer
    renderPass!: RenderPass
    fxPass!: ShaderPass
    noisePass!: ShaderPass
    processingPass!: ShaderPass
    blendPass!: ShaderPass
    savePass!: SavePass
    outputPass!: ShaderPass
    target!: THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget
    targetClass!: any
    gui!: gui.GUI

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.gui = this.experience.gui.addFolder('Renderer')

        this.setInstance()
    }

    private setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        })

        this.targetClass = this.instance.capabilities.isWebGL2
            ? THREE.WebGLMultisampleRenderTarget
            : THREE.WebGLRenderTarget
        this.targetClass = THREE.WebGLRenderTarget

        this.target = new this.targetClass(4, 3, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        })

        this.effects = new EffectComposer(this.instance, this.target)
        this.resize()
        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.fxPass = new ShaderPass({
            uniforms: FXShader.uniforms,
            vertexShader: FXShader.vertex,
            fragmentShader: FXShader.fragment,
        })
        this.fxPass.enabled = true
        this.noisePass = new ShaderPass({
            uniforms: NoiseShader.uniforms,
            vertexShader: NoiseShader.vertex,
            fragmentShader: NoiseShader.fragment,
        })
        this.noisePass.enabled = true
        this.processingPass = new ShaderPass({
            uniforms: ProcessingShader.uniforms,
            vertexShader: ProcessingShader.vertex,
            fragmentShader: ProcessingShader.fragment,
        })
        this.processingPass.enabled = true

        // save pass
        this.savePass = new SavePass(
            new THREE.WebGLRenderTarget(320 / 1.5, 240 / 1.5)
        )

        // blend pass
        this.blendPass = new ShaderPass(BlendShader, 'tDiffuse1')
        this.blendPass.uniforms['tDiffuse2'].value =
            this.savePass.renderTarget.texture
        this.blendPass.uniforms['mixRatio'].value = 0.5

        // output pass
        this.outputPass = new ShaderPass(CopyShader)
        this.outputPass.renderToScreen = true

        this.effects.addPass(this.renderPass)
        this.effects.addPass(this.blendPass)
        this.effects.addPass(this.savePass)
        this.effects.addPass(this.outputPass)
        this.effects.addPass(this.noisePass)
        this.effects.addPass(this.fxPass)
        this.effects.addPass(this.processingPass)

        this.instance.setClearColor(0x000000, 0)
        // this.instance.shadowMap.enabled = true
        this.setGUI()
    }
    turnOffEffects() {
        this.fxPass.enabled = false
        this.noisePass.enabled = false
        this.processingPass.enabled = false
        this.blendPass.enabled = false
        this.savePass.enabled = false
        this.outputPass.enabled = false
    }
    turnOnEffects() {
        this.fxPass.enabled = true
        this.noisePass.enabled = true
        this.processingPass.enabled = true
        this.blendPass.enabled = true
        this.savePass.enabled = true
        this.outputPass.enabled = true
    }
    setGUI() {
        this.gui
            .add(
                this.processingPass.material.uniforms.brightness,
                'value',
                0,
                2
            )
            .name('Brightness')

        this.gui
            .add(this.processingPass.material.uniforms.contrast, 'value', 0, 10)
            .name('Contrast')
        this.gui
            .add(
                this.processingPass.material.uniforms.saturation,
                'value',
                0,
                1
            )
            .name('Saturation')
        this.gui
            .add(this.processingPass.material.uniforms.hue, 'value', 0, 1)
            .name('Hue')

        const noiseFolder = this.gui.addFolder('Noise')
        noiseFolder
            .add(this.noisePass.material.uniforms.noiseAmount, 'value', 0, 1)
            .name('Amount')

        noiseFolder

            .add(this.noisePass.material.uniforms.noiseScale, 'value', 0, 100)
            .name('Scale')

        noiseFolder
            .add(this.noisePass.material.uniforms.noiseSpeed, 'value', 0, 100)
            .name('Speed')

        // seekDisortionAmount
        // seekDisortionSpeed

        const rewindFolder = this.gui.addFolder('Rewind')
        rewindFolder
            .add(
                this.processingPass.material.uniforms.seekDisortionAmount,
                'value',
                0,
                1
            )
            .name('Amount')
        rewindFolder
            .add(
                this.processingPass.material.uniforms.seekDisortionSpeed,
                'value',
                0,
                1
            )
            .name('Speed')
    }

    resize() {
        this.instance.setPixelRatio(Math.min(1, 540 / this.sizes.width))
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.effects.setPixelRatio(this.sizes.pixelRatio)
        this.effects.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        this.effects.render()
        this.fxPass.material.uniforms.uTime.value =
            this.experience.time.elapsed / 1000
        this.noisePass.material.uniforms.uTime.value =
            this.experience.time.elapsed / 1000
        this.processingPass.material.uniforms.uTime.value =
            this.experience.time.elapsed / 1000
    }
}

export default Renderer
