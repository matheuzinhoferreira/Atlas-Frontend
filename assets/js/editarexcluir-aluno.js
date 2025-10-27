async function trazerCampos(id) {
    try {
        const token = localStorage.getItem("jwt-token-atlas");

        const resposta = await fetch(`${window.apiBase.ip}/usuarios/info/` + id + "/2", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const dados = await resposta.json();
        console.log(dados.dados);

        document.getElementById("input-nome-edita").value = dados.dados.nome;
        const dataBr = dados.dados.data_nascimento;
        if (dataBr) {
            const partes = dataBr.split("-");
            const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
            console.log(dataFormatada)
            document.getElementById("input-data-edita-aluno").value = dataFormatada;
        }

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
        const token = localStorage.getItem("jwt-token-atlas");
        const id = document.getElementById("input-id-edita").value;


        let data = document.getElementById("input-data-edita-aluno").value; // YYYY-MM-DD
        // transforma para DD-MM-YYYY
        const [ano, mes, dia] = data.split("-");
        data = `${dia}-${mes}-${ano}`;

        let telefone = document.getElementById("input-telefone-edita").value;
        telefone = telefone.replace(/\D/g, ""); // limpa qualquer coisa que não seja número

        const dadosAtualizados = {
            nome: document.getElementById("input-nome-edita").value,
            data_nascimento: data,
            cpf: document.getElementById("input-cpf-edita").value,
            telefone: telefone,
            historico_medico_relevante: document.getElementById("input-histmed-edita").value,
            descricao_medicamentos: document.getElementById("input-medicamentos-edita").value,
            descricao_limitacoes: document.getElementById("input-limitacoes-edita").value,
            descricao_objetivos: document.getElementById("input-objetivo-edita").value,
            descricao_treinamentos_anteriores: document.getElementById("input-experiencia-edita").value,
            email: document.getElementById("input-email-edita").value
        };

        console.log("ID:", id);
        console.log("Token:", token);
        console.log("Dados:", dadosAtualizados);

        const resposta = await fetch(`${window.apiBase.ip}/usuarios/${id}/editar/${tipoLogado}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(dadosAtualizados)
        });

        console.log("Status resposta:", resposta.status);
        const retorno = await resposta.text();
        console.log("Retorno API:", retorno);

        if (!resposta.ok) throw new Error("Erro ao enviar alterações");

        alert("Dados atualizados com sucesso!");
    } catch (erro) {
        console.error("Erro ao enviar campos:", erro);
        alert("Falha ao atualizar dados.");
    }
}

