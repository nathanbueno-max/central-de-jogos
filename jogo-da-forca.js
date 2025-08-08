const palavrasComDicas = [
    { palavra: 'OCEANO', dica: 'A maior massa de água do planeta.' },
    { palavra: 'ELEFANTE', dica: 'O maior animal terrestre.' },
    { palavra: 'AMAZONAS', dica: 'A maior floresta tropical do mundo.' },
    { palavra: 'SOL', dica: 'A estrela que ilumina a Terra.' },
    { palavra: 'PARIS', dica: 'A capital da França.' },
    { palavra: 'GRAVIDADE', dica: 'A força que nos mantém no chão.' },
    { palavra: 'OXIGENIO', dica: 'Gás essencial para a respiração.' },
    { palavra: 'PYTHON', dica: 'Linguagem de programação popular.' },
    { palavra: 'MOZART', dica: 'Famoso compositor clássico.' },
    { palavra: 'FOTOSSINTESE', dica: 'Processo das plantas para produzir alimento.' }
];

let palavraSecreta;
let dicaSecreta;
let letrasAdivinhadas = [];
let letrasErradas = [];
const maxErros = 6;

const palavraContainer = document.getElementById('palavra-container');
const letrasErradasSpan = document.getElementById('letras-erradas');
const mensagem = document.getElementById('mensagem');
const inputLetra = document.getElementById('letra-input');
const forcaPartes = document.querySelectorAll('.forca-parte');
const chuteInput = document.getElementById('chute-input');
const dicaButton = document.getElementById('dica-button');

function iniciarJogo() {
    const palavraAleatoria = palavrasComDicas[Math.floor(Math.random() * palavrasComDicas.length)];
    palavraSecreta = palavraAleatoria.palavra;
    dicaSecreta = palavraAleatoria.dica;
    
    letrasAdivinhadas = [];
    letrasErradas = [];
    
    palavraContainer.textContent = '';
    for (let i = 0; i < palavraSecreta.length; i++) {
        palavraContainer.textContent += '_ ';
    }
    
    letrasErradasSpan.textContent = '';
    mensagem.textContent = '';
    inputLetra.value = '';
    inputLetra.disabled = false;
    chuteInput.disabled = false;
    dicaButton.disabled = false;

    forcaPartes.forEach(parte => parte.style.visibility = 'hidden');
}

function adivinharLetra() {
    const letra = inputLetra.value.toUpperCase();
    inputLetra.value = '';

    if (!letra || letra.length > 1) {
        mensagem.textContent = 'Por favor, insira apenas uma letra.';
        return;
    }

    if (letrasAdivinhadas.includes(letra) || letrasErradas.includes(letra)) {
        mensagem.textContent = `Você já tentou a letra "${letra}".`;
        return;
    }

    if (palavraSecreta.includes(letra)) {
        letrasAdivinhadas.push(letra);
        atualizarPalavra();
        if (verificarVitoria()) {
            mensagem.textContent = 'Parabéns, você venceu!';
            finalizarJogo();
        }
    } else {
        letrasErradas.push(letra);
        letrasErradasSpan.textContent = letrasErradas.join(', ');
        desenharForca();
        if (letrasErradas.length >= maxErros) {
            mensagem.textContent = `Você perdeu! A palavra era: ${palavraSecreta}`;
            finalizarJogo();
        }
    }
}

function atualizarPalavra() {
    let displayPalavra = '';
    for (const letra of palavraSecreta) {
        if (letrasAdivinhadas.includes(letra)) {
            displayPalavra += letra + ' ';
        } else {
            displayPalavra += '_ ';
        }
    }
    palavraContainer.textContent = displayPalavra;
}

function verificarVitoria() {
    return [...palavraSecreta].every(letra => letrasAdivinhadas.includes(letra));
}

function desenharForca() {
    for (let i = 0; i < letrasErradas.length; i++) {
        forcaPartes[i].style.visibility = 'visible';
    }
}

function finalizarJogo() {
    inputLetra.disabled = true;
    chuteInput.disabled = true;
    dicaButton.disabled = true;
}

function reiniciarJogo() {
    iniciarJogo();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        adivinharLetra();
    }
}

// Funções novas
function darDica() {
    mensagem.textContent = `Dica: ${dicaSecreta}`;
    dicaButton.disabled = true;
}

function chutarPalavra() {
    const chute = chuteInput.value.toUpperCase();
    if (chute === palavraSecreta) {
        mensagem.textContent = 'Parabéns, você acertou a palavra!';
        finalizarJogo();
    } else {
        mensagem.textContent = `Que pena, você errou! A palavra era: ${palavraSecreta}. O jogo será reiniciado.`;
        setTimeout(reiniciarJogo, 3000);
        finalizarJogo();
    }
}

iniciarJogo();