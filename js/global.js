

let canvas, canvasGL;
let eixosCanvas = [];
let guppy;
let grafico;
var funcaoHover;
let real, imag;
var resultado_real = 'a';
var resultado_imag = 'b';
let descricaoFuncao;

var funcaoBase = '<m v="1.2.0"><e></e><f type="z" group="functions"><b p="latex">z</b><b p="small_latex">z</b><b p="asciimath">z</b></f><e></e></m>';


/*Animação
let animationCheckbox;
let limiteMinimo;
let limiteMaximo;
let iteracao;
let fps;*/

let animation = null;
let animation_variable_exists = false;


let variaveisGlobais = {
    tipoCarregamento: 'webgl',
    realMinimo: -2,
    realMaximo: 2,
    imagMinimo: -2,
    imagMaximo: 2,
    valorTamanhoGrafico: 500,
    graficoOcupaTelaInteiraActive: false,
    eixosCartesianos: true,
    animacaoLigada: true,
    variacaoInicio: 0,
    variacaoFim: 10,
    incremento: 0.5,
    fps: 30,
    valorTipoAnimacao: 'continue',
    valorTipoGrafico: 'continuo'
};