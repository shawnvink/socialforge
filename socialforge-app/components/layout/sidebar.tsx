"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers";
import {
  LayoutDashboard,
  Users,
  PenTool,
  Library,
  Settings,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Generate", href: "/generate", icon: PenTool },
  { name: "Profiles", href: "/profiles", icon: Users },
  { name: "Library", href: "/content", icon: Library },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen w-[280px] flex-col border-r border-border/50 bg-card/40 backdrop-blur-xl">
      {/* Logo */}
      <div className="px-7 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-400 shadow-lg shadow-primary/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">SocialForge</span>
            <span className="ml-2 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              v2
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/70 group-hover:text-foreground"
                )}
                strokeWidth={1.75}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-6 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="h-4.5 w-4.5" strokeWidth={1.75} />
          ) : (
            <Moon className="h-4.5 w-4.5" strokeWidth={1.75} />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3.5">
          <p className="text-[13px] font-semibold text-foreground/80">11 Platforms</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">47 Prompt Templates</p>
        </div>
      </div>
    </div>
  );
}
