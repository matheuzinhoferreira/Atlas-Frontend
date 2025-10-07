// Carregar e exibir exercícios da API
async function carregarExercicios() {
  const token = localStorage.getItem('jwt-token-atlas');
  try {
    const response = await fetch('http://127.0.0.1:5000/exercicios', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();

    if (data.error) {
      alert('Erro ao carregar exercícios: ' + (data.message || 'Erro desconhecido'));
      return;
    }

    exibirExercicios(data.exercicios);

  } catch (error) {
    alert('Erro ao comunicar com o servidor.');
    console.error(error);
  }
}

// Exibe os exercícios e cria botões editar e excluir
function exibirExercicios(exercicios) {
  const container = document.querySelector('.exer-grid');
  container.innerHTML = '';

  if (exercicios.length === 0) {
    container.innerHTML = '<p>Nenhum exercício encontrado.</p>';
    return;
  }

  exercicios.forEach(exercicio => {
    const card = document.createElement('div');
    card.classList.add('exer-card');
    card.setAttribute('data-id', exercicio.ID_EXERCICIO);

    const img = document.createElement('div');
    img.classList.add('exer-img');
    img.textContent = '[Imagem]';

    const info = document.createElement('div');
    info.classList.add('exer-info');

    const nome = document.createElement('div');
    nome.textContent = `Exercício: ${exercicio.NOME_EXERCICIO}`;

    const descricao = document.createElement('div');
    descricao.textContent = `Descrição: ${exercicio.DESCRICAO}`;

    const dificuldade = document.createElement('div');
    dificuldade.textContent = `Dificuldade: ${exercicio.DIFICULDADE}`;

    const video = document.createElement('div');
    if (exercicio.VIDEO) {
      const link = document.createElement('a');
      link.href = exercicio.VIDEO;
      link.target = '_blank';
      link.textContent = exercicio.VIDEO;
      video.appendChild(document.createTextNode('Vídeo: '));
      video.appendChild(link);
    } else {
      video.textContent = 'Vídeo: -';
    }

    info.appendChild(nome);
    info.appendChild(descricao);
    info.appendChild(dificuldade);
    info.appendChild(video);

    // Botão editar
    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn-editar');
    btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    btnEditar.addEventListener('click', () => {
      abrirEdicaoExercicio(exercicio.ID_EXERCICIO, exercicio);
    });

    // Botão excluir
    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btn-excluir');
    btnExcluir.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnExcluir.style.color = 'var(--cor-vermelha-bl)';
    btnExcluir.style.border = 'none';
    btnExcluir.style.background = 'transparent';
    btnExcluir.style.cursor = 'pointer';

    btnExcluir.addEventListener('click', async () => {
      const token = localStorage.getItem('jwt-token-atlas');
      try {
        const response = await fetch(`http://127.0.0.1:5000/exercicios/excluir/${exercicio.ID_EXERCICIO}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok && !data.error) {
          mostrarMensagem(data.message || 'Exercício excluído com sucesso!', 'success');
          carregarExercicios();
        } else {
          mostrarMensagem(data.message || 'Erro ao excluir exercício.', 'error');
        }
      } catch (error) {
        console.error(error);
        mostrarMensagem('Erro ao comunicar com o servidor.', 'error');
      }
    });

    btnExcluir.addEventListener('click', async (event) => {
  // event.currentTarget é o botão clicado
  const btn = event.currentTarget;
  // Encontra o card-pai mais próximo desse botão
  const card = btn.closest('.exer-card');
  // Pega o ID do exercício no atributo data-id do card
  const idExercicio = card ? card.getAttribute('data-id') : null;
  
  if (!idExercicio) {
    mostrarMensagem('ID do exercício inválido para exclusão.', 'error');
    return;
  }

  const token = localStorage.getItem('jwt-token-atlas');

  try {
    const response = await fetch(`http://127.0.0.1:5000/exercicios/excluir/${idExercicio}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok && !data.error) {
      mostrarMensagem(data.message || 'Exercício excluído com sucesso!', 'success');
      carregarExercicios();
    } else {
      mostrarMensagem(data.message || 'Erro ao excluir exercício.', 'error');
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao comunicar com o servidor.', 'error');
  }
});


    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '5px';
    btnContainer.appendChild(btnEditar);
    btnContainer.appendChild(btnExcluir);

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(btnContainer);

    container.appendChild(card);
  });
}

// Abre o formulário para edição e preenche com dados do exercício
function abrirEdicaoExercicio(idExercicio, exercicio) {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').hide();
  $('#div-div-exercicios').hide();
  $('#div-editar-exercicios').hide();

  $('#div-abrir-exercicios').show();

  $('#input-nome-exerc').val(exercicio.NOME_EXERCICIO);
  $('#input-descricao').val(exercicio.DESCRICAO);
  $('#input-video').val(exercicio.VIDEO || '');
  $('#input-dificuldade').val(exercicio.DIFICULDADE);

  $('#checkbox-grupos input[type="checkbox"]').prop('checked', false);
  if (exercicio.GRUPOS_MUSCULARES && Array.isArray(exercicio.GRUPOS_MUSCULARES)) {
    exercicio.GRUPOS_MUSCULARES.forEach(valor => {
      $(`#checkbox-grupos input[type="checkbox"][value="${valor}"]`).prop('checked', true);
    });
  }

  $('#form-exercicio').data('id-exercicio', idExercicio);
}

// Evento de submit no formulário de edição para salvar as alterações via PUT
$('#form-exercicio').on('submit', async function(event) {
  event.preventDefault();
  const idExercicio = $(this).data('id-exercicio');
  const token = localStorage.getItem('jwt-token-atlas');

  const nome = $('#input-nome-exerc').val().trim();
  const descricao = $('#input-descricao').val().trim();
  const video = $('#input-video').val().trim();
  const dificuldade = $('#input-dificuldade').val();

  const gruposMusculares = $('#checkbox-grupos input[type="checkbox"]:checked')
    .map(function() { return $(this).val(); }).get();

  try {
    const response = await fetch(`http://127.0.0.1:5000/exercicios/editar/${idExercicio}`, {
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
        gruposMusculares  // incluir se a API aceitar
      })
    });

    const data = await response.json();

    if (response.ok && !data.error) {
      mostrarMensagem(data.message || 'Exercício editado com sucesso', 'success');
      carregarExercicios();
      $('#div-abrir-exercicios').hide();
    } else {
      mostrarMensagem(data.message || 'Erro ao editar exercício.', 'error');
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao comunicar com o servidor.', 'error');
  }
});

// Inicializa lista
carregarExercicios();




function exibirExercicios(exercicios) {
  const container = document.querySelector('.exer-grid');
  container.innerHTML = '';

  if (exercicios.length === 0) {
    container.innerHTML = '<p>Nenhum exercício encontrado.</p>';
    return;
  }

  exercicios.forEach(exercicio => {
    const card = document.createElement('div');
    card.classList.add('exer-card');

    const img = document.createElement('div');
    img.classList.add('exer-img');
    img.textContent = '[Imagem]'; // Coloque aqui uma imagem real se tiver url

    const info = document.createElement('div');
    info.classList.add('exer-info');

    const nome = document.createElement('div');
    nome.textContent = `Exercício: ${exercicio.NOME_EXERCICIO}`;

    const descricao = document.createElement('div');
    descricao.textContent = `Descrição: ${exercicio.DESCRICAO}`;

    const dificuldade = document.createElement('div');
    dificuldade.textContent = `Dificuldade: ${exercicio.DIFICULDADE}`;

    const video = document.createElement('div');
    if (exercicio.VIDEO) {
      const link = document.createElement('a');
      link.href = exercicio.VIDEO;
      link.target = '_blank';
      link.textContent = exercicio.VIDEO;
      video.appendChild(document.createTextNode('Vídeo: '));
      video.appendChild(link);
    } else {
      video.textContent = 'Vídeo: -';
    }

    info.appendChild(nome);
    info.appendChild(descricao);
    info.appendChild(dificuldade);
    info.appendChild(video);

    // Botão editar
    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn-editar');
    btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    // Botão de excluir
    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btn-excluir');
    btnExcluir.innerHTML = '<i id="btn-editar" class="fa-solid fa-xmark"></i>';
    btnExcluir.addEventListener('click', async () => {
    const idExercicio = card.getAttribute('data-id');
    const token = localStorage.getItem('jwt-token-atlas');

    try {
      const response = await fetch(`http://127.0.0.1:5000/exercicios/excluir/${idExercicio}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        mostrarMensagem(data.message || 'Exercício excluído com sucesso!', 'success');
        carregarExercicios();
      } else {
        mostrarMensagem(data.message || 'Erro ao excluir exercício.', 'error');
      }
    } catch (error) {
      console.error(error);
      mostrarMensagem('Erro ao comunicar com o servidor.', 'error');
    }
  });


    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '5px'; // espaço entre os  
    btnContainer.style.marginLeft = '20px'; // espaço entre os       // botões
    btnContainer.appendChild(btnEditar);
    btnContainer.appendChild(btnExcluir);

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(btnContainer);

    container.appendChild(card);

  });
}
