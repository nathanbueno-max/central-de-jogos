const simbolos = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
];
let cartas = [];
let cartasViradas = [];
let paresEncontrados = 0;
let bloqueado = false;
let gameActive = false;
let timerInterval;

const tabuleiro = document.getElementById('tabuleiro');
const mensagens = document.getElementById('mensagens');
const numCartasSelect = document.getElementById('num-cartas');
const iniciarButton = document.getElementById('iniciar-jogo');
const resetButton = document.getElementById('reset-button');
const timerSpan = document.getElementById('timer');
const informacoesJogoDiv = document.querySelector('.informacoes-jogo');

const temposPorCarta = {
    '20': 60,  // 1 minuto
    '30': 180, // 3 minutos
    '40': 300  // 5 minutos
};
let tempoRestante = 0;

function iniciarJogo() {
    const numCartas = parseInt(numCartasSelect.value);
    const simbolosParaJogo = simbolos.slice(0, numCartas / 2);
    cartas = [...simbolosParaJogo, ...simbolosParaJogo];
    cartas.sort(() => Math.random() - 0.5);
    
    paresEncontrados = 0;
    cartasViradas = [];
    bloqueado = false;
    gameActive = true;
    mensagens.textContent = '';
    
    // Define o número de colunas para o CSS Grid
    let numColunas;
    if (numCartas === 20) {
        numColunas = 5; // 5x4
    } else if (numCartas === 30) {
        numColunas = 6; // 6x5
    } else { // 40 cartas
        numColunas = 8; // 8x5
    }
    tabuleiro.style.setProperty('--colunas-grid', numColunas);

    tabuleiro.innerHTML = '';
    cartas.forEach((simbolo, index) => {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.simbolo = simbolo;
        carta.dataset.index = index;

        const cartaVerso = document.createElement('div');
        cartaVerso.classList.add('carta-verso');
        const cartaFrente = document.createElement('div');
        cartaFrente.classList.add('carta-frente');
        cartaFrente.textContent = simbolo;

        carta.appendChild(cartaVerso);
        carta.appendChild(cartaFrente);
        carta.addEventListener('click', virarCarta);
        tabuleiro.appendChild(carta);
    });

    tempoRestante = temposPorCarta[numCartas];
    atualizarTimer();
    timerInterval = setInterval(() => {
        tempoRestante--;
        atualizarTimer();
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            finalizarJogo(false); 
        }
    }, 1000);

    iniciarButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
    informacoesJogoDiv.style.display = 'block';
    numCartasSelect.disabled = true;
}

function virarCarta(event) {
    if (bloqueado || !gameActive) return;

    const cartaClicada = event.currentTarget;
    if (cartaClicada.classList.contains('virada') || cartaClicada.classList.contains('par-encontrado')) return;

    cartaClicada.classList.add('virada');
    cartasViradas.push(cartaClicada);

    if (cartasViradas.length === 2) {
        bloqueado = true;
        verificarPar();
    }
}

function verificarPar() {
    const [carta1, carta2] = cartasViradas;
    const simbolo1 = carta1.dataset.simbolo;
    const simbolo2 = carta2.dataset.simbolo;

    if (simbolo1 === simbolo2) {
        carta1.classList.add('par-encontrado');
        carta2.classList.add('par-encontrado');
        paresEncontrados++;
        cartasViradas = [];
        bloqueado = false;
        if (paresEncontrados === cartas.length / 2) {
            clearInterval(timerInterval);
            finalizarJogo(true);
        }
    } else {
        setTimeout(() => {
            carta1.classList.remove('virada');
            carta2.classList.remove('virada');
            cartasViradas = [];
            bloqueado = false;
        }, 1000);
    }
}

function finalizarJogo(vitoria) {
    gameActive = false;
    bloqueado = true;
    if (vitoria) {
        mensagens.textContent = `Parabéns, você encontrou todos os pares!`;
    } else {
        mensagens.textContent = `Tempo esgotado! Você perdeu.`;
    }
}

function reiniciarJogo() {
    clearInterval(timerInterval);
    gameActive = false;
    bloqueado = false;
    paresEncontrados = 0;
    cartasViradas = [];
    mensagens.textContent = '';
    tabuleiro.innerHTML = '';
    
    iniciarButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
    informacoesJogoDiv.style.display = 'none';
    numCartasSelect.disabled = false;
}

function atualizarTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    timerSpan.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Event Listeners
iniciarButton.addEventListener('click', iniciarJogo);
resetButton.addEventListener('click', reiniciarJogo);