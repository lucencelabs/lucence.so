// The hero's 4x4 Bayer matrix, row-major, so accent fills dither the same way the clouds do.
export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export type Point = [number, number];

// Evenly spaced points along a cubic Bezier, for dot trails that read as dither rather than a dashed stroke.
export const dotsAlong = (p0: Point, p1: Point, p2: Point, p3: Point, count: number): Point[] => {
  const at = (t: number): Point => {
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
  };
  const samples = Array.from({ length: 201 }, (_, i) => at(i / 200));
  const lengths = [0];
  for (let i = 1; i < samples.length; i++) {
    const [x0, y0] = samples[i - 1];
    const [x1, y1] = samples[i];
    lengths.push(lengths[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  const total = lengths[lengths.length - 1];
  return Array.from({ length: count }, (_, k) => {
    const target = (total * k) / (count - 1);
    const i = lengths.findIndex((l) => l >= target);
    return samples[Math.max(i, 0)];
  });
};
