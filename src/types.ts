export interface AsciiOptions {
  fontSize: number;
  brightness: number;
  contrast: number;
  density: 'complex' | 'simple';
  glitch: boolean;
  isDualColor: boolean;
  colorThreshold: number;
  subjectColor: string;
  bgColor: string;
}

export interface AnalysisResult {
  description: string;
  vibe: string;
  tags: string[];
}

export const DENSITY_MAPS = {
  complex: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  simple: " .:-=+*#%@"
};
