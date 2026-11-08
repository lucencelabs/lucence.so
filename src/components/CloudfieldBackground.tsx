import { useEffect, useRef, type RefObject } from 'react';

/**
 * "cloudfield" hero background: soft cloud masses (domain-warped fbm plus a
 * few drifting metaballs) rendered through a crisp ordered-dither dot grid.
 *
 * Concept: "Lucence" = light breaking through noise. The clouds cover most
 * of the hero in navy halftone, and a clearing opens behind the hero copy
 * where the dots thin out to nothing and pale toward the light.
 *
 * Two passes keep it cheap: the cloud field is evaluated once per dither
 * cell into a small texture, then a full-resolution pass only does a
 * texture lookup, a Bayer threshold and the square-dot mask.
 */

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Pass 1: one fragment per dither cell. R = cloud density, G = light
// (proximity to the clearing), both 0..1.
const fieldShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uGrid;
  uniform float uCellPx;
  uniform vec2 uViewPx;
  uniform vec4 uClearing;
  uniform float uClearPad;
  uniform vec2 uFade;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

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

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      amplitude *= 0.5;
    }

    return value;
  }

  // Signed distance to a rounded box (CSS px).
  float roundedBox(vec2 p, vec2 center, vec2 halfSize, float radius) {
    vec2 d = abs(p - center) - halfSize + radius;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
  }

  void main() {
    // CSS-px position of this cell's center, y down to match the DOM rect.
    vec2 cell = floor(vUv * uGrid);
    vec2 px = (cell + 0.5) * uCellPx;
    px.y = uViewPx.y - px.y;

    float scale = 1.0 / max(min(uViewPx.x, uViewPx.y), 360.0);
    vec2 q = px * scale;
    float t = uTime * 0.025;

    // Domain-warped fbm gives the billowy cloud edges.
    vec2 warp = vec2(
      fbm(q * 2.2 + vec2(0.0, t)),
      fbm(q * 2.2 + vec2(5.2, 1.3) - t)
    );
    float billow = fbm(q * 2.6 + warp * 1.6 + vec2(t * 0.6, -t * 0.3));

    // Big drifting metaballs make the bold masses, so the clouds read as
    // shapes at a glance rather than uniform texture. They sit on a ring
    // around the viewport edge, so every aspect ratio gets full coverage
    // and the middle is left to the noise and the clearing.
    vec2 aspect = uViewPx / min(uViewPx.x, uViewPx.y);
    float meta = 0.0;
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      float a = fi * 0.785398 + 0.4 + (hash(vec2(fi, 3.1)) - 0.5) * 0.5;
      vec2 home = 0.5 + vec2(cos(a), sin(a)) * (0.5 + 0.12 * hash(vec2(fi, 7.7)));
      vec2 orbit = vec2(sin(t * 1.3 + fi * 2.1), cos(t * 1.1 + fi * 1.7)) * 0.05;
      vec2 c = (home + orbit) * aspect;
      float r = 0.2 + 0.14 * hash(vec2(fi, 1.9));
      vec2 d = q - c;
      meta += r * r / (dot(d, d) + 0.002);
    }
    meta = 1.0 - exp(-meta * 0.55);

    float cloud = smoothstep(0.42, 0.72, meta * 0.6 + billow * 0.8 - 0.1);

    // Interior shading so a big mass doesn't flatten into one solid tone.
    float shade = smoothstep(0.3, 0.7, fbm(q * 4.0 - warp * 1.2 + t * 0.4));
    float density = mix(0.1, 1.0, cloud) * mix(0.62, 1.0, shade);

    // The clearing: a rounded box around the hero copy whose edge is
    // eroded by the same cloud noise, so it reads as a break in the clouds.
    vec2 center = uClearing.xy + uClearing.zw * 0.5;
    vec2 halfSize = uClearing.zw * 0.5 + uClearPad;
    float sd = roundedBox(px, center, halfSize, uClearPad * 1.6);
    sd += (billow - 0.5) * uClearPad * 2.2;

    // A wide falloff so the dots thin out gradually into the clearing
    // rather than stopping at a blob edge.
    float falloff = uClearPad * 3.0;
    float clearMask = smoothstep(-uClearPad * 0.3, falloff, sd);
    density *= clearMask * clearMask;

    // Fade toward the section's top/bottom edges so the field dissolves
    // into the page instead of stopping at a hard line.
    float fadeTop = uFade.x > 0.0 ? pow(smoothstep(0.0, uFade.x * uViewPx.y, px.y), 2.0) : 1.0;
    float fadeBottom = uFade.y > 0.0 ? smoothstep(0.0, uFade.y * uViewPx.y, uViewPx.y - px.y) : 1.0;
    density *= fadeTop * fadeBottom;

    float light = 1.0 - smoothstep(0.0, falloff * 2.0, sd);

    gl_FragColor = vec4(density, light, 0.0, 1.0);
  }
