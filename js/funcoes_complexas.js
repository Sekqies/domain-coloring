//Boolenas
function isZero(a)
{
    return a.real == 0 && a.imag == 0;
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
    let denominador = (Math.pow(b.real,2) + Math.pow(b.imag,2));
    return {
        real: (a.real*b.real + a.imag * b.imag)/ denominador,
        imag: (a.imag*b.real - b.real*b.imag) / denominador
    }
}

//Funções específicas aos números complexos

function arg(a)
{
    return Math.atan2(a.imag,a.real);
}
function conjugar(a)
{
    return {real: a.real, imag: -a.imag}
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

function log(a)
{
    return {
        real: 0.5*Math.log(a.real**2 + a.imag**2),
        imag: arg(a)
    }
}

function sen(a)
{
    return {
        real: Math.sin(a.real)*cosh_real(a.imag), imag: Math.cos(a.real)*senh_real(a.imag)
    }
}

function cos(a)
{
    return {
        real:Math.cos(a.real)*cosh_real(a.imag), imag: -Math.sin(a.real) * senh_real(a.imag)
    }
}

function tg(a)
{
    let denominador = Math.cos(2*a.real) + cosh_real(2*a.imag);
    return {
        real: Math.sin(2*a.real)/denominador, imag: senh_real(2*a.imag)/denominador
    }
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
        //Se não, isso significa que a é complexo e b é real, logo
        let x = Math.pow(a.real**2 + a.imag**2, b.real);
        return {real: x * Math.cos(arg(a) * b.real), imag: x * Math.sin(arg(a)* b.real) }
    }

    

    let logreal = log(a).real;
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
    }
    
};