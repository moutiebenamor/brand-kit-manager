const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class AssetService {
  constructor(db) {
    this.db = db;
    this.assetsDir = path.join(app.getPath('userData'), 'brand-assets');
    if (!fs.existsSync(this.assetsDir)) {
      fs.mkdirSync(this.assetsDir, { recursive: true });
    }
  }

  getByBrand(brandId) {
    return this.db.prepare('SELECT * FROM assets WHERE brand_id = ? ORDER BY created_at DESC').all(brandId);
  }

  uploadFiles(brandId, filePaths) {
    const uploaded = [];
    const brandDir = path.join(this.assetsDir, String(brandId));
    if (!fs.existsSync(brandDir)) {
      fs.mkdirSync(brandDir, { recursive: true });
    }

    for (const filePath of filePaths) {
      const fileName = path.basename(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const timestamp = Date.now();
      const destName = `${timestamp}_${fileName}`;
      const destPath = path.join(brandDir, destName);

      fs.copyFileSync(filePath, destPath);

      const stats = fs.statSync(destPath);
      const type = this.getAssetType(ext);
      const mimeType = this.getMimeType(ext);

      const stmt = this.db.prepare(
        'INSERT INTO assets (brand_id, name, type, file_path, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)'
      );
      const result = stmt.run(brandId, fileName, type, destPath, stats.size, mimeType);
      const asset = this.db.prepare('SELECT * FROM assets WHERE id = ?').get(result.lastInsertRowid);
      uploaded.push(asset);
    }

    return uploaded;
  }

  delete(id) {
    const asset = this.db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
    if (asset && fs.existsSync(asset.file_path)) {
      fs.unlinkSync(asset.file_path);
    }
    this.db.prepare('DELETE FROM assets WHERE id = ?').run(id);
    return true;
  }

  getAssetType(ext) {
    const types = {
      '.png': 'image', '.jpg': 'image', '.jpeg': 'image', '.webp': 'image', '.gif': 'image',
      '.svg': 'logo', '.ico': 'icon',
      '.pdf': 'document', '.ai': 'document', '.eps': 'document',
    };
    return types[ext] || 'other';
  }

  getMimeType(ext) {
    const mimes = {
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon', '.pdf': 'application/pdf',
    };
    return mimes[ext] || 'application/octet-stream';
  }
}

module.exports = AssetService;
