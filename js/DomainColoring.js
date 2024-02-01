
let canvas = null;
let guppy;
let qtndInteiros = 2;

var funcaoHover;
var resultado_real = 'a';
var resultado_imag = 'b';

let tipo_grafico = 1;

var abi = false;

function HSLtoRGB(h, s, l) {
    let r, g, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        let hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        }
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function Eixos (imgDataEixos, numeroInteiro){
    if (false) {
    let dataEixos = imgDataEixos.data;
    
    let posicoesInteiros = [];

    let cont = qtdInteiros * (-1);
    for (i = 0; i < ((qtdInteiros*2)+1); i++){
        posicoesInteiros[i] = numeroInteiro*cont;
        cont++;
    }

    console.log(posicoesInteiros);    

    let tamanhoEixo = 2;
    for (x = 0; x < width; x++){
        for (y = 0; y < height; y++){
            let px = (x + y * width) * 4;
            if ((x > centro-tamanhoEixo && x < centro+tamanhoEixo) || 
            (y > centro-tamanhoEixo && y < centro+tamanhoEixo)){
                dataEixos[px] = 100;
                dataEixos[px + 1] = 100;
                dataEixos[px + 2] = 100;
                dataEixos[px + 3] = 255;
            }

            posicoesInteiros.forEach(posicao => {
                let xCentro = x-centro;
                if ((xCentro > posicao-tamanhoEixo && xCentro < posicao+tamanhoEixo) && (y > centro-10 && y < centro+10)){
                    dataEixos[px] = 100;
                    dataEixos[px + 1] = 100;
                    dataEixos[px + 2] = 100;
                    dataEixos[px + 3] = 255;
                    //console.log("Posção em: " + posicao + "px");
                }

                let yCentro = y-centro;
                if ((yCentro > posicao-tamanhoEixo && yCentro < posicao+tamanhoEixo) && (x > centro-10 && x < centro+10)){
                    dataEixos[px] = 100;
                    dataEixos[px + 1] = 100;
                    dataEixos[px + 2] = 100;
                    dataEixos[px + 3] = 255;
                    //console.log("Posção em: " + posicao + "px");
                }
            });
        }
    }
    }


    //Coloca uma barra vertical de 10px de altura em cada numero inteiro


    //eixosContext2d.putImageData(ImgDataEixos, 0, 0);

    //console.log("Eixos desenhados: " + numeroInteiro);

    return imgDataEixos;
}


function getZvalue(a, b, f){
    
    let ret = {'z':{real: a, imag: b}};
    ret = {'z': f(ret)};
    return ret['z'];
}



//Recebe um pixel (real e imag) e retorna o valor real e imag em numeros inteiros.
function getNumeroInteiro(x, y){
    let width = canvas.width;
    let height = canvas.height;
    let centro = width/2;

    let pixelPorInteiro = (width/2)/Number(qtndInteiros);
    let real = (x-centro)/pixelPorInteiro;
    let imag = (y-centro)/pixelPorInteiro;

    return [real, imag];
}


//Receber um ponto e converte-lo para uma cor
//O cauculo do ponto é feito em outra função.
function Domain_coloring(real, imag)
{
    
    //Checa se explodiu para o infinito.
    if (real >= 9e+10 || real <= -9e+10 || imag >= 9e+10 || imag <= -9e+10){
        return [255,255,255];
    }

    //Angulo
    let hue = (Math.atan2(imag, real)) / (2*Math.PI);

    //Caucula a distancia do ponto até o centro (modulo)
    let dist = Math.sqrt(real * real + imag * imag);

    let modulo;

    

    if (tipo_grafico == 2){
        //Modo 2 (com descontinuidade):
        let expoente = Math.log2(dist);

        let expoente_decimal = 0;
        if (dist > 0){
            expoente_decimal = (expoente - Math.floor(expoente) -1)*(-1);
        }
        else{
            expoente_decimal = (expoente - Math.floor(expoente));
        }
        
        modulo = 1/((expoente_decimal**0.2) +1)-0.1;
    }
    else{
        //Modo 1 (sem descontinuidade):
        modulo = (2/Math.PI) * Math.atan(dist);
        let a = 0.4;
        modulo = (dist**a)/((dist**a)+1);
    }
    
    

            
    //let theta = (Math.atan(imag/real)) + (2*Math.PI);
    //if (real < 0)
    //{
    //    theta = theta + Math.PI;
    //}
    //theta *= 180/Math.PI;
    //const hue = theta % 360;
    
    //canvas.fillStyle = "hsl(" + hue + ", 100%, " + modulo*100 + "%)";
    //canvas.fillRect(x,y, 1,1);
            
            
    if (real =='Infinity' || real == '-Infinity' && imag == 'Infinity' || imag == '-Infinity'){
        modulo = 1;
    }
    let color = HSLtoRGB(hue, 1, modulo);
    return color;
    //Array de cores r[0] g[1] b[2]
}

