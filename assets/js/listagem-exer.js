async function carregarExercicios() {
  const token = localStorage.getItem('jwt-token-atlas');
  try {
    const response = await fetch('http://127.0.0.1:5000/exercicios', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn-editar');
    btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    btnEditar.addEventListener('click', () => {
      const idExercicio = parseInt(card.getAttribute('data-id'));
      abrirEdicaoExercicio(idExercicio, exercicio);
    });

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(btnEditar);

    container.appendChild(card);
  });
}

// Chame a função para carregar os exercícios na inicialização da página/div
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
    btnEditar.innerHTML = '<i id="btn-edicao" class="fa-solid fa-pen-to-square"></i>';

    btnEditar.addEventListener('click', function() {
    const idExercicio = parseInt(card.getAttribute('data-id'));
    abrirEdicaoExercicio(idExercicio, exercicio); // <- Passa o ID e o objeto
});
    
    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(btnEditar);

    container.appendChild(card);
  });
}
