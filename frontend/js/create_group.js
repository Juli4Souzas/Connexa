// Arquivo: frontend/js/create_group.js

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    const formContainer = document.getElementById('create-group-form-container');
    const loginModal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.modal-close-btn');

    if (userName) {
        // O usuário está logado, exibe o formulário e esconde o modal
        formContainer.style.display = 'block';
        loginModal.style.display = 'none';
        
        const createGroupForm = document.getElementById('create-group-form');
        createGroupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const groupName = document.getElementById('group-name').value;
            const groupSubject = document.getElementById('group-subject').value;
            // ... (colete os outros dados)
            
            alert(`Grupo "${groupName}" criado com sucesso!`);
        });

    } else {
        // O usuário não está logado, esconde o formulário e exibe o modal
        formContainer.style.display = 'none';
        loginModal.style.display = 'flex';

        // Redireciona para a página anterior ao clicar no botão de fechar
        closeBtn.addEventListener('click', () => {
            window.history.back();
        });
        
        // Redireciona para a página anterior ao clicar fora do modal
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                window.history.back();
            }
        });
    }
});