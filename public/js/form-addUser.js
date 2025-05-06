let emailCount = 1;
let telefoneCount = 1;

function addEmail() {
    const emailDiv = document.createElement('div');
    emailDiv.className = 'input-group mt-2';
    emailDiv.innerHTML = `
        <input type="email" class="form-control" name="emails[${emailCount}][email]" placeholder="exemplo@email.com" required>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="emails[${emailCount}][principal]" value="1" id="principalEmail${emailCount}">
            <label class="form-check-label" for="principalEmail${emailCount}">Principal</label>
        </div>
    `;
    document.getElementById('emails').appendChild(emailDiv);
    emailCount++;
}

function addTelefone() {
    const telefoneDiv = document.createElement('div');
    telefoneDiv.className = 'input-group mt-2';
    telefoneDiv.innerHTML = `
        <input type="tel" class="form-control" name="telefones[${telefoneCount}][telefone]" placeholder="(00) 00000-0000" required>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="telefones[${telefoneCount}][principal]" value="1" id="principalTel${telefoneCount}">
            <label class="form-check-label" for="principalTel${telefoneCount}">Principal</label>
        </div>
    `;
    document.getElementById('telefones').appendChild(telefoneDiv);
    telefoneCount++;
}