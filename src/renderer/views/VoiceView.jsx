import { useState, useEffect } from 'react';
import { Mic, Plus, Trash2, Edit3, Check, X, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import useBrandStore from '../store/brandStore';

const categoryConfig = {
  tone: { label: 'Tone', icon: MessageSquare, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  do: { label: "Do's", icon: ThumbsUp, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  dont: { label: "Don'ts", icon: ThumbsDown, color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  example: { label: 'Example', icon: Edit3, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
};

export default function VoiceView() {
  const { voiceGuidelines, addVoiceGuideline, updateVoiceGuideline, deleteVoiceGuideline, loadBrands } = useBrandStore();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'tone' });

  useEffect(() => { loadBrands(); }, []);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    await addVoiceGuideline(form);
    setForm({ title: '', content: '', category: 'tone' });
    setAdding(false);
  };

  const handleUpdate = async (id) => {
    await updateVoiceGuideline(id, form);
    setEditingId(null);
  };

  const startEdit = (g) => {
    setForm({ title: g.title, content: g.content, category: g.category });
    setEditingId(g.id);
  };

  const grouped = Object.keys(categoryConfig).reduce((acc, cat) => {
    acc[cat] = voiceGuidelines.filter(g => g.category === cat);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in p-10 pt-16 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Mic size={28} className="text-accent-primary" />Voice & Tone
          </h1>
          <p className="section-subtitle">Define how your brand communicates</p>
        </div>
        <button onClick={() => { setForm({ title: '', content: '', category: 'tone' }); setAdding(true); }}
          className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Guideline</button>
      </div>

      {/* Add/Edit Form */}
      {(adding || editingId) && (
        <div className="glass-card p-5 mb-6 animate-scale-in">
          <h3 className="text-sm font-semibold text-white mb-4">{editingId ? 'Edit' : 'New'} Guideline</h3>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="input-field" placeholder="Guideline title" autoFocus />
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              className="input-field min-h-[100px] resize-y" placeholder="Describe the guideline..." />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
              {Object.entries(categoryConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => editingId ? handleUpdate(editingId) : handleAdd()} className="btn-primary">
                {editingId ? 'Update' : 'Add'}
              </button>
              <button onClick={() => { setAdding(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines by Category */}
      {Object.entries(grouped).map(([cat, items]) => {
        if (items.length === 0) return null;
        const config = categoryConfig[cat];
        const Icon = config.icon;
        return (
          <div key={cat} className="mb-8">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon size={14} /> {config.label}
            </h2>
            <div className="space-y-3">
              {items.map(g => (
                <div key={g.id} className={`glass-card-hover p-4 border-l-2 group ${config.color.split(' ').pop()}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{g.title}</h3>
                      <p className="text-sm text-white/50 mt-1 leading-relaxed">{g.content}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <button onClick={() => startEdit(g)} className="btn-ghost"><Edit3 size={14} /></button>
                      <button onClick={() => deleteVoiceGuideline(g.id)}
                        className="btn-ghost text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {voiceGuidelines.length === 0 && !adding && (
        <div className="text-center py-20">
          <Mic size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No voice guidelines yet. Define your brand's personality.</p>
        </div>
      )}
    </div>
  );
}
