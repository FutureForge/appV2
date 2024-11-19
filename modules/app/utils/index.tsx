import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function linearGenerate() {
  const linearTop = Math.floor(Math.random() * 360);
  const linearBottom = Math.floor(Math.random() * 360);

  if (linearTop === linearBottom) {
    return linearGenerate();
  }

  return `linear-gradient(180deg, hsl(${linearTop}, 100%, 50%), hsl(${linearBottom}, 100%, 50%))`;
}

