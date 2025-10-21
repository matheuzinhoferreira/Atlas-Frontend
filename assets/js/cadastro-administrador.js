class GerenciadorCadastroAdmin {
  constructor() {
    this.baseURL = window.apiBase.ip; // ajuste conforme seu backend
    this.initEventListeners();
  }

  initEventListeners() {
    $(document).ready(() => {
      $('#div-administradores2 form').on('submit', (e) => {
        e.preventDefault();
        this.cadastrarAdmin();
      });
      this.verificarAutenticacao();
    });
  }

  verificarAutenticacao() {
    const token = localStorage.getItem('jwt-token-atlas');
    const tipoUsuario = localStorage.getItem('tipo-usuario-atlas');
    if (!token || tipoUsuario !== '3') {
      this.mostrarMensagem('Acesso restrito a administradores', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return false;
    }
    return true;
  }

  cadastrarAdmin() {
    if (!this.verificarAutenticacao()) return;

    const token = localStorage.getItem('jwt-token-atlas');
    if (!token) {
      this.mostrarMensagem('Você precisa estar logado', 'error');
      this.redirecionarLogin();
      return;
    }

    const dadosAdmin = this.coletarDadosFormulario();

    const validacao = this.validarDados(dadosAdmin);
    if (!validacao.valido) {
      this.mostrarMensagem(validacao.mensagem, 'error');
      return;
    }

    this.mostrarLoading(true);

    $.ajax({
      url: `${this.baseURL}/usuarios/cadastrar/3`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(dadosAdmin),
      success: (response) => {
        this.mostrarLoading(false);
        this.mostrarMensagem('Administrador cadastrado com sucesso!', 'success');
        this.limparFormulario();
      },
      error: (xhr) => {
        this.mostrarLoading(false);
        this.tratarErroRequisicao(xhr);
      }
    });
  }

  coletarDadosFormulario() {
    let dataISO = $('#div-administradores2 #input-data').val() || '';
    let dataSplit = dataISO ? dataISO.split('-') : ['', '', ''];
    let dataBR = dataSplit.length === 3 ? `${dataSplit[2]}/${dataSplit[1]}/${dataSplit[0]}` : '';

    return {
      nome: ($('#div-administradores2 #input-nome').val() || '').trim(),
      data_nascimento: dataBR,
      cpf: ($('#div-administradores2 #input-cpf').val() || '').replace(/[^0-9]/g, ''),
      telefone: ($('#div-administradores2 #input-telefone').val() || '').replace(/[^0-9]/g, ''),
      email: ($('#div-administradores2 #input-email').val() || '').toLowerCase().trim(),
      senha: $('#div-administradores2 #input-senha').val() || ''
    };
  }

  validarDados(dados) {
    if (!dados.nome || !dados.data_nascimento || !dados.cpf ||
      !dados.telefone || !dados.email || !dados.senha) {
      return { valido: false, mensagem: 'Preencha todos os campos obrigatórios' };
    }
    if (dados.cpf.length !== 11) {
      return { valido: false, mensagem: 'CPF deve ter 11 dígitos' };
    }
    if (dados.telefone.length !== 13) {
      return { valido: false, mensagem: 'Telefone deve ter 13 dígitos (ex: 5518123451234)' };
    }
    if (!this.validarEmail(dados.email)) {
      return { valido: false, mensagem: 'Email inválido' };
    }
    const senhaValidacao = this.validarSenha(dados.senha);
    if (!senhaValidacao.valido) {
      return { valido: false, mensagem: senhaValidacao.mensagem };
    }
    return { valido: true };
  }

  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validarSenha(senha) {
    if (senha.length < 8) {
      return {
        valido: false,
        mensagem: 'Senha deve ter pelo menos 8 caracteres, uma maiúscula, minúscula, número e símbolo'
      };
    }
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>-]/.test(senha);
    if (!temMaiuscula || !temMinuscula || !temNumero || !temEspecial) {
      return {
        valido: false,
        mensagem: 'Senha deve conter maiúscula, minúscula, número e símbolo especial'
      };
    }
    return { valido: true };
  }

  mostrarLoading(estado) {
    const botao = $('#div-administradores2 button[type="submit"]');
    if (estado) {
      botao.prop('disabled', true).text('Cadastrando...');
    } else {
      botao.prop('disabled', false).text('Criar Registro');
    }
  }

  mostrarMensagem(mensagem, tipo) {
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
    </div>`;

    $('body').append(mensagemHTML);

    setTimeout(() => {
      $('.mensagem-sistema').fadeOut(() => {
        $('.mensagem-sistema').remove();
      });
    }, 4000);
  }

  tratarErroRequisicao(xhr) {
    let mensagem = 'Erro interno do servidor';
    if (xhr.responseJSON && xhr.responseJSON.message) {
      mensagem = xhr.responseJSON.message;
    } else if (xhr.status === 401) {
      this.tratarTokenExpirado();
      return;
    }
    this.mostrarMensagem(mensagem, 'error');
  }

  tratarTokenExpirado() {
    localStorage.removeItem('jwt-token-atlas');
    localStorage.removeItem('nome-usuario-atlas');
    localStorage.removeItem('tipo-usuario-atlas');
    localStorage.removeItem('email-usuario-atlas');
    this.mostrarMensagem('Sessão expirada. Faça login novamente', 'warning');
    setTimeout(() => {
      this.redirecionarLogin();
    }, 2000);
  }

  limparFormulario() {
    $('#div-administradores2 form')[0].reset();
  }

  redirecionarLogin() {
    window.location.href = 'login.html';
  }
}

// Inicializa o gerenciador de cadastro de administradores
$(document).ready(() => {
  window.cadastroAdminManager = new GerenciadorCadastroAdmin();
});
