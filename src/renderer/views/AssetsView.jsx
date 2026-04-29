import { useState, useEffect } from 'react';
import { Image, Upload, Filter, Grid, List } from 'lucide-react';
import useBrandStore from '../store/brandStore';
import AssetCard from '../components/AssetCard';

const typeFilters = ['all', 'image', 'logo', 'icon', 'document'];

export default function AssetsView() {
  const { assets, uploadAssets, deleteAsset, loadBrands } = useBrandStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadBrands(); }, []);

  const filtered = filter === 'all' ? assets : assets.filter(a => a.type === filter);
  const handleOpen = async (filePath) => { await window.api.asset.open(filePath); };

  return (
    <div className="animate-fade-in p-10 pt-16 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Image size={28} className="text-accent-primary" />Assets
          </h1>
          <p className="section-subtitle">Store logos, icons, and brand imagery</p>
        </div>
        <button onClick={uploadAssets} className="btn-primary flex items-center gap-2">
          <Upload size={16} /> Upload Files
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} className="text-white/30" />
        {typeFilters.map(type => (
          <button key={type} onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === type ? 'bg-accent-primary/15 text-accent-primary' : 'text-white/40 hover:text-white/60 hover:bg-brand-hover'}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        <span className="text-xs text-white/20 ml-2">{filtered.length} file{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div onClick={uploadAssets}
        className="glass-card border-dashed border-2 border-brand-border hover:border-accent-primary/30 p-8 mb-6 text-center cursor-pointer transition-all hover:bg-accent-glow group">
        <Upload size={32} className="text-white/15 mx-auto mb-3 group-hover:text-accent-primary/40 transition-colors" />
        <p className="text-sm text-white/30 group-hover:text-white/50">Click to upload brand assets</p>
        <p className="text-xs text-white/20 mt-1">PNG, JPG, SVG, PDF, AI, EPS</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(asset => (
          <AssetCard key={asset.id} asset={asset} onDelete={deleteAsset} onOpen={handleOpen} />
        ))}
      </div>

      {assets.length === 0 && (
        <div className="text-center py-16">
          <Image size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No assets uploaded yet.</p>
        </div>
      )}
    </div>
  );
}
