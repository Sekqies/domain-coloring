
function Produtoria(inicio,fim)
{
    if (inicio==0)
        return 1;
    let a = BigNumber(1);
    for (let i=inicio; i>=fim; i--)
    {
        a = a.multipliedBy(i)
    }
    return a;
}

function Combinacao(n,p)
{
    return BigNumber(Produtoria(n,n-p+1).dividedBy(Produtoria(p,1))).toFixed();
}

function Newton(funcao,potencia)
{
    let stringbuilder = "";
    let termo1 = "";
    let termo2 = "";
    let chave = true;
    for(let i=0; i<funcao.length; i++)
    {
        if (chave)
        {
            if (funcao[i] == "+")
            {
                chave = false;
                continue;
            }
            termo1 += funcao[i];
            continue
        }
        termo2 += funcao[i];
    }
    console.log(termo1 + " " + termo2)
    for (let i=0; i<=potencia; i++)
    {
       stringbuilder += replaceBinomial(Combinacao(potencia,i) + "*" + termo1 + "^" + (potencia-i) + "*" + termo2 + "^" + i + " + ");
    }
    stringbuilder += '0';
    return stringbuilder;
}