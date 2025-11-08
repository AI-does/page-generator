import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-primary/50 backdrop-blur-sm p-4 border-b border-secondary">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-8 h-8 text-accent flex-shrink-0" />
          <h1 className="text-lg md:text-xl font-bold text-light">
            AI Web Page Generator
            <span className="hidden sm:inline-block text-gray-400 font-normal ml-2">- A Tool By Skarvsladd Inc.</span>
          </h1>
        </div>

        <a href="https://www.buymeacoffee.com/danieljuri2" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <img 
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
            alt="Buy Me A Coffee" 
            className="h-10 md:h-12 w-auto"
          />
        </a>
      </div>
    </header>
  );
};