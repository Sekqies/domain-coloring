import { loadGuppy } from './guppy_setup.js';
import { loadHover } from './hover_setup.js';
import { PlotterGl, listaFuncoes } from '/js/gl/plotter_gl.js';
import { Plotter, lista } from '/js/engine/plotter.js';
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
    funcaoHover = guppy.func(lista.operations);

    //animation_variable_exists = false;
    const result_gl = guppy.func(listaFuncoes.operations)();
    console.log(`Função a ser renderizada ${result_gl}`);
    console.log("Contexto do guppy:", guppy.engine.get_content("ast"));
    if (variaveisGlobais.animacaoLigada && animation_variable_exists) {
        const minimo = parseFloat(variaveisGlobais.variacaoInicio);
        const maximo = parseFloat(variaveisGlobais.variacaoFim);
        const it = parseFloat(variaveisGlobais.incremento);
        const framerate = parseFloat(variaveisGlobais.fps);
        let animation = new GlAnimation(canvasGL, canvas.width, canvas.height);
        animation.animate(result_gl, minimo, maximo, it);
        animation.playAnimation(framerate, variaveisGlobais.valorTipoAnimacao);

        canvas.classList.add('active');
        canvasGL.classList.remove('active');
    }
    else {
        if (variaveisGlobais.tipoCarregamento == 'normal') {
            Plotter(funcaoHover);
            canvas.classList.add('active');
            canvasGL.classList.remove('active');
        }
        else if (variaveisGlobais.tipoCarregamento == 'webgl') {
            PlotterGl(result_gl, tamanhoCanvas, result_gl);
            canvas.classList.remove('active');
            canvasGL.classList.add('active');
        }
        else {
            Plotter(funcaoHover);
            PlotterGl(result_gl, tamanhoCanvas, result_gl);
            canvas.classList.add('active');
            canvasGL.classList.add('active');
        }

        loadHover(funcaoHover, "domainColorCanvas");
        loadHover(funcaoHover, "glCanvas");
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
