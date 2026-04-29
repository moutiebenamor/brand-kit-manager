import { Trash2, Edit3, Copy } from 'lucide-react';
import useClipboard from '../hooks/useClipboard';

const categoryLabels = {
  heading: 'Heading',
  body: 'Body',
  accent: 'Accent',
  mono: 'Monospace',
};

const sampleTexts = {
  heading: 'The quick brown fox jumps over the lazy dog',
  body: 'Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.',
  accent: 'Brand Identity & Design System',
  mono: 'const brand = { name: "MyBrand" };',
};

export default function FontPreview({ font, onDelete }) {
  const { copy } = useClipboard();

  const fontStyle = {
    fontFamily: `'${font.family}', sans-serif`,
    fontWeight: font.weight,
    fontStyle: font.style,
  };

  return (
    <div className="glass-card-hover p-5 group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{font.name}</h3>
          <p className="text-xs text-white/40 mt-0.5">
            {font.family} · {font.weight} · {font.style}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className={`badge ${font.category === 'heading' ? 'badge-primary' : font.category === 'body' ? 'badge-secondary' : 'badge-accent'}`}>
            {categoryLabels[font.category] || font.category}
          </span>
        </div>
      </div>

      {/* Font Preview */}
      <div className="rounded-xl bg-brand-bg p-4 mb-3">
        <p
          className={`text-white/80 leading-relaxed ${font.category === 'heading' ? 'text-2xl' : font.category === 'mono' ? 'text-sm' : 'text-base'}`}
          style={fontStyle}
        >
          {sampleTexts[font.category] || sampleTexts.body}
        </p>
      </div>

      {/* Size Scale Preview */}
      <div className="rounded-xl bg-brand-bg p-3 mb-3 flex items-baseline gap-4 overflow-hidden">
        {['12', '16', '20', '28', '36'].map(size => (
          <span key={size} className="text-white/40 whitespace-nowrap" style={{ ...fontStyle, fontSize: `${size}px` }}>
            Aa
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => copy(`font-family: '${font.family}', sans-serif;`, 'Font CSS')}
          className="btn-ghost flex items-center gap-1.5 text-xs"
        >
          <Copy size={12} /> Copy CSS
        </button>
        <button
          onClick={() => copy(font.family, 'Font family')}
          className="btn-ghost flex items-center gap-1.5 text-xs"
        >
          <Copy size={12} /> Family
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onDelete(font.id)}
          className="btn-ghost text-red-400/60 hover:text-red-400 flex items-center gap-1 text-xs"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
