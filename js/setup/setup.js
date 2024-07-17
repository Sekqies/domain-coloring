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

function normalizeValues()
{
    const diffreal = variaveisGlobais.delimitadores.fim_real - variaveisGlobais.delimitadores.inicio_real;
    const diffimag = variaveisGlobais.delimitadores.fim_imag - variaveisGlobais.delimitadores.inicio_imag;
    const diff = Math.abs(diffreal - diffimag);
    if (diffreal > diffimag) {
    variaveisGlobais.delimitadores.inicio_imag -= diff/2;
    variaveisGlobais.delimitadores.fim_imag += diff/2;
    document.getElementById('imag-minimo').value = variaveisGlobais.delimitadores.inicio_imag;
    document.getElementById('imag-maximo').value = variaveisGlobais.delimitadores.fim_imag;
    }
    else {
    variaveisGlobais.delimitadores.inicio_real -= diff/2;
    variaveisGlobais.delimitadores.fim_real += diff/2;
    document.getElementById('real-minimo').value = variaveisGlobais.delimitadores.inicio_real;
    document.getElementById('real-maximo').value = variaveisGlobais.delimitadores.fim_real;
    }
}
function init() {

    //alert(guppy)  
    normalizeValues()
    let tamanhoCanvas;
    if (variaveisGlobais.graficoOcupaTelaInteiraActive) {
        tamanhoCanvas = window.innerWidth;
        //Move o scroll conforme o usuario move o mouse (enquanto pressionado)
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
        if (variaveisGlobais.tipoCarregamento == 'preciso') {
            //alert("não web-gl")
            console.log("Tamanho do canvas:", variaveisGlobais.valorTamanhoGrafico);
            if(variaveisGlobais.valorTamanhoGrafico > 3000){
                alert("O tamanho do canvas é maior do que o recomendado, a renderização pode demorar mais tempo.");
            }
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
    //Eu sei porque
    document.getElementById('animation-download').addEventListener('click', function () {
        let a = new GlAnimation(canvas, canvas.width, canvas.height);
        a.downloadAnimation();
    });
    let isDragging = false;
let dragStart = { x: 0, y: 0 };
let viewOffset = { x: 0, y: 0 };
let zoomLevel = 1.0;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStart.x = e.clientX - viewOffset.x;
    dragStart.y = e.clientY - viewOffset.y;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        viewOffset.x = e.clientX - dragStart.x;
        viewOffset.y = e.clientY - dragStart.y;
        //updateGraph(); // Function to re-render the graph with new viewOffset
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
    zoomLevel += e.deltaY * -0.01;
    zoomLevel = Math.min(Math.max(.125, zoomLevel), 4); // Constrain zoom level
    //PlotterGl()
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
