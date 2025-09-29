$(document).ready(() => {
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

  // Definir as fitas (abas) dinamicamente para o administrador
  const fitas = [
    { id: 'minhaconta', texto: 'Minha conta', icon: 'fa-user' },
    { id: 'alunos', texto: 'Alunos', icon: 'fa-graduation-cap' },
    { id: 'professores', texto: 'Professores', icon: 'fa-chalkboard-teacher' },
    { id: 'administradores', texto: 'Administradores', icon: 'fa-user-shield' },
    { id: 'relatorios', texto: 'Relatórios', icon: 'fa-chart-line' },
    { id: 'punicoes', texto: 'Punições', icon: 'fa-ban' }
  ];

  const navContainer = $('.atlas-sidebar nav');
  const mainContainer = $('.atlas-main');

  // Limpar conteúdo atual da nav e main
  navContainer.empty();
  mainContainer.empty();

  // Criar link "Voltar"
  navContainer.append(`
    <a href="index.html" class="atlas-sidebar__nav-item" id="nav-voltar">
      <i class="fa-solid fa-circle-chevron-left"></i> Voltar
    </a>
  `);

  // Criar links das fitas
  fitas.forEach((fita, index) => {
    navContainer.append(`
      <a href="#" class="atlas-sidebar__nav-item${index === 0 ? ' ativo' : ''}" id="nav-${fita.id}">
        <i class="fa-solid ${fita.icon}"></i> ${fita.texto}
      </a>
    `);

    // Criar div de conteúdo para cada fita
    mainContainer.append(`
      <div id="div-${fita.id}" class="atlas-bio-box" style="display: ${index === 0 ? 'block' : 'none'};">
        <h2>${fita.texto}</h2>
        <p>Conteúdo para ${fita.texto} aqui.</p>
      </div>
    `);
  });

  // Handler principal dos cliques nas fitas (abas)
  navContainer.find('a.atlas-sidebar__nav-item').not('#nav-voltar').on('click', function(e) {
    e.preventDefault();

    // Remove ativo dos links
    navContainer.find('a.atlas-sidebar__nav-item').removeClass('ativo');
    // Aplica ativo no link clicado
    $(this).addClass('ativo');

    // Esconde todas as divs de conteúdo
    mainContainer.find('.atlas-bio-box').hide();

    // Mostra div correspondente
    const idLink = $(this).attr('id'); // ex: nav-alunos
    const idDiv = idLink.replace('nav-', 'div-'); // ex: div-alunos
    $('#' + idDiv).show();
  });

  // Voltar à página inicial
  $('#nav-voltar').on('click', () => {
    window.location.href = 'index.html';
  });
});
