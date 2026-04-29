const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// ── Wrapper that mimics better-sqlite3's synchronous API ──
class PreparedStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }

  all(...params) {
    try {
      const stmt = this.db.prepare(this.sql);
      stmt.bind(params.length === 1 && Array.isArray(params[0]) ? params[0] : params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    } catch (e) {
      console.error('SQL error (all):', this.sql, params, e);
      return [];
    }
  }

  get(...params) {
    try {
      const stmt = this.db.prepare(this.sql);
      stmt.bind(params.length === 1 && Array.isArray(params[0]) ? params[0] : params);
      let result = undefined;
      if (stmt.step()) {
        result = stmt.getAsObject();
      }
      stmt.free();
      return result;
    } catch (e) {
      console.error('SQL error (get):', this.sql, params, e);
      return undefined;
    }
  }

  run(...params) {
    try {
      this.db.run(this.sql, params.length === 1 && Array.isArray(params[0]) ? params[0] : params);
      return {
        changes: this.db.getRowsModified(),
        lastInsertRowid: getLastInsertRowid(this.db),
      };
    } catch (e) {
      console.error('SQL error (run):', this.sql, params, e);
      return { changes: 0, lastInsertRowid: 0 };
    }
  }
}

function getLastInsertRowid(db) {
  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id;
}

class DatabaseWrapper {
  constructor(sqliteDb, dbPath) {
    this._db = sqliteDb;
    this._dbPath = dbPath;
  }

  prepare(sql) {
    return new PreparedStatement(this._db, sql);
  }

  exec(sql) {
    this._db.run(sql);
    this._save();
  }

  pragma(pragmaStr) {
    try {
      this._db.run(`PRAGMA ${pragmaStr}`);
    } catch (e) {
      // WAL mode not supported in sql.js, safe to ignore
    }
  }

  close() {
    this._save();
    this._db.close();
  }

  _save() {
    try {
      const data = this._db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this._dbPath, buffer);
    } catch (e) {
      console.error('Failed to save database:', e);
    }
  }

  run(sql, params) {
    this._db.run(sql, params);
    this._save();
  }
}

const origRun = PreparedStatement.prototype.run;
PreparedStatement.prototype.run = function (...params) {
  const result = origRun.call(this, ...params);
  if (this.db._wrapper) {
    this.db._wrapper._save();
  }
  return result;
};

let dbInstance = null;

async function initDatabase() {
  console.log('Initializing Database...');
  try {
    const SQL = await initSqlJs({
      locateFile: file => {
        const wasmPath = path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file);
        if (fs.existsSync(wasmPath)) return wasmPath;
        return path.join(__dirname, '..', '..', '..', 'node_modules', 'sql.js', 'dist', file);
      }
    });
    const dbPath = path.join(app.getPath('userData'), 'brandkit.db');
    console.log('Database path:', dbPath);

    let sqliteDb;
    if (fs.existsSync(dbPath)) {
      console.log('Loading existing database...');
      const fileBuffer = fs.readFileSync(dbPath);
      sqliteDb = new SQL.Database(fileBuffer);
    } else {
      console.log('Creating new database...');
      sqliteDb = new SQL.Database();
    }

    const wrapper = new DatabaseWrapper(sqliteDb, dbPath);
    sqliteDb._wrapper = wrapper;

    wrapper.pragma('foreign_keys = ON');
    createTables(wrapper);
    seedDefaultBrand(wrapper);

    dbInstance = wrapper;
    console.log('Database initialized successfully');
    return wrapper;
  } catch (e) {
    console.error('FAILED to initialize database:', e);
    throw e;
  }
}

function createTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      logo_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      hex TEXT NOT NULL,
      category TEXT DEFAULT 'primary',
      css_variable TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fonts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      family TEXT NOT NULL,
      weight TEXT DEFAULT '400',
      style TEXT DEFAULT 'normal',
      category TEXT DEFAULT 'heading',
      file_path TEXT,
      url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      tags TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS voice_guidelines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'tone',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );
  `);
}

function seedDefaultBrand(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM brands').get();
  if (count.count === 0) {
    const insert = db.prepare('INSERT INTO brands (name, description) VALUES (?, ?)');
    const brand = insert.run('My Brand', 'Default brand kit — customize with your own assets');
    const brandId = brand.lastInsertRowid;

    const insertColor = db.prepare(
      'INSERT INTO colors (brand_id, name, hex, category, css_variable, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const defaultColors = [
      [brandId, 'Primary', '#6366f1', 'primary', '--color-primary', 0],
      [brandId, 'Primary Light', '#818cf8', 'primary', '--color-primary-light', 1],
      [brandId, 'Secondary', '#8b5cf6', 'secondary', '--color-secondary', 2],
      [brandId, 'Accent', '#f59e0b', 'accent', '--color-accent', 3],
      [brandId, 'Success', '#10b981', 'accent', '--color-success', 4],
      [brandId, 'Dark', '#0f172a', 'neutral', '--color-dark', 5],
      [brandId, 'Light', '#f8fafc', 'neutral', '--color-light', 6],
      [brandId, 'Muted', '#64748b', 'neutral', '--color-muted', 7],
    ];
    for (const color of defaultColors) {
      insertColor.run(...color);
    }

    const insertVoice = db.prepare(
      'INSERT INTO voice_guidelines (brand_id, title, content, category, sort_order) VALUES (?, ?, ?, ?, ?)'
    );
    const defaultGuidelines = [
      [brandId, 'Brand Tone', 'Our voice is confident, approachable, and clear. We speak with authority but never talk down to our audience.', 'tone', 0],
      [brandId, 'Do: Be Direct', 'Use clear, concise language. Get to the point quickly. Respect the reader\'s time.', 'do', 1],
      [brandId, 'Don\'t: Use Jargon', 'Avoid technical jargon unless speaking to a technical audience. Keep language accessible.', 'dont', 2],
    ];
    for (const guideline of defaultGuidelines) {
      insertVoice.run(...guideline);
    }
  }
}

module.exports = { initDatabase };
