document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const slots = Array.from({ length: 9 }, (_, i) => document.getElementById(`slot${i}`));
    const reels = Array.from({ length: 9 }, (_, i) => document.getElementById(`reel${i}`));
    const spinButton = document.getElementById('spinButton');
    const decreaseBet = document.getElementById('decreaseBet');
    const increaseBet = document.getElementById('increaseBet');
    const betAmountDisplay = document.getElementById('betAmount');
    const balanceDisplay = document.getElementById('balance');
    const lastWinDisplay = document.getElementById('lastWin');
    const winMessageDisplay = document.getElementById('winMessage');
    const lines = document.querySelectorAll('.line');

    // Símbolos disponíveis no jogo
    const symbols = ['🐯', '🍒', '💎', '🎰', '🎮'];

    // Valores dos símbolos (multiplicadores)
    const symbolValues = {
        '🐯': 5,
        '🍒': 3,
        '💎': 4,
        '🎰': 2,
        '🎮': 1
    };

    // Variáveis do jogo
    let balance = 1000;
    let betAmount = 10;
    let isSpinning = false;
    let results = Array(9).fill('🎮');

    // Linhas de pagamento (índices dos slots)
    const paylines = [
        [0, 1, 2], // Horizontal superior
        [3, 4, 5], // Horizontal meio
        [6, 7, 8], // Horizontal inferior
        [0, 3, 6], // Vertical esquerda
        [1, 4, 7], // Vertical meio
        [2, 5, 8], // Vertical direita
        [0, 4, 8], // Diagonal principal
        [2, 4, 6]  // Diagonal secundária
    ];

    // Inicializa os rolos
    initReels();

    // Atualiza exibição inicial
    updateDisplay();

    // Event listeners
    spinButton.addEventListener('click', spin);
    decreaseBet.addEventListener('click', () => changeBet(-5));
    increaseBet.addEventListener('click', () => changeBet(5));

    // Inicializa os rolos com símbolos
    function initReels() {
        reels.forEach(reel => {
            reel.innerHTML = ''; // Limpa o conteúdo dos rolos
            // Adiciona um único símbolo no meio do rolo
            const item = document.createElement('div');
            item.className = 'reel-item';
            item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            reel.appendChild(item);
        });
    }

    // Função para alterar valor da aposta
    function changeBet(amount) {
        if (isSpinning) return;

        betAmount += amount;

        // Limites de aposta
        if (betAmount < 5) betAmount = 5;
        if (betAmount > 100) betAmount = 100;

        updateDisplay();
    }

    // Função para girar os rolos
    function spin() {
        if (isSpinning || balance < betAmount) return;

        // Esconde linhas de vitória anteriores
        hideAllLines();

        // Limpa mensagem de vitória
        winMessageDisplay.textContent = '';

        // Subtrai o valor da aposta do saldo
        balance -= betAmount;
        updateDisplay();

        // Desabilita botões durante o giro
        isSpinning = true;
        spinButton.disabled = true;

        // Gera novos símbolos em cada rolo
        results = Array(9).fill().map(() => getRandomSymbol());

        // Anima os rolos em sequência
        spinReels();
    }

    // Gira os rolos
    function spinReels() {
        const delays = [
            [0, 100, 200],
            [150, 250, 350],
            [200, 300, 400]
        ];

        // Flatten para ter a ordem de animação
        const flatDelays = [
            delays[0][0], delays[0][1], delays[0][2],
            delays[1][0], delays[1][1], delays[1][2],
            delays[2][0], delays[2][1], delays[2][2]
        ];

        // Coloca a animação nos rolos
        for (let i = 0; i < reels.length; i++) {
            setTimeout(() => {
                reels[i].innerHTML = '';
                const item = document.createElement('div');
                item.className = 'reel-item';
                item.textContent = results[i];
                reels[i].appendChild(item);
            }, flatDelays[i]);
        }

        // Após a animação, verifica por ganhos
        setTimeout(() => {
            checkForWin();
        }, Math.max(...flatDelays) + 300);
    }

    // Função para obter um símbolo aleatório
    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Verifica se há um prêmio
    function checkForWin() {
        let totalWin = 0;

        // Verifica as linhas de pagamento tradicionais
        paylines.forEach(line => {
            const [a, b, c] = line;
            if (results[a] === results[b] && results[a] === results[c]) {
                totalWin += symbolValues[results[a]] * betAmount;
                showWinningLine(line);
            }
        });

        // Adiciona o prêmio total ao saldo
        balance += totalWin;
        lastWinDisplay.textContent = `Último ganho: R$${totalWin}`;

        // Mostra mensagem de vitória
        if (totalWin > 0) {
            winMessageDisplay.textContent = 'Você ganhou!';
        } else {
            winMessageDisplay.textContent = 'Sem prêmio dessa vez!';
        }

        // Habilita o botão de giro novamente
        isSpinning = false;
        spinButton.disabled = false;

        // Atualiza o saldo
        updateDisplay();
    }

    // Função para mostrar as linhas de vitória
    function showWinningLine(line) {
        line.forEach(index => {
            slots[index].style.backgroundColor = 'green'; // Destaca a linha vencedora
        });
    }

    // Função para esconder as linhas de vitória
    function hideAllLines() {
        slots.forEach(slot => {
            slot.style.backgroundColor = ''; // Remove destaque
        });
    }

    // Atualiza a exibição dos valores na interface
    function updateDisplay() {
        balanceDisplay.textContent = `Saldo: R$${balance}`;
        betAmountDisplay.textContent = `Aposta: R$${betAmount}`;
    }
});
