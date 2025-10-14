class GerenciadorCadastroPersonal {
    constructor() {
        this.baseURL = 'http://10.92.3.214:5000'; // ajuste conforme seu backend
        this.initEventListeners();
    }

    initEventListeners() {
        $(document).ready(() => {
            // Usar seletor exato do form
            $('#form-cadastrar-personal').on('submit', (e) => {
                e.preventDefault();
                this.cadastrarPersonal();
            });
            this.verificarAutenticacao();
        });
    }

    verificarAutenticacao() {
        const token = localStorage.getItem('jwt-token-atlas');
        const tipoUsuario = localStorage.getItem('tipo-usuario-atlas');
        if (!token || (tipoUsuario !== '2' && tipoUsuario !== '3')) {
            this.mostrarMensagem('Acesso restrito a gestores', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }
        return true;
    }

    cadastrarPersonal() {
        // Verifica autenticação antes
        if (!this.verificarAutenticacao()) return;

        const token = localStorage.getItem('jwt-token-atlas');
        if (!token) {
            this.mostrarMensagem('Você precisa estar logado', 'error');
            this.redirecionarLogin();
            return;
        }
        const dadosPersonal = this.coletarDadosFormulario();

        const validacao = this.validarDados(dadosPersonal);
        if (!validacao.valido) {
            this.mostrarMensagem(validacao.mensagem, 'error');
            return;
        }

        this.mostrarLoading(true);

        $.ajax({
            url: `${this.baseURL}/usuarios/cadastrar/personal`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(dadosPersonal),
            success: (response) => {
                console.log("Success:", response);
                this.mostrarLoading(false);
                this.mostrarMensagem('Personal cadastrado com sucesso!', 'success');
                this.limparFormulario();
            },
            error: (xhr) => {
                console.log("Erro:", xhr);
                this.mostrarLoading(false);
                this.tratarErroRequisicao(xhr);
            }
        });
    }

    coletarDadosFormulario() {
        let dataISO = $('#div-professores2 #input-data-nasc').val() || '';
        let dataSplit = dataISO ? dataISO.split('-') : ['', '', ''];
        let dataBR = dataSplit.length === 3 ? `${dataSplit[2]}/${dataSplit[1]}/${dataSplit[0]}` : '';

        return {
            nome: ($('#div-professores2 #input-nome').val() || '').trim(),
            data_nascimento: dataBR,
            cpf: ($('#div-professores2 #input-cpf').val() || '').replace(/[^0-9]/g, ''),
            telefone: ($('#div-professores2 #input-telefone').val() || '').replace(/[^0-9]/g, ''),
            formacao: ($('#div-professores2 #input-formacao').val() || '').trim(),
            cref: ($('#div-professores2 #input-cref').val() || '').trim(),
            email: ($('#div-professores2 #input-email').val() || '').toLowerCase().trim(),
            senha: $('#div-professores2 #input-senha').val() || ''
        };
        }


    validarDados(dados) {
    if (!dados.nome || !dados.data_nascimento || !dados.cpf ||
        !dados.telefone || !dados.formacao || !dados.cref ||
        !dados.email || !dados.senha) {
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
    // Limpa e padroniza CREF para conter apenas números e letras minúsculas
    let crefLimpo = dados.cref.replace(/[^a-z0-9]/gi, "").toLowerCase();

    if (!crefLimpo.match(/^\d+[a-z]+$/)) {
        return { valido: false, mensagem: 'CREF em formato inválido' };
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
        const botao = $('#form-cadastrar-personal button[type="submit"]');
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
        $('#form-cadastrar-personal')[0].reset();
    }

    redirecionarLogin() {
        window.location.href = 'login.html';
    }
}

// Inicializa a classe no carregamento da página
$(document).ready(() => {
    window.cadastroPersonalManager = new GerenciadorCadastroPersonal();
});
