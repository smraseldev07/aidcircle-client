"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Toggles the `dark` class on <html> (the convention globals.css uses:
 * `@custom-variant dark (&:is(.dark *))`) and persists the choice.
 * The class itself is applied pre-hydration by the inline script in
 * app/layout.tsx so there is no flash; this button only flips it.
 */
export function ThemeToggle() {
  // Same "aidcircle:" prefix family as lib/events.ts.
  const STORAGE_KEY = "aidcircle:theme";

  function getTheme(): "light" | "dark" {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }

  function toggle() {
    const next = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {/* Both icons are rendered and CSS picks one via the dark variant,
          so the icon is correct even though the render is SSR'd. */}
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}
