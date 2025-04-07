/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*********************************!*\
  !*** ./app/static/ts/common.ts ***!
  \*********************************/

/**
 * ADL Builder - Common TypeScript Functions
 */
/**
 * Authentication module for handling user authentication state and UI updates
 */
var AuthenticationManager = /** @class */ (function () {
    function AuthenticationManager() {
    }
    /**
     * Updates the UI based on authentication status
     * @param isAuthenticated Whether the user is authenticated
     */
    AuthenticationManager.updateUI = function (isAuthenticated) {
        console.log('Actualizando UI con estado de autenticaciu00f3n:', isAuthenticated);
        // Si se ha ejecutado un logout, forzar isAuthenticated a false
        if (window.logoutExecuted) {
            console.log('Se detectu00f3 logout previo, forzando estado a deslogueado');
            isAuthenticated = false;
        }
        // Update desktop menu con estilos forzados
        var authenticatedMenu = document.getElementById('authenticated-menu');
        var unauthenticatedMenu = document.getElementById('unauthenticated-menu');
        if (authenticatedMenu && unauthenticatedMenu) {
            if (isAuthenticated) {
                authenticatedMenu.style.cssText = 'display: flex !important';
                unauthenticatedMenu.style.cssText = 'display: none !important';
            }
            else {
                authenticatedMenu.style.cssText = 'display: none !important';
                unauthenticatedMenu.style.cssText = 'display: flex !important';
            }
        }
        // Update mobile menu con estilos forzados
        var authenticatedMobileMenu = document.getElementById('authenticated-mobile-menu');
        var unauthenticatedMobileMenu = document.getElementById('unauthenticated-mobile-menu');
        if (authenticatedMobileMenu && unauthenticatedMobileMenu) {
            if (isAuthenticated) {
                authenticatedMobileMenu.style.cssText = 'display: block !important';
                unauthenticatedMobileMenu.style.cssText = 'display: none !important';
            }
            else {
                authenticatedMobileMenu.style.cssText = 'display: none !important';
                unauthenticatedMobileMenu.style.cssText = 'display: block !important';
            }
        }
        // Guardar el estado actual en sessionStorage para referencia
        sessionStorage.setItem('auth_state', isAuthenticated ? 'authenticated' : 'unauthenticated');
    };
    /**
     * Handles user logout
     */
    AuthenticationManager.handleLogout = function () {
        console.log('EJECUTANDO LOGOUT NUCLEAR');
        // Limpiar completamente la autenticación
        localStorage.clear();
        sessionStorage.clear();
        // Eliminar todas las cookies relacionadas con la autenticación
        document.cookie.split(';').forEach(function (c) {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        // Establecer una bandera para indicar que acabamos de hacer logout
        window.logoutExecuted = true;
        // Forzar cambios en el DOM directamente
        var authenticatedMenu = document.getElementById('authenticated-menu');
        var unauthenticatedMenu = document.getElementById('unauthenticated-menu');
        var authenticatedMobileMenu = document.getElementById('authenticated-mobile-menu');
        var unauthenticatedMobileMenu = document.getElementById('unauthenticated-mobile-menu');
        // Remover completamente los menús autenticados del DOM y recrearlos
        if (authenticatedMenu) {
            authenticatedMenu.innerHTML = '';
            authenticatedMenu.style.cssText = 'display: none !important';
            authenticatedMenu.setAttribute('aria-hidden', 'true');
        }
        if (authenticatedMobileMenu) {
            authenticatedMobileMenu.innerHTML = '';
            authenticatedMobileMenu.style.cssText = 'display: none !important';
            authenticatedMobileMenu.setAttribute('aria-hidden', 'true');
        }
        // Mostrar menús no autenticados
        if (unauthenticatedMenu) {
            unauthenticatedMenu.style.cssText = 'display: flex !important';
            unauthenticatedMenu.setAttribute('aria-hidden', 'false');
        }
        if (unauthenticatedMobileMenu) {
            unauthenticatedMobileMenu.style.cssText = 'display: block !important';
            unauthenticatedMobileMenu.setAttribute('aria-hidden', 'false');
        }
        // Forzar actualización de UI
        this.updateUI(false);
        // Notificar al usuario
        NotificationManager.show({
            message: 'Has cerrado sesión correctamente',
            type: 'success'
        });
        console.log('Logout completado, redirigiendo...');
        // Redirigir a la página de inicio con recarga forzada
        setTimeout(function () {
            // Usar location.replace para evitar que quede en el historial
            window.location.replace('/?force_logout=true&t=' + new Date().getTime());
        }, 300);
    };
    /**
     * Checks if the user is authenticated
     * @returns Whether the user is authenticated
     */
    AuthenticationManager.isAuthenticated = function () {
        // Verificar si se ha ejecutado un logout
        if (window.logoutExecuted === true) {
            console.log('Logout ejecutado previamente, forzando estado no autenticado');
            return false;
        }
        // Verificar si hay una bandera de logout en sessionStorage
        if (sessionStorage.getItem('just_logged_out') === 'true' ||
            sessionStorage.getItem('auth_state') === 'unauthenticated') {
            console.log('Bandera de logout detectada en sessionStorage');
            return false;
        }
        // Verificar si hay un parámetro de logout forzado en la URL
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('force_logout')) {
            console.log('Parámetro force_logout detectado en URL');
            return false;
        }
        // Verificar si existe el token
        var hasToken = !!localStorage.getItem('token');
        console.log('Estado de token:', hasToken ? 'Presente' : 'Ausente');
        return hasToken;
    };
    return AuthenticationManager;
}());
/**
 * Notification manager for displaying and managing notifications
 */
var NotificationManager = /** @class */ (function () {
    function NotificationManager() {
    }
    /**
     * Shows a notification to the user
     * @param options Notification options
     */
    NotificationManager.show = function (options) {
        var _this = this;
        var message = options.message, _a = options.type, type = _a === void 0 ? 'info' : _a, _b = options.duration, duration = _b === void 0 ? 5000 : _b;
        var container = document.getElementById('notification-container');
        if (!container)
            return;
        // Create notification element
        var notification = document.createElement('div');
        notification.className = 'notification mb-3 p-3 rounded-md shadow-md max-w-md transition-all duration-300 transform translate-x-full';
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-100', 'border-l-4', 'border-green-500', 'text-green-700');
                break;
            case 'error':
                notification.classList.add('bg-red-100', 'border-l-4', 'border-red-500', 'text-red-700');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-100', 'border-l-4', 'border-yellow-500', 'text-yellow-700');
                break;
            case 'info':
            default:
                notification.classList.add('bg-blue-100', 'border-l-4', 'border-blue-500', 'text-blue-700');
        }
        // Create content
        notification.innerHTML = "\n      <div class=\"flex justify-between items-start\">\n        <div>".concat(message, "</div>\n        <button class=\"ml-4 text-gray-500 hover:text-gray-700 focus:outline-none\" aria-label=\"Close\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-4 w-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\" />\n          </svg>\n        </button>\n      </div>\n    ");
        // Add notification to container
        container.appendChild(notification);
        // Add close button event listener
        var closeButton = notification.querySelector('button');
        if (closeButton) {
            closeButton.addEventListener('click', function () {
                _this.remove(notification);
            });
        }
        // Animate in
        setTimeout(function () {
            notification.classList.remove('translate-x-full');
        }, 10);
        // Auto remove after duration
        setTimeout(function () {
            _this.remove(notification);
        }, duration);
    };
    /**
     * Removes a notification with animation
     * @param notification The notification element to remove
     */
    NotificationManager.remove = function (notification) {
        // Animate out
        notification.classList.add('translate-x-full', 'opacity-0');
        // Remove from DOM after animation
        setTimeout(function () {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };
    return NotificationManager;
}());
/**
 * UI manager for handling UI interactions
 */
var UIManager = /** @class */ (function () {
    function UIManager() {
    }
    /**
     * Toggles the mobile menu visibility
     */
    UIManager.toggleMobileMenu = function () {
        var mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    };
    return UIManager;
}());
// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Inicializando aplicaciu00f3n...');
    // Verificar si venimos de un logout o si hay parámetros de forzar logout
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('nocache') || urlParams.has('force_logout') || urlParams.has('t')) {
        console.log('Detectada recarga despuu00e9s de logout o parámetro de forzar logout');
        // Limpiar completamente la autenticación
        localStorage.removeItem('token');
        sessionStorage.setItem('just_logged_out', 'true');
        sessionStorage.setItem('auth_state', 'unauthenticated');
        window.logoutExecuted = true;
        // Forzar actualizaciu00f3n de UI inmediatamente
        console.log('Forzando estado de logout');
        setTimeout(function () {
            AuthenticationManager.updateUI(false);
        }, 0);
    }
    // Toggle mobile menu
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', UIManager.toggleMobileMenu);
    }
    // Logout functionality - Usar bind para mantener el contexto correcto
    var logoutBtn = document.getElementById('logout-btn');
    var logoutMobileBtn = document.getElementById('logout-mobile-btn');
    if (logoutBtn) {
        // Eliminar cualquier event listener previo para evitar duplicados
        logoutBtn.replaceWith(logoutBtn.cloneNode(true));
        var newLogoutBtn = document.getElementById('logout-btn');
        if (newLogoutBtn) {
            newLogoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                AuthenticationManager.handleLogout();
            });
        }
    }
    if (logoutMobileBtn) {
        // Eliminar cualquier event listener previo para evitar duplicados
        logoutMobileBtn.replaceWith(logoutMobileBtn.cloneNode(true));
        var newLogoutMobileBtn = document.getElementById('logout-mobile-btn');
        if (newLogoutMobileBtn) {
            newLogoutMobileBtn.addEventListener('click', function (e) {
                e.preventDefault();
                AuthenticationManager.handleLogout();
            });
        }
    }
    // Check authentication on page load - Usar directamente la funciu00f3n para evitar problemas de contexto
    var isAuth = AuthenticationManager.isAuthenticated();
    console.log('Estado de autenticaciu00f3n:', isAuth);
    AuthenticationManager.updateUI(isAuth);
});
// Export classes to global scope for backward compatibility
window.updateAuthenticationUI = AuthenticationManager.updateUI.bind(AuthenticationManager);
window.showNotification = function (message, type, duration) {
    if (type === void 0) { type = 'info'; }
    if (duration === void 0) { duration = 5000; }
    NotificationManager.show({ message: message, type: type, duration: duration });
};
window.removeNotification = NotificationManager.remove.bind(NotificationManager);

/******/ })()
;
//# sourceMappingURL=common.js.map