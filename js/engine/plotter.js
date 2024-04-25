import { HSLtoRGB, getNumeroInteiro, getPixelPorInteiro} from './color.js';
import {lista } from './funcoes_complexas.js';
//Receber um pooperacoesnto e converte-lo para uma cor
//O cauculo do ponto é feito em outra função.
function Domain_coloring(real, imag) {

    //Checa se explodiu para o infinito. 


    //Angulo



    //NÃO MEXE NISSO
    let hue = (Math.atan2(imag, real)) / (2 * Math.PI);
    //PERIGO !!! PERIGO!!!!! NÃO MEXE!!!! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA



    //Calcula a distancia do ponto até o centro (modulo)
    let dist = Math.sqrt(real * real + imag * imag);

    let modulo;



    if (variaveisGlobais.valorTipoGrafico != 'continuo') {
        //Modo 2 (com descontinuidade):
        dist = dist == "Infinity" ? 10e50 : dist;
        let expoente = Math.log2(dist);

        //Isso faz com que numeros menores que aprox 1/2 fiquem sem desconitnuidade, porem é inperceptivel.
        let expoente_decimal = 1;

        if (dist != 0) {
            expoente_decimal = -(expoente - Math.floor(expoente) - 1);
        }
        modulo = 1 / ((expoente_decimal ** 0.2) + 1) - 0.1;
        modulo = modulo % 1;

        //Formula do algorithm archivce:
        //modulo = 0.5 + 0.5 * (dist - Math.floor(dist));
    }
    else {
        if (real >= 9e+10 || real <= -9e+10 || imag >= 9e+10 || imag <= -9e+10) {
            return [255, 255, 255];
        }

        //Modo 1 (sem descontinuidade):
        //modulo = (2/Math.PI) * Math.atan(dist);
        let a = 0.4;
        modulo = (dist ** a) / ((dist ** a) + 1);
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


    if (real == 'Infinity' || real == '-Infinity' && imag == 'Infinity' || imag == '-Infinity') {
        modulo = 1;
    }

    let color = HSLtoRGB(hue, 1, modulo);
    return color;
    //Array de cores r[0] g[1] b[2]
}



//Receber o canvas, rodar por todos os pixels e colocar a cor
function Plotter(funcaoHover) {
    /*alert('Guppy: ' + guppy)
    const f = guppy.func(operacoes);
    alert(guppy.engine.get_content('ast'));
    alert('f: ' + f)
    f({z: {real: 1, imag: 1}});
    alert('f({z: {real: 1, imag: 1}}): ' + f({z: {real: 1, imag: 1}}))*/


    console.log("Funcao: ", funcaoHover({ z: { real: 1, imag: 1 } }))
    const canvasContext2d = canvas.getContext("2d");
    const width = canvas.width;

    //define o scroll vertical e horizontal da tela para metade do total
    window.scroll((document.documentElement.scrollWidth - window.innerWidth) / 2,
        (document.documentElement.scrollHeight - window.innerHeight) / 2);

    const height = canvas.height;
    let INICIO = performance.now();
    //Cria um array de pixels
    const canvasImageData = canvasContext2d.createImageData(width, height);
    const canvasData = canvasImageData.data;
    
    //Percorre todos os pixels
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            //antes de passar pela função
            let realAntes = getNumeroInteiro(x, y)[0];
            let imagAntes = getNumeroInteiro(x, y)[1];

            //Passamos os valores real e imag pela função
            //let z = getZvalue(realAntes, imagAntes, guppy.func(operacoes));
            let z = funcaoHover({ 'z': { real: realAntes, imag: -imagAntes } });
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
    console.log("Tempo de Plotter com JS:", FIM - INICIO);
    //Coloca a imagem no canvas 
    canvasContext2d.putImageData(canvasImageData, 0, 0);
    console.log("Imagem desenhada");

}

function Eixos(){
    const eixosCanvas = document.getElementsByClassName('eixosCanvas');
    for(let i = 0; i < eixosCanvas.length; i++) {
        const canvas = eixosCanvas[i];
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = "bold 15px Arial";
        ctx.fillRect(width / 2, 0, 1, height);
        ctx.fillRect(0, height / 2, width, 1);
        let centro = width / 2;
        let pixelPorInteiro = getPixelPorInteiro();

        for (let real = pixelPorInteiro; real < width; real += pixelPorInteiro) {
            let x = real;
            let y = (height / 2)-3;

            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(x, y, 1, 6);

            ctx.fillStyle = 'rgba(255,255,255,1)';
            let texto = Math.round((real - centro) / pixelPorInteiro);
            ctx.fillText(texto, x+4, y - 4);
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.strokeText(texto, x+4, y - 4);

            //Colocar uma cor mais transparente por toda a linha
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(x, 0, 1, height);

        }


        for (let imag = pixelPorInteiro; imag < height; imag += pixelPorInteiro) {
            let x = (width / 2)-3;
            let y = imag;
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(x, y, 6, 1);

            ctx.fillStyle = 'rgba(255,255,255,1)';
            let texto = Math.round((imag - centro) / pixelPorInteiro);
            if(Math.round((imag - centro) / pixelPorInteiro) != 0)
            {
                ctx.fillText(texto, x + 8, y - 4);
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.strokeText(texto, x + 8, y - 4);

            }
                

            //Colocar uma cor mais transparente por toda a linha
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(0, y, width, 1);
        }


    }
    console.log("Eixos desenhados");
}

export { Plotter, lista, Eixos};