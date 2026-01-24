import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroBackgroundProps {
  /** Beam intensity (0-1), default 0.08 */
  intensity?: number;
  /** Animation speed multiplier, default 1.0 */
  speed?: number;
  /** Beam color (RGB), default [143, 174, 255] */
  color?: [number, number, number];
  /** Enable reduced motion mode */
  reducedMotion?: boolean;
}

/**
 * Full-screen animated hero background with volumetric light beams.
 * Uses WebGL fragment shaders for performant, cinematic god rays effect.
 */
export const HeroBackground = ({
  intensity = 0.08,
  speed = 1.0,
  color = [143, 174, 255],
  reducedMotion = false,
}: HeroBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId: number | null;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationId: number | null = null;

    // Get container dimensions
    const getSize = () => {
      const rect = container.getBoundingClientRect();
      // Fallback to window size if container is too small (can happen on initial render)
      const width = rect.width > 0 ? rect.width : window.innerWidth;
      const height = rect.height > 0 ? rect.height : window.innerHeight;
      return { width, height };
    };

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    
    const initialSize = getSize();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialSize.width, initialSize.height);
    
    // Style the canvas
    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    
    container.appendChild(canvas);

    // Vertex shader - simple fullscreen quad
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Fragment shader - volumetric light beams with FBM noise
    const fragmentShader = `
      precision highp float;
      
      uniform float uTime;
      uniform float uIntensity;
      uniform float uSpeed;
      uniform vec3 uColor;
      uniform vec2 uResolution;
      uniform bool uReducedMotion;
      
      // Hash function for noise
      vec3 hash3(vec3 p) {
        p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                 dot(p, vec3(269.5, 183.3, 246.1)),
                 dot(p, vec3(113.5, 271.9, 124.6)));
        return fract(sin(p) * 43758.5453123);
      }
      
      // 3D noise
      float noise3d(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = i.x + i.y * 57.0 + 113.0 * i.z;
        return mix(
          mix(
            mix(dot(hash3(vec3(n + 0.0)), f - vec3(0.0, 0.0, 0.0)),
                dot(hash3(vec3(n + 1.0)), f - vec3(1.0, 0.0, 0.0)), f.x),
            mix(dot(hash3(vec3(n + 57.0)), f - vec3(0.0, 1.0, 0.0)),
                dot(hash3(vec3(n + 58.0)), f - vec3(1.0, 1.0, 0.0)), f.x), f.y),
          mix(
            mix(dot(hash3(vec3(n + 113.0)), f - vec3(0.0, 0.0, 1.0)),
                dot(hash3(vec3(n + 114.0)), f - vec3(1.0, 0.0, 1.0)), f.x),
            mix(dot(hash3(vec3(n + 170.0)), f - vec3(0.0, 1.0, 1.0)),
                dot(hash3(vec3(n + 171.0)), f - vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
      }
      
      // Fractal Brownian Motion (FBM) - layered noise
      float fbm(vec3 p, int octaves) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          if (i >= octaves) break;
          value += amplitude * noise3d(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        
        // Rotate UV space slightly for diagonal beams
        float angle = 0.15; // ~8.6 degrees
        float cosA = cos(angle);
        float sinA = sin(angle);
        vec2 rotatedUV = vec2(
          uv.x * cosA - uv.y * sinA,
          uv.x * sinA + uv.y * cosA
        );
        
        // Time with speed control and reduced motion support
        float time = uReducedMotion ? uTime * 0.1 : uTime * uSpeed;
        
        // Stretch vertically and add slow vertical drift (increased speed for visible motion)
        // Make time movement much more pronounced for testing
        vec3 p = vec3(rotatedUV.x * 2.0, rotatedUV.y * 8.0 + time * 0.3, time * 0.15);
        
        // Create multiple beam layers with independent movement (more noticeable drift)
        float beam1 = fbm(p, 3);
        float beam2 = fbm(p * vec3(1.2, 1.0, 1.0) + vec3(0.0, time * 0.25, 0.0), 3);
        float beam3 = fbm(p * vec3(0.8, 1.0, 1.0) + vec3(0.0, time * 0.2, 0.0), 2);
        
        // Combine beams with soft falloff
        float combined = (beam1 * 0.5 + beam2 * 0.3 + beam3 * 0.2);
        
        // Remap combined to enhance visibility (bring out the beam structure)
        // Use a higher power to make beams more distinct
        combined = pow(combined, 0.5);
        
        // Create vertical gradient for beam shape (stronger in center, fade at edges)
        // Use a wider falloff for more visible beams
        float verticalGradient = 1.0 - abs(rotatedUV.x - 0.5) * 1.2;
        verticalGradient = smoothstep(0.0, 1.0, max(0.0, verticalGradient));
        
        // Apply gradient and intensity with better scaling for white background
        float finalBeam = combined * verticalGradient * uIntensity * 3.0;
        
        // Add subtle horizontal variation for organic feel (with time for movement)
        float horizontalNoise = noise3d(vec3(uv.x * 4.0, time * 0.15, 0.0)) * 0.15;
        finalBeam += horizontalNoise * uIntensity * 0.5;
        
        // Ensure minimum visibility
        finalBeam = max(finalBeam, 0.0);
        
        // Apply color - for white background, use slightly darker/more saturated colors
        vec3 beamColor = uColor / 255.0;
        // Increase saturation slightly for visibility on white
        beamColor = mix(vec3(1.0), beamColor, 1.2);
        beamColor = clamp(beamColor, 0.0, 1.0);
        vec4 color = vec4(beamColor, finalBeam);
        
        // Normal blending for visibility on white background
        gl_FragColor = color;
      }
    `;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity },
        uSpeed: { value: reducedMotion ? 0.1 : speed },
        uColor: { value: new THREE.Vector3(...color) },
        uResolution: { value: new THREE.Vector2(initialSize.width, initialSize.height) },
        uReducedMotion: { value: reducedMotion },
      },
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Animation loop - use continuous absolute time that never resets
    const animate = (timestamp: number) => {
      // Use the timestamp directly (in milliseconds), convert to seconds
      // This ensures continuous, non-wrapping time
      const elapsed = timestamp * 0.001;
      
      // Update time uniform - directly access to ensure it updates
      material.uniforms.uTime.value = elapsed;
      
      // Render the scene
      renderer.render(scene, camera);
      
      // Continue animation
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation immediately
    animationId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      const size = getSize();
      renderer.setSize(size.width, size.height);
      if (material.uniforms) {
        material.uniforms.uResolution.value.set(size.width, size.height);
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver for more accurate container sizing
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Store refs for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      material,
      animationId,
    };

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, [intensity, speed, color, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 min-h-screen"
      style={{ 
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};

