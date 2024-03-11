function writeFragmentShader(funcao, width, height, inteiros) {
    console.log(width,height)
    let continuo = tipo_grafico == 1;
    let vazio = funcao === '';
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
    vec2 carccsc(vec2 a) { return carcsen(cdiv(vec2(1.0, 0.0), a)); }
    vec2 carcsec(vec2 a) { return carccos(cdiv(vec2(1.0, 0.0), a)); }
    vec2 carccot(vec2 a) { return carctan(cdiv(vec2(1.0, 0.0), a)); }
    vec2 carcsenh(vec2 a) { return clog(csum(a, csqrt(csum(cmult(a,a),vec2(1.0,0.0))))); }
    vec2 carccosh(vec2 a) { return clog(csum(a, csqrt(csub(cmult(a,a),vec2(1.0,0.0))))); }
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
        float dist = abs(f.x) > 9e+10 || abs(f.y) > 9e+10 ? 9e+10 : length(f); 
        float logaritmo = mod(log2(dist), 1.0); 
        float expoente_decimal = 1.0;
        if (length(f) != 0.0) 
        {
            expoente_decimal =  -(logaritmo - floor(logaritmo) - 1.0);
        }
        float light = 1.0/(pow(expoente_decimal,0.2) + 1.0) - 0.1;
        light = mod(light,1.0);

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

export { writeFragmentShader }