import { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, RefreshCw, Plus, Download, Copy, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import chroma from 'chroma-js';

const SCALE_WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default function GeneratorPanel({ onGenerate }) {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [colorName, setColorName] = useState('Primary');
  const [isLocked, setIsLocked] = useState(false);
  const [palette, setPalette] = useState([]);
  const [accessibilityScore, setAccessibilityScore] = useState({ score: 0, level: 'AA' });
  const [showExport, setShowExport] = useState(false);

  // Generate palette whenever baseColor changes
  useEffect(() => {
    generatePalette();
  }, [baseColor]);

  const generatePalette = useCallback(() => {
    try {
      const hsl = chroma(baseColor).hsl();
      const newPalette = [];
      
      SCALE_WEIGHTS.forEach((weight, index) => {
        // Tailwind lightness mapping
        const lightnessMap = {
          50: 97, 100: 94, 200: 86, 300: 72,
          400: 55, 500: 40, 600: 32, 700: 24,
          800: 17, 900: 12, 950: 6
        };
        
        const lightness = lightnessMap[weight] / 100;
        const saturation = adjustSaturation(weight, hsl[1]);
        
        const color = chroma.hsl(hsl[0], saturation, lightness);
        newPalette.push({
          weight,
          hex: color.hex()
        });
      });
      
      setPalette(newPalette);
      calculateAccessibility(newPalette);
    } catch (err) {
      console.error('Failed to generate palette:', err);
    }
  }, [baseColor]);

  const adjustSaturation = (weight, baseSaturation) => {
    if (weight >= 800) return baseSaturation * 0.7;
    if (weight >= 600) return baseSaturation * 0.85;
    if (weight <= 100) return baseSaturation * 0.5;
    return baseSaturation;
  };

  const calculateAccessibility = (pal) => {
    const pairs = [
      { bg: pal[1]?.hex, text: pal[8]?.hex }, // 100 + 800
      { bg: pal[8]?.hex, text: pal[0]?.hex }, // 800 + 50
      { bg: pal[5]?.hex, text: pal[0]?.hex }, // 500 + 50
    ];

    let totalScore = 0;
    pairs.forEach(pair => {
      if (pair.bg && pair.text) {
        const contrast = chroma.contrast(pair.bg, pair.text);
        if (contrast >= 7.0) totalScore += 2;
        else if (contrast >= 4.5) totalScore += 1;
      }
    });

    const score = (totalScore / 6) * 100;
    setAccessibilityScore({ 
      score: Math.round(score), 
      level: totalScore >= 5 ? 'AAA' : totalScore >= 3 ? 'AA' : 'Fail' 
    });
  };

  const generateRandom = () => {
    const randomColor = chroma.random().hex();
    setBaseColor(randomColor);
  };

  const handleApply = async () => {
    try {
      await onGenerate(baseColor, colorName);
      toast.success(`${colorName} palette added to brand!`);
    } catch (err) {
      toast.error('Failed to add palette');
    }
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex}`);
  };

  const generateTailwindConfig = () => {
    const colors = palette.reduce((acc, { weight, hex }) => {
      acc[weight] = hex;
      return acc;
    }, {});

    return `colors: {
  '${colorName.toLowerCase()}': {
${Object.entries(colors).map(([w, h]) => `    ${w}: '${h}',`).join('\n')}
  }
}`;
  };

  const generateCSS = () => {
    return `:root {
${palette.map(({ weight, hex }) => `  --color-${colorName.toLowerCase()}-${weight}: ${hex};`).join('\n')}
}`;
  };

  const exportData = (format) => {
    const data = format === 'tailwind' ? generateTailwindConfig() : generateCSS();
    navigator.clipboard.writeText(data);
    toast.success(`${format === 'tailwind' ? 'Tailwind config' : 'CSS'} copied!`);
  };

  const getContrastInfo = (bg, text) => {
    if (!bg || !text) return { rating: 'Fail' };
    const contrast = chroma.contrast(bg, text);
    if (contrast >= 7.0) return { rating: 'AAA', contrast: contrast.toFixed(2) };
    if (contrast >= 4.5) return { rating: 'AA', contrast: contrast.toFixed(2) };
    return { rating: 'Fail', contrast: contrast.toFixed(2) };
  };

  return (
    <div className="w-[380px] flex flex-col h-full bg-[#0d0d0d] border-r border-white/5 p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Sparkles size={18} className="text-accent-primary" />
          <h2 className="text-lg font-bold text-white">Color Generator</h2>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
          accessibilityScore.level === 'AAA' ? 'bg-green-500/10 text-green-400' :
          accessibilityScore.level === 'AA' ? 'bg-blue-500/10 text-blue-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          <Shield size={12} />
          {accessibilityScore.level}
        </div>
      </div>

      {/* Color Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-16 rounded-2xl cursor-pointer border-0 p-0 overflow-hidden"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs text-white/50 uppercase font-semibold">Base Color</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={baseColor.toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(val)) setBaseColor(val.toLowerCase());
                }}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm uppercase outline-none focus:border-accent-primary/50"
              />
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`p-2 rounded-xl transition-all ${isLocked ? 'text-white bg-white/10' : 'text-white/30 hover:text-white/60'}`}
              >
                {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Color Name */}
        <div>
          <label className="text-xs text-white/50 uppercase font-semibold mb-1 block">Color Name</label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent-primary/50"
          />
        </div>
      </div>

      {/* Color Scale Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Scale Preview</h3>
          <span className="text-[10px] text-white/30">Click to copy</span>
        </div>
        
        <div className="grid grid-cols-11 gap-1">
          {palette.map(({ weight, hex }) => {
            const contrast = getContrastInfo(hex, '#ffffff');
            return (
              <div key={weight} className="flex flex-col items-center gap-1 group">
                <div
                  onClick={() => copyToClipboard(hex)}
                  className="w-full aspect-square rounded-lg border border-white/10 cursor-pointer transition-all hover:scale-110 hover:border-white/30 relative overflow-hidden"
                  style={{ backgroundColor: hex }}
                  title={`${weight}: ${hex}`}
                >
                  <span className={`absolute bottom-0.5 left-0.5 text-[6px] font-bold ${contrast.rating === 'AAA' ? 'text-white' : 'text-black/50'}`}>
                    {weight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Preview Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">UI Preview</h3>
        
        {/* Light Card */}
        <div 
          className="p-4 rounded-xl border"
          style={{ 
            backgroundColor: palette[1]?.hex || '#f5f5f5', 
            borderColor: palette[2]?.hex || '#e5e5e5'
          }}
        >
          <h4 className="text-sm font-bold mb-1" style={{ color: palette[8]?.hex || '#1a1a1a' }}>
            Card Title
          </h4>
          <p className="text-xs mb-2" style={{ color: palette[6]?.hex || '#666' }}>
            Preview text content
          </p>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ backgroundColor: palette[5]?.hex || '#6366f1' }}
          >
            Action
          </button>
        </div>

        {/* Dark Card */}
        <div 
          className="p-4 rounded-xl border"
          style={{ 
            backgroundColor: palette[8]?.hex || '#1a1a1a', 
            borderColor: palette[7]?.hex || '#333'
          }}
        >
          <h4 className="text-sm font-bold mb-1" style={{ color: palette[1]?.hex || '#f5f5f5' }}>
            Dark Mode
          </h4>
          <p className="text-xs mb-2" style={{ color: palette[3]?.hex || '#ccc' }}>
            Dark preview text
          </p>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ 
              backgroundColor: palette[4]?.hex || '#818cf8',
              color: palette[9]?.hex || '#000'
            }}
          >
            Action
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-2">
        <button
          onClick={() => setShowExport(!showExport)}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Copy size={14} />
          Export Code
        </button>
        
        {showExport && (
          <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => exportData('tailwind')}
                className="py-2 px-3 rounded-lg bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary text-xs font-medium transition-all"
              >
                Tailwind
              </button>
              <button
                onClick={() => exportData('css')}
                className="py-2 px-3 rounded-lg bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary text-xs font-medium transition-all"
              >
                CSS
              </button>
            </div>
            <pre className="p-2 bg-black/50 rounded-lg text-[9px] font-mono text-white/60 overflow-x-auto">
              {generateTailwindConfig()}
            </pre>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleApply}
          className="w-full py-3.5 bg-white text-black rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl shadow-white/5"
        >
          <Download size={16} />
          <span>Add to Brand Kit</span>
        </button>

        <button
          onClick={generateRandom}
          disabled={isLocked}
          className="w-full py-3 bg-[#1a1a1a] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#252525] active:scale-[0.98] transition-all border border-white/5 disabled:opacity-20"
        >
          <RefreshCw size={14} />
          <span>Random Color</span>
        </button>
      </div>

      <div className="flex-1" />

      {/* Keyboard Hint */}
      <div className="text-center">
        <span className="text-[10px] text-white/30">Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">Space</kbd> for random</span>
      </div>
    </div>
  );
}
