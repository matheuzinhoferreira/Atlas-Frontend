function mostrarMensagem(mensagem, tipo) {
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
