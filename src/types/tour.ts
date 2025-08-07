// types/tour.ts
import { StrapiBlock } from './strapi';

export interface TourData {
  documentId: string;
  name: string;
  description: string;
  longDescription: StrapiBlock[];
  price: number;
  priceChildren?: number;
  duration: string;
  includes: StrapiBlock[];
  notIncludes: StrapiBlock[];
  recommendations: StrapiBlock[];
  image: string;
}

export interface TourHeroSectionProps {
  image: string;
  name: string;
  description: string;
  duration: string;
}