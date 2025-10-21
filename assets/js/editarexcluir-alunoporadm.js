    async function trazerCampos(id) {
        try {
            const token = localStorage.getItem("jwt-token-atlas")

            const resposta = await fetch("http://10.92.3.167:5000/usuarios/info/" + id + "/3", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const dados = await resposta.json();

            console.log(dados.dados)

            document.getElementById("input-nome-edita").value = dados.dados["nome"];
            document.getElementById("input-data-edita").value = dados.dados["data_nascimento"];
            document.getElementById("input-cpf-edita").value = dados.dados["cpf"];
            document.getElementById("input-telefone-edita").value = dados.dados["telefone"];
            document.getElementById("input-histmed-edita").value = dados.dados["historico_medico_relevante"];
            document.getElementById("input-medicamentos-edita").value = dados.dados["descricao_medicamentos"];
            document.getElementById("input-limitacoes-edita").value = dados.dados["descricao_limitacoes"];
            document.getElementById("input-objetivo-edita").value = dados.dados["descricao_objetivos"];
            document.getElementById("input-experiencia-edita").value = dados.dados["descricao_treinamentos_anteriores"];
            document.getElementById("input-email-edita").value = dados.dados["email"];


            document.getElementById("div-edit-usuarios").style.display = "block";

            document.getElementById("input-id-edita").value = id;
        } catch (erro) {
            console.error("Erro ao trazer campos:");
            document.addEventListener("DOMContentLoaded", trazerCampos);
        }
    }
    async function enviarCampos() {
        try {
            const token = localStorage.getItem("jwt-token-atlas");
            const id = document.getElementById("input-id-edita").value;

            console.log("ID:", id);
            console.log("Token:", token ? "encontrado" : "faltando");

            const dadosAtualizados = {
                "nome": document.getElementById("input-nome-edita").value,
                "data_nascimento": document.getElementById("input-data-edita").value,
                "cpf": document.getElementById("input-cpf-edita").value,
                "telefone": document.getElementById("input-telefone-edita").value.replace(/\D/g, ''),
                "historico_medico_relevante": document.getElementById("input-histmed-edita").value,
                "descricao_medicamentos": document.getElementById("input-medicamentos-edita").value,
                "descricao_limitacoes": document.getElementById("input-limitacoes-edita").value,
                "descricao_objetivos": document.getElementById("input-objetivo-edita").value,
                "descricao_treinamentos_anteriores": document.getElementById("input-experiencia-edita").value,
                "email": document.getElementById("input-email-edita").value
            };

            console.log("Body enviado:", dadosAtualizados);

            const resposta = await fetch(`http://10.92.3.167:5000/usuarios/${id}/editar/3`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(dadosAtualizados)
            });

            const respostaTexto = await resposta.text();
            console.log("Status:", resposta.status);
            console.log("Resposta do servidor:", respostaTexto);

            if (!resposta.ok) throw new Error("Erro ao enviar alterações");

            alert("Dados atualizados com sucesso!");
        } catch (erro) {
            console.error("Erro ao enviar campos:", erro);
            alert("Falha ao atualizar dados.");
        }
    }