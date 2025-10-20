$('#form-exercicio').on('submit', async function(event) {
  event.preventDefault();

  const idExercicio = $(this).data('id-exercicio');
  const token = localStorage.getItem('jwt-token-atlas');

  // Coletar os valores do formulário
  const nome = $('#input-nome-exerc').val().trim();
  const descricao = $('#input-descricao').val().trim();
  const video = $('#input-video').val().trim();
  const dificuldade = parseInt($('#input-dificuldade').val()); // converter para número

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
        gruposMuscularesSelecionados: gruposMusculares  // nome ajustado aqui para a API
      })
    });

    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }

    if (response.ok) {
      alert(data.message || 'Exercício editado com sucesso!');
      carregarExercicios();
      $('#div-abrir-exercicios').hide();
    } else {
      alert('Erro ao editar exercício: ' + (data.message || response.statusText));
    }
  } catch (error) {
    console.error(error);
    alert('Erro ao comunicar com o servidor.');
  }
});
