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

    // Escondendo todas as divs pai 'atlas-bio-box'
    $('.atlas-bio-box').hide();
    $('.atlas-alunos-box').hide();
    $('#div-info-alunos').hide();
    $('#div-lista-exer').hide();
    $('#div-edit-usuario').hide();
    $('#div-professores').hide();


    // Mostrando a div correspondente pelo id do link clicado
    let idLink = $(this).attr('id');
    let idDiv = idLink.replace('nav-', 'div-');

    $('#' + idDiv).show();
  });

  $('#nav-voltar').on('click', function () {
    window.location.href = 'index.html';
  });
});

$(document).on('click', '#nav-minhaconta', function () {
  $('.atlas-alunos1-box').hide();
  $('.atlas-prof-box').hide()
  $('.atlas-admin-box').hide();
  $('#div-minhaconta').show();
});

// $(document).on('click', '#div-alunos', function () {
//   $('#div-info-usuario').show();
//   $('.atlas-alunos1-box').hide();
// });

$(document).on('click', '#nav-relatorios', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-abrir-alunos').hide();
  $('#div-alunos').hide();
  $('#div-administradores').hide();
  $('#div-professores').hide();
});

$(document).on('click', '#nav-punicoes', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-abrir-alunos').hide();
  $('#div-alunos').hide();
  $('#div-administradores').hide();
  $('#div-professores').hide();
});

$(document).on('click', '#nav-professores', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-abrir-alunos').hide();
  $('#div-alunos').hide();
  $('#div-administradores').hide();
  $('#div-professores').show();
});

$(document).on('click', '#nav-administradores', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-abrir-alunos').hide();
  $('#div-alunos').hide();
  $('#div-administradores').show();
  $('#div-professores').hide();
});

$(document).on('click', '#nav-alunos', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.div-lista-professores').hide();
  $('#div-professores').hide();
  $('#div-administradores').hide();
  $('.div-alunos').show();
});

$(document).on('click', '#btn-voltar-professor', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-alunos').show();
});

$(document).on('click', 'div.aluno-card', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-info-alunos').show();
});

$(document).on('click', '.aluno-card', function () {
  $('.atlas-bio-box').hide();
  $('#div-edit-usuarios').show();
  $('.atlas-alunos-box2').hide();
  $('#div-alunos').hide();
});

$(document).on('click', '#btn-gerenciar', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-professores-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').show();
});

$(document).on('click', '#btn-edit-alunos', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.atlas-professores-box2').hide();
  $('.div-lista-professores').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').hide();
  $('#div-info-prof').hide();
  $('#div-edit-usuarios').show();
});

$(document).on('click', '#btn-add-exer', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-professores-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').hide();
  $('#div-div-exercicios').hide();
  $('#div-abrir-exercicios').show();
});

$(document).on('click', '#btn-add-professor', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-prof-box').hide();
  $('#div-professores2').show();
});

$(document).on('click', '#btn-add-administrador', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-prof-box').hide();
  $('#div-administradores').hide();
  $('#div-administradores2').show();
});

$(document).on('click', '#btn-add-aluno', function () {
  $('.atlas-bio-box').hide();
  $('.atlas-prof-box').hide();
  $('#div-administradores').hide();
  $('#div-alunos').hide();
  $('#div-abrir-alunos').show();

});

$(document).on('click', '#btn-voltar-alunos', function () {
  $('#div-edit-usuarios').hide()
  $('#div-alunos').show();
});

