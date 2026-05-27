import { DENSITY_MAPS } from '../types';

export const getAsciiChar = (brightness: number, densityType: keyof typeof DENSITY_MAPS): string => {
  const map = DENSITY_MAPS[densityType];
  // Ensure we don't go out of bounds
  let index = Math.floor((brightness / 255) * (map.length - 1));
  index = Math.max(0, Math.min(map.length - 1, index));
  return map[index];
};
