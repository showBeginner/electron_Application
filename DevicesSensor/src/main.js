const { app, BrowserWindow,  ipcMain } = require('electron');
const si  = require("systeminformation");
const path = require('path');
const fs = require('fs');
//const { setInterval } = require('timers/promises');
const fsPromises = fs.promises;


let mainWindow;
let settingWindow;
let config = new Map([
	["CPU_info",false],
	["CPU_Temp",false],
	["CPU_Usage",false],
	["GPU_info",true],
	["GPU_Temp",false],
	["GPU_Usage",false],
	["Net",false],
	["Ram",false],
	["FPS",false],
]);



async function setup_handleFunction(){
  await setup_config();
  mainWindow.webContents.send('pass-config',config);
}


const setup_config = async() => {
  await fsPromises.access('config.json', fs.constants.F_OK)
  .then(async () => { 
    const avc = await fsPromises.readFile("./config.json",'utf8')
      .then((result) => {
        console.log("readFile",result);
        return result;
      })
      .catch(() => console.error('can not readFile'));
    config = new Map(Object.entries(JSON.parse(avc)));
    console.log("access type:",typeof(avc));
  })
  .catch(() => {
    const json = JSON.stringify(Object.fromEntries(config));
    fsPromises.writeFile('./config.json', json, (err) => {
			if (err) throw err;
			console.log("Completed");
		});
    console.log("access catch\n");
  });
}

function Handle_Center(){
  console.log("Center");
  if(config.get("CPU_info") || (config.get("CPU_Temp") || config.get("CPU_Usage") ))
		Handle_CPU();
  
  if(config.get("GPU_info") || (config.get("GPU_Temp") || config.get("GPU_Usage") ))
		Handle_GPU();

}


function Handle_CPU(){

  if(config.get("CPU_info")){
    Promise.all([si.currentLoad(), si.cpuTemperature()]).then(function(results) {
      let cpu_array = [(results[0].currentLoad).toFixed(1),results[1].main];
		  mainWindow.webContents.send('pass-cpu',cpu_array);
    });
		return;
  }
  if(config.get("CPU_Usage")){
    Promise.resolve(si.currentLoad()).then( result => {
      let cpu_array = [(result.currentLoad).toFixed(1)];
      mainWindow.webContents.send('pass-cpu',cpu_array);
    });
  }
  else{
    Promise.resolve(si.cpuTemperature()).then( result => {
      let cpu_array = [result.main];
      mainWindow.webContents.send('pass-cpu',cpu_array);
    });
  }
	
}

function Handle_GPU(){
  if(config.get("GPU_info") == true){
    Promise.resolve(si.graphics()).then(data => {
      let display_default = data.controllers[0];
      let usage = ((display_default.memoryUsed/display_default.memoryTotal)*100).toFixed(1);
      let temp = display_default.temperatureGpu;
      let gpu_array = [usage,temp];
      let FPS_array = [data.displays[0].currentRefreshRate];
      mainWindow.webContents.send('pass-FPS',FPS_array);
      mainWindow.webContents.send('pass-gpu',gpu_array);
    });
    return;
  }
  if(config.get("GPU_Usage")){
    si.graphics().then(data => {
      let display_default = data.controllers[0];
      let usage = ((display_default.memoryUsed/display_default.memoryTotal)*100).toFixed(1);
      let gpu_array = [usage];
      mainWindow.webContents.send('pass-gpu',gpu_array);
    });
  }
  else{
    si.graphics().then(data => {
      let display_default = data.controllers[0];
      let temp = display_default.temperatureGpu;
      let gpu_array = [temp];
      mainWindow.webContents.send('pass-gpu',gpu_array);
    });
  }
}

function close_setting(){
  settingWindow.close();
  if(!settingWindow.isDestroyed())
    settingWindow.destroy();
  
}

function Handle_FPS(){
  si.graphics().then(data => {
    let FPS_array = [data.displays[0].currentRefreshRate];
    mainWindow.webContents.send('pass-FPS',FPS_array);
  });
}


function Handle_RAM() {
  Promise.resolve(si.mem()).then(result => {
    const data_total = result.total;
    const data_use = result.used;
    let ram_array = [((data_use/data_total)*100).toFixed(1)];
    mainWindow.webContents.send('pass-ram',ram_array);
  });
}

function Handle_Network() {
  Promise.all([si.networkInterfaces('default'),si.inetLatency()])
  .then(results =>{
    let net_array = [results[0]['speed'],results[1]];
    mainWindow.webContents.send('pass-net',net_array);
  });
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

  setup_handleFunction();
  mainWindow.setOpacity(0.8);
  mainWindow.loadFile(path.join(__dirname ,'index.html'));
  //win.setIgnoreMouseEvents(true);
  //mainWindow.webContents.openDevTools();
  //win.showInactive();
}

app.whenReady().then(() => {
  createWindow();
  setInterval(Handle_CPU,6000);
  //setInterval(Handle_FPS,10000);
  setInterval(Handle_RAM,8000);
  setInterval(Handle_Network,4000);
  setInterval(Handle_GPU,15000);
  /*console.time('js');
  Handle_GPU();
  console.timeEnd('js');*/
  ipcMain.handle('App:setting',openSetting);
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
    /*const json = JSON.stringify(Object.fromEntries(config));
    fsPromises.writeFile('./config.json', json, (err) => {
			if (err) throw err;
			console.log("Completed");
		});*/
    app.quit();
  }
});
