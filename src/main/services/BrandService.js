class BrandService {
  constructor(db) {
    this.db = db;
  }

  // ── Brand CRUD ──
  getAll() {
    return this.db.prepare(`
      SELECT b.*, 
        (SELECT COUNT(*) FROM colors WHERE brand_id = b.id) as color_count,
        (SELECT COUNT(*) FROM fonts WHERE brand_id = b.id) as font_count,
        (SELECT COUNT(*) FROM assets WHERE brand_id = b.id) as asset_count
      FROM brands b ORDER BY b.created_at DESC
    `).all();
  }

  getById(id) {
    return this.db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
  }

  create(data) {
    const stmt = this.db.prepare('INSERT INTO brands (name, description) VALUES (?, ?)');
    const result = stmt.run(data.name, data.description || '');
    return this.getById(result.lastInsertRowid);
  }

  update(id, data) {
    const stmt = this.db.prepare('UPDATE brands SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(data.name, data.description, id);
    return this.getById(id);
  }

  delete(id) {
    this.db.prepare('DELETE FROM brands WHERE id = ?').run(id);
    return true;
  }

  // ── Colors ──
  getColors(brandId) {
    return this.db.prepare('SELECT * FROM colors WHERE brand_id = ? ORDER BY sort_order ASC').all(brandId);
  }

  addColor(data) {
    const maxOrder = this.db.prepare('SELECT MAX(sort_order) as max FROM colors WHERE brand_id = ?').get(data.brand_id);
    const stmt = this.db.prepare(
      'INSERT INTO colors (brand_id, name, hex, category, css_variable, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      data.brand_id, data.name, data.hex,
      data.category || 'primary',
      data.css_variable || `--color-${data.name.toLowerCase().replace(/\s+/g, '-')}`,
      (maxOrder.max || 0) + 1
    );
    return this.db.prepare('SELECT * FROM colors WHERE id = ?').get(result.lastInsertRowid);
  }

  updateColor(id, data) {
    const stmt = this.db.prepare('UPDATE colors SET name = ?, hex = ?, category = ?, css_variable = ? WHERE id = ?');
    stmt.run(data.name, data.hex, data.category, data.css_variable, id);
    return this.db.prepare('SELECT * FROM colors WHERE id = ?').get(id);
  }

  deleteColor(id) {
    this.db.prepare('DELETE FROM colors WHERE id = ?').run(id);
    return true;
  }

  // ── Fonts ──
  getFonts(brandId) {
    return this.db.prepare('SELECT * FROM fonts WHERE brand_id = ? ORDER BY category, created_at').all(brandId);
  }

  addFont(data) {
    const stmt = this.db.prepare(
      'INSERT INTO fonts (brand_id, name, family, weight, style, category, url) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      data.brand_id, data.name, data.family,
      data.weight || '400', data.style || 'normal',
      data.category || 'heading', data.url || ''
    );
    return this.db.prepare('SELECT * FROM fonts WHERE id = ?').get(result.lastInsertRowid);
  }

  updateFont(id, data) {
    const stmt = this.db.prepare(
      'UPDATE fonts SET name = ?, family = ?, weight = ?, style = ?, category = ?, url = ? WHERE id = ?'
    );
    stmt.run(data.name, data.family, data.weight, data.style, data.category, data.url || '', id);
    return this.db.prepare('SELECT * FROM fonts WHERE id = ?').get(id);
  }

  deleteFont(id) {
    this.db.prepare('DELETE FROM fonts WHERE id = ?').run(id);
    return true;
  }

  // ── Voice Guidelines ──
  getVoiceGuidelines(brandId) {
    return this.db.prepare('SELECT * FROM voice_guidelines WHERE brand_id = ? ORDER BY sort_order ASC').all(brandId);
  }

  addVoiceGuideline(data) {
    const maxOrder = this.db.prepare('SELECT MAX(sort_order) as max FROM voice_guidelines WHERE brand_id = ?').get(data.brand_id);
    const stmt = this.db.prepare(
      'INSERT INTO voice_guidelines (brand_id, title, content, category, sort_order) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      data.brand_id, data.title, data.content,
      data.category || 'tone', (maxOrder.max || 0) + 1
    );
    return this.db.prepare('SELECT * FROM voice_guidelines WHERE id = ?').get(result.lastInsertRowid);
  }

  updateVoiceGuideline(id, data) {
    const stmt = this.db.prepare('UPDATE voice_guidelines SET title = ?, content = ?, category = ? WHERE id = ?');
    stmt.run(data.title, data.content, data.category, id);
    return this.db.prepare('SELECT * FROM voice_guidelines WHERE id = ?').get(id);
  }

  deleteVoiceGuideline(id) {
    this.db.prepare('DELETE FROM voice_guidelines WHERE id = ?').run(id);
    return true;
  }
}

module.exports = BrandService;
