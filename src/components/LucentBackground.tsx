import { useEffect, useRef } from 'react';

const vertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uIntensity;
  uniform float uSpeed;
  uniform vec3 uBeamColor;
  uniform bool uReducedMotion;

  varying vec2 vUv;

  // Simple hash for pseudo-random
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractal noise
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for(int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  // Create distinct vertical curtains of light
  float godRays(vec2 uv, float time) {
    float rays = 0.0;

    // Create vertical bands using noise
    // The key is extreme vertical stretching and using the noise to modulate width

    // Layer 1: Wide primary curtains (very stretched vertically)
    float x1 = uv.x * 2.5 - time * 0.02;
    float y1 = uv.y * 0.15; // Extreme vertical stretch
    float band1 = fbm(vec2(x1, y1));
    // Sharpen the curtains with power function
    band1 = pow(band1, 3.0);
    rays += band1 * 0.7;

    // Layer 2: Secondary curtains (offset and different scale)
    float x2 = uv.x * 3.5 - time * 0.025;
    float y2 = uv.y * 0.2;
    float band2 = fbm(vec2(x2 + 50.0, y2));
    band2 = pow(band2, 3.5);
    rays += band2 * 0.5;

    // Layer 3: Thin accent curtains
    float x3 = uv.x * 5.0 - time * 0.03;
    float y3 = uv.y * 0.25;
    float band3 = fbm(vec2(x3 + 100.0, y3));
    band3 = pow(band3, 4.0);
    rays += band3 * 0.3;

    // Add subtle dust inside the beams
    float dust = fbm(vec2(uv.x * 8.0 - time * 0.035, uv.y * 1.5));
    rays += dust * 0.05;

    return rays;
  }

  void main() {
    vec2 uv = vUv;

    // Center and aspect-correct UVs
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centeredUv = (uv - 0.5) * aspect * 2.0;

    float time = uReducedMotion ? 0.0 : uTime * uSpeed;

    // Generate god rays
    float beams = godRays(centeredUv, time);

    // Soft vertical gradient (brighter in center, darker at top/bottom)
    float verticalGradient = 1.0 - abs(centeredUv.y * 0.4);
    verticalGradient = smoothstep(0.0, 1.0, verticalGradient);

    // Horizontal vignette (darker at sides)
    float horizontalVignette = 1.0 - abs(centeredUv.x * 0.3);
    horizontalVignette = smoothstep(0.2, 1.0, horizontalVignette);

    // Combine gradients
    float vignette = verticalGradient * horizontalVignette;

    // Apply vignette to beams
    beams *= vignette;

    // Clamp to avoid oversaturation
    beams = clamp(beams, 0.0, 1.0);

    // Dark blue-tinted background (matching reference)
    vec3 bgColor = vec3(0.01, 0.02, 0.04);

    // Apply beam color with intensity
    vec3 color = bgColor + uBeamColor * beams * uIntensity;

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface LucenceBackgroundProps {
  intensity?: number;
  speed?: number;
  beamColor?: [number, number, number];
}

export default function LucenceBackground({
  intensity = 0.65,
  speed = 3.5,
  beamColor = [0.3, 0.6, 1.0],
}: LucenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vShader = compileShader(gl.VERTEX_SHADER, vertexShader);
    const fShader = compileShader(gl.FRAGMENT_SHADER, fragmentShader);

    if (!vShader || !fShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const uniforms = {
      uTime: gl.getUniformLocation(program, 'uTime'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uIntensity: gl.getUniformLocation(program, 'uIntensity'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
      uBeamColor: gl.getUniformLocation(program, 'uBeamColor'),
      uReducedMotion: gl.getUniformLocation(program, 'uReducedMotion'),
    };

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

    const uvLocation = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    // Force animation regardless of reduced motion preference
    const prefersReducedMotion = false;

    const resize = () => {
      if (!canvas || !gl) return;

      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!gl) return;

      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      gl.uniform1f(uniforms.uTime, currentTime);
      gl.uniform1f(uniforms.uIntensity, intensity);
      gl.uniform1f(uniforms.uSpeed, speed);
      gl.uniform3f(uniforms.uBeamColor, beamColor[0], beamColor[1], beamColor[2]);
      gl.uniform1i(uniforms.uReducedMotion, prefersReducedMotion ? 1 : 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (program) gl.deleteProgram(program);
    };
  }, [intensity, speed, beamColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
