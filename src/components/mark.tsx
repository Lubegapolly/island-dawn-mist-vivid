import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9", className)}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" className="fill-primary" />
      <path
        d="M20 7.5C15.4 14.8 12 19.4 12 25.2a8 8 0 0016 0c0-5.8-3.4-10.4-8-17.7z"
        className="fill-primary-fg"
      />
    </svg>
  );
}
