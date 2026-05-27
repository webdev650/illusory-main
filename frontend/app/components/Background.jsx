'use client'
import { FC } from 'react';  // Replace VFC with FC
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { cnoise21 } from '../../modules/glsl/noise';

export const Background = () => {  // Use FC here instead of VFC
  const shader = {
    uniforms: {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2() }
    },
    vertexShader,
    fragmentShader
  }

  const target = new THREE.Vector2()
  useFrame(({ mouse }) => {
    shader.uniforms.u_time.value += 0.005
    target.set((mouse.x + 1) * 0.5, (mouse.y + 1) * 0.5)
    shader.uniforms.u_mouse.value.lerp(target, 0.02)
  })

  console.log('Background Shader Initialized');
  return (
    <Plane args={[2, 2]}>
      <shaderMaterial args={[shader]} />
    </Plane>
  )
}

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv; 
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform float u_time;
uniform vec2 u_mouse;
varying vec2 v_uv;

${cnoise21}

float random(vec2 p) {
  vec2 k1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
  return fract(
    cos(dot(p, k1)) * 12345.6789
  );
}

const vec3 black = vec3(0.0);
const vec3 color1 = vec3(1.0, 0.0, 0.866);
const vec3 color2 = vec3(0.0, 1.0, 0.984);
const vec3 color3 = vec3(0.016, 0.0, 1.0);

void main() {
  vec2 seed = vec2(v_uv.x - 0.65, v_uv.y - 0.5) * 1.1 * (u_mouse + 0.3 * (length(u_mouse) + 0.5));
  float n = cnoise21(seed) + length(u_mouse) * 0.9;

  float ml = pow(length(u_mouse), 2.5) * 0.15;
  float n1 = smoothstep(0.0, 0.0 + 0.2, n);
  vec3 color = mix(black, color1, n1);

  float n2 = smoothstep(0.1 + ml, 0.1 + ml + 0.2, n);
  color = mix(color, color2, n2);

  float n3 = smoothstep(0.2 + ml, 0.2 + ml + 0.4, n);
  color = mix(color, color3, n3);

  float n4 = smoothstep(0.3 + ml, 0.3 + ml + 0.4, n);
  color = mix(color, black, n4);

  vec2 uvrandom = v_uv;
  uvrandom.y *= random(vec2(uvrandom.y, 0.4));
  color.rgb += random(uvrandom) * 0.05;

  gl_FragColor = vec4(color, 1.0);
}
`
