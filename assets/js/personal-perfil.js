$(document).ready(function () {
  // Atualiza nome e email do usuário logado na sidebar
  const nomeCompleto = localStorage.getItem('nome-usuario-atlas') || '';
  const emailUsuario = localStorage.getItem('email-usuario-atlas') || '';
  const tipoUsuario = localStorage.getItem('tipo-usuario-atlas') || '';

  const primeiroNome = nomeCompleto.split(' ')[0] || '';

  let tipoTexto = '';
  switch (tipoUsuario) {
    case '1': tipoTexto = 'Aluno'; break;
    case '2': tipoTexto = 'Personal'; break;
    case '3': tipoTexto = 'Admin'; break;
    default: tipoTexto = '';
  }

  const nomeExibido = (tipoTexto ? tipoTexto + ' ' : '') + primeiroNome;

  $('.atlas-sidebar__profile-nome').text(nomeExibido);
  $('.atlas-sidebar__profile-email').text(emailUsuario);

  // Inicial do nome exibida no círculo do ícone sidebar
  const inicialNome = nomeCompleto.charAt(0).toUpperCase() || '';
  $('.user-icon-sidebar').text(inicialNome);

  // Handler principal dos cliques nos itens da nav que tem id
  $('.atlas-sidebar nav a.atlas-sidebar__nav-item').not('#nav-voltar').on('click', function (e) {
    e.preventDefault();

    // Remove ativo dos links
    $('.atlas-sidebar nav a.atlas-sidebar__nav-item').removeClass('ativo');
    // Aplica ativo no link clicado
    $(this).addClass('ativo');

    // Esconde todas as divs pai 'atlas-bio-box'
    $('.atlas-bio-box').hide();
    $('.atlas-alunos-box').hide();
    $('#div-info-usuario').hide();
    $('#div-lista-exer').hide();
    $('#div-edit-usuario').hide();


    // Mostra a div correspondente pelo id do link clicado
    let idLink = $(this).attr('id'); // exemplo: nav-alunos
    let idDiv = idLink.replace('nav-', 'div-'); // exemplo: div-alunos

    $('#' + idDiv).show();
  });

  // Link voltar navega para a index.html
  $('#nav-voltar').on('click', function () {
    window.location.href = 'index.html';
  });
});

$(document).on('click', '#btn-add-aluno', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-abrir-alunos').show();
});

$(document).on('click', '#btn-voltar-aluno', function () {
  // Esconde todas as divs de box e mostra a lista de alunos
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-alunos').show();
});

$(document).on('click', 'div.aluno-card', function () {
  // Esconde todas as divs de box e mostra a lista de alunos
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-info-usuario').show();
});

$(document).on('click', '#btn-gerenciar', function () {
  // Esconde todas as divs de box e mostra a lista de alunos
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').show();
});

$(document).on('click', '#btn-edit-usuario', function () {
  // Esconde todas as divs de box e mostra a lista de alunos
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').hide();
  $('#div-edit-usuarios').show();
});

$(document).on('click', '#btn-add-exer', function () {
  // Esconde todas as divs de box e mostra a lista de alunos
  console.log('Clicou em adicionar exercício');
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').hide();
  $('#div-div-exercicios').hide();
  $('#div-abrir-exercicios').show();
});

$(document).on('click', '#div-exercicios.btn-editar', function () {
  // Esconde todas as divs de box e mostra a lista de alunos
  console.log('clicou editar exer');
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').hide();
  $('#div-div-exercicios').hide();
  $('#div-editar-exercicios').show();
});



