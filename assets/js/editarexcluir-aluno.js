async function trazerCampos(id) {
    try {
        const token = localStorage.getItem("jwt-token-atlas")

        const resposta = await fetch("http://10.92.3.214:5000/usuarios/info/" + id + "/2", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const dados = await resposta.json();

        console.log(dados.dados)

        document.getElementById("input-nome-edita").value = dados.dados["Nome"];
        document.getElementById("input-data-edita").value = dados.dados["Data_de_Nascimento"];
        document.getElementById("input-cpf-edita").value = dados.dados["CPF"];
        document.getElementById("input-telefone-edita").value = dados.dados["Telefone"];
        document.getElementById("input-histmed-edita").value = dados.dados["Histórico Médico Relevante"];
        document.getElementById("input-medicamentos-edita").value = dados.dados["Descrição de medicamentos"];
        document.getElementById("input-limitacoes-edita").value = dados.dados["Descrição de limitações"];
        document.getElementById("input-objetivo-edita").value = dados.dados["Descrição de Objetivos"];
        document.getElementById("input-experiencia-edita").value = dados.dados["Experiência Anterior com Academia"];
        document.getElementById("input-email-edita").value = dados.dados["E-mail"];


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
        const dadosAtualizados = {
            "nome": document.getElementById("input-nome-edita").value,
            "data_nascimento": document.getElementById("input-data-edita").value,
            "cpf": document.getElementById("input-cpf-edita").value,
            "telefone": document.getElementById("input-telefone-edita").value,
            "historico_medico_relevante": document.getElementById("input-histmed-edita").value,
            "descricao_medicamentos": document.getElementById("input-medicamentos-edita").value,
            "descricao_limitacoes": document.getElementById("input-limitacoes-edita").value,
            "descricao_objetivos": document.getElementById("input-objetivo-edita").value,
            "descricao_treinamentos_anteriores": document.getElementById("input-experiencia-edita").value,
            "email": document.getElementById("input-email-edita").value
        };

        const resposta = await fetch("http://10.92.3.214:5000/usuarios/" + id + "/editar/2", {
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
async function excluirUsuario(id) {
    try {
        const token = localStorage.getItem("jwt-token-atlas");
        if (!token) throw new Error("Token não encontrado");

        const confirma = confirm("Tem certeza que quer excluir este usuário? Isso é irreversível!");
        if (!confirma) return;

        const resposta = await fetch(`http://10.92.3.214:5000/usuarios/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!resposta.ok) throw new Error("Erro ao excluir usuário");

        alert("Usuário excluído com sucesso!");
        // Aqui você pode atualizar a interface, por exemplo, esconder a div do usuário:
        document.getElementById("div-edit-usuarios").style.display = "none";

    } catch (erro) {
        console.error("Erro ao excluir usuário:", erro);
        alert("Falha ao excluir usuário.");
    }
}

