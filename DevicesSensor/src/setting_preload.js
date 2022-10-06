const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("setting_api", {
    setOpacity: (OpValue) => ipcRenderer.send('set:Opacity', OpValue),
    sendSetting: (message)=> ipcRenderer.send('set:sendSetting', message)
});
