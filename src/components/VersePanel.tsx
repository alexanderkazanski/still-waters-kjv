import { X } from "lucide-react";
import type { ReactNode } from "react";

export function VersePanel({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
      />
      <div className="animate-still relative flex max-h-[82vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-popover sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
