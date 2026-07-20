import type { Metadata } from "next";

import { BookmarksView } from "@/components/account/bookmarks-view";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return <BookmarksView />;
}
