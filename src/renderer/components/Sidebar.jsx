import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  Palette, Type, Image, Mic, Download, Plus, ChevronDown,
  Layers, Trash2, Edit3, Check, X
} from 'lucide-react';
import useBrandStore from '../store/brandStore';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { path: '/', icon: Palette, label: 'Colors', desc: 'Palette editor' },
  { path: '/typography', icon: Type, label: 'Typography', desc: 'Font manager' },
  { path: '/assets', icon: Image, label: 'Assets', desc: 'Logo & icon vault' },
  { path: '/voice', icon: Mic, label: 'Voice', desc: 'Guidelines editor' },
  { path: '/export', icon: Download, label: 'Export', desc: 'CSS & tokens' },
];

export default function Sidebar() {
  const { brands, activeBrandId, setActiveBrand, createBrand, deleteBrand } = useBrandStore();
  const [brandOpen, setBrandOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const activeBrand = brands.find(b => b.id === activeBrandId);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createBrand({ name: newName.trim() });
    setNewName('');
    setCreating(false);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-light-brand-surface border-r border-light-brand-border flex flex-col z-40 dark:bg-brand-surface dark:border-brand-border">
      {/* App Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/20">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-light-brand-text-primary tracking-tight dark:text-white">Brand Kit</h1>
            <p className="text-[10px] text-light-brand-text-tertiary font-medium uppercase tracking-widest dark:text-white/40">Manager</p>
          </div>
        </div>
      </div>

      {/* Brand Selector */}
      <div className="px-4 mb-4">
        <div className="relative">
          <button
            id="brand-selector"
            onClick={() => setBrandOpen(!brandOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-light-brand-bg border border-light-brand-border hover:border-light-brand-border-light transition-colors text-sm dark:bg-brand-bg dark:border-brand-border dark:hover:border-brand-border-light"
          >
            <span className="text-light-brand-text-primary truncate dark:text-white/80">{activeBrand?.name || 'Select Brand'}</span>
            <ChevronDown size={14} className={`text-light-brand-text-tertiary transition-transform ${brandOpen ? 'rotate-180' : ''} dark:text-white/40`} />
          </button>

          {brandOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-light-brand-card border border-light-brand-border rounded-xl shadow-2xl overflow-hidden z-50 animate-scale-in dark:bg-brand-card dark:border-brand-border">
              {brands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => { setActiveBrand(brand.id); setBrandOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                    brand.id === activeBrandId
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-light-brand-text-secondary hover:bg-light-brand-hover dark:text-white/70 dark:hover:bg-brand-hover'
                  }`}
                >
                  <span className="truncate">{brand.name}</span>
                  {brand.id === activeBrandId && <Check size={14} />}
                </button>
              ))}
              <div className="border-t border-brand-border">
                {creating ? (
                  <div className="flex items-center gap-1 p-2">
                    <input
                      autoFocus
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreate()}
                      placeholder="Brand name..."
                      className="flex-1 px-2 py-1.5 bg-light-brand-bg border border-light-brand-border rounded-lg text-xs text-light-brand-text-primary outline-none focus:border-accent-primary/50 dark:bg-brand-bg dark:border-brand-border dark:text-white dark:focus:border-accent-primary/50"
                    />
                    <button onClick={handleCreate} className="p-1.5 text-accent-primary hover:bg-accent-primary/10 rounded-lg">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setCreating(false)} className="p-1.5 text-light-brand-text-tertiary hover:bg-light-brand-hover rounded-lg dark:text-white/40 dark:hover:bg-brand-hover">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCreating(true)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-light-brand-text-tertiary hover:text-accent-primary hover:bg-light-brand-hover transition-colors dark:text-white/50 dark:hover:text-accent-primary dark:hover:bg-brand-hover"
                  >
                    <Plus size={14} />
                    <span>New Brand</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ path, icon: Icon, label, desc }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                  : 'text-light-brand-text-secondary hover:text-light-brand-text-primary hover:bg-light-brand-hover border border-transparent dark:text-white/50 dark:hover:text-white/80 dark:hover:bg-brand-hover'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <div>
              <span className="font-medium">{label}</span>
              <p className="text-[10px] opacity-50 leading-tight">{desc}</p>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-light-brand-border space-y-3 dark:border-brand-border">
        <ThemeToggle />
        <div className="flex items-center justify-between text-[11px] text-light-brand-text-tertiary dark:text-white/30">
          <span>v1.0.0</span>
          <span>{brands.length} brand{brands.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </aside>
  );
}
