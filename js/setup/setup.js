import { loadGuppy } from './guppy_setup.js';
import { loadHover } from './hover_setup.js';
import { PlotterGl, listaFuncoes } from '/js/gl/plotter_gl.js';
import { Plotter, lista } from '/js/engine/plotter.js';
import { GlAnimation } from '/js/gl/animation.js';

function initializeVariables() 
{
    canvas = document.getElementById("domainColorCanvas");
    canvasGL = document.getElementById("glCanvas");
    animationCheckbox = document.getElementById("animation-checkbox");
    grafico = document.getElementById('grafico');
    iteracao = document.getElementById('iteracao');
    limiteMinimo = document.getElementById('limite-minimo');
    limiteMaximo = document.getElementById('limite-maximo');
    fps = document.getElementById('fps');
}


function init() {
    //alert(guppy)  
    let tamanhoCanvas;
    if (graficoTelainteira) {
        tamanhoCanvas = window.innerWidth;
        //Move o scroll conforme o usuario move o mouse (enquanto pressionado)
        window.addEventListener('mousedown', function (event) {
            function handleMouseMove(event) {
                window.scrollBy(-event.movementX / 2, -event.movementY / 2);
            }

            window.addEventListener('mousemove', handleMouseMove);

            window.addEventListener('mouseup', function () {
                window.removeEventListener('mousemove', handleMouseMove);
            });
        });


    }
    else {
        tamanhoCanvas = document.getElementById("tamanho_grafico").value;
    }
    canvas.width = tamanhoCanvas;
    canvas.height = tamanhoCanvas;
    tipo_grafico = document.querySelector('input[name="tp_g"]:checked').value;
    qtndInteiros = document.getElementById('numero_inteiros').value;
    funcaoHover = guppy.func(lista.operations);
    Plotter(funcaoHover);
    animation_variable_exists = false;
    const result_gl = guppy.func(listaFuncoes.operations)();
    console.log(`Função a ser renderizada ${result_gl}`);
    if (animationCheckbox.checked && animation_variable_exists)
    {
        const minimo = parseFloat(limiteMinimo.value);
        const maximo = parseFloat(limiteMaximo.value);
        const it = parseFloat(iteracao.value);
        const framerate = parseFloat(fps.value);
        let animation = new GlAnimation(canvasGL, canvas.width, canvas.height);
        animation.animate(result_gl, minimo,maximo,it);
        animation.playAnimation(framerate, "continue");
    }
    else
    {
        PlotterGl(result_gl, tamanhoCanvas, result_gl);
    }
    loadHover(funcaoHover, "domainColorCanvas");
    loadHover(funcaoHover, "glCanvas");
}
function createEventListeners()
{
    document.addEventListener('keyup', function (event) {
        if (event.key == "Enter") {
            console.log(guppy.engine.get_content("ast"));
            console.log(guppy.func(lista.operations));
            console.log(guppy.func(lista.operations)({ 'z': { real: 1, imag: 1 } }));
            init();
        }
    });
    const arrow = document.getElementById('arrow');
    const form = document.getElementById('form');
    const grafico = document.getElementById('grafico');

    arrow.addEventListener('click', function () {
        form.classList.toggle('active');
        arrow.classList.toggle('active');
        grafico.classList.toggle('active');
    });

    const checkbox = document.querySelector('.inputcheckbox > div');
    const gsize = document.getElementById('gsize');
    checkbox.addEventListener('click', function () {
        checkbox.classList.toggle('active');
        gsize.classList.toggle('disabled');
        gsize.querySelector('input').disabled = !gsize.querySelector('input').disabled;
        graficoTelainteira = !graficoTelainteira;
        grafico.style.cursor = graficoTelainteira ? 'grab' : 'default';
    });

    document.getElementById('BAIXAR').addEventListener('click', function () {
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
