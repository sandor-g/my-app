import React from 'react';
import { Input, Separator, Field } from '@base-ui-components/react';
import type { AppState } from '../types';

interface SidebarProps {
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
  onTemplateSelect: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTemplateSelect }) => {
  return (
    <aside className="sidebar bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">AdMaker</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Store Name Inputs using Base UI Field and Input */}
        <div className="space-y-6">
          <Field.Root>
            <Field.Label className="block text-sm font-semibold text-gray-900 mb-3">
              Store name
            </Field.Label>
            <Input
              type="text"
              placeholder="Jaded Pixel"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label className="block text-sm font-semibold text-gray-900 mb-3">
              Brand color
            </Field.Label>
            <div className="flex items-center space-x-3">
              <Input
                type="text"
                placeholder="#3B82F6"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
              <div className="w-12 h-12 rounded-lg border-2 border-gray-200 bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
            </div>
          </Field.Root>

          <Field.Root>
            <Field.Label className="block text-sm font-semibold text-gray-900 mb-3">
              Font family
            </Field.Label>
            <Input
              type="text"
              placeholder="Inter"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label className="block text-sm font-semibold text-gray-900 mb-3">
              Tagline
            </Field.Label>
            <Input
              type="text"
              placeholder="Your brand tagline"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
          </Field.Root>
        </div>
      </div>

      <Separator className="border-t border-gray-200" />

      {/* Preview Button */}
      <div className="p-6">
        <button 
          onClick={onTemplateSelect}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          🎨 Preview Templates
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
