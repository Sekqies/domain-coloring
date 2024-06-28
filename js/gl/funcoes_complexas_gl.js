
class c_GSGLFunctionList {
    constructor() {
        this.functions = [];
        this.declarations = '';
        this.operations = {};
    }

    addFunction(func) {
        this.functions.push(func);
        this.declarations += func.GL_declaration + '\n';
        this.operations[func.latex_name] = function (args) {
            return function (vars) {
                return func.runFunction(...args.map(arg => arg(vars)));
            }
        }
    }
    addOperation(name, funcDeclaration) {
        this.operations[name] = funcDeclaration;
    }
}
class c_GSGLFunction {
    constructor(name, latex_name, GL_declaration) {
        this.name = name;
        this.latex_name = latex_name;
        this.GL_declaration = GL_declaration;
    }
    runFunction(...params) {
        return `${this.name}(${params.join(',')})`;
    } x
}
let listaFuncoes = new c_GSGLFunctionList();
listaFuncoes.addOperation("var",
    function (args) {

        return function (vars) {
            if (args[0] == 'z') return "vec2(a,b)";
            if (args[0] == 'k') { animation_variable_exists = true; return "vec2(ANIMATION_VARIABLE,0.0)" };
            if (args[0] == 'i') return "vec2(0.0,1.0)";
            if (args[0] == 'e') return "vec2(E,0.0)";
            if (args[0] == 'pi') return "vec2(PI,0.0)";
            if (args[0] == 'x') return "vec2(a,0.0)";
            if (args[0] == 'y') return "vec2(b,0.0)";
            if (args[0] == 'a') return "vec2(a,0.0)";
            if (args[0] == 'b') return "vec2(b,0.0)";

        }
    })
listaFuncoes.addOperation("val", function (args) {
    return function (vars) {
        return `vec2(${parseFloat(args[0])},0.0)`;
    }
})


