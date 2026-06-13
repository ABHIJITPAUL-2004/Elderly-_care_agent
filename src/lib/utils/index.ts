import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function averageNumber(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function uniqueStrings(values: string[]) {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

export function sortByDateDesc<T extends { recordedAt?: string; detectedAt?: string; createdAt?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftDate = left.recordedAt ?? left.detectedAt ?? left.createdAt ?? "";
    const rightDate = right.recordedAt ?? right.detectedAt ?? right.createdAt ?? "";

    return rightDate.localeCompare(leftDate);
  });
}