//Receber o canvas, rodar por todos os pixels e colocar a cor
function Plotter(guppy){
    /*alert('Guppy: ' + guppy)
    const f = guppy.func(operacoes);
    alert(guppy.engine.get_content('ast'));
    alert('f: ' + f)
    f({z: {real: 1, imag: 1}});
    alert('f({z: {real: 1, imag: 1}}): ' + f({z: {real: 1, imag: 1}}))*/
    const canvasContext2d = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    let INICIO = performance.now();
    //Cria um array de pixels
    const canvasImageData = canvasContext2d.createImageData(width, height);
    const canvasData = canvasImageData.data;
    const funcao = guppy.func(operacoes);
    funcaoHover = funcao;
    //Percorre todos os pixels
    for (let x = 0; x < width; x++){
        for (let y = 0; y < height; y++){

            //antes de passar pela função
            let realAntes = getNumeroInteiro(x, y)[0];
            let imagAntes = getNumeroInteiro(x, y)[1];

            //Passamos os valores real e imag pela função
            //let z = getZvalue(realAntes, imagAntes, guppy.func(operacoes));
            let z = funcao({'z': {real: realAntes, imag: imagAntes}});
            real = z.real;
            imag = z.imag;

            //Pega a cor do pixel
            const color = Domain_coloring(real, imag);

            //Pega a posição do pixel
            const px = (x + y * width) * 4;

            //Coloca a cor no pixel
            canvasData[px] = color[0];
            canvasData[px + 1] = color[1];
            canvasData[px + 2] = color[2];
            canvasData[px + 3] = 255;
        }
    }
    let FIM = performance.now();
    console.log(FIM-INICIO);
    //Coloca a imagem no canvas
    canvasContext2d.putImageData(canvasImageData, 0, 0);
    console.log("Imagem desenhada");

}
function carregar()
{
    guppy = new Guppy('guppy1');
    //alert(guppy)
    guppy.engine.set_content(funcaoBase);
    //Funções exclusivas às complexas
    guppy.engine.add_symbol("conj", {"output": {"latex":"\\overline{{$1}}", "text":"conj($1)"}, "attrs": { "type":"conj", "group":"function"}});
    adicionarFuncao(guppy,"re","Re","Re","Re");
    adicionarFuncao(guppy,"im","Im","Im","Im");
    //Trigonométricas em português
    adicionarFuncao(guppy,"sen","sen","sen","sin");
    adicionarFuncao(guppy,"tg","tg","tg","tan");
    //Reversas trigonométricas
    adicionarFuncao(guppy,"arcsen","arcsen","arcsen","arcsin");
    adicionarFuncao(guppy,"arctg","arctg","arctg","arctan");
    adicionarFuncao(guppy,"arcsec","arcsec","arcsec","arcsec");
    //Reversas trigonométricas (abreviação)
    adicionarFuncao(guppy,"arsin","arsin","arcsen","arcsin");
    adicionarFuncao(guppy,"arsen","arsen","arcsen","arcsin");
    adicionarFuncao(guppy,"artg","artg","arctg","arctan");
    adicionarFuncao(guppy,"artan","artan","arctg","arctan");
    adicionarFuncao(guppy,"arsec","arsec","arcsec","arcsec");
    //Inversas trigonométricas reversas
    adicionarFuncao(guppy,"arccsc","arccsc","arccsc","arccsc");
    adicionarFuncao(guppy,"arccot","arccot","arccot","arccot");
    //Inversas trigonométricas reversas (abreviação)
    adicionarFuncao(guppy,"arcsc","arcsc","arccsc","arccsc");
    adicionarFuncao(guppy,"arcot","arcot","arccot","arccot");
    adicionarFuncao(guppy,"arsec","arsec","arsec","arcsec");
    //Hiperbólicas
    adicionarFuncao(guppy,"hsin","sinh","sinh","sinh");
    adicionarFuncao(guppy,"hsen","senh","senh","sinh");
    adicionarFuncao(guppy,"hcos","cosh","cosh","cosh");
    adicionarFuncao(guppy,"htan","tanh","tanh","tanh");
    adicionarFuncao(guppy,"htg","tanh","tanh","tanh");
    //Inversas hiperbólicas
    adicionarFuncao(guppy,"hsec","sech","sech","sech");
    adicionarFuncao(guppy,"hcsc","csch","csch","csch");
    adicionarFuncao(guppy,"hcot","coth","coth","coth");
    //Reversas hiperbólicas
    adicionarFuncao(guppy,"harcsin","arcsinh","arcsinh","arcsinh");
    adicionarFuncao(guppy,"harcsen","arcsenh","arcsinh","arcsinh");
    adicionarFuncao(guppy,"harccos","arccosh","arccosh","arccosh");
    adicionarFuncao(guppy,"harctan","arctanh","arctanh","arctanh");
    //Reversas hiperbólicas (abreviação)
    adicionarFuncao(guppy,"harsin","arsinh","arsinh","arcsinh");
    adicionarFuncao(guppy,"harsen","arsenh","arcsinh","arcsinh");
    adicionarFuncao(guppy,"harcos","arcosh","arccosh","arccosh");
    adicionarFuncao(guppy,"hartan","artanh","arctanh","arctanh");
    //Inversas hiperbólicas reversas
    adicionarFuncao(guppy,"harccsc","arccsch","arccsch","arccsch");
    adicionarFuncao(guppy,"harccot","arccoth","arccoth","arccoth");
    adicionarFuncao(guppy,"harcsec","arcsech","arcsech","arcsech");
    //Inversas hiperbólicas reversas (abreviação)
    adicionarFuncao(guppy,"harcsc","arcsch","arccsch","arccsch");
    adicionarFuncao(guppy,"harcot","arcoth","arccoth","arccoth");
    adicionarFuncao(guppy,"harsec","arsech","arcsech","arcsech");
    guppy.activate();
    init()
}
function init(){

    //alert(guppy)    
    
    document.addEventListener('keydown', function(event) {
        if (event.key == "Enter") {
            console.log(guppy.engine.get_content("ast"));
            console.log(guppy.func(operacoes))
            console.log(guppy.func(operacoes)({'z': {real: 1, imag: 1}}));  
            Plotter(guppy);
        }
    });
    abi = document.getElementById("abi").style.display === "none" ? false : true;
    canvas = document.getElementById("domainColorCanvas");

    let tamanhoCanvas = document.getElementById("tamanho_grafico").value;
    canvas.width = tamanhoCanvas;
    canvas.height = tamanhoCanvas;
    //alert(canvas);
    //var tempoInicial = performance.now();

    tipo_grafico = document.querySelector('input[name="tp_g"]:checked').value;
    
    qtndInteiros = document.getElementById('numero_inteiros').value;
    Plotter(guppy);
    //alert(qtndInteiros);
    //Função:
    if (!abi){
        /*let funcao = document.getElementById('funcao_complexa').value;

        //remove todos os espaços de 'função'
        //funcao = funcao.replace(/\s/g, '');
        //alert(funcao);
        let operacao = simplificarAntesAlgebrite(funcao);

        //checar se, apos alguma letra Z, há um algarismo que não seja:
        // (+, -, *, /, ^)
        //se houver, dar um alert de erro
        const teste = iniciarGambiarra(operacao);
        console.log ("Função inicial: " + teste[0]);
        const resultado = teste[0];
        const originais = teste[1];
        console.log("Função final: " + resultado);
        resultado_real = reverterGambiarra(Algebrite.real(resultado).toString(),originais);
        resultado_imag = reverterGambiarra(Algebrite.imag(resultado).toString(),originais);*/
    }
    else{
        resultado_real = document.getElementById('funcao_complexa_real').value;
        resultado_imag = document.getElementById('funcao_complexa_imag').value;
    }

    const tudo = document.getElementById('tudo');
    canvas.addEventListener('mousemove', function(event) {
        const num_inteiro = getNumeroInteiro();
        const x = event.offsetX;
        const y = event.offsetY;

        let realAntes = getNumeroInteiro(x, y)[0];
        let imagAntes = getNumeroInteiro(x, y)[1];

        let z = funcaoHover({'z' : {real: realAntes, imag: imagAntes}});
        let real = z.real; 
        let imag = z.imag;
        tudo.innerHTML = (`<i>F( ${realAntes.toFixed(3)} + ${imagAntes.toFixed(3) * (-1)}i ) = ${real.toFixed(3)} + ${imag.toFixed(3) * (-1)}i</i>`);
    });


    /*console.log("Parte real antes do processamento: " + resultado_real);
    console.log("Parte imaginária antes do processamento: " + resultado_imag);
    //Substitui ^ para vários * para que o eval possa entender

    resultado_real = limparFuncao(resultado_real);
    resultado_imag = limparFuncao(resultado_imag);
    console.log("Parte real após o processamento: " + resultado_real);
    console.log("Parte imaginária após o processamento: " + resultado_imag);*/


}

