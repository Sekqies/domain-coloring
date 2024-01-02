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

function checaFuncao() {
    const funcao = document.querySelector(".funcao > input").value;
    const h2 = document.getElementById("funcao-invalida");
    //checa se a função tem algum simbolo que não seja +, -, *, /, ^ PERMITE TODAS AS LETRAS E NUMEROS
    const regex = /^[a-zA-Z0-9+*/^() \-]+$/;

    
    //bloqueia dois simbolos conseguitivos (ex: ++, --, *+, /-, ^/)
    const regex2 = /[-+*/^]{2,}/;
    //bloqueia simbolos no inicio e no fim da função (ex: +x, x+, -x, x-)
    const regex3 = /^[*/^]|[-+*/^ ]$/;
    
    if (regex.test(funcao) && !regex2.test(funcao) && !regex3.test(funcao)) {
        h2.style.display = "none";
    }
    else {
        h2.style.display = "block";
    }

}

document.addEventListener("DOMContentLoaded", () => {
    changeActiveClass();

    const funcao = document.getElementById("funcao_complexa");
    funcao.addEventListener("input", () =>
    {
        checaFuncao();
    });
});
