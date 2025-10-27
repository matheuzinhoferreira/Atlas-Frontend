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

$(document).ready(function () {
    async function carregarExercicios() {
        const token = localStorage.getItem('jwt-token-atlas');
        try {
            const response = await fetch(`${window.apiBase.ip}/exercicios/0`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.error) {
                mostrarMensagem('Erro ao carregar exercícios: ' + (data.message || 'Erro desconhecido'), 'error');
                return;
            }

            exibirExercicios(data.exercicios);
        } catch (error) {
            console.error(error);
            mostrarMensagem('Erro ao comunicar com o servidor.', 'error');
        }
    }

    function exibirExercicios(exercicios) {
        const container = document.querySelector('.exer-grid');
        container.innerHTML = '';

        if (!exercicios || exercicios.length === 0) {
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

            // Botão editar - carregando detalhes completos ao clicar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn-editar');
            btnEditar.style.marginLeft = '10px';
            btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            btnEditar.addEventListener('click', async () => {
                const token = localStorage.getItem('jwt-token-atlas');
                try {
                    const response = await fetch(`${window.apiBase.ip}/exercicios/detalhes/${exercicio.ID_EXERCICIO}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (data.error) {
                        mostrarMensagem('Erro ao carregar detalhes do exercício: ' + (data.message || 'Erro desconhecido'), 'error');
                        return;
                    }
                    abrirEdicaoExercicio(data.exercicios[0].ID_EXERCICIO, data.exercicios[0]);
                } catch (error) {
                    console.error(error);
                    mostrarMensagem('Erro ao comunicar com o servidor.', 'error');
                }
            });

            const btnExcluir = document.createElement('button');
            btnExcluir.classList.add('btn-excluir');
            btnExcluir.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            btnExcluir.style.color = 'var(--cor-preta-bl)';
            btnExcluir.style.border = 'none';
            btnExcluir.style.cursor = 'pointer';
            btnExcluir.addEventListener('click', async () => {
                const idExercicio = card.getAttribute('data-id');
                const token = localStorage.getItem('jwt-token-atlas');
                if (!idExercicio) {
                    mostrarMensagem('ID do exercício inválido para exclusão.', 'error');
                    return;
                }
                try {
                    const response = await fetch(`${window.apiBase.ip}/exercicios/excluir/${idExercicio}`, {
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

    function abrirEdicaoExercicio(idExercicio, exercicio) {
        console.log('Objeto exercicio recebido:', exercicio);
        $('.atlas-bio-box, .atlas-alunos-box, .atlas-alunos-box2, .div-lista-exer, #div-lista-exer, #div-div-exercicios, #div-abrir-exercicios').hide();
        $('#div-editar-exercicios').show();

        $('#div-editar-exercicios #input-nome-exerc').val(exercicio.NOME_EXERCICIO);
        $('#div-editar-exercicios #input-descricao').val(exercicio.DESCRICAO);
        $('#div-editar-exercicios #input-video').val(exercicio.VIDEO || '');
        $('#div-editar-exercicios #input-dificuldade').val(exercicio.DIFICULDADE);

        $('#div-editar-exercicios #checkbox-grupos input[type="checkbox"]').prop('checked', false);
        if (exercicio.GRUPOS_MUSCULARES && Array.isArray(exercicio.GRUPOS_MUSCULARES)) {
            exercicio.GRUPOS_MUSCULARES.forEach(valor => {
                const valorStr = valor.toString();
                $(`#div-editar-exercicios #checkbox-grupos input[type="checkbox"][value="${valorStr}"]`).prop('checked', true);
            });
        }

        $('#form-exercicio2').data('id-exercicio', idExercicio);
    }

    $('#form-exercicio2')
        .off('submit')
        .on('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const idExercicio = $(this).data('id-exercicio');
            const token = localStorage.getItem('jwt-token-atlas');

            const nome = $('#div-editar-exercicios #input-nome-exerc').val().trim();
            const descricao = $('#div-editar-exercicios #input-descricao').val().trim();
            const video = $('#div-editar-exercicios #input-video').val().trim();
            const dificuldade = parseInt($('#div-editar-exercicios #input-dificuldade').val());
            console.log("Dificuldade capturada:", dificuldade);
            const gruposMusculares = $('#div-editar-exercicios #checkbox-grupos input[type="checkbox"]:checked')
                .map(function () { return parseInt($(this).val()); }).get();

            console.log("Campos enviados:", { nome, descricao, video, dificuldade, gruposMusculares });

            (async () => {
                try {
                    const response = await fetch(`${window.apiBase.ip}/exercicios/editar/${idExercicio}`, {
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
                            gruposMuscularesSelecionados: gruposMusculares
                        })
                    });

                    const data = await response.json();

                    if (response.ok && !data.error) {
                        mostrarMensagem(data.message || 'Exercício editado com sucesso!', 'success');
                        carregarExercicios();
                        $('#div-editar-exercicios').hide();
                        $('#div-exercicios').show();
                    } else {
                        mostrarMensagem(data.message || 'Erro ao editar exercício.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    mostrarMensagem('Erro ao comunicar com o servidor.', 'error');
                }
            })();

            return false;
        });

$(document).on('submit', '#form-exercicio1', async function(e) {
  e.preventDefault();

    const nome = $('#form-exercicio1 #input-nome-exerc').val().trim();
  console.log("Nome capturado:", nome);
    const descricao = $('#form-exercicio1 #input-descricao').val().trim();
  console.log("Descrição capturada:", descricao);
    const video = $('#form-exercicio1 #input-video').val().trim();
  console.log("Vídeo capturado:", video);
    const dificuldade = $('#form-exercicio1 #input-dificuldade').val()
  console.log("Dificuldade capturada:", dificuldade)
  ;

  const numGrupos = 14;
  const gruposMuscularesSelecionados = [];

  $('#checkbox-grupos input[type="checkbox"]:checked').each(function() {
  gruposMuscularesSelecionados.push(parseInt($(this).val()));
  console.log("Grupo muscular selecionado:", $(this).val());
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
      const resposta = await fetch(`${window.apiBase.ip}/exercicios/criar/`, {
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
    $('#form-exercicio1')[0].reset();
    carregarExercicios();
    $('#div-abrir-exercicios').hide();
    $('#div-exercicios').show();
  } catch (err) {
    mostrarMensagem('Erro na comunicação com o servidor.', 'error');
  }
});


    carregarExercicios();
});

