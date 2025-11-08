
// This utility uses the JSZip library.
// You'll need to add it to your project: `npm install jszip`
// For a browser-only environment without npm, you can include it via CDN in your index.html:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

import JSZip from 'jszip';
import { Framework } from '../types';

declare global {
    interface Window {
        JSZip: typeof JSZip;
    }
}
const JSZip_ = typeof JSZip !== 'undefined' ? JSZip : window.JSZip;


export const downloadZip = async (htmlContent: string, framework: Framework) => {
  if (!JSZip_) {
    alert("JSZip library not found. Please ensure it's included to use the download functionality.");
    return;
  }
  const zip = new JSZip_();
  zip.file('index.html', htmlContent);

  // For React, maybe add a simple readme.
  if (framework === Framework.React) {
      zip.file('README.md', 'This is a lightweight React site that runs in the browser using CDNs. Simply open index.html to view it.');
  }
  
  try {
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'ai-generated-website.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch(e) {
      console.error(e);
      alert("Failed to generate zip file.");
  }
};
