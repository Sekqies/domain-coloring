import { getNumeroInteiro } from '/js/engine/color.js';

function loadHover(funcaoHover, nomeStringCanvas) {
    let nomeCanvas = document.getElementById(nomeStringCanvas);
    descricaoFuncao = document.getElementById('descricaoFuncao');
    nomeCanvas.addEventListener('mousemove', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;

        if (nomeStringCanvas == "glCanvas") {
            descricaoFuncao.style.top = y + 'px';
            descricaoFuncao.style.left = x + nomeCanvas.offsetWidth + 80 + 'px';
        }
        else {
            descricaoFuncao.style.top = y + 'px';
            descricaoFuncao.style.left = x + 90 + 'px';
        }

        let realAntes = getNumeroInteiro(x, y)[0];
        let imagAntes = getNumeroInteiro(x, y)[1];

        let z = funcaoHover({ 'z': { real: realAntes, imag: -imagAntes } });

        //console.log(z)

        let real = z.real;
        let imag = z.imag;

        if (real > 100 || real < -100) {
            real = Number(real).toExponential(2);
        }
        if (imag > 100 || imag < -100) {
            imag = Number(imag).toExponential(2);
        }


        if (String(real).includes('e+')) {
            let real1 = real.toString().split('e+')[0];
            let real2 = real.toString().split('e+')[1];
            real = Number(real1).toFixed(2) + ' * 10^' + real2;
        }
        else {
            real = Number(real).toFixed(2);
        }

        if (String(imag).includes('e+')) {
            let imag1 = imag.toString().split('e+')[0];
            let imag2 = imag.toString().split('e+')[1];
            imag = Number(imag1).toFixed(2) + ' * 10^' + imag2;
        }
        else {
            imag = Number(imag).toFixed(2);
        }

        if (real == 'NaN') {
            real = 0;
        }

        if (imag == 'NaN') {
            imag = 0;
        }

        if (real == 'Infinity' || real == '-Infinity') {
            real = '∞';
        }

        if (imag == 'NaN' || imag == 'Infinity' || imag == '-Infinity') {
            imag = '∞';
        }
        //da split em e+ na string e pega o primeiro valor

        descricaoFuncao.innerHTML = (`<i>f( ${Number(realAntes).toFixed(2)} + ${Number(imagAntes).toFixed(2) * (-1)}i ) = ${real} + ${imag}i</i>`);
    });

}

export { loadHover };