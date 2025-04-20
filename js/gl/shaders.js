function formatToGLSL(value){
    if (typeof value === 'number') {
        return value.toFixed(5);
    } else if (Array.isArray(value)) {
        return value.map(formatToGLSL).join(', ');
    } else if (typeof value === 'object') {
        return Object.values(value).map(formatToGLSL).join(', ');
    }
    return value;
}


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


function writeFragmentShader(funcao, declarations) {

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
    const continuo = variaveisGlobais.valorTipoGrafico === 'continuo';
    const vazio = funcao === '';    
    return `
    #version 100
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec3 u_center_radius;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
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

    vec3 hsl2rgb(vec3 hsl) {
        vec3 rgb = clamp( abs(mod(hsl.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return hsl.z + hsl.y * (rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
    }
    float fmod(float n, float m) 
    {
        return n - floor(n/m) * m;
    }
    int ifloor(float n)
    {
        return int(floor(n));
    }
    int mod(int n, int m)
    {
        return n - ifloor(float(n/m)) *m;
    }
    float bounce(float n, float m)
    {
        if(n == fmod(n,m)) return n;
        if(fmod(floor(n/m),2.0)==1.0)
        {
            return m - fmod(n,m);
        }
        else {
            return fmod(n,m);
        }
        
    }
    float calculateLight(vec2 f, bool isContinuous)
    {
        float dist = abs(f.x) > 9e+10 || abs(f.y) > 9e+10 ? 9e+10 : length(f); 
        if(isContinuous)
        {
            return pow(dist,0.4) / (pow(dist,0.4) + 1.0);
        }
        else {
            float logval = mod(log2(dist),1.0);
            float decimal_exp = 1.0;
            if(length(f) != 0.0)
            {
                decimal_exp = -(logval - floor(logval) - 1.0);
            }
    
            return mod(1.0/(pow(decimal_exp,0.2) + 1.0) - 0.15,1.0);
        }
    }
    const float MAX_SAFE_VALUE = 1.7e+38;
    void main() {
        vec2 canvasSize = u_resolution;    
        float t = u_time;
        float ANIMATION_VARIABLE = bounce(t, 10.0);
        vec2 center = u_center_radius.xy;
        float radius = u_center_radius.z;
        float x = center.x + radius * (2.0 * gl_FragCoord.x / canvasSize.x - 1.0);
        float y = center.y + radius * (2.0 * gl_FragCoord.y / canvasSize.y - 1.0);
        float a = x;
        float b = y;
        vec2 f = ${vazio?'vec2(x,y)': funcao};
        float hue = atan(f.y,f.x) / (2.0 * PI);
        float sat = 1.0;
        float light = calculateLight(f,${continuo});
        vec3 hsl = vec3(hue,sat,light);
        vec3 rgb = hsl2rgb(hsl);
        gl_FragColor = vec4(rgb,1.0);
    }
    `
}

function updateCenter(gl,center,radius,shaderProgram)
{
    let uCenterLocation = gl.getUniformLocation(shaderProgram, "u_center_radius");
    gl.uniform3f(uCenterLocation,center.x,center.y,radius);
}


export { writeFragmentShader, updateCenter }