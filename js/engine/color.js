

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

//Recebe um pixel (real e imag) e retorna o valor real e imag em numeros inteiros.
function getNumeroInteiro(x, y) {
    let width = canvas.width;
    const diff = variaveisGlobais.delimitadores.fim_real - variaveisGlobais.delimitadores.inicio_real;
    const somar = variaveisGlobais.delimitadores.inicio_real + variaveisGlobais.delimitadores.fim_real;
    const somai = variaveisGlobais.delimitadores.inicio_imag + variaveisGlobais.delimitadores.fim_imag;
    let centrox = width / 2 + somar;
    let centroy = width/2 + somai;
    let pixelPorInteiro = (centrox) / Number(diff/2);
    let real = (x - centrox) / pixelPorInteiro + somar/2;
    let imag = (y - centroy) / pixelPorInteiro + somai/2;

    return [real, imag];
}

function getPixelPorInteiro() {
    let width = canvas.width;
    let centro = width / 2;
    const diff = variaveisGlobais.delimitadores.fim_real - variaveisGlobais.delimitadores.inicio_real;
    let pixelPorInteiro = (centro) / Number(diff/2);

    return pixelPorInteiro;
}

export { HSLtoRGB, getNumeroInteiro, getPixelPorInteiro};