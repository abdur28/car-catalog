"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export function Header({ username }: { username?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <Link href="/cars" className="flex items-center gap-3 group">
          <div className="h-6 w-1 rounded-full bg-accent transition-all group-hover:h-7" />
          <span className="font-display text-xl tracking-tight">
            Car Catalog
          </span>
        </Link>

        {username && (
          <div className="flex items-center gap-4">
            <span className="text-xs tracking-wider uppercase text-muted-foreground hidden sm:inline">
              {username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline text-xs tracking-wide">
                Logout
              </span>
            </Button>
          </div>
        )}
      </div>
      {/* Warm accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </header>
  );
}
