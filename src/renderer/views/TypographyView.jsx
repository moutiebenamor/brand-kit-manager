import { useState, useEffect } from 'react';
import { Type, Plus, X, Check } from 'lucide-react';
import useBrandStore from '../store/brandStore';
import FontPreview from '../components/FontPreview';

const popularFonts = [
  { name: 'Inter', family: 'Inter', category: 'body' },
  { name: 'Roboto', family: 'Roboto', category: 'body' },
  { name: 'Poppins', family: 'Poppins', category: 'heading' },
  { name: 'Montserrat', family: 'Montserrat', category: 'heading' },
  { name: 'Open Sans', family: 'Open Sans', category: 'body' },
  { name: 'Playfair Display', family: 'Playfair Display', category: 'heading' },
  { name: 'Space Grotesk', family: 'Space Grotesk', category: 'heading' },
  { name: 'JetBrains Mono', family: 'JetBrains Mono', category: 'mono' },
  { name: 'Fira Code', family: 'Fira Code', category: 'mono' },
  { name: 'Outfit', family: 'Outfit', category: 'heading' },
  { name: 'DM Sans', family: 'DM Sans', category: 'body' },
  { name: 'Lora', family: 'Lora', category: 'heading' },
];

export default function TypographyView() {
  const { fonts, addFont, deleteFont, loadBrands } = useBrandStore();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', family: '', weight: '400', style: 'normal', category: 'heading', url: '' });
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => { loadBrands(); }, []);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.family.trim()) return;
    await addFont(form);
    setForm({ name: '', family: '', weight: '400', style: 'normal', category: 'heading', url: '' });
    setAdding(false);
  };

  const handleQuickAdd = async (font) => {
    await addFont({ ...font, name: font.name, weight: '400', style: 'normal' });
    setShowQuickAdd(false);
  };

  const headingFonts = fonts.filter(f => f.category === 'heading');
  const bodyFonts = fonts.filter(f => f.category === 'body');
  const accentFonts = fonts.filter(f => ['accent', 'mono'].includes(f.category));

  return (
    <div className="animate-fade-in p-10 pt-16 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Type size={28} className="text-accent-primary" />
            Typography
          </h1>
          <p className="section-subtitle">Manage your brand fonts and type scale</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowQuickAdd(!showQuickAdd)} className="btn-secondary text-sm">
            Quick Add
          </button>
          <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Font
          </button>
        </div>
      </div>

      {/* Quick Add Popular Fonts */}
      {showQuickAdd && (
        <div className="glass-card p-5 mb-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-3">Popular Fonts</h3>
          <div className="flex flex-wrap gap-2">
            {popularFonts.map(font => (
              <button
                key={font.family}
                onClick={() => handleQuickAdd(font)}
                className="px-3 py-2 rounded-xl bg-brand-bg border border-brand-border hover:border-accent-primary/30 text-sm text-white/70 hover:text-white transition-all"
                style={{ fontFamily: `'${font.family}', sans-serif` }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Font Form */}
      {adding && (
        <div className="glass-card p-5 mb-6 animate-scale-in">
          <h3 className="text-sm font-semibold text-white mb-4">Add Custom Font</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Font Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="e.g. Brand Heading" />
            </div>
            <div>
              <label className="label-text">Font Family</label>
              <input value={form.family} onChange={e => setForm({ ...form, family: e.target.value })}
                className="input-field" placeholder="e.g. Poppins" />
            </div>
            <div>
              <label className="label-text">Weight</label>
              <select value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="input-field">
                {['100', '200', '300', '400', '500', '600', '700', '800', '900'].map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="heading">Heading</option>
                <option value="body">Body</option>
                <option value="accent">Accent</option>
                <option value="mono">Monospace</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label-text">Google Fonts URL (optional)</label>
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                className="input-field" placeholder="https://fonts.googleapis.com/css2?family=..." />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="btn-primary">Add Font</button>
            <button onClick={() => setAdding(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Font Sections */}
      {headingFonts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Heading Fonts</h2>
          <div className="space-y-4">
            {headingFonts.map(font => <FontPreview key={font.id} font={font} onDelete={deleteFont} />)}
          </div>
        </div>
      )}

      {bodyFonts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Body Fonts</h2>
          <div className="space-y-4">
            {bodyFonts.map(font => <FontPreview key={font.id} font={font} onDelete={deleteFont} />)}
          </div>
        </div>
      )}

      {accentFonts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Accent & Mono Fonts</h2>
          <div className="space-y-4">
            {accentFonts.map(font => <FontPreview key={font.id} font={font} onDelete={deleteFont} />)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {fonts.length === 0 && !adding && (
        <div className="text-center py-20">
          <Type size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm mb-4">No fonts added yet. Start building your type system.</p>
          <button onClick={() => setShowQuickAdd(true)} className="btn-secondary">Browse Popular Fonts</button>
        </div>
      )}
    </div>
  );
}
