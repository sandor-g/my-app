import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PreviewPane from './components/PreviewPane';
import TemplateModal from './components/TemplateModal';
import type { AppState, Template, SlideContent } from './types';
import { generateOptimalColorMapping } from './utils/colorUtils';

const defaultState: AppState = {
  brand: {
    primary: '#232323',
    secondary: '#71717A',
    accent: '#3B82F6',
    fontFamily: 'Inter',
    fontWeight: '400',
    colorMapping: {
      bg: '#FFFFFF',
      text: '#232323',
      accent: '#3B82F6',
      shape: '#3B82F6'
    }
  },
  project: {
    format: 'single',
    templateId: null,
    aspect: '1:1',
    slideCount: 1,
    slides: [],
    slideContents: [],
    tokenMap: {}
  },
  export: {
    format: 'single',
    size: '1080x1080',
    quality: 'high'
  }
};

function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('admaker-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure colorMapping exists and is valid
      if (!parsed.brand.colorMapping) {
        parsed.brand.colorMapping = generateOptimalColorMapping(
          parsed.brand.primary,
          parsed.brand.secondary,
          parsed.brand.accent
        );
      }
      return parsed;
    }
    return defaultState;
  });
  
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    // Load templates
    fetch('/templates.json')
      .then(res => res.json())
      .then(setTemplates)
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Persist state to localStorage
    localStorage.setItem('admaker-state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const selectTemplate = (template: Template) => {
    // Initialize slides with visibility and content
    const initializedSlides = template.slides.map(slide => ({
      ...slide,
      visible: true,
      content: getDefaultContent(slide.type)
    }));

    // Initialize slide contents - create one content object per slide
    const slideContents: SlideContent[] = initializedSlides.map(slide => {
      const baseContent = {
        headline: 'Your Headline Here',
        subheadline: 'Supporting text goes here',
        body: 'Body content for your ad',
        bullets: '• Point 1\n• Point 2\n• Point 3',
        cta: 'Call to Action',
        footer: 'Additional information'
      };

      // Customize content based on slide type
      switch (slide.type) {
        case 'headline':
          return { ...baseContent, headline: 'Your Headline Here' };
        case 'subheadline':
          return { ...baseContent, subheadline: 'Supporting text goes here' };
        case 'body':
          return { ...baseContent, body: 'Body content for your ad' };
        case 'bullets':
          return { ...baseContent, bullets: '• Point 1\n• Point 2\n• Point 3' };
        case 'cta':
          return { ...baseContent, cta: 'Call to Action' };
        case 'footer':
          return { ...baseContent, footer: 'Additional information' };
        case 'shape':
          return baseContent; // Shapes don't have text content
        case 'progress':
          return baseContent; // Progress bars don't have text content
        default:
          return baseContent;
      }
    });

    updateState({
      project: {
        ...state.project,
        templateId: template.id,
        slideCount: template.defaultSlideCount,
        slides: initializedSlides,
        slideContents
      }
    });
    setShowTemplateModal(false);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'headline': return 'Your Headline Here';
      case 'subheadline': return 'Supporting text goes here';
      case 'body': return 'Body content for your ad';
      case 'cta': return 'Call to Action';
      case 'bullets': return '• Point 1\n• Point 2\n• Point 3';
      default: return '';
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar 
        state={state} 
        onUpdate={updateState}
        onTemplateSelect={() => setShowTemplateModal(true)}
      />
      <PreviewPane state={state} />
      
      {showTemplateModal && (
        <TemplateModal
          templates={templates}
          onSelect={selectTemplate}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  );
}

export default App;
