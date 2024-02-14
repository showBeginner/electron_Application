let keyPressed = {};

//read setting config json file
let Setting_config_map = new Map();
window.api.getConfig((e,config_set) => {
    config_set.forEach((value,key) => {
        Setting_config_map.set(key,value);
    });
	console.log("Load setting:",Setting_config_map);
});


const settingObject = document.getElementById("setting");


settingObject.addEventListener('click', ()=>{
    window.api.openSettingWindow();
});

/*function closeApplication(){
    window.api.closeapp();
}*/

window.api.setconfig((e,message) =>{
    message.forEach((value,key) => {
        //console.log(key +": "+value);
        Setting_config_map.set(key,value);
    });
});

window.api.getCPUStatus((e,cpu_array) => {
	const CPU = document.getElementById("cpu");
	CPU.innerText = `${cpu_array[0]}% ,${cpu_array[1]}℃`;
});

window.api.getGPUStatus((e,gpu_array) => {
	const GPU = document.getElementById("gpu");
	console.log("gpu_array",gpu_array);
	GPU.innerText = `${gpu_array[0]}% ,${gpu_array[1]}℃`;
});

window.api.getNetworkStatus((e,net_array) => {
	const network = document.getElementById("Network");
	network.innerText = `${net_array[0]}Mbit/s ,${net_array[1]}ms`;
});

window.api.getFPS((e,FPS_array) => {
	const fps = document.getElementById("FPS_dis");
	fps.innerText = `${FPS_array[0]} ms`;
});

window.api.getRam((e,ram_array) => {
	const ram = document.getElementById("memory");
	ram.innerText = `${ram_array[0]}% `;
});
