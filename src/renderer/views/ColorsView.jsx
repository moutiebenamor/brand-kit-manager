import { useState, useEffect } from 'react';
import { Filter, Palette, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import useBrandStore from '../store/brandStore';
import ColorSwatch from '../components/ColorSwatch';
import ColorPicker from '../components/ColorPicker';
import GeneratorPanel from '../components/GeneratorPanel';
import PreviewSection from '../components/PreviewSection';

const categories = ['all', 'primary', 'secondary', 'accent', 'neutral'];

export default function ColorsView() {
  const { colors, activeBrandId, addColor, updateColor, deleteColor, loadBrands } = useBrandStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadBrands(); }, []);

  const filtered = filter === 'all' ? colors : colors.filter(c => c.category === filter);

  // Grouping logic for Design System Scales
  const groups = {};
  const ungrouped = [];

  filtered.forEach(color => {
    const match = color.name.match(/(.+)\s+(50|100|200|300|400|500|600|700|800|900|950)$/);
    if (match) {
      const familyName = match[1];
      const weight = parseInt(match[2]);
      if (!groups[familyName]) groups[familyName] = [];
      groups[familyName].push({ ...color, weight });
    } else {
      ungrouped.push(color);
    }
  });

  Object.keys(groups).forEach(name => {
    groups[name].sort((a, b) => a.weight - b.weight);
  });

  const handleGenerateScale = async (baseColor, familyName = 'Primary') => {
    if (!activeBrandId) return;
    try {
      const palette = await window.api.ai.generateShades(baseColor);
      // Use the family name provided or the one from the generator
      for (const color of palette) {
        await addColor({ 
          name: `${familyName} ${color.name}`, 
          hex: color.hex, 
          category: color.category 
        });
      }
      toast.success('Color scale added successfully');
    } catch (err) {
      toast.error('Failed to generate scale');
      throw err;
    }
  };


  return (
    <div className="fixed inset-0 left-[260px] flex bg-brand-bg">
      <GeneratorPanel onGenerate={handleGenerateScale} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10 pt-16 scroll-smooth">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="section-title flex items-center gap-3">
                <Palette size={28} className="text-accent-primary" />
                Brand Palette
              </h1>
              <p className="section-subtitle">Structured design system colors and standalone swatches</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-white/30 mr-2" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === cat
                      ? 'bg-accent-primary/15 text-accent-primary'
                      : 'text-white/40 hover:text-white/60 hover:bg-brand-hover'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Color Families / Scales */}
          <div className="space-y-12 mb-12">
            {Object.entries(groups).map(([name, familyColors]) => (
              <div key={name} className="animate-fade-in group/family">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-white tracking-tight">{name}</h2>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40 border border-white/5">{name.includes('Primary') ? 'Primary' : 'Scale'}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    {['Contrast grid', 'Color info', 'Export', 'Edit'].map(action => (
                      <button key={action} className="text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {familyColors.map((color) => {
                    const r = parseInt(color.hex.slice(1, 3), 16) / 255;
                    const g = parseInt(color.hex.slice(3, 5), 16) / 255;
                    const b = parseInt(color.hex.slice(5, 7), 16) / 255;
                    const isLight = (0.299 * r + 0.587 * g + 0.114 * b) > 0.5;
                    
                    return (
                      <div 
                        key={color.id}
                        onClick={() => {
                          window.api.color.copy(color.hex);
                          toast.success(`Copied ${color.hex}`);
                        }}
                        className="flex flex-col gap-2 group cursor-pointer"
                      >
                        <div 
                          style={{ background: color.hex }}
                          className="w-20 h-20 rounded-xl border border-white/5 shadow-lg transition-all group-hover:scale-105 group-hover:shadow-xl flex items-center justify-center"
                        >
                          {color.weight === 700 && <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-black/20' : 'bg-white/40'}`} />}
                        </div>
                        <div className="px-1 space-y-0.5">
                          <div className="text-[10px] font-black text-white/40 uppercase tracking-tighter">{color.weight}</div>
                          <input 
                            value={color.hex.toUpperCase().replace('#', '')}
                            onChange={(e) => {
                              const val = e.target.value.replace('#', '');
                              if (val.length <= 6) {
                                const newHex = `#${val}`;
                                updateColor(color.id, { ...color, hex: newHex });
                              }
                            }}
                            className="w-full bg-transparent border-none outline-none text-[10px] font-mono font-bold text-white/20 group-hover:text-white/60 transition-colors focus:text-accent-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Preview Section (Only for the first family/primary) */}
                {name.toLowerCase().includes('primary') && <PreviewSection primaryScale={familyColors} />}
              </div>
            ))}
          </div>

          {/* Individual Colors Grid */}
          {(ungrouped.length > 0 || colors.length === 0) && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight">Custom Swatches</h2>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {ungrouped.map(color => (
                  <ColorSwatch
                    key={color.id}
                    color={color}
                    onUpdate={updateColor}
                    onDelete={deleteColor}
                  />
                ))}
                <ColorPicker onAdd={addColor} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {colors.length === 0 && (
            <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px] mt-8">
              <Palette size={48} className="text-white/5 mx-auto mb-6" />
              <p className="text-white/20 text-sm font-medium mb-8 max-w-xs mx-auto">
                Your palette is empty. Use the generator on the left to create professional color scales.
              </p>
              <div className="flex justify-center">
                <ColorPicker onAdd={addColor} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
