function handleActiveClick(element) {
    element.classList.toggle('active');
}

//Função para ocultar as opções:
const lateral = document.getElementById('lateral');
const navbar = document.getElementById('navbar');
const setaLateral = document.getElementById('setaLateral');
const setaNavbar = document.getElementById('setaNavbar');
const domainColoring = document.getElementById('domainColoring');
function ocultaLateral() {
    lateral.classList.toggle('hidded');
    domainColoring.classList.toggle('hidded');
    setaLateral.style.rotate = setaLateral.style.rotate == '90deg' ? '-90deg' : '90deg';
}

function ocultaNavbar() {
    //Ocula opções se não estiver ocultada
    if (!lateral.classList.contains('hidded')) {
        ocultaLateral();
    }

    //Oculta navbar
    navbar.classList.toggle('hidded');
    setaNavbar.style.rotate = setaNavbar.style.rotate == '180deg' ? '0deg' : '180deg';
}

// Definindo inputs:
const carregamentoGrafico = document.getElementById('CarregamentoGrafico');
const tipoGrafico = document.getElementById('TipoGrafico');
const tamanhoGrafico = document.getElementById('TamanhoGrafico');
const tipoAnimacao = document.getElementById('TipoAnimacao');
const lateralOpcoes = document.getElementById('LateralOpcoes');
const lateralAnimacao = document.getElementById('LateralAnimacao');

const realMinimoInput = document.getElementById('real-minimo');
const realMaximoInput = document.getElementById('real-maximo');
const imagMinimoInput = document.getElementById('imag-minimo');
const imagMaximoInput = document.getElementById('imag-maximo');
const tamanhoGraficoInput = document.getElementById('tamanho-grafico');
const variacaoMinimoInput = document.getElementById('variacao-minimo');
const variacaoMaximoInput = document.getElementById('variacao-maximo');
const incrementoInput = document.getElementById('incremento');
const fpsInput = document.getElementById('fps');

//Guardando em um array:
const elementos = [carregamentoGrafico, tipoGrafico, tamanhoGrafico,
    tipoAnimacao, lateralOpcoes, lateralAnimacao];


//Chamando a função:
elementos.forEach((elemento) => {
    elemento.addEventListener('click', () => {
        handleActiveClick(elemento.parentElement.parentElement);
    });
});


//Função para alterar o valor das variaveis quando o usuário clicar em um dos botões:
function handleValueChange(element, type) {
    const value = element.value;
    switch (type) {
        case 1:
            variaveisGlobais.realMinimo = value;
            break;
        case 2:
            variaveisGlobais.realMaximo = value;
            break;
        case 3:
            variaveisGlobais.imagMinimo = value;
            break;
        case 4:
            variaveisGlobais.imagMaximo = value;
            break;
        case 5:
            variaveisGlobais.valorTamanhoGrafico = value;
            break;
        case 6:
            variaveisGlobais.variacaoInicio = value;
            break;
        case 7:
            variaveisGlobais.variacaoFim = value;
            break;
        case 8:
            variaveisGlobais.incremento = value;
            break;
        case 9:
            variaveisGlobais.fps = value;
            break;
    }
}

//Adicionando os eventos de mudança de valor:
realMinimoInput.addEventListener('change', () => {
    handleValueChange(realMinimoInput, 1);
});
realMaximoInput.addEventListener('change', () => {
    handleValueChange(realMaximoInput, 2);
});
imagMinimoInput.addEventListener('change', () => {
    handleValueChange(imagMinimoInput, 3);
});
imagMaximoInput.addEventListener('change', () => {
    handleValueChange(imagMaximoInput, 4);
});
tamanhoGraficoInput.addEventListener('change', () => {
    handleValueChange(tamanhoGraficoInput, 5);
});
variacaoMinimoInput.addEventListener('change', () => {
    handleValueChange(variacaoMinimoInput, 6);
});
variacaoMaximoInput.addEventListener('change', () => {
    handleValueChange(variacaoMaximoInput, 7);
});
incrementoInput.addEventListener('change', () => {
    handleValueChange(incrementoInput, 8);
});
fpsInput.addEventListener('change', () => {
    handleValueChange(fpsInput, 9);
});

