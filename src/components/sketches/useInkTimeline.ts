import { useLayoutEffect, useRef } from 'react';

export const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const EASE_IN = 'cubic-bezier(0.55, 0, 1, 0.45)';
export const POP = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/** [seconds into the loop, value, easing of the segment that starts here] */
export type Key = [number, string | number, string?];

/** One CSS property animated on every element matching `sel` inside the sketch. */
export interface Track {
  sel: string;
  prop: 'opacity' | 'transform' | 'strokeDashoffset';
  keys: Key[];
  ease?: string;
}

const toKeyframes = ({ prop, keys, ease = EASE }: Track, loop: number): Keyframe[] => {
  const held: Key[] = [...keys];
  if (held[0][0] > 0) held.unshift([0, held[0][1]]);
  if (held[held.length - 1][0] < loop) held.push([loop, held[held.length - 1][1]]);
  return held.map(([t, value, easing]) => ({ offset: t / loop, [prop]: value, easing: easing ?? ease }));
};

/**
 * Plays a sketch's tracks as one looping sequence while the sketch is on
 * screen, and pauses it offscreen. The SVG markup is the final frame, so
 * with reduced motion (or no Web Animations) nothing runs and the finished
 * state shows.
 */
export const useInkTimeline = (loop: number, tracks: Track[]) => {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg || typeof svg.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animations = tracks.flatMap((track) => {
      const keyframes = toKeyframes(track, loop);
      return Array.from(svg.querySelectorAll(track.sel)).map((el) =>
        el.animate(keyframes, { duration: loop * 1000, iterations: Infinity }),
      );
    });
    animations.forEach((a) => a.pause());

    const observer = new IntersectionObserver(
      ([entry]) => animations.forEach((a) => (entry.isIntersecting ? a.play() : a.pause())),
      { threshold: 0.3 },
    );
    observer.observe(svg);

    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
    };
  }, [loop, tracks]);

  return ref;
};
