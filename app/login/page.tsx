import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/AuthForms";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in để chia sẻ công thức và lưu giữ món ăn Việt.",
  openGraph: {
    title: "Sign in",
    description: "Sign in để chia sẻ công thức và lưu giữ món ăn Việt.",
    images: [
      {
        url: "/dang-nhap.jpg",
        width: 1200,
        height: 630,
        alt: "Sign in để chia sẻ công thức và lưu giữ món ăn Việt.",
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
