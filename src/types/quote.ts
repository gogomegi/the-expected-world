export type Verdict = "came-true" | "partially-true" | "did-not-come-true" | "pending";

export type EntryStatus = "draft" | "pending-review" | "published";

export type EntrySource = "original" | "ai-generated" | "user-submission";

export type VerificationStatus = "verified" | "paraphrased" | "unverified" | "fabricated";

/**
 * Unified data model for all prediction entries.
 * Merges the former Entry (corpus.json) and Quote (quotes/*.json) types.
 */
export interface Entry {
  slug: string;
  text: string;
  author: string;
  authorSlug: string;
  source: string;
  sourceUrl?: string;
  yearWritten: number;
  yearImagined: string;            // flexible: "2000", "2000s", "2000-2010"
  predictedDateNormalized: string; // YYYY-MM-DD for sorting/filtering
  categories: string[];
  annotation?: string;
  tags?: string[];
  imageUrl?: string;
  imageCaption?: string;
  didItHoldUp?: {
    verdict: Verdict;
    analysis: string;
  };
  status: EntryStatus;
  quoteSource?: EntrySource;
  verificationStatus?: VerificationStatus;
  verificationNote?: string;
  isFiction?: boolean;
}

/** Kept for backwards compat — prefer Entry */
export type Quote = Entry;

/** @deprecated Use EntryStatus */
export type QuoteStatus = EntryStatus;

/** @deprecated Use EntrySource */
export type QuoteSource = EntrySource;

export interface Submission {
  id: string;
  text: string;
  author: string;
  source: string;
  yearWritten: number;
  yearImagined?: string;
  topic?: string;
  sourceUrl?: string;
  email?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}
