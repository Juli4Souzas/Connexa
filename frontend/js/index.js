/*
 * Arquivo: index.js
 * Descrição: Lógica JavaScript para a página inicial da plataforma Connexa.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para Mensagem de Sucesso de Login ---
    const loginSucessoMsg = document.getElementById('login-sucesso-message');

    if (localStorage.getItem('loginSucesso') === 'true') {
        loginSucessoMsg.style.display = 'flex';
        loginSucessoMsg.innerHTML = '<i class="fas fa-check-circle"></i> Login realizado com sucesso!';
        localStorage.removeItem('loginSucesso');
        setTimeout(() => {
            loginSucessoMsg.style.display = 'none';
        }, 5000);
    }
    
    // --- Início do seu código original ---
    
    const mockGroups = [
    { id: 1, name: "Matemática Discreta", subject: "Matemática", university: "Fatec", members: 15, level: "iniciante", modality: "online", description: "Grupo para tirar dúvidas sobre lógica, conjuntos e grafos, essenciais para ADS e SI." },
    { id: 2, name: "Algoritmos e Estruturas de Dados", subject: "Tecnologia", university: "Fatec", members: 22, level: "avançado", modality: "presencial", description: "Discutindo complexidade de algoritmos e estruturas de dados em C e Python." },
    { id: 3, name: "Fundamentos de Sistemas para Internet", subject: "Sistemas para Internet", university: "Fatec", members: 8, level: "iniciante", modality: "online", description: "Discussão sobre as bases de protocolos e arquitetura web." },
    { id: 4, name: "Gestão de Projetos e Processos", subject: "Gestão Empresarial", university: "Fatec", members: 30, level: "intermediário", modality: "presencial", description: "Estudo de metodologias ágeis como Scrum e Kanban para Gestão de Projetos." },
    { id: 5, name: "Banco de Dados e SQL", subject: "Tecnologia", university: "Fatec", members: 45, level: "iniciante", modality: "online", description: "Grupo para tirar dúvidas de SQL e modelagem de dados para o curso de ADS." },
    { id: 6, name: "Redes de Computadores", subject: "Sistemas para Internet", university: "Fatec", members: 10, level: "avançado", modality: "presencial", description: "Estudo dos conceitos de redes LAN, WAN e segurança de redes." },
    { id: 7, name: "Desenvolvimento Web Full Stack", subject: "Tecnologia", university: "Fatec", members: 50, level: "avançado", modality: "online", description: "Grupo para devs front-end e back-end. Foco em Node.js e React." },
    { id: 8, name: "Cálculo 1", subject: "Matemática", university: "Fatec", members: 12, level: "iniciante", modality: "online", description: "Tirando dúvidas e resolvendo exercícios de cálculo para o 1º semestre de engenharia." },
    { id: 9, name: "Modelagem de Dados", subject: "Análise e Desenvolvimento de Sistemas", university: "Fatec", members: 26, level: "intermediário", modality: "presencial", description: "Estudo e discussões sobre a aplicação e manuseio dos dados em sistemas." },
    { id: 10, name: "Estatística Aplicada", subject: "Estatística", university: "Fatec", members: 18, level: "iniciante", modality: "online", description: "Aulas de estatística básica e suas aplicações em projetos de dados." },
    ];

    let groups = JSON.parse(localStorage.getItem('groups')) || mockGroups;
    const groupListElement = document.getElementById('group-list');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recommendedGroupsList = document.getElementById('recommended-groups');
    const popularTagsList = document.getElementById('popular-tags');

    const createGroupCard = (group) => {
        const isNew = (Date.now() - group.createdAt) < 60000;
        return `
            <div class="card" data-group-id="${group.id}">
                ${isNew ? '<div class="new-indicator">Novo!</div>' : ''}
                <div class="card-header">
                    <div class="title">${group.name}</div>
                    <span class="badge ${group.level}">${group.level}</span>
                </div>
                <div class="details">
                    <p>${group.subject} • ${group.university}</p>
                    <p class="members"><span class="member-count">${group.members}</span> membros</p>
                    <span class="badge ${group.modality}">${group.modality}</span>
                </div>
                <p class="description">${group.description}</p>
                <div class="card-actions">
                    <button class="btn btn-primary btn-card join-btn">Entrar</button>
                    <button class="btn btn-secondary btn-card view-btn">Ver</button>
                </div>
            </div>
        `;
    };

    const renderGroups = (groupArray) => {
        groupListElement.innerHTML = groupArray.map(createGroupCard).join('');
        if (groupArray.length === 0) {
            groupListElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum grupo encontrado. Que tal criar um?</p>';
        }
    };

    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    };

    const initialize = () => {
        renderGroups(groups);
        updateSidebar();

        searchInput.addEventListener('input', filterAndRenderGroups);
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                filterAndRenderGroups();
            });
        });

        groupListElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-btn')) {
                const card = e.target.closest('.card');
                const memberCountElement = card.querySelector('.member-count');
                let currentMembers = parseInt(memberCountElement.textContent);
                memberCountElement.textContent = currentMembers + 1;
                showToast('Você entrou no grupo com sucesso!');
            }
        });
    };

    const filterAndRenderGroups = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        const filteredGroups = groups.filter(group => {
            const matchesSearch = group.name.toLowerCase().includes(searchTerm) ||
                                 group.subject.toLowerCase().includes(searchTerm) ||
                                 group.university.toLowerCase().includes(searchTerm);
            
            const matchesFilter = activeFilter === 'all' || 
                                 group.level === activeFilter ||
                                 group.modality === activeFilter;

            return matchesSearch && matchesFilter;
        });

        renderGroups(filteredGroups);
    };

    const updateSidebar = () => {
        const recommended = [...groups].sort((a, b) => b.members - a.members).slice(0, 3);
        recommendedGroupsList.innerHTML = recommended.map(g => `<li><a href="#">${g.name} (${g.subject})</a></li>`).join('');

        const subjects = groups.map(g => g.subject);
        const tagCounts = subjects.reduce((acc, subject) => {
            acc[subject] = (acc[subject] || 0) + 1;
            return acc;
        }, {});
        const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
        popularTagsList.innerHTML = sortedTags.map(([tag]) => `<li><a href="#">#${tag.replace(/\s/g, '')}</a></li>`).join('');
    };

    initialize();
});