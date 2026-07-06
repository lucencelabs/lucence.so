import { useEffect, useRef } from 'react';

/**
 * Ordered (Bayer-matrix) dithered halftone background.
 *
 * Concept: "Lucence" = light breaking through noise. The dot field is dense
 * and dark toward the edges/corners, and thins out into sparse, pale,
 * near-white-blue dots toward a focal point near the wordmark — clarity
 * emerging from complexity, rendered as an engineered grid of square dots
 * (classic dot-matrix / cross-stitch halftone), not a smooth gradient and
 * not random film grain.
 */

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
  uniform float uCellSize;
  uniform vec2 uFocal;
  uniform vec3 uDenseColor;
  uniform vec3 uSparseColor;
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

  // Fractal noise - used to warp the light field so the clearing reads as
  // organic (light breaking through noise), not a perfect drawn circle.
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  // Classic 4x4 Bayer ordered-dither matrix, returned as 0..15.
  float bayer4x4(vec2 cell) {
    int x = int(mod(cell.x, 4.0));
    int y = int(mod(cell.y, 4.0));
    int index = x + y * 4;

    if (index == 0) return 0.0;
    if (index == 1) return 8.0;
    if (index == 2) return 2.0;
    if (index == 3) return 10.0;
    if (index == 4) return 12.0;
    if (index == 5) return 4.0;
    if (index == 6) return 14.0;
    if (index == 7) return 6.0;
    if (index == 8) return 3.0;
    if (index == 9) return 11.0;
    if (index == 10) return 1.0;
    if (index == 11) return 9.0;
    if (index == 12) return 15.0;
    if (index == 13) return 7.0;
    if (index == 14) return 13.0;
    return 5.0;
  }

  // Number of ray lobes fanning out of the focal point.
  const float RAYS = 30.0;

  void main() {
    vec2 fragCoord = vUv * uResolution;

    // Snap to a grid of square cells - this is what keeps the effect
    // "engineered" and grid-aligned rather than grungy.
    vec2 cellCoord = floor(fragCoord / uCellSize);
    vec2 localPos = fract(fragCoord / uCellSize);
    vec2 cellCenterPx = (cellCoord + 0.5) * uCellSize;
    vec2 uv = cellCenterPx / uResolution;

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 dir = (uv - uFocal) * aspect;
    float dist = length(dir);
    float angle = atan(dir.y, dir.x);

    float time = uReducedMotion ? 0.0 : uTime;
    float drift = time * 0.02;

    // Slow breathing of the clearing radius - subtle, not the aggressive
    // moving "god rays" this used to be.
    float breathe = uReducedMotion ? 0.0 : sin(time * 0.12) * 0.02;

    // --- Radial envelope -----------------------------------------------
    // 0 = untouched page background right around the focal point (true
    // negative space), 1 = fully dense dot fabric out toward the edges.
    // The transition is deliberately long/gradual so density never
    // saturates a short distance from the source.
    float innerClean = 0.14 + breathe;
    float outerFull = 0.88;
    float t = smoothstep(innerClean, outerFull, dist);

    // --- Directional sunburst -------------------------------------------
    // Warp the ray angle with noise so the streaks read as organic light
    // rays, not a mechanically perfect pinwheel.
    float jitter = fbm(vec2(cos(angle), sin(angle)) * 2.2 + drift) - 0.5;
    float rayAngle = angle * RAYS + jitter * 1.4;
    float sinVal = 0.5 + 0.5 * sin(rayAngle);

    // Near the source the rays are thin and separated by wide gaps of
    // clean background; the duty cycle widens with distance until the
    // individual rays merge into one continuous dense field further out.
    // thresh slides from ~0.94 (only the sharpest ray peaks pass, thin
    // separated streaks) down to 0 (almost the full angular range passes,
    // i.e. rays have merged into one continuous fabric) - using a fixed
    // edge width keeps each ray's own edge crisp at every radius instead
    // of smearing the whole transition band wide open.
    float duty = mix(0.05, 0.94, smoothstep(0.0, 0.85, t));
    float thresh = 1.0 - duty;
    float edge = 0.1;
    float rayMask = smoothstep(thresh - edge, thresh + edge, sinVal);

    float density = t * rayMask;

    // Fine, high-frequency fbm texture so the dense fabric reads as an
    // even halftone grain rather than a flat mid-tone or - if too strong -
    // a blotchy camouflage pattern.
    float n = fbm(cellCoord * 0.18 + vec2(drift, -drift * 0.6));
    float n2 = fbm(cellCoord * 0.4 - vec2(drift * 0.5, drift));
    density = clamp(density + (n - 0.5) * 0.1 + (n2 - 0.5) * 0.05, 0.0, 1.0);

    // Hard guarantee of true negative space directly around the focal
    // point, regardless of what the ray/noise terms produced.
    density *= smoothstep(innerClean * 0.5, innerClean, dist);

    // Ordered dithering: quantize the continuous field into discrete
    // levels using the Bayer threshold, exactly like a dot-matrix print
    // reducing a photo to a fixed number of tones.
    float levels = 9.0;
    float bayer = bayer4x4(cellCoord) / 16.0;
    float dithered = clamp(density + (bayer - 0.5) / levels, 0.0, 1.0);
    float quant = clamp(floor(dithered * levels) / (levels - 1.0), 0.0, 1.0);

    // Denser cells (far from the focal point) render a bigger square dot;
    // cells near the source shrink to nothing. Capped below 1.0 so the
    // grid structure stays legible even at max density instead of
    // resolving to a solid fill.
    float dotSize = quant * 0.8;
    dotSize *= step(0.02, dotSize);

    vec2 fromCenter = abs(localPos - 0.5);
    float halfSize = dotSize * 0.5;
    float inDot = step(fromCenter.x, halfSize) * step(fromCenter.y, halfSize);

    // Dense cells are deep navy, sparse cells fade to near-white/cream -
    // matching direction of dotSize so distance-from-focal drives both
    // consistently.
    vec3 dotColor = mix(uSparseColor, uDenseColor, quant);

    gl_FragColor = vec4(dotColor, inDot);
  }
