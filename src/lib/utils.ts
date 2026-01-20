import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isShortcodePresent(url: string) {
  // Support /p/, /reel/, /tv/ (IGTV), and /stories/username/shortcode patterns
  const regex = /\/(p|reel|tv)\/([a-zA-Z0-9_-]+)\/?|\/stories\/[^\/]+\/([0-9]+)/;
  const match = url.match(regex);

  if (match && (match[2] || match[3])) {
    return true;
  }

  return false;
}

export function getPostShortcode(url: string): string | null {
  // Support /p/, /reel/, /tv/ (IGTV), and /stories/username/shortcode patterns
  const regex = /\/(p|reel|tv)\/([a-zA-Z0-9_-]+)\/?|\/stories\/[^\/]+\/([0-9]+)/;
  const match = url.match(regex);

  if (match && (match[2] || match[3])) {
    // Return shortcode from either post/reel/tv (match[2]) or story (match[3])
    const shortcode = match[2] || match[3];
    return shortcode;
  } else {
    return null;
  }
}
