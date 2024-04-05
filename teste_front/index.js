function handleActiveClick(element) {
    element.classList.toggle('active');
}

//Função para ocultar as opções:
const lateral = document.getElementById('lateral');
function ocultaOpcoes(element) {
    lateral.classList.toggle('hidded');
    element.style.rotate = element.style.rotate == '90deg' ? '-90deg' : '90deg';
}

// Definindo inputs:
const carregamentoGrafico = document.getElementById('CarregamentoGrafico');
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
const elementos = [carregamentoGrafico, tamanhoGrafico,
    tipoAnimacao, lateralOpcoes, lateralAnimacao];


//Chamando a função:
elementos.forEach((elemento) => {
    elemento.addEventListener('click', () => {
        handleActiveClick(elemento.parentElement.parentElement);
    });
});


//Definindo as opções padrões:

var tipoCarregamento = 'normal';
var realMinimo = -2;
var realMaximo = 2;
var imagMinimo = -2;
var imagMaximo = 2;
var valorTamanhoGrafico = 500;
var graficoOcupaTelaInteiraActive = false;
var eixosCartesianos = false;

function changeEixosCartesianosActive(element){
    eixosCartesianos = !eixosCartesianos;
    element.classList.toggle('active');
}

var variacaoInicio = 0;
var variacaoFim = 10;
var incremento = 0.5;
var fps = 30;
var valorTipoAnimacao = 'normal';

//Função para alterar o valor das variaveis quando o usuário clicar em um dos botões:
function handleValueChange(element, type) {
    const value = element.value;
    console.log("Elemento: ", element, "Valor: ", value, "Tipo: ", type, "\n");
    switch (type) {
        case 1:
            realMinimo = value;
            break;
        case 2:
            realMaximo = value;
            break;
        case 3:
            imagMinimo = value;
            break;
        case 4:
            imagMaximo = value;
            break;
        case 5:
            valorTamanhoGrafico = value;
            break;
        case 6:
            variacaoInicio = value;
            break;
        case 7:
            variacaoFim = value;
            break;
        case 8:
            incremento = value;
            break;
        case 9:
            fps = value;
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
opcoesCarregamento['ativo'] = 'normal';
opcoesCarregamento['normal'] = 'Grafico normal';
opcoesCarregamento['preciso'] = 'Renderização precisa (menor velocidade)';

const opcoesTipoAnimacao = {};
opcoesTipoAnimacao['ativo'] = 'normal';
opcoesTipoAnimacao['normal'] = 'Normal';
opcoesTipoAnimacao['bouncy'] = 'Bouncy';
opcoesTipoAnimacao['repeat'] = 'Repeat';


const h4opcoesCarregamentoGrafico = carregamentoGrafico.parentElement.parentElement.querySelectorAll('.input-dropdown-options > h4');
console.log(h4opcoesCarregamentoGrafico);
const h1opcoesCarregamentoGrafico = carregamentoGrafico.parentElement.querySelector('p');
console.log(h1opcoesCarregamentoGrafico);
h1opcoesCarregamentoGrafico.innerHTML = opcoesCarregamento[opcoesCarregamento['ativo']];

function createDropdownOptions(opcoes, element) {
    const dropdownOptions = element.parentElement.parentElement.querySelector('.input-dropdown-options');
    dropdownOptions.innerHTML = '';
    Object.keys(opcoes).forEach((key) => {
        if (key === 'ativo') return;
        if (key === opcoes['ativo']) return;
        const option = document.createElement('h4');
        option.innerHTML = opcoes[key];
        option.addEventListener('click', () => {
            opcoes['ativo'] = key;
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

function alteraOpcaoTamanhoGrafico() {
    let div = tamanhoGrafico.parentElement.parentElement;
    if (div.id == 'active') {
        graficoOcupaTelaInteiraActive = false;
        div.id = '';
        div.querySelector('.input-dropdown-fixed input').style = 'display: block';
        div.querySelector('.input-dropdown-fixed p').style = 'display: none';
        div.querySelector('.input-dropdown-fixed div p').style = 'display: block';
        div.querySelector('.input-dropdown-options h4').innerHTML = 'Grafico ocupa a tela inteira';
    } else {
        graficoOcupaTelaInteiraActive = true;
        div.id = 'active';
        div.querySelector('.input-dropdown-fixed input').style = 'display: none';
        div.querySelector('.input-dropdown-fixed p').style = 'display: block';
        div.querySelector('.input-dropdown-fixed div p').style = 'display: none';
        div.querySelector('.input-dropdown-options h4').innerHTML = 'Grafico com tamanho fixo';
    }
    div.classList.remove('active');
}