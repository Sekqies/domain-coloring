class c_GSGLFunction
{
    constructor(name)
    {
        this.name = name;
    }
    runFunction(...params){ 
        return `${this.name}(${params.join(',')})`;
    }
}

const csum_gl = new c_GSGLFunction("csum");
const csub_gl = new c_GSGLFunction("csub");
const cmult_gl = new c_GSGLFunction("cmult");
const cdiv_gl = new c_GSGLFunction("cdiv");
const cexponencial_gl = new c_GSGLFunction("cexpo");
const csqrt_gl = new c_GSGLFunction("csqrt");
const clog_gl = new c_GSGLFunction("clog");

const csen_gl = new c_GSGLFunction("csen");
const ccos_gl = new c_GSGLFunction("ccos");
const ctan_gl = new c_GSGLFunction("ctan");

const csec_gl = new c_GSGLFunction("csec");
const ccsc_gl = new c_GSGLFunction("ccsc");
const ccot_gl = new c_GSGLFunction("ccot");

const csenh_gl = new c_GSGLFunction("csenh");
const ccosh_gl = new c_GSGLFunction("ccosh");
const ctanh_gl = new c_GSGLFunction("ctanh");

const ccsch_gl = new c_GSGLFunction("ccsch");
const csech_gl = new c_GSGLFunction("csech");
const ccoth_gl = new c_GSGLFunction("ccoth");

const carcsen_gl = new c_GSGLFunction("carcsen");
const carccos_gl = new c_GSGLFunction("carccos");
const carctan_gl = new c_GSGLFunction("carctan");

const carccsc_gl = new c_GSGLFunction("carccsc");
const carcsec_gl = new c_GSGLFunction("carcsec");
const carccot_gl = new c_GSGLFunction("carccot");

const carcsenh_gl = new c_GSGLFunction("carcsenh");
const carccosh_gl = new c_GSGLFunction("carccosh");
const carctanh_gl = new c_GSGLFunction("carctanh");

const carccsch_gl = new c_GSGLFunction("carccsch");
const carcsech_gl = new c_GSGLFunction("carcsech");
const carccoth_gl = new c_GSGLFunction("carccoth");


