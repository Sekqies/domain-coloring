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
