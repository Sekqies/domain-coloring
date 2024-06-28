function adicionarFuncao_Latex(guppy, input_usuario, output_latex, output_text, nome_funcao) {
    guppy.engine.add_symbol(input_usuario, {
        "output": {
            "latex": output_latex,
            "text": output_text + "($1)"
        },
        "attrs": {
            "type": nome_funcao,
            "group": "function"
        }
    });
}

function adicionarFuncao(guppy, input_usuario, output_text, nome_funcao) {
    guppy.engine.add_symbol(input_usuario, {
        "output": {
            "latex": "\\text{" + output_text + "}({$1})",
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
    adicionarFuncao_Latex(guppy, "2atan", "\\text{atan2}({$1},{$2})", "atan2($1,$2)", "atan2");
    adicionarFuncao_Latex(guppy, "conj", "\\overline{{$1}}", "conj($1)", "conj");
    adicionarFuncao(guppy, "arg", "Arg", "arg");
    adicionarFuncao(guppy, "re", "Re", "Re");
    adicionarFuncao(guppy, "im", "Im", "Im");
    //Trigonométricas em português
    adicionarFuncao(guppy, "sen", "sen", "sin");
    adicionarFuncao(guppy, "tg", "tg", "tan");
    //Reversas trigonométricas
    adicionarFuncao(guppy, "arcsen", "arcsen", "arcsin");
    adicionarFuncao(guppy, "arctg", "arctg", "arctan");
    adicionarFuncao(guppy, "arcsec", "arcsec", "arcsec");
    //Reversas trigonométricas (abreviação)
    adicionarFuncao(guppy, "arsin", "arsin", "arcsen");
    adicionarFuncao(guppy, "arsen", "arsen", "arcsen");
    adicionarFuncao(guppy, "artg", "artg", "arctg");
    adicionarFuncao(guppy, "artan", "artan", "arctg");
    adicionarFuncao(guppy, "arsec", "arsec", "arcsec");
    //Inversas trigonométricas reversas
    adicionarFuncao(guppy, "arccsc", "arccsc", "arccsc");
    adicionarFuncao(guppy, "arccot", "arccot", "arccot");
    //Inversas trigonométricas reversas (abreviação)
    adicionarFuncao(guppy, "arcsc", "arcsc", "arccsc");
    adicionarFuncao(guppy, "arcot", "arcot", "arccot");
    adicionarFuncao(guppy, "arsec", "arsec", "arcsec");
    //Hiperbólicas
    adicionarFuncao(guppy, "hsin", "sinh", "sinh");
    adicionarFuncao(guppy, "hsen", "senh", "sinh");
    adicionarFuncao(guppy, "hcos", "cosh", "cosh");
    adicionarFuncao(guppy, "htan", "tanh", "tanh");
    adicionarFuncao(guppy, "htg", "tanh", "tanh");
    //Inversas hiperbólicas
    adicionarFuncao(guppy, "hsec", "sech", "sech");
    adicionarFuncao(guppy, "hcsc", "csch", "csch");
    adicionarFuncao(guppy, "hcot", "coth", "coth");
    //Reversas hiperbólicas
    adicionarFuncao(guppy, "harcsin", "arcsinh", "arcsinh");
    adicionarFuncao(guppy, "harcsen", "arcsenh", "arcsinh");
    adicionarFuncao(guppy, "harccos", "arccosh", "arccosh");
    adicionarFuncao(guppy, "harctan", "arctanh", "arctanh");
    //Reversas hiperbólicas (abreviação)
    adicionarFuncao(guppy, "harsin", "arsinh", "arcsinh");
    adicionarFuncao(guppy, "harsen", "arsenh", "arcsinh");
    adicionarFuncao(guppy, "harcos", "arcosh", "arccosh");
    adicionarFuncao(guppy, "hartan", "artanh", "arctanh");
    //Inversas hiperbólicas reversas
    adicionarFuncao(guppy, "harccsc", "arccsch", "arccsch");
    adicionarFuncao(guppy, "harccot", "arccoth", "arccoth");
    adicionarFuncao(guppy, "harcsec", "arcsech", "arcsech");
    //Inversas hiperbólicas reversas (abreviação)
    adicionarFuncao(guppy, "harcsc", "arcsch", "arccsch");
    adicionarFuncao(guppy, "harcot", "arcoth", "arccoth");
    adicionarFuncao(guppy, "harsec", "arsech", "arcsech");
    //Outras funções
    adicionarFuncao_Latex(guppy, "gamma", "\\Gamma({$1})", "gamma($1)", "gamma");
    adicionarFuncao_Latex(guppy,"zeta","\\zeta({$1})", "zeta($1)", "zeta");
    adicionarFuncao(guppy,"W","W","lambertw");
    adicionarFuncao(guppy,"w","W","lambertw");
    adicionarFuncao(guppy,"lambert","W","lambertw");
    guppy.activate();
}

export { loadGuppy }
