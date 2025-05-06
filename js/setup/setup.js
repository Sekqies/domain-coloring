import { loadGuppy } from './guppy_setup.js';
import { loadHover } from './hover_setup.js';
import { PlotterGl, listaFuncoesGL } from '../gl/plotter_gl.js';
import { Plotter, listaFuncoes, Eixos } from '../engine/plotter.js';
import { GlAnimation } from '../gl/animation.js';
import { getCoordinate, getPixelPorInteiro } from '../engine/color.js';
import { updateCenter } from '../gl/shaders.js';

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
        //animation.stopAnimation();
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
            canvas.parentElement.classList.remove('active');
            canvasGL.parentElement.classList.add('active');
            PlotterGl(result_gl, tamanhoCanvas, result_gl);
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
            variaveisGlobais.centro.x += dx/pixelPorInteiro;
            variaveisGlobais.centro.y += dy/pixelPorInteiro;
            
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
    if (now - lastCall < minInterval) return; // Rate limit for zoom events
    lastCall = now;

    e.preventDefault();
    const zoomValue = 10
    const zoomPercentage = e.deltaY > 0 ? 100+zoomValue : 100-zoomValue; // Increase zoom when scrolling down, decrease when scrolling up
    const zoomFactor = zoomPercentage / 100;
    const n = zoomFactor;

    const rect = canvasGL.getBoundingClientRect();

    // Mouse position relative to the canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse position to real/imaginary coordinates
    const p = getCoordinate(mouseX, mouseY);
    const c = variaveisGlobais.centro;
    
    const new_c = {
        x: c.x + (p[0] - c.x) * (1 - n),
        y: c.y + (p[1] - c.y ) * (1 - n)
    };
    variaveisGlobais.raio *= n;
    variaveisGlobais.centro = new_c;
    updateGraph()
    //PlotterGl(variaveisGlobais.glFunction,variaveisGlobais.tamanhoCanvas)   

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
