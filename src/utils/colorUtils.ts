// Color contrast utilities for WCAG compliance

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

export function isWCAGCompliant(contrast: number, level: 'AA' | 'AAA' = 'AA'): boolean {
  const thresholds = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };
  return contrast >= thresholds[level].normal;
}

export function getContrastWarning(contrast: number): string {
  if (contrast >= 7) return 'Excellent contrast';
  if (contrast >= 4.5) return 'Good contrast (AA compliant)';
  if (contrast >= 3) return 'Acceptable for large text only';
  return 'Poor contrast - may not meet accessibility standards';
}

export function generateOptimalColorMapping(
  primary: string,
  secondary: string,
  accent: string
): { bg: string; text: string; accent: string; shape: string } {
  // Test different combinations for best contrast
  const combinations = [
    { bg: primary, text: secondary, accent, shape: accent },
    { bg: secondary, text: primary, accent, shape: accent },
    { bg: '#FFFFFF', text: primary, accent, shape: accent },
    { bg: '#000000', text: secondary, accent, shape: accent },
    { bg: primary, text: '#FFFFFF', accent, shape: accent },
    { bg: secondary, text: '#FFFFFF', accent, shape: accent }
  ];

  let bestCombination = combinations[0];
  let bestScore = 0;

  combinations.forEach(combo => {
    const contrast = getContrastRatio(combo.bg, combo.text);
    const score = contrast + (getContrastRatio(combo.bg, combo.accent) * 0.5);
    
    if (score > bestScore) {
      bestScore = score;
      bestCombination = combo;
    }
  });

  return bestCombination;
}

export function getSwapSuggestion(
  currentMapping: { bg: string; text: string; accent: string; shape: string },
  primary: string,
  secondary: string,
  accent: string
): { bg: string; text: string; accent: string; shape: string } {
  // Try swapping bg and text for better contrast
  const currentContrast = getContrastRatio(currentMapping.bg, currentMapping.text);
  
  if (currentContrast < 4.5) {
    // Try swapping bg and text
    const swappedContrast = getContrastRatio(currentMapping.text, currentMapping.bg);
    if (swappedContrast > currentContrast) {
      return {
        bg: currentMapping.text,
        text: currentMapping.bg,
        accent: currentMapping.accent,
        shape: currentMapping.shape
      };
      }
    }
  
  // Try using white/black backgrounds with brand colors
  const whiteBgContrast = getContrastRatio('#FFFFFF', primary);
  const blackBgContrast = getContrastRatio('#000000', secondary);
  
  if (whiteBgContrast > currentContrast) {
    return {
      bg: '#FFFFFF',
      text: primary,
      accent,
      shape: accent
    };
  }
  
  if (blackBgContrast > currentContrast) {
    return {
      bg: '#000000',
      text: secondary,
      accent,
      shape: accent
    };
  }
  
  return currentMapping;
}
