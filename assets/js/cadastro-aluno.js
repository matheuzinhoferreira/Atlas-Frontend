$(document).ready(function () {

    // Botão de olho para mostrar/ocultar senha
    if ($('#toggle-senha').length === 0) {
        $('#input-senha').wrap('<div style="position:relative"></div>');
        $('#input-senha').after(`
      <span id="toggle-senha" style="
        position:absolute;right:15px;top:50%;
        transform:translateY(-50%);
        cursor:pointer;">
        <i class="fa fa-eye" style="color:#aaa"></i>
      </span>
    `);
        $('#toggle-senha').on('click', function () {
            let input = $('#input-senha');
            let icon = $(this).find('i');
            if (input.attr('type') === 'password') {
                input.attr('type', 'text'); icon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                input.attr('type', 'password'); icon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });
    }

    // Limitar data nascimento de 1900-01-01 até hoje
    let hoje = new Date().toISOString().split('T')[0];
    $('#input-data-nasc').attr('min', '1900-01-01').attr('max', hoje);
});

// Sistema de cadastro integrado com JWT
class GerenciadorCadastroAluno {
    constructor() {
        this.baseURL = window.apiBase.ip;
        this.initEventListeners();
    }

    initEventListeners() {
        $(document).ready(() => {
            // Event listener para cadastro de alunos
            $('#div-abrir-alunos form').on('submit', (e) => {
                e.preventDefault();
                this.cadastrarAluno();
            });

            this.verificarAutenticacao();
        });
    }

    // Verificar autenticação - VERSÃO CORRETA
    verificarAutenticacao() {
        const token = localStorage.getItem('jwt-token-atlas');
        const tipoUsuario = localStorage.getItem('tipo-usuario-atlas');

        if (!token || (tipoUsuario !== '2' && tipoUsuario !== '3')) {
            this.mostrarMensagem('Acesso restrito a Personal Trainers e Administradores', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
    }

    // Cadastrar aluno - VERSÃO CORRETA
    cadastrarAluno() {
        const token = localStorage.getItem('jwt-token-atlas');
        if (!token) {
            this.mostrarMensagem('Você precisa estar logado', 'error');
            this.redirecionarLogin();
            return;
        }

        const dadosAluno = this.coletarDadosFormulario();
        const validacao = this.validarDados(dadosAluno);

        if (!validacao.valido) {
            this.mostrarMensagem(validacao.mensagem, 'error');
            return;
        }

        this.mostrarLoading(true);

        $.ajax({
            url: `${this.baseURL}/usuarios/cadastrar/0`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(dadosAluno),
            success: (response) => {
                this.mostrarLoading(false);
                this.mostrarMensagem('Aluno cadastrado com sucesso!', 'success');
                this.limparFormulario();
            },
            error: (xhr) => {
                this.mostrarLoading(false);
                this.tratarErroRequisicao(xhr);
            }
        });
    }


    coletarDadosFormulario() {
        // Converte data de nascimento ISO para dd/mm/yyyy
        let dataISO = $('#div-abrir-alunos #input-data').val();
        let dataSplit = dataISO ? dataISO.split('-') : ['', '', ''];
        let dataBR = dataSplit.length === 3 ? `${dataSplit[2]}/${dataSplit[1]}/${dataSplit[0]}` : '';

        return {
            nome: $('#div-abrir-alunos #input-nome').val().trim(),
            data_nascimento: dataBR,
            cpf: $('#div-abrir-alunos #input-cpf').val().replace(/[^0-9]/g, ''),
            telefone: $('#div-abrir-alunos #input-telefone').val().replace(/[^0-9]/g, ''),
            email: $('#div-abrir-alunos #input-email').val().toLowerCase().trim(),
            senha: $('#div-abrir-alunos #input-senha').val(),
            historico_medico_relevante: $('#div-abrir-alunos #input-histmed').val().trim() || null,
            descricao_medicamentos: $('#div-abrir-alunos #input-medicamentos').val().trim() || null,
            descricao_treinamentos_anteriores: $('#div-abrir-alunos #input-experiencia').val().trim() || null,
            descricao_limitacoes: $('#div-abrir-alunos #input-limitacoes').val().trim() || null,
            descricao_objetivos: $('#div-abrir-alunos #input-objetivo').val().trim()
        };
    }

    validarDados(dados) {
        if (!dados.nome || !dados.data_nascimento || !dados.cpf ||
            !dados.telefone || !dados.email || !dados.senha || !dados.descricao_objetivos) {
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

    mostrarLoading(mostrar) {
        const button = $('#div-abrir-alunos button[type="submit"]');
        if (mostrar) {
            button.prop('disabled', true).text('Cadastrando...');
        } else {
            button.prop('disabled', false).text('Criar Registro');
        }
    }

    limparFormulario() {
        $('#div-abrir-alunos form')[0].reset();
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
            </div>
        `;

        $('body').append(mensagemHTML);

        setTimeout(() => {
            $('.mensagem-sistema').fadeOut(() => {
                $('.mensagem-sistema').remove();
            });
        }, 4000);
    }

    redirecionarLogin() {
        window.location.href = 'login.html';
    }
}

// Inicializar o sistema quando a página carregar
$(document).ready(() => {
    window.cadastroAlunoManager = new GerenciadorCadastroAluno();
});

