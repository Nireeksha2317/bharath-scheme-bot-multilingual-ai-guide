import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  const current = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-3 gap-2 rounded-lg border-border/60 hover:bg-secondary/50 font-medium">
          <Globe className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">{current.native}</span>
          <span className="sm:hidden">{current.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-1 shadow-lg border-border/50">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`
              flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
              ${currentLang === lang.code ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}
            `}
          >
            <div className="flex flex-col">
              <span className="text-sm">{lang.native}</span>
              <span className="text-xs opacity-70">{lang.label}</span>
            </div>
            {currentLang === lang.code && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
