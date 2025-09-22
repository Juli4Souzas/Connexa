// Arquivo: frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.getElementById('login-btn');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    function validateEmail() {
        const email = emailInput.value.trim();
        return email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword() {
        const password = passwordInput.value.trim();
        return password.length > 0;
    }

    function updateButtonState() {
        if (validateEmail() && validatePassword()) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    emailInput.addEventListener('input', updateButtonState);
    passwordInput.addEventListener('input', updateButtonState);

    updateButtonState();

    function showLoginMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.style.display = 'block';
        loginMessage.className = 'alert-message';
        if (type === 'success') {
            loginMessage.classList.add('success');
        } else {
            loginMessage.classList.add('error');
        }
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        loginMessage.style.display = 'none';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!validateEmail() || !validatePassword()) {
            showLoginMessage('Preencha todos os campos.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirecionamento para o sucesso
                localStorage.setItem('userName', data.user.nome); // <-- Adicionado
                localStorage.setItem('loginSucesso', 'true');
                window.location.href = 'index.html';
            } else {
                // Exibição do erro na própria página de login
                showLoginMessage(data.error || 'Login inválido.', 'error');
            }
        } catch (error) {
            showLoginMessage('Erro de conexão com o servidor. Tente novamente mais tarde.', 'error');
            console.error('Erro ao fazer a requisição de login:', error);
        }
    });

    const cadastroSucessoMsg = document.getElementById('cadastro-sucesso-message');
    if (localStorage.getItem('cadastroSucesso') === 'true') {
        cadastroSucessoMsg.textContent = 'Cadastro realizado com sucesso! Faça login para continuar.';
        cadastroSucessoMsg.style.display = 'block';
        localStorage.removeItem('cadastroSucesso');
    }
});