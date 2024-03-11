import { HSLtoRGB, getNumeroInteiro} from './color.js';
import { operacoes } from './funcoes_complexas.js';
//Receber um ponto e converte-lo para uma cor
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



    if (tipo_grafico == 2) {
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
function Plotter(guppy) {
    /*alert('Guppy: ' + guppy)
    const f = guppy.func(operacoes);
    alert(guppy.engine.get_content('ast'));
    alert('f: ' + f)
    f({z: {real: 1, imag: 1}});
    alert('f({z: {real: 1, imag: 1}}): ' + f({z: {real: 1, imag: 1}}))*/
    const f = guppy.func(operacoes);
    console.log(f);
    console.log(f({ z: { real: 1, imag: 1 } }))
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
    const funcao = guppy.func(operacoes);
    funcaoHover = funcao;
    //Percorre todos os pixels
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            //antes de passar pela função
            let realAntes = getNumeroInteiro(x, y)[0];
            let imagAntes = getNumeroInteiro(x, y)[1];

            //Passamos os valores real e imag pela função
            //let z = getZvalue(realAntes, imagAntes, guppy.func(operacoes));
            let z = funcao({ 'z': { real: realAntes, imag: -imagAntes } });
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
    console.log(FIM - INICIO);
    //Coloca a imagem no canvas 
    canvasContext2d.putImageData(canvasImageData, 0, 0);
    console.log("Imagem desenhada");

}


export { Plotter, operacoes };