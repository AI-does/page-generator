import React, { useState } from 'react';
import { CloseIcon } from './icons';

export const Documentation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <div className="bg-secondary/50 p-4 rounded-lg border border-slate-700">
                <p className="text-sm text-gray-300">
                    Turn any Wikipedia article into a modern website. Customize the design, preview it live, and download the code.
                    <button onClick={handleOpen} className="text-accent hover:text-sky-300 font-semibold ml-2 underline">
                        Read full documentation
                    </button>
                </p>
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
                    onClick={handleClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="documentation-title"
                >
                    <div 
                        className="bg-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-secondary"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <header className="flex justify-between items-center p-4 border-b border-secondary">
                            <h2 id="documentation-title" className="text-xl font-bold text-light">How It Works</h2>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white" aria-label="Close documentation">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </header>
                        <main className="p-6 overflow-y-auto text-gray-300 space-y-4">
                            <p>This app uses Google's Gemini models to generate a complete, downloadable website from a Wikipedia article. Here's how to use it:</p>
                            
                            <ol className="list-decimal list-inside space-y-3">
                                <li>
                                    <strong className="text-light">Wikipedia URL:</strong> Paste the full URL of the Wikipedia article you want to convert.
                                </li>
                                <li>
                                    <strong className="text-light">Color Palette:</strong> Manually pick colors using the color wheels, or click "Load Palette" to import colors from a <code>.json</code> (as an array of hex strings) or <code>.css</code> file.
                                </li>
                                <li>
                                    <strong className="text-light">Typography:</strong> Choose different fonts for your website's headings and body text from a curated list of Google Fonts.
                                </li>
                                <li>
                                    <strong className="text-light">Content Amount:</strong> Select how much of the article to use:
                                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                                        <li><strong>Small:</strong> Creates a concise, single-page summary.</li>
                                        <li><strong>Medium:</strong> Builds a standard, multi-section website.</li>
                                        <li><strong>Full:</strong> Generates a comprehensive site using the entire article for a deep-dive.</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong className="text-light">Framework:</strong> Choose the coding framework for the final output. This determines the structure of the generated code.
                                </li>
                                <li>
                                    <strong className="text-light">Generate:</strong> Click "Generate Web Page". The app fetches the Wikipedia content, cleans it, and then uses Gemini Pro to generate the website code and Imagen to create a unique header image.
                                </li>
                                <li>
                                    <strong className="text-light">Preview & Download:</strong> The generated site will appear in the "Live Preview" panel. If you're happy with the result, click "Download" to get a <code>.zip</code> file containing your new website, ready to be hosted anywhere.
                                </li>
                            </ol>
                        </main>
                         <footer className="p-4 border-t border-secondary text-right">
                             <button onClick={handleClose} className="px-4 py-2 bg-accent hover:bg-sky-400 text-white rounded-md font-semibold">
                                 Got it!
                             </button>
                         </footer>
                    </div>
                </div>
            )}
        </>
    );
};