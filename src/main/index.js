const { app, BrowserWindow, ipcMain, dialog, clipboard, shell } = require('electron');
const path = require('path');
const { initDatabase } = require('./db/database');
const BrandService = require('./services/BrandService');
const AssetService = require('./services/AssetService');
const AIService = require('./services/AIService');
const ExportService = require('./services/ExportService');

const isDev = process.env.NODE_ENV === 'development';
let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0a0f',
      symbolColor: '#8888aa',
      height: 40,
    },
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

function registerIpcHandlers() {
  const brandService = new BrandService(db);
  const assetService = new AssetService(db);
  const aiService = new AIService();
  const exportService = new ExportService(db);

  // Brand handlers
  ipcMain.handle('brand:getAll', () => brandService.getAll());
  ipcMain.handle('brand:getById', (_, id) => brandService.getById(id));
  ipcMain.handle('brand:create', (_, data) => brandService.create(data));
  ipcMain.handle('brand:update', (_, id, data) => brandService.update(id, data));
  ipcMain.handle('brand:delete', (_, id) => brandService.delete(id));

  // Color handlers
  ipcMain.handle('color:getByBrand', (_, brandId) => brandService.getColors(brandId));
  ipcMain.handle('color:save', (_, data) => brandService.addColor(data));
  ipcMain.handle('color:update', (_, id, data) => brandService.updateColor(id, data));
  ipcMain.handle('color:delete', (_, id) => brandService.deleteColor(id));
  ipcMain.handle('color:copy', (_, text) => {
    clipboard.writeText(text);
    return true;
  });

  // Font handlers
  ipcMain.handle('font:getByBrand', (_, brandId) => brandService.getFonts(brandId));
  ipcMain.handle('font:save', (_, data) => brandService.addFont(data));
  ipcMain.handle('font:update', (_, id, data) => brandService.updateFont(id, data));
  ipcMain.handle('font:delete', (_, id) => brandService.deleteFont(id));

  // Asset handlers
  ipcMain.handle('asset:getByBrand', (_, brandId) => assetService.getByBrand(brandId));
  ipcMain.handle('asset:upload', async (_, brandId) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'ico'] },
        { name: 'Documents', extensions: ['pdf', 'ai', 'eps'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (result.canceled) return [];
    return assetService.uploadFiles(brandId, result.filePaths);
  });
  ipcMain.handle('asset:delete', (_, id) => assetService.delete(id));
  ipcMain.handle('asset:open', (_, filePath) => shell.openPath(filePath));

  // Voice handlers
  ipcMain.handle('voice:getByBrand', (_, brandId) => brandService.getVoiceGuidelines(brandId));
  ipcMain.handle('voice:save', (_, data) => brandService.addVoiceGuideline(data));
  ipcMain.handle('voice:update', (_, id, data) => brandService.updateVoiceGuideline(id, data));
  ipcMain.handle('voice:delete', (_, id) => brandService.deleteVoiceGuideline(id));

  // AI handlers
  ipcMain.handle('ai:generatePalette', (_, baseColor, mood) => aiService.generatePalette(baseColor, mood));
  ipcMain.handle('ai:generateShades', (_, baseColor) => aiService.generateShades(baseColor));

  // Export handlers
  ipcMain.handle('export:css', (_, brandId) => exportService.toCSS(brandId));
  ipcMain.handle('export:json', (_, brandId) => exportService.toJSON(brandId));
  ipcMain.handle('export:figmaTokens', (_, brandId) => exportService.toFigmaTokens(brandId));
  ipcMain.handle('export:scss', (_, brandId) => exportService.toSCSS(brandId));
}

app.whenReady().then(async () => {
  db = await initDatabase();
  createWindow();
  registerIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (db) db.close();
  if (process.platform !== 'darwin') app.quit();
});
