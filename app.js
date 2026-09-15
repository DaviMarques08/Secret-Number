let numerosSorteados = []
let numeroLimite = 100
let numeroSecreto = gerarNumero()
let tentativas = 0

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

    let chute = document.querySelector('input').value

    if (chute === '') {
        exibirNaTela('.texto__paragrafo', 'Valor invalido, escolha um numero entre 1 e 100 e tente novamente');
        return
    }

    tentativas++;

    verificarTentativas()

    if (chute == numeroSecreto) {
        exibirNaTela('h1', 'Acertou')
        exibirNaTela('.texto__paragrafo', `Parabens voce acertou o numero secreto ${numeroSecreto}`)
        document.querySelector('#reiniciar').disabled = false
        document.querySelector('#chute').disabled = true
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

    document.querySelector('input').value = ''
    document.querySelector('input').focus()
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