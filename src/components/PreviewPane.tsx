import React, { useState } from 'react';
import { Toolbar, ToggleGroup } from '@base-ui-components/react';
import type { AppState, SlideElement, SlideContent } from '../types';

interface PreviewPaneProps {
  state: AppState;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ state }) => {
  const [zoom, setZoom] = useState(100);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const isCarousel = state.project.format === 'carousel';
  const hasSlides = state.project.slides && state.project.slides.length > 0;

  // Get artboard dimensions based on aspect ratio
  const getArtboardDimensions = () => {
    const aspect = state.project.aspect;
    const baseSize = 400; // Base size for scaling
    
    switch (aspect) {
      case '16:9':
        return { width: baseSize * 16/9, height: baseSize };
      case '9:16':
        return { width: baseSize, height: baseSize * 16/9 };
      case '4:5':
        return { width: baseSize, height: baseSize * 5/4 };
      case '1:1':
      default:
        return { width: baseSize, height: baseSize };
    }
  };

  const artboardDimensions = getArtboardDimensions();

  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      {/* Header with Controls */}
      <Toolbar.Root className="p-4 border-b border-gray-200 bg-white">
        <Toolbar.Group className="flex items-center space-x-2">
          <Toolbar.Button
            onClick={handleZoomOut}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            disabled={zoom <= 50}
          >
            -
          </Toolbar.Button>
          <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {zoom}%
          </span>
          <Toolbar.Button
            onClick={handleZoomIn}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            disabled={zoom >= 200}
          >
            +
          </Toolbar.Button>
        </Toolbar.Group>

        {isCarousel && hasSlides && (
          <Toolbar.Group className="flex items-center space-x-2">
            <Toolbar.Button
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </Toolbar.Button>
            <span className="text-sm text-gray-700">
              Slide {currentSlide + 1} of {state.project.slides.length}
            </span>
            <Toolbar.Button
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, state.project.slides.length - 1))}
              disabled={currentSlide === state.project.slides.length - 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </Toolbar.Button>
          </Toolbar.Group>
        )}
      </Toolbar.Root>

      {/* Artboard Container */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div 
          className="artboard bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300"
          style={{ 
            transform: `scale(${zoom / 100})`,
            width: `${artboardDimensions.width}px`,
            height: `${artboardDimensions.height}px`,
            minWidth: `${artboardDimensions.width}px`,
            minHeight: `${artboardDimensions.height}px`,
            position: 'relative'
          }}
        >
          {hasSlides ? (
            <div className="w-full h-full relative">
              {/* Render current slide */}
              {state.project.slides[currentSlide] && (
                <SlideRenderer 
                  slide={state.project.slides[currentSlide]} 
                  brand={state.brand}
                  slideContent={state.project.slideContents?.[currentSlide]}
                  artboardDimensions={artboardDimensions}
                />
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center p-8">
              <div>
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a template to get started
                </h3>
                <p className="text-gray-500">
                  Choose from our collection of professional ad templates
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

interface SlideRendererProps {
  slide: SlideElement;
  brand: any;
  slideContent: SlideContent | undefined;
  artboardDimensions: { width: number; height: number };
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, brand, slideContent, artboardDimensions }) => {
  const getTokenColor = (token: string) => {
    return brand.colorMapping[token as keyof typeof brand.colorMapping] || '#000000';
  };

  const getContentForElement = (elementType: string): string => {
    if (!slideContent) return '';
    
    // Map slide types to content fields based on actual template usage
    switch (elementType) {
      case 'headline': return slideContent.headline || 'Your Headline Here';
      case 'subheadline': return slideContent.subheadline || 'Supporting text goes here';
      case 'body': return slideContent.body || 'Body content for your ad';
      case 'bullets': return slideContent.bullets || '• Point 1\n• Point 2\n• Point 3';
      case 'cta': return slideContent.cta || 'Call to Action';
      case 'footer': return slideContent.footer || 'Additional information';
      case 'shape': return ''; // Shapes don't have text content
      case 'progress': return ''; // Progress bars don't have text content
      default: return slideContent.headline || 'Content'; // Fallback
    }
  };

  // Don't render if element is hidden
  if (slide.visible === false) return null;

  return (
    <div className="w-full h-full relative">
      {slide.type === 'headline' && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            color: getTokenColor(slide.style.tokenBinding),
            textAlign: slide.style.align as any,
            padding: `${slide.style.padding}px`,
            borderRadius: `${slide.style.radius}px`,
            fontSize: slide.textDefaults?.fontSize || 24,
            fontWeight: slide.textDefaults?.fontWeight || 400,
            fontStyle: slide.textDefaults?.fontStyle || 'normal',
            fontFamily: brand.fontFamily || 'Inter'
          }}
        >
          {getContentForElement('headline')}
        </div>
      )}
      
      {slide.type === 'subheadline' && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            color: getTokenColor(slide.style.tokenBinding),
            textAlign: slide.style.align as any,
            padding: `${slide.style.padding}px`,
            borderRadius: `${slide.style.radius}px`,
            fontSize: slide.textDefaults?.fontSize || 18,
            fontWeight: slide.textDefaults?.fontWeight || 400,
            fontStyle: slide.textDefaults?.fontStyle || 'normal',
            fontFamily: brand.fontFamily || 'Inter'
          }}
        >
          {getContentForElement('subheadline')}
        </div>
      )}
      
      {slide.type === 'body' && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            color: getTokenColor(slide.style.tokenBinding),
            textAlign: slide.style.align as any,
            padding: `${slide.style.padding}px`,
            borderRadius: `${slide.style.radius}px`,
            fontSize: slide.textDefaults?.fontSize || 16,
            fontWeight: slide.textDefaults?.fontWeight || 400,
            fontStyle: slide.textDefaults?.fontStyle || 'normal',
            fontFamily: brand.fontFamily || 'Inter'
          }}
        >
          {getContentForElement('body')}
        </div>
      )}
      
      {slide.type === 'bullets' && (
        <div
          className="absolute flex items-start justify-start"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            color: getTokenColor(slide.style.tokenBinding),
            textAlign: slide.style.align as any,
            padding: `${slide.style.padding}px`,
            borderRadius: `${slide.style.radius}px`,
            fontSize: slide.textDefaults?.fontSize || 16,
            fontWeight: slide.textDefaults?.fontWeight || 400,
            fontFamily: brand.fontFamily || 'Inter'
          }}
        >
          <div className="whitespace-pre-line">
            {getContentForElement('bullets')}
          </div>
        </div>
      )}
      
      {slide.type === 'cta' && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            backgroundColor: getTokenColor(slide.style.tokenBinding),
            color: '#FFFFFF',
            textAlign: slide.style.align as any,
            padding: `${slide.style.padding}px`,
            borderRadius: `${slide.style.radius}px`,
            fontSize: slide.textDefaults?.fontSize || 18,
            fontWeight: slide.textDefaults?.fontWeight || 600,
            fontFamily: brand.fontFamily || 'Inter'
          }}
        >
          {getContentForElement('cta')}
        </div>
      )}
      
      {slide.type === 'footer' && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            color: getTokenColor(slide.style.tokenBinding),
            textAlign: slide.style.align as any,
            padding: `${slide.style.padding}px`,
            borderRadius: `${slide.style.radius}px`,
            fontSize: slide.textDefaults?.fontSize || 14,
            fontWeight: slide.textDefaults?.fontWeight || 400,
            fontFamily: brand.fontFamily || 'Inter'
          }}
        >
          {getContentForElement('footer')}
        </div>
      )}
      
      {slide.type === 'shape' && (
        <div
          className="absolute"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            backgroundColor: getTokenColor(slide.style.tokenBinding),
            borderRadius: `${slide.style.radius}px`
          }}
        />
      )}

      {slide.type === 'progress' && (
        <div
          className="absolute"
          style={{
            left: `${slide.rect.x}%`,
            top: `${slide.rect.y}%`,
            width: `${slide.rect.w}%`,
            height: `${slide.rect.h}%`,
            backgroundColor: getTokenColor(slide.style.tokenBinding),
            borderRadius: `${slide.style.radius}px`
          }}
        />
      )}
    </div>
  );
};

export default PreviewPane;
