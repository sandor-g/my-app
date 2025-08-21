import React, { useState } from 'react';
import type { Project, SlideContent } from '../types';

interface ContentSectionProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({ project, onUpdate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const isCarousel = project.format === 'carousel';
  const hasSlides = project.slides.length > 0;

  const updateSlideContent = (slideIndex: number, updates: Partial<SlideContent>) => {
    const newSlideContents = [...project.slideContents];
    newSlideContents[slideIndex] = { ...newSlideContents[slideIndex], ...updates };
    
    onUpdate({
      ...project,
      slideContents: newSlideContents
    });
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < project.slides.length) {
      setCurrentSlideIndex(index);
    }
  };

  const getCurrentSlideContent = (): SlideContent => {
    if (!hasSlides || !project.slideContents[currentSlideIndex]) {
      return {
        headline: '',
        subheadline: '',
        body: '',
        bullets: '',
        cta: '',
        footer: ''
      };
    }
    return project.slideContents[currentSlideIndex];
  };

  const currentContent = getCurrentSlideContent();

  if (!hasSlides) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">Content</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>Select a template to start editing content</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-primary mb-4">Content</h2>
      
      {/* Slide Navigation */}
      {isCarousel && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => goToSlide(currentSlideIndex - 1)}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹ Prev
            </button>
            <span className="text-sm font-medium text-gray-700">
              Slide {currentSlideIndex + 1} of {project.slides.length}
            </span>
            <button
              onClick={() => goToSlide(currentSlideIndex + 1)}
              disabled={currentSlideIndex === project.slides.length - 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next ›
            </button>
          </div>
          
          {/* Slide Index Dropdown */}
          <select
            value={currentSlideIndex}
            onChange={(e) => setCurrentSlideIndex(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
          >
            {project.slides.map((_, index) => (
              <option key={index} value={index}>
                Slide {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Headline
          </label>
          <input
            type="text"
            value={currentContent.headline}
            onChange={(e) => updateSlideContent(currentSlideIndex, { headline: e.target.value })}
            placeholder="Enter your headline"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Subheadline
          </label>
          <input
            type="text"
            value={currentContent.subheadline}
            onChange={(e) => updateSlideContent(currentSlideIndex, { subheadline: e.target.value })}
            placeholder="Enter subheadline"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Body Text
          </label>
          <textarea
            value={currentContent.body}
            onChange={(e) => updateSlideContent(currentSlideIndex, { body: e.target.value })}
            placeholder="Enter body text"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Bullet Points
          </label>
          <textarea
            value={currentContent.bullets}
            onChange={(e) => updateSlideContent(currentSlideIndex, { bullets: e.target.value })}
            placeholder="• Point 1\n• Point 2\n• Point 3"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Use • for bullet points</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Call to Action
          </label>
          <input
            type="text"
            value={currentContent.cta}
            onChange={(e) => updateSlideContent(currentSlideIndex, { cta: e.target.value })}
            placeholder="Shop Now, Learn More, etc."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Footer Note
          </label>
          <input
            type="text"
            value={currentContent.footer}
            onChange={(e) => updateSlideContent(currentSlideIndex, { footer: e.target.value })}
            placeholder="Additional information or disclaimer"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
