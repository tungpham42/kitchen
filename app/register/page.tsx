import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/AuthForms";
export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up để chia sẻ công thức và lưu giữ món ăn Việt.",
  openGraph: {
    title: "Sign up",
    description: "Sign up để chia sẻ công thức và lưu giữ món ăn Việt.",
    images: [
      {
        url: "/register.jpg",
        width: 1200,
        height: 630,
        alt: "Sign up để chia sẻ công thức và lưu giữ món ăn Việt.",
      },
    ],
  },
};
export default function RegisterPage() {
  return (
    <div className="py-8 sm:py-14">
      <RegisterForm />
    </div>
  );
}
