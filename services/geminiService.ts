import { GoogleGenAI, Type } from "@google/genai";
import { Framework, FontSelection, ContentAmount } from "../types";

// Note: Ensure the API_KEY environment variable is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function buildPrompt(
  content: string,
  title: string,
  colors: string[],
  fonts: FontSelection,
  framework: Framework,
  contentAmount: ContentAmount
): string {
  const colorInstructions = `Use this color palette: ${colors.join(', ')}. Please assign them semantically:
- ${colors[0] || '#0f172a'} as the primary dark background.
- ${colors[1] || '#38bdf8'} as the accent color for buttons, links, and highlights.
- ${colors[2] || '#f1f5f9'} as the primary light text color.
- ${colors[3] || '#94a3b8'} as a secondary, subtle text or border color.
- ${colors[4] || colors[0]} as a secondary background color for cards or sections.`;

  const fontImports = new Set<string>();
  if (fonts.headingFont) fontImports.add(`<link href="${fonts.headingFont.url}" rel="stylesheet">`);
  if (fonts.bodyFont) fontImports.add(`<link href="${fonts.bodyFont.url}" rel="stylesheet">`);

  let fontInstructions = 'Use a standard sans-serif font like Arial or Helvetica.';
  if (fonts.headingFont && fonts.bodyFont) {
      fontInstructions = `Use the font "${fonts.headingFont.name}" for all headings (h1, h2, h3, etc.) and "${fonts.bodyFont.name}" for all body text (p, li, a, etc.). You must apply these fonts in the CSS.`;
  } else if (fonts.headingFont) {
      fontInstructions = `Use the font "${fonts.headingFont.name}" for all text.`;
  } else if (fonts.bodyFont) {
      fontInstructions = `Use the font "${fonts.bodyFont.name}" for all text.`;
  }
  
  const contentAmountInstructions = {
    [ContentAmount.Small]: "Generate a very concise, single-section landing page. It should be a brief summary of the topic. Keep it short and to the point.",
    [ContentAmount.Medium]: "Generate a standard multi-section webpage with a hero, an introduction, 2-3 key topic sections, and a footer. This should feel like a well-rounded summary page.",
    [ContentAmount.Full]: "Generate a comprehensive and detailed webpage. Use the provided content to create multiple, in-depth sections covering the topic thoroughly. The structure should be deep, with headings and sub-headings, similar to a detailed article but formatted as a modern website.",
  }[contentAmount];

  let frameworkInstructions = '';
  switch (framework) {
    case Framework.Tailwind:
      frameworkInstructions = `Generate the code using Tailwind CSS. Use Tailwind CSS classes directly in the HTML for all styling. Do not write any custom CSS in a <style> block. The final output should be a single HTML file that includes the Tailwind CDN script: <script src="https://cdn.tailwindcss.com"></script>. Make sure to use the provided color palette in the Tailwind config or via arbitrary values. The font imports must be in the <head>.`;
      break;
    case Framework.PlainCSS:
      frameworkInstructions = `Generate all necessary CSS and include it within a single <style> tag in the <head> of the HTML file. The final output must be a single, self-contained HTML file. Do not use any external CSS frameworks. The font imports must be in the <head>.`;
      break;
    case Framework.React:
      frameworkInstructions = `Generate a single, self-contained HTML file for a lightweight React application. This file must include CDN links for React, ReactDOM, and Babel in the <head>. All generated React components should be placed inside a single <script type="text/babel"> tag. Render the main App component into a div with id="root". Do not use JSX in separate files. All styling must be done with inline style objects or a <style> tag in the head. The font imports must be in the <head>.`;
      break;
  }

  return `
    You are an expert web developer specializing in creating modern, responsive, and aesthetically pleasing websites.
    Your task is to generate the complete code for a single-page website based on the provided content and design specifications.
    The website should be dark-mode first, visually appealing, and well-structured.

    **Content Specifications:**
    1.  **Topic:** "${title}"
    2.  **Website Size:** ${contentAmountInstructions}
    3.  **Source Text:** You will be provided with cleaned text from a Wikipedia article. Use this to construct the website content.
    
    --- START OF CONTENT ---
    ${content}
    --- END OF CONTENT ---

    **Design Specifications:**
    1.  **Color Palette:** ${colorInstructions}
    2.  **Typography:** ${fontInstructions} You MUST include the following import(s) in the HTML <head>: ${Array.from(fontImports).join(' ')}
    3.  **Framework:** ${frameworkInstructions}

    **Requirements:**
    - The code must be in a single, complete HTML file.
    - The page must be responsive and look good on both desktop and mobile devices.
    - Create a compelling hero section that includes the title "${title}" and a brief, engaging summary.
    - Include a placeholder for a hero image: <div class="placeholder-image" style="height: 400px; background-color: ${colors[4] || colors[0]}; display:flex; align-items:center; justify-content:center; color:${colors[3] || '#94a3b8'};">Hero Image Placeholder</div>. This will be replaced later.
    - Structure the remaining content into logical sections with clear headings based on the "Website Size" instruction.
    - Add a simple footer with the text "Generated with AI Web Page Generator - A Tool By Skarvsladd Inc.".
    - The final HTML output should be clean, well-formatted, and ready to be rendered in a browser.
    - Do not include any placeholder comments like "<!-- your code here -->". Generate the full, complete code.
  `;
}

export const generateWebsiteCode = async (
  content: string,
  title: string,
  colors: string[],
  fonts: FontSelection,
  framework: Framework,
  contentAmount: ContentAmount
): Promise<string> => {
  try {
    const prompt = buildPrompt(content, title, colors, fonts, framework, contentAmount);
    
    // Use Pro for complex code generation
    const model = 'gemini-2.5-pro';

    const response = await ai.models.generateContent({
      model: model,
      // FIX: Simplified the 'contents' parameter to pass the prompt string directly, as per @google/genai guidelines for single-turn generation.
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html_code: {
              type: Type.STRING,
              description: 'The complete, single-file HTML code for the generated website.'
            }
          }
        }
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    if (result && result.html_code) {
      return result.html_code;
    } else {
      throw new Error("AI response did not contain valid HTML code.");
    }
  } catch (error) {
    console.error("Error generating website code:", error);
    throw new Error("Failed to generate website code with Gemini. Please check your API key and prompt.");
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    // Use Imagen for high-quality image generation
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    // Don't throw, just return null so the page can still be generated without an image.
    return null; 
  }
};