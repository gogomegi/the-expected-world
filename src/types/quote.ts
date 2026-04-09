export type Verdict = "came-true" | "partially-true" | "did-not-come-true" | "pending";

export interface Quote {
  slug: string;
  text: string;
  author: string;
  authorSlug: string;
  source: string;
  sourceUrl?: string;
  yearWritten: number;
  yearImagined: string; // "2000s" or "2000" or "2000-2010"
  categories: string[];
  imageUrl?: string;
  imageCaption?: string;
  didItHoldUp?: {
    verdict: Verdict;
    analysis: string;
  };
}
