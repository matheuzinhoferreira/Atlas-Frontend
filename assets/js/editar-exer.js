function abrirEdicaoExercicio(idExercicio, exercicio) {
  // Esconder outras divs relevantes
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').hide();
  $('#div-div-exercicios').hide();
  $('#div-editar-exercicios').hide();

  // Mostrar div de edição com formulário preenchido
  $('#div-abrir-exercicios').show();

  // Preencher campos do formulário
  $('#input-nome-exerc').val(exercicio.NOME_EXERCICIO);
  $('#input-descricao').val(exercicio.DESCRICAO);
  $('#input-video').val(exercicio.VIDEO || '');

  // Preencher nível de dificuldade (ajuste se necessário para valores corretos)
  $('#input-dificuldade').val(exercicio.DIFICULDADE);

  // Limpar todos os checkboxes dos grupos musculares
  $('#checkbox-grupos input[type="checkbox"]').prop('checked', false);
  if (exercicio.GRUPOS_MUSCULARES && Array.isArray(exercicio.GRUPOS_MUSCULARES)) {
    exercicio.GRUPOS_MUSCULARES.forEach(valor => {
      $(`#checkbox-grupos input[type="checkbox"][value="${valor}"]`).prop('checked', true);
    });
  }


  // Armazenar o ID no formulário para usar na edição (se desejar)
  $('#form-exercicio').data('id-exercicio', idExercicio);
}

$('#form-exercicio').on('submit', async function(event) {
  event.preventDefault();

  const idExercicio = $(this).data('id-exercicio');
  const token = localStorage.getItem('jwt-token-atlas');

  // Coletar os valores do formulário
  const nome = $('#input-nome-exerc').val().trim();
  const descricao = $('#input-descricao').val().trim();
  const video = $('#input-video').val().trim();
  const dificuldade = $('#input-dificuldade').val();

  // Grupos musculares selecionados
  const gruposMusculares = $('#checkbox-grupos input[type="checkbox"]:checked')
    .map(function() { return $(this).val(); }).get();

  try {
    const response = await fetch(`http://10.92.3.214:5000/exercicios/editar/${idExercicio}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome,
        descricao,
        video,
        dificuldade,
        gruposMusculares // se sua API aceitar este campo; senão pode remover
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Exercício editado com sucesso!');
      // Atualize a listagem de exercícios ou recarregue
      carregarExercicios();
      // Esconder formulário de edição após sucesso
      $('#div-abrir-exercicios').hide();
    } else {
      alert('Erro ao editar exercício: ' + (data.message || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error(error);
    alert('Erro ao comunicar com o servidor.');
  }
});
