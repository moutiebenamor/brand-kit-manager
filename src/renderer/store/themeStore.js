import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'dark', // 'dark' | 'light' | 'system'
      systemTheme: 'dark', // Actual system preference
      
      // Computed
      get effectiveTheme() {
        const { theme, systemTheme } = get();
        return theme === 'system' ? systemTheme : theme;
      },
      
      get isDark() {
        return get().effectiveTheme === 'dark';
      },
      
      // Actions
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        applyThemeClass(newTheme === 'system' ? get().systemTheme : newTheme);
      },
      
      toggleTheme: () => {
        const current = get().effectiveTheme;
        const newTheme = current === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        applyThemeClass(newTheme);
      },
      
      setSystemTheme: (systemTheme) => {
        set({ systemTheme });
        if (get().theme === 'system') {
          applyThemeClass(systemTheme);
        }
      },
      
      initializeTheme: () => {
        // Detect system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        
        // Listen for system theme changes
        mediaQuery.addEventListener('change', (e) => {
          get().setSystemTheme(e.matches ? 'dark' : 'light');
        });
        
        set({ systemTheme });
        
        // Apply stored or system theme
        const effectiveTheme = get().theme === 'system' ? systemTheme : get().theme;
        applyThemeClass(effectiveTheme);
      },
    }),
    {
      name: 'brand-kit-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Helper function to apply theme class to document
function applyThemeClass(theme) {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.content = theme === 'dark' ? '#0a0a0f' : '#ffffff';
  }
}

export default useThemeStore;
