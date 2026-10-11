"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoadingBlock } from "@/components/ui/Alert";
import type { ReactNode } from "react";

export default function RequireAuth({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const router = useRouter();
  const { currentUser, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!currentUser || (adminOnly && !isAdmin)))
      router.replace(adminOnly ? "/" : "/login");
  }, [loading, currentUser, isAdmin, adminOnly, router]);

  if (loading || !currentUser || (adminOnly && !isAdmin))
    return <LoadingBlock label="Checking access permissions..." />;
  return <>{children}</>;
}
