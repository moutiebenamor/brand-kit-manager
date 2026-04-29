import { useState } from 'react';
import { Copy, Check, Trash2, Edit3 } from 'lucide-react';
import useClipboard from '../hooks/useClipboard';

const categoryStyles = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  neutral: 'badge-neutral',
};

export default function ColorSwatch({ color, onUpdate, onDelete }) {
  const { copy, copied } = useClipboard();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: color.name, hex: color.hex, category: color.category });
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = (text, label) => {
    copy(text, label);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1500);
  };

  const handleSave = () => {
    onUpdate(color.id, { ...editData, css_variable: `--color-${editData.name.toLowerCase().replace(/\s+/g, '-')}` });
    setEditing(false);
  };

  // Calculate text color based on background luminance
  const getLuminance = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };
  const isLight = getLuminance(color.hex) > 0.5;

  if (editing) {
    return (
      <div className="glass-card p-4 animate-scale-in">
        <div className="space-y-3">
          <input
            value={editData.name}
            onChange={e => setEditData({ ...editData, name: e.target.value })}
            className="input-field"
            placeholder="Color name"
          />
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="color"
                value={editData.hex}
                onChange={e => setEditData({ ...editData, hex: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="input-field flex items-center gap-2">
                <div className="w-5 h-5 rounded-md border border-white/10" style={{ background: editData.hex }} />
                <span className="font-mono text-xs">{editData.hex}</span>
              </div>
            </div>
            <select
              value={editData.category}
              onChange={e => setEditData({ ...editData, category: e.target.value })}
              className="input-field w-32"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1">Save</button>
            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-hover group overflow-hidden animate-fade-in">
      {/* Color Preview */}
      <div
        className="h-28 relative cursor-pointer transition-all duration-300 group-hover:h-32"
        style={{ background: color.hex }}
        onClick={() => handleCopy(color.hex, 'Hex code')}
      >
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isLight ? 'bg-black/10' : 'bg-white/10'}`}>
          {justCopied ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isLight ? 'bg-black/20 text-black' : 'bg-white/20 text-white'} text-xs font-medium backdrop-blur-sm`}>
              <Check size={12} /> Copied!
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isLight ? 'bg-black/20 text-black' : 'bg-white/20 text-white'} text-xs font-medium backdrop-blur-sm`}>
              <Copy size={12} /> Copy Hex
            </div>
          )}
        </div>
      </div>

      {/* Color Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-white">{color.name}</h3>
            <p className="text-xs font-mono text-white/40 mt-0.5">{color.hex.toUpperCase()}</p>
          </div>
          <span className={categoryStyles[color.category] || 'badge-neutral'}>{color.category}</span>
        </div>

        {/* CSS Variable */}
        <button
          onClick={() => handleCopy(color.css_variable, 'CSS variable')}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-brand-bg text-xs font-mono text-white/40 hover:text-accent-primary transition-colors"
        >
          <Copy size={10} />
          <span className="truncate">{color.css_variable}</span>
        </button>

        {/* Actions */}
        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => { setEditData({ name: color.name, hex: color.hex, category: color.category }); setEditing(true); }} className="btn-ghost flex-1 flex items-center justify-center gap-1">
            <Edit3 size={12} /> Edit
          </button>
          <button onClick={() => onDelete(color.id)} className="btn-ghost text-red-400/60 hover:text-red-400 flex items-center justify-center gap-1">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
