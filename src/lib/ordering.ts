import fs from "fs";
import path from "path";

export interface HeroSlideConfig {
  slug: string;
  imageUrl: string;
  highlightPhrase: string;
  layout: "full" | "split";
  duotoneColor?: string;
}

const homepageFile = path.join(process.cwd(), "src/data/homepage-order.json");
const archiveFile = path.join(process.cwd(), "src/data/archive-order.json");

export function getHomepageOrder(): HeroSlideConfig[] {
  if (!fs.existsSync(homepageFile)) return [];
  return JSON.parse(fs.readFileSync(homepageFile, "utf-8"));
}

export function saveHomepageOrder(order: HeroSlideConfig[]): void {
  fs.writeFileSync(homepageFile, JSON.stringify(order, null, 2), "utf-8");
}

export function getArchiveOrder(): string[] {
  if (!fs.existsSync(archiveFile)) return [];
  return JSON.parse(fs.readFileSync(archiveFile, "utf-8"));
}

export function saveArchiveOrder(order: string[]): void {
  fs.writeFileSync(archiveFile, JSON.stringify(order, null, 2), "utf-8");
}
