export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBaseSize;
  uniform float uScale;
  uniform float uMaxSize;

  attribute float aPhase;
  attribute float aSize;

  void main() {
    vec3 pos = position;
    float drift = sin(uTime + aPhase) * 0.02;
    pos.x += drift;
    pos.z += cos(uTime + aPhase * 0.7) * 0.02;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float size = uBaseSize * (uScale / -mvPosition.z) * aSize;
    gl_PointSize = min(size, uMaxSize);
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.0, 0.5, d);
    vec3 color = uColor * 1.15;
    gl_FragColor = vec4(color, 0.9 * a * uOpacity);
  }
`
