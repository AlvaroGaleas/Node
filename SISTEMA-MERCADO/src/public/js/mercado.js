// Script para actualización en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar cada 30 segundos si estamos en la página de gestión
    if (window.location.pathname.includes('/gestionar/')) {
        setInterval(() => {
            window.location.reload();
        }, 30000);
    }
    
    // Validar formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let valid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!valid) {
                e.preventDefault();
                alert('Por favor, complete todos los campos requeridos.');
            }
        });
    });
});