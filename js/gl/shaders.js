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


function writeFragmentShader(funcao, centrox,centroy, raio, declarations) {
    console.log("Proporções gráfico:", width,height)
    const continuo = variaveisGlobais.valorTipoGrafico === 'continuo';
    console.log(delimitador)
    const vazio = funcao === '';
    centrox = formatToGLSL(centrox);
    centroy = formatToGLSL(centroy);
    raio = formatToGLSL(raio);
    
    return `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    const float PI = 3.141592653589793238462643383279502884197169393751;
    const float E = 2.7182818284590452353602874713526624977572470936995;


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
    uniform vec4 u_delimiters;
    void main() {
        vec2 canvasSize = u_resolution;    
        float t = u_time;
        vec2 center = vec2(${centrox},${centroy});
        float radius = ${raio};
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

function updateDelimiters(gl,delimiters,shaderProgram)
{
    let uDelimitersLocation = gl.getUniformLocation(shaderProgram, "u_delimiters");
    gl.uniform4f(uDelimitersLocation,delimiters[0],delimiters[1],delimiters[2],delimiters[3]);
}


export { writeFragmentShader, updateDelimiters }