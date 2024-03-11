import { PlotterGl } from 'gl/PlotterGl.js';
import { Plotter } from 'gl/Plotter.js';
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
    //alert(canvas);
    //var tempoInicial = performance.now();

    tipo_grafico = document.querySelector('input[name="tp_g"]:checked').value;

    const eixos = document.getElementById('eixos')
    qtndInteiros = document.getElementById('numero_inteiros').value;
    Plotter(guppy);
    const result_gl = guppy.func(operacoes_gl_alt)();
    console.log(`Função a ser renderizada ${result_gl}`);
    PlotterGl(result_gl, tamanhoCanvas);
}

