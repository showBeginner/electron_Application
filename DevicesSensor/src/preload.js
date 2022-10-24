const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("api", {
  getCPUStatus: () => ipcRenderer.invoke('system:cpu'),
  getGPUStatus: () => ipcRenderer.invoke('system:gpu'),
  getNetworkStatus: () =>ipcRenderer.invoke('system:network'),
  getFPS: ()=> ipcRenderer.invoke('system:fps'),
  getRam: ()=> ipcRenderer.invoke('system:RAM'),
  closeapp: () =>  ipcRenderer.invoke('App:close'),
  openSettingWindow: () => ipcRenderer.invoke('App:setting'),
  setconfig: (message) => ipcRenderer.on('set:get', message)
});
  