const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("api", {
  getCPUStatus: (cpu_array) => ipcRenderer.on('pass-cpu',cpu_array),
  getGPUStatus: (gpu_array) => ipcRenderer.on('pass-gpu',gpu_array),
  getNetworkStatus: (net_array) =>ipcRenderer.on('pass-net',net_array),
  getFPS: (FPS_array)=> ipcRenderer.on('pass-FPS',FPS_array),
  getRam: (ram_array)=> ipcRenderer.on('pass-ram',ram_array),
  closeapp: () =>  ipcRenderer.invoke('App:close'),
  getConfig: (config) => ipcRenderer.on('pass-config',config),
  openSettingWindow: () => ipcRenderer.invoke('App:setting'),
  setconfig: (message) => ipcRenderer.on('set:get', message)
});
