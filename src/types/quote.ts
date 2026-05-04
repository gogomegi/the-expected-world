export type Verdict = "came-true" | "partially-true" | "did-not-come-true" | "pending";

export type QuoteStatus = "draft" | "pending-review" | "published";

export type QuoteSource = "original" | "ai-generated" | "user-submission";

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
  status?: QuoteStatus;
  quoteSource?: QuoteSource;
}

export interface Submission {
  id: string;
  text: string;
  author: string;
  source: string;
  yearWritten: number;
  yearImagined?: string;
  topic?: string;
  sourceUrl?: string;
  annotation?: string;
  actualOutcome?: string;
  email?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}