var operacoes_gl = {
    "var":function(args)
    {
        return function(vars)
        {
            if (args[0] == 'z') return "vec2(a,b)";
            if (args[0] == 'k') return "vec2(" + k + ",0.0)"; 
            if (args[0] == 'i') return "vec2(0.0,1.0)";
            if (args[0] == 'e') return "vec2(2.718281828459045,0.0)";
            if (args[0] == 'pi') return "vec2(3.141592653589793,0.0)";
            if (args[0] == 'x') return "vec2(a,0.0)";
            if (args[0] == 'y') return "vec2(b,0.0)";
            if (args[0] == 'a') return "vec2(a,0.0)";
            if (args[0] == 'b') return "vec2(b,0.0)";

        }
    
    },
    "val":function(args)
    {
        return function(vars)
        {
            return `vec2(${args[0].toString()}.0,0.0)`;
        }
    }
    ,   
    "+":function(args) //
    {
        return function(vars)
        {
            return csum_gl.runFunction(args[0](vars),args[1](vars))
        }
    }
    ,
    "-":function(args) //
    {
        return function(vars)
        {
            return csub_gl.runFunction(args[0](vars),args[1](vars))
        }
    }
    ,
    "*":function(args) //
    {
        return function(vars)
        {
            return cmult_gl.runFunction(args[0](vars),args[1](vars))
        }
    }
    ,
    "fraction":function(args) //
    {
        return function(vars)
        {
            return cdiv_gl.runFunction(args[0](vars),args[1](vars))
        }
    },
    "exponential":function(args)//
    {
        return function(vars)
        {
            return cexponencial_gl.runFunction(args[0](vars),args[1](vars))
        }
    },
    "sqrt":function(args)//
    {
        return function(vars)
        {
            return csqrt_gl.runFunction(args[0](vars))
        }
    },
    "log":function(args)//
    {
        return function(vars)
        {
            return clog_gl.runFunction(args[0](vars))
        }
    },
    "sin":function(args)//
    {
        return function(vars)
        {
            return csen_gl.runFunction(args[0](vars))
        }
    },
    "cos":function(args)//
    {
        return function(vars)
        {
            return ccos_gl.runFunction(args[0](vars))
        }
    },
    "tan":function(args)//
    {
        return function(vars)
        {
            return ctan_gl.runFunction(args[0](vars))
        }
    },
    "cot":function(args)//
    {
        return function(vars)
        {
            return ccot_gl.runFunction(args[0](vars))
        }
    },
    "csc":function(args)//
    {
        return function(vars)
        {
            return ccsc_gl.runFunction(args[0](vars))
        }
    },
    "csch":function(args)//
    {
        return function(vars)
        {
            return ccsch_gl.runFunction(args[0](vars))
        }
    },
    "sech":function(args)//
    {
        return function(vars)
        {
            return csech_gl.runFunction(args[0](vars))
        }
    },
    "coth":function(args)//
    {
        return function(vars)
        {
            return ccoth_gl.runFunction(args[0](vars))
        }
    },
    "sec":function(args)//
    {
        return function(vars)
        {
            return csec_gl.runFunction(args[0](vars))
        }
    },
    "sinh":function(args)//
    {
        return function(vars)
        {
            return csenh_gl.runFunction(args[0](vars))
        }
    },
    "cosh":function(args)//
    {
        return function(vars)
        {
            return ccosh_gl.runFunction(args[0](vars))
        }
    },
    "tanh":function(args)//
    {
        return function(vars)
        {
            return ctanh_gl.runFunction(args[0](vars))
        }
    },
    "arcsin":function(args)//
    {
        return function(vars)
        {
            return carcsen_gl.runFunction(args[0](vars))
        }
    },
    "arccos":function(args)//
    {
        return function(vars)
        {
            return carccos_gl.runFunction(args[0](vars))
        }
    },
    "arctan":function(args)//
    {
        return function(vars)
        {
            return carctan_gl.runFunction(args[0](vars))
        }
    },
    "arccot":function(args)//
    {
        return function(vars)
        {
            return carccot_gl.runFunction(args[0](vars))
        }
    },
    "arccsc":function(args)//
    {
        return function(vars)
        {
            return carccsc_gl.runFunction(args[0](vars))
        }
    },
    "arcsec":function(args)//
    {
        return function(vars)
        {
            return carcsec_gl.runFunction(args[0](vars))
        }
    },
    "arcsinh":function(args)//
    {
        return function(vars)
        {
            return carcsenh_gl.runFunction(args[0](vars))
        }
    },
    "arccosh":function(args)//
    {
        return function(vars)
        {
            return carccosh_gl.runFunction(args[0](vars))
        }
    },
    "arctanh":function(args)//
    {
        return function(vars)
        {
            return carctanh_gl.runFunction(args[0](vars))
        }
    },
    "arccoth":function(args)//
    {
        return function(vars)
        {
            return carccoth_gl.runFunction(args[0](vars))
        }
    },
    "arccsch":function(args)//
    {
        return function(vars)
        {
            return carccsch_gl.runFunction(args[0](vars))
        }
    },
    "arcsech":function(args)//
    {
        return function(vars)
        {
            return carcsech_gl.runFunction(args[0](vars))
        }
    },
    "Re":function(args)
    {
        return function(vars)
        {
            return `vec2(${args[0](vars)}.x,0.0)`
        }
    },
    "Im":function(args)
    {
        return function(vars)
        {
            return `vec2(0.0,${args[0](vars)}.x)`
        }
    },
    "conj":function(args)
    {
        return function(vars)
        {
            return `vec2(${args[0](vars)}.x,-${args[0](vars)}.y)`
        }
    },
    "arg":function(args)
    {
        return function(vars)
        {
            return `vec2(atan(${args[0](vars)}.y,${args[0](vars)}.x),0)`
        }
    },
    "absolutevalue":function(args)
    {
        return function(vars)
        {
            return `vec2(length(${args[0](vars)}),0)`
        }
    }
    
}

export {operacoes_gl}