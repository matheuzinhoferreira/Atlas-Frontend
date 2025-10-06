$(document).ready(function() {
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
  $('.atlas-sidebar nav a.atlas-sidebar__nav-item').not('#nav-voltar').on('click', function(e) {
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
      

    // Mostra a div correspondente pelo id do link clicado
    let idLink = $(this).attr('id'); // exemplo: nav-alunos
    let idDiv = idLink.replace('nav-', 'div-'); // exemplo: div-alunos

    $('#' + idDiv).show();
  });

  // Link voltar navega para a index.html
  $('#nav-voltar').on('click', function() {
    window.location.href = 'index.html';
  });
});

 $(document).on('click', '#btn-add-aluno', function() {
    $('.atlas-bio-box').hide();
    $('.atlas-alunos-box').hide();
    $('#div-abrir-alunos').show();
  });

$(document).on('click', '#btn-voltar-aluno', function() {
  // Esconde todas as divs de box e mostra a lista de alunos
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-alunos').show();
});  

$(document).on('click', 'div.aluno-card', function() {
  // Esconde todas as divs de box e mostra a lista de alunos
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('#div-info-usuario').show();
});  

$(document).on('click', '#btn-gerenciar', function() {
  // Esconde todas as divs de box e mostra a lista de alunos
  $('.atlas-bio-box').hide();
  $('.atlas-alunos-box').hide();
  $('.atlas-alunos-box2').hide();
  $('.div-lista-exer').hide();
  $('#div-lista-exer').show();
});  