`;

// Pass 2: full resolution. Ordered-dither the cell density and draw a
// square dot whose size and tone follow the quantized level.
const ditherShader = `
  precision highp float;

  uniform sampler2D uField;
  uniform vec2 uGrid;
  uniform float uCellSize;

  varying vec2 vUv;

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

  // Navy family only: pale blue -> slate blue -> #16305b.
  vec3 ramp(float x) {
    vec3 c0 = vec3(0.808, 0.851, 0.925); // #ced9ec
    vec3 c1 = vec3(0.596, 0.682, 0.827); // #98aed3
    vec3 c2 = vec3(0.302, 0.424, 0.643); // #4d6ca4
    vec3 c3 = vec3(0.086, 0.188, 0.357); // #16305b
    if (x < 0.33) return mix(c0, c1, x / 0.33);
    if (x < 0.66) return mix(c1, c2, (x - 0.33) / 0.33);
    return mix(c2, c3, (x - 0.66) / 0.34);
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 cell = floor(fragCoord / uCellSize);
    // Whole device pixels within the cell (uCellSize is an integer).
    vec2 local = floor(mod(fragCoord, uCellSize));

    vec4 field = texture2D(uField, (cell + 0.5) / uGrid);
    float density = field.r;
    float light = field.g;

    float levels = 9.0;
    float bayer = bayer4x4(cell) / 16.0;
    float dithered = clamp(density + (bayer - 0.5) / levels, 0.0, 1.0);
    float quant = clamp(floor(dithered * levels) / (levels - 1.0), 0.0, 1.0);

    // Dot edge snapped to whole device pixels, so every level renders as a
    // crisp square at 1x as well as 2x. Capped one pixel short of the cell
    // so the grid stays legible at max density, and centered so mixed dot
    // sizes don't drift into diagonal streaks.
    float dotPx = quant > 0.0
      ? clamp(floor(mix(0.3, 0.85, quant) * uCellSize + 0.5), 1.0, uCellSize - 1.0)
      : 0.0;
    float offset = floor((uCellSize - dotPx) * 0.5);
    vec2 inside = step(offset, local) * step(local, vec2(offset + dotPx - 0.5));
    float inDot = inside.x * inside.y;

    // Dots near the clearing pale out, as if lit from behind.
    float tone = pow(quant, 0.8) * (1.0 - light * 0.55);
    vec3 dotColor = ramp(tone);

    gl_FragColor = vec4(dotColor, inDot);
  }
