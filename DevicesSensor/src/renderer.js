let keyPressed = {};

//read setting config json file
let CPU_setting_Map = new Map();
CPU_setting_Map.set("CPU_info",false);
CPU_setting_Map.set("CPU_Temp",false);
CPU_setting_Map.set("CPU_Usage",false);

const network = document.getElementById("Network");
const CPU = document.getElementById("cpu");
const GPU = document.getElementById("gpu");
const settingObject = document.getElementById("setting");

/*const closeA = document.getElementById("close");
closeA.addEventListener('click',()=>{
    window.api.closeapp();
});*/

settingObject.addEventListener('click', ()=>{
    window.api.openSettingWindow();
});

//setInterval(Update_sys_status, 3000);
setInterval(CPU_update,3000);

function closeApplication(){
    window.api.closeapp();
}

window.api.setget((e,message) =>{
    message.forEach((value,key) => {
        console.log(key +": "+value);
        CPU_setting_Map.set(key,value);
    });
    //CPU_setting_Map.set(setkey.next().value,setvalue.next().value);
});

//cpu update function working
async function CPU_update(){
    /*CPU_setting_Map.forEach((value,key) => {
        console.log(key +": "+value);
    });*/
	if (CPU_setting_Map.get("CPU_info") == true){
		document.getElementById("cpuinfo").style.display = "block";
		const CPU_status = await window.api.getCPUStatus();
        const CPU_Use = CPU_status.get("CPUUse");
        const CPU_temp = CPU_status.get("CPUTemp");
		document.getElementById("cpu").innerText = ` ${CPU_Use.toFixed(1)}%,${CPU_temp}℃ `;
		return;
	}
	if(!CPU_setting_Map.get("CPU_Temp") && 
        !CPU_setting_Map.get("CPU_Usage")){
		document.getElementById("cpuinfo").style.display = "none";
		return;
	}
	document.getElementById("cpuinfo").style.display = "block";
    const CPU_status = await window.api.getCPUStatus();
	let display = CPU_setting_Map.get("CPU_Temp") == false ? 
            new Map([[CPU_status.get("CPUUse").toFixed(1),'%']]) : new Map([[CPU_status.get("CPUTemp"),"℃"]]);
    let setkey = display.keys();
    let setvalue = display.values();
    //console.log("key:"+setkey.next().value+" value:"+setvalue.next().value);
	document.getElementById("cpu").innerText = `${setkey.next().value}${setvalue.next().value}`;
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