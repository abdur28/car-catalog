"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/cars");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen noise-overlay">
      {/* Left half — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[oklch(0.12_0.01_60)]">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-accent" />
            <span className="text-sm tracking-[0.25em] uppercase text-[oklch(0.6_0.01_60)]">
              Est. 2025
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="font-display text-6xl leading-[1.1] text-[oklch(0.94_0.005_75)]">
            Japanese<br />
            Used Cars
          </h1>
          <div className="h-px w-24 bg-accent" />
          <p className="text-[oklch(0.55_0.01_60)] max-w-sm leading-relaxed">
            Curated listings sourced directly from Japan&apos;s premier
            automotive marketplace. Quality vehicles, verified data.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-[oklch(0.45_0.01_60)] text-xs tracking-wider uppercase">
          <span>CarSensor</span>
          <span className="h-3 w-px bg-[oklch(0.3_0.01_60)]" />
          <span>Tokyo</span>
          <span className="h-3 w-px bg-[oklch(0.3_0.01_60)]" />
          <span>Osaka</span>
        </div>

        {/* Decorative warm gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[oklch(0.72_0.17_55/8%)] to-transparent pointer-events-none" />
      </div>

      {/* Right half — login form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile branding */}
          <div className="lg:hidden space-y-3 text-center">
            <h1 className="font-display text-4xl">Car Catalog</h1>
            <p className="text-sm text-muted-foreground">
              Japanese Used Cars
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl lg:text-4xl">Sign in</h2>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access the catalog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs tracking-wider uppercase text-muted-foreground"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="h-12 bg-transparent border-border/60 focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs tracking-wider uppercase text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-transparent border-border/60 focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent text-[oklch(0.12_0.01_60)] hover:bg-[oklch(0.68_0.17_55)] font-semibold tracking-wide transition-all duration-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground/60 text-center">
              Powered by CarSensor data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
