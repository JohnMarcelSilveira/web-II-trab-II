let emailIndex = document.querySelectorAll(
  "#emailsContainer input[type=email]"
).length;
let telefoneIndex = document.querySelectorAll(
  "#telefonesContainer input[type=text]"
).length;

function addEmail() {
  const container = document.getElementById("emailsContainer");
  const div = document.createElement("div");
  div.className = "emailGroup";
  div.innerHTML = `
    <input type="email" name="emails[${emailIndex}].email" required />
    <label>
      Principal:
      <input type="radio" name="emailPrincipal" value="${emailIndex}" />
    </label>
    <button type="button" onclick="this.parentElement.remove()">Remover</button>
  `;
  container.appendChild(div);
  emailIndex++;
}

function addTelefone() {
  const container = document.getElementById("telefonesContainer");
  const div = document.createElement("div");
  div.className = "telefoneGroup";
  div.innerHTML = `
    <input type="text" name="telefones[${telefoneIndex}].telefone" required />
    <label>
      Principal:
      <input type="radio" name="telefonePrincipal" value="${telefoneIndex}" />
    </label>
    <button type="button" onclick="this.parentElement.remove()">Remover</button>
  `;
  container.appendChild(div);
  telefoneIndex++;
}
