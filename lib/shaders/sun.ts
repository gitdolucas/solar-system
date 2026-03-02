// Shader for the sun's outer layer: animated arcs of plasma (prominences / coronal loops).
// Use on a sphere slightly larger than the sun, with transparent + additive blending.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader = /* glsl */ `
  uniform float uTime;

  varying vec2 vUv;

  // Arc visibility: fade in, hold, fade out over a cycle (phase 0..1)
  float arcPhase(float phase) {
    float inEnd = 0.15;
    float outStart = 0.75;
    float vis = 1.0;
    if (phase < inEnd) vis = phase / inEnd;
    else if (phase > outStart) vis = (1.0 - phase) / (1.0 - outStart);
    return vis;
  }

  // Distance from point (u,v) to a curved arc in UV: arc is v = base + amp * sin(freq*u + time)
  float distToArc(float u, float v, float base, float amp, float freq, float time) {
    float curve = base + amp * sin(freq * u + time);
    return abs(v - curve);
  }

  void main() {
    float u = vUv.x * 6.283185;
    float v = vUv.y * 3.14159;

    float speed = 0.4;
    float t = uTime * speed;

    // Several arcs with different phases so they come and go at different times
    float arc1 = arcPhase(fract(t));
    float arc2 = arcPhase(fract(t + 0.33));
    float arc3 = arcPhase(fract(t + 0.66));
    float arc4 = arcPhase(fract(t * 0.7 + 0.5));
    float arc5 = arcPhase(fract(t * 0.6 + 0.2));

    float thickness = 0.08;
    float d1 = distToArc(vUv.x, vUv.y, 0.35, 0.15, 4.0, uTime * 2.0);
    float d2 = distToArc(vUv.x, vUv.y, 0.65, 0.12, 5.0, uTime * 1.5 + 1.0);
    float d3 = distToArc(vUv.x, vUv.y, 0.5, 0.18, 3.0, uTime * 2.2 + 2.0);
    float d4 = distToArc(vUv.x, vUv.y, 0.2, 0.1, 6.0, uTime * 1.2 + 0.5);
    float d5 = distToArc(vUv.x, vUv.y, 0.8, 0.14, 4.5, uTime * 1.8 + 1.5);

    float bright = 0.0;
    bright += arc1 * exp(-(d1 * d1) / (thickness * thickness));
    bright += arc2 * exp(-(d2 * d2) / (thickness * thickness));
    bright += arc3 * exp(-(d3 * d3) / (thickness * thickness));
    bright += arc4 * exp(-(d4 * d4) / (thickness * thickness));
    bright += arc5 * exp(-(d5 * d5) / (thickness * thickness));

    // Plasma color: orange-yellow glow
    vec3 plasmaColor = vec3(1.0, 0.6, 0.15);
    vec3 color = plasmaColor * bright * 0.9;

    // Slight falloff toward the back (optional: use normal vs view)
    float alpha = min(0.85, bright * 0.95);
    gl_FragColor = vec4(color, alpha);
  }
`