const GSGL_function_declarations = [
    new c_GSGLFunction("NOT_MEANT_FOR_IMPLEMENTATION","LIST_OF_CONSTANTS","vec2 one = vec2(1.0,0.0); vec2 meio = vec2(0.5,0.0); vec2 i = vec2(0.0,1.0); vec2 zero = vec2(0.0,0.0); vec2 pi = vec2(PI,0.0); vec2 e = vec2(E,0.0);"),
    new c_GSGLFunction("cconj", "conj", "vec2 cconj(vec2 z) {return vec2(z.x,-z.y);}"),
    new c_GSGLFunction("creal", "Re", "vec2 creal(vec2 z) {return vec2(z.x,0.0);}"),
    new c_GSGLFunction("cimag", "Im", "vec2 cimag(vec2 z) {return vec2(z.y,0.0);}"),
    new c_GSGLFunction("cneg", "neg", "vec2 cneg(vec2 z) {return vec2(-z.x,-z.y);}"),
    new c_GSGLFunction("csum", "+", "vec2 csum(vec2 a, vec2 b) {return vec2(a.x+b.x, a.y+b.y);}"),
    new c_GSGLFunction("cadd", "SUPPLEMENTAL_ADD ", "vec2 cadd(vec2 a, vec2 b) {return csum(a,b);}"),
    new c_GSGLFunction("csub", "-", "vec2 csub(vec2 a, vec2 b) {return vec2(a.x-b.x,a.y-b.y);}"),
    new c_GSGLFunction("cmult", "*", "vec2 cmult(vec2 a, vec2 b) {return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);}"),
    new c_GSGLFunction("cdiv", "fraction", "vec2 cdiv(vec2 a, vec2 b) {float denominador = pow(b.x,2.0) + pow(b.y,2.0); return vec2((a.x*b.x + a.y * b.y) / denominador, (a.y*b.x - a.x*b.y) / denominador);}"),
    new c_GSGLFunction("creciprocal", "SUPPLEMENTAL_FRACTION", "vec2 creciprocal(vec2 a){return cdiv(vec2(1.0,0.0),a);}"),
    new c_GSGLFunction("cpow", "exponential", "vec2 cpow(vec2 a, vec2 b) {float logmag = (0.5 * log(pow(a.x,2.0) + pow(a.y,2.0))); float argumento = atan(a.y,a.x); return vec2(exp(b.x * logmag - b.y * argumento) * cos(b.y * logmag + b.x * argumento), exp(b.x * logmag - b.y * argumento) * sin(b.y * logmag + b.x * argumento));}"),
    new c_GSGLFunction("cexp", "exp", "vec2 cexp(vec2 a) {return vec2(exp(a.x) * cos(a.y), exp(a.x) * sin(a.y));}"),
    new c_GSGLFunction("csqrt", "squareroot", "vec2 csqrt(vec2 a) {return cpow(a,vec2(0.5,0.0));}"),
    new c_GSGLFunction("clog", "log", "vec2 clog(vec2 a) {return vec2(0.5 * log(pow(a.x,2.0) + pow(a.y,2.0)), atan(a.y,a.x));}"),
    new c_GSGLFunction("csin", "sin", "vec2 csin(vec2 a) {return vec2(sin(a.x)*cosh(a.y), cos(a.x)*sinh(a.y));}"),
    new c_GSGLFunction("csen", "SUPPLEMENTAL_SIN", "vec2 csen(vec2 a) {return csin(a);}"),
    new c_GSGLFunction("ccos", "cos", "vec2 ccos(vec2 a) {return vec2(cos(a.x)*cosh(a.y), -sin(a.x) * sinh(a.y));}"),
    new c_GSGLFunction("ctan", "tan", "vec2 ctan(vec2 a) {return cdiv(csen(a),ccos(a));}"),
    new c_GSGLFunction("csec", "sec", "vec2 csec(vec2 a) {return cdiv(vec2(2.0,0.0),ccos(a));}"),
    new c_GSGLFunction("ccsc", "csc", "vec2 ccsc(vec2 a) {return cdiv(vec2(1.0,0.0),csen(a));}"),
    new c_GSGLFunction("ccot", "cot", "vec2 ccot(vec2 a) {return cdiv(vec2(1.0,0.0),ctan(a));}"),
    new c_GSGLFunction("csenh", "sinh", "vec2 csenh(vec2 a) {return vec2(sinh(a.x)*cos(a.y), cosh(a.x)*sin(a.y));}"),
    new c_GSGLFunction("ccosh", "cosh", "vec2 ccosh(vec2 a) {return vec2(cosh(a.x)*cos(a.y), sinh(a.x)*sin(a.y));}"),
    new c_GSGLFunction("ctanh", "tanh", "vec2 ctanh(vec2 a) {return cdiv(csenh(a),ccosh(a));}"),
    new c_GSGLFunction("ccsch", "csch", "vec2 ccsch(vec2 a) {return cdiv(vec2(1.0,0.0),csenh(a));}"),
    new c_GSGLFunction("csech", "sech", "vec2 csech(vec2 a) {return cdiv(vec2(1.0,0.0),ccosh(a));}"),
    new c_GSGLFunction("ccoth", "coth", "vec2 ccoth(vec2 a) {return cdiv(vec2(1.0,0.0),ctanh(a));}"),
    new c_GSGLFunction("carcsen", "arcsin", `vec2 carcsen(vec2 z){
        return cmult(i,clog(csqrt(one-cmult(z,z))-cmult(i,z)));
    }`),
    new c_GSGLFunction("carccos", "arccos", "vec2 carccos(vec2 z) {return vec2(PI/2.0,0.0) - carcsen(z);}"),
    new c_GSGLFunction("carctan", "arctan", `vec2 carctan(vec2 z) {
        return cmult(vec2(0.0,-0.5), clog(cdiv(one+cmult(i,z),one-cmult(i,z))));
    }`),
    new c_GSGLFunction("carccsc", "arccsc", "vec2 carccsc(vec2 a) {return carcsen(cdiv(vec2(1.0, 0.0), a));}"),
    new c_GSGLFunction("carcsec", "arcsec", "vec2 carcsec(vec2 a) {return carccos(cdiv(vec2(1.0, 0.0), a));}"),
    new c_GSGLFunction("carccot", "arccot", "vec2 carccot(vec2 a) {return carctan(cdiv(vec2(1.0, 0.0), a));}"),
    new c_GSGLFunction("carcsenh", "arcsinh", `vec2 carcsenh(vec2 z) {
        return clog(z+csqrt(cpow(z,vec2(2.0,0.0))+vec2(1.0,0.0)));}`),
    new c_GSGLFunction("carccosh", "arccosh", "vec2 carccosh(vec2 z) {if(z.x<1.0 && true){return clog(z+cmult(csqrt(z+one),csqrt(z-one)));} else return clog(z+csqrt(cpow(z,vec2(2.0,0.0))-one));}"),
    new c_GSGLFunction("carctanh", "arctanh", `vec2 carctanh(vec2 z)
    {
        return cmult(meio,clog(cdiv(cadd(z,one),csub(one,z))));
    }
        `
    ),
    new c_GSGLFunction("carccsch", "arccsch", "vec2 carccsch(vec2 a) {vec2 div = cdiv(vec2(1.0,0.0),a); return clog(csum(div,csqrt(csum(vec2(1.0,0.0),cmult(div,div)))));}"),
    new c_GSGLFunction("carcsech", "arcsech", "vec2 carcsech(vec2 z) {vec2 div = cdiv(vec2(1.0,0.0),z); return clog(csum(div,cmult(csqrt(csum(vec2(1.0,0.0),div)),csqrt(csum(vec2(-1.0,0.0),div)))));}"),
    new c_GSGLFunction("carccoth", "arccoth", "vec2 carccoth(vec2 a) {return cmult(vec2(0.5,0), clog(cdiv(csum(a,vec2(1.0,0.0)),csub(a,vec2(1.0,0.0)))));}"),
    new c_GSGLFunction("cgamma", "gamma", `vec2 cgamma_right(vec2 z) {
        vec2 w = csub(z, vec2(1.0, 0.0));
        vec2 t = cadd(w, vec2(7.5, 0.0));
        vec2 x = vec2(GAMMA_COEFF[0], 0.0);
        float sinal = 1.0;
        for (int i=1 ; i<8 ; i++)
        {
            x = cadd(x, sinal*cmult(vec2(GAMMA_COEFF[i], 0.0), creciprocal( cadd(w, vec2(i, 0.0)) ) ) );
            sinal = -sinal;
        }
        
        return cmult(vec2(sqrt(2.0 * PI), 0.0), cmult(x, cexp(csub(cmult(clog(t), cadd(w, vec2(0.5, 0.0))), t))));
    }
    vec2 cgamma_left(vec2 z) {
        return cdiv(vec2(PI, 0.0), cmult(csin(cmult(z, vec2(PI, 0.0))), cgamma_right(csub(vec2(1.0, 0.0), z))));
    }
    vec2 cgamma(vec2 z) {
        if (z.x < 0.5) {
            return cgamma_left(z);
        } else {
            return cgamma_right(z);
        }
    }`),
    new c_GSGLFunction("czeta","zeta",`vec2 czeta(vec2 s){
            vec2 resul = vec2(1.0,0.0);
            for (int i=2; i<=10; i++)
            {
                resul = cadd(resul, cpow(vec2(i,0.0),cneg(s)));
            }
            return resul;
        }`),
    new c_GSGLFunction("cfactorial", "factorial", "vec2 cfactorial(vec2 z) { return cgamma(cadd(vec2(1.0,0.0),z)); }")
];

for (let i = 0; i < GSGL_function_declarations.length; i++) {
    listaFuncoes.addFunction(GSGL_function_declarations[i]);
}




export { listaFuncoes }