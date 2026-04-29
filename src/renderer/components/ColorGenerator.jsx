import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Copy, Lock, Unlock, RefreshCw, Download, 
  Eye, Palette, Type, Layout, FormInput, 
  Check, X, ChevronDown, ChevronRight,
  Sparkles, Shield, Code, FileJson
} from 'lucide-react';
import { toast } from 'sonner';
import chroma from 'chroma-js';

// Tailwind's standard lightness mapping for 11 shades
const LIGHTNESS_MAP = {
  50: 97, 100: 94, 200: 86, 300: 72,
  400: 55, 500: 40, 600: 32, 700: 24,
  800: 17, 900: 12, 950: 6
};

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default function ColorGenerator({ onAddToBrand }) {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [colorName, setColorName] = useState('Primary');
  const [palette, setPalette] = useState({});
  const [lockedShades, setLockedShades] = useState({});
  const [activePreview, setActivePreview] = useState('card');
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState('tailwind');
  const [accessibilityScore, setAccessibilityScore] = useState({ score: 0, level: 'AA' });

  // Generate palette whenever baseColor changes
  useEffect(() => {
    generatePalette();
  }, [baseColor, lockedShades]);

  const generatePalette = useCallback(() => {
    try {
      const hsl = chroma(baseColor).hsl();
      const newPalette = {};
      
      SHADES.forEach(shade => {
        // If shade is locked, keep the existing color
        if (lockedShades[shade]) {
          newPalette[shade] = palette[shade] || baseColor;
          return;
        }

        const lightness = LIGHTNESS_MAP[shade] / 100;
        const saturation = adjustSaturation(shade, hsl[1]);
        
        const color = chroma.hsl(hsl[0], saturation, lightness);
        newPalette[shade] = color.hex();
      });
      
      setPalette(newPalette);
      calculateAccessibility(newPalette);
    } catch (err) {
      console.error('Failed to generate palette:', err);
    }
  }, [baseColor, lockedShades, palette]);

  const adjustSaturation = (shade, baseSaturation) => {
    // Darker shades need less saturation
    if (shade >= 800) return baseSaturation * 0.7;
    if (shade >= 600) return baseSaturation * 0.85;
    if (shade <= 100) return baseSaturation * 0.5;
    return baseSaturation;
  };

  const calculateAccessibility = (pal) => {
    const pairs = [
      { bg: pal[100], text: pal[900], name: 'Light bg + Dark text' },
      { bg: pal[800], text: pal[50], name: 'Dark bg + Light text' },
      { bg: pal[500], text: pal[50], name: 'Primary button' },
    ];

    let totalScore = 0;
    pairs.forEach(pair => {
      if (pair.bg && pair.text) {
        const contrast = chroma.contrast(pair.bg, pair.text);
        if (contrast >= 7.0) totalScore += 2;  // AAA
        else if (contrast >= 4.5) totalScore += 1; // AA
      }
    });

    const score = (totalScore / 6) * 100;
    setAccessibilityScore({ 
      score: Math.round(score), 
      level: totalScore >= 5 ? 'AAA' : totalScore >= 3 ? 'AA' : 'Fail' 
    });
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setBaseColor(value.toLowerCase());
    }
  };

  const generateRandom = () => {
    const randomColor = chroma.random().hex();
    setBaseColor(randomColor);
  };

  const toggleLockShade = (shade) => {
    setLockedShades(prev => ({
      ...prev,
      [shade]: !prev[shade]
    }));
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex}`);
  };

  const generateTailwindConfig = () => {
    const colors = SHADES.reduce((acc, shade) => {
      acc[shade] = palette[shade];
      return acc;
    }, {});

    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${colorName.toLowerCase()}': {
${SHADES.map(s => `          ${s}: '${palette[s]}',`).join('\n')}
        }
      }
    }
  }
}`;
  };

  const generateCSS = () => {
    return `:root {
${SHADES.map(s => `  --color-${colorName.toLowerCase()}-${s}: ${palette[s]};`).join('\n')}
}

.btn-${colorName.toLowerCase()} {
  background-color: var(--color-${colorName.toLowerCase()}-500);
  color: var(--color-${colorName.toLowerCase()}-50);
}

.btn-${colorName.toLowerCase()}:hover {
  background-color: var(--color-${colorName.toLowerCase()}-600);
}`;
  };

  const exportData = () => {
    const data = exportFormat === 'tailwind' ? generateTailwindConfig() : generateCSS();
    navigator.clipboard.writeText(data);
    toast.success(`${exportFormat === 'tailwind' ? 'Tailwind config' : 'CSS variables'} copied!`);
    setShowExport(false);
  };

  const handleAddToBrand = () => {
    if (onAddToBrand) {
      onAddToBrand({
        name: colorName,
        palette: palette
      });
    }
    toast.success(`Added ${colorName} palette to brand!`);
  };

  const getContrastInfo = (bg, text) => {
    const contrast = chroma.contrast(bg, text);
    let rating = 'Fail';
    if (contrast >= 7.0) rating = 'AAA';
    else if (contrast >= 4.5) rating = 'AA';
    return { contrast: contrast.toFixed(2), rating };
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Color Generator</h1>
          <p className="text-white/50 mt-1">Create beautiful Tailwind-compatible color palettes</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Accessibility Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            accessibilityScore.level === 'AAA' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
            accessibilityScore.level === 'AA' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
            'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <Shield size={16} />
            <span className="text-sm font-semibold">{accessibilityScore.level}</span>
            <span className="text-xs opacity-70">({accessibilityScore.score}%)</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Controls */}
        <div className="space-y-6">
          {/* Color Input Section */}
          <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette size={16} />
              Base Color
            </h2>
            
            {/* Color Picker */}
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
                <label className="text-xs text-white/50 uppercase font-semibold">HEX</label>
                <input
                  type="text"
                  value={baseColor.toUpperCase()}
                  onChange={handleColorChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm uppercase outline-none focus:border-accent-primary/50"
                  placeholder="#6366F1"
                />
              </div>
            </div>

            {/* Color Name */}
            <div className="space-y-2">
              <label className="text-xs text-white/50 uppercase font-semibold">Color Name</label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent-primary/50"
                placeholder="Primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={generateRandom}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={14} />
                Random
              </button>
              <button
                onClick={() => setShowExport(!showExport)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Code size={14} />
                Export
              </button>
            </div>

            {/* Export Panel */}
            {showExport && (
              <div className="p-4 bg-black/50 rounded-xl border border-white/10 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportFormat('tailwind')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      exportFormat === 'tailwind' 
                        ? 'bg-accent-primary text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <FileJson size={12} className="inline mr-1" />
                    Tailwind
                  </button>
                  <button
                    onClick={() => setExportFormat('css')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      exportFormat === 'css' 
                        ? 'bg-accent-primary text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Code size={12} className="inline mr-1" />
                    CSS
                  </button>
                </div>
                <pre className="p-3 bg-black/50 rounded-lg text-[10px] font-mono text-white/70 overflow-x-auto max-h-40 overflow-y-auto">
                  {exportFormat === 'tailwind' ? generateTailwindConfig() : generateCSS()}
                </pre>
                <button
                  onClick={exportData}
                  className="w-full py-2 bg-accent-primary hover:bg-accent-primary/80 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Copy size={14} />
                  Copy to Clipboard
                </button>
              </div>
            )}

            {/* Add to Brand Button */}
            <button
              onClick={handleAddToBrand}
              className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
            >
              <Download size={16} />
              Add to Brand Kit
            </button>
          </div>

          {/* Preview Tabs */}
          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Live Previews</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'card', icon: Layout, label: 'Card' },
                { id: 'dashboard', icon: Eye, label: 'Dashboard' },
                { id: 'form', icon: FormInput, label: 'Forms' },
                { id: 'typography', icon: Type, label: 'Typography' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActivePreview(id)}
                  className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    activePreview === id
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Palette Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Palette Swatches */}
          <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Color Scale</h2>
              <span className="text-xs text-white/40">Click to copy • Lock to fix</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {SHADES.map(shade => {
                const color = palette[shade] || baseColor;
                const isLocked = lockedShades[shade];
                const contrast = getContrastInfo(color, '#ffffff');
                
                return (
                  <div
                    key={shade}
                    className="group relative"
                  >
                    <div
                      onClick={() => copyToClipboard(color)}
                      className="cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-105"
                      style={{ backgroundColor: color }}
                    >
                      {/* Color Box */}
                      <div className="aspect-square relative">
                        {/* Lock Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLockShade(shade);
                          }}
                          className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all ${
                            isLocked 
                              ? 'bg-white/20 text-white' 
                              : 'bg-black/20 text-white/60 opacity-0 group-hover:opacity-100 hover:bg-black/40'
                          }`}
                        >
                          {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                        </button>
                        
                        {/* Shade Label */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className={`text-xs font-black ${contrast.rating === 'AAA' ? 'text-white' : 'text-black/70'}`}>
                            {shade}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* HEX Value */}
                    <div className="mt-2 flex items-center justify-between">
                      <code className="text-[10px] font-mono text-white/50 uppercase">
                        {color.replace('#', '')}
                      </code>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                        contrast.rating === 'AAA' ? 'bg-green-500/20 text-green-400' :
                        contrast.rating === 'AA' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {contrast.rating}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/10">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Live Preview</h2>
            
            {activePreview === 'card' && <CardPreview palette={palette} colorName={colorName} />}
            {activePreview === 'dashboard' && <DashboardPreview palette={palette} />}
            {activePreview === 'form' && <FormPreview palette={palette} />}
            {activePreview === 'typography' && <TypographyPreview palette={palette} colorName={colorName} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Components
function CardPreview({ palette, colorName }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Light Card */}
      <div 
        className="p-6 rounded-2xl border"
        style={{ 
          backgroundColor: palette[100] || '#f5f5f5', 
          borderColor: palette[200] || '#e5e5e5'
        }}
      >
        <h3 
          className="text-lg font-bold mb-2"
          style={{ color: palette[800] || '#1a1a1a' }}
        >
          {colorName} Card
        </h3>
        <p 
          className="text-sm mb-4"
          style={{ color: palette[600] || '#666' }}
        >
          This is how your colors look on a light background with various text colors.
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: palette[500] || '#6366f1' }}
        >
          Primary Action
        </button>
      </div>

      {/* Dark Card */}
      <div 
        className="p-6 rounded-2xl border"
        style={{ 
          backgroundColor: palette[800] || '#1a1a1a', 
          borderColor: palette[700] || '#333'
        }}
      >
        <h3 
          className="text-lg font-bold mb-2"
          style={{ color: palette[100] || '#f5f5f5' }}
        >
          Dark Mode Card
        </h3>
        <p 
          className="text-sm mb-4"
          style={{ color: palette[300] || '#ccc' }}
        >
          Colors adapted for dark mode interfaces with proper contrast.
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ 
            backgroundColor: palette[400] || '#818cf8',
            color: palette[900] || '#000'
          }}
        >
          Secondary Action
        </button>
      </div>
    </div>
  );
}

