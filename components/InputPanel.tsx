import React, { useRef } from 'react';
import { Framework, FontSelection, ContentAmount } from '../types';
import { GOOGLE_FONTS, FRAMEWORKS, CONTENT_AMOUNTS } from '../constants';
import { ColorPicker } from './ColorPicker';
import { SparklesIcon, UploadIcon } from './icons';
import { Documentation } from './Documentation';

interface InputPanelProps {
  wikiUrl: string;
  setWikiUrl: (url: string) => void;
  colors: string[];
  setColors: (colors: string[]) => void;
  selectedFonts: FontSelection;
  setSelectedFonts: (fonts: FontSelection) => void;
  selectedFramework: Framework;
  setSelectedFramework: (framework: Framework) => void;
  contentAmount: ContentAmount;
  setContentAmount: (amount: ContentAmount) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  wikiUrl,
  setWikiUrl,
  colors,
  setColors,
  selectedFonts,
  setSelectedFonts,
  selectedFramework,
  setSelectedFramework,
  contentAmount,
  setContentAmount,
  onGenerate,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, '#ffffff']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleFontChange = (type: 'headingFont' | 'bodyFont', fontName: string) => {
    const font = GOOGLE_FONTS.find(f => f.name === fontName);
    setSelectedFonts({
      ...selectedFonts,
      [type]: font,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const parsedColors = JSON.parse(content);
          if (Array.isArray(parsedColors) && parsedColors.every(c => typeof c === 'string' && c.startsWith('#'))) {
            setColors(parsedColors.slice(0, 8));
          } else {
            alert('Invalid JSON format. Expected an array of hex color strings.');
          }
        } else if (file.name.endsWith('.css')) {
          const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/g;
          const matches = content.match(colorRegex) || [];
          if (matches.length > 0) {
            setColors(matches.slice(0, 8));
          } else {
            alert('No colors found in the CSS file.');
          }
        } else {
            alert('Unsupported file type. Please upload a .json or .css file.');
        }
      } catch (error) {
        alert('Failed to parse the file.');
        console.error('Error parsing color palette file:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="bg-primary p-6 rounded-lg shadow-lg flex flex-col gap-6 overflow-y-auto">
      <Documentation />

      <h2 className="text-2xl font-bold text-light -mt-2">Customization</h2>

      <div>
        <label htmlFor="wiki-url" className="block text-sm font-medium text-gray-300 mb-2">
          Wikipedia URL
        </label>
        <input
          type="url"
          id="wiki-url"
          value={wikiUrl}
          onChange={(e) => setWikiUrl(e.target.value)}
          placeholder="https://en.wikipedia.org/wiki/..."
          className="w-full bg-secondary border border-slate-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">Color Palette</label>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json, .css" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="text-sm text-accent hover:text-sky-300 flex items-center gap-1 font-medium">
                <UploadIcon className="w-4 h-4" />
                Load Palette
            </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {colors.map((color, index) => (
            <ColorPicker
              key={index}
              color={color}
              onChange={(newColor) => handleColorChange(index, newColor)}
              onRemove={() => removeColor(index)}
              canRemove={colors.length > 2}
            />
          ))}
          <button onClick={addColor} disabled={colors.length >= 8} className="w-8 h-8 rounded-full bg-secondary border-2 border-dashed border-slate-500 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-light">+</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="heading-font-select" className="block text-sm font-medium text-gray-300 mb-2">
            Heading Font
          </label>
          <select
            id="heading-font-select"
            value={selectedFonts.headingFont?.name || ''}
            onChange={(e) => handleFontChange('headingFont', e.target.value)}
            className="w-full bg-secondary border border-slate-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent"
          >
            <option value="">Default</option>
            {GOOGLE_FONTS.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="body-font-select" className="block text-sm font-medium text-gray-300 mb-2">
            Body Font
          </label>
          <select
            id="body-font-select"
            value={selectedFonts.bodyFont?.name || ''}
            onChange={(e) => handleFontChange('bodyFont', e.target.value)}
            className="w-full bg-secondary border border-slate-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent"
          >
            <option value="">Default</option>
            {GOOGLE_FONTS.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="content-amount-select" className="block text-sm font-medium text-gray-300 mb-2">
                Content Amount
            </label>
            <select
                id="content-amount-select"
                value={contentAmount}
                onChange={(e) => setContentAmount(e.target.value as ContentAmount)}
                className="w-full bg-secondary border border-slate-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent"
            >
                {CONTENT_AMOUNTS.map((amount) => (
                <option key={amount} value={amount}>
                    {amount}
                </option>
                ))}
            </select>
        </div>
        <div>
          <label htmlFor="framework-select" className="block text-sm font-medium text-gray-300 mb-2">
            Framework
          </label>
          <select
            id="framework-select"
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value as Framework)}
            className="w-full bg-secondary border border-slate-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent"
          >
            {FRAMEWORKS.map((fw) => (
              <option key={fw} value={fw}>
                {fw}
              </option>
            ))}
          </select>
        </div>
      </div>

       <div>
        <label htmlFor="inspiration-url" className="block text-sm font-medium text-gray-400 mb-2">
          Inspiration URL (Optional, feature coming soon)
        </label>
        <input
          type="url"
          id="inspiration-url"
          placeholder="https://example.com"
          disabled
          className="w-full bg-secondary/50 border border-slate-700 rounded-md p-2 text-gray-500 cursor-not-allowed"
        />
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full mt-auto py-3 px-4 bg-accent hover:bg-sky-400 disabled:bg-gray-500 disabled:cursor-wait text-white font-bold rounded-lg text-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
      >
        <SparklesIcon />
        {isLoading ? 'Generating...' : 'Generate Web Page'}
      </button>
    </div>
  );
};