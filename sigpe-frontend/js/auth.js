// js/auth.js

// 1. PROTECCIÓN DE RUTA Y VARIABLES GLOBALES
const token = localStorage.getItem('token');
const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
const path = window.location.pathname.split('/').pop();

if (!token && path !== 'login.html' && path !== '') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // A. CARGAR DATOS DEL USUARIO EN EL HEADER
    // ==========================================
    if (usuarioLogueado) {
        // Extraer iniciales
        const inicial = usuarioLogueado.nombre ? usuarioLogueado.nombre.charAt(0).toUpperCase() : 'U';
        if(document.getElementById('user-initials')) document.getElementById('user-initials').textContent = inicial;
        
        // Poner nombre y rol en escritorio
        if(document.getElementById('user-display-name')) document.getElementById('user-display-name').textContent = `${usuarioLogueado.nombre} ${usuarioLogueado.apellido || ''}`;
        if(document.getElementById('user-display-role')) document.getElementById('user-display-role').textContent = usuarioLogueado.id_rol === 1 ? 'Administrador' : 'Usuario';
        
        // Poner nombre y rol en móvil
        if(document.getElementById('mobile-user-name')) document.getElementById('mobile-user-name').textContent = usuarioLogueado.nombre;
        if(document.getElementById('mobile-user-role')) document.getElementById('mobile-user-role').textContent = usuarioLogueado.id_rol === 1 ? 'Administrador' : 'Usuario';
    }

    // ==========================================
    // B. LÓGICA DEL MENÚ MÓVIL (Hamburguesa)
    // ==========================================
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const closeBtn = document.getElementById('mobile-drawer-close');

    function openMenu() {
        if(drawer) drawer.classList.remove('-translate-x-full');
        if(backdrop) backdrop.classList.remove('opacity-0', 'pointer-events-none');
        document.body.classList.add('overflow-hidden');
    }

    function closeMenu() {
        if(drawer) drawer.classList.add('-translate-x-full');
        if(backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // ==========================================
    // C. LÓGICA DEL DROPDOWN DE USUARIO (Header)
    // ==========================================
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // D. CERRAR SESIÓN (Desde Sidebar o Dropdown)
    // ==========================================
    const cerrarSesion = (e) => {
        if(e) e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    };

    const allLinks = document.querySelectorAll('a, button');
    allLinks.forEach(el => {
        if (el.textContent.includes('Cerrar Sesión') || el.id === 'btn-logout-dropdown') {
            el.addEventListener('click', cerrarSesion);
        }
    });

    // ==========================================
    // E. RESALTAR MENÚ ACTIVO (Móvil y PC)
    // ==========================================
    const navLinks = document.querySelectorAll('aside a');
    const currentPath = path || 'dashboard.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (link.textContent.includes('Cerrar Sesión')) return;

        link.classList.remove('text-primary', 'font-bold', 'border-r-4', 'border-primary', 'bg-primary-container/10');
        
        if (href === currentPath) {
            link.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-high');
            link.classList.add('text-primary', 'font-bold', 'border-r-4', 'border-primary', 'bg-primary-container/10');
        } else {
            link.classList.add('text-on-surface-variant', 'hover:bg-surface-container-high');
        }
    });

    // ==========================================
    // F. MODAL DE AJUSTES Y CAMBIO DE CONTRASEÑA
    // ==========================================
    const settingsModal = document.getElementById('settings-modal');
    const btnSettings = document.getElementById('btn-settings');
    const dropdownSettings = document.getElementById('dropdown-settings');
    const closeSettingsModal = document.getElementById('close-settings-modal');
    const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
    const changePasswordForm = document.getElementById('change-password-form');

    const toggleModal = () => {
        if(settingsModal) {
            settingsModal.classList.toggle('hidden');
            settingsModal.classList.toggle('flex');
            if(userDropdown) userDropdown.classList.add('hidden');
        }
    };

    if (btnSettings) btnSettings.addEventListener('click', toggleModal);
    if (dropdownSettings) dropdownSettings.addEventListener('click', (e) => { e.preventDefault(); toggleModal(); });
    if (closeSettingsModal) closeSettingsModal.addEventListener('click', toggleModal);
    if (cancelSettingsBtn) cancelSettingsBtn.addEventListener('click', toggleModal);

    // Lógica para enviar nueva contraseña
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const errorDiv = document.getElementById('settings-error');
            const successDiv = document.getElementById('settings-success');

            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');

            try {
                const response = await fetch(`http://localhost:4000/api/usuarios/${usuarioLogueado.id_usuario}/password`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    successDiv.textContent = '¡Contraseña actualizada correctamente!';
                    successDiv.classList.remove('hidden');
                    changePasswordForm.reset();
                    setTimeout(toggleModal, 2000); // Cerrar modal tras 2 seg
                } else {
                    throw new Error(data.error || 'Error al actualizar');
                }
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('hidden');
            }
        });
    }
});