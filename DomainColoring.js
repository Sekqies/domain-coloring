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

function init(){
    var canvasElement = document.getElementById("domainColorCanvas");
    var canvas = canvasElement.getContext("2d");
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

    width = canvasElement.width;
    height = canvasElement.height;
    var imageData = canvas.createImageData(width, height);
    /*Cria um array de pixels, com a largura e altura do canvas,
    para que possamos manipular os pixels individualmente.*/
    var data = imageData.data;
    /*Acessamos o array de pixels, que é um array de 4 bytes,
    onde cada 4 bytes representa um pixel, sendo cada byte a cor
    do pixel, no formato RGBA.*/
    //Pinta o canvas de vermelho
    var x, y, index;
    //F(C) Numeros complexos:
    
    for (x = 0; x < width; x++){
        for (y = 0; y < height; y++){
            
            
            var a = map(x, 0, width, -1000, 1000);
            var b = map(y, 0, height, -1000, 1000);
            //f(z) -> z
            //f(a + bi) -> a + bi
            //f(z) -> z+1
            //f(a+bi) -> a+bi+1
            //f(z) -> 1/z
            //f(a+bi) -> 1/(a+bi)
            var real = a
            var imag = b

            //Caucula o angulo no HSL
            var hue = (Math.PI - Math.atan2(imag, real)) / (2 * Math.PI);
            //Caucula a distancia do ponto até o centro
            var dist = Math.sqrt(real * real + imag * imag);

            var theClr = HSLtoRGB(hue, 1, dist / 1000);
            
            var px = (x + y * width) * 4;
            data[px] = theClr[0];
            data[px + 1] = theClr[1];
            data[px + 2] = theClr[2];
            data[px + 3] = 255;
        }
    }
    canvas.putImageData(imageData, 0, 0);
}

