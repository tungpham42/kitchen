import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/AuthForms";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to share recipes and preserve Vietnamese dishes.",
  openGraph: {
    title: "Sign in",
    description: "Sign in to share recipes and preserve Vietnamese dishes.",
    images: [
      {
        url: "/login.jpg",
        width: 1200,
        height: 630,
        alt: "Sign in to share recipes and preserve Vietnamese dishes.",
      },
    ],
  },
};
export default function LoginPage() {
  return (
    <div className="py-8 sm:py-14">
      <LoginForm />
    </div>
  );
}
