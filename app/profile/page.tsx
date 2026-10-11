import type { Metadata } from "next";
import ProfilePage from "@/components/auth/ProfilePage";
export const metadata: Metadata = { title: "Profile" };
export default function ProfileRoute() {
  return <ProfilePage />;
}
