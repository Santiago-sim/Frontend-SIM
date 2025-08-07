// types/strapi.ts
export interface StrapiBlockBase {
    id: string;
    type: string;
    children: StrapiText[];
  }
  
  export interface StrapiText {
    text: string;
    type?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  }
  
  export interface StrapiParagraphBlock extends StrapiBlockBase {
    type: 'paragraph';
  }
  
  export interface StrapiHeadingBlock extends StrapiBlockBase {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
  }
  
  export interface StrapiListBlock extends StrapiBlockBase {
    type: 'list';
    format: 'ordered' | 'unordered';
  }
  
  export type StrapiBlock = StrapiParagraphBlock | StrapiHeadingBlock | StrapiListBlock;
  
  export interface StrapiContentRendererProps {
    content: StrapiBlock[];
  }