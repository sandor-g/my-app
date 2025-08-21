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
        <div className="space-y-4">
          <Field.Root>
            <Field.Label className="block text-sm font-medium text-gray-900 mb-2">
              Store name
            </Field.Label>
            <Input
              type="text"
              placeholder="Jaded Pixel"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label className="block text-sm font-medium text-gray-900 mb-2">
              Brand color
            </Field.Label>
            <Input
              type="text"
              placeholder="#3B82F6"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label className="block text-sm font-medium text-gray-900 mb-2">
              Font family
            </Field.Label>
            <Input
              type="text"
              placeholder="Inter"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label className="block text-sm font-medium text-gray-900 mb-2">
              Tagline
            </Field.Label>
            <Input
              type="text"
              placeholder="Your brand tagline"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field.Root>
        </div>
      </div>

      <Separator className="border-t border-gray-200" />

      {/* Preview Button */}
      <div className="p-6">
        <button 
          onClick={onTemplateSelect}
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Preview
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