`;

interface LucenceBackgroundProps {
  /** CSS-pixel size of each dither cell before device-pixel-ratio scaling */
  cellSize?: number;
  /** Focal point in normalized (0-1) uv space, uv.y = 0 at bottom */
  focal?: [number, number];
  /** Dense/dark dot color, e.g. deep navy */
  denseColor?: [number, number, number];
  /** Sparse/light dot color, e.g. pale drowned-out blue */
  sparseColor?: [number, number, number];
}

export default function LucenceBackground({
  cellSize = 4,
  focal = [0.5, 0.56],
  denseColor = [0.04, 0.078, 0.176], // #0a1430 - deep saturated navy
  sparseColor = [0.98, 0.973, 0.953], // near-white cream, matches page bg
}: LucenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
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
      uCellSize: gl.getUniformLocation(program, 'uCellSize'),
      uFocal: gl.getUniformLocation(program, 'uFocal'),
      uDenseColor: gl.getUniformLocation(program, 'uDenseColor'),
      uSparseColor: gl.getUniformLocation(program, 'uSparseColor'),
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

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener?.('change', handleMotionChange);

    let dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      if (!canvas || !gl) return;

      dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uCellSize, cellSize * dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!gl) return;

      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      gl.uniform1f(uniforms.uTime, currentTime);
      gl.uniform2f(uniforms.uFocal, focal[0], focal[1]);
      gl.uniform3f(uniforms.uDenseColor, denseColor[0], denseColor[1], denseColor[2]);
      gl.uniform3f(uniforms.uSparseColor, sparseColor[0], sparseColor[1], sparseColor[2]);
      gl.uniform1i(uniforms.uReducedMotion, prefersReducedMotion ? 1 : 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      reducedMotionQuery.removeEventListener?.('change', handleMotionChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (program) gl.deleteProgram(program);
    };
  }, [cellSize, focal, denseColor, sparseColor]);

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
      aria-hidden="true"
    />
  );
}
