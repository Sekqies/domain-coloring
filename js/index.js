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
    changeABIactive();

});

function adicionarFuncao(guppy,input_usuario, output_latex, output_text, nome_funcao)
{
    guppy.engine.add_symbol(input_usuario, {
        "output": {
            "latex": "\\text{" + output_latex +"}({$1})",
            "text": output_text + "($1)"
        },
        "attrs": {
            "type": nome_funcao,
            "group": "function"
        }
    });
}

function download(){
    const canvas = document.getElementById("domainColorCanvas");
    const dataURL = canvas.toDataURL('image/png');
    let link = document.createElement("a");
    link.href = dataURL;
    link.download = "domainColor.png";
    link.click();
}