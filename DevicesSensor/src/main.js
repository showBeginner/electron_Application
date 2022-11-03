const { app, BrowserWindow,  ipcMain } = require('electron');
const si  = require("systeminformation");
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;


let mainWindow;
let settingWindow;
let config = new Map([
	["CPU_info",false],
	["CPU_Temp",false],
	["CPU_Usage",false],
	["GPU_info",false],
	["GPU_Temp",false],
	["GPU_Usage",false],
	["Net",false],
	["Ram",false],
	["FPS",false],
]);

fsPromises.access('package.json', fs.constants.F_OK)
.then(async () => { 
	const avc = await fsPromises.readFile("./package.json",'utf8')
		.then((result) => {
			console.log("readFile",result);
			return result;
		})
		.catch(() => console.error('can not readFile'));
	let config = new Map(Object.entries(JSON.parse(avc)));
	console.log("access type:",typeof(avc));
})
.catch(() => console.error('can not be accessed'));

async function Handle_GPU() {
  let GPUTemp = new Map();
  const GPU = await si.graphics();
  GPUTemp.set("GPUuse",(GPU.controllers[0].memoryUsed/GPU.controllers[0].memoryTotal)*100);
  GPUTemp.set("GPUtemp",GPU.controllers[0].temperatureGpu);
  //console.log(GPUTemp.get("GPUuse"));
  return GPUTemp;
}

function close_setting(){
  settingWindow.close();
  if(!settingWindow.isDestroyed())
    settingWindow.destroy();
  
}

async function Handle_FPS(){
  const FPS = await si.graphics();
  return FPS.displays[0].currentRefreshRate;
}

async function Handle_CPU() {
  let systemSta = new Map();
  const usage = await si.currentLoad();
  const Temperature = await si.cpuTemperature();
  /*const GPU = await si.graphics();
  console.log(GPU.displays[0]);*/
  systemSta.set("CPUUse",usage.currentLoad);
  systemSta.set("CPUTemp",Temperature.main);
  return systemSta;
}

async function Handle_RAM() {
  const Ram_data = await si.mem();
  const data_total = Ram_data.total;
  const data_use = Ram_data.used;
  return ((data_use/data_total)*100).toFixed(1);
}

async function Handle_Network() {
  let system_network = new Map();
  const network= await si.networkInterfaces('default');
  const ping = await si.inetLatency();
  system_network.set("speed",network['speed']);
  system_network.set("ping",ping);
  //console.log("network(default): "+network+"\n");
  return system_network;
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
  settingWindow.webContents.openDevTools();
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
  mainWindow.webContents.openDevTools();
  //win.showInactive();
}

app.whenReady().then(() => {
  createWindow();
  ipcMain.handle('system:cpu', Handle_CPU);
  ipcMain.handle('system:gpu', Handle_GPU);
  ipcMain.handle('system:network',Handle_Network);
  ipcMain.handle('system:fps',Handle_FPS);
  ipcMain.handle('system:RAM',Handle_RAM);
  ipcMain.handle('App:close', closeApp);
  ipcMain.handle('App:setting',openSetting);
  ipcMain.handle('set:closeSetting',close_setting);
  

  mainWindow.webContent.send('pass-config',config);
  ipcMain.on('set:sendSetting',(e,message)=>{
    /*message.forEach((value,key) => {
      console.log(key +": "+value);
    });*/
    mainWindow.webContents.send('set:get',message);
  });

  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    const json = JSON.stringify(Object.fromEntries(config));
    fsPromises.writeFile('./config.json', json, (err) => {
			if (err) throw err;
			console.log("Completed");
		});
    app.quit();
  }
});
