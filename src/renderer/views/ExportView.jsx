import { useState, useEffect } from 'react';
import { Download, Copy, Check, FileCode, FileJson, Braces, FileText } from 'lucide-react';
import { toast } from 'sonner';
import useBrandStore from '../store/brandStore';
import useClipboard from '../hooks/useClipboard';

const formats = [
  { id: 'css', label: 'CSS Variables', icon: FileCode, desc: ':root { --color-primary: ... }' },
  { id: 'scss', label: 'SCSS Variables', icon: Braces, desc: '$color-primary: ...' },
  { id: 'json', label: 'JSON Tokens', icon: FileJson, desc: '{ "colors": { ... } }' },
  { id: 'figmaTokens', label: 'Figma Tokens', icon: FileText, desc: 'Design token format' },
];

export default function ExportView() {
  const { activeBrandId, loadBrands } = useBrandStore();
  const { copy } = useClipboard();
  const [activeFormat, setActiveFormat] = useState('css');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadBrands(); }, []);

  useEffect(() => {
    if (activeBrandId) generateExport(activeFormat);
  }, [activeBrandId, activeFormat]);

  const generateExport = async (format) => {
    if (!activeBrandId) return;
    setLoading(true);
    try {
      const result = await window.api.export[format](activeBrandId);
      setOutput(result);
    } catch (err) {
      setOutput('// Error generating export');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    copy(output, `${activeFormat.toUpperCase()} export`);
  };

  return (
    <div className="animate-fade-in p-10 pt-16 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Download size={28} className="text-accent-primary" />Export
          </h1>
          <p className="section-subtitle">Export your brand kit as CSS, SCSS, JSON, or Figma tokens</p>
        </div>
      </div>

      {/* Format Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {formats.map(fmt => {
          const Icon = fmt.icon;
          const isActive = activeFormat === fmt.id;
          return (
            <button key={fmt.id} onClick={() => setActiveFormat(fmt.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? 'bg-accent-primary/10 border-accent-primary/30 shadow-lg shadow-accent-primary/5'
                  : 'bg-brand-card border-brand-border hover:border-brand-border-light'
              }`}>
              <Icon size={20} className={isActive ? 'text-accent-primary mb-2' : 'text-white/30 mb-2'} />
              <h3 className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-white/70'}`}>{fmt.label}</h3>
              <p className="text-[11px] text-white/30 mt-0.5 font-mono">{fmt.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Output */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
          <span className="text-xs font-medium text-white/40">
            {formats.find(f => f.id === activeFormat)?.label}
          </span>
          <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 text-xs">
            <Copy size={12} /> Copy All
          </button>
        </div>
        <div className="p-4 max-h-[500px] overflow-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-white/30 text-sm py-8 justify-center">
              <div className="w-4 h-4 border-2 border-white/20 border-t-accent-primary rounded-full animate-spin" />
              Generating...
            </div>
          ) : (
            <pre className="text-sm font-mono text-white/70 leading-relaxed whitespace-pre-wrap">{output}</pre>
          )}
        </div>
      </div>

      {!activeBrandId && (
        <div className="text-center py-16">
          <Download size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">Select a brand to export its design tokens.</p>
        </div>
      )}
    </div>
  );
}
