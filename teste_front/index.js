function handleActiveClick(element){
    element.classList.toggle('active');
}   

// Definindo inputs:
const carregamentoGrafico = document.getElementById('CarregamentoGrafico');
const tamanhoGrafico = document.getElementById('TamanhoGrafico');
const tipoAnimacao = document.getElementById('TipoAnimacao');
const lateralOpcoes = document.getElementById('LateralOpcoes');
const lateralAnimacao = document.getElementById('LateralAnimacao');

//Guardando em um array:
const elementos = [carregamentoGrafico, tamanhoGrafico, 
    tipoAnimacao, lateralOpcoes, lateralAnimacao];


//Chamando a função:
elementos.forEach((elemento) => {
    elemento.addEventListener('click', () => {
        handleActiveClick(elemento.parentElement.parentElement);
    });
});
