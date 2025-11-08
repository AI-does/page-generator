import React, { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { Framework, FontSelection, ContentAmount } from './types';
import { getWikipediaContent } from './services/wikipediaService';
import { generateWebsiteCode, generateImage } from './services/geminiService';
import { downloadZip } from './lib/zip';
import { DEFAULT_COLORS } from './constants';
import { Header } from './components/Header';
import { DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [wikiUrl, setWikiUrl] = useState('https://en.wikipedia.org/wiki/Artificial_intelligence');
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
  const [selectedFonts, setSelectedFonts] = useState<FontSelection>({ headingFont: undefined, bodyFont: undefined });
  const [selectedFramework, setSelectedFramework] = useState<Framework>(Framework.Tailwind);
  const [contentAmount, setContentAmount] = useState<ContentAmount>(ContentAmount.Medium);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!wikiUrl) {
      setError('Please enter a Wikipedia URL.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedHtml(null);

    try {
      setLoadingMessage('Fetching & cleaning Wikipedia content...');
      const articleContent = await getWikipediaContent(wikiUrl);

      if (!articleContent.content) {
          throw new Error("Could not extract readable content from the Wikipedia article. Please check the URL.");
      }

      setLoadingMessage('Generating website structure with Gemini Pro...');
      const generatedCode = await generateWebsiteCode(
        articleContent.content,
        articleContent.title,
        colors,
        selectedFonts,
        selectedFramework,
        contentAmount
      );
      
      let finalHtml = generatedCode;
      let heroImageHtml = '';

      if (articleContent.imageUrl) {
        setLoadingMessage('Using image from Wikipedia...');
        heroImageHtml = `<img src="${articleContent.imageUrl}" alt="Primary image for ${articleContent.title}" class="w-full h-full object-cover" />`;
      } else {
        setLoadingMessage('Generating header image with Imagen...');
        const imagePrompt = `A visually stunning and abstract representation of "${articleContent.title}". Digital art, high resolution, vibrant colors reflecting this palette: ${colors.join(', ')}.`;
        const base64Image = await generateImage(imagePrompt);
        if (base64Image) {
          heroImageHtml = `<img src="data:image/jpeg;base64,${base64Image}" alt="AI generated image for ${articleContent.title}" class="w-full h-full object-cover" />`;
        }
      }
      
      if (heroImageHtml) {
        // Simple replacement for a placeholder. A more robust solution might use IDs.
        finalHtml = finalHtml.replace(
          /<div class="placeholder-image[^"]*">.*?<\/div>/,
          heroImageHtml
        );
      }
      
      setGeneratedHtml(finalHtml);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [wikiUrl, colors, selectedFonts, selectedFramework, contentAmount]);

  const handleDownload = useCallback(() => {
    if (generatedHtml) {
      downloadZip(generatedHtml, selectedFramework);
    }
  }, [generatedHtml, selectedFramework]);

  return (
    <div className="min-h-screen bg-dark text-light font-sans flex flex-col">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-8">
        <InputPanel
          wikiUrl={wikiUrl}
          setWikiUrl={setWikiUrl}
          colors={colors}
          setColors={setColors}
          selectedFonts={selectedFonts}
          setSelectedFonts={setSelectedFonts}
          selectedFramework={selectedFramework}
          setSelectedFramework={setSelectedFramework}
          contentAmount={contentAmount}
          setContentAmount={setContentAmount}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <div className="flex flex-col bg-primary rounded-lg shadow-lg overflow-hidden h-[60vh] lg:h-auto">
          <div className="flex-shrink-0 p-4 bg-secondary/50 border-b border-secondary flex justify-between items-center">
            <h2 className="text-lg font-bold">Live Preview</h2>
            <button
              onClick={handleDownload}
              disabled={!generatedHtml || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-sky-400 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-md transition-colors font-semibold"
            >
              <DownloadIcon />
              Download
            </button>
          </div>
          <PreviewPanel
            htmlContent={generatedHtml}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;