let rangeinput = document.querySelector('#tran');
    tranvalue = document.querySelector('output');
let setting_Checkbox = document.querySelectorAll('[name="Setting_check"]');
const re_CPU = new RegExp('CPU_*');
const re_GPU = new RegExp('GPU_*');
let setting_status = new Map();

document.getElementById('close').addEventListener('click',()=>{
    window.setting_api.closeSetting();
});

setting_Checkbox.forEach((element)=>{
    element.addEventListener('input',()=>{
        setting_status.set(element.id,element.checked);
        if(re_CPU.test(element.id))
            CPU_display();
        else if(re_GPU.test(element.id))
            GPU_display();
        else
            other(element.id);
        window.setting_api.sendSetting(setting_status);
    });
});

function CPU_display(){
    let info = document.getElementById("CPU_info");
	let Temp = document.getElementById("CPU_Temp");
	let Usage = document.getElementById("CPU_Usage");
    if(info.checked || (Temp.checked && Usage.checked)){
        setting_status.set("CPU_info",true);
        setting_status.set("CPU_Temp",false);
        setting_status.set("CPU_Usage",false);
		info.checked = true;
		Temp.checked = false;
		Usage.checked = false;
		Temp.disabled  = true;
		Usage.disabled = true;
		return;
    }
	if(!info.checked && (!Temp.checked && !Usage.checked)){
        setting_status.set("CPU_info",false);
        setting_status.set("CPU_Temp",false);
        setting_status.set("CPU_Usage",false);
		Temp.disabled  = false;
		Usage.disabled = false;
        return;
	}
}

function GPU_display(){
    let info = document.getElementById("GPU_info");
	let Temp = document.getElementById("GPU_Temp");
	let Usage = document.getElementById("GPU_Usage");
    if(info.checked || (Temp.checked && Usage.checked)){
        setting_status.set("GPU_info",true);
        setting_status.set("GPU_Temp",false);
        setting_status.set("GPU_Usage",false);
		info.checked = true;
		Temp.checked = false;
		Usage.checked = false;
		Temp.disabled  = true;
		Usage.disabled = true;
		return;
    }
	else if(!info.checked && (!Temp.checked && !Usage.checked)){
        setting_status.set("GPU_info",false);
        setting_status.set("GPU_Temp",false);
        setting_status.set("GPU_Usage",false);
		Temp.disabled  = false;
		Usage.disabled = false;
        return;
	}
}

function other(elementid){
    let inputed_object = document.getElementById(elementid);
    let value = inputed_object.checked === true? true:false;
    switch(elementid){
	case 'Ram':
	    setting_status.set("Ram",value);
	    break;
	case 'Net':
	    setting_status.set("Net",value);
	    break;
	default:
	    setting_status.set("FPS",value);
	    break;
    }
}

//console.log("rangeinput.value : "+rangeinput.value);
//tranvalue.innerText = `透明度: ${rangeinput.value}`;

rangeinput.addEventListener('input', async()=> {
    //tranvalue.innerText = `透明度: ${rangeinput.value}`;
    window.setting_api.setOpacity(rangeinput.value);
    console.log("setting_renderer: "+rangeinput.value);
},false);


