import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Shield, Globe } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const [lang, setLang] = useState<"en" | "hi" | "mr">(() => (localStorage.getItem("lang") as any) || "en");
  const switchLang = () => {
    const next = lang === "en" ? "hi" : lang === "hi" ? "mr" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
    window.dispatchEvent(new CustomEvent("lang-change", { detail: next }));
  };

  const homeLabel = lang === "en" ? "Home" : lang === "hi" ? "होम" : "मुखपृष्ठ";
  const resultsLabel = lang === "en" ? "Results" : lang === "hi" ? "परिणाम" : "परिणाम";
  const langButtonLabel = lang === "en" ? "हिंदी" : lang === "hi" ? "मराठी" : "English";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-600 backdrop-blur-md border-blue-600 shadow-modern">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-white shadow-glow group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
              <Shield className="w-5 h-5 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <span className="text-xl text-white font-bold">
            eVote
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-all duration-300 hover:scale-105",
              location.pathname === "/"
                ? "text-white bg-blue-800 px-3 py-2 rounded-lg shadow-glow"
                : "text-white/90 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-lg"
            )}
          >
            {homeLabel}
          </Link>
          <Link
            to="/results"
            className={cn(
              "text-sm font-medium transition-all duration-300 hover:scale-105",
              location.pathname === "/results"
                ? "text-white bg-blue-800 px-3 py-2 rounded-lg shadow-glow"
                : "text-white/90 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-lg"
            )}
          >
            {resultsLabel}
          </Link>
          <Button
            variant="secondary"
            onClick={switchLang}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-glow"
          >
            <Globe className="w-4 h-4 mr-2" />
            {langButtonLabel}
          </Button>
        </nav>
      </div>
    </header>
  );
}
