import type { Metadata } from "next";

import { ProfileView } from "@/components/account/profile-view";

export const metadata: Metadata = { title: "Student profile" };

export default function ProfilePage() {
  return <ProfileView />;
}
