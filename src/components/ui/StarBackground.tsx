import { useMemo } from 'react';

interface Star {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  color: string;
}

interface StarBackgroundProps {
  starCount?: number;
}

/**
 * Static star background rendered as an SVG.
 * No animation, no mouse interaction - just a clean starfield backdrop.
 */
export const StarBackground = ({ starCount = 150 }: StarBackgroundProps) => {
  // Generate stars once on mount (deterministic based on count)
  const stars = useMemo((): Star[] => {
    // Use a seeded random for consistent star positions
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: starCount }, (_, i) => {
      const seed = i + 1;
      const rand1 = seededRandom(seed);
      const rand2 = seededRandom(seed * 2);
      const rand3 = seededRandom(seed * 3);
      const rand4 = seededRandom(seed * 4);

      // Position across viewport
      const cx = rand1 * 100;
      const cy = rand2 * 100;

      // Size: most stars small, few larger
      const r = rand3 < 0.85 ? 0.5 + rand3 * 1 : 1.5 + rand3 * 1;

      // Opacity: vary for depth
      const opacity = 0.3 + rand4 * 0.7;

      // Color: mostly white, some with slight tint
      let color = 'rgb(255, 255, 255)';
      if (rand4 > 0.85) {
        color = 'rgb(220, 235, 255)'; // pale blue-white
      } else if (rand4 > 0.75) {
        color = 'rgb(255, 250, 240)'; // warm white
      }

      return { cx, cy, r, opacity, color };
    });
  }, [starCount]);

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Dark background */}
      <rect width="100%" height="100%" fill="#030712" />

      {/* Static stars */}
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={`${star.cx}%`}
          cy={`${star.cy}%`}
          r={star.r}
          fill={star.color}
          opacity={star.opacity}
        />
      ))}
    </svg>
  );
};
