const { app, BrowserWindow,  ipcMain } = require('electron');
const si  = require("systeminformation");
const path = require('path');


let mainWindow;
let settingWindow;

async function Handle_GPU() {
  var GPUTemp = new Map();
  const GPU = await si.graphics();
  GPUTemp.set("GPUuse",(GPU.controllers[0].memoryUsed/GPU.controllers[0].memoryTotal)*100);
  GPUTemp.set("GPUtemp",GPU.controllers[0].temperatureGpu);
  //console.log(GPUTemp.get("GPUuse"));
  return GPUTemp;
}

async function Handle_CPU() {
  var systemSta = new Map();
  const usage = await si.currentLoad();
  const Temperature = await si.cpuTemperature();
  /*const GPU = await si.graphics();
  console.log(GPU.displays[0]);*/
  systemSta.set("CPUUse",usage.currentLoad);
  systemSta.set("CPUTemp",Temperature.main);
  return systemSta;
}

async function Handle_Network() {
  const network= await si.networkInterfaces('default');
  return network['speed'];
}

function closeApp(){
  app.quit();
}

function openSetting(){
  settingWindow = new BrowserWindow({
    width: 200,
    height:500,
    parent: mainWindow,
    autoHideMenuBar:true,
    frame:false,
    //transparent:true,
    webPreferences: {
      preload: path.join(__dirname, 'setting_preload.js')
    }
  });

  ipcMain.on('set:Opacity',(e,OpValue)=>{
    mainWindow.setOpacity(Number(OpValue));
    settingWindow.setOpacity(Number(OpValue));
    console.log("set:Opacity: "+ OpValue);
  });

  settingWindow.setOpacity(0.8);
  //settingWindow.webContents.openDevTools();
  settingWindow.loadFile(path.join(__dirname,'setting.html'));

}


function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 50,
    autoHideMenuBar:true,
    //alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });


  mainWindow.setOpacity(0.8);
  mainWindow.loadFile(path.join(__dirname ,'index.html'));
  //win.setIgnoreMouseEvents(true);
  //mainWindow.webContents.openDevTools();
  //win.showInactive();
}

app.whenReady().then(() => {
  createWindow();
  ipcMain.handle('system:cpu', Handle_CPU);
  ipcMain.handle('system:gpu', Handle_GPU);
  ipcMain.handle('system:network',Handle_Network);
  ipcMain.handle('App:close', closeApp);
  ipcMain.handle('App:setting',openSetting);
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
