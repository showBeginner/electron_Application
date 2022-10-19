let keyPressed = {};

//read setting config json file
let Setting_config_map = new Map();
Setting_config_map.set("CPU_info",false);
Setting_config_map.set("CPU_Temp",false);
Setting_config_map.set("CPU_Usage",false);

const network = document.getElementById("Network");
const CPU = document.getElementById("cpu");
const GPU = document.getElementById("gpu");
const settingObject = document.getElementById("setting");


setInterval(CPU_update,3000);
setInterval(GPU_update,3000);
settingObject.addEventListener('click', ()=>{
    window.api.openSettingWindow();
});

/*function closeApplication(){
    window.api.closeapp();
}*/

window.api.setget((e,message) =>{
    message.forEach((value,key) => {
        //console.log(key +": "+value);
        Setting_config_map.set(key,value);
    });
});

//cpu update function working
async function CPU_update(){
    /*Setting_config_map.forEach((value,key) => {
        console.log(key +": "+value);
    });*/
	if (Setting_config_map.get("CPU_info") == true){
		document.getElementById("cpuinfo").style.display = "block";
		const CPU_status = await window.api.getCPUStatus();
        const CPU_Use = CPU_status.get("CPUUse");
        const CPU_temp = CPU_status.get("CPUTemp");
		document.getElementById("cpu").innerText = ` ${CPU_Use.toFixed(1)}%,${CPU_temp}℃ `;
		return;
	}
	if(!Setting_config_map.get("CPU_Temp") && 
        !Setting_config_map.get("CPU_Usage")){
		document.getElementById("cpuinfo").style.display = "none";
		return;
	}
	document.getElementById("cpuinfo").style.display = "block";
    const CPU_status = await window.api.getCPUStatus();
	let display = Setting_config_map.get("CPU_Temp") == false ? 
            new Map([[CPU_status.get("CPUUse").toFixed(1),'%']]) : new Map([[CPU_status.get("CPUTemp"),"℃"]]);
    let setkey = display.keys();
    let setvalue = display.values();
    //console.log("key:"+setkey.next().value+" value:"+setvalue.next().value);
	document.getElementById("cpu").innerText = `${setkey.next().value}${setvalue.next().value}`;
}

async function GPU_update(){
    if (Setting_config_map.get("GPU_info") == true){
		document.getElementById("gpuinfo").style.display = "block";
		const GPU_status = await window.api.getCPUStatus();
        const GPU_Use = GPU_status.get("GPUUse");
        const GPU_temp = GPU_status.get("GPUTemp");
		document.getElementById("gpu").innerText = ` ${GPU_Use.toFixed(1)}%,${GPU_temp}℃ `;
		return;
	}
	if(!Setting_config_map.get("GPU_Temp") && 
        !Setting_config_map.get("GPU_Usage")){
		document.getElementById("gpuinfo").style.display = "none";
		return;
	}
	document.getElementById("gpuinfo").style.display = "block";
    const GPU_status = await window.api.getCPUStatus();
	let display = Setting_config_map.get("GPU_Temp") == false ? 
            new Map([[GPU_status.get("GPUUse").toFixed(1),'%']]) : new Map([[GPU_status.get("GPUTemp"),"℃"]]);
    let setkey = display.keys();
    let setvalue = display.values();
    //console.log("key:"+setkey.next().value+" value:"+setvalue.next().value);
	document.getElementById("gpu").innerText = `${setkey.next().value}${setvalue.next().value}`;
}

async function Net_update(){
	if(!Setting_config_map.get("Net")){
		document.getElementById("Net").display = "none";
		return;
	}
	const Net_object = document.getElementById("Net"); 
	Net_object.display = "block";
	const net_data = await window.api.getNet();
	Net_object.innerText = ` ${net_data.get("speed")}Mbit/s ,${net_data("ping")} ms`;
}

async function ram_update(){
	if(!Setting_config_map.get("Ram")){
		document.getElementById("Ram").display = "none";
		return;
	}
	const Ram_object = document.getElementById("Ram");
	Ram_object.display = "block";
	const ram_data =  await window.api.getRam();
	Ram_object.innerText = `${ram_data}%`;
}

/*document.addEventListener('keydown', (e) =>{
    keyPressed[e.key] = true;
    if(keyPressed['Control'] && e.key == 'a'){
        alert(e.key);
    }
});

document.addEventListener('keyup', (e) => {
    delete keyPressed[e.key];
});*/


//split every system status, use remove and add setInterval method
async function Update_sys_status () {
    const CPU_status = await window.api.getCPUStatus();
    const GPU_status = await window.api.getGPUStatus();
    const CPU_Use = CPU_status.get("CPUUse");
    const CPU_temp = CPU_status.get("CPUTemp");
    const Net_speed = await window.api.getNetworkStatus();


    GPU.innerText = ` ${GPU_status.get("GPUuse").toFixed(1)}%,${GPU_status.get("GPUtemp")}℃`;
    CPU.innerText = ` ${CPU_Use.toFixed(1)}%,${CPU_temp}℃ `;
    network.innerText = `${Net_speed} Mbit/s`;

}