// Use gemini-2.5-flash-lite for fast text processing.
import { GoogleGenAI } from "@google/genai";
import { WikipediaContent } from "../types";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getWikipediaContent = async (url: string): Promise<WikipediaContent> => {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname; // e.g., en.wikipedia.org
    const path = urlObject.pathname; // e.g., /wiki/Artificial_intelligence
    const articleTitle = path.split('/').pop();

    if (!articleTitle) {
      throw new Error('Invalid Wikipedia URL: Could not extract article title.');
    }

    const apiUrl = `https://${domain}/api/rest_v1/page/html/${articleTitle}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Wikipedia article. Status: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const articleBody = doc.querySelector('body');
    if (!articleBody) {
        throw new Error('Could not find article body.');
    }

    // Extract image from infobox before removing it
    let imageUrl: string | undefined = undefined;
    const infoboxImage = doc.querySelector('.infobox img');
    if (infoboxImage) {
        let src = infoboxImage.getAttribute('src');
        if (src) {
            // Convert protocol-relative URL to absolute URL
            if (src.startsWith('//')) {
                src = 'https:' + src;
            }
            imageUrl = new URL(src, `https://${domain}`).href;
        }
    }

    // Remove unwanted elements like tables of contents, edit buttons, references, etc.
    articleBody.querySelectorAll('.mw-editsection, .toc, .reflist, .references, .infobox, .thumb, style, script, .navbox, .metadata').forEach(el => el.remove());

    const title = doc.querySelector('h1')?.textContent || articleTitle.replace(/_/g, ' ');

    // Use Gemini Flash Lite for fast summarization and cleaning
    const prompt = `
    The following is the raw inner text from a Wikipedia article's HTML body.
    Clean it up and extract the most important textual content.
    Remove any remaining artifacts, navigation elements, citation markers (like [1], [2], etc.), or irrelevant text.
    Focus on the main paragraphs, headings (h2, h3), and lists.
    Present the output as clean, readable text.
    
    RAW TEXT:
    ${articleBody.innerText}
    `;

    // FIX: Updated model name to one recommended in the SDK guidelines for 'flash lite'.
    const model = 'gemini-flash-lite-latest';
    const result = await ai.models.generateContent({
        model: model,
        // FIX: Simplified the 'contents' parameter to pass the prompt string directly.
        contents: prompt,
    });
    
    const cleanedContent = result.text;

    return { title, content: cleanedContent, imageUrl };

  } catch (error) {
    console.error('Error fetching or parsing Wikipedia content:', error);
    throw new Error('Could not process the Wikipedia URL. Please ensure it is a valid link to a Wikipedia article.');
  }
};