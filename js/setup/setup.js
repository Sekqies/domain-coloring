import { loadGuppy } from './guppy_setup.js';
import { loadHover } from './hover_setup.js';
import { PlotterGl, operacoes_gl } from '/js/gl/plotter_gl.js';
import { Plotter, operacoes } from '/js/engine/plotter.js';

function init() {
    grafico = document.getElementById('grafico');
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
    //alert(canvas);
    //var tempoInicial = performance.now();

    tipo_grafico = document.querySelector('input[name="tp_g"]:checked').value;

    const eixos = document.getElementById('eixos')
    qtndInteiros = document.getElementById('numero_inteiros').value;
    Plotter(guppy);
    const result_gl = guppy.func(operacoes_gl)();
    console.log(`Função a ser renderizada ${result_gl}`);
    PlotterGl(result_gl, tamanhoCanvas, result_gl);
}

function load() {
    canvas = document.getElementById("domainColorCanvas");
    canvasGL = document.getElementById("glCanvas");
    loadGuppy();
    init();
    loadHover(funcaoHover, "domainColorCanvas");
    loadHover(funcaoHover, "glCanvas");
    document.addEventListener('keyup', function (event) {
        if (event.key == "Enter") {
            console.log(guppy.engine.get_content("ast"));
            console.log(guppy.func(operacoes));
            console.log(guppy.func(operacoes)({ 'z': { real: 1, imag: 1 } }));
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

}



export {load, init};