`;

interface CloudfieldBackgroundProps {
  /** Element the clearing should open behind (the hero copy). */
  clearingRef?: RefObject<HTMLElement>;
  /** CSS-pixel size of each dither cell before device-pixel-ratio scaling */
  cellSize?: number;
  /** Fraction of the height over which the field fades out at the top */
  fadeTop?: number;
  /** Fraction of the height over which the field fades out at the bottom */
  fadeBottom?: number;
}

export default function CloudfieldBackground({
  clearingRef,
  cellSize = 4,
  fadeTop = 0,
  fadeBottom = 0,
}: CloudfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
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

    const linkProgram = (fragmentSource: string) => {
      const vShader = compileShader(gl.VERTEX_SHADER, vertexShader);
      const fShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vShader || !fShader) return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vShader);
      gl.attachShader(program, fShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program error:', gl.getProgramInfoLog(program));
        return null;
      }

      return program;
    };

    const fieldProgram = linkProgram(fieldShader);
    const ditherProgram = linkProgram(ditherShader);
    if (!fieldProgram || !ditherProgram) return;

    const fieldUniforms = {
      uTime: gl.getUniformLocation(fieldProgram, 'uTime'),
      uGrid: gl.getUniformLocation(fieldProgram, 'uGrid'),
      uCellPx: gl.getUniformLocation(fieldProgram, 'uCellPx'),
      uViewPx: gl.getUniformLocation(fieldProgram, 'uViewPx'),
      uClearing: gl.getUniformLocation(fieldProgram, 'uClearing'),
      uClearPad: gl.getUniformLocation(fieldProgram, 'uClearPad'),
      uFade: gl.getUniformLocation(fieldProgram, 'uFade'),
    };
    const ditherUniforms = {
      uField: gl.getUniformLocation(ditherProgram, 'uField'),
      uGrid: gl.getUniformLocation(ditherProgram, 'uGrid'),
      uCellSize: gl.getUniformLocation(ditherProgram, 'uCellSize'),
    };

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    for (const program of [fieldProgram, ditherProgram]) {
      const location = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    }

    const fieldTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fieldTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const framebuffer = gl.createFramebuffer();

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    let gridW = 1;
    let gridH = 1;
    let cssW = 1;
    let cssH = 1;
    let dpr = 1;
    let cellPx = cellSize;
    let clearing = [0, 0, 0, 0];
    let clearPad = 48;

    const measure = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      cssW = Math.max(canvas.clientWidth, 1);
      cssH = Math.max(canvas.clientHeight, 1);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      // Whole device pixels per cell, so dots stay crisp at any DPR.
      cellPx = Math.max(2, Math.round(cellSize * dpr));
      gridW = Math.ceil(canvas.width / cellPx);
      gridH = Math.ceil(canvas.height / cellPx);
      gl.bindTexture(gl.TEXTURE_2D, fieldTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gridW, gridH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fieldTexture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      // Union of the copy's text runs and links, which is tighter than the
      // block itself (the headline and subline end well short of
      // max-w-2xl).
      const target = clearingRef?.current;
      if (target) {
        const rects: DOMRect[] = [];
        const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        while (walker.nextNode()) {
          range.selectNodeContents(walker.currentNode);
          rects.push(range.getBoundingClientRect());
        }
        target.querySelectorAll('a, button').forEach((el) => rects.push(el.getBoundingClientRect()));
        const boxes = rects.filter((r) => r.width > 0 && r.height > 0);
        const host = canvas.getBoundingClientRect();
        const left = Math.min(...boxes.map((r) => r.left));
        const top = Math.min(...boxes.map((r) => r.top));
        const right = Math.max(...boxes.map((r) => r.right));
        const bottom = Math.max(...boxes.map((r) => r.bottom));
        clearing = [left - host.left, top - host.top, right - left, bottom - top];
      } else {
        clearing = [cssW * 0.1, cssH * 0.35, cssW * 0.45, cssH * 0.3];
      }
      clearPad = Math.min(60, Math.max(28, cssW * 0.045));
    };

    const startTime = performance.now();

    const draw = () => {
      const time = prefersReducedMotion ? 0 : (performance.now() - startTime) / 1000;

      gl.disable(gl.BLEND);
      gl.useProgram(fieldProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, gridW, gridH);
      gl.uniform1f(fieldUniforms.uTime, time);
      gl.uniform2f(fieldUniforms.uGrid, gridW, gridH);
      gl.uniform1f(fieldUniforms.uCellPx, cellPx / dpr);
      gl.uniform2f(fieldUniforms.uViewPx, cssW, cssH);
      gl.uniform4f(fieldUniforms.uClearing, clearing[0], clearing[1], clearing[2], clearing[3]);
      gl.uniform1f(fieldUniforms.uClearPad, clearPad);
      gl.uniform2f(fieldUniforms.uFade, fadeTop, fadeBottom);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(ditherProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fieldTexture);
      gl.uniform1i(ditherUniforms.uField, 0);
      gl.uniform2f(ditherUniforms.uGrid, gridW, gridH);
      gl.uniform1f(ditherUniforms.uCellSize, cellPx);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // The motion is slow, so ~30fps is plenty; skip frames while the hero
    // is off screen and stop the loop entirely under reduced motion.
    let frame: number | undefined;
    let visible = true;
    let lastDraw = 0;

    const loop = (now: number) => {
      frame = undefined;
      if (prefersReducedMotion || !visible) return;
      if (now - lastDraw >= 1000 / 30) {
        lastDraw = now;
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame === undefined && !prefersReducedMotion && visible) {
        frame = requestAnimationFrame(loop);
      }
    };

    const refresh = () => {
      measure();
      draw();
    };

    refresh();
    start();

    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(canvas);
    if (clearingRef?.current) resizeObserver.observe(clearingRef.current);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(canvas);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      draw();
      start();
    };
    reducedMotionQuery.addEventListener?.('change', handleMotionChange);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotionQuery.removeEventListener?.('change', handleMotionChange);
      if (frame !== undefined) cancelAnimationFrame(frame);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteTexture(fieldTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(fieldProgram);
      gl.deleteProgram(ditherProgram);
    };
  }, [clearingRef, cellSize, fadeTop, fadeBottom]);

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
