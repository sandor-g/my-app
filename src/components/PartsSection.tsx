import React from 'react';
import type { Project } from '../types';

interface PartsSectionProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onTemplateSelect: () => void;
}

interface ToggleItem {
  key: string;
  label: string;
  description: string;
  icon: string;
}

const PartsSection: React.FC<PartsSectionProps> = ({ project, onUpdate, onTemplateSelect }) => {
  const hasSlides = project.slides.length > 0;

  const updateProject = (updates: Partial<Project>) => {
    onUpdate({ ...project, ...updates });
  };

  const toggleElement = (toggleKey: string, visible: boolean) => {
    const updatedSlides = project.slides.map(slide => 
      slide.toggleKey === toggleKey 
        ? { ...slide, visible } 
        : slide
    );
    
    updateProject({ slides: updatedSlides });
  };

  const getToggleState = (toggleKey: string): boolean => {
    const slide = project.slides.find(s => s.toggleKey === toggleKey);
    return slide ? slide.visible : false;
  };

  const getAvailableToggles = (): ToggleItem[] => {
    if (!hasSlides) return [];
    
    const toggles: ToggleItem[] = [];
    const seenKeys = new Set<string>();
    
    project.slides.forEach(slide => {
      if (!seenKeys.has(slide.toggleKey)) {
        seenKeys.add(slide.toggleKey);
        toggles.push({
          key: slide.toggleKey,
          label: getToggleLabel(slide.toggleKey),
          description: getToggleDescription(slide.toggleKey),
          icon: getToggleIcon(slide.toggleKey)
        });
      }
    });
    
    return toggles;
  };

  const getToggleLabel = (toggleKey: string): string => {
    const labels: Record<string, string> = {
      headline: 'Headline',
      subheadline: 'Subheadline',
      body: 'Body Text',
      bullets: 'Bullet Points',
      cta: 'CTA Button',
      footer: 'Footer Note',
      shape: 'Decorative Shapes',
      progress: 'Progress Indicator',
      logo: 'Logo Placeholder'
    };
    return labels[toggleKey] || toggleKey;
  };

  const getToggleDescription = (toggleKey: string): string => {
    const descriptions: Record<string, string> = {
      headline: 'Main title text',
      subheadline: 'Supporting subtitle',
      body: 'Main content text',
      bullets: 'List of key points',
      cta: 'Call to action button',
      footer: 'Additional information',
      shape: 'Visual elements',
      progress: 'Step indicator',
      logo: 'Brand logo area'
    };
    return descriptions[toggleKey] || 'Template element';
  };

  const getToggleIcon = (toggleKey: string): string => {
    const icons: Record<string, string> = {
      headline: '📝',
      subheadline: '📄',
      body: '📖',
      bullets: '📋',
      cta: '🔘',
      footer: '📌',
      shape: '🔷',
      progress: '📊',
      logo: '🏷️'
    };
    return icons[toggleKey] || '⚙️';
  };

  if (!hasSlides) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">Parts</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🧩</div>
          <p>Select a template to configure parts</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-primary mb-4">Parts</h2>
      
      {/* Format and Settings */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Format</label>
          <select
            value={project.format}
            onChange={(e) => updateProject({ format: e.target.value as 'single' | 'carousel' })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="single">Single Image</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Aspect Ratio</label>
          <select
            value={project.aspect}
            onChange={(e) => updateProject({ aspect: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1:1">Square (1:1)</option>
            <option value="16:9">Landscape (16:9)</option>
            <option value="9:16">Portrait (9:16)</option>
            <option value="4:5">Instagram (4:5)</option>
          </select>
        </div>

        {project.format === 'carousel' && (
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Slide Count</label>
            <input
              type="number"
              min="1"
              max="10"
              value={project.slideCount}
              onChange={(e) => updateProject({ slideCount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <button
          onClick={onTemplateSelect}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Change Template
        </button>
      </div>

      {/* Element Toggles */}
      <div>
        <h3 className="text-sm font-medium text-secondary mb-3">Element Visibility</h3>
        <div className="space-y-3">
          {getAvailableToggles().map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{toggle.icon}</span>
                <div>
                  <div className="text-sm font-medium text-primary">{toggle.label}</div>
                  <div className="text-xs text-secondary">{toggle.description}</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={getToggleState(toggle.key)}
                  onChange={(e) => toggleElement(toggle.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartsSection;
