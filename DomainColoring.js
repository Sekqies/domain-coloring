let canvas, imageData, data, width, height; 
var qtdInteiros = 10;
var centro = 300;
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

function getNumeroInteiro(){
    let numeroInteiro = (Math.floor((centro)/(qtdInteiros))); 
    return numeroInteiro;
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


function getZvalue(x, y, resultado_real, resultado_imag){
    let numeroInteiro = getNumeroInteiro();

    let a = (x - centro)/numeroInteiro; //conversão de pixel para o plano.
    let b = (y - centro)/numeroInteiro;
    //f(z) -> z
    
    let real = eval(resultado_real);
    let imag = eval(resultado_imag);

    let z = [real, imag];
    return z;
}

function Complexo_1(canvasElement, tipo_grafico,funcao,resultado_real,resultado_imag, tempoInicial)
{
    
    width = canvasElement.width;
    height = canvasElement.height;

    canvas = canvasElement.getContext("2d");

    let imageData = canvas.createImageData(width, height);
    /*Cria um array de pixels, com a largura e altura do canvas,
    para que possamos manipular os pixels individualmente.*/
    let data = imageData.data;
    /*Acessamos o array de pixels, que é um array de 4 bytes,
    onde cada 4 bytes representa um pixel, sendo cada byte a cor
    do pixel, no formato RGBA.*/
    //Pinta o canvas de vermelho
    let x, y, index;
    //F(C) Numeros complexos:

    //let maxDist = Math.floor(Math.sqrt(centro * centro + centro * centro));
    numeroInteiro = getNumeroInteiro();
    //console.log("maxdist:" + maxDist + " Centro: " + centro + " NumeroInt: " + numeroInteiro);

    
    for (x = 0; x < width; x++){
        for (y = 0; y < height; y++){
            
            
            //let a = (x - centro)/numeroInteiro; //conversão de pixel para o plano.
            //let b = (y - centro)/numeroInteiro;
            //f(z) -> z
            
            //let real = eval(resultado_real);
            //let imag = eval(resultado_imag);

            let z = getZvalue(x, y, resultado_real, resultado_imag);
            let real = z[0];
            let imag = z[1];
            //f(z) -> z^3 - 1
            //let real = a*a*a - 3*a*b*b - 1;
            //let imag = 3*a*a*b - b*b*b;

            //Caucula o angulo no HSL
            let hue = -(Math.atan2(imag, real)) / (2*Math.PI);

            //Caucula a distancia do ponto até o centro
            let dist = Math.sqrt(real * real + imag * imag);

            let modulo;

            //Modo 1 (sem descontinuidade):
            if (tipo_grafico == 1)
            {
                modulo = (2/Math.PI) * Math.atan(dist);
            }
            else if (tipo_grafico == 2)
            {
                //modo 2 (com descontinuidade):

                if (dist > 1)
                {
                    modulo = (Math.log2(dist))/(Math.ceil(Math.log2(dist)))-0.2;
                }
                else if (dist < 1 && dist > 0)
                {
                    modulo = dist-0.2;
                }
                else{
                    modulo = 0.5;
                }
            }

            
            

            let theClr = HSLtoRGB(hue, 1, modulo);
            
            let px = (x + y * width) * 4;

            data[px] = theClr[0];
            data[px + 1] = theClr[1];
            data[px + 2] = theClr[2];
            data[px + 3] = 255;
        }

    }
    
    imageDataEixos = Eixos(imageData, numeroInteiro);
    canvas.putImageData(imageDataEixos, 0, 0);
    var tempoFinal = performance.now();
    var tempoTotal = tempoFinal - tempoInicial;
    console.log(tempoTotal);
}

function init(){
    var tempoInicial = performance.now();
    let canvasElement = document.getElementById("domainColorCanvas");

    //let tamanho_grafico = document.getElementById('tamanho_grafico').value;
    //canvasElement.width = tamanho_grafico;
    //canvasElement.height = tamanho_grafico;
    centro = canvasElement.width/2;
    //Checa qual o checkbox selecionado (nome = 'tp_g')
    let tipo_grafico = document.querySelector('input[name="tp_g"]:checked').value;
    
    qtdInteiros = document.getElementById('numero_inteiros').value;
    //alert(qtdInteiros);
    //alert(tipo_grafico);
    /*Isso permite que façamos manipulação de pixels no campo 2d do canvas, 
    para a criação de graficos, etc.*/
    
    //numeroInteiro = Eixos(canvasElement);

    //Função:
    let funcao = document.getElementById('funcao_complexa').value;
    let operacao = simplificarAntesAlgebrite(funcao);

    //remove todos os espaços de 'função'
    funcao = funcao.replace(/\s/g, '');
    //alert(funcao);

    //checar se, apos alguma letra Z, há um algarismo que não seja:
    // (+, -, *, /, ^)
    //se houver, dar um alert de erro

    resultado = operacao;
    console.log("Função final: " + resultado);
    let resultado_real = Algebrite.real(resultado).toString();
    let resultado_imag = Algebrite.imag(resultado).toString();
    console.log("Parte real antes do processamento: " + resultado_real);
    console.log("Parte imaginária antes do processamento: " + resultado_imag);
    //Substitui ^ para vários * para que o eval possa entender
    resultado_real = simplificarExponencial(resultado_real);
    resultado_real = limparFuncao(resultado_real);
    
    resultado_imag = limparFuncao(resultado_imag);
    resultado_imag = simplificarExponencial(resultado_imag);
    console.log("Parte real após o processamento: " + resultado_real);
    console.log("Parte imaginária após o processamento: " + resultado_imag);
    Complexo_1(canvasElement, tipo_grafico,resultado,resultado_real, resultado_imag, tempoInicial);
}

