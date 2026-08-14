import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="relative flex items-center">
      <Globe className="absolute left-2 h-4 w-4 text-gold/70" />
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="pl-8 pr-3 py-1.5 bg-background border border-gold/25 rounded-md text-sm text-foreground hover:bg-muted/40 transition appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold"
      >
        <option value="en">EN</option>
        <option value="ar">AR</option>
        <option value="fr">FR</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}
