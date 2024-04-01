function soma_gl(a,b)
{
    return {
        real: `(${a.real} + ${b.real})`,
        imag: `(${a.imag} + ${b.imag})`
    }
}

function subtrair_gl(a,b)
{
    return {
        real: `(${a.real} - ${b.real})`,
        imag: `(${a.imag} - ${b.imag})`
    }
}
function multiplicar_gl(a,b)
{
    return {
        real: `(${a.real} * ${b.real} - ${a.imag} * ${b.imag})`,
        imag: `(${a.real} * ${b.imag} + ${a.imag} * ${b.real})`
    }
}
function dividir_gl (a,b)
{
    const denominador = `pow(${b.real},2) + pow(${b.imag},2)`
    return {
        real: `((${a.real}*${b.real} + ${a.imag} * ${b.imag})/ ${denominador})`,
        imag: `((${a.imag}*${b.real} - ${a.real}*${b.imag}) / ${denominador})`
    }

}
function exponencial_gl(a,b)
{   
    const logmag = `0.5 * log(pow(${a.real},2.0) + pow(${a.imag},2.0))`;   
    const argumento = `atan(${a.imag},${a.real})`;
    const x = `exp(${b.real} * ${logmag} - ${b.imag} * ${argumento})`;
    const y = `${b.imag} * ${logmag} + ${b.real} * ${argumento}`;
    return {
        real: `${x} * cos(${y})`,
        imag: `${x} * sin(${y})`
    }
}
var operacoes_gl_NOVO = {
    "var":function(args)
    {
        return function(vars)
        {
            if (args[0] == 'z') return "vec2(a,b)";
            if (args[0] == 'k') {animation_variable_exists = true; return "vec2(ANIMATION_VARIABLE,0.0)"}; 
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
            return `vec2(${parseFloat(args[0])},0.0)`;
        }
    }
    ,   
    "neg":function(args)
    {
        return function(vars)
        {
            return `vec2(-${args[0](vars)}.x,-${args[0](vars)}.y)`;
        }
    },
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
            return cpower_gl.runFunction(args[0](vars),args[1](vars))
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
    },
    "factorial":function(args)
    {
        return function(vars)
        {
            return `cfactorial(${args[0](vars)})`
        }
    },
    "gamma":function(args)
    {
        return function(vars)
        {
            return `cgamma(${args[0](vars)})`
        }
    },
    "lambertw":function(args)
    {
        return function(vars)
        {
            return `lambertw(${args[0](vars)})`
        }
    }
    
}

var operacoes_gl = {
    "var":function(args)
    {
        return function(vars)
        {
            if (args[0] == 'z') return {real: "a", imag: "b"};
        }
    },
    "val":function(args)
    {
        return function(vars)
        {
            return {real: `${args[0].toString()}.0`, imag: "0.0"};
        }
    }
    ,
    "+":function(args) //
    {
        return function(vars)
        {
            return soma_gl(args[0](vars),args[1](vars))
        }
    }
    ,
    "-":function(args) //
    {
        return function(vars)
        {
            return subtrair_gl(args[0](vars),args[1](vars))
        }
    }
    ,
    "*":function(args) //
    {
        return function(vars)
        {
            return multiplicar_gl(args[0](vars),args[1](vars))
        }
    }
    ,
    "fraction":function(args) //
    {
        return function(vars)
        {
            return dividir_gl(args[0](vars),args[1](vars))
        }
    },
    "exponential":function(args)//
    {
        return function(vars)
        {
            return exponencial_gl(args[0](vars),args[1](vars))
        }
    },
}

