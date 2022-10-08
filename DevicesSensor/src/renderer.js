let keyPressed = {};
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

setInterval(Update_sys_status, 3000);

function closeApplication(){
    window.api.closeapp();
}

window.api.setget((e,message) =>{
    let setkey = message.keys();
    let setvalue = message.values();
    console.log(setkey.next().value+": "+setvalue.next().value);
});

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