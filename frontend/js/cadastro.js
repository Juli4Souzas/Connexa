// Arquivo: frontend/js/cadastro.js

document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastro-form');
    const submitBtn = document.getElementById('submit-btn');

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        document.getElementById('btn-text').style.display = isLoading ? 'none' : 'inline';
        document.getElementById('btn-spinner').style.display = isLoading ? 'inline-block' : 'none';
    }

    const fields = {
        fullName: document.getElementById('full-name'),
        email: document.getElementById('institutional-email'),
        course: document.getElementById('course'),
        semester: document.getElementById('semester'),
        period: document.getElementById('period'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirm-password')
    };

    const errorSpans = {
        fullName: document.getElementById('full-name-error'),
        email: document.getElementById('institutional-email-error'),
        course: document.getElementById('course-error'),
        semester: document.getElementById('semester-error'),
        period: document.getElementById('period-error'),
        password: document.getElementById('password-error'),
        confirmPassword: document.getElementById('confirm-password-error')
    };
    
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    function showGlobalMessage(type, message) {
        if (type === 'error') {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    function clearError(field) {
        errorSpans[field].textContent = '';
    }

    function showError(field, message) {
        errorSpans[field].textContent = message;
    }

    function validateField(field, value) {
        let isValid = true;
        clearError(field);
        
        if (value.trim() === '' && field !== 'period') {
            showError(field, 'Este campo é obrigatório.');
            isValid = false;
        } else {
            switch (field) {
                case 'fullName':
                    if (value.length < 3) {
                        showError(field, 'Nome muito curto. Mínimo de 3 caracteres.');
                        isValid = false;
                    }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        showError(field, 'E-mail inválido.');
                        isValid = false;
                    }
                    break;
                case 'semester':
                    const semesterValue = parseInt(value, 10);
                    if (isNaN(semesterValue) || semesterValue < 1 || semesterValue > 15) {
                        showError(field, 'Número inválido. O semestre deve ser entre 1 e 15.');
                        isValid = false;
                    }
                    break;
                case 'period':
                    if (value === '') {
                        showError(field, 'Selecione um período.');
                        isValid = false;
                    }
                    break;
                case 'password':
                    if (value.length < 6) {
                        showError(field, 'A senha deve ter pelo menos 6 caracteres.');
                        isValid = false;
                    }
                    break;
                case 'confirmPassword':
                    if (value !== fields.password.value) {
                        showError(field, 'As senhas não coincidem.');
                        isValid = false;
                    }
                    break;
            }
        }
        return isValid;
    }

    function validateFormOnSubmit() {
        let isFormValid = true;
        for (const field in fields) {
            if (!validateField(field, fields[field].value.trim())) {
                isFormValid = false;
            }
        }
        return isFormValid;
    }
    
    cadastroForm.addEventListener('input', () => {
        const todosPreenchidos = [...Object.values(fields)].every(field => field.value.trim() !== '');
        submitBtn.disabled = !todosPreenchidos;
    });

    for (const field in fields) {
        fields[field].addEventListener('blur', () => {
            validateField(field, fields[field].value.trim());
        });
    }

    cadastroForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!validateFormOnSubmit()) {
            return;
        }

        errorMessage.style.display = 'none';

        setLoading(true);

        const formData = {
            nome_completo: fields.fullName.value,
            email_institucional: fields.email.value,
            curso: fields.course.value,
            semestre: fields.semester.value,
            periodo: fields.period.value,
            senha_hash: fields.password.value
        };

        fetch('http://localhost:3000/api/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Erro no servidor. Tente novamente mais tarde.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Sucesso:', data);
            // Salva a flag no localStorage para mostrar a mensagem na tela de login
            localStorage.setItem('cadastroSucesso', 'true');
            // Redireciona para a página de login
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Erro:', error);
            showGlobalMessage('error', error.message);
            setLoading(false);
        });
    });
});