$(document).ready(function () {
  const API_BASE = window.apiBase.ip;
  const $alunosGrid = $(".alunos-grid");
  const $btnLeft = $(".btn-voltar-aluno").first();
  const $btnRight = $(".btn-voltar-aluno").last();

  let paginaAtual = 1;
  const maxPorPagina = 8;
  let tipoFiltro = 1; // Tipo 1 para alunos

  // Função para criar o card de usuário
  function montarCardUsuario(usuario) {
    let id = usuario[0] || "";
    let nome = usuario[1] || "";
    let email = usuario[2] || "";
    let telefone = usuario[4] || "";

    let historico = usuario[3]; // suponha que vem nessa posição
    if (typeof historico !== "string" || historico.trim() === "") {
      historico = "Nenhum";
    }


    return $(`
    <div class="aluno-card" onclick="trazerCampos(${id})" data-id="${id}">
      <div class="aluno-img">[Imagem]</div>
      <div class="aluno-info">
        <div>Nome: ${nome}</div>
        <div>E-mail: ${email}</div>
        <div>Telefone: ${telefone}</div>
        <div>CPF: ${historico}</div>
      </div>
    </div>
  `);
  }

  console.log(localStorage.getItem('jwt-token-atlas'));
  async function carregarPagina(pagina = 1, tipo = tipoFiltro, tipoLogado = 2) {
    paginaAtual = pagina;
    $alunosGrid.empty().append('<div class="loader">Carregando...</div>');

    const token = localStorage.getItem("jwt-token-atlas");

    try {
      const url = `${API_BASE}/usuarios/${tipoLogado}/${pagina}/${tipo}`;
      console.log('Chamando API:', url);
      console.log('Token:', token);

      const resposta = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!resposta.ok) {
        console.error('Erro na resposta:', resposta.status, resposta.statusText);
        throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText}`);
      }
      const data = await resposta.json();
      const usuarios = data.usuarios || [];

      $alunosGrid.empty();
      if (!usuarios.length) {
        $alunosGrid.append('<div class="nenhum">Nenhum usuário encontrado.</div>');
      } else {
        usuarios.forEach(u => {
          const $card = montarCardUsuario(u);
          $alunosGrid.append($card);
        });
      }
      atualizarBotoes(usuarios.length);
    } catch (err) {
      console.error('Erro no carregamento:', err);
      $alunosGrid.empty().append(`<div class="erro">Erro ao carregar usuários: ${err.message}</div>`);
    }
  }

  // Função para buscar dados completos do usuário pelo id
     async function buscarDadosUsuarioDetalhado(idUsuario, tipoLogado = 2) {
        const token = localStorage.getItem("jwt-token-atlas");
        const url = `${API_BASE}/usuarios/info/${idUsuario}/${tipoLogado}`;
        try {
            const resposta = await fetch(url, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!resposta.ok) {
                throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText}`);
            }
            const json = await resposta.json();
            if (json.error) {
                throw new Error("Erro ao buscar dados do usuário: " + json.message);
            }
            return json.dados;
        } catch (err) {
            console.error(err);
            mostrarMensagem('Erro ao carregar detalhes do usuário.', 'error');
            return null;
        }
    }
  // Evento clique no card
  $(document).on('click', '.aluno-card', async function () {
    const id = $(this).data('id');
    const dadosDetalhados = await buscarDadosUsuarioDetalhado(id);
    if (!dadosDetalhados) {
      alert("Não foi possível carreBgar detalhes do usuário.");
      return;
    }
    const $div = $('#div-info-usuario');

    // Preencher cada campo com o valor correto do JSON detalhado da API
    $div.find('.info-usuario-item:contains("Nome:") span').text(dadosDetalhados["Nome"] || "");
    $div.find('.info-usuario-item:contains("E-mail:") span').text(dadosDetalhados["E-mail"] || "");
    $div.find('.info-usuario-item:contains("Telefone:") span').text(dadosDetalhados["Telefone"] || "");
    $div.find('.info-usuario-item:contains("CPF:") span').text(dadosDetalhados["CPF"] || "");

    // Preencher TIPO (use sempre o campo com <span>)
    let tipoTexto = "";
    switch (dadosDetalhados["Tipo"] || dadosDetalhados["TIPO"] || dadosDetalhados["tipo"]) {
      case 1: case '1': tipoTexto = "Aluno"; break;
      case 2: case '2': tipoTexto = "Personal"; break;
      case 3: case '3': tipoTexto = "Admin"; break;
      default: tipoTexto = "Desconhecido";
    }
    $div.find('.info-usuario-item:contains("TIPO:") span').text(tipoTexto);

    // Campos médicos
    $div.find('.info-usuario-item:contains("Medicamentos:") span').text(dadosDetalhados["Descrição de medicamentos"] || "Nenhum");
    $div.find('.info-usuario-item:contains("Limitações:") span').text(dadosDetalhados["Descrição de limitações"] || "Nenhuma");
    $div.find('.info-usuario-item:contains("Objetivos:") span').text(dadosDetalhados["Descrição de Objetivos"] || "Nenhum");
    $div.find('.info-usuario-item:contains("Experiência anterior:") span').text(dadosDetalhados["Experiência Anterior com Academia"] || "Nenhuma");

    $div.show();
  });




  // Atualizar estado dos botões de navegação
  function atualizarBotoes(qtdNaPagina) {
    $btnLeft.prop("disabled", paginaAtual <= 1);
    $btnRight.prop("disabled", qtdNaPagina < maxPorPagina);
  }

  // Eventos dos botões de paginação
  $btnLeft.on("click", () => {
    if (paginaAtual > 1) {
      carregarPagina(paginaAtual - 1, tipoFiltro);
    }
  });

  $btnRight.on("click", () => {
    carregarPagina(paginaAtual + 1, tipoFiltro);
  });

  // Inicializa carregando a primeira página
  carregarPagina(1, tipoFiltro);
});

$(document).ready(function () {
  $('#searchAluno').on('input', function () {
    const termo = $(this).val().toLowerCase().trim();

    // Para cada card aluno dentro da grid
    $('.alunos-grid .aluno-card').each(function () {
      // Captura todo o texto do card (nome, email, telefone, histórico)
      const textoCard = $(this).text().toLowerCase();

      // Mostra se o termo pesquisa existir no card, esconde se não
      if (textoCard.indexOf(termo) !== -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
});