//Definindo os dropdowns:
const opcoesCarregamento = {};
opcoesCarregamento['tipo'] = 1;
opcoesCarregamento['ativo'] = 'normal';
opcoesCarregamento['normal'] = 'Grafico normal';
opcoesCarregamento['webgl'] = 'Renderização precisa (menor velocidade)';
opcoesCarregamento['ambos'] = 'Ambos';

const opcoesTipoAnimacao = {};
opcoesTipoAnimacao['tipo'] = 2;
opcoesTipoAnimacao['ativo'] = 'normal';
opcoesTipoAnimacao['continue'] = 'Normal';
opcoesTipoAnimacao['bounce'] = 'Bouncy';
opcoesTipoAnimacao['loop'] = 'Repeat';

const opcoesTipoGrafico = {};
opcoesTipoGrafico['tipo'] = 3;
opcoesTipoGrafico['ativo'] = 'continuo';
opcoesTipoGrafico['continuo'] = 'Continuo';
opcoesTipoGrafico['descontinuo'] = 'Descontinuo';


function createDropdownOptions(opcoes, element) {
    const dropdownOptions = element.parentElement.parentElement.querySelector('.input-dropdown-options');
    dropdownOptions.innerHTML = '';
    Object.keys(opcoes).forEach((key) => {
        if (key === 'ativo' || key == 'tipo') return;
        if (key === opcoes['ativo']) return;
        const option = document.createElement('h4');
        option.innerHTML = opcoes[key];
        option.addEventListener('click', () => {
            opcoes['ativo'] = key;
            switch (opcoes['tipo']) {
                case 1:
                    variaveisGlobais.tipoCarregamento = key;
                    break;
                case 2:
                    variaveisGlobais.valorTipoAnimacao = key;
                    break;
                case 3:
                    variaveisGlobais.valorTipoGrafico = key;
                    break;
            }
            element.parentElement.querySelector('p').innerHTML = opcoes[key];
            dropdownOptions.innerHTML = '';
            createDropdownOptions(opcoes, element);
            element.parentElement.parentElement.classList.remove('active');
        });
        dropdownOptions.appendChild(option);
    });
}

createDropdownOptions(opcoesCarregamento, carregamentoGrafico);
createDropdownOptions(opcoesTipoAnimacao, tipoAnimacao);
createDropdownOptions(opcoesTipoGrafico, tipoGrafico);

function alteraOpcaoTamanhoGrafico() {
    let div = tamanhoGrafico.parentElement.parentElement;
    if (div.id == 'active') {
        variaveisGlobais.graficoOcupaTelaInteiraActive = false;
        div.id = '';
        div.querySelector('.input-dropdown-fixed input').style = 'display: block';
        div.querySelector('.input-dropdown-fixed p').style = 'display: none';
        div.querySelector('.input-dropdown-fixed div p').style = 'display: block';
        div.querySelector('.input-dropdown-options h4').innerHTML = 'Grafico ocupa a tela inteira';
    } else {
        variaveisGlobais.graficoOcupaTelaInteiraActive = true;
        div.id = 'active';
        div.querySelector('.input-dropdown-fixed input').style = 'display: none';
        div.querySelector('.input-dropdown-fixed p').style = 'display: block';
        div.querySelector('.input-dropdown-fixed div p').style = 'display: none';
        div.querySelector('.input-dropdown-options h4').innerHTML = 'Grafico com tamanho fixo';
    }
    div.classList.remove('active');
}


function chegaValoresGlobais() {
    console.log(variaveisGlobais);
}

function changeEixosCartesianosActive(element) {
    variaveisGlobais.eixosCartesianos = !variaveisGlobais.eixosCartesianos;
    element.classList.toggle('active');
}

const elementosDaAnimacoView = document.querySelectorAll("#lateral-animacao .lateral-div-content:not(:nth-child(2))");
function changeAnimacaoActive(element) {
    console.log(elementosDaAnimacoView);
    variaveisGlobais.animacaoLigada = !variaveisGlobais.animacaoLigada;
    element.classList.toggle('active');
    elementosDaAnimacoView.forEach((elemento) => {
        elemento.classList.toggle('disabled');
    });
}
