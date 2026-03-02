// Seamless sun surface: samples the texture with horizontal blend at the UV seam
// so the left and right edges of the texture blend smoothly around the sphere.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uEmissiveIntensity;
  uniform vec3 uEmissiveTint;

  varying vec2 vUv;

  void main() {
    // Blend zone at left (u=0) and right (u=1) so the seam is smooth
    float blendWidth = 0.08;
    float blendLeft = 1.0 - smoothstep(0.0, blendWidth, vUv.x);
    float blendRight = smoothstep(1.0 - blendWidth, 1.0, vUv.x);

    vec4 texCenter = texture2D(uMap, vUv);
    vec4 texRight = texture2D(uMap, vUv + vec2(1.0, 0.0));  // when u~0, sample right edge
    vec4 texLeft = texture2D(uMap, vUv - vec2(1.0, 0.0));   // when u~1, sample left edge

    vec4 tex = texCenter;
    tex = mix(texRight, tex, blendLeft);   // near u=0: blend in the right edge of texture
    tex = mix(tex, texLeft, blendRight);   // near u=1: blend in the left edge of texture

    vec3 emissive = tex.rgb * uEmissiveTint * uEmissiveIntensity;
    gl_FragColor = vec4(emissive, 1.0);
  }
`
