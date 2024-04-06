import { load, init } from '/js/setup/setup.js';

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
    init();
    const canvas = document.getElementById("domainColorCanvas");
    const dataURL = canvas.toDataURL('image/png');
    let link = document.createElement("a");
    link.href = dataURL;
    link.download = "domainColor.png";
    link.click();
}

document.getElementById("download").addEventListener("click", download);
document.getElementById("draw").addEventListener("click", init);