// ALUNO
$(document).ready(function () {
  const API_BASE = "http://10.92.3.214:5000";
  const API_BASE = "http://10.92.3.160:5000";
  const $btnLeft = $(".btn-voltar-alunos").first();
  const $btnRight = $(".btn-voltar-alunos").last();

  let paginaAtual = 1;
  const maxPorPagina = 8;
  let tipoFiltro = 1; // alunos

  // Criando o card de usuário
  function montarCardUsuario(usuario) {
    let id = usuario[0] || "";
    let nome = usuario[1] || "";
    let email = usuario[2] || "";
    let telefone = usuario[4] || "";

    let historico = usuario[3];
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
  async function carregarPagina(pagina = 1, tipo = tipoFiltro, tipoLogado = 3) {
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
  async function buscarDadosUsuarioDetalhado(idUsuario) {
    const token = localStorage.getItem("jwt-token-atlas");
    const url = `http://10.92.3.214:5000/usuarios/info/${idUsuario}/3`;
    try {
      const resposta = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!resposta.ok) {
        throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText}`);
      }
      const json = await resposta.json();
      if (json.error) {
        throw new Error("Erro ao buscar dados do usuário");
      }
      return json.dados;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // Evento clique no card
  $(document).on('click', '.aluno-card', async function () {
    const id = $(this).data('id');
    const dadosDetalhados = await buscarDadosUsuarioDetalhado(id);
    if (!dadosDetalhados) {
      alert("Não foi possível carregar detalhes do usuário.");
      return;
    }
    const $div = $('#div-info-alunos');

    $div.find('.info-usuario-item:contains("Nome:") span').text(dadosDetalhados["Nome"] || "");
    $div.find('.info-usuario-item:contains("E-mail:") span').text(dadosDetalhados["E-mail"] || "");
    $div.find('.info-usuario-item:contains("Telefone:") span').text(dadosDetalhados["Telefone"] || "");
    $div.find('.info-usuario-item:contains("CPF:") span').text(dadosDetalhados["CPF"] || "");

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
;
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

$(document).ready(function () {
  $(document).on('click', '.aluno-card', function () {
    const $card = $(this);
    const id = $card.data('id');

    const nome = $card.find('.aluno-info div').eq(0).text().replace('Nome: ', '');
    const email = $card.find('.aluno-info div').eq(1).text().replace('E-mail: ', '');
    const telefone = $card.find('.aluno-info div').eq(2).text().replace('Telefone: ', '');
    const historico = $card.find('.aluno-info div').eq(3).text().replace('Histórico: ', '');

    let usuarioDetalhe = {
      email: email,
      tipo: 1, //
      telefone: telefone,
      descricao_medicamentos: '', // se vazio, exibe "Nenhum"
      descricao_limitacoes: '',   // se vazio, exibe "Nenhuma"
      descricao_objetivos: '',    // se vazio, exibe ""
      descricao_treinamentos_anteriores: '' // se vazio, exibe "Nenhuma"
    }

    const $div = $('#div-info-alunos');

    $div.find('.info-usuario-img').text('[Imagem]');
    $div.find('.info-usuario-item:contains("E-mail:") span').text(usuarioDetalhe.email);
    $div.find('.info-usuario-item:contains("[TIPO]")').text(
      usuarioDetalhe.tipo == 1 ? 'Aluno' :
        usuarioDetalhe.tipo == 2 ? 'Personal' :
          usuarioDetalhe.tipo == 3 ? 'Admin' :
            ''
    );
    $div.find('.info-usuario-item:contains("Telefone:") span').text(usuarioDetalhe.telefone);

    $div.find('.info-usuario-item:contains("CPF:") span').text(dadosDetalhados["CPF"] || "");


    // Para Medicamentos
    let medicamentos = usuarioDetalhe.descricao_medicamentos.trim();
    if (medicamentos === '') medicamentos = 'Nenhum';

    // Para Limitações
    let limitacoes = usuarioDetalhe.descricao_limitacoes.trim();
    if (limitacoes === '') limitacoes = 'Nenhuma';

    // Para Objetivos
    let objetivos = usuarioDetalhe.descricao_objetivos.trim();
    if (objetivos === '') objetivos = 'Nenhum';

    // Para Experiência anterior
    let experiencia = usuarioDetalhe.descricao_treinamentos_anteriores.trim();
    if (experiencia === '') experiencia = 'Nenhuma';

    $div.find('.info-usuario-item:contains("Medicamentos:") span').text(medicamentos);
    $div.find('.info-usuario-item:contains("Limitações:") span').text(limitacoes);
    $div.find('.info-usuario-item:contains("Objetivos:") span').text(objetivos);
    $div.find('.info-usuario-item:contains("Experiência anterior:") span').text(experiencia);

    $div.show();
  });
});