import { useState } from 'react';

export default function PreviewSection({ primaryScale }) {
  const [activeTab, setActiveTab] = useState('Cards');
  const tabs = ['Cards', 'Website', 'Dashboard', 'Components', 'Shadcn/ui', 'Apps', 'Charts', 'Gradients', 'Logos', 'Headings'];

  // Helper to get color by weight
  const getColor = (weight) => primaryScale.find(c => c.weight === weight)?.hex || '#ffffff';

  return (
    <div className="mt-12 space-y-8 animate-fade-in">
      {/* Preview Tabs */}
      <div className="flex flex-wrap items-center gap-6 border-b border-white/5 pb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold transition-colors ${
              activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Preview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Track your expenses card */}
        <div className="glass-card overflow-hidden bg-white group hover:scale-[1.02] transition-transform">
          <div className="h-64 relative overflow-hidden bg-slate-100">
             <img 
               src="https://images.unsplash.com/photo-1556742049-04ff4f6a0299?auto=format&fit=crop&q=80&w=800" 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-6 space-y-2">
            <h3 className="text-3xl font-black text-slate-900 leading-tight">Track your<br/>expenses</h3>
            <div className="w-12 h-1 rounded-full" style={{ background: getColor(500) }} />
          </div>
        </div>

        {/* Chart Card */}
        <div className="glass-card p-6 bg-[#0a0a0a] flex flex-col justify-between border border-white/5">
          <div>
            <div className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Expenses</div>
            <div className="text-2xl font-bold text-white">$12,543</div>
          </div>
          
          <div className="flex items-end gap-2 h-40 mt-8">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500" 
                  style={{ height: `${h}%`, background: getColor(500) }} 
                />
                <div 
                  className="w-full rounded-b-lg opacity-40" 
                  style={{ height: `${h/2}%`, background: getColor(300) }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* VR Card */}
        <div className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform" style={{ background: getColor(500) }}>
           <div className="p-8 space-y-4">
              <h3 className="text-4xl font-black text-white leading-none">Gain<br/>control</h3>
              <p className="text-white/80 text-sm font-medium">Manage everything from a single immersive dashboard.</p>
           </div>
           <div className="mt-4 px-8">
              <img 
                src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=600" 
                className="rounded-t-[40px] shadow-2xl shadow-black/40"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