function DashboardPreview({ palette }) {
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Revenue', value: '$14,919', change: '+12%' },
          { label: 'Users', value: '2,847', change: '+5%' },
          { label: 'Conversion', value: '3.2%', change: '-2%' },
        ].map((kpi, i) => (
          <div 
            key={i}
            className="p-4 rounded-xl border"
            style={{ 
              backgroundColor: palette[50] || '#fafafa',
              borderColor: palette[200] || '#e5e5e5'
            }}
          >
            <p className="text-xs mb-1" style={{ color: palette[500] || '#666' }}>{kpi.label}</p>
            <p className="text-xl font-bold" style={{ color: palette[800] || '#000' }}>{kpi.value}</p>
            <p 
              className="text-xs mt-1"
              style={{ color: kpi.change.startsWith('+') ? '#22c55e' : '#ef4444' }}
            >
              {kpi.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div 
        className="p-4 rounded-xl border"
        style={{ 
          backgroundColor: palette[50] || '#fafafa',
          borderColor: palette[200] || '#e5e5e5'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: palette[700] || '#333' }}>Progress</span>
          <span className="text-sm font-bold" style={{ color: palette[600] || '#666' }}>65%</span>
        </div>
        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: palette[200] || '#e5e5e5' }}
        >
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: '65%',
              backgroundColor: palette[500] || '#6366f1'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function FormPreview({ palette }) {
  return (
    <div 
      className="p-6 rounded-xl border max-w-md"
      style={{ 
        backgroundColor: palette[50] || '#fafafa',
        borderColor: palette[200] || '#e5e5e5'
      }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: palette[800] || '#000' }}>Form Elements</h3>
      
      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: palette[600] || '#666' }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
            style={{ 
              backgroundColor: '#fff',
              borderColor: palette[300] || '#d4d4d4',
              color: palette[800] || '#000'
            }}
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border flex items-center justify-center"
            style={{ 
              backgroundColor: palette[500] || '#6366f1',
              borderColor: palette[500] || '#6366f1'
            }}
          >
            <Check size={10} className="text-white" />
          </div>
          <span className="text-sm" style={{ color: palette[700] || '#333' }}>Subscribe to newsletter</span>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: palette[700] || '#333' }}>Notifications</span>
          <div 
            className="w-10 h-5 rounded-full relative"
            style={{ backgroundColor: palette[500] || '#6366f1' }}
          >
            <div 
              className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: palette[600] || '#4f46e5' }}
        >
          Submit Form
        </button>
      </div>
    </div>
  );
}

function TypographyPreview({ palette, colorName }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black" style={{ color: palette[900] || '#000' }}>
        {colorName} Typography
      </h1>
      <h2 className="text-xl font-bold" style={{ color: palette[800] || '#1a1a1a' }}>
        Heading 2 - Section Title
      </h2>
      <p className="text-base leading-relaxed" style={{ color: palette[700] || '#333' }}>
        Body text uses a comfortable reading color from the palette. 
        This demonstrates how your colors work for long-form content 
        and paragraph text in your design system.
      </p>
      <p className="text-sm" style={{ color: palette[600] || '#666' }}>
        Secondary text for descriptions, captions, and metadata. 
        Smaller text size with slightly reduced contrast.
      </p>
      <p className="text-xs uppercase tracking-wider" style={{ color: palette[500] || '#999' }}>
        Labels & Tags
      </p>
      
      {/* Gradient Showcase */}
      <div 
        className="p-4 rounded-xl text-white font-bold text-center"
        style={{ 
          background: `linear-gradient(135deg, ${palette[300] || '#a5b4fc'}, ${palette[600] || '#4f46e5'})`
        }}
      >
        Gradient Preview: 300 → 600
      </div>
    </div>
  );
}
