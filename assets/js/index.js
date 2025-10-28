// Espera o DOM carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const botaoTema = document.getElementById('botao-tema');

    // Função para atualizar o ícone do botão conforme o tema atual
    function atualizarBotao() {
        if (body.classList.contains('claro')) {
            botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
            botaoTema.setAttribute('aria-label', 'Ativar tema escuro');
        } else {
            botaoTema.innerHTML = '<i class="fa-solid fa-moon"></i>';
            botaoTema.setAttribute('aria-label', 'Ativar tema claro');
        }
    }

    // Verifica o tema salvo no localStorage
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
        body.classList.add('claro');
    }

    // Atualiza o botão conforme o tema atual
    atualizarBotao();

    // Quando o botão é clicado → alterna o tema e salva no localStorage
    botaoTema.addEventListener('click', () => {
        body.classList.toggle('claro');

        if (body.classList.contains('claro')) {
            localStorage.setItem('tema', 'claro');
        } else {
            localStorage.setItem('tema', 'escuro');
        }

        atualizarBotao();
    });
});