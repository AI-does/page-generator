
import React from 'react';
import { SparklesIcon } from './icons';

interface PreviewPanelProps {
  htmlContent: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  htmlContent,
  isLoading,
  loadingMessage,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-dark p-4">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin border-t-accent"></div>
        <h2 className="text-xl font-semibold text-light mb-2">Generating Your Website...</h2>
        <p className="text-gray-400">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center bg-red-900/20 p-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-400 mb-2">Generation Failed</h3>
          <p className="text-red-300 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-dark p-4">
        <SparklesIcon className="w-16 h-16 text-accent mb-4" />
        <h3 className="text-2xl font-bold text-light">Your website will appear here</h3>
        <p className="text-gray-400 mt-2 max-w-sm text-center">
          Fill in the details on the left and click "Generate Web Page" to start.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-white">
      <iframe
        srcDoc={htmlContent}
        title="Live Preview"
        className="w-full h-full border-0"
        sandbox="allow-scripts"
      />
    </div>
  );
};
