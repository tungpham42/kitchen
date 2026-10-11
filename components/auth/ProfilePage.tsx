"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import {
  fetchRecipesByUser,
  updateCommentsForUsername,
} from "@/lib/firebase/data";
import type { Recipe, SortOption } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import RequireAuth from "@/components/auth/RequireAuth";
import RecipeCard from "@/components/recipes/RecipeCard";
import Icon from "@/components/ui/Icon";
import Alert, { LoadingBlock } from "@/components/ui/Alert";
import ThemedSelect from "@/components/ui/ThemedSelect";

const DEFAULT_SORT: SortOption = "alphabetAsc";
const sortListeners = new Set<() => void>();

function getProfileSortOption(): SortOption {
  const stored = localStorage.getItem("profileSortOption");
  return stored === "alphabetAsc" ||
    stored === "alphabetDesc" ||
    stored === "dateAsc" ||
    stored === "dateDesc"
    ? stored
    : DEFAULT_SORT;
}

function subscribeToProfileSort(callback: () => void) {
  sortListeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === "profileSortOption" || event.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    sortListeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function setProfileSortOption(value: SortOption) {
  localStorage.setItem("profileSortOption", value);
  sortListeners.forEach((listener) => listener());
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}

function ProfileInner() {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const sort = useSyncExternalStore(
    subscribeToProfileSort,
    getProfileSortOption,
    () => DEFAULT_SORT,
  );
  const [username, setUsername] = useState(currentUser?.displayName ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser)
      void fetchRecipesByUser(currentUser.uid)
        .then(setRecipes)
        .finally(() => setLoading(false));
  }, [currentUser]);

  const sorted = useMemo(
    () =>
      [...recipes].sort((a, b) => {
        if (sort === "alphabetDesc")
          return b.title.localeCompare(a.title, "en");
        if (sort === "dateAsc")
          return (
            new Date(a.createdAt ?? 0).getTime() -
            new Date(b.createdAt ?? 0).getTime()
          );
        if (sort === "dateDesc")
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        return a.title.localeCompare(b.title, "en");
      }),
    [recipes, sort],
  );

  if (!currentUser) return null;

  async function updateName(e: FormEvent<HTMLFormElement>) {
    if (!currentUser) return;
    e.preventDefault();
    setError("");
    setNotice("");
    const value = username.trim();
    if (!value || value.length > 20)
      return setError("Username must be between 1 and 20 characters.");
    try {
      await updateProfile(currentUser, { displayName: value });
      await updateCommentsForUsername(currentUser.uid, value);
      setNotice("Username updated successfully.");
    } catch {
      setError("Failed to update username.");
    }
  }

  async function updatePass(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (newPassword !== confirmPassword)
      return setError("The new passwords do not match.");
    if (!currentUser || !auth.currentUser || !currentUser.email)
      return setError("Your session has expired.");
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice("Password updated successfully.");
    } catch {
      setError("Unable to change password. Please check your current password.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">
          <Icon name="user" size={15} /> Your profile
        </span>
        <h1 className="section-title">Profile</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your account details and the recipes you have shared.
        </p>
      </div>
      {(notice || error) && (
        <Alert tone={error ? "danger" : "success"}>{error || notice}</Alert>
      )}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="subheading text-lg">
              <Icon name="user" size={18} /> Account information
            </h2>
            <div className="mt-5 rounded-2xl bg-cream/60 p-4 text-sm">
              <div className="text-muted">Email</div>
              <div className="mt-1 font-semibold text-ink">
                {currentUser.email ?? "Guest account (anonymous)"}
              </div>
            </div>
            <form onSubmit={updateName} className="mt-4">
              <label className="block">
                <span className="form-label">Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  className="form-input"
                />
              </label>
              <button className="btn-primary mt-3">
                <Icon name="check" size={16} /> Save username
              </button>
            </form>
          </section>
          {currentUser.providerData.some(
            (provider) => provider.providerId === "password",
          ) && (
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="subheading text-lg">
                <Icon name="lock" size={18} /> Change password
              </h2>
              <form onSubmit={updatePass} className="mt-5 space-y-3">
                <input
                  className="form-input"
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  className="form-input"
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <input
                  className="form-input"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button className="btn-secondary">
                  <Icon name="lock" size={16} /> Update password
                </button>
              </form>
            </section>
          )}
        </div>
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="subheading text-lg">
                <Icon name="bowl" size={18} /> My recipes
              </h2>
              <p className="mt-1 text-sm text-muted">
                {recipes.length} recipes shared
              </p>
            </div>
            <ThemedSelect
              name="sortBy"
              ariaLabel="Sort by"
              value={sort}
              onChange={(value) => setProfileSortOption(value as SortOption)}
              options={[
                { value: "alphabetAsc", label: "Name: A → Z" },
                { value: "alphabetDesc", label: "Name: Z → A" },
                { value: "dateDesc", label: "Newest" },
                { value: "dateAsc", label: "Oldest" },
              ]}
              placeholder="Choose a sort order"
            />
          </div>
          {loading ? (
            <LoadingBlock />
          ) : sorted.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {sorted.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-cream/60 p-5 text-center text-sm text-muted">
              You have not shared any recipes yet.{" "}
              <Link href="/recipes/new" className="font-bold text-lacquer underline">
                Add your first recipe
              </Link>
              .
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
