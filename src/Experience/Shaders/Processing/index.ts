import fragment from './fragment.glsl'
import vertex from './vertex.glsl'

const FX = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        brightness: { value: 0.5 },
        contrast: { value: 1.0 },
        saturation: { value: 0.01 },
        hue: { value: 0 },
        seekDisortionAmount: { value: 0.05 },
        seekDisortionSpeed: { value: 0.1 },
        userBrightness: { value: 0.5 },
    },

    fragment,
    vertex,
}

export default FX
