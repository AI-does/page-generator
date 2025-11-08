import { Font, Framework, ContentAmount } from './types';

export const GOOGLE_FONTS: Font[] = [
  { name: "Roboto", url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" },
  { name: "Open Sans", url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" },
  { name: "Lato", url: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" },
  { name: "Montserrat", url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" },
  { name: "Poppins", url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" },
  { name: "Source Code Pro", url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" },
  { name: "Geist", url: "https://cdn.jsdelivr.net/npm/geist@1/dist/fonts/geist-sans/geist-sans.css" },
];

export const FRAMEWORKS: Framework[] = [
  Framework.Tailwind,
  Framework.PlainCSS,
  Framework.React,
];

export const CONTENT_AMOUNTS: ContentAmount[] = [
  ContentAmount.Small,
  ContentAmount.Medium,
  ContentAmount.Full,
];

export const DEFAULT_COLORS = ['#0f172a', '#38bdf8', '#f1f5f9', '#94a3b8', '#1e293b'];
