var canvas, imageData, data, width, height;

function HSLtoRGB(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
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
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function Comlexo_1(canvasElement, numeroInteiro)
{
    
    width = canvasElement.width;
    height = canvasElement.height;

    canvas = canvasElement.getContext("2d");

    var imageData = canvas.createImageData(width, height);
    /*Cria um array de pixels, com a largura e altura do canvas,
    para que possamos manipular os pixels individualmente.*/
    var data = imageData.data;
    /*Acessamos o array de pixels, que é um array de 4 bytes,
    onde cada 4 bytes representa um pixel, sendo cada byte a cor
    do pixel, no formato RGBA.*/
    //Pinta o canvas de vermelho
    var x, y, index;
    var centro = width/2;
    //F(C) Numeros complexos:

    //var maxDist = Math.floor(Math.sqrt(centro * centro + centro * centro));

    centro = 250 * 2;
    var maxDist = Math.floor(Math.sqrt(centro * centro + centro * centro));
    console.log("maxdist:" + maxDist + " Centro: " + centro + " NumeroInt: " + numeroInteiro);

    for (x = 0; x < width; x++){
        for (y = 0; y < height; y++){
            
            
            var a = x - centro;
            var b = y - centro;
            //f(z) -> z
            //f(a + bi) -> a + bi
            //f(z) -> z+1
            //f(a+bi) -> a+bi+1
            //f(z) -> 1/z
            //f(a+bi) -> 1/(a+bi)
            var real = a
            var imag = b

            //Caucula o angulo no HSL
            var hue = (Math.PI - Math.atan2(imag, real)) / (2*Math.PI);

            //Caucula a distancia do ponto até o centro
            var dist = Math.sqrt(real * real + imag * imag);
            
            
            var lastIntDist = Math.floor(dist);
            var nextIntDist = Math.ceil(dist);

            var modulo = (dist / 400);
            //var modulo = ((dist - lastIntDist) / 2*(nextIntDist - lastIntDist)) + 0.5;


            var theClr = HSLtoRGB(hue, 1, modulo);
            
            var px = (x + y * width) * 4;

            data[px] = theClr[0];
            data[px + 1] = theClr[1];
            data[px + 2] = theClr[2];
            data[px + 3] = 255;
        }
    }
    
    canvas.putImageData(imageData, 0, 0);
}

function Eixos (canvasElement){
    var width = canvasElement.width;
    var height = canvasElement.height;
    var centro = width/2;

    var eixosContext2d = canvasElement.getContext("2d");
    var ImgDataEixos = eixosContext2d.createImageData(width, height);
    var dataEixos = ImgDataEixos.data;


    var qtdInteiros = 2;
    var numerosInteiros = (Math.floor((centro - 0.1*centro)/(qtdInteiros*100)))*100; //Esses *100 faz com que o numero seja multiplo de 100
    console.log(numerosInteiros);
    var posicoesInteiros = [];

    var cont = qtdInteiros * (-1);
    for (i = 0; i < ((qtdInteiros*2)+1); i++){
        posicoesInteiros[i] = numerosInteiros*cont;
        cont++;
    }

    console.log(posicoesInteiros);    

    var tamanhoEixo = 2;
    for (x = 0; x < width; x++){
        for (y = 0; y < height; y++){
            var px = (x + y * width) * 4;
            if ((x > centro-tamanhoEixo && x < centro+tamanhoEixo) || 
            (y > centro-tamanhoEixo && y < centro+tamanhoEixo)){
                dataEixos[px] = 100;
                dataEixos[px + 1] = 100;
                dataEixos[px + 2] = 100;
                dataEixos[px + 3] = 255;
            }
            else{
                //Coloca transparente
                dataEixos[px + 3] = 0;
            }

            posicoesInteiros.forEach(posicao => {
                var xCentro = x-centro;
                if ((xCentro > posicao-tamanhoEixo && xCentro < posicao+tamanhoEixo) && (y > centro-10 && y < centro+10)){
                    dataEixos[px] = 100;
                    dataEixos[px + 1] = 100;
                    dataEixos[px + 2] = 100;
                    dataEixos[px + 3] = 255;
                    console.log("Posção em: " + posicao + "px");
                }

                var yCentro = y-centro;
                if ((yCentro > posicao-tamanhoEixo && yCentro < posicao+tamanhoEixo) && (x > centro-10 && x < centro+10)){
                    dataEixos[px] = 100;
                    dataEixos[px + 1] = 100;
                    dataEixos[px + 2] = 100;
                    dataEixos[px + 3] = 255;
                    console.log("Posção em: " + posicao + "px");
                }
            });
        }
    }


    //Coloca uma barra vertical de 10px de altura em cada numero inteiro


    eixosContext2d.putImageData(ImgDataEixos, 0, 0);

    console.log("Eixos desenhados: " + numerosInteiros);
    return numerosInteiros;
}

function init(){
    var canvasElement = document.getElementById("domainColorCanvas");

    var tudo = document.getElementById("tudo");
    var cor= document.getElementById("cor");
    canvasElement.addEventListener('mousemove', function(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        const pixelData = canvas.getImageData(x, y, 1, 1).data;
        tudo.innerHTML = (`Pixel color at (${x}, ${y}): rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`);
        cor.style.backgroundColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`;
        
    });


    /*Isso permite que façamos manipulação de pixels no campo 2d do canvas, 
    para a criação de graficos, etc.*/

    const eixos = document.getElementById("eixos");
    numeroInteiro = Eixos(eixos);

    Comlexo_1(canvasElement, numeroInteiro);
    

    
    
    
}

