import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Plus } from 'lucide-react';

export default function ColorPicker({ onAdd }) {
  const [color, setColor] = useState('#6366f1');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('primary');
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      hex: color,
      category,
    });
    setName('');
    setColor('#6366f1');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        id="add-color-btn"
        onClick={() => setOpen(true)}
        className="glass-card border-dashed border-2 border-brand-border hover:border-accent-primary/40 flex flex-col items-center justify-center gap-2 min-h-[200px] transition-all duration-300 hover:bg-accent-glow group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-brand-hover group-hover:bg-accent-primary/20 flex items-center justify-center transition-colors">
          <Plus size={20} className="text-white/40 group-hover:text-accent-primary transition-colors" />
        </div>
        <span className="text-xs text-white/40 group-hover:text-white/60 font-medium">Add Color</span>
      </button>
    );
  }

  return (
    <div className="glass-card p-4 animate-scale-in">
      <HexColorPicker color={color} onChange={setColor} />

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl border border-brand-border shadow-lg" style={{ background: color }} />
          <input
            value={color}
            onChange={e => setColor(e.target.value)}
            className="input-field font-mono text-sm flex-1"
            placeholder="#000000"
          />
        </div>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="input-field"
          placeholder="Color name (e.g. Ocean Blue)"
          autoFocus
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input-field"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="accent">Accent</option>
          <option value="neutral">Neutral</option>
        </select>

        <div className="flex gap-2">
          <button onClick={handleAdd} className="btn-primary flex-1" disabled={!name.trim()}>
            Add Color
          </button>
          <button onClick={() => setOpen(false)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
