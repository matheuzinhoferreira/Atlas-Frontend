// Sistema de cabeçalho dinâmico - Atlas Gym
class HeaderDinamico {
    constructor() {
        this.initHeader();
    }

    initHeader() {
        $(document).ready(() => {
            this.verificarUsuarioLogado();
            
            // Verificar periodicamente se usuário ainda está logado
            setInterval(() => {
                this.verificarUsuarioLogado();
            }, 30000); // A cada 30 segundos
        });
    }

    verificarUsuarioLogado() {
        const token = localStorage.getItem('jwt-token-atlas');
        const nomeUsuario = localStorage.getItem('nome-usuario-atlas');
        const tipoUsuario = localStorage.getItem('tipo-usuario-atlas');
        
        if (token && nomeUsuario && (tipoUsuario === '2' || tipoUsuario === '3')) {
            this.mostrarUsuarioLogado(nomeUsuario, tipoUsuario);
        } else {
            this.mostrarBotaoEntrar();
        }
    }

    mostrarUsuarioLogado(nomeCompleto, tipo) {
        const primeiroNome = nomeCompleto.split(' ')[0];
        const tipoTexto = tipo === '3' ? 'Admin' : 'Personal';
        
        // ✅ ÁREA DO USUÁRIO LOGADO
        const htmlUsuarioLogado = `
            <div class="usuario-logado-container" style="
                display: flex; 
                align-items: center; 
                gap: 12px;
                position: relative;
                cursor: pointer;
                padding: 8px 15px;
                border-radius: 8px;
                transition: all 0.3s ease;
                color: var(--cor-branca-bl);
            " onmouseover="this.style.backgroundColor='rgba(219, 162, 255, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                
                <!-- Ícone do usuário -->
                <div class="user-icon" style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, var(--cor-roxa-bl) 0%, #a370fa 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: white;
                    font-size: 16px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                ">
                    ${primeiroNome.charAt(0).toUpperCase()}
                </div>
                
                <!-- Info do usuário -->
                <div class="user-info" style="display: flex; flex-direction: column; gap: 2px;">
                    <span class="user-name" style="
                        font-weight: 600;
                        font-size: 14px;
                        color: var(--cor-branca-bl);
                    ">${primeiroNome}</span>
                    <span class="user-type" style="
                        font-size: 11px;
                        color: var(--cor-roxa-bl);
                        font-weight: 500;
                    ">${tipoTexto}</span>
                </div>
                
                <!-- Seta dropdown -->
                <i class="fas fa-chevron-down" style="
                    font-size: 12px;
                    color: var(--cor-roxa-bl);
                    transition: transform 0.3s ease;
                "></i>
                
                <!-- Menu dropdown -->
                <div class="dropdown-menu-atlas" style="
                    display: none;
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: var(--cor-preta-bl);
                    border: 2px solid var(--cor-roxa-bl);
                    border-radius: 8px;
                    padding: 8px 0;
                    min-width: 180px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.4);
                    z-index: 1000;
                    margin-top: 8px;
                ">
                    <a href="personal-perfil.html" class="dropdown-item" style="
                        display: block;
                        padding: 12px 16px;
                        color: var(--cor-branca-bl);
                        text-decoration: none;
                        transition: all 0.3s ease;
                        border-bottom: 1px solid rgba(219, 162, 255, 0.1);
                    " onmouseover="this.style.backgroundColor='rgba(219, 162, 255, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                        <i class="fas fa-user" style="margin-right: 8px; color: var(--cor-roxa-bl);"></i>
                        Meu Perfil
                    </a>
                    
                    <a href="#" onclick="headerDinamico.logout(); return false;" class="dropdown-item" style="
                        display: block;
                        padding: 12px 16px;
                        color: var(--cor-branca-bl);
                        text-decoration: none;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.backgroundColor='rgba(220, 53, 69, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                        <i class="fas fa-sign-out-alt" style="margin-right: 8px; color: #dc3545;"></i>
                        Sair
                    </a>
                </div>
            </div>
        `;

        // Inserir na área do usuário
        $('.area-usuario-header').html(htmlUsuarioLogado).show();

        // Event listeners para dropdown
        $('.usuario-logado-container').off('click').on('click', function(e) {
            e.stopPropagation();
            $('.dropdown-menu-atlas').toggle();
            $('.fa-chevron-down').toggleClass('rotated');
        });

        // Fechar dropdown ao clicar fora
        $(document).off('click.dropdown').on('click.dropdown', function(e) {
            if (!$(e.target).closest('.usuario-logado-container').length) {
                $('.dropdown-menu-atlas').hide();
                $('.fa-chevron-down').removeClass('rotated');
            }
        });
    }

    mostrarBotaoEntrar() {
        const htmlBotaoEntrar = `
            <a href="login.html" class="btn-entrar-header" style="
                color: var(--cor-roxa-bl);
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                border: 2px solid var(--cor-roxa-bl);
                border-radius: 8px;
                transition: all 0.3s ease;
                background: transparent;
            " onmouseover="
                this.style.backgroundColor='var(--cor-roxa-bl)';
                this.style.color='var(--cor-branca-bl)';
            " onmouseout="
                this.style.backgroundColor='transparent';
                this.style.color='var(--cor-roxa-bl)';
            ">
                <i class="fas fa-sign-in-alt"></i>
                Entrar
            </a>
        `;
        
        $('.area-usuario-header').html(htmlBotaoEntrar).show();
    }

    logout() {
        // Confirmação de logout
        if (!confirm('Tem certeza que deseja sair?')) {
            return;
        }

        const token = localStorage.getItem('jwt-token-atlas');
        
        if (token) {
            // Chamar API de logout
            $.ajax({
                url: 'http://localhost:5000/logout',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: () => {
                    console.log('Logout realizado com sucesso na API');
                },
                error: () => {
                    console.log('Erro no logout da API, limpando dados locais mesmo assim');
                },
                complete: () => {
                    this.limparDadosLocais();
                    this.mostrarMensagemLogout();
                    
                    // Redirecionar após 1.5 segundos
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            });
        } else {
            this.limparDadosLocais();
            window.location.reload();
        }
    }

    limparDadosLocais() {
        localStorage.removeItem('jwt-token-atlas');
        localStorage.removeItem('nome-usuario-atlas');
        localStorage.removeItem('tipo-usuario-atlas');
        localStorage.removeItem('email-usuario-atlas');
    }

    mostrarMensagemLogout() {
        const mensagemHTML = `
            <div class="mensagem-logout" style="
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 9999;
                background: #28a745;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                animation: slideInRight 0.3s ease-out;
            ">
                <i class="fas fa-check-circle"></i>
                Logout realizado com sucesso!
            </div>
        `;
        
        $('body').append(mensagemHTML);
        
        setTimeout(() => {
            $('.mensagem-logout').fadeOut();
        }, 3000);
    }
}

// CSS adicional para animações
$('head').append(`
    <style>
        .fa-chevron-down.rotated {
            transform: rotate(180deg);
        }
        
        @keyframes slideInRight {
            from { 
                transform: translateX(100%); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        
        .dropdown-menu-atlas {
            animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
`);

// Inicializar o header dinâmico
$(document).ready(() => {
    window.headerDinamico = new HeaderDinamico();
});
