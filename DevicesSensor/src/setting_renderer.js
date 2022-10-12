let rangeinput = document.querySelector('#tran');
    tranvalue = document.querySelector('output');
let setting_Checkbox = document.querySelectorAll('[name="Setting_check"]');
const re_CPU = new RegExp('CPU_*');
const re_GPU = new RegExp('GPU_*');
let setting_status = new Map();

setting_Checkbox.forEach((element)=>{
    element.addEventListener('input',()=>{
        setting_status.set(element.id,element.checked);
        if(element.id.test(re_CPU))
            CPU_display();
        else if(element.id.test(re_GPU))
            GPU_display();
        else
            other();
        window.setting_api.sendSetting(setting_status);
    });
});

function CPU_display(){
    if(setting_status.get("CPU_info")){
        document.getElementById("CPU_Temp").disabled = true;
        document.getElementById("CPU_Usage").disabled = true;
        document.getElementById("CPU_Temp").checked = true;
        document.getElementById("CPU_Usage").checked= true;
        return;
    }
    else{
        document.getElementById("CPU_Temp").checked = false;
        document.getElementById("CPU_Usage").checked= false;
        setting_status.set("CPU_Temp",false);
        setting_status.set("CPU_Temp",false);
    }
    if(setting_status.get("CPU_Temp")&&setting_status.get("CPU_Usage")){
        document.getElementById("CPU_Temp").disabled = false;
        document.getElementById("CPU_Usage").disabled = false;
    }
}

function GPU_display(){

}

function other(){

}

//console.log("rangeinput.value : "+rangeinput.value);
//tranvalue.innerText = `透明度: ${rangeinput.value}`;

rangeinput.addEventListener('input', async()=> {
    //tranvalue.innerText = `透明度: ${rangeinput.value}`;
    window.setting_api.setOpacity(rangeinput.value);
    console.log("setting_renderer: "+rangeinput.value);
},false);


