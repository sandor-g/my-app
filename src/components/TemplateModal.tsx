import React from 'react';
import { Separator } from '@base-ui-components/react';
import type { Template } from '../types';

interface TemplateModalProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ templates, onSelect, onClose }) => {
  const getTemplatePreviewStyle = (template: Template) => {
    const baseStyle = "w-full h-32 rounded-t-lg flex items-center justify-center text-white font-semibold";
    
    switch (template.id) {
      case 'hero':
        return `${baseStyle} bg-gradient-to-br from-blue-500 to-purple-600`;
      case 'split':
        return `${baseStyle} bg-gradient-to-r from-green-400 to-blue-500`;
      case 'big-quote':
        return `${baseStyle} bg-gradient-to-br from-yellow-400 to-orange-500`;
      case 'checklist':
        return `${baseStyle} bg-gradient-to-br from-pink-500 to-red-500`;
      case 'stats':
        return `${baseStyle} bg-gradient-to-br from-indigo-500 to-purple-600`;
      case 'stepper':
        return `${baseStyle} bg-gradient-to-r from-teal-400 to-green-500`;
      case 'before-after':
        return `${baseStyle} bg-gradient-to-r from-gray-600 to-gray-800`;
      case 'minimal':
        return `${baseStyle} bg-gradient-to-br from-gray-400 to-gray-600`;
      default:
        return `${baseStyle} bg-gray-500`;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Select Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-light p-0 bg-transparent border-none"
            >
              &times;
            </button>
          </div>
        </div>

        <Separator className="border-b border-gray-200" />

        {/* Body */}
        <div className="modal-body p-6">
          <div className="template-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="template-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelect(template)}
              >
                <div className={getTemplatePreviewStyle(template)}>
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1">{template.name}</h3>
                    <p className="text-sm opacity-90">{template.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-primary mb-1">{template.name}</h4>
                  <p className="text-sm text-secondary">{template.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {template.supportedAspects.join(', ')} • {template.defaultSlideCount} slide{template.defaultSlideCount > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
