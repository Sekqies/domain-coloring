function simplificarExponencial(inputFunction) {
    //Transforma uma função em formato de a^b em Math.pow(a,b)
    var outputFunction = inputFunction.replace(/(\w+)\s*\^\s*(\w+\.\w+)/g, function(match, base, exponent) {
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
    var funcaoLimpa = funcaoOriginal.replace(/\basin\(/g, 'Math.asin(');
    funcaoLimpa = funcaoLimpa.replace(/\bsin\(/g, 'Math.sin(');
    funcaoLimpa = funcaoLimpa.replace(/\bcos\(/g, 'Math.cos(');
    funcaoLimpa = funcaoLimpa.replace(/\btan\(/g, 'Math.tan(');
    funcaoLimpa = funcaoLimpa.replace(/\bacos\(/g, 'Math.acos(');
    funcaoLimpa = funcaoLimpa.replace(/\batan\(/g, 'Math.atan(');
    funcaoLimpa = funcaoLimpa.replace(/\batan2\((.*?),(.*?)\)/g, 'Math.atan2($1, $2)');
    
    funcaoLimpa = funcaoLimpa.replace(/\blog\(/g, 'Math.log(');
    funcaoLimpa = funcaoLimpa.replace(/\bsqrt\(/g, 'Math.sqrt(');
    funcaoLimpa = funcaoLimpa.replace(/\bcosh\(/g, 'Math.cosh(');
    funcaoLimpa = funcaoLimpa.replace(/\bsinh\(/g, 'Math.sinh(');

    funcaoLimpa = funcaoLimpa.replace(/\((.*?)\)\^(\w+\.\w+)/g, 'Math.pow($1, $2)');

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
        return output.slice(0, -3); // Remove the trailing ' * '
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

function comp_exp(expoente) {
    return "(cos(" + expoente + ") + i*sin(" + expoente + ") )";
}

function comp_log (funcao)
{
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return "(ln( sqrt(" + real + "^2 + " + imag + "^2 )) + i*atan2(" + imag + "," + real + "))";
}

function comp_sen(funcao)
{
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return "(sin(" + real + ")*cosh(" + imag + ") + i*cos(" + real + ")*sinh(" + imag + "))";
}

function comp_cos(funcao)
{
    console.log(funcao);
    let real = Algebrite.real(funcao);
    let imag = Algebrite.imag(funcao);
    return "(cos(" + real + ")*cosh(" + imag + ") - i*sin(" + real + ")*sinh(" + imag + "))";
}
function comp_pol(expoente)
{
    return "(a^2 + b^2)^(" + expoente/2 + ")*(cos(" + expoente + "*atan2(b,a)) + i*sin(" + expoente + "*atan2(b,a)))";
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


