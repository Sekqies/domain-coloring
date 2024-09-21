import { loadGuppy } from './guppy_setup.js';
import { loadHover } from './hover_setup.js';
import { PlotterGl, listaFuncoesGL } from '../gl/plotter_gl.js';
import { Plotter, listaFuncoes, Eixos } from '../engine/plotter.js';
import { GlAnimation } from '../gl/animation.js';
import { getNumeroInteiro, getPixelPorInteiro } from '../engine/color.js';
import { updateDelimiters } from '../gl/shaders.js';

const testing = true;

if (!testing) {
    console.log = function () { }
}


function initializeVariables() {
    variaveisGlobais.canvas = document.getElementById("domainColorCanvas");
    variaveisGlobais.glCanvas = document.getElementById("glCanvas");
    canvas = variaveisGlobais.canvas;
    canvasGL = variaveisGlobais.glCanvas;   
    variaveisGlobais.glContext = canvasGL.getContext('webgl');
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

function updateGraph()
{
    PlotterGl(variaveisGlobais.glFunction,variaveisGlobais.tamanhoCanvas)   
    if (variaveisGlobais.eixosCartesianos) {
        Eixos();
    }
    return;
}

function init(modoRapido = false) {

    //alert(guppy)  
    
    normalizeValues()
    let tamanhoCanvas;
    if (variaveisGlobais.graficoOcupaTelaInteiraActive) {
        tamanhoCanvas = window.innerWidth;
        canvas.parentElement.parentElement.classList.add('full-screen');
        //Move o scroll conforme o usuario move o mouse (enquanto pressionado)
    }
    else {
        tamanhoCanvas = variaveisGlobais.valorTamanhoGrafico;
    }
    variaveisGlobais.tamanhoCanvas = tamanhoCanvas;
    canvas.width = tamanhoCanvas;
    canvas.height = tamanhoCanvas;

    for (let i = 0; i < eixosCanvas.length; i++) {
        eixosCanvas[i].width = tamanhoCanvas;
        eixosCanvas[i].height = tamanhoCanvas;
    }

    const windowWidth = window.innerWidth;
    const minLateralSize2 = windowWidth * 0.7;
    const lateral = document.getElementById('lateral');
    if(tamanhoCanvas > minLateralSize2){
        lateral.classList.add('fixed');
        console.warn(windowWidth + ' ' + minLateralSize2 + ' ' + tamanhoCanvas);
    }
    else{
        lateral.classList.remove('fixed');
    }


    funcaoHover = guppy.func(listaFuncoes.operations);

    animation = new GlAnimation(canvasGL, canvas.width, canvas.height);
    animation_variable_exists = false;

    const result_gl = guppy.func(listaFuncoesGL.operations)();
    variaveisGlobais.glFunction = result_gl;

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
        //document.body.style.backgroundColorc = "blue";
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

function placeFunctionInGraph(functionString) {
    guppy.engine.set_content(funcoesComplexas[functionString]);
    init();
}

function createEventListeners() {
    //Função movida para index.html
    /*document.addEventListener('keyup', function (event) {
        if (event.key == "Enter") {
            init();
        }
    });*/

    //Não está funcionando (Não sei pq)
    //Eu sei porque
    document.getElementById('download').addEventListener('click', function () {
        let a = new GlAnimation(canvas, canvas.width, canvas.height);
        a.downloadAnimation();
    });

    let isDragging = false;

    let startX,startY
    let zoomLevel = 1.0;

    canvasGL.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.offsetX;
        startY = e.offsetY;
        //alert("ai****-*-")
    });
    const FPS_LIMIT = 70;
    const minInterval = 1000/FPS_LIMIT
    let lastCall = 0;
    canvasGL.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const now = Date.now();
            if(now-lastCall<minInterval) return;
            lastCall = now;
    
            const dx = startX - e.offsetX;
            const dy = e.offsetY - startY;
            const pixelPorInteiro = getPixelPorInteiro();
            variaveisGlobais.delimitadores.inicio_real += dx/pixelPorInteiro/2;
            variaveisGlobais.delimitadores.fim_real += dx/pixelPorInteiro/2;
            variaveisGlobais.delimitadores.inicio_imag += dy/pixelPorInteiro/2;
            variaveisGlobais.delimitadores.fim_imag += dy/pixelPorInteiro/2;
            
            //alert("oi")
    
            updateGraph();
            startX = e.offsetX;
            startY = e.offsetY;
        }
    });
        

canvasGL.addEventListener('mouseout',()=> {
    isDragging = false;
})

canvasGL.addEventListener('mouseup', () => {
    isDragging = false;
});

canvasGL.addEventListener('wheel', (e) => {
    const now = Date.now();
        if(now-lastCall<minInterval) return;
        lastCall = now;
    const fernandomode = true;
    e.preventDefault();
    const zoomPercentage = 1;
    const zoomValue = zoomPercentage / 100;
    const direction = e.deltaY > 0 ? -1 : 1;
    const oldZoomLevel = zoomLevel;
    const pixelPorInteiro = getPixelPorInteiro();
    const screenCenter = { x: canvasGL.width / 2 / pixelPorInteiro, y: canvasGL.height / 2 / pixelPorInteiro };

    const rect = canvasGL.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const diffX = variaveisGlobais.delimitadores.fim_real - variaveisGlobais.delimitadores.inicio_real;
    const diffY = variaveisGlobais.delimitadores.fim_imag - variaveisGlobais.delimitadores.inicio_imag;
    const valX  = diffX * (1 + direction * zoomValue);
    const valY = diffY * (1 + direction * zoomValue);
    const numInteiro = getNumeroInteiro(mouseX,mouseY);
    const x = numInteiro[0];
    const y = numInteiro[1];
    variaveisGlobais.delimitadores.inicio_real = x - valX/2;
    variaveisGlobais.delimitadores.fim_real = x + valX/2;
    variaveisGlobais.delimitadores.inicio_imag = y - valX/2;
    variaveisGlobais.delimitadores.fim_imag = y + valX/2;

    // Redraw the graph with the new zoom level
    updateGraph();
});


    
}
function simulateMouseEvent(element, eventType, clientX, clientY) {
    const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        clientX: clientX,
        clientY: clientY
    });
    element.dispatchEvent(event);
}


  const testDragPerformance = function(steps)
{
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const timeStart = performance.now();
    for(let i=0;i<steps;i++){
        const x = Math.floor(Math.random() * canvasWidth);
        const y = Math.floor(Math.random() * canvasHeight);
        const nx = Math.floor(Math.random() * canvasWidth);
        const ny = Math.floor(Math.random() * canvasHeight);
        simulateMouseEvent(canvasGL, 'mousedown', x, y);
        simulateMouseEvent(canvasGL, 'mousemove', nx, ny);
        simulateMouseEvent(canvasGL, 'mouseup', nx, ny);
    }
    const timeEnd = performance.now();
    const timeElapsed = timeEnd - timeStart;
    alert(`Tempo de execução: ${timeElapsed}ms`);
}
document.getElementById('test-drag-performance').addEventListener('click', ()=>{testDragPerformance(2000)});

function load() {
    //console.log = function() {};
    initializeVariables();
    loadGuppy();
    init();
    createEventListeners();
}



export { load, init, placeFunctionInGraph };
