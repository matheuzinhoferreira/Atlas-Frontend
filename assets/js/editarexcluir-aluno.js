async function trazerCampos(id) {
    try {
        const token = localStorage.getItem("jwt-token-atlas");

        const resposta = await fetch(`${window.apiBase.ip}/usuarios/info/${id}/2`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const dados = await resposta.json();
        console.log(dados.dados);

        // Formata data_nascimento para "dd mm yyyy"
        const dataVemAPI = dados.dados.data_nascimento;
        const parteData = dataVemAPI ? dataVemAPI.split('T')[0] : '';
        const dataPartes = parteData.split('-');
        let dataFormatada = '';
        if (dataPartes.length === 3) {
        dataFormatada = `${dataPartes[0]}/${dataPartes[1]}/${dataPartes[2]}`;
        }
        console.log("Data formatada:", dataFormatada);
        document.getElementById("input-nome-edita").value = dados.dados.nome;
        document.getElementById("input-data-edita").value = dataFormatada;
        console.log("Data atribuída ao campo:", document.getElementById("input-data-edita").value);
        document.getElementById("input-cpf-edita").value = dados.dados.cpf;
        document.getElementById("input-telefone-edita").value = dados.dados.telefone;
        document.getElementById("input-histmed-edita").value = dados.dados.historico_medico_relevante;
        document.getElementById("input-medicamentos-edita").value = dados.dados.descricao_medicamentos;
        document.getElementById("input-limitacoes-edita").value = dados.dados.descricao_limitacoes;
        document.getElementById("input-objetivo-edita").value = dados.dados.descricao_objetivos;
        document.getElementById("input-experiencia-edita").value = dados.dados.descricao_treinamentos_anteriores;
        document.getElementById("input-email-edita").value = dados.dados.email;

        document.getElementById("input-id-edita").value = id;
    } catch (erro) {
        console.error("Erro ao trazer campos:", erro);
        document.addEventListener("DOMContentLoaded", function () {
            trazerCampos(id);
        });
    }
}

async function enviarCampos(idUsuario, tipoLogado = 2) {
    try {

        // let telefone = document.getElementById("input-telefone-edita").value
        // telefone = telefone.replaceAll("+", "")

        const token = localStorage.getItem("jwt-token-atlas");
        const id = document.getElementById("input-id-edita").value;
        const dadosAtualizados = {
            nome: document.getElementById("input-nome-edita").value,
            data_nascimento: document.getElementById("input-data-edita").value,
            cpf: document.getElementById("input-cpf-edita").value,
            telefone: document.getElementById("input-telefone-edita").value,
            historico_medico_relevante: document.getElementById("input-histmed-edita").value,
            descricao_medicamentos: document.getElementById("input-medicamentos-edita").value,
            descricao_limitacões: document.getElementById("input-limitacoes-edita").value,
            descricao_objetivos: document.getElementById("input-objetivo-edita").value,
            descricao_treinamentos_anteriores: document.getElementById("input-experiencia-edita").value,
            email: document.getElementById("input-email-edita").value
        };


        const resposta = await fetch(`${window.apiBase.ip}/usuarios/${id}/editar/2`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(dadosAtualizados)
        });
        
        if (!resposta.ok) throw new Error("Erro ao enviar alterações");

        alert("Dados atualizados com sucesso!");
    } catch (erro) {
        console.error("Erro ao enviar campos:", erro);
        alert("Falha ao atualizar dados.");
    }
}

