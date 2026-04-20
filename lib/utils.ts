/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/cn — no dependency.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a number as BDT currency.
 */
export function formatBdt(amount: number): string {
  return `৳ ${amount.toLocaleString("en-BD")}`;
}
