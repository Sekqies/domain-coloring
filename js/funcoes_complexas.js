//Boolenas
function isZero(z)
{
    return z.real === 0 && z.imag === 0;
}


//Operações elementares

function soma(a,b)
{
    return {
        real: a.real + b.real,
        imag: a.imag + b.imag
    }
}
function subtrair(a,b)
{
    return {
        real: a.real - b.real,
        imag: a.imag - b.imag
    }
}
function multiplicar(a,b)
{
    return {
        real: a.real*b.real - a.imag * b.imag,
        imag: a.real*b.imag + a.imag * b.real 
    }
}
function dividir (a,b)
{
    let denominador = (b.real**2 + b.imag**2);
    return {
        real: (a.real*b.real + a.imag * b.imag)/ denominador,
        imag: (a.imag*b.real - a.real*b.imag) / denominador
    }
}

//Funções específicas aos números complexos

function arg(z)
{
    return Math.atan2(z.imag,z.real);
}
function conjugar(z)
{
    return {real: z.real, imag: -z.imag}
}

//Funções hiperbólicas reais

function cosh_real(a)
{
    return ((Math.exp(a) + Math.exp(-a))*0.5);
}
function senh_real(a)
{
    return ((Math.exp(a) - Math.exp(-a))*0.5);
}
//Logaritmo e trigonométricas

function log(z)
{
    return {
        real: 0.5*Math.log(z.real**2 + z.imag**2),
        imag: arg(z)
    }
}

function sen(z)
{
    return {
        real: Math.sin(z.real)*cosh_real(z.imag), imag: Math.cos(z.real)*senh_real(z.imag)
    }
}

function cos(z)
{
    return {
        real:Math.cos(z.real)*cosh_real(z.imag), imag: -Math.sin(z.real) * senh_real(z.imag)
    }
}

function tg(z)
{
    const denominador = Math.cos(2*z.real) + cosh_real(2*z.imag);
    return {
        real: Math.sin(2*z.real)/denominador, imag: senh_real(2*z.imag)/denominador
    }
}

//Hiperbólicas complexas

function senh(z)
{
    return {
        real: senh_real(z.real)*Math.cos(z.imag),
        imag: cosh_real(z.real)*Math.sin(z.imag)
    }
}

function cosh(z)
{
    return {
        real: cosh_real(z.real)*Math.cos(z.imag),
        imag: senh_real(z.real)*Math.sin(z.imag)
    }
}

function tanh(z)
{
    const denominador = cosh_real(2*z.real) + Math.cos(2*z.imag);
    return {
        real: senh_real(2*z.real) /denominador,
        imag: Math.sin(2*z.imag) / denominador
    }   
}

//Trigonométricas inversas multiplicativas (reciprocal)

function sec(z)
{
    const denominador = Math.cos(2*z.real) + cosh_real(2*z.imag);
    return {
        real: 2*Math.cos(z.real) * cosh_real(z.imag) / denominador,
        imag: 2*Math.sin(z.real) * senh_real(z.imag) / denominador,
    }
}

function csc(z)
{
    const denominador = Math.cos(2*z.real) - cosh_real(2*z.imag);
    return {
        real: -2*Math.sin(z.real)*cosh_real(z.imag)/denominador,
        imag: 2*Math.cos(z.real)*senh_real(z.imag)/denominador,
    }
}

function cot(z)
{
    const denominador = Math.cos(2*z.real) - cosh_real(2*z.imag);
    return {
        real:-Math.sin(2*z.real)/denominador,
        imag: senh_real(2*z.imag)/denominador,
    }
}

//Hiperbólicas inversas multiplicativas (reciprocal)

function csch(z)
{
    return dividir({real:1,imag:0},senh(z));
}

function sech(z)
{
    return dividir({real:1,imag:0},cosh(z));
}

function coth(z)
{
    return dividir({real:1,imag:0},tanh(z))
}

//Trigonométricas reversas 

