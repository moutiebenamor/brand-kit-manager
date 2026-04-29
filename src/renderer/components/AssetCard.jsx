import { FileImage, FileText, Trash2, ExternalLink } from 'lucide-react';

const typeIcons = {
  image: FileImage,
  logo: FileImage,
  icon: FileImage,
  document: FileText,
  other: FileText,
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AssetCard({ asset, onDelete, onOpen }) {
  const Icon = typeIcons[asset.type] || FileText;
  const isImage = asset.mime_type?.startsWith('image/');

  return (
    <div className="glass-card-hover group overflow-hidden animate-fade-in">
      {/* Preview */}
      <div className="h-36 bg-brand-bg relative flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={`file://${asset.file_path}`}
            alt={asset.name}
            className="w-full h-full object-contain p-3"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${isImage ? 'hidden' : 'flex'} flex-col items-center justify-center gap-2`}>
          <Icon size={32} className="text-white/20" />
          <span className="text-[10px] text-white/30 uppercase font-medium tracking-wider">
            {asset.type}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onOpen(asset.file_path)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Open file"
          >
            <ExternalLink size={16} />
          </button>
          <button
            onClick={() => onDelete(asset.id)}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-white truncate" title={asset.name}>{asset.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-white/30">{formatSize(asset.file_size)}</span>
          <span className="text-[11px] text-white/30 uppercase">{asset.type}</span>
        </div>
      </div>
    </div>
  );
}
