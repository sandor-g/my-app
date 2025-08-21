export interface Brand {
  primary: string;
  secondary: string;
  accent: string;
  fontFamily: string;
  fontWeight: string;
  colorMapping: ColorMapping;
}

export interface ColorMapping {
  bg: string;
  text: string;
  accent: string;
  shape: string;
}

export interface SlideElement {
  type: 'headline' | 'subheadline' | 'body' | 'bullets' | 'cta' | 'footer' | 'shape' | 'progress';
  rect: { x: number; y: number; w: number; h: number };
  style: { 
    tokenBinding: string; 
    align: string; 
    padding: number; 
    radius: number;
  };
  textDefaults?: {
    fontSize: number;
    fontWeight: number;
    fontStyle?: string;
  };
  locked: boolean;
  toggleKey: string;
  content?: string;
  visible: boolean;
}

export interface SlideContent {
  headline: string;
  subheadline: string;
  body: string;
  bullets: string;
  cta: string;
  footer: string;
}

export interface Project {
  format: 'single' | 'carousel';
  templateId: string | null;
  aspect: string;
  slideCount: number;
  slides: SlideElement[];
  slideContents: SlideContent[];
  tokenMap: Record<string, any>;
}

export interface Export {
  format: 'single' | 'carousel';
  size: string;
  quality: string;
}

export interface AppState {
  brand: Brand;
  project: Project;
  export: Export;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  defaultSlideCount: number;
  supportedAspects: string[];
  tokens: string[];
  slides: SlideElement[];
}

export interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
}

export interface ContrastWarning {
  elementId: string;
  currentContrast: number;
  requiredContrast: number;
  suggestion: string;
}
