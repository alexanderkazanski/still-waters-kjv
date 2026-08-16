import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Bookmark, Search, Share2, Shuffle } from "lucide-react";

import { VersePanel } from "@/components/VersePanel";
import { shareVerseImage } from "@/lib/share";
import { useFavorites, useReminder, useStreak } from "@/lib/storage";
import {
  byCategory,
  categories,
  findByReference,
  imageForVerse,
  randomVerse,
  searchVerses,
  verseOfTheDay,
  type Category,
  type Verse,
} from "@/lib/verses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Still Waters — A Daily KJV Verse in Quiet Light" },
      {
        name: "description",
        content:
          "A calm King James Version verse of the day over photorealistic landscapes. Browse by mood, save favorites, and share verses as images.",
      },
      { property: "og:title", content: "Still Waters — A Daily KJV Verse in Quiet Light" },
      {
        property: "og:description",
        content:
          "A calm King James Version verse of the day over photorealistic landscapes. Browse by mood, save favorites, and share.",
      },
    ],
  }),
  component: StillWaters,
});

function StillWaters() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [verse, setVerse] = useState<Verse>(() => verseOfTheDay());
  const [isDaily, setIsDaily] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);
  const [panel, setPanel] = useState<null | "search" | "favorites" | "reminder">(null);
  const [query, setQuery] = useState("");
  const [sharing, setSharing] = useState(false);

  const { favorites, toggle, isFavorite } = useFavorites();
  const streak = useStreak();
  const reminder = useReminder();

  const image = imageForVerse(verse);
  const pool = useMemo(() => byCategory(category), [category]);

  const show = useCallback((next: Verse, daily = false) => {
    setVerse(next);
    setIsDaily(daily);
    setFadeKey((k) => k + 1);
  }, []);

  useEffect(() => {
    Object.values(import.meta.glob("@/assets/*.jpg")).forEach((load) => void load());
  }, []);

  const results = useMemo(() => searchVerses(query), [query]);
  const savedVerses = favorites
    .map((r) => findByReference(r))
    .filter((v): v is Verse => Boolean(v));

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-scrim">
      <img
        key={image}
        src={image}
        alt=""
        width={1152}
        height={1536}
        className="animate-still absolute inset-0 size-full object-cover"
      />
      <div className="scrim-vertical absolute inset-0" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-6 pt-7 pb-8 sm:px-10">
        <header className="flex items-baseline justify-between">
          <h1 className="font-verse text-xl tracking-[0.28em] text-foreground/90 uppercase">
            Still Waters
          </h1>
          <span className="text-[11px] tracking-[0.18em] text-foreground/55 uppercase">
            {streak.days} day{streak.days === 1 ? "" : "s"}
          </span>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-14">
          <div key={fadeKey} className="animate-still max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.3em] text-foreground/60 uppercase">
              {isDaily ? "Verse of the day" : "King James Version"}
            </p>
            <blockquote className="font-verse mt-7 text-[clamp(1.9rem,6vw,3.4rem)] leading-[1.28] text-foreground">
              {verse.text}
            </blockquote>
            <p className="mt-8 text-xs tracking-[0.24em] text-foreground/75 uppercase">
              {verse.reference} · KJV
            </p>
          </div>
        </section>

        <nav className="-mx-6 mb-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden">
          {[{ id: "all" as const, label: "All" }, ...categories].map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setCategory(c.id);
                  const next = byCategory(c.id);
                  show(randomVerse(next, verse));
                }}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs tracking-[0.12em] uppercase transition-colors duration-500 ${
                  active
                    ? "border-transparent bg-foreground/90 text-primary-foreground"
                    : "border-border text-foreground/75 hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => show(randomVerse(pool, verse))}
            className="glass flex items-center gap-2 rounded-full px-6 py-3 text-xs tracking-[0.18em] text-foreground uppercase transition-colors duration-500 hover:bg-foreground/15"
          >
            <Shuffle className="size-3.5" /> New verse
          </button>
          <IconButton
            label={isFavorite(verse.reference) ? "Remove from favorites" : "Save verse"}
            onClick={() => toggle(verse.reference)}
          >
            <Bookmark
              className={`size-4 ${isFavorite(verse.reference) ? "fill-current" : ""}`}
            />
          </IconButton>
          <IconButton
            label="Share as image"
            onClick={async () => {
              setSharing(true);
              try {
                await shareVerseImage(verse, image);
              } finally {
                setSharing(false);
              }
            }}
          >
            <Share2 className={`size-4 ${sharing ? "opacity-40" : ""}`} />
          </IconButton>
          <IconButton label="Search verses" onClick={() => setPanel("search")}>
            <Search className="size-4" />
          </IconButton>
          <IconButton label="Daily reminder" onClick={() => setPanel("reminder")}>
            <Bell className="size-4" />
          </IconButton>
        </div>

        <footer className="mt-6 flex justify-center">
          <button
            onClick={() => setPanel("favorites")}
            className="text-[11px] tracking-[0.2em] text-foreground/55 uppercase transition-colors hover:text-foreground"
          >
            Favorites ({favorites.length})
          </button>
        </footer>
      </div>

      <VersePanel open={panel === "search"} title="Search" onClose={() => setPanel(null)}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Keyword, book, or reference — e.g. Psalm 23"
          className="w-full rounded-lg border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
        />
        <VerseList
          verses={results}
          empty={query ? "No verses found." : "Try “peace”, “John 3:16”, or “Isaiah”."}
          onSelect={(v) => {
            show(v);
            setPanel(null);
          }}
        />
      </VersePanel>

      <VersePanel open={panel === "favorites"} title="Favorites" onClose={() => setPanel(null)}>
        <VerseList
          verses={savedVerses}
          empty="Saved verses will gather here."
          onSelect={(v) => {
            show(v);
            setPanel(null);
          }}
        />
      </VersePanel>

      <VersePanel open={panel === "reminder"} title="Daily reminder" onClose={() => setPanel(null)}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Choose a time to be reminded of the day's verse while this tab is open.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="time"
            value={reminder.time ?? ""}
            onChange={(e) => reminder.save(e.target.value || null)}
            className="rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm text-foreground focus:border-ring focus:outline-none"
          />
          {reminder.time && (
            <button
              onClick={() => reminder.save(null)}
              className="text-xs tracking-[0.16em] text-muted-foreground uppercase hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          You have opened Still Waters on {streak.total} day{streak.total === 1 ? "" : "s"}.
        </p>
      </VersePanel>

      <ReminderTicker
        time={reminder.time}
        onFire={() => show(verseOfTheDay(), true)}
      />
    </main>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="glass rounded-full p-3 text-foreground/85 transition-colors duration-500 hover:bg-foreground/15 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function VerseList({
  verses,
  empty,
  onSelect,
}: {
  verses: Verse[];
  empty: string;
  onSelect: (v: Verse) => void;
}) {
  if (verses.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="mt-3 divide-y divide-border">
      {verses.map((v) => (
        <li key={v.reference}>
          <button
            onClick={() => onSelect(v)}
            className="w-full py-4 text-left transition-opacity hover:opacity-80"
          >
            <p className="font-verse text-lg leading-snug text-foreground">{v.text}</p>
            <p className="mt-2 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              {v.reference}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ReminderTicker({ time, onFire }: { time: string | null; onFire: () => void }) {
  useEffect(() => {
    if (!time) return;
    let fired = "";
    const id = window.setInterval(() => {
      const now = new Date();
      const stamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const key = `${now.toDateString()} ${stamp}`;
      if (stamp === time && fired !== key) {
        fired = key;
        onFire();
      }
    }, 20000);
    return () => window.clearInterval(id);
  }, [time, onFire]);
  return null;
}
