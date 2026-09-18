let numerosSorteados = []
let numeroLimite = 100
let numeroSecreto = gerarNumero()
let tentativas = 0

let campoInput = document.querySelector('.container__input');
campoInput.addEventListener('keydown', function(event) {
    if(event.key === 'Enter' && !campoInput.disabled) {
        verificarChute()
    }
})

let inputNomeModal = document.querySelector('#input-nome');
if(inputNomeModal) {
    inputNomeModal.addEventListener('keydown', function(event) {
        if(event.key === 'Enter') {
            salvarNome();
        }
    })
}

function exibirNaTela(tag, texto) {
    let campo = document.querySelector(tag);
    campo.innerHTML = texto;
}

    let nomeSalvo = localStorage.getItem("nomeJogador");

    if(nomeSalvo){
        document.querySelector('#modal-nome').classList.add('escondido');
        exibirNaTela('h1', `Olá, ${nomeSalvo} Bem vindo ao jogo do numero secreto`);
    } else {
        exibirNaTela('h1', 'jogo do numero secreto')
    }


function exibirMensagemInicial() {
    let nomeAtual = localStorage.getItem('nomeJogador');
    if (nomeAtual) {
        exibirNaTela('h1', `Olá, ${nomeAtual} Bem vindo ao jogo do numero secreto.`);
    } else {
        exibirNaTela('h1', 'jogo do numero secreto');
    }

    exibirNaTela('.texto__paragrafo', 'Escolha um numero entre 1 e 100');
}

exibirMensagemInicial()

function verificarChute() {

    let inputValor = document.querySelector('.container__input').value.trim();

    if (inputValor === '' || isNaN(Number(inputValor)) || inputValor > 100 || inputValor < 1) {
        exibirNaTela('.texto__paragrafo', 'Valor invalido, escolha um numero entre 1 e 100 e tente novamente');
        return
    }

    let chute = parseInt(inputValor, 10);

    tentativas++;

    verificarTentativas()

    if (chute === numeroSecreto) {
        exibirNaTela('h1', 'Acertou')
        exibirNaTela('.texto__paragrafo', `Parabens voce acertou o numero secreto ${numeroSecreto}`)

        salvarResultadoNoRanking(tentativas);

        document.querySelector('#reiniciar').disabled = false
        document.querySelector('#chute').disabled = true
        document.querySelector('.container__input').disabled = true
    } else {
        if (chute > numeroSecreto) {
            exibirNaTela('.texto__paragrafo', 'numero secreto é menor')
        } else {
            exibirNaTela('.texto__paragrafo', 'numero secreto é maior');
        }
    }

}

function gerarNumero() {
    let numeroAleatorio = parseInt(Math.random() * numeroLimite + 1);
    let maximoDeNumeros = numerosSorteados.length

    if (maximoDeNumeros == numeroLimite) {
        numerosSorteados = []
    }
    if (numerosSorteados.includes(numeroAleatorio)) {
        return gerarNumero();
    } else {
        numerosSorteados.push(numeroAleatorio);
        return numeroAleatorio;
    }
}


function novojogo() {
    numeroSecreto = gerarNumero()
    tentativas = 0

    exibirMensagemInicial()

    verificarTentativas()

    let input = document.querySelector('.container__input');
    input.value = ''
    input.disabled = false
    input.focus()

    document.querySelector('.container__input').value = ''
    document.querySelector('.container__input').focus()
    document.querySelector('#reiniciar').disabled = true
    document.querySelector('#chute').disabled = false
}

function verificarTentativas() {
    if (tentativas == 1) {
        document.querySelector('#tentativas').textContent = `Tentativa ${tentativas}`
    } else {
        document.querySelector('#tentativas').textContent = `Tentativas ${tentativas}`
    }
}

function salvarNome() {
   let nomeDigitado = document.querySelector("#input-nome").value;

    if(nomeDigitado.trim() === '') {
        nomeDigitado = 'Jogador anonimo';
    }

    localStorage.setItem('nomeJogador', nomeDigitado);

    document.querySelector('#modal-nome').classList.add('escondido');

    exibirNaTela('h1', `Olá, ${nomeDigitado} Bem vindo ao jogo do número secreto`);
}

function salvarResultadoNoRanking(tentativas) {
    const usuarioAtual = localStorage.getItem("nomeJogador");
    if(!usuarioAtual) return;

    let ranking = JSON.parse(localStorage.getItem("ranking")) || []; //Procura o rank se nao existir retorna uma lista vazia

    const jogadorExistente = ranking.find(jogador => jogador.nome === usuarioAtual); //Verifica se o usuario existe

    if(jogadorExistente) {
        if(tentativas < jogadorExistente.melhorPontuacao) {
            jogadorExistente.melhorPontuacao = tentativas; // verifica a pontuaçao e atualiza 
        } 
    }else {
            ranking.push ({
                nome: usuarioAtual,
                melhorPontuacao: tentativas
            }); //se for a primeira vez do usuario ele adiciona ele na lista
        }
    localStorage.setItem("ranking", JSON.stringify(ranking)) //salva o ranking atualizado de volta no localstorage;
} 

function user() {
    localStorage.removeItem("usuarioAtual"); //Remove o usuario atual

    const modal = document.getElementById("modal-nome"); // reabre o input do usuario
    if(modal) {
        modal.classList.remove("escondido")
    }
     const inputNome = document.getElementById("#input-nome"); // limpa o input
     if(inputNome) {
        inputNome.value = "";
        inputNome.focus();
     }
}

function rank() {
    const rankDiv = document.getElementById("rank-users");

    if(rankDiv.classList.contains("Ativo")) {
        rankDiv.classList.remove("Ativo");
        return;
    }

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    
    ranking.sort((a,b) => a.melhorPontuacao - b.melhorPontuacao)

    let htmlContent = `
        <div class="rank-card">
            <button class="fechar-rank" onclick="fecharRank()">&times;</button>
            <h2>🏆 Ranking dos Jogadores</h2>
            <ul class="rank-lista">
    `;

    if (ranking.length === 0) {
        htmlContent += `<li class="rank-item-vazio">Nenhum registro ainda!</li>`;
    } else {
        ranking.forEach((jogador, index) => {
            htmlContent += `
                <li class="rank-item">
                    <span class="rank-posicao">#${index + 1}</span>
                    <span class="rank-nome">${jogador.nome}</span>
                    <span class="rank-pontos">${jogador.melhorPontuacao} ${jogador.melhorPontuacao === 1 ? 'tentativa' : 'tentativas'}</span>
                </li>
            `;
        });
    }

    htmlContent += `
            </ul>
        </div>
    `;

    rankDiv.innerHTML = htmlContent;
    rankDiv.classList.add("ativo");
}

function fecharRank() {
    const rankDiv = document.getElementById("rank-users");
    if (rankDiv) {
        rankDiv.classList.remove("ativo");
    }
}
