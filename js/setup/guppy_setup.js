
function adicionarFuncao(guppy,input_usuario, output_latex, output_text, nome_funcao)
{
    guppy.engine.add_symbol(input_usuario, {
        "output": {
            "latex": "\\text{" + output_latex +"}({$1})",
            "text": output_text + "($1)"
        },
        "attrs": {
            "type": nome_funcao,
            "group": "function"
        }
    });
}

function loadGuppy() {
    guppy = new Guppy('guppy1');
    guppy.engine.set_content(funcaoBase);
    //Funções exclusivas às complexas
    guppy.engine.add_symbol("2atan", {
        "output": {
            "latex": "\\text{atan2}({$1},{$2})",
            "text": "atan2($1,$2)"
        },
        "attrs": {
            "type": "atan2",
            "group": "function"
        }
    });
    guppy.engine.add_symbol("conj", { "output": { "latex": "\\overline{{$1}}", "text": "conj($1)" }, "attrs": { "type": "conj", "group": "function" } });
    adicionarFuncao(guppy, "arg", "Arg", "Arg", "arg")
    adicionarFuncao(guppy, "re", "Re", "Re", "Re");
    adicionarFuncao(guppy, "im", "Im", "Im", "Im");
    //Trigonométricas em português
    adicionarFuncao(guppy, "sen", "sen", "sen", "sin");
    adicionarFuncao(guppy, "tg", "tg", "tg", "tan");
    //Reversas trigonométricas
    adicionarFuncao(guppy, "arcsen", "arcsen", "arcsen", "arcsin");
    adicionarFuncao(guppy, "arctg", "arctg", "arctg", "arctan");
    adicionarFuncao(guppy, "arcsec", "arcsec", "arcsec", "arcsec");
    //Reversas trigonométricas (abreviação)
    adicionarFuncao(guppy, "arsin", "arsin", "arcsen", "arcsin");
    adicionarFuncao(guppy, "arsen", "arsen", "arcsen", "arcsin");
    adicionarFuncao(guppy, "artg", "artg", "arctg", "arctan");
    adicionarFuncao(guppy, "artan", "artan", "arctg", "arctan");
    adicionarFuncao(guppy, "arsec", "arsec", "arcsec", "arcsec");
    //Inversas trigonométricas reversas
    adicionarFuncao(guppy, "arccsc", "arccsc", "arccsc", "arccsc");
    adicionarFuncao(guppy, "arccot", "arccot", "arccot", "arccot");
    //Inversas trigonométricas reversas (abreviação)
    adicionarFuncao(guppy, "arcsc", "arcsc", "arccsc", "arccsc");
    adicionarFuncao(guppy, "arcot", "arcot", "arccot", "arccot");
    adicionarFuncao(guppy, "arsec", "arsec", "arsec", "arcsec");
    //Hiperbólicas
    adicionarFuncao(guppy, "hsin", "sinh", "sinh", "sinh");
    adicionarFuncao(guppy, "hsen", "senh", "senh", "sinh");
    adicionarFuncao(guppy, "hcos", "cosh", "cosh", "cosh");
    adicionarFuncao(guppy, "htan", "tanh", "tanh", "tanh");
    adicionarFuncao(guppy, "htg", "tanh", "tanh", "tanh");
    //Inversas hiperbólicas
    adicionarFuncao(guppy, "hsec", "sech", "sech", "sech");
    adicionarFuncao(guppy, "hcsc", "csch", "csch", "csch");
    adicionarFuncao(guppy, "hcot", "coth", "coth", "coth");
    //Reversas hiperbólicas
    adicionarFuncao(guppy, "harcsin", "arcsinh", "arcsinh", "arcsinh");
    adicionarFuncao(guppy, "harcsen", "arcsenh", "arcsinh", "arcsinh");
    adicionarFuncao(guppy, "harccos", "arccosh", "arccosh", "arccosh");
    adicionarFuncao(guppy, "harctan", "arctanh", "arctanh", "arctanh");
    //Reversas hiperbólicas (abreviação)
    adicionarFuncao(guppy, "harsin", "arsinh", "arsinh", "arcsinh");
    adicionarFuncao(guppy, "harsen", "arsenh", "arcsinh", "arcsinh");
    adicionarFuncao(guppy, "harcos", "arcosh", "arccosh", "arccosh");
    adicionarFuncao(guppy, "hartan", "artanh", "arctanh", "arctanh");
    //Inversas hiperbólicas reversas
    adicionarFuncao(guppy, "harccsc", "arccsch", "arccsch", "arccsch");
    adicionarFuncao(guppy, "harccot", "arccoth", "arccoth", "arccoth");
    adicionarFuncao(guppy, "harcsec", "arcsech", "arcsech", "arcsech");
    //Inversas hiperbólicas reversas (abreviação)
    adicionarFuncao(guppy, "harcsc", "arcsch", "arccsch", "arccsch");
    adicionarFuncao(guppy, "harcot", "arcoth", "arccoth", "arccoth");
    adicionarFuncao(guppy, "harsec", "arsech", "arcsech", "arcsech");
    guppy.activate();
}





export { loadGuppy }