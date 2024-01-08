function adicionar_real_imag(obj,real,imag) {
    obj.real += real;
    obj.imag += imag;
    return obj;
}

   var caretReplace = function(_s) {
    if (_s.indexOf("^") > -1) {
        var tab = [];
        var powfunc="Math.pow";
        var joker = "___joker___";
        while (_s.indexOf("(") > -1) {
            _s = _s.replace(/(\([^\(\)]*\))/g, function(m, t) {
                tab.push(t);
                return (joker + (tab.length - 1));
            });
        }

        tab.push(_s);
        _s = joker + (tab.length - 1);
        while (_s.indexOf(joker) > -1) {
            _s = _s.replace(new RegExp(joker + "(\\d+)", "g"), function(m, d) {
                return tab[d].replace(/(\w*)\^(\w*)/g, powfunc+"($1,$2)");
            });
        }
    }
    return _s;
};

function iniciarGambiarra(funcao) {
    let cont = 0;
    let originais = new Map();
    let funcaoFinal = funcao;
    funcaoFinal = funcaoFinal.replace(/\((.*?)\)\^\((.*?)\)/g, function (match) { 
        cont++;
        const substChar = String.fromCharCode(64 + cont);
        originais.set(substChar, match);
        return String.fromCharCode(64 + cont);
    })
    return [funcaoFinal, originais];    
}

function reverterGambiarra(funcao, original) {
    let funcaoFinal = funcao;

    funcaoFinal = funcaoFinal.replace(/[A-Z]/g, function(match) {
        return original.get(match);
    });

    return funcaoFinal;
}


function simplificarExponencial(inputFunction) {
    //Transforma uma função em formato de a^b em Math.pow(a,b)
    var outputFunction = inputFunction.replace(/(\w+)\s*\^\s*(\w+(\.\w+)?)/g, function(match, base, exponent) {
        return 'Math.pow(' + base + ', ' + exponent + ')';
    });

    return outputFunction;
  }

function simplificarExpoenteImaginario(funcaoOriginal) {
// Um expoente no formato de i^1 = i^5 = i^9. Ou seja, i^x, onde x é um número inteiro, é sempre igual a i^x%4
// Além disso, o Algebrite não sabe fazer operações com i elevado a potências maiores que 5.

const regex = /(\bj\b)\^(\w+)/g;
const funcaoSimplificada = funcaoOriginal.replace(regex, function(match, base, expoente) {
    return base + "^(" + eval(expoente + " % 4") + ")";
});
return funcaoSimplificada;
}


