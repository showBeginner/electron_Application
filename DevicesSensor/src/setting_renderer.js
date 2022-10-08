let rangeinput = document.querySelector('#tran');
    tranvalue = document.querySelector('output');
let setting_Checkbox = document.querySelectorAll('[name="Setting_check"]');

setting_Checkbox.forEach((element)=>{
    element.addEventListener('input',()=>{
        let setting_status = new Map();
        setting_status.set(element.id,element.checked.toString());
        window.setting_api.sendSetting(setting_status);
    });
});

//console.log("rangeinput.value : "+rangeinput.value);
//tranvalue.innerText = `透明度: ${rangeinput.value}`;

rangeinput.addEventListener('input', async()=> {
    //tranvalue.innerText = `透明度: ${rangeinput.value}`;
    window.setting_api.setOpacity(rangeinput.value);
    console.log("setting_renderer: "+rangeinput.value);
},false);


