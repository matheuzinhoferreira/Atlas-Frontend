function mostrarMensagem(mensagem, tipo) {
    $('.mensagem-sistema').remove();

    const cor = tipo === 'success' ? '#28a745' :
        tipo === 'error' ? '#dc3545' : '#ffc107';

    const mensagemHTML = `
        <div class="mensagem-sistema" style="
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            background: ${cor};
        ">
            ${mensagem}
        </div>
    `;

    $('body').append(mensagemHTML);

    setTimeout(() => {
        $('.mensagem-sistema').fadeOut(() => {
            $('.mensagem-sistema').remove();
        });
    }, 4000);
}

$(document).on('submit', '#form-exercicio', async function(e) {
  e.preventDefault();

  const nome = $('#input-nome-exerc').val().trim();
  console.log("Nome capturado:", nome);
  const descricao = $('#input-descricao').val().trim();
  const video = $('#input-video').val().trim();
  const dificuldade = $('#input-dificuldade').val();

  const numGrupos = 14;
  const gruposMuscularesSelecionados = [];

  $('#checkbox-grupos input[type="checkbox"]:checked').each(function() {
  gruposMuscularesSelecionados.push(parseInt($(this).val()));
});

  const token = localStorage.getItem('jwt-token-atlas');

  const body = {
    nome,
    descricao,
    dificuldade,
    video: video || null,
    gruposMuscularesSelecionados
    };


  try {
    const resposta = await fetch('http://127.0.0.1:5000/exercicios/criar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const json = await resposta.json();

    if (!resposta.ok || json.error) {
      mostrarMensagem(json.message, 'error');
      return;
    }

    mostrarMensagem('Exercício criado com sucesso!', 'success');
    $('#form-exercicio')[0].reset();
  } catch (err) {
    mostrarMensagem('Erro na comunicação com o servidor.', 'error');
  }
});
