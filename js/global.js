

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

var funcoesComplexas = {
    z: funcaoBase,
    pi: '<m v="1.2.0"><e></e><f group="greek" type="pi"><b p="latex">\pi</b><b p="asciimath"> pi </b></f><e></e></m>',
    soma: '<m v="1.2.0"><e></e><f type="z" group="functions"><b p="latex">z</b><b p="small_latex">z</b><b p="asciimath">z</b></f><e>+2</e></m>',
    subtracao: '<m v="1.2.0"><e></e><f type="z" group="functions"><b p="latex">z</b><b p="small_latex">z</b><b p="asciimath">z</b></f><e>-2</e></m>',
    multiplicacao: '<m v="1.2.0"><e></e><f type="z" group="functions"><b p="latex">z</b><b p="small_latex">z</b><b p="asciimath">z</b></f><e></e><f group="operations" type="*" ast_type="operator"><b p="latex">\cdot</b><b p="asciimath">*</b></f><e>10</e></m>',
    divisao: '<m v="1.2.0"><e>z</e><f group="operations" type="*" ast_type="operator"><b p="latex">\cdot</b><b p="asciimath">*</b></f><e></e><f type="exponential" group="functions"><b p="latex">{<r ref="1"/>}^{<r ref="2"/>}</b><b p="asciimath">(<r ref="1"/>)^(<r ref="2"/>)</b><c up="2" bracket="yes" delete="1" name="base"><e>10</e></c><c down="1" delete="1" name="exponent" small="yes"><e>-1</e></c></f><e></e></m>',
    exponenciacao: '<m v="1.2.0"><e></e><f type="exponential" group="functions"><b p="latex">{<r ref="1"/>}^{<r ref="2"/>}</b><b p="asciimath">(<r ref="1"/>)^(<r ref="2"/>)</b><c up="2" bracket="yes" delete="1" name="base"><e></e><f type="z" group="functions"><b p="latex">z</b><b p="small_latex">z</b><b p="asciimath">z</b></f><e></e></c><c down="1" delete="1" name="exponent" small="yes"><e>2</e></c></f><e></e></m>',
    log: '<m v="1.2.0"><e></e><f type="log" group="trigonometry"><b p="latex">\log\left(<r ref="1"/>\right)</b><b p="asciimath"> log(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    radiciacao: '<m v="1.2.0"><e></e><f type="squareroot" group="functions"><b p="latex">\sqrt{<r ref="1"/>\phantom{\tiny{!}}}</b><b p="asciimath">sqrt(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    conjugacao: '<m v="1.2.0"><e></e><f type="conj" group="function"><b p="latex">\overline{<r ref="1"/>}</b><b p="text">conj($1)($1)</b><c><e>z</e></c></f><e></e></m>',
    n_real: '<m v="1.2.0"><e>2</e></m>',
    n_imag: '<m v="1.2.0"><e>i</e></m>',
    real: '<m v="1.2.0"><e>a</e></m>',
    imag: '<m v="1.2.0"><e>b</e></m>',
    sen: '<m v="1.2.0"><e></e><f type="sin" group="function"><b p="latex">\text{sen}(<r ref="1"/>)</b><b p="text">sen($1)</b><c><e>z</e></c></f><e></e></m>',
    cos: '<m v="1.2.0"><e></e><f type="cos" group="trigonometry"><b p="latex">\cos\left(<r ref="1"/>\right)</b><b p="asciimath"> cos(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    tg: '<m v="1.2.0"><e></e><f type="tan" group="function"><b p="latex">\text{tg}(<r ref="1"/>)</b><b p="text">tg($1)</b><c><e>z</e></c></f><e></e></m>',
    sec: '<m v="1.2.0"><e></e><f type="sec" group="trigonometry"><b p="latex">\sec\left(<r ref="1"/>\right)</b><b p="asciimath"> sec(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    csc: '<m v="1.2.0"><e></e><f type="csc" group="trigonometry"><b p="latex">\csc\left(<r ref="1"/>\right)</b><b p="asciimath"> csc(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    cot: '<m v="1.2.0"><e></e><f type="cot" group="trigonometry"><b p="latex">\cot\left(<r ref="1"/>\right)</b><b p="asciimath"> cot(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    arcsen: '<m v="1.2.0"><e></e><f type="arcsin" group="function"><b p="latex">\text{arcsen}(<r ref="1"/>)</b><b p="text">arcsen($1)</b><c><e>z</e></c></f><e></e></m>',
    arccos: '<m v="1.2.0"><e></e><f type="arccos" group="trigonometry"><b p="latex">\arccos\left(<r ref="1"/>\right)</b><b p="asciimath"> arccos(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    arctan: '<m v="1.2.0"><e></e><f type="arctan" group="trigonometry"><b p="latex">\arctan\left(<r ref="1"/>\right)</b><b p="asciimath"> arctan(<r ref="1"/>)</b><c delete="1"><e>z</e></c></f><e></e></m>',
    arcsec: '<m v="1.2.0"><e></e><f type="arcsec" group="function"><b p="latex">\text{arcsec}(<r ref="1"/>)</b><b p="text">arcsec($1)</b><c><e>z</e></c></f><e></e></m>',
    arccsc: '<m v="1.2.0"><e></e><f type="arccsc" group="function"><b p="latex">\text{arccsc}(<r ref="1"/>)</b><b p="text">arccsc($1)</b><c><e>z</e></c></f><e></e></m>',
    arccot: '<m v="1.2.0"><e></e><f type="arccot" group="function"><b p="latex">\text{arccot}(<r ref="1"/>)</b><b p="text">arccot($1)</b><c><e>z</e></c></f><e></e></m>',
    hsen: '<m v="1.2.0"><e></e><f type="sinh" group="function"><b p="latex">\text{senh}(<r ref="1"/>)</b><b p="text">senh($1)</b><c><e>z</e></c></f><e></e></m>',
    hcos: '<m v="1.2.0"><e></e><f type="cosh" group="function"><b p="latex">\text{cosh}(<r ref="1"/>)</b><b p="text">cosh($1)</b><c><e>z</e></c></f><e></e></m>',
    htg: '<m v="1.2.0"><e></e><f type="tanh" group="function"><b p="latex">\text{tanh}(<r ref="1"/>)</b><b p="text">tanh($1)</b><c><e>z</e></c></f><e></e></m>',
    hsec: '<m v="1.2.0"><e></e><f type="sech" group="function"><b p="latex">\text{sech}(<r ref="1"/>)</b><b p="text">sech($1)</b><c><e>z</e></c></f><e></e></m>',
    hcot: '<m v="1.2.0"><e></e><f type="coth" group="function"><b p="latex">\text{coth}(<r ref="1"/>)</b><b p="text">coth($1)</b><c><e>z</e></c></f><e></e></m>',
    hcsc: '<m v="1.2.0"><e></e><f type="csch" group="function"><b p="latex">\text{csch}(<r ref="1"/>)</b><b p="text">csch($1)</b><c><e>z</e></c></f><e></e></m>',
    fatorial: '<m v="1.2.0"><e></e><f type="factorial" group="functions"><b p="latex"><r ref="1"/>!</b><b p="asciimath">(<r ref="1"/>)!</b><c bracket="yes" delete="1"><e>z</e></c></f><e></e></m>',
    zeta: '<m v="1.2.0"><e></e><f type="zeta" group="function"><b p="latex">\zeta(<r ref="1"/>)</b><b p="text">zeta($1)($1)</b><c><e>z</e></c></f><e></e></m>',
    gamma: '<m v="1.2.0"><e></e><f type="gamma" group="function"><b p="latex">\Gamma(<r ref="1"/>)</b><b p="text">gamma($1)($1)</b><c><e>z</e></c></f><e></e></m>',

}
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
    valorTamanhoGrafico: 500,
    graficoOcupaTelaInteiraActive: false,
    eixosCartesianos: true,
    animacaoLigada: true,
    variacaoInicio: 0,
    variacaoFim: 10,
    incremento: 0.5,
    fps: 30,
    valorTipoAnimacao: 'continue',
    valorTipoGrafico: 'continuo',
    delimitadores: {inicio_real: -2, fim_real: 2, inicio_imag: -2, fim_imag: 2},
    glFunction: '',
    tamanhoCanvas: 500,
    glContext: "",
    functionCache: {},
    currentFunction: "vec2(a,b)",
    glCanvas: {},
    canvas: {},
    sizeCache: {}
};

console.log = function(){}