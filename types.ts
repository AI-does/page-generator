export interface Font {
  name: string;
  url: string;
}

export enum ContentAmount {
  Small = "Small (Summary)",
  Medium = "Medium (Multi-section)",
  Full = "Full (Comprehensive)",
}

export interface FontSelection {
  headingFont?: Font;
  bodyFont?: Font;
}

export enum Framework {
  Tailwind = "Tailwind CSS",
  PlainCSS = "Plain CSS",
  React = "Lightweight React",
}

export interface GeneratedCode {
  html: string;
  css: string;
  javascript: string;
}

export interface WikipediaContent {
  title: string;
  content: string;
  imageUrl?: string;
}
