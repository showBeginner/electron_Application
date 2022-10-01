let rangeinput = document.querySelector('#tran');
    tranvalue = document.querySelector('output');

//console.log("rangeinput.value : "+rangeinput.value);
//tranvalue.innerText = `透明度: ${rangeinput.value}`;

rangeinput.addEventListener('input', async()=> {
    //tranvalue.innerText = `透明度: ${rangeinput.value}`;
    window.setting_api.setOpacity(rangeinput.value);
    console.log("setting_renderer: "+rangeinput.value);
},false);
