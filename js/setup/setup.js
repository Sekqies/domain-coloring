import { loadGuppy } from './guppy_setup.js';
import { loadHover } from './hover_setup.js';
import { PlotterGl, listaFuncoes } from '/js/gl/plotter_gl.js';
import { Plotter, lista, Eixos } from '/js/engine/plotter.js';
import { GlAnimation } from '/js/gl/animation.js';

const testing = true;

if (!testing) {
    console.log = function () { }
}


function initializeVariables() {
    canvas = document.getElementById("domainColorCanvas");
    canvasGL = document.getElementById("glCanvas");
    //animationCheckbox = document.getElementById("animation-checkbox");
    grafico = document.getElementById('grafico');
    eixosCanvas = document.getElementsByClassName('eixosCanvas');
    //iteracao = document.getElementById('iteracao');
    //limiteMinimo = document.getElementById('limite-minimo');
    //limiteMaximo = document.getElementById('limite-maximo');
    //fps = document.getElementById('fps');


}


function init() {

    //alert(guppy)  
    let tamanhoCanvas;
    if (variaveisGlobais.graficoOcupaTelaInteiraActive) {
        tamanhoCanvas = window.innerWidth;
        //Move o scroll conforme o usuario move o mouse (enquanto pressionado)
        window.addEventListener('mousedown', function (event) {
            function handleMouseMove(event) {
                window.scrollBy(-event.movementX, -event.movementY);
            }

            window.addEventListener('mousemove', handleMouseMove);

            window.addEventListener('mouseup', function () {
                window.removeEventListener('mousemove', handleMouseMove);
            });
        });


    }
    else {
        tamanhoCanvas = variaveisGlobais.valorTamanhoGrafico;
    }
    canvas.width = tamanhoCanvas;
    canvas.height = tamanhoCanvas;

    for (let i = 0; i < eixosCanvas.length; i++) {
        eixosCanvas[i].width = tamanhoCanvas;
        eixosCanvas[i].height = tamanhoCanvas;
    }


    funcaoHover = guppy.func(lista.operations);

    animation = new GlAnimation(canvasGL, canvas.width, canvas.height);
    animation_variable_exists = false;
    const result_gl = guppy.func(listaFuncoes.operations)();
    console.log(`Função a ser renderizada ${result_gl}`);
    console.log("Contexto do guppy:", guppy.engine.get_content("ast"));



    if (variaveisGlobais.animacaoLigada && animation_variable_exists) {
        const minimo = parseFloat(variaveisGlobais.variacaoInicio);
        const maximo = parseFloat(variaveisGlobais.variacaoFim);
        const it = parseFloat(variaveisGlobais.incremento);
        const framerate = parseFloat(variaveisGlobais.fps);
        animation.animate(result_gl, minimo, maximo, it);
        animation.playAnimation(framerate, variaveisGlobais.valorTipoAnimacao);
        canvas.parentElement.classList.add('active');
        canvasGL.parentElement.classList.remove('active');
        //document.body.style.backgroundColor = "black";
    }
    else {
        animation.stopAnimation();
        //document.body.style.backgroundColor = "blue";
        if (variaveisGlobais.tipoCarregamento == 'normal') {
            //alert("não web-gl")
            Plotter(funcaoHover);
            canvas.parentElement.classList.add('active');
            canvasGL.parentElement.classList.remove('active');
        }
        else if (variaveisGlobais.tipoCarregamento == 'webgl') {
            //alert('webgl');
            PlotterGl(result_gl, tamanhoCanvas, result_gl);
            canvas.parentElement.classList.remove('active');
            canvasGL.parentElement.classList.add('active');
        }
        else {
            Plotter(funcaoHover);
            PlotterGl(result_gl, tamanhoCanvas, result_gl);
            canvas.parentElement.classList.add('active');
            canvasGL.parentElement.classList.add('active');
        }

        loadHover(funcaoHover, "domainColorCanvas");
        loadHover(funcaoHover, "glCanvas");
    }

    if (variaveisGlobais.eixosCartesianos) {
        Eixos();
    }


}
function createEventListeners() {
    document.addEventListener('keyup', function (event) {
        if (event.key == "Enter") {
            init();
        }
    });

    //Não está funcionando (Não sei pq)
    document.getElementById('animation-download').addEventListener('click', function () {
        let a = new GlAnimation(canvas, canvas.width, canvas.height);
        a.downloadAnimation();
    });

}

function load() {
    //console.log = function() {};
    initializeVariables();
    loadGuppy();
    init();
    createEventListeners();
}



export { load, init };
