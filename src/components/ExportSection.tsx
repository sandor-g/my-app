import React, { useState } from 'react';
import type { AppState, Project, Brand } from '../types';
import { exportToPNG, exportToZIP, exportToPDF } from '../utils/exportUtils';

interface ExportSectionProps {
  export: AppState['export'];
  project: Project;
  brand: Brand;
  onUpdate: (export_: AppState['export']) => void;
}

interface ExportProgress {
  isExporting: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  success: boolean;
}

const ExportSection: React.FC<ExportSectionProps> = ({ export: exportSettings, project, brand, onUpdate }) => {
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    isExporting: false,
    progress: 0,
    currentStep: '',
    error: null,
    success: false
  });

  const hasSlides = project.slides && project.slides.length > 0;

  const updateExportSettings = (updates: Partial<AppState['export']>) => {
    onUpdate({ ...exportSettings, ...updates });
  };

  const handleExportPNG = async () => {
    if (!hasSlides) return;
    
    setExportProgress({
      isExporting: true,
      progress: 0,
      currentStep: 'Preparing PNG export...',
      error: null,
      success: false
    });

    try {
      if (project.format === 'single') {
        // Export single image
        setExportProgress(prev => ({ ...prev, currentStep: 'Exporting single image...', progress: 50 }));
        await exportToPNG(project.slides[0], brand, exportSettings.size, project.slideContents[0]);
        setExportProgress(prev => ({ ...prev, progress: 100, currentStep: 'Export complete!', success: true }));
      } else {
        // Export all slides
        setExportProgress(prev => ({ ...prev, currentStep: 'Exporting all slides...', progress: 25 }));
        
        for (let i = 0; i < project.slides.length; i++) {
          const progress = 25 + ((i + 1) / project.slides.length) * 75;
          setExportProgress(prev => ({ 
            ...prev, 
            progress: Math.round(progress),
            currentStep: `Exporting slide ${i + 1} of ${project.slides.length}...`
          }));
          
          await exportToPNG(project.slides[i], brand, exportSettings.size, project.slideContents[i]);
        }
        
        setExportProgress(prev => ({ ...prev, progress: 100, currentStep: 'All slides exported!', success: true }));
      }
    } catch (error) {
      setExportProgress(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Export failed',
        isExporting: false 
      }));
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setExportProgress({
        isExporting: false,
        progress: 0,
        currentStep: '',
        error: null,
        success: false
      });
    }, 3000);
  };

  const handleExportZIP = async () => {
    if (!hasSlides || project.format === 'single') return;
    
    setExportProgress({
      isExporting: true,
      progress: 0,
      currentStep: 'Preparing ZIP export...',
      error: null,
      success: false
    });

    try {
      setExportProgress(prev => ({ ...prev, currentStep: 'Exporting slides to PNG...', progress: 25 }));
      
      const pngBlobs: Blob[] = [];
      for (let i = 0; i < project.slides.length; i++) {
        const progress = 25 + ((i + 1) / project.slides.length) * 50;
        setExportProgress(prev => ({ 
          ...prev, 
          progress: Math.round(progress),
          currentStep: `Converting slide ${i + 1} to PNG...`
        }));
        
        const pngBlob = await exportToPNG(project.slides[i], brand, exportSettings.size, project.slideContents[i], true);
        if (pngBlob) {
          pngBlobs.push(pngBlob);
        }
      }
      
      setExportProgress(prev => ({ ...prev, currentStep: 'Creating ZIP file...', progress: 80 }));
      await exportToZIP(pngBlobs, brand, project.templateId || 'template', exportSettings.size);
      
      setExportProgress(prev => ({ ...prev, progress: 100, currentStep: 'ZIP export complete!', success: true }));
    } catch (error) {
      setExportProgress(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'ZIP export failed',
        isExporting: false 
      }));
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setExportProgress({
        isExporting: false,
        progress: 0,
        currentStep: '',
        error: null,
        success: false
      });
    }, 3000);
  };

  const handleExportPDF = async () => {
    if (!hasSlides || project.format === 'single') return;
    
    setExportProgress({
      isExporting: true,
      progress: 0,
      currentStep: 'Preparing PDF export...',
      error: null,
      success: false
    });

    try {
      setExportProgress(prev => ({ ...prev, currentStep: 'Converting slides to images...', progress: 25 }));
      
      const slideImages: Blob[] = [];
      for (let i = 0; i < project.slides.length; i++) {
        const progress = 25 + ((i + 1) / project.slides.length) * 50;
        setExportProgress(prev => ({ 
          ...prev, 
          progress: Math.round(progress),
          currentStep: `Processing slide ${i + 1} of ${project.slides.length}...`
        }));
        
        const slideImage = await exportToPNG(project.slides[i], brand, exportSettings.size, project.slideContents[i], true);
        if (slideImage) {
          slideImages.push(slideImage);
        }
      }
      
      setExportProgress(prev => ({ ...prev, currentStep: 'Generating PDF...', progress: 80 }));
      await exportToPDF(slideImages, brand, project.templateId || 'template', exportSettings.size);
      
      setExportProgress(prev => ({ ...prev, progress: 100, currentStep: 'PDF export complete!', success: true }));
    } catch (error) {
      setExportProgress(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'PDF export failed',
        isExporting: false 
      }));
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setExportProgress({
        isExporting: false,
        progress: 0,
        currentStep: '',
        error: null,
        success: false
      });
    }, 3000);
  };

  if (!hasSlides) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">Export</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📤</div>
          <p>Select a template to enable export options</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-primary mb-4">Export</h2>
      
      {/* Export Settings */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Format</label>
          <select
            value={exportSettings.format}
            onChange={(e) => updateExportSettings({ format: e.target.value as 'single' | 'carousel' })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="single">Single Image</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Size</label>
          <select
            value={exportSettings.size}
            onChange={(e) => updateExportSettings({ size: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1080x1080">Square (1080x1080)</option>
            <option value="1080x1350">Portrait (1080x1350)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Quality</label>
          <select
            value={exportSettings.quality}
            onChange={(e) => updateExportSettings({ quality: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="high">High (300 DPI)</option>
            <option value="medium">Medium (150 DPI)</option>
            <option value="low">Low (72 DPI)</option>
          </select>
        </div>
      </div>

      {/* Export Progress */}
      {exportProgress.isExporting && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium text-blue-800">{exportProgress.currentStep}</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress.progress}%` }}
            />
          </div>
          <div className="text-xs text-blue-600 mt-1">{exportProgress.progress}%</div>
        </div>
      )}

      {/* Export Success */}
      {exportProgress.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-green-600">✅</div>
            <span className="text-sm font-medium text-green-800">{exportProgress.currentStep}</span>
          </div>
        </div>
      )}

      {/* Export Error */}
      {exportProgress.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-red-600">❌</div>
            <span className="text-sm font-medium text-red-800">Export failed: {exportProgress.error}</span>
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleExportPNG}
          disabled={exportProgress.isExporting}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {project.format === 'single' ? 'Export PNG' : 'Export All Slides as PNG'}
        </button>

        {project.format === 'carousel' && (
          <>
            <button
              onClick={handleExportZIP}
              disabled={exportProgress.isExporting}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export as ZIP
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exportProgress.isExporting}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export as PDF
            </button>
          </>
        )}
      </div>

      {/* Export Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Export Info</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• PNG: High-quality images for social media</div>
          <div>• ZIP: All slides as separate PNG files</div>
          <div>• PDF: Multi-page document for LinkedIn</div>
          <div>• Files named: {brand.fontFamily}-{project.templateId || 'template'}-{exportSettings.size}</div>
        </div>
      </div>
    </section>
  );
};

export default ExportSection;
