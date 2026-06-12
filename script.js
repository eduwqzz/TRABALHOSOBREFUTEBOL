function verificarResposta(acertou, botaoClicado) {
    const resultado = document.getElementById('resultado-quiz');
    const todosBotoes = document.querySelectorAll('.opcoes-quiz button');

    // Desativa todos os botões para o usuário não clicar de novo após responder
    todosBotoes.forEach(btn => btn.disabled = true);

    if (acertou) {
        botaoClicado.classList.add('correto');
        resultado.innerHTML = "🎉 Resposta Correta! A primeira Copa ocorreu em 1930, no Uruguai.";
        resultado.style.color = "#74c69d";
    } else {
        botaoClicado.classList.add('errado');
        resultado.innerHTML = "❌ Resposta Errada! Tente ler a seção 'A Expansão e Copas' na Linha do Tempo.";
        resultado.style.color = "#ff8585";
        
        // Destaca a alternativa correta mesmo se ele errou
        todosBotoes[1].classList.add('correto'); 
    }
}