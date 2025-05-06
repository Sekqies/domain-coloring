import { HSLtoRGB, getCoordinate, getPixelPorInteiro, getPixel } from './color.js';
import { lista } from './funcoes_complexas.js';

/**
 * Map a complex value to an RGB color for domain coloring.
 */
function Domain_coloring(real, imag) {
    const hue = Math.atan2(imag, real) / (2 * Math.PI);
    const dist = Math.hypot(real, imag);
    let light;

    if (variaveisGlobais.valorTipoGrafico !== 'continuo') {
        // Discontinuous coloring
        const safeDist = dist === Infinity ? 1e50 : dist;
        const expo = Math.log2(safeDist);
        const frac = safeDist === 0 ? 0 : -(expo - Math.floor(expo) - 1);
        light = 1 / ((Math.pow(frac, 0.2)) + 1) - 0.1;
        light %= 1;
    } else {
        // Continuous coloring
        if (!isFinite(real) || !isFinite(imag)) return [255, 255, 255];
        const a = 0.4;
        light = Math.pow(dist, a) / (Math.pow(dist, a) + 1);
    }

    return HSLtoRGB(hue, 1, light);
}

/**
 * Render the domain colored function onto the canvas.
 */
function Plotter(funcaoHover) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const [re, im] = getCoordinate(x, y);
            const { real, imag } = funcaoHover({ z: { real: re, imag: im } });
            const [r, g, b] = Domain_coloring(real, imag);
            const idx = (y * width + x) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(image, 0, 0);
}
function getContrastingTextColor(r, g, b) {
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance >=220 ? 'black' : 'white';
}


/**
 * Draw axes, ticks, and labels on canvases with class 'eixosCanvas'.
 */
function Eixos() {
    const canvases = document.getElementsByClassName('eixosCanvas');
    const { x: cx, y: cy } = variaveisGlobais.centro;
    const radius = variaveisGlobais.raio;
    const pixelPerUnit = getPixelPorInteiro();

    Array.from(canvases).forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2 - cx * pixelPerUnit;
        const centerY = height / 2 + cy * pixelPerUnit;

        // Estilo base
        ctx.lineWidth = 1;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Eixos principais
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        const tickLen = 6;
        const labelOffset = 12;

        // Cálculo de stepUnit com base no zoom
        const idealSpacing = 50;
        let stepUnit;
        if (radius === 1) {
            stepUnit = 0.5;
        } else {
            const rawStep = idealSpacing / pixelPerUnit;
            const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
            const candidates = [1, 2, 5, 10];
            stepUnit = candidates.find(c => c * magnitude >= rawStep) * magnitude;
        }

        // Grades verticais (X)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        let minX = Math.ceil(-(centerX) / pixelPerUnit / stepUnit) * stepUnit;
        let maxX = Math.floor((width - centerX) / pixelPerUnit / stepUnit) * stepUnit;
        for (let u = minX; u <= maxX; u += stepUnit) {
            const xPos = centerX + u * pixelPerUnit;
            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, height);
            ctx.stroke();
        }

        // Grades horizontais (Y)
        let minY = Math.ceil(-(height - centerY) / pixelPerUnit / stepUnit) * stepUnit;
        let maxY = Math.floor((centerY) / pixelPerUnit / stepUnit) * stepUnit;
        for (let v = minY; v <= maxY; v += stepUnit) {
            const yPos = centerY - v * pixelPerUnit;
            ctx.beginPath();
            ctx.moveTo(0, yPos);
            ctx.lineTo(width, yPos);
            ctx.stroke();
        }

        // Volta para cor dos eixos
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';

        // Ticks X
        for (let u = minX; u <= maxX; u += stepUnit) {  
            if (Math.abs(u) < 1e-8) continue;
            const xPos = centerX + u * pixelPerUnit;
        
            // Cor adaptativa
            const [r,g,b] = Domain_coloring(u + variaveisGlobais.centro.x, variaveisGlobais.centro.y);
            ctx.fillStyle = getContrastingTextColor(r, g, b);   

        
            ctx.beginPath();
            ctx.moveTo(xPos, centerY - tickLen);
            ctx.lineTo(xPos, centerY + tickLen);
            ctx.stroke();
            ctx.fillText(u.toFixed(2).replace(/\.?0+$/, ''), xPos, centerY + labelOffset);
        }
        

        // Ticks Y
        for (let v = minY; v <= maxY; v += stepUnit) {
            if (Math.abs(v) < 1e-8) continue;
            const yPos = centerY - v * pixelPerUnit;
        
            const [r,g,b] = Domain_coloring(variaveisGlobais.centro.x, v + variaveisGlobais.centro.y);
            ctx.fillStyle = getContrastingTextColor(r, g, b);   
        
            ctx.beginPath();
            ctx.moveTo(centerX - tickLen, yPos);
            ctx.lineTo(centerX + tickLen, yPos);
            ctx.stroke();
            ctx.fillText(v.toFixed(2).replace(/\.?0+$/, '') + 'i', centerX - labelOffset, yPos);
        }
        
    });
}



export { Plotter, lista as listaFuncoes, Eixos };