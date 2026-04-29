const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  brand: {
    getAll: () => ipcRenderer.invoke('brand:getAll'),
    getById: (id) => ipcRenderer.invoke('brand:getById', id),
    create: (data) => ipcRenderer.invoke('brand:create', data),
    update: (id, data) => ipcRenderer.invoke('brand:update', id, data),
    delete: (id) => ipcRenderer.invoke('brand:delete', id),
  },
  color: {
    getByBrand: (brandId) => ipcRenderer.invoke('color:getByBrand', brandId),
    save: (data) => ipcRenderer.invoke('color:save', data),
    update: (id, data) => ipcRenderer.invoke('color:update', id, data),
    delete: (id) => ipcRenderer.invoke('color:delete', id),
    copy: (text) => ipcRenderer.invoke('color:copy', text),
  },
  font: {
    getByBrand: (brandId) => ipcRenderer.invoke('font:getByBrand', brandId),
    save: (data) => ipcRenderer.invoke('font:save', data),
    update: (id, data) => ipcRenderer.invoke('font:update', id, data),
    delete: (id) => ipcRenderer.invoke('font:delete', id),
  },
  asset: {
    getByBrand: (brandId) => ipcRenderer.invoke('asset:getByBrand', brandId),
    upload: (brandId) => ipcRenderer.invoke('asset:upload', brandId),
    delete: (id) => ipcRenderer.invoke('asset:delete', id),
    open: (filePath) => ipcRenderer.invoke('asset:open', filePath),
  },
  voice: {
    getByBrand: (brandId) => ipcRenderer.invoke('voice:getByBrand', brandId),
    save: (data) => ipcRenderer.invoke('voice:save', data),
    update: (id, data) => ipcRenderer.invoke('voice:update', id, data),
    delete: (id) => ipcRenderer.invoke('voice:delete', id),
  },
  ai: {
    generatePalette: (baseColor, mood) => ipcRenderer.invoke('ai:generatePalette', baseColor, mood),
    generateShades: (baseColor) => ipcRenderer.invoke('ai:generateShades', baseColor),
  },
  export: {
    css: (brandId) => ipcRenderer.invoke('export:css', brandId),
    json: (brandId) => ipcRenderer.invoke('export:json', brandId),
    figmaTokens: (brandId) => ipcRenderer.invoke('export:figmaTokens', brandId),
    scss: (brandId) => ipcRenderer.invoke('export:scss', brandId),
  },
});
