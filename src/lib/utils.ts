import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Robustly parses JSON from a string, handling markdown blocks, 
 * double-stringification, and extra whitespace.
 */
export function parseDynamicJSON<T>(input: any): T | null {
  if (!input) return null;

  // If already an object, return it (but check if it's a double-stringified object)
  if (typeof input === 'object') {
    return input as T;
  }

  if (typeof input !== 'string') return null;

  let cleaned = input.trim();

  // Handle Markdown code blocks (e.g., ```json ... ``` or ``` ... ```)
  const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    cleaned = markdownMatch[1].trim();
  }

  try {
    // Attempt first parse
    let parsed = JSON.parse(cleaned);

    // Check for double stringification
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        // Not double stringified or second parse failed, keep first result
      }
    }

    return parsed as T;
  } catch (e) {
    // Last ditch effort: try to find anything between { and }
    try {
      const braceMatch = cleaned.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        return JSON.parse(braceMatch[0]) as T;
      }
    } catch (e2) {
      // Ignore
    }

    return null;
  }
}
