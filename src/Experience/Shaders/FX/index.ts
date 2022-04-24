import fragment from './fragment.glsl'
import vertex from './vertex.glsl'

const FX = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uAmount: { value: 1.0 },
        userFlickerAmount: { value: 0.5 },
    },

    fragment,
    vertex,
}

export default FX
