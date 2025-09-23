// Arquivo: frontend/js/cadastro.js

document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastro-form');
    // Não precisamos mais do formContainer se vamos rolar para o topo da página.
    // const formContainer = document.getElementById('form-container'); 
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const cursoInput = document.getElementById('curso');
    const semestreInput = document.getElementById('semestre');
    const periodoSelect = document.getElementById('periodo');
    const senhaInput = document.getElementById('senha');
    const confirmaSenhaInput = document.getElementById('confirma-senha');
    const cadastroBtn = document.getElementById('cadastro-btn');
    const cadastroMessage = document.getElementById('cadastro-message');

    const emailError = document.getElementById('email-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const lengthCheck = document.getElementById('length-check');
    const uppercaseCheck = document.getElementById('uppercase-check');
    const lowercaseCheck = document.getElementById('lowercase-check');
    const numberCheck = document.getElementById('number-check');
    const specialCharCheck = document.getElementById('special-char-check');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@universidade\.edu$/i;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const checks = {
            length: password.length >= 10,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
        };
        return checks;
    };

    const updateValidationMessage = (element, isValid, message) => {
        if (isValid) {
            element.textContent = `${message} ✓`;
            element.classList.remove('invalid');
            element.classList.add('valid');
        } else {
            element.textContent = `${message} ✗`;
            element.classList.remove('valid');
            element.classList.add('invalid');
        }
    };

    const updateButtonState = () => {
        const allInputsFilled = nomeInput.value.trim() !== '' &&
                                emailInput.value.trim() !== '' &&
                                cursoInput.value.trim() !== '' &&
                                semestreInput.value.trim() !== '' &&
                                periodoSelect.value !== '' &&
                                senhaInput.value.trim() !== '' &&
                                confirmaSenhaInput.value.trim() !== '';

        const isEmailValid = validateEmail(emailInput.value);
        const passwordChecks = validatePassword(senhaInput.value);
        const isPasswordValid = Object.values(passwordChecks).every(check => check);
        const passwordsMatch = senhaInput.value === confirmaSenhaInput.value;

        if (allInputsFilled && isEmailValid && isPasswordValid && passwordsMatch) {
            cadastroBtn.disabled = false;
        } else {
            cadastroBtn.disabled = true;
        }
    };

    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() === '') {
            emailError.style.display = 'none';
        } else if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'E-mail deve ser institucional (@universidade.edu).';
            emailError.style.display = 'block';
        } else {
            emailError.style.display = 'none';
        }
        updateButtonState();
    });

    senhaInput.addEventListener('input', () => {
        const password = senhaInput.value;
        const checks = validatePassword(password);

        updateValidationMessage(lengthCheck, checks.length, 'Mínimo de 10 caracteres');
        updateValidationMessage(uppercaseCheck, checks.uppercase, 'Pelo menos 1 letra maiúscula');
        updateValidationMessage(lowercaseCheck, checks.lowercase, 'Pelo menos 1 letra minúscula');
        updateValidationMessage(numberCheck, checks.number, 'Pelo menos 1 número');
        updateValidationMessage(specialCharCheck, checks.specialChar, 'Pelo menos 1 caractere especial');

        if (senhaInput.value !== confirmaSenhaInput.value && confirmaSenhaInput.value.length > 0) {
            confirmPasswordError.textContent = 'As senhas não coincidem.';
            confirmPasswordError.style.display = 'block';
        } else {
            confirmPasswordError.style.display = 'none';
        }

        updateButtonState();
    });

    confirmaSenhaInput.addEventListener('input', () => {
        if (senhaInput.value !== confirmaSenhaInput.value) {
            confirmPasswordError.textContent = 'As senhas não coincidem.';
            confirmPasswordError.style.display = 'block';
        } else {
            confirmPasswordError.style.display = 'none';
        }
        updateButtonState();
    });

    nomeInput.addEventListener('input', updateButtonState);
    cursoInput.addEventListener('input', updateButtonState);
    semestreInput.addEventListener('input', updateButtonState);
    periodoSelect.addEventListener('change', updateButtonState);

    cadastroForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (cadastroBtn.disabled) {
            showCadastroMessage('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }

        cadastroMessage.style.display = 'none';

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const curso = cursoInput.value.trim();
        const semestre = semestreInput.value.trim();
        const periodo = periodoSelect.value;
        const senha = senhaInput.value.trim();

        try {
            const response = await fetch('http://localhost:3000/api/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome_completo: nome,
                    email_institucional: email,
                    curso: curso,
                    semestre: semestre,
                    periodo: periodo,
                    senha_hash: senha,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('cadastroSucesso', 'true');
                window.location.href = 'login.html';
            } else {
                showCadastroMessage(data.error || 'Erro ao cadastrar. Tente novamente.', 'error');
                
                // Rola para o topo da página, não importa onde o formulário esteja
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            showCadastroMessage('Erro de conexão com o servidor. Tente novamente mais tarde.', 'error');
            
            // Rola para o topo da página
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.error('Erro ao fazer a requisição de cadastro:', error);
        }
    });

    function showCadastroMessage(message, type) {
        cadastroMessage.textContent = message;
        cadastroMessage.style.display = 'block';
        cadastroMessage.className = `alert-message ${type}`;
    }

    updateButtonState();
});