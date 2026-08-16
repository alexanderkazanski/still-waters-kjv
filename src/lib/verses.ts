import raw from "@/data/verses.json";

import comfortImg from "@/assets/comfort.jpg";
import strengthImg from "@/assets/strength.jpg";
import peaceImg from "@/assets/peace.jpg";
import guidanceImg from "@/assets/guidance.jpg";
import gratitudeImg from "@/assets/gratitude.jpg";
import hopeImg from "@/assets/hope.jpg";
import faithImg from "@/assets/faith.jpg";
import loveImg from "@/assets/love.jpg";

export type Category =
  | "comfort"
  | "strength"
  | "peace"
  | "guidance"
  | "gratitude"
  | "hope"
  | "faith"
  | "love";

export type Verse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  categories: Category[];
};

export const verses = raw as Verse[];

export const categories: { id: Category; label: string }[] = [
  { id: "comfort", label: "Comfort" },
  { id: "strength", label: "Strength" },
  { id: "peace", label: "Peace" },
  { id: "guidance", label: "Guidance" },
  { id: "gratitude", label: "Gratitude" },
  { id: "hope", label: "Hope" },
  { id: "faith", label: "Faith" },
  { id: "love", label: "Love" },
];

export const categoryImages: Record<Category, string> = {
  comfort: comfortImg,
  strength: strengthImg,
  peace: peaceImg,
  guidance: guidanceImg,
  gratitude: gratitudeImg,
  hope: hopeImg,
  faith: faithImg,
  love: loveImg,
};

export function imageForVerse(verse: Verse): string {
  return categoryImages[verse.categories[0] ?? "peace"];
}

export function byCategory(category: Category | "all"): Verse[] {
  if (category === "all") return verses;
  return verses.filter((v) => v.categories.includes(category));
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Deterministic verse for a given calendar day. */
export function verseOfTheDay(date = new Date()): Verse {
  return verses[hashString(dayKey(date)) % verses.length]!;
}

export function randomVerse(pool: Verse[], exclude?: Verse): Verse {
  const list = exclude && pool.length > 1 ? pool.filter((v) => v.reference !== exclude.reference) : pool;
  return list[Math.floor(Math.random() * list.length)]!;
}

export function searchVerses(query: string): Verse[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return verses
    .filter(
      (v) =>
        v.text.toLowerCase().includes(q) ||
        v.reference.toLowerCase().includes(q) ||
        v.book.toLowerCase().includes(q),
    )
    .slice(0, 40);
}

export function findByReference(reference: string): Verse | undefined {
  return verses.find((v) => v.reference === reference);
}