function limparFuncao(funcaoOriginal) {


    var funcaoLimpa = caretReplace(funcaoOriginal);
    funcaoLimpa = funcaoLimpa.replace(/\basin\(/g, 'Math.asin(');
    funcaoLimpa = funcaoLimpa.replace(/\bacos\(/g, 'Math.acos(');
    funcaoLimpa = funcaoLimpa.replace(/\bcosh\(/g, 'Math.cosh(');
    funcaoLimpa = funcaoLimpa.replace(/\bsinh\(/g, 'Math.sinh(');

    funcaoLimpa = funcaoLimpa.replace(/\bsin\(/g, 'Math.sin(');
    funcaoLimpa = funcaoLimpa.replace(/\bcos\(/g, 'Math.cos(');
    
    funcaoLimpa = funcaoLimpa.replace(/\btan\(/g, 'Math.tan(');
    
    funcaoLimpa = funcaoLimpa.replace(/\batan\(/g, 'Math.atan(');
    funcaoLimpa = funcaoLimpa.replace(/\batan2\((.*?),(.*?)\)/g, 'Math.atan2($1, $2)');
    
    funcaoLimpa = funcaoLimpa.replace(/\blog\(/g, 'Math.log(');
    funcaoLimpa = funcaoLimpa.replace(/\bsqrt\(/g, 'Math.sqrt(');
    
    funcaoLimpa = funcaoLimpa.replace(/\babs\(/g, 'Math.abs(');
    funcaoLimpa = funcaoLimpa.replace(/\bexp\(/g, 'Math.exp(');
    
    return funcaoLimpa;
}



function espalhar_exp(funcao) {
    var outputString = funcao.replace(/(\w+)\^\((.*?)\)/g, function(match, base, exponents) {
        var exponentArray = exponents.split('+');
        var output = '';
        for (var i = 0; i < exponentArray.length; i++) {
            if (exponentArray[i].includes('*')) {
                output += base + '^(' + exponentArray[i] + ') * ';
            } else {
                output += base + '^' + exponentArray[i] + ' * ';
            }
        }
        return output.slice(0, -3); 
    });
    return outputString;
}

function transformar_exp(funcao) {
    var outputString = funcao.replace(/(\w+)\^\((.*?)\*i\)/g, function(match, base, exponent) {
        return `e^(ln(${base})*${exponent}*i)`;
    });
    return outputString;
}

function transformar_div(funcao) {
    var outputString = funcao.replace(/(\w+)\/\((.*?)\)\^(\w+)/g, function(match, k, denominator, exponent) {
        return k + '*(' + denominator + ')^(-' + exponent + ')';
    });
    
    outputString = outputString.replace(/(\w+)\/\((.*?)\)/g, function(match, k, denominator) {
        return k + '*(' + denominator + ')^(-1)';
    });
    
    return outputString;
}


function ar_comp_exp(expoente, operacao) {
    return adicionar_real_imag(operacao,"cos(" + expoente + ")", "sin(" + expoente + ")");

}

function ar_comp_log (funcao, operacao)
{
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return adicionar_real_imag(operacao,"log( sqrt(" + real + "^2 + " + imag + "^2 ))", "atan2(" + imag + "," + real + ")");
}

function ar_comp_cos(funcao, operacao)
{
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return adicionar_real_imag(operacao,"cos(" + real + ")*cosh(" + imag + ")", "-sin(" + real + ")*sinh(" + imag + ")");
}

function ar_comp_sen(funcao, operacao)
{
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return adicionar_real_imag(operacao,"sin(" + real + ")*cosh(" + imag + ")", "cos(" + real + ")*sinh(" + imag + ")");
}

function ar_comp_pol(expoente, operacao)
{
    return adicionar_real_imag(operacao,"(a^2 + b^2)^(" + expoente/2 + ")*cos(" + expoente + "*atan2(b,a))", "(a^2 + b^2)^(" + expoente/2 + ")*sin(" + expoente + "*atan2(b,a))");
}

function comp_exp(expoente) {
    return "(cos(" + expoente + ") + i*sin(" + expoente + ") )";

    //return "Math.cos(" + expoente + ") + i*Math.sin(" + expoente + ")";
}

function comp_log (funcao)
{
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return "(log( sqrt(" + real + "^2 + " + imag + "^2 )) + i*atan2(" + imag + "," + real + "))";

    //return "(Math.log(Math.sqrt(" + real + "^2 + " + imag + "^2 )) + i*Math.atan2(" + imag + "," + real + "))";
}

function comp_sen(funcao)
{
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return "(sin(" + real + ")*cosh(" + imag + ") + i*cos(" + real + ")*sinh(" + imag + "))";

    //return "(Math.sin(" + real + ")*Math.cosh(" + imag + ") + i*Math.cos(" + real + ")*Math.sinh(" + imag + "))";
}

function comp_cos(funcao)
{
    console.log(funcao);
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return "(cos(" + real + ")*cosh(" + imag + ") - i*sin(" + real + ")*sinh(" + imag + "))";

    //return "(Math.cos(" + real + ")*Math.cosh(" + imag + ") - i*Math.sin(" + real + ")*Math.sinh(" + imag + "))";
}
function comp_pol(expoente)
{
    return "(a^2 + b^2)^(" + expoente/2 + ")*(cos(" + expoente + "*atan2(b,a)) + i*sin(" + expoente + "*atan2(b,a)))";
    //return "(Math.pow(Math.pow(a,2) + Math.pow(b,2)," + expoente/2 + ")*(Math.cos(" + expoente + "*Math.atan2(b,a)) + i*Math.sin(" + expoente + "*Math.atan2(b,a))))";
}



function ar_simplificarAntesAlgebrite(funcao, obj) {
    let funcaoFinal = funcao;
    let objFinal = obj;

    funcaoFinal = funcaoFinal.replace(/z/g, '(a+b*i)');
    funcaoFinal = espalhar_exp(funcaoFinal);
    funcaoFinal = transformar_exp(funcaoFinal);
    funcaoFinal = transformar_div(funcaoFinal);
    
    funcaoFinal = funcaoFinal.replace(/ln\((z|\(.*?\+.*?i\)|a\+b\*i)\)/g, (match, p1) => {
        console.log("ai")
        objFinal = ar_comp_log(`${p1}`, objFinal);
        return comp_log(`${p1}`);
    });
    funcaoFinal = funcaoFinal.replace(/sen\((z|\(.*?\+.*?i\)|a\+b\*i)\)/g, (match, p1) => {
        objFinal= ar_comp_sen(`${p1}`, objFinal);
        return comp_sen(`${p1}`);
    });
    funcaoFinal = funcaoFinal.replace(/cos\((z|\(.*?\+.*?i\)|a\+b\*i)\)/g, (match, p1) => {
        objFinal= ar_comp_cos(`${p1}`, objFinal);
       return comp_cos(`${p1}`)
    });
    funcaoFinal = funcaoFinal.replace(/e\^\((.*?)\*i\)/g, (match, p1) => {
        objFinal = ar_comp_exp(`${p1}`, objFinal);
        return comp_cos(`${p1}`)
    });
    funcaoFinal = funcaoFinal.replace(/\((a\+b\*i)\)\^\((-?\w+)\)/g, (match, base, exponent) => {
        objFinal = ar_comp_pol(`${exponent}`, objFinal);
        return comp_pol(`${exponent}`);
    });
    funcaoFinal = funcaoFinal.replace(/\((a\+b\*i)\)\^(\w+)/g, (match, base, exponent) => {
        objFinal = ar_comp_pol(`${exponent}`, objFinal);
       return comp_pol(`${exponent}`); 
    });
    console.log(funcaoFinal);
    return objFinal;
}

function simplificarAntesAlgebrite(funcao) {
    let funcaoFinal = funcao;
    funcaoFinal = funcaoFinal.replace(/z/g, '(a+b*i)');
    funcaoFinal = espalhar_exp(funcaoFinal);
    funcaoFinal = transformar_exp(funcaoFinal);
    funcaoFinal = transformar_div(funcaoFinal);
    
    funcaoFinal = funcaoFinal.replace(/ln\((z|\(.*?\+.*?i\)|a\+b\*i)\)/g, (match, p1) => comp_log(`${p1}`));
    funcaoFinal = funcaoFinal.replace(/sen\((z|\(.*?\+.*?i\)|a\+b\*i)\)/g, (match, p1) => comp_sen(`${p1}`));
    funcaoFinal = funcaoFinal.replace(/cos\((z|\(.*?\+.*?i\)|a\+b\*i)\)/g, (match, p1) => comp_cos(`${p1}`));
    funcaoFinal = funcaoFinal.replace(/e\^\((.*?)\*i\)/g, (match, p1) => comp_exp(`${p1}`));
    funcaoFinal = funcaoFinal.replace(/\((a\+b\*i)\)\^\((-?\w+)\)/g, (match, base, exponent) => comp_pol(`${exponent}`));
    funcaoFinal = funcaoFinal.replace(/\((a\+b\*i)\)\^(\w+)/g, (match, base, exponent) => comp_pol(`${exponent}`));

    return funcaoFinal;
}

function simplificarPosAlgebrite(inputFunction)
{
    let funcaoFinal = inputFunction;
    funcaoFinal = simplificarExpoenteImaginario(funcaoFinal);    
    return funcaoFinal; 
}


var FERNANDO = function() {
    Algebrite.save();
    Algebrite.rect();
    let p1 = Algebrite.pop();
    Algebrite.push(p1);
    Algebrite.push(p1);
    Algebrite.conjugate();
    Algebrite.add();
    Algebrite.push_integer(2);
    Algebrite.divide();
    Algebrite.restore();
};


/*
Ideia para algoritmo para resolver exponenciais complexas:
1. Identifica "z", transforma em a+b*i
2. Procura por somas em exponenciais, separa em multiplicações
3. Procura por z^(n), transforma isso em e^(ln(z)*n) [poderia, também, fazer a conversão com o comp_pol]
4. Realiza expansão de funções (ln, sen, etc)
5. Procura por e^bi e aplica a identidade de euler
6. Procura por e^(ln(a)), com "a" real, e transforma novamente em "a"
7. Se ainda existir qualquer padrão que ativaria as etapas anteriores, volta à etapa 2
8. Junções de multiplicações repetidas
9. Separação de real e imaginário

Ex de funcionamento do algoritmo:
I:
z^z

z^z, 
(a+b*i)^(a+b*i) [Conversão de z=>(a+b*i)],
(a+b*i)^a * (a+b*i)^(b*i) [Separação de expoentes],
e^(ln(a+b*i)*a) * e^(ln(a+b*i)*b*i) [Transformação em e^ln(z)],
e^((1/2 * ln(a^2 + b^2) + i*atan2(b,a))*a) * e^((1/2 * ln(a^2 + b^2) + i*atan2(b,a))*b*i) [Expansão de ln(z)],
e^((1/2 * ln(a^2 + b^2))*a) * e^(i*atan2(b,a)*a) * e^((1/2 * ln(a^2 + b^2))*b*i) * e^(i*atan2(b,a)*b*i) [Separação de expoentes],
e^((a/2 * ln(a^2 + b^2)) * (cos(atan2(b,a)*a)  + i sen(atan2(b,a)*a)) * (b/2 * ln(a^2 + b^2)) * (cos(atan2(b,a)*b*i)  + i sen(atan2(b,a)*b*i)) [Aplicação da identidade de euler],
...

Talvez seja melhor achar uma forma mais eficiente de fazer parte dessas transformações?
z^z é igual a (a^2 + b^2)^(a/2) * e^(-b * atan2(b,a)) * (cos(b/2 * ln(a^2 + b^2) + a * atan2(b,a)) + i sen(b/2 * ln(a^2 + b^2) + a * atan2(b,a))), 
se for calculado corretamente.
Isso acontece porque, na etapa em que há a separação de vários expoentes diferentes 
(que tem 4 e^(algumacoisa) ao mesmo tempo), o certo é comprimir tudo que é imaginário e tudo que é real em duas funções só
Isso vai ser mais eficiente para o javascript, também. Operações de seno e cosseno demandam mais do processador,
então é melhor as comprimirem o maior o possível

*/

/* 
TODO:
- Criação de uma forma nova de entender funções? A manipulação de string depende muito do regex, e tá dando bastante problema
- Implementação de algoritmo para solução de funções de maior complexidade (z^z^z^z^20^i^z...)
*/