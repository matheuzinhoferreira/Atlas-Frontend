async function trazerCampos(id) {
    try {
        const token = localStorage.getItem("jwt-token-atlas")

        const resposta = await fetch("http://10.92.3.214:5000/usuarios/info/" + id + "/admin", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const dados = await resposta.json();

        console.log(dados.dados)

        document.getElementById("input-nome-edita").value = dados.dados["Nome"];
        document.getElementById("input-data-edita").value = dados.dados["Data de Nascimento"];
        document.getElementById("input-cpf-edita").value = dados.dados["CPF"];
        document.getElementById("input-telefone-edita").value = dados.dados["Telefone"];
        document.getElementById("input-formacao-edita").value = dados.dados["Formação"];
        document.getElementById("input-cref-edita").value = dados.dados["Registro de CREF"];
        document.getElementById("input-email-edita").value = dados["E-mail"];
        document.getElementById("div-edit-usuarios").style.display = "block";
    } catch (erro) {
        console.error("Erro ao trazer campos:", erro);
        document.addEventListener("DOMContentLoaded", trazerCampos);
    }
}
async function enviarCampos() {
    try {
        const dadosAtualizados = {
            "Nome": document.getElementById("input-nome").value,
            "Data de Nascimento": document.getElementById("input-data").value,
            "CPF": document.getElementById("input-cpf").value,
            "Telefone": document.getElementById("input-telefone").value,
            "Formação": document.getElementById("input-formacao").value,
            "Registro de CREF": document.getElementById("input-cref").value,
            "E-mail": document.getElementById("input-email").value
        };

        const resposta = await fetch("http://10.92.3.214:5000/usuarios/" + id + "editar/admin", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
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