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

setInterval(Updatest, 3000);

function closeApplication(){
    window.api.closeapp();
}
/*
let rangeinput = document.querySelector("input");
    tranvalue = document.querySelector("output");
tranvalue.innerText = `透明度: ${rangeinput.value}`;
rangeinput.addEventListener('input',async()=> {
    tranvalue.innerText = `透明度: ${rangeinput.value}`;
    window.api.setOpacity(rangeinput.value);
},false);*/

/*document.addEventListener('keydown', (e) =>{
    keyPressed[e.key] = true;
    if(keyPressed['Control'] && e.key == 'a'){
        alert(e.key);
    }
});

document.addEventListener('keyup', (e) => {
    delete keyPressed[e.key];
});*/


async function Updatest () {
    const CPU_status = await window.api.getCPUStatus();
    const GPU_status = await window.api.getGPUStatus();
    const CPU_Use = CPU_status.get("CPUUse");
    const CPU_temp = CPU_status.get("CPUTemp");
    const Net_speed = await window.api.getNetworkStatus();


    GPU.innerText = ` ${GPU_status.get("GPUuse").toFixed(1)}%,${GPU_status.get("GPUtemp")}℃`;
    CPU.innerText = ` ${CPU_Use.toFixed(1)}%,${CPU_temp}℃ `;
    network.innerText = `${Net_speed} Mbit/s`;

}