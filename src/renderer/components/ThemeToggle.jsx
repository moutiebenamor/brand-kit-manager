import { Sun, Moon, Monitor } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-1 p-1 bg-light-brand-bg border border-light-brand-border rounded-xl dark:bg-brand-bg dark:border-brand-border">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
            ${theme === value 
              ? 'bg-accent-primary/15 text-accent-primary shadow-sm' 
              : 'text-light-brand-text-tertiary hover:text-light-brand-text-secondary hover:bg-light-brand-hover dark:text-white/40 dark:hover:text-white/60 dark:hover:bg-brand-hover'
            }
          `}
          title={`${label} theme${value === 'system' ? ` (${effectiveTheme})` : ''}`}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
