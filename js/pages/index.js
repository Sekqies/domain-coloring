import { load, init } from '../setup/setup.js';

function changeActiveClass() {
    const radioDivs = document.querySelectorAll("#options .tipo div input");
    radioDivs.forEach(div => {
        div.addEventListener("click", () => {
            radioDivs.forEach(div => {
                div.parentElement.classList.remove("active");
            });
            div.parentElement.classList.add("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    changeActiveClass();
    load();
});



function download(){
    if(variaveisGlobais.valorTamanhoGrafico > 5760){
        alert("Não é possivel baixar gráficos maiores que 5760px");
        return;
    }
    init();
    const canvasImage = variaveisGlobais.tipoCarregamento == 'webgl' ? canvasGL : canvas;
    const dataURL = canvasImage.toDataURL('image/png');
    let link = document.createElement("a");
    link.href = dataURL;
    link.download = "domainColor.png";
    link.click();
}

document.getElementById("download").addEventListener("click", download);
