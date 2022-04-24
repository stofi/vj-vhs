import fragment from './fragment.glsl'
import vertex from './vertex.glsl'

const FX = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        noiseAmount: { value: 0.04 },
        noiseScale: { value: 0.5 },
        noiseSpeed: { value: 0.5 },
        userNoiseAmount: { value: 0.5 },
    },

    fragment,
    vertex,
}

export default FX
