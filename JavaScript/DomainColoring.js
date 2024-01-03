
let canvas = null;

let qtndInteiros = 2;

var funcao = 'z';
var resultado_real = 'a';
var resultado_imag = 'b';

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


function getZvalue(a, b){
   

    let real = eval(resultado_real);
    let imag = eval(resultado_imag);

    return [real, imag];
}



//Recebe um pixel (real e imag) e retorna o valor real e imag em numeros inteiros.
function getNumeroInteiro(x, y){
    let width = canvas.width;
    let height = canvas.height;
    let centro = width/2;

    let pixelPorInteiro = (width/2)/qtndInteiros;
    let real = (x-centro)/pixelPorInteiro;
    let imag = (y-centro)/pixelPorInteiro;

    return [real, imag];
}


//Receber um ponto e converte-lo para uma cor
//O cauculo do ponto é feito em outra função.
function Domain_coloring(real, imag)
{
    //Angulo
    let hue = -(Math.atan2(imag, real)) / (2*Math.PI);

    //Caucula a distancia do ponto até o centro (modulo)
    let dist = Math.sqrt(real * real + imag * imag);

    let modulo;

    //Modo 1 (sem descontinuidade):

    //modulo = (2/Math.PI) * Math.atan(dist);
    modulo = (dist**0.4)/((dist**0.4)+1);


            
    //let theta = (Math.atan(imag/real)) + (2*Math.PI);
    //if (real < 0)
    //{
    //    theta = theta + Math.PI;
    //}
    //theta *= 180/Math.PI;
    //const hue = theta % 360;
    
    //canvas.fillStyle = "hsl(" + hue + ", 100%, " + modulo*100 + "%)";
    //canvas.fillRect(x,y, 1,1);
            
            

    let color = HSLtoRGB(hue, 1, modulo);
    return color;
    //Array de cores r[0] g[1] b[2]
}

//Receber o canvas, rodar por todos os pixels e colocar a cor
function Plotter(){
    const canvasContext2d = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    //Cria um array de pixels
    const canvasImageData = canvasContext2d.createImageData(width, height);
    const canvasData = canvasImageData.data;

    //Percorre todos os pixels
    for (let x = 0; x < width; x++){
        for (let y = 0; y < height; y++){

            //antes de passar pela função
            let realAntes = getNumeroInteiro(x, y)[0];
            let imagAntes = getNumeroInteiro(x, y)[1];

            //Passamos os valores real e imag pela função
            let z = getZvalue(realAntes, imagAntes);
            real = z[0];
            imag = z[1];

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

    //Coloca a imagem no canvas
    canvasContext2d.putImageData(canvasImageData, 0, 0);
    console.log("Imagem desenhada");

}
function init(){
    abi = document.getElementById("abi").style.display === "none" ? false : true;
    canvas = document.getElementById("domainColorCanvas");
    //alert(canvas);
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
    if (!abi){
        let funcao = document.getElementById('funcao_complexa').value;

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
        resultado_imag = reverterGambiarra(Algebrite.imag(resultado).toString(),originais);
    }
    else{
        resultado_real = document.getElementById('funcao_complexa_real').value;
        resultado_imag = document.getElementById('funcao_complexa_imag').value;
    }

    const tudo = document.getElementById('tudo');
    /*canvasElement.addEventListener('mousemove', function(event) {
        const num_inteiro = getNumeroInteiro();
        const x = ((event.offsetX - centro)/num_inteiro).toFixed(3);
        const y = ((event.offsetY - centro)/num_inteiro).toFixed(3);
        let z = getZvalue(x, y, resultado_real, resultado_imag);
        let real = (z[0]).toFixed(3);
        let imag = (z[1]).toFixed(3);
        tudo.innerHTML = (`<i>F( ${x} + ${y}i ) = ${real} + ${imag}i</i>`);
    });*/


    console.log("Parte real antes do processamento: " + resultado_real);
    console.log("Parte imaginária antes do processamento: " + resultado_imag);
    //Substitui ^ para vários * para que o eval possa entender

    resultado_real = limparFuncao(resultado_real);
    resultado_imag = limparFuncao(resultado_imag);
    console.log("Parte real após o processamento: " + resultado_real);
    console.log("Parte imaginária após o processamento: " + resultado_imag);

    
    Plotter();
}

