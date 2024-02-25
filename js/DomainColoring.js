
let canvas = null;
let guppy;
let qtndInteiros = 2;

var funcaoHover;
var resultado_real = 'a';
var resultado_imag = 'b';
let tudo;

var graficoTelainteira = false;

let tipo_grafico = 1;

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
const teste = true;

function Eixos(imgDataEixos, numeroInteiro) {
    if (teste) {
        let dataEixos = imgDataEixos.data;

        let posicoesInteiros = [];

        let cont = qtdInteiros * (-1);
        for (i = 0; i < ((qtdInteiros * 2) + 1); i++) {
            posicoesInteiros[i] = numeroInteiro * cont;
            cont++;
        }

        console.log(posicoesInteiros);

        let tamanhoEixo = 2;
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                let px = (x + y * width) * 4;
                if ((x > centro - tamanhoEixo && x < centro + tamanhoEixo) ||
                    (y > centro - tamanhoEixo && y < centro + tamanhoEixo)) {
                    dataEixos[px] = 100;
                    dataEixos[px + 1] = 100;
                    dataEixos[px + 2] = 100;
                    dataEixos[px + 3] = 255;
                }

                posicoesInteiros.forEach(posicao => {
                    let xCentro = x - centro;
                    if ((xCentro > posicao - tamanhoEixo && xCentro < posicao + tamanhoEixo) && (y > centro - 10 && y < centro + 10)) {
                        dataEixos[px] = 100;
                        dataEixos[px + 1] = 100;
                        dataEixos[px + 2] = 100;
                        dataEixos[px + 3] = 255;
                        //console.log("Posção em: " + posicao + "px");
                    }

                    let yCentro = y - centro;
                    if ((yCentro > posicao - tamanhoEixo && yCentro < posicao + tamanhoEixo) && (x > centro - 10 && x < centro + 10)) {
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


function getZvalue(a, b, f) {

    let ret = { 'z': { real: a, imag: b } };
    ret = { 'z': f(ret) };
    return ret['z'];
}



//Recebe um pixel (real e imag) e retorna o valor real e imag em numeros inteiros.
function getNumeroInteiro(x, y) {
    let width = canvas.width;
    let centro = width / 2;

    let pixelPorInteiro = (centro) / Number(qtndInteiros);
    let real = (x - centro) / pixelPorInteiro;
    let imag = (y - centro) / pixelPorInteiro;

    return [real, imag];
}


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

        //Isso faz com que numeros menores que aprox 1/2 fiquem sem desconitnuidade, porem é imperceptivel.
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
function writeFragmentShader(funcao, width, height, funcoes_gl, inteiros) {
    let continuo = tipo_grafico == 1;
    let vazio = funcoes_gl.size === 0;
    let funcoes = "";
    for (let value of funcoes_gl) {
        funcoes += value + "\n";
    }
    console.log(funcoes);
    return `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    const float PI = 3.141592653589793238462643383279502884197169393751;



    float cosh(float x)
    {
        return (exp(x) + exp(-x))/2.0;
    }
    float sinh(float x)
    {
        return (exp(x) - exp(-x))/2.0;
    }
    float senh(float x)
    {
        return sinh(x);
    }
    vec2 csum(vec2 a, vec2 b) { return vec2(a.x + b.x, a.y + b.y); }
    vec2 csub(vec2 a, vec2 b) { return vec2(a.x - b.x, a.y - b.y); }
    vec2 cmult(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
    vec2 cdiv(vec2 a, vec2 b) { float denominador = pow(b.x,2.0) + pow(b.y,2.0); return vec2((a.x*b.x + a.y * b.y) / denominador, (a.y*b.x - a.x*b.y) / denominador); }
    vec2 cexpo(vec2 a, vec2 b) { float logmag = (0.5 * log(pow(a.x,2.0) + pow(a.y,2.0))); float argumento = atan(a.y,a.x); return vec2(exp(b.x * logmag - b.y * argumento) * cos(b.y * logmag + b.x * argumento), exp(b.x * logmag - b.y * argumento) * sin(b.y * logmag + b.x * argumento)); }
    vec2 csqrt (vec2 a) { return cexpo(a,vec2(0.5,0.0));}
    vec2 clog(vec2 a) { return vec2(0.5 * log(pow(a.x,2.0) + pow(a.y,2.0)), atan(a.y,a.x)); }
    vec2 csen(vec2 a) { return vec2(sin(a.x)*cosh(a.y), cos(a.x)*sinh(a.y)); }
    vec2 ccos(vec2 a) { return vec2(cos(a.x)*cosh(a.y), -sin(a.x) * sinh(a.y)); }
    vec2 ctan(vec2 a) { return cdiv(csen(a),ccos(a));}
    vec2 csec (vec2 a) { return cdiv(vec2(2.0,0.0),ccos(a)); }
    vec2 ccsc(vec2 a) { return cdiv(vec2(1.0,0.0),csen(a)); }
    vec2 ccot(vec2 a) { return cdiv(vec2(1.0,0.0),ctan(a));}
    vec2 csenh(vec2 a) { return vec2(sinh(a.x)*cos(a.y), cosh(a.x)*sin(a.y)); }
    vec2 ccosh(vec2 a) { return vec2(cosh(a.x)*cos(a.y), sinh(a.x)*sin(a.y)); }
    vec2 ctanh(vec2 a) { return cdiv(csenh(a),ccosh(a)); }
    vec2 ccsch(vec2 a) { return cdiv(vec2(1.0,0.0),csenh(a)); }
    vec2 csech(vec2 a) { return cdiv(vec2(1.0,0.0),ccosh(a)); }
    vec2 ccoth(vec2 a) { return cdiv(vec2(1.0,0.0),ctanh(a)); }
    vec2 carcsen(vec2 a) { return cmult(vec2(0.0,1.0), clog(csub(csqrt(csub(vec2(1.0,0.0), cmult(a, a))), cmult(a, vec2(0.0,1.0))))); }
    vec2 carccos(vec2 a) { return csum(vec2(PI/2.0,0.0), -carcsen(a)); }
    vec2 carctan(vec2 a) { return cmult(vec2(0.0,-0.5), clog(cdiv(csum(vec2(1.0,0.0), cmult(vec2(0.0,1.0), a)), csub(vec2(1.0,0.0), cmult(vec2(0.0,1.0), a))))); }
    vec2 carccsc(vec2 a) { return cdiv(vec2(1.0,0.0),carcsen(a)); }
    vec2 carcsec(vec2 a) { return cdiv(vec2(1.0,0.0),carccos(a)); }
    vec2 carccot(vec2 a) { return cdiv(vec2(1.0,0.0),carctan(a)); }
    vec2 carcsenh(vec2 a) { return clog(csum(a, csqrt(csum(cmult(a, a), vec2(1.0,0.0))))); }
    vec2 carccosh(vec2 a) { return clog(csum(a,sqrt(csub(cmult(a,a),vec2(1.0,0.0))))); }
    vec2 carctanh(vec2 a) { return cmult(vec2(0.5,0.0), clog(cdiv(csum(vec2(1.0,0.0), a), csub(vec2(1.0,0.0), a)))); }
    vec2 carccsch(vec2 a) { return clog(cdiv(csum(vec2(1.0,0.0),csqrt(csum(cmult(a,a),vec2(1.0,1.0)))),a)); }
    vec2 carcsech(vec2 a) { return clog(cdiv(csum(vec2(1.0,0.0),csqrt(csub(cmult(a,a),vec2(1.0,1.0)))),a)); }
    vec2 carccoth(vec2 a) { return cdiv(clog(cdiv(csum(vec2(1.0,0.0),a),csum(vec2(1.0,0.0),a))),vec2(2.0,0)); }

    vec2 canvasSize = vec2(${width},${height});
    vec3 hsl2rgb(vec3 hsl) {
        vec3 rgb = clamp( abs(mod(hsl.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return hsl.z + hsl.y * (rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
    }
    void main() {
        float a = ${inteiros}.0 * 2.0 * ((gl_FragCoord.x)/canvasSize.x - 0.5);
        float b = ${inteiros}.0 * 2.0 * ((gl_FragCoord.y)/canvasSize.y - 0.5);
        float x = a;
        float y = b;
        vec2 z = ${vazio ? "vec2(a,b)" : funcao};
        vec2 f = z; 
        float hue =  atan(f.y, f.x) / (2.0 * PI);
        float sat = 1.0;
        ${!continuo ? `
        float dist = abs(f.x) > 9e+10 || abs(f.y) > 9e+10 ? 9e10 : length(f); 
        float logaritmo = log2(dist); 
        float expoente_decimal = 1.0;
        if (length(f) != 0.0) 
        {
            expoente_decimal =  -(logaritmo - floor(logaritmo) - 1.0);
        }
        float light = 1.0/(pow(expoente_decimal,0.2) + 1.0) -0.1;

` : `   float light = pow(length(f),0.4) / (pow(length(f),0.4) + 1.0);
        if (abs(f.x) > 9e+10 || abs(f.y) > 9e+10)
        {
            sat = 1.0;
            light = 1.0;
        }        
`}

        vec3 rgb = hsl2rgb(vec3(hue,sat,light));
        gl_FragColor = vec4(rgb, 1);
    }
    `
}

function PlotterGl(funcao, tamanhoCanvas) {
    let start = performance.now();
    let canvas = document.getElementById("glCanvas");
    var gl = canvas.getContext("webgl");
    canvas.width = tamanhoCanvas;
    canvas.height = tamanhoCanvas;
    var vertexShaderSource = `
    attribute vec2 a_position;

    void main()
    {
        gl_Position = vec4(a_position, 0, 1);
    }
    `;
    var fragmentShaderSource = writeFragmentShader(funcao, canvas.width, canvas.height, lista_func, qtndInteiros);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    let end = performance.now();
    console.log("Tempo do WEBGL");
    console.log(end - start);
}
function carregar() {
    guppy = new Guppy('guppy1');
    canvas = document.getElementById("domainColorCanvas");
    tudo = document.getElementById('tudo');
    guppy.engine.set_content(funcaoBase);
    //Funções exclusivas às complexas
    guppy.engine.add_symbol("2atan", {
        "output": {
            "latex": "\\text{atan2}({$1},{$2})",
            "text": "atan2($1,$2)"
        },
        "attrs": {
            "type": "atan2",
            "group": "function"
        }
    });
    guppy.engine.add_symbol("conj", { "output": { "latex": "\\overline{{$1}}", "text": "conj($1)" }, "attrs": { "type": "conj", "group": "function" } });
    adicionarFuncao(guppy, "arg", "Arg", "Arg", "arg")
    adicionarFuncao(guppy, "re", "Re", "Re", "Re");
    adicionarFuncao(guppy, "im", "Im", "Im", "Im");
    //Trigonométricas em português
    adicionarFuncao(guppy, "sen", "sen", "sen", "sin");
    adicionarFuncao(guppy, "tg", "tg", "tg", "tan");
    //Reversas trigonométricas
    adicionarFuncao(guppy, "arcsen", "arcsen", "arcsen", "arcsin");
    adicionarFuncao(guppy, "arctg", "arctg", "arctg", "arctan");
    adicionarFuncao(guppy, "arcsec", "arcsec", "arcsec", "arcsec");
    //Reversas trigonométricas (abreviação)
    adicionarFuncao(guppy, "arsin", "arsin", "arcsen", "arcsin");
    adicionarFuncao(guppy, "arsen", "arsen", "arcsen", "arcsin");
    adicionarFuncao(guppy, "artg", "artg", "arctg", "arctan");
    adicionarFuncao(guppy, "artan", "artan", "arctg", "arctan");
    adicionarFuncao(guppy, "arsec", "arsec", "arcsec", "arcsec");
    //Inversas trigonométricas reversas
    adicionarFuncao(guppy, "arccsc", "arccsc", "arccsc", "arccsc");
    adicionarFuncao(guppy, "arccot", "arccot", "arccot", "arccot");
    //Inversas trigonométricas reversas (abreviação)
    adicionarFuncao(guppy, "arcsc", "arcsc", "arccsc", "arccsc");
    adicionarFuncao(guppy, "arcot", "arcot", "arccot", "arccot");
    adicionarFuncao(guppy, "arsec", "arsec", "arsec", "arcsec");
    //Hiperbólicas
    adicionarFuncao(guppy, "hsin", "sinh", "sinh", "sinh");
    adicionarFuncao(guppy, "hsen", "senh", "senh", "sinh");
    adicionarFuncao(guppy, "hcos", "cosh", "cosh", "cosh");
    adicionarFuncao(guppy, "htan", "tanh", "tanh", "tanh");
    adicionarFuncao(guppy, "htg", "tanh", "tanh", "tanh");
    //Inversas hiperbólicas
    adicionarFuncao(guppy, "hsec", "sech", "sech", "sech");
    adicionarFuncao(guppy, "hcsc", "csch", "csch", "csch");
    adicionarFuncao(guppy, "hcot", "coth", "coth", "coth");
    //Reversas hiperbólicas
    adicionarFuncao(guppy, "harcsin", "arcsinh", "arcsinh", "arcsinh");
    adicionarFuncao(guppy, "harcsen", "arcsenh", "arcsinh", "arcsinh");
    adicionarFuncao(guppy, "harccos", "arccosh", "arccosh", "arccosh");
    adicionarFuncao(guppy, "harctan", "arctanh", "arctanh", "arctanh");
    //Reversas hiperbólicas (abreviação)
    adicionarFuncao(guppy, "harsin", "arsinh", "arsinh", "arcsinh");
    adicionarFuncao(guppy, "harsen", "arsenh", "arcsinh", "arcsinh");
    adicionarFuncao(guppy, "harcos", "arcosh", "arccosh", "arccosh");
    adicionarFuncao(guppy, "hartan", "artanh", "arctanh", "arctanh");
    //Inversas hiperbólicas reversas
    adicionarFuncao(guppy, "harccsc", "arccsch", "arccsch", "arccsch");
    adicionarFuncao(guppy, "harccot", "arccoth", "arccoth", "arccoth");
    adicionarFuncao(guppy, "harcsec", "arcsech", "arcsech", "arcsech");
    //Inversas hiperbólicas reversas (abreviação)
    adicionarFuncao(guppy, "harcsc", "arcsch", "arccsch", "arccsch");
    adicionarFuncao(guppy, "harcot", "arcoth", "arccoth", "arccoth");
    adicionarFuncao(guppy, "harsec", "arsech", "arcsech", "arcsech");
    guppy.activate();
    canvas.addEventListener('mousemove', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;

        tudo.style.top = y - 15 + 'px';
        tudo.style.left = x + 90 + 'px';

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

        tudo.innerHTML = (`<i>f( ${Number(realAntes).toFixed(2)} + ${Number(imagAntes).toFixed(2) * (-1)}i ) = ${real} + ${imag}i</i>`);
    });


    const arrow = document.getElementById('arrow');
    const form = document.getElementById('form');
    const grafico = document.getElementById('grafico');

    arrow.addEventListener('click', function () {
        form.classList.toggle('active');
        arrow.classList.toggle('active');
        grafico.classList.toggle('active');
    });

    const checkbox = document.querySelector('.inputcheckbox > div');
    const gsize = document.getElementById('gsize');
    checkbox.addEventListener('click', function () {
        checkbox.classList.toggle('active');
        gsize.classList.toggle('disabled');
        gsize.querySelector('input').disabled = !gsize.querySelector('input').disabled;
        graficoTelainteira = !graficoTelainteira;
        grafico.style.cursor = graficoTelainteira ? 'grab' : 'default';
    });

    init()
}
document.addEventListener('keyup', function (event) {
    if (event.key == "Enter") {
        console.log(guppy.engine.get_content("ast"));
        console.log(guppy.func(operacoes));
        console.log(guppy.func(operacoes)({ 'z': { real: 1, imag: 1 } }));
        init();
    }
});
function init() {

    //alert(guppy)  
    let tamanhoCanvas;
    if (graficoTelainteira) {
        tamanhoCanvas = window.innerWidth;
        //Move o scroll conforme o usuario move o mouse (enquanto pressionado)
        window.addEventListener('mousedown', function (event) {
            function handleMouseMove(event) {
                window.scrollBy(-event.movementX / 2, -event.movementY / 2);
            }

            window.addEventListener('mousemove', handleMouseMove);

            window.addEventListener('mouseup', function () {
                window.removeEventListener('mousemove', handleMouseMove);
            });
        });


    }
    else {
        tamanhoCanvas = document.getElementById("tamanho_grafico").value;
    }
    canvas.width = tamanhoCanvas;
    canvas.height = tamanhoCanvas;
    //alert(canvas);
    //var tempoInicial = performance.now();

    tipo_grafico = document.querySelector('input[name="tp_g"]:checked').value;

    const eixos = document.getElementById('eixos')
    qtndInteiros = document.getElementById('numero_inteiros').value;
    Plotter(guppy);
    const result_gl = guppy.func(operacoes_gl_alt)();
    console.log(`Função a ser renderizada ${result_gl}`);
    PlotterGl(result_gl, tamanhoCanvas);
}

