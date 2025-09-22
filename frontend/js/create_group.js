document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-group-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');

    const updateButtonState = () => {
        const isFormValid = Array.from(requiredFields).every(field => field.checkValidity());
        submitBtn.disabled = !isFormValid;
    };

    requiredFields.forEach(field => {
        field.addEventListener('input', updateButtonState);
        field.addEventListener('change', updateButtonState);
    });

    // Chamada inicial para desabilitar o botão no carregamento da página
    updateButtonState();
});