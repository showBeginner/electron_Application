let rangeinput = document.querySelector('#tran');
    tranvalue = document.querySelector('output');
let cpu = document.querySelector('#checkbox');


if(cpu.checked == true)
    console.log("outside:"+ true);
else
    console.log("outside:"+ false);

cpu.addEventListener('input',()=>{
    window.setting_api.sendSetting(cpu.checked.toString());
    console.log(typeof(cpu.checked));
})
//console.log("rangeinput.value : "+rangeinput.value);
//tranvalue.innerText = `透明度: ${rangeinput.value}`;

rangeinput.addEventListener('input', async()=> {
    //tranvalue.innerText = `透明度: ${rangeinput.value}`;
    window.setting_api.setOpacity(rangeinput.value);
    console.log("setting_renderer: "+rangeinput.value);
},false);