function arcsen(z)
{
    //essa função não é de deus.
    const a = z.real;
    const b = z.imag;
    const atan2 = Math.atan2;
    const raizQuarta1 = Math.pow(4*a**2*b**2 + Math.pow(-(a**2)+b**2+1,2),1/4)
    const interiorTrig1 = 0.5*atan2(1 + b**2 - a**2,-2*a*b)
    const parteRealArgumento1 = -b + raizQuarta1 * Math.cos(interiorTrig1)
    const parteImagArgumento1 = a + raizQuarta1 * Math.sin(interiorTrig1)

    return {
        real: atan2(parteImagArgumento1,parteRealArgumento1),
        imag: -Math.log(Math.sqrt(Math.pow(parteRealArgumento1,2) + Math.pow(parteImagArgumento1,2)))
    }
}

function arccos(z)
{
    //DEFINIÇÕES NOS SALVAM! arccos(z) = pi/2 - arcsen(z) 
    const resultado_arcsen = arcsen(z);
    return {
        real: Math.PI * 0.5 - resultado_arcsen.real,
        imag: -resultado_arcsen.imag
    }
}

function arctan(z)
{
    const a = z.real;
    const b = z.imag;
    const atan2 = Math.atan2;
    
    //NOTA! arctan(x) não é igual a arcsen(x) / arccos(x)!
    return {
        real: 0.5 * (atan2(a,-b+1) - atan2(-a,b+1)),
        imag: 0.25 *(Math.log(a**2 + (b+1)**2) - Math.log(a**2 + (b-1)**2))
    }
}

//Trigonométricas inversas multiplicativas, reversas

function arccsc(z)
{
    //Essa vai ser pior ainda
    const a = z.real;
    const b = z.imag;
    const atan2 = Math.atan2;
    const denominador1 = a**2 + b**2;
    const realArg1 = (b**2 - a**2 ) / Math.pow(denominador1,2) + 1;
    const imagArg1 = 2*a*b / Math.pow(denominador1,2);
    const Arg1 = atan2(imagArg1,realArg1);
    const RaizQuarta = Math.pow((4*a**2 * b**2)/Math.pow(denominador1 , 4) + Math.pow(1-(a**2 - b**2)/Math.pow(denominador1, 2),2), 0.25);
    const interiorTrig1 = 0.5 * Arg1;
    const realArgReal = b/(denominador1) + RaizQuarta * Math.cos(interiorTrig1);
    const imagArgReal = a/denominador1 + RaizQuarta * Math.sin(interiorTrig1);
    
    return {
        real: atan2(imagArgReal,realArgReal),
        imag: -Math.log(Math.sqrt(imagArgReal**2 + realArgReal**2))
    }
}

function arcsec(z)
{
    // arcsec(x) + arccsc(x) = pi/2 => arcsec(x) = pi/2 - arccsc(x)
    const resultado_arccsc = arccsc(z);
    return {
        real: Math.PI * 0.5 - resultado_arccsc.real,
        imag: - resultado_arccsc.imag
    }
}

function arccot(z)
{
    const a = z.real;
    const b = z.imag;
    const denominador = a**2 + b**2;
    const interiorLog1 = a**2 / (denominador**2);
    const divisaoA = a/denominador;
    const divisaoB = b/denominador;
    return {
        real: 0.5 * (Math.atan2(divisaoA, 1 + divisaoB) - Math.atan2(-divisaoA, 1 - divisaoB)),
        imag: 0.25 * (Math.log(interiorLog1 + Math.pow(1-divisaoB,2)) - Math.log(interiorLog1 + Math.pow(1+divisaoB,2)))
    }
}

//Hiperbólicas complexas inversas

function arcsenh(z)
{
    const a = z.real;
    const b = z.imag;
    const raizQuarta = Math.pow(a**4 + 2 * a**2 * (b**2 + 1) + Math.pow(b**2 -1,2),0.25);
    const interiorTrig = 0.5 * Math.atan2(2*a*b,a**2 - b**2 +1);
    const arg_real = (a+raizQuarta*Math.cos(interiorTrig));
    const arg_imag = (b+raizQuarta*Math.sin(interiorTrig));
    return {
        real: 0.5 * Math.log( arg_real**2 + arg_imag**2),
        imag: Math.atan2(arg_imag,arg_real)
    }
}

