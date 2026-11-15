"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";

import { LogoMark } from "@/components/common/logo-mark";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError("Incorrect demo password. For this presentation build the password is 12345.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-bg px-5 py-16">
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(185,39,45,0.22),transparent_65%)] blur-2xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14 text-ink" />
          <h1 className="mt-5 font-display text-2xl font-semibold uppercase tracking-[0.2em]">DilRaaj Admin</h1>
          <p className="mt-2 text-sm text-muted">Content management for DilRaaj Gym &amp; Fitness Centre</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-8 shadow-soft">
          <label className="block">
            <span className="mb-2 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Demo password</span>
            <div className="flex items-center gap-3 rounded-lg border border-line bg-card px-3">
              <Lock className="h-4 w-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="•••••"
                autoComplete="current-password"
                className="w-full bg-transparent py-3 text-sm text-ink outline-none"
              />
            </div>
          </label>

          {error ? (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent-soft">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full disabled:opacity-60">
            {loading ? "Checking…" : "Enter dashboard"}
          </button>

          <p className="mt-6 rounded-lg border border-line bg-card px-4 py-3 text-xs leading-relaxed text-muted">
            <strong className="text-ink">Presentation demo.</strong> This password gate is intentionally simple and is
            not secure production authentication. A production deployment must use Supabase Auth (or equivalent) with
            database-level authorisation policies.
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          <a href="/" className="link-underline">← Back to the public website</a>
        </p>
      </div>
    </div>
  );
}
