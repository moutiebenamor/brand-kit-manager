import { create } from 'zustand';

const useBrandStore = create((set, get) => ({
  // State
  brands: [],
  activeBrandId: null,
  colors: [],
  fonts: [],
  assets: [],
  voiceGuidelines: [],
  loading: false,

  // Computed
  get activeBrand() {
    return get().brands.find(b => b.id === get().activeBrandId) || null;
  },

  // Brand actions
  loadBrands: async () => {
    set({ loading: true });
    try {
      const brands = await window.api.brand.getAll();
      const activeBrandId = get().activeBrandId || (brands.length > 0 ? brands[0].id : null);
      set({ brands, activeBrandId, loading: false });
      if (activeBrandId) get().loadBrandData(activeBrandId);
    } catch (err) {
      console.error('Failed to load brands:', err);
      set({ loading: false });
    }
  },

  setActiveBrand: (id) => {
    set({ activeBrandId: id });
    get().loadBrandData(id);
  },

  createBrand: async (data) => {
    const brand = await window.api.brand.create(data);
    set(s => ({ brands: [brand, ...s.brands], activeBrandId: brand.id }));
    get().loadBrandData(brand.id);
    return brand;
  },

  updateBrand: async (id, data) => {
    const brand = await window.api.brand.update(id, data);
    set(s => ({ brands: s.brands.map(b => b.id === id ? { ...b, ...brand } : b) }));
    return brand;
  },

  deleteBrand: async (id) => {
    await window.api.brand.delete(id);
    const brands = get().brands.filter(b => b.id !== id);
    const newActive = brands.length > 0 ? brands[0].id : null;
    set({ brands, activeBrandId: newActive });
    if (newActive) get().loadBrandData(newActive);
    else set({ colors: [], fonts: [], assets: [], voiceGuidelines: [] });
  },

  // Load all data for a brand
  loadBrandData: async (brandId) => {
    try {
      const [colors, fonts, assets, voiceGuidelines] = await Promise.all([
        window.api.color.getByBrand(brandId),
        window.api.font.getByBrand(brandId),
        window.api.asset.getByBrand(brandId),
        window.api.voice.getByBrand(brandId),
      ]);
      set({ colors, fonts, assets, voiceGuidelines });
    } catch (err) {
      console.error('Failed to load brand data:', err);
    }
  },

  // Color actions
  addColor: async (data) => {
    const color = await window.api.color.save({ ...data, brand_id: get().activeBrandId });
    set(s => ({ colors: [...s.colors, color] }));
    return color;
  },

  updateColor: async (id, data) => {
    const color = await window.api.color.update(id, data);
    set(s => ({ colors: s.colors.map(c => c.id === id ? color : c) }));
    return color;
  },

  deleteColor: async (id) => {
    await window.api.color.delete(id);
    set(s => ({ colors: s.colors.filter(c => c.id !== id) }));
  },

  // Font actions
  addFont: async (data) => {
    const font = await window.api.font.save({ ...data, brand_id: get().activeBrandId });
    set(s => ({ fonts: [...s.fonts, font] }));
    return font;
  },

  updateFont: async (id, data) => {
    const font = await window.api.font.update(id, data);
    set(s => ({ fonts: s.fonts.map(f => f.id === id ? font : f) }));
    return font;
  },

  deleteFont: async (id) => {
    await window.api.font.delete(id);
    set(s => ({ fonts: s.fonts.filter(f => f.id !== id) }));
  },

  // Asset actions
  uploadAssets: async () => {
    const brandId = get().activeBrandId;
    if (!brandId) return;
    const uploaded = await window.api.asset.upload(brandId);
    set(s => ({ assets: [...uploaded, ...s.assets] }));
    return uploaded;
  },

  deleteAsset: async (id) => {
    await window.api.asset.delete(id);
    set(s => ({ assets: s.assets.filter(a => a.id !== id) }));
  },

  // Voice actions
  addVoiceGuideline: async (data) => {
    const guideline = await window.api.voice.save({ ...data, brand_id: get().activeBrandId });
    set(s => ({ voiceGuidelines: [...s.voiceGuidelines, guideline] }));
    return guideline;
  },

  updateVoiceGuideline: async (id, data) => {
    const guideline = await window.api.voice.update(id, data);
    set(s => ({ voiceGuidelines: s.voiceGuidelines.map(v => v.id === id ? guideline : v) }));
    return guideline;
  },

  deleteVoiceGuideline: async (id) => {
    await window.api.voice.delete(id);
    set(s => ({ voiceGuidelines: s.voiceGuidelines.filter(v => v.id !== id) }));
  },
}));

export default useBrandStore;
