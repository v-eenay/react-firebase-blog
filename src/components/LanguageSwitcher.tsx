import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' }
] as const;

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => setLanguage(e.target.value as typeof currentLanguage)}
      className="input-retro text-sm"
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}