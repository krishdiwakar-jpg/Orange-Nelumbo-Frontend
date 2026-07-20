import type { Metadata } from "next";

import { NotesShell } from "@/components/layout/notes-shell";

export const metadata: Metadata = {
  title: "Visual Notes",
  robots: { index: false, follow: false },
};

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <NotesShell>{children}</NotesShell>;
}
