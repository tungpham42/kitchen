"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
// Note: Ensure `facebookProvider` is initialized and exported in your client.ts file
import { auth, googleProvider, facebookProvider } from "@/lib/firebase/client";
import { createOrUpdateUser } from "@/lib/firebase/data";
import Icon from "@/components/ui/Icon";
import Alert from "@/components/ui/Alert";

function AuthCard({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const register = mode === "register";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (register && password !== repeatPassword)
      return setError("Passwords do not match.");
    if (register && username.trim().length > 20)
      return setError("Username must be 20 characters or fewer.");
    setBusy(true);
    try {
      if (register) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(credential.user, { displayName: username.trim() });
        await createOrUpdateUser(credential.user, {
          username: username.trim(),
          authProvider: "email",
        });
      } else {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await createOrUpdateUser(credential.user, { authProvider: "password" });
      }
      router.push("/");
    } catch {
      setError(
        register
          ? "Sign-up failed. Please check your information and try again."
          : "Invalid email or password.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await createOrUpdateUser(credential.user, { authProvider: "google.com" });
      router.push("/");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleFacebook() {
    setError("");
    setBusy(true);
    try {
      const credential = await signInWithPopup(auth, facebookProvider);
      await createOrUpdateUser(credential.user, {
        authProvider: "facebook.com",
      });
      router.push("/");
    } catch {
      setError("Facebook sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAnonymous() {
    setError("");
    setBusy(true);
    try {
      const credential = await signInAnonymously(auth);
      const guestName = `Guest ${credential.user.uid.slice(0, 5)}`;
      await updateProfile(credential.user, { displayName: guestName });
      await createOrUpdateUser(credential.user, {
        username: guestName,
        authProvider: "anonymous",
      });
      router.push("/");
    } catch {
      setError("Guest sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-[0_22px_70px_rgba(83,43,23,0.12)] sm:p-8">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-gold/20 text-lacquer">
          <Icon name={register ? "user-plus" : "login"} size={28} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-lacquer">
          {register ? "Create an account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {register
            ? "Sign up to share recipes and stories from the family table."
            : "Sign in to manage your recipes and join the discussion."}
        </p>
      </div>
      {error && (
        <div className="mb-4">
          <Alert tone="danger">{error}</Alert>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {register && (
          <label className="block">
            <span className="form-label">
              <Icon name="user" size={15} /> Username
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              required
              className="form-input"
              placeholder="e.g., Home Kitchen"
            />
          </label>
        )}
        <label className="block">
          <span className="form-label">
            <Icon name="mail" size={15} /> Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="ban@example.com"
          />
        </label>
        <label className="block">
          <span className="form-label">
            <Icon name="lock" size={15} /> Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="••••••••"
            minLength={6}
          />
        </label>
        {register && (
          <label className="block">
            <span className="form-label">
              <Icon name="lock" size={15} /> Confirm password
            </span>
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
              minLength={6}
            />
          </label>
        )}
        <button disabled={busy} className="btn-primary w-full justify-center">
          {busy ? (
            <span className="size-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
          ) : (
            <Icon name={register ? "user-plus" : "login"} size={17} />
          )}{" "}
          {register ? "Sign up" : "Sign in"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => void handleGoogle()}
          disabled={busy}
          className="btn-secondary w-full justify-center"
        >
          <span className="grid size-5 place-items-center rounded-full bg-white font-bold text-xs text-[#4285f4]">
            G
          </span>{" "}
          {register ? "Sign up with Google" : "Sign in with Google"}
        </button>
        <button
          type="button"
          onClick={() => void handleFacebook()}
          disabled={busy}
          className="btn-secondary w-full justify-center"
        >
          <span className="grid size-5 place-items-center rounded-full bg-[#1877F2] font-bold text-xs text-white">
            f
          </span>{" "}
          {register ? "Sign up with Facebook" : "Sign in with Facebook"}
        </button>
        <button
          type="button"
          onClick={() => void handleAnonymous()}
          disabled={busy}
          className="btn-secondary w-full justify-center"
        >
          <Icon name="user" size={17} /> Continue as a guest
        </button>
      </div>
    </div>
  );
}

export function LoginForm() {
  return <AuthCard mode="login" />;
}
export function RegisterForm() {
  return <AuthCard mode="register" />;
}
