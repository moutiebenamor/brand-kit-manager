import { useState } from 'react';
import { TrendingUp, ShoppingBag, ArrowUpRight, Eye, Smartphone, Laptop, Users, CreditCard, BarChart3, PieChart, ChevronRight } from 'lucide-react';

export default function UIMockupPreview({ palette }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  if (!palette || palette.length === 0) return null;

  // Build a map of weight -> hex for proper shade usage
  const colorMap = {};
  palette.forEach(p => {
    const w = p.weight || 500;
    colorMap[w] = p.hex;
  });
  
  // Helper to get color by Tailwind weight (50,100,200..900,950)
  const c = (weight) => colorMap[weight] || colorMap[500] || '#6366f1';
  
  // Determine if a hex is light or dark
  const isLight = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
  };
  
  // Text color that contrasts with background
  const tx = (bgWeight) => isLight(c(bgWeight)) ? '#1a1a2e' : '#ffffff';
  // Secondary text (more muted)
  const tx2 = (bgWeight) => isLight(c(bgWeight)) ? c(600) : c(300);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cards', label: 'Cards' },
    { id: 'product', label: 'Product' },
    { id: 'blog', label: 'Blog' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">UI Mockups</h3>
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Mockup */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-2 gap-3">
          {/* Expense Tracking Card - light background */}
          <div 
            className="rounded-2xl p-4 space-y-3"
            style={{ backgroundColor: c(100) }}
          >
            <div className="flex items-center justify-between">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: c(400) }}
              >
                <CreditCard size={20} style={{ color: tx(400) }} />
              </div>
              <TrendingUp size={16} style={{ color: tx(100) }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: tx(100) }}>Expenses</p>
              <p className="text-2xl font-bold" style={{ color: tx(100) }}>$14,919</p>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[60, 45, 80, 55, 70, 40, 90].map((h, i) => (
                <div 
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ 
                    height: `${h}%`,
                    backgroundColor: c(500),
                    opacity: 0.3 + (i * 0.1)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Income Card - lighter background */}
          <div 
            className="rounded-2xl p-4 space-y-3"
            style={{ backgroundColor: c(50) }}
          >
            <div className="flex items-center justify-between">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: c(500) }}
              >
                <BarChart3 size={20} style={{ color: tx(500) }} />
              </div>
              <ArrowUpRight size={16} style={{ color: c(600) }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: tx(50) }}>Income</p>
              <p className="text-2xl font-bold" style={{ color: tx(50) }}>$15,989</p>
              <p className="text-xs" style={{ color: tx2(50) }}>$18,871 last period</p>
            </div>
            {/* Mini chart */}
            <div className="h-8 flex items-end gap-0.5">
              {[30, 50, 40, 60, 45, 70, 55].map((h, i) => (
                <div 
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ 
                    height: `${h}%`,
                    backgroundColor: c(400),
                    opacity: 0.3 + (i * 0.1)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Savings Card - very light */}
          <div 
            className="rounded-2xl p-4 space-y-3"
            style={{ backgroundColor: c(50) }}
          >
            <div className="flex items-center justify-between">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: c(300) }}
              >
                <PieChart size={20} style={{ color: tx(300) }} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: tx(50) }}>Savings</p>
              <p className="text-2xl font-bold" style={{ color: tx(50) }}>$5,210</p>
            </div>
            <div className="space-y-2">
              {['Groceries', 'Household', 'Travel'].map((item, i) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: c(400 + i * 100) }}
                    />
                    <span className="text-xs" style={{ color: tx2(50) }}>{item}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: tx(50) }}>$4,973</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card - dark background */}
          <div 
            className="rounded-2xl p-4 space-y-3"
            style={{ backgroundColor: c(900) }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: tx(900) }}>Expenses</p>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: c(700) }}
              >
                <Users size={16} style={{ color: tx(700) }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: tx(900) }}>$12,543</p>
            <p className="text-xs" style={{ color: tx2(900) }}>$10,221 last period</p>
            {/* Donut chart */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={c(400)}
                    strokeWidth="4"
                    strokeDasharray="75, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={c(300)}
                    strokeWidth="4"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-75"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: tx(900) }}>75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Mockup */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-2 gap-3">
          {/* Feature Card 1 - light */}
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: c(100) }}
          >
            <div className="h-24 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  background: `linear-gradient(135deg, ${c(400)} 0%, ${c(600)} 100%)`
                }}
              />
              <div className="absolute bottom-2 left-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: c(500) }}
                >
                  <Smartphone size={16} style={{ color: tx(500) }} />
                </div>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h4 className="font-bold text-sm" style={{ color: tx(100) }}>
                Track your expenses
              </h4>
              <p className="text-xs" style={{ color: tx2(100) }}>
                Monitor spending in real-time
              </p>
            </div>
          </div>

          {/* Feature Card 2 - lighter */}
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: c(50) }}
          >
            <div className="h-24 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  background: `linear-gradient(135deg, ${c(300)} 0%, ${c(500)} 100%)`
                }}
              />
              <div className="absolute bottom-2 left-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: c(400) }}
                >
                  <Laptop size={16} style={{ color: tx(400) }} />
                </div>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h4 className="font-bold text-sm" style={{ color: tx(50) }}>
                Create budgets
              </h4>
              <p className="text-xs" style={{ color: tx2(50) }}>
                Set and manage your limits
              </p>
            </div>
          </div>

          {/* Large Card - medium */}
          <div 
            className="rounded-2xl p-4 col-span-2 flex items-center justify-between"
            style={{ backgroundColor: c(200) }}
          >
            <div className="space-y-2">
              <h4 className="font-bold text-lg" style={{ color: tx(200) }}>
                Gain control
              </h4>
              <p className="text-xs" style={{ color: tx2(200) }}>
                Take charge of your financial future
              </p>
              <button 
                className="px-4 py-1.5 rounded-lg text-xs font-medium mt-2"
                style={{ 
                  backgroundColor: c(500),
                  color: tx(500)
                }}
              >
                Get Started
              </button>
            </div>
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: c(500) }}
            >
              <TrendingUp size={32} style={{ color: tx(500) }} />
            </div>
          </div>
        </div>
      )}

      {/* Product Mockup */}
      {activeTab === 'product' && (
        <div className="grid grid-cols-2 gap-3">
          {/* Product Card - light */}
          <div 
            className="rounded-2xl p-4 space-y-3"
            style={{ backgroundColor: c(100) }}
          >
            <div 
              className="aspect-square rounded-xl flex items-center justify-center"
              style={{ backgroundColor: c(50) }}
            >
              <Laptop size={48} style={{ color: c(500) }} />
            </div>
            <div>
              <h4 className="font-bold text-sm" style={{ color: tx(100) }}>
                MacBook Pro 14
              </h4>
              <p className="text-xs" style={{ color: tx2(100) }}>
                From $1,999
              </p>
            </div>
            <button 
              className="w-full py-2 rounded-lg text-xs font-medium"
              style={{ 
                backgroundColor: c(500),
                color: tx(500)
              }}
            >
              Shop now
            </button>
          </div>

          {/* Mini Product Cards */}
          <div className="space-y-3">
            {['AirPods Pro', 'iPhone 15', 'iPad Air'].map((product, i) => (
              <div 
                key={product}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ backgroundColor: c(50) }}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: c(100) }}
                >
                  <ShoppingBag size={20} style={{ color: c(400 + i * 100) }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium truncate" style={{ color: tx(50) }}>
                    {product}
                  </h5>
                  <p className="text-xs" style={{ color: tx2(50) }}>
                    From ${(299 + i * 200).toLocaleString()}
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: c(400) }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Mockup */}
      {activeTab === 'blog' && (
        <div className="space-y-3">
          {/* Featured Post - light */}
          <div 
            className="rounded-2xl p-4 flex gap-4"
            style={{ backgroundColor: c(100) }}
          >
            <div 
              className="w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: c(50) }}
            >
              <Eye size={32} style={{ color: c(500) }} />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-medium"
                  style={{ 
                    backgroundColor: c(400),
                    color: tx(400)
                  }}
                >
                  Featured
                </span>
                <span className="text-[10px]" style={{ color: tx2(100) }}>5 min read</span>
              </div>
              <h4 className="font-bold text-sm" style={{ color: tx(100) }}>
                Productivity Hacks for Life on the Road
              </h4>
              <p className="text-xs line-clamp-2" style={{ color: tx2(100) }}>
                Discover essential tips and tools for staying productive while traveling...
              </p>
            </div>
          </div>

          {/* Post List */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'The Ultimate Digital Nomad Toolkit', tag: 'Travel', icon: Laptop },
              { title: 'Design in Cross-Functional Teams', tag: 'Design', icon: Users },
            ].map((post, i) => (
              <div 
                key={post.title}
                className="rounded-xl p-3 space-y-2"
                style={{ backgroundColor: c(50) }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: c(100) }}
                  >
                    <post.icon size={16} style={{ color: c(400 + i * 100) }} />
                  </div>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{ 
                      backgroundColor: c(200),
                      color: tx(200)
                    }}
                  >
                    {post.tag}
                  </span>
                </div>
                <h5 className="text-sm font-medium" style={{ color: tx(50) }}>
                  {post.title}
                </h5>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