function arccosh(z)
{
    const a = z.real;
    const b = z.imag;
    const interiorRaizPos = a**2 - 2*a + b**2 + 1;
    const interiorRaizNeg = a**2 + 2*a + b**2 + 1;
    const raizQuartaPos = Math.pow(interiorRaizPos,0.25);
    const raizPos = Math.pow(interiorRaizPos,0.5);
    const raizQuartaNeg = Math.pow(interiorRaizNeg,0.25);
    const raizNeg = Math.pow(interiorRaizNeg,0.5);
    const interiorTrig = 0.5 * (Math.atan2(b,a-1) + Math.atan2(b,a+1));
    const argReal = a + raizQuartaNeg*raizQuartaPos*Math.cos(interiorTrig);
    const argImag = b + raizQuartaNeg*raizQuartaPos*Math.sin(interiorTrig);
    return{
        real: a + argReal + b + argImag + raizPos * raizNeg + a**2 + b**2,
        imag: Math.atan2(argImag,argReal)
    }
}

function arctanh(z)
{
    
}

//Exponencial
function exponencial(a,b)
{
    //Utilizando no formato a^b
    //Assumindo a^0 = 1, para todo a (incluindo a=0)
    if (isZero(b))
        return {real:1, imag:0}
    
    //Assumindo 0^b = 0, para todo b >0. É necessário que seja >0 para evitar divisões por 0.
    if (isZero(a) && b.real> 0 && b.imag>=0)
        return {real:0,imag:0};
    

    //Assumindo um b completamente real, formato a^n 
    if (b.imag ===0)
    {
        //Se a e b forem reais, simplesmente retorna a^b como parte real, e nada como imaginário.
        //NOTA: a tem que ser positivo, já que, por exemplo (-1)^1/2 iria ser uma operação que retorna um número imaginário
        if (a.imag===0 && a.real>=0)
        {
            return Math.pow(a.real,b.real);
        }
        //Se a for somente imaginário, no formato n*i...
        if(a.real===0)
        {
            /* Lembrando,
            i^1= i
            i^2= -1
            i^3= -i
            i^4= 1. O padrão se repete para i^n, como i^4 = 1, i^5 é igual a i^1 e assim em diante.
            */
            switch(b.real%4)
            {
                case 0: //i^4 = 1
                    return {real:Math.pow(a.imag,b.real), imag:0}
                case 1: //i^1 = i
                    return {real:0, imag: Math.pow(a.imag,b.real)}
                case 2: //i^2 = -1
                    return {real:-Math.pow(a.imag,b.real), imag:0}
                case 3: //i^3 = -i
                    return {real:0, imag: -Math.pow(a.imag,b.real)}
            }
        }
    }

    

    let logreal = 0.5 * Math.log(a.real**2 + a.imag**2)
    let arga = arg(a)
    let x = Math.exp(b.real * logreal - b.imag * arga ); //A operação pode ser reescrita como logreal ^ b.real / e^b.imag*arga, mas é mais eficiente nessa forma de exponencial
    let y = b.imag * logreal + b.real * arga;
    return {real: x * Math.cos(y), imag: x * Math.sin(y)};
}

