// Sistema de login JWT para Personal/Admin - Atlas Gym - VERSÃO DEBUG
class SistemaLoginPersonal {
    constructor() {
        this.baseURL = 'http://10.92.3.214:5000';
        this.initEventListeners();
        this.verificarUsuarioLogado();
    }

    initEventListeners() {
        $(document).ready(() => {
            $('#form-login').on('submit', (e) => {
                e.preventDefault();
                this.fazerLogin();
            });

            $('input').on('keypress', (e) => {
                if (e.which === 13) {
                    e.preventDefault();
                    this.fazerLogin();
                }
            });

            $('#toggle-senha').on('click', this.toggleSenha);
        });
    }

    toggleSenha() {
        const senhaInput = $('#senha');
        const toggleBtn = $('#toggle-senha i');
        
        if (senhaInput.attr('type') === 'password') {
            senhaInput.attr('type', 'text');
            toggleBtn.removeClass('fa-eye', 'btn-toggle-senha').addClass('fa-eye-slash');
        } else {
            senhaInput.attr('type', 'password');
            toggleBtn.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }

    verificarUsuarioLogado() {
        const token = localStorage.getItem('jwt-token-atlas');
        const nomeUsuario = localStorage.getItem('nome-usuario-atlas');
        
        if (token && nomeUsuario) {
            this.verificarTokenValido(token);
        }
    }

    verificarTokenValido(token) {
        $.ajax({
            url: `${this.baseURL}/verificar-permissao`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: (response) => {
                if (response.tipo === 2 || response.tipo === 3) {
                    window.location.href = 'index.html';
                } else {
                    this.logout();
                    this.mostrarMensagem('Acesso não autorizado para esta área', 'error');
                }
            },
            error: () => {
                this.logout();
            }
        });
    }

   
    fazerLogin() {
        console.log('🔍 === DEBUG COMPLETO ===');
        
        const emailInput = $('#email');
        const senhaInput = $('#senha');
        
        console.log('Campo email encontrado:', emailInput.length);
        console.log('Campo senha encontrado:', senhaInput.length);
        
        const email = emailInput.val().trim();
        const senha = senhaInput.val();
        
        console.log('Valor email:', email);
        console.log('Valor senha:', senha ? '***' : 'VAZIO');
        console.log('Email válido:', this.validarEmail(email));
        
        if (!email || !senha) {
            console.log('❌ ERRO: Campos vazios');
            this.mostrarMensagem('Preencha todos os campos', 'error');
            return;
        }

        if (!this.validarEmail(email)) {
            console.log('❌ ERRO: Email inválido');
            this.mostrarMensagem('Digite um email válido', 'error');
            return;
        }

        console.log('✅ Validações OK - Iniciando AJAX');
        this.mostrarLoading(true);

        const dadosLogin = {
            email: email.toLowerCase(),
            senha: senha
        };
        
        console.log('Dados a enviar:', dadosLogin);
        console.log('URL da API:', `${this.baseURL}/login`);

        $.ajax({
            url: `${this.baseURL}/login`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(dadosLogin),
            beforeSend: function() {
                console.log('📡 Enviando requisição...');
            },
            success: (response) => {
                console.log('✅ SUCCESS - Resposta recebida:', response);
                this.mostrarLoading(false);
                this.processarLoginSucesso(response);
            },
            error: (xhr, status, error) => {
                console.log('❌ ERROR - Status:', status);
                console.log('❌ ERROR - Error:', error);
                console.log('❌ ERROR - XHR:', xhr);
                console.log('❌ Response Text:', xhr.responseText);
                console.log('❌ Response Status:', xhr.status);
                this.mostrarLoading(false);
                this.tratarErroLogin(xhr);
            },
            complete: function() {
                console.log('📝 Requisição completada');
            }
        });
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    processarLoginSucesso(response) {
        this.mostrarLoading(false);

        if (!response.token) {
            this.mostrarMensagem('Erro na resposta do servidor', 'error');
            return;
        }

        if (response.tipo !== 2 && response.tipo !== 3) {
            this.mostrarMensagem('Acesso restrito a Personal Trainers e Administradores', 'error');
            return;
        }

        localStorage.setItem('jwt-token-atlas', response.token);
        localStorage.setItem('nome-usuario-atlas', response.nome);
        localStorage.setItem('tipo-usuario-atlas', response.tipo);
        localStorage.setItem('email-usuario-atlas', response.email);

        // Redirecionamento por tipo
        if (response.tipo === 3) {
            window.location.href = 'administrador-perfil.html';
        } else if (response.tipo === 2) {
            window.location.href = 'personal-perfil.html';
        } else {
            window.location.href = 'index.html';
        }
    }


    tratarErroLogin(xhr) {
        let mensagem = 'Erro interno do servidor';

        try {
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    mensagem = errorData.message || errorData.error || 'Erro na autenticação';
                } catch (parseError) {
                    mensagem = xhr.responseText.length < 100 ? xhr.responseText : this.getMensagemPorStatus(xhr.status);
                }
            } else {
                mensagem = this.getMensagemPorStatus(xhr.status);
            }
        } catch (error) {
            console.error('Erro ao processar resposta:', error);
            mensagem = this.getMensagemPorStatus(xhr.status);
        }

        this.mostrarMensagem(mensagem, 'error');
    }

    getMensagemPorStatus(status) {
        const mensagens = {
            0: 'Falha na comunicação - API não está rodando',
            400: 'Dados de login inválidos',
            401: 'Email ou senha incorretos',
            403: 'Acesso não autorizado',
            404: 'Serviço não encontrado',
            500: 'Erro interno do servidor'
        };
        
        return mensagens[status] || `Erro ${status}`;
    }

    mostrarLoading(mostrar) {
        const botao = $('.btn-submit');
        
        if (mostrar) {
            botao.text('Entrando...').css({
                'pointer-events': 'none',
                'opacity': '0.7'
            });
        } else {
            botao.text('Entrar').css({
                'pointer-events': 'auto',
                'opacity': '1'
            });
        }
    }

    mostrarMensagem(mensagem, tipo) {
        $('.mensagem-sistema-atlas').remove();

        const cores = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107'
        };

        const mensagemHTML = `
            <div class="mensagem-sistema-atlas" style="
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 9999;
                max-width: 400px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                background: ${cores[tipo] || cores.error};
                animation: slideInRight 0.3s ease-out;
            ">
                <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                ${mensagem}
            </div>
        `;

        if (!$('#atlas-animations').length) {
            $('head').append(`
                <style id="atlas-animations">
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                </style>
            `);
        }

        $('body').append(mensagemHTML);

        setTimeout(() => {
            $('.mensagem-sistema-atlas').fadeOut();
        }, 4000);
    }

    logout() {
        localStorage.removeItem('jwt-token-atlas');
        localStorage.removeItem('nome-usuario-atlas');
        localStorage.removeItem('tipo-usuario-atlas');
        localStorage.removeItem('email-usuario-atlas');
    }
}

$(document).ready(() => {
    window.sistemaLoginAtlas = new SistemaLoginPersonal();
});
