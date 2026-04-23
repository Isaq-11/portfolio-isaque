function getFormElements() {
    return {
        form: document.getElementById('contactForm'),
        name: document.getElementById('nameField'),
        email: document.getElementById('emailField'),
        message: document.getElementById('messageField'),
        feedback: document.getElementById('formFeedback')
    };
}

function clearErrors(elements) {
    elements.name.classList.remove('input-error');
    elements.email.classList.remove('input-error');
    elements.message.classList.remove('input-error');
    elements.feedback.textContent = '';
    elements.feedback.className = 'form-feedback';
}

function showError(elements, field, message) {
    field.classList.add('input-error');
    elements.feedback.textContent = message;
    elements.feedback.className = 'form-feedback error';
}

function showSuccess(elements, message) {
    elements.feedback.textContent = message;
    elements.feedback.className = 'form-feedback success';
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(elements) {
    const nameValue = elements.name.value.trim();
    const emailValue = elements.email.value.trim();
    const messageValue = elements.message.value.trim();

    if (nameValue.length < 3) {
        showError(elements, elements.name, 'Digite um nome com pelo menos 3 caracteres.');
        return false;
    }

    if (!emailIsValid(emailValue)) {
        showError(elements, elements.email, 'Digite um e-mail válido.');
        return false;
    }

    if (messageValue.length < 10) {
        showError(elements, elements.message, 'A mensagem precisa ter pelo menos 10 caracteres.');
        return false;
    }

    return true;
}

function handleSubmit(event) {
    event.preventDefault();

    const elements = getFormElements();
    clearErrors(elements);

    const formIsValid = validateForm(elements);

    if (!formIsValid) {
        return;
    }

    showSuccess(elements, 'Mensagem validada com sucesso. Sem backend, então ela não foi enviada de verdade.');
    elements.form.reset();
}

export function initForm() {
    const elements = getFormElements();

    if (!elements.form) {
        return;
    }

    elements.form.addEventListener('submit', handleSubmit);
}
