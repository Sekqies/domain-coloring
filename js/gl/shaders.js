function catchFunction(str, functionName)
{
    const indexes = [...str.matchAll(new RegExp(functionName, 'gi'))].map(a => a.index);
    const matches = [];
    for(const index of indexes)
    {
        let open = 0;
        let close = 0;
        let foundParentheses = false;
        let inside = '';
        let full = '';
        for(let i = index; i<str.length; i++)
        {
            full += str[i];
            if(foundParentheses)
            {
                inside += str[i];
            }
            if(str[i] === '(')
            {
                foundParentheses = true;
                open++;
            }
            if(str[i] === ')')
            {
                close++;
            }
            if(close===open && open)
            {
                matches.push([full, inside.slice(0, -1)]);
                break;
            }
        }
    }
    return matches;
}


function writeFragmentShader(funcao, width, height, delimitador, declarations) {

    const matches = catchFunction(funcao, 'derivative');

    if(matches !== null)
    for(const match of matches)
    {
        const regex = /vec2\s*\(\s*a\s*,\s*b\s*\)/gm;
        const innerFunction = match[1];
        //método 1:
        /*const derivativeFunction = `(
            cneg(${innerFunction.replace(regex , 'vec2(a+2.0*DERIVATIVE_W, b)')})
            + cmult(vec2(8.0,0.0), ${innerFunction.replace(regex, 'vec2(a+DERIVATIVE_W, b)')})
            + cmult(vec2(-8.0,0.0), ${innerFunction.replace(regex, 'vec2(a-DERIVATIVE_W, b)')})
            + ${innerFunction.replace(regex, 'vec2(a-2.0*DERIVATIVE_W, b)')}
          ) / (12.0 * DERIVATIVE_W)`;    */    
           
        //método 2: aproximação pela frente real
        //const derivativeFunction = `(${innerFunction.replace(regex,'vec2(a+DERIVATIVE_W,b)')} - ${innerFunction})/(DERIVATIVE_W)`;
        //método 3: adição pela frente complexa
        //const derivativeFunction = `cdiv(${innerFunction.replace(regex,'vec2(a,b+DERIVATIVE_W)')} - ${innerFunction}, vec2(0.0,DERIVATIVE_W))`; 
        //método 4: aproximação pelo centro real
        //const derivativeFunction = `cdiv(csub(${innerFunction.replace(regex,'vec2(a+DERIVATIVE_W,b)')} , ${innerFunction.replace(regex,'vec2(a-DERIVATIVE_W,b)')}), vec2(DERIVATIVE_W+DERIVATIVE_W,0.0))`;
        //método 5: aproximação pelo centro complexo
        //const derivativeFunction = `cdiv(csub(${innerFunction.replace(regex,'vec2(a,b+DERIVATIVE_W)')} , ${innerFunction.replace(regex,'vec2(a,b-DERIVATIVE_W)')}), vec2(0.0,DERIVATIVE_W+DERIVATIVE_W))`;
        //método 6: aproximação duppla pela frente
        const derivativeFunction = `cdiv(${innerFunction.replace(regex,'vec2(a,b)+COMPLEX_H')} - ${innerFunction},COMPLEX_H)`;
        // método 7: aproximação dupla pelo centro
        //const derivativeFunction = `cdiv(csub(${innerFunction.replace(regex,'vec2(a,b)+COMPLEX_H')} , ${innerFunction.replace(regex,'vec2(a,b)-COMPLEX_H')}), vec2(DOUBLE_DERIVATIVE_W,DOUBLE_DERIVATIVE_W))`;
        funcao = funcao.replace(match[0], derivativeFunction);
    }
    console.log("Após modificações: ", funcao)
    console.log("Proporções gráfico:", width,height)
    const continuo = variaveisGlobais.valorTipoGrafico === 'continuo';
    console.log(delimitador)
    const vazio = funcao === '';
    
    return `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    const float PI = 3.141592653589793238462643383279502884197169393751;
    const float E = 2.7182818284590452353602874713526624977572470936995;
    const float DERIVATIVE_W = 1e-5;
    const float DOUBLE_DERIVATIVE_W = DERIVATIVE_W + DERIVATIVE_W;
    const vec2 COMPLEX_H = vec2(DERIVATIVE_W,DERIVATIVE_W);



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
    const float EPSILON = 1e-7;
    float GAMMA_COEFF[9];
    vec2 drop_imag(vec2 z)
    {
        if (abs(z.y)<=EPSILON)
            z.y = 0.0;
        return z;
    }
    ${declarations}
void initalizeArrays()
{
    GAMMA_COEFF[0] = 0.99999999999980993;
    GAMMA_COEFF[1] = 676.5203681218851;
    GAMMA_COEFF[2] = 1259.1392167224028;
    GAMMA_COEFF[3] = 771.32342877765313;
    GAMMA_COEFF[4] = 176.61502916214059;
    GAMMA_COEFF[5] = 12.507343278686905;
    GAMMA_COEFF[6] = 0.13857109526572012;
    GAMMA_COEFF[7] = 9.9843695780195716e-6;
    GAMMA_COEFF[8] = 1.5056327351493116e-7;
}

    vec2 canvasSize = vec2(${width},${height});
    vec3 hsl2rgb(vec3 hsl) {
        vec3 rgb = clamp( abs(mod(hsl.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return hsl.z + hsl.y * (rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
    }
    const float MAX_SAFE_VALUE = 1.7e+38;
    uniform vec4 u_delimiters;
    void main() {
        initalizeArrays();
        float a = abs(u_delimiters.y - u_delimiters.x) * ((gl_FragCoord.x)/canvasSize.x - 0.5) + (u_delimiters.y + u_delimiters.x);
        float b = abs(u_delimiters.w - u_delimiters.z) * ((gl_FragCoord.y)/canvasSize.y - 0.5) + (u_delimiters.w + u_delimiters.z);
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
        if (abs(f.x) > 9e+10 || abs(f.y) > 9e+10 || abs(f.x) < 0.0 || abs(f.y) < 0.0)
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

function updateDelimiters(gl,delimiters,shaderProgram)
{
    let uDelimitersLocation = gl.getUniformLocation(shaderProgram, "u_delimiters");
    gl.uniform4f(uDelimitersLocation,delimiters[0],delimiters[1],delimiters[2],delimiters[3]);
}


export { writeFragmentShader, updateDelimiters }