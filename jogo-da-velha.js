const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const iniciarButton = document.getElementById('iniciar-jogo');
const dificuldadeSelect = document.getElementById('dificuldade');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let dificuldade = 'facil';
let isPlayerVsBot = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    if (!gameActive) return;

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '') {
        return;
    }

    makeMove(clickedCellIndex, currentPlayer);
    
    if (gameActive && isPlayerVsBot) {
        // Se o jogo ainda estiver ativo e for o modo contra o bot, o bot faz a jogada
        setTimeout(botMove, 500); // Adiciona um pequeno delay para a jogada do bot
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    checkWinner();
    if (gameActive) {
        changePlayer();
    }
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `O jogador ${currentPlayer} venceu!`;
        gameActive = false;
        return;
    }

    const isDraw = !board.includes('');
    if (isDraw) {
        statusText.textContent = `Empate!`;
        gameActive = false;
        return;
    }
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (!gameActive) return; // Não atualiza o status se o jogo acabou
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
}

// Lógica do BOT
function botMove() {
    if (!gameActive || currentPlayer === 'X') return;

    let move;
    if (dificuldade === 'facil') {
        move = botFacil();
    } else if (dificuldade === 'medio') {
        move = botMedio();
    } else {
        move = botDificil();
    }

    if (move !== -1) {
        makeMove(move, 'O');
    }
}

function botFacil() {
    const jogadasDisponiveis = board
        .map((val, index) => val === '' ? index : null)
        .filter(val => val !== null);

    const randomIndex = Math.floor(Math.random() * jogadasDisponiveis.length);
    return jogadasDisponiveis[randomIndex];
}

function botMedio() {
    // 1. Tenta vencer
    let move = encontrarMelhorJogada('O');
    if (move !== -1) return move;

    // 2. Tenta bloquear o jogador humano
    move = encontrarMelhorJogada('X');
    if (move !== -1) return move;

    // 3. Faz uma jogada aleatória
    return botFacil();
}

function botDificil() {
    // A lógica de um bot difícil (minimax) é mais complexa.
    // Para simplificar, vamos usar uma estratégia avançada, mas não um minimax completo.

    // 1. Tenta vencer
    let move = encontrarMelhorJogada('O');
    if (move !== -1) return move;

    // 2. Tenta bloquear o jogador humano
    move = encontrarMelhorJogada('X');
    if (move !== -1) return move;
    
    // 3. Ocupa o centro
    if (board[4] === '') return 4;
    
    // 4. Ocupa uma das quinas
    const quinasDisponiveis = [0, 2, 6, 8].filter(index => board[index] === '');
    if (quinasDisponiveis.length > 0) {
        return quinasDisponiveis[Math.floor(Math.random() * quinasDisponiveis.length)];
    }

    // 5. Ocupa qualquer outro canto (jogada aleatória)
    return botFacil();
}

// Função auxiliar para bot médio/difícil
function encontrarMelhorJogada(player) {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        
        // Verifica se há 2 símbolos do mesmo tipo e um espaço vazio
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return -1;
}

// Funções de controle do jogo
function iniciarJogo() {
    dificuldade = dificuldadeSelect.value;
    gameActive = true;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
    resetButton.style.display = 'inline-block';
    iniciarButton.style.display = 'none';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

function resetGame() {
    gameActive = false;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `Selecione a dificuldade e inicie o jogo.`;
    resetButton.style.display = 'none';
    iniciarButton.style.display = 'inline-block';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Adiciona os event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
iniciarButton.addEventListener('click', iniciarJogo);