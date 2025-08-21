import React, { useState, useEffect } from 'react';
import type { Brand } from '../types';
import { googleFonts } from '../data/googleFonts';
import { 
  generateOptimalColorMapping, 
  getContrastRatio, 
  isWCAGCompliant,
  getSwapSuggestion 
} from '../utils/colorUtils';

interface BrandSectionProps {
  brand: Brand;
  onUpdate: (brand: Brand) => void;
}

const BrandSection: React.FC<BrandSectionProps> = ({ brand, onUpdate }) => {
  const [showColorMapping, setShowColorMapping] = useState(false);
  const [contrastWarnings, setContrastWarnings] = useState<Array<{
    element: string;
    contrast: number;
    warning: string;
  }>>([]);

  // Load Google Fonts
  useEffect(() => {
    googleFonts.forEach(font => {
      if (!document.querySelector(`link[href="${font.importUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = font.importUrl;
        document.head.appendChild(link);
      }
    });
  }, []);

  // Update brand colors and recalculate mapping
  const updateBrandColors = (updates: Partial<Brand>) => {
    const newBrand = { ...brand, ...updates };
    
    // Generate optimal color mapping
    const optimalMapping = generateOptimalColorMapping(
      newBrand.primary,
      newBrand.secondary,
      newBrand.accent
    );
    
    newBrand.colorMapping = optimalMapping;
    
    // Check for contrast warnings
    const warnings = [];
    const textContrast = getContrastRatio(optimalMapping.bg, optimalMapping.text);
    if (!isWCAGCompliant(textContrast)) {
      warnings.push({
        element: 'Text',
        contrast: textContrast,
        warning: `Text contrast ${textContrast.toFixed(2)}:1 may not meet accessibility standards`
      });
    }
    
    const accentContrast = getContrastRatio(optimalMapping.bg, optimalMapping.accent);
    if (!isWCAGCompliant(accentContrast)) {
      warnings.push({
        element: 'Accent',
        contrast: accentContrast,
        warning: `Accent contrast ${accentContrast.toFixed(2)}:1 may not meet accessibility standards`
      });
    }
    
    setContrastWarnings(warnings);
    onUpdate(newBrand);
  };

  // Handle font family change
  const handleFontChange = (fontFamily: string) => {
    updateBrandColors({ fontFamily });
  };

  // Handle font weight change
  const handleFontWeightChange = (fontWeight: string) => {
    updateBrandColors({ fontWeight });
  };

  // Apply swap suggestion
  const applySwapSuggestion = () => {
    const suggestion = getSwapSuggestion(
      brand.colorMapping,
      brand.primary,
      brand.secondary,
      brand.accent
    );
    
    updateBrandColors({
      colorMapping: suggestion
    });
  };

  // Manual color mapping override
  const updateColorMapping = (token: keyof typeof brand.colorMapping, color: string) => {
    const newMapping = { ...brand.colorMapping, [token]: color };
    const newBrand = { ...brand, colorMapping: newMapping };
    onUpdate(newBrand);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-primary">Brand Identity</h2>
      
      {/* Color Inputs with Swatches */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Primary Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={brand.primary}
              onChange={(e) => updateBrandColors({ primary: e.target.value })}
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={brand.primary}
              onChange={(e) => updateBrandColors({ primary: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 font-mono text-sm"
              placeholder="#000000"
            />
            <div 
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: brand.primary }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Secondary Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={brand.secondary}
              onChange={(e) => updateBrandColors({ secondary: e.target.value })}
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={brand.secondary}
              onChange={(e) => updateBrandColors({ secondary: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 font-mono text-sm"
              placeholder="#000000"
            />
            <div 
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: brand.secondary }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Accent Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={brand.accent}
              onChange={(e) => updateBrandColors({ accent: e.target.value })}
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={brand.accent}
              onChange={(e) => updateBrandColors({ accent: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 font-mono text-sm"
              placeholder="#000000"
            />
            <div 
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: brand.accent }}
            />
          </div>
        </div>
      </div>

      {/* Color Swatch Preview */}
      <div>
        <h3 className="text-sm font-medium text-secondary mb-2">Color Palette</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div 
              className="w-full h-16 rounded-lg mb-1"
              style={{ backgroundColor: brand.primary }}
            />
            <span className="text-xs text-secondary">Primary</span>
          </div>
          <div className="text-center">
            <div 
              className="w-full h-16 rounded-lg mb-1"
              style={{ backgroundColor: brand.secondary }}
            />
            <span className="text-xs text-secondary">Secondary</span>
          </div>
          <div className="text-center">
            <div 
              className="w-full h-16 rounded-lg mb-1"
              style={{ backgroundColor: brand.accent }}
            />
            <span className="text-xs text-secondary">Accent</span>
          </div>
        </div>
      </div>

      {/* Google Font Picker */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-2">
          Font Family
        </label>
        <select
          value={brand.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300"
        >
          {googleFonts.map((font) => (
            <option key={font.family} value={font.family}>
              {font.family} ({font.category})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-2">
          Font Weight
        </label>
        <select
          value={brand.fontWeight}
          onChange={(e) => handleFontWeightChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300"
        >
          {googleFonts
            .find(f => f.family === brand.fontFamily)
            ?.variants.map((weight) => (
              <option key={weight} value={weight}>
                {weight === '400' ? 'Regular' : weight === '700' ? 'Bold' : weight}
              </option>
            )) || ['400', '500', '600', '700'].map((weight) => (
              <option key={weight} value={weight}>
                {weight === '400' ? 'Regular' : weight === '700' ? 'Bold' : weight}
              </option>
            ))}
        </select>
      </div>

      {/* Contrast Warnings */}
      {contrastWarnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-600">⚠️</div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">
                Accessibility Warning
              </h4>
              {contrastWarnings.map((warning, index) => (
                <p key={index} className="text-xs text-yellow-700 mb-1">
                  {warning.warning}
                </p>
              ))}
              <button
                onClick={applySwapSuggestion}
                className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors"
              >
                Apply Suggested Fix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Mapping Controls */}
      <div>
        <button
          onClick={() => setShowColorMapping(!showColorMapping)}
          className="text-sm text-primary hover:text-gray-800 transition-colors"
        >
          {showColorMapping ? 'Hide' : 'Show'} Color Mapping
        </button>
        
        {showColorMapping && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
            <h4 className="text-xs font-medium text-secondary">Template Color Mapping</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-secondary mb-1">Background</label>
                <select
                  value={brand.colorMapping.bg}
                  onChange={(e) => updateColorMapping('bg', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-300"
                >
                  <option value={brand.primary}>Primary</option>
                  <option value={brand.secondary}>Secondary</option>
                  <option value={brand.accent}>Accent</option>
                  <option value="#FFFFFF">White</option>
                  <option value="#000000">Black</option>
                </select>
              </div>
              <div>
                <label className="block text-secondary mb-1">Text</label>
                <select
                  value={brand.colorMapping.text}
                  onChange={(e) => updateColorMapping('text', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-300"
                >
                  <option value={brand.primary}>Primary</option>
                  <option value={brand.secondary}>Secondary</option>
                  <option value={brand.accent}>Accent</option>
                  <option value="#FFFFFF">White</option>
                  <option value="#000000">Black</option>
                </select>
              </div>
              <div>
                <label className="block text-secondary mb-1">Accent</label>
                <select
                  value={brand.colorMapping.accent}
                  onChange={(e) => updateColorMapping('accent', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-300"
                >
                  <option value={brand.primary}>Primary</option>
                  <option value={brand.secondary}>Secondary</option>
                  <option value={brand.accent}>Accent</option>
                  <option value="#FFFFFF">White</option>
                  <option value="#000000">Black</option>
                </select>
              </div>
              <div>
                <label className="block text-secondary mb-1">Shape</label>
                <select
                  value={brand.colorMapping.shape}
                  onChange={(e) => updateColorMapping('shape', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-300"
                >
                  <option value={brand.primary}>Primary</option>
                  <option value={brand.secondary}>Secondary</option>
                  <option value={brand.accent}>Accent</option>
                  <option value="#FFFFFF">White</option>
                  <option value="#000000">Black</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandSection;
