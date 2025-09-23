$(document).ready(function() {
  // Handler principal dos cliques nos itens da nav que tem id
  $('.atlas-sidebar nav a.atlas-sidebar__nav-item').not('#nav-voltar').on('click', function(e) {
    e.preventDefault();

    // Remove ativo dos links
    $('.atlas-sidebar nav a.atlas-sidebar__nav-item').removeClass('ativo');
    // Aplica ativo no link clicado
    $(this).addClass('ativo');

    // Esconde todas as divs pai 'atlas-bio-box'
    $('.atlas-bio-box').hide();

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

