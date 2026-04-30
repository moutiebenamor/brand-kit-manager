import { useState } from 'react';
import { Type, Eye, EyeOff, Download, Copy, Shield } from 'lucide-react';
import { toast } from 'sonner';
import useThemeStore from '../store/themeStore';

const headingLevels = [
  { level: 'H1', size: 'text-4xl', weight: 'font-bold', sample: 'The quick brown fox' },
  { level: 'H2', size: 'text-3xl', weight: 'font-bold', sample: 'The quick brown fox' },
  { level: 'H3', size: 'text-2xl', weight: 'font-semibold', sample: 'The quick brown fox' },
  { level: 'H4', size: 'text-xl', weight: 'font-semibold', sample: 'The quick brown fox' },
  { level: 'H5', size: 'text-lg', weight: 'font-medium', sample: 'The quick brown fox' },
  { level: 'H6', size: 'text-base', weight: 'font-medium', sample: 'The quick brown fox' },
];

const bodySizes = [
  { label: 'Large', size: 'text-lg', sample: 'Body text for important content' },
  { label: 'Base', size: 'text-base', sample: 'Body text for standard content' },
  { label: 'Small', size: 'text-sm', sample: 'Body text for secondary content' },
  { label: 'XSmall', size: 'text-xs', sample: 'Body text for captions' },
];

export default function TypeScalePreview({ fonts }) {
  const { effectiveTheme } = useThemeStore();
  const [showDarkPreview, setShowDarkPreview] = useState(false);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [accessibilityScore, setAccessibilityScore] = useState({ score: 0, level: 'AA' });

  const headingFont = fonts.find(f => f.category === 'heading') || { family: 'Inter' };
  const bodyFont = fonts.find(f => f.category === 'body') || { family: 'Inter' };

  const calculateAccessibility = () => {
    // Simple accessibility check based on font sizes
    const headingSize = 24; // approximate px for H1
    const bodySize = 16; // approximate px for body
    
    let score = 0;
    if (headingSize >= 18) score += 2;
    if (bodySize >= 16) score += 2;
    if (lineHeight >= 1.4) score += 1;
    if (letterSpacing >= 0) score += 1;

    setAccessibilityScore({
      score: (score / 6) * 100,
      level: score >= 5 ? 'AAA' : score >= 3 ? 'AA' : 'Fail'
    });
  };

  const exportAsCSS = () => {
    const css = `:root {
  --font-heading: '${headingFont.family}', sans-serif;
  --font-body: '${bodyFont.family}', sans-serif;
  --line-height: ${lineHeight};
  --letter-spacing: ${letterSpacing}em;
}`;
    navigator.clipboard.writeText(css);
    toast.success('CSS variables copied!');
  };

  const exportAsTailwind = () => {
    const tailwind = `theme: {
  extend: {
    fontFamily: {
      heading: ['${headingFont.family}', 'sans-serif'],
      body: ['${bodyFont.family}', 'sans-serif'],
    },
    lineHeight: {
      base: ${lineHeight},
    },
    letterSpacing: {
      base: '${letterSpacing}em',
    },
  }
}`;
    navigator.clipboard.writeText(tailwind);
    toast.success('Tailwind config copied!');
  };

  return (
    <div className="space-y-4">
      {/* Header with accessibility score */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Live Type Scale</h3>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
            accessibilityScore.level === 'AAA' ? 'bg-green-500/10 text-green-400' :
            accessibilityScore.level === 'AA' ? 'bg-blue-500/10 text-blue-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            <Shield size={10} />
            {accessibilityScore.level}
          </div>
          <button
            onClick={() => setShowDarkPreview(!showDarkPreview)}
            className={`p-1.5 rounded-lg transition-all ${showDarkPreview ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
          >
            {showDarkPreview ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
        <div className="flex-1">
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">Line Height</label>
          <input
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={lineHeight}
            onChange={(e) => {
              setLineHeight(parseFloat(e.target.value));
              calculateAccessibility();
            }}
            className="w-full accent-accent-primary"
          />
          <span className="text-xs text-white/60 font-mono">{lineHeight}</span>
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">Letter Spacing</label>
          <input
            type="range"
            min="-0.05"
            max="0.1"
            step="0.01"
            value={letterSpacing}
            onChange={(e) => {
              setLetterSpacing(parseFloat(e.target.value));
              calculateAccessibility();
            }}
            className="w-full accent-accent-primary"
          />
          <span className="text-xs text-white/60 font-mono">{letterSpacing}em</span>
        </div>
      </div>

      {/* Preview Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Light Preview */}
        <div 
          className="p-4 rounded-xl border transition-all"
          style={{ 
            backgroundColor: '#ffffff',
            borderColor: '#e5e5e5',
            opacity: showDarkPreview ? 0.3 : 1
          }}
        >
          <div className="text-[10px] text-gray-400 uppercase font-semibold mb-3">Light Mode</div>
          <div className="space-y-3">
            {headingLevels.map((h) => (
              <div key={h.level} className="flex items-baseline gap-2">
                <span className="text-[10px] text-gray-400 font-mono w-6">{h.level}</span>
                <span 
                  className={`${h.size} ${h.weight}`}
                  style={{ 
                    fontFamily: `'${headingFont.family}', sans-serif`,
                    lineHeight,
                    letterSpacing: `${letterSpacing}em`
                  }}
                >
                  {h.sample}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200">
              {bodySizes.map((b) => (
                <div key={b.label} className="flex items-baseline gap-2">
                  <span className="text-[10px] text-gray-400 font-mono w-12">{b.label}</span>
                  <span 
                    className={b.size}
                    style={{ 
                      fontFamily: `'${bodyFont.family}', sans-serif`,
                      lineHeight,
                      letterSpacing: `${letterSpacing}em`
                    }}
                  >
                    {b.sample}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dark Preview */}
        <div 
          className="p-4 rounded-xl border transition-all"
          style={{ 
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            opacity: showDarkPreview ? 1 : 0.3
          }}
        >
          <div className="text-[10px] text-gray-500 uppercase font-semibold mb-3">Dark Mode</div>
          <div className="space-y-3">
            {headingLevels.map((h) => (
              <div key={h.level} className="flex items-baseline gap-2">
                <span className="text-[10px] text-gray-500 font-mono w-6">{h.level}</span>
                <span 
                  className={`${h.size} ${h.weight}`}
                  style={{ 
                    fontFamily: `'${headingFont.family}', sans-serif`,
                    lineHeight,
                    letterSpacing: `${letterSpacing}em`
                  }}
                >
                  {h.sample}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-700">
              {bodySizes.map((b) => (
                <div key={b.label} className="flex items-baseline gap-2">
                  <span className="text-[10px] text-gray-500 font-mono w-12">{b.label}</span>
                  <span 
                    className={b.size}
                    style={{ 
                      fontFamily: `'${bodyFont.family}', sans-serif`,
                      lineHeight,
                      letterSpacing: `${letterSpacing}em`
                    }}
                  >
                    {b.sample}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex gap-2">
        <button
          onClick={exportAsCSS}
          className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Copy size={12} />
          Copy CSS
        </button>
        <button
          onClick={exportAsTailwind}
          className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Download size={12} />
          Copy Tailwind
        </button>
      </div>
    </div>
  );
}
