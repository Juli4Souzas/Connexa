document.addEventListener('DOMContentLoaded', () => {

    const authButtonsContainer = document.querySelector('.auth-buttons');
    const userName = localStorage.getItem('userName');

    if (userName) {
        // Se o nome do usuário existe, significa que ele está logado
        // Substitui os botões de Login e Cadastro pela área de perfil
        authButtonsContainer.innerHTML = `
            <div class="user-profile">
                <a href="#" class="profile-link">
                   <i class="fas fa-user-circle"></i>
                   <span class="user-name-text">${userName.split(' ')[0]}</span>
                </a>
                <a href="#" class="btn btn-secondary logout-btn">Sair</a>
            </div>
        `;
        // Adiciona um evento para o botão de sair
        document.querySelector('.logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userName');
            localStorage.removeItem('loginSucesso');
            window.location.reload(); // Recarrega a página para atualizar o menu
        });
    } else {
        // Se o usuário não está logado, exibe os botões originais
        authButtonsContainer.innerHTML = `
            <a href="login.html" class="btn btn-secondary">Login</a>
            <a href="cadastro.html" class="btn btn-primary">Cadastro</a>
        `;
    }

    // Lógica para o botão "Voltar ao Topo"
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});