var operacoes = {
    "+":function(args)
    {
        return function(vars)
        {
            return soma(args[0](vars),args[1](vars))
        }
    },

    "-":function(args)
    {
        return function(vars)
        {
            return subtrair(args[0](vars),args[1](vars))
        }
    },

    "fraction":function(args)
    {
        return function(vars)
        {
            return dividir(args[0](vars),args[1](vars))
        }
    },

    "val":function(args)
    {
        return function(vars)
        {
            return {real:parseFloat(args[0]), imag:0}
        }
    },

    /*EX: x^2 + 2:
    ["+",
        [
            ["exponential",
                [
                    ["var",["z"]],
                    ["val",[2]]
                ]
            ],
            ["val",[2]]
        ]
    ]*/

    "var": function(args) {
        return function(vars) {
            if (args[0] == "i") return { real: 0, imag: 1 };
            if (args[0] == "e") return { real: Math.E, imag: 0 };
            if (args[0] == "pi") return { real: Math.PI, imag: 0 };
            if (args[0] == "z") return vars.z;
            //return vars.args[0];
        }
    },
    "*": function(args) {
        return function(vars) {
            return multiplicar(args[0](vars), args[1](vars));
        }
    },
    "exponential": function(args) {
        return function(vars) {
            return exponencial(args[0](vars), args[1](vars));
        }
    },
    "sin": function(args) {
        return function(vars) {
            return sen(args[0](vars));
        }
    },
    "cos": function(args) {
        return function(vars) {
            return cos(args[0](vars));
        }
    },
    "ln":function(args)
    {
        return function(vars)
        {
            return log(args[0](vars))
        }
    },
    "log": function(args) {
        return function(vars) {
            return log(args[0](vars));
        }
    },
    "tan": function(args) {
        return function(vars) {
            return tg(args[0](vars));
        };
    },
    "squareroot": function(args) {
        return function(vars) {
            var b = { real: 1/2, imag: 0 };
            return exponencial(args[0](vars), b);
        };
    },
    "root": function(args) {
        return function(vars) {
            var b = { real: 1/args[1](vars).real, imag: 0 };
            return exponencial(args[0](vars), b);
        };
    },
    "Re": function(args)
    {
        return function(vars)
        {
            return {real: args[0](vars).real, imag: 0}
        }
    },
    "Im": function(args)
    {
        return function(vars)
        {
            return {real: 0, imag: args[0](vars).real}
        }
    },
    "conj":function(args){
        return function(vars){
          return conjugar(args[0](vars));
        }
      },
    "neg":function(args)
    {
        return function(vars)
        {
            return {real: -args[0](vars).real, imag: -args[0](vars).imag}
        }
    },
    "cot":function(args)
    {
        return function(vars)
        {
            return cot(args[0](vars))
        }
    },
    "csc":function(args)
    {
        return function(vars)
        {
            return csc(args[0](vars))
        }
    },
    "sec":function(args)
    {
        return function(vars)
        {
            return sec(args[0](vars))
        }
    },
    "sinh":function(args)
    {
        return function(vars)
        {
            return senh(args[0](vars))
        }
    },
    "cosh":function(args)
    {
        return function(vars)
        {
            return cosh(args[0](vars))
        }
    },
    "tanh":function(args)
    {
        return function(vars)
        {
            return tanh(args[0](vars))
        }
    },
    "arcsin":function(args)
    {
        return function(vars)
        {
            return arcsen(args[0](vars))
        }
    },
    "arccos":function(args)
    {
        return function(vars)
        {
            return arccos(args[0](vars))
        }
    },
    "arctan":function(args)
    {
        return function(vars)
        {
            return arctan(args[0](vars))
        }
    },
    "arccsc":function(args)
    {
        return function(vars)
        {
            return arccsc(args[0](vars))
        }
    },
    "arcsec":function(args)
    {
        return function(vars)
        {
            return arcsec(args[0](vars))
        }
    },
    "arccot":function(args)
    {
        return function(vars)
        {
            return arccot(args[0](vars))
        }
    },
    "arcsinh":function(args)
    {
        return function(vars)
        {
            return arcsenh(args[0](vars))
        }
    },
    "sech":function(args)
    {
        return function(vars)
        {
            return sech(args[0](vars))
        }
    },
    "csch":function(args)
    {
        return function(vars)
        {
            return csch(args[0](vars))
        }
    },
    "coth":function(args)
    {
        return function(vars)
        {
            return coth(args[0](vars))
        }
    }
};