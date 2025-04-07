/**
 * ADL Builder - Common TypeScript Functions
 */

// Type definitions
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  message: string;
  type: NotificationType;
  duration?: number;
}

/**
 * Authentication module for handling user authentication state and UI updates
 */
class AuthenticationManager {
  /**
   * Updates the UI based on authentication status
   * @param isAuthenticated Whether the user is authenticated
   */
  public static updateUI(isAuthenticated: boolean): void {
    console.log('Actualizando UI con estado de autenticaciu00f3n:', isAuthenticated);
    
    // Si se ha ejecutado un logout, forzar isAuthenticated a false
    if ((window as any).logoutExecuted) {
      console.log('Se detectu00f3 logout previo, forzando estado a deslogueado');
      isAuthenticated = false;
    }
    
    // Update desktop menu con estilos forzados
    const authenticatedMenu = document.getElementById('authenticated-menu');
    const unauthenticatedMenu = document.getElementById('unauthenticated-menu');
    
    if (authenticatedMenu && unauthenticatedMenu) {
      if (isAuthenticated) {
        authenticatedMenu.style.cssText = 'display: flex !important';
        unauthenticatedMenu.style.cssText = 'display: none !important';
      } else {
        authenticatedMenu.style.cssText = 'display: none !important';
        unauthenticatedMenu.style.cssText = 'display: flex !important';
      }
    }
    
    // Update mobile menu con estilos forzados
    const authenticatedMobileMenu = document.getElementById('authenticated-mobile-menu');
    const unauthenticatedMobileMenu = document.getElementById('unauthenticated-mobile-menu');
    
    if (authenticatedMobileMenu && unauthenticatedMobileMenu) {
      if (isAuthenticated) {
        authenticatedMobileMenu.style.cssText = 'display: block !important';
        unauthenticatedMobileMenu.style.cssText = 'display: none !important';
      } else {
        authenticatedMobileMenu.style.cssText = 'display: none !important';
        unauthenticatedMobileMenu.style.cssText = 'display: block !important';
      }
    }
    
    // Guardar el estado actual en sessionStorage para referencia
    sessionStorage.setItem('auth_state', isAuthenticated ? 'authenticated' : 'unauthenticated');
  }

  /**
   * Handles user logout
   */
  public static handleLogout(): void {
    console.log('EJECUTANDO LOGOUT NUCLEAR');
    
    // Limpiar completamente la autenticación
    localStorage.clear();
    sessionStorage.clear();
    
    // Eliminar todas las cookies relacionadas con la autenticación
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    
    // Establecer una bandera para indicar que acabamos de hacer logout
    (window as any).logoutExecuted = true;
    
    // Forzar cambios en el DOM directamente
    const authenticatedMenu = document.getElementById('authenticated-menu');
    const unauthenticatedMenu = document.getElementById('unauthenticated-menu');
    const authenticatedMobileMenu = document.getElementById('authenticated-mobile-menu');
    const unauthenticatedMobileMenu = document.getElementById('unauthenticated-mobile-menu');
    
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
    setTimeout(() => {
      // Usar location.replace para evitar que quede en el historial
      window.location.replace('/?force_logout=true&t=' + new Date().getTime());
    }, 300);
  }

  /**
   * Checks if the user is authenticated
   * @returns Whether the user is authenticated
   */
  public static isAuthenticated(): boolean {
    // Verificar si se ha ejecutado un logout
    if ((window as any).logoutExecuted === true) {
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('force_logout')) {
      console.log('Parámetro force_logout detectado en URL');
      return false;
    }
    
    // Verificar si existe el token
    const hasToken = !!localStorage.getItem('token');
    console.log('Estado de token:', hasToken ? 'Presente' : 'Ausente');
    return hasToken;
  }
}

/**
 * Notification manager for displaying and managing notifications
 */
class NotificationManager {
  /**
   * Shows a notification to the user
   * @param options Notification options
   */
  public static show(options: NotificationOptions): void {
    const { message, type = 'info', duration = 5000 } = options;
    const container = document.getElementById('notification-container');
    
    if (!container) return;
    
    // Create notification element
    const notification = document.createElement('div');
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
    notification.innerHTML = `
      <div class="flex justify-between items-start">
        <div>${message}</div>
        <button class="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;
    
    // Add notification to container
    container.appendChild(notification);
    
    // Add close button event listener
    const closeButton = notification.querySelector('button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.remove(notification);
      });
    }
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
      this.remove(notification);
    }, duration);
  }

  /**
   * Removes a notification with animation
   * @param notification The notification element to remove
   */
  public static remove(notification: HTMLElement): void {
    // Animate out
    notification.classList.add('translate-x-full', 'opacity-0');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

/**
 * UI manager for handling UI interactions
 */
class UIManager {
  /**
   * Toggles the mobile menu visibility
   */
  public static toggleMobileMenu(): void {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando aplicaciu00f3n...');
  
  // Verificar si venimos de un logout o si hay parámetros de forzar logout
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('nocache') || urlParams.has('force_logout') || urlParams.has('t')) {
    console.log('Detectada recarga despuu00e9s de logout o parámetro de forzar logout');
    
    // Limpiar completamente la autenticación
    localStorage.removeItem('token');
    sessionStorage.setItem('just_logged_out', 'true');
    sessionStorage.setItem('auth_state', 'unauthenticated');
    (window as any).logoutExecuted = true;
    
    // Forzar actualizaciu00f3n de UI inmediatamente
    console.log('Forzando estado de logout');
    setTimeout(() => {
      AuthenticationManager.updateUI(false);
    }, 0);
  }
  
  // Toggle mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', UIManager.toggleMobileMenu);
  }
  
  // Logout functionality - Usar bind para mantener el contexto correcto
  const logoutBtn = document.getElementById('logout-btn');
  const logoutMobileBtn = document.getElementById('logout-mobile-btn');
  
  if (logoutBtn) {
    // Eliminar cualquier event listener previo para evitar duplicados
    logoutBtn.replaceWith(logoutBtn.cloneNode(true));
    const newLogoutBtn = document.getElementById('logout-btn');
    if (newLogoutBtn) {
      newLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AuthenticationManager.handleLogout();
      });
    }
  }
  
  if (logoutMobileBtn) {
    // Eliminar cualquier event listener previo para evitar duplicados
    logoutMobileBtn.replaceWith(logoutMobileBtn.cloneNode(true));
    const newLogoutMobileBtn = document.getElementById('logout-mobile-btn');
    if (newLogoutMobileBtn) {
      newLogoutMobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AuthenticationManager.handleLogout();
      });
    }
  }
  
  // Check authentication on page load - Usar directamente la funciu00f3n para evitar problemas de contexto
  const isAuth = AuthenticationManager.isAuthenticated();
  console.log('Estado de autenticaciu00f3n:', isAuth);
  AuthenticationManager.updateUI(isAuth);
});

// Export classes to global scope for backward compatibility
(window as any).updateAuthenticationUI = AuthenticationManager.updateUI.bind(AuthenticationManager);
(window as any).showNotification = (message: string, type: NotificationType = 'info', duration: number = 5000) => {
  NotificationManager.show({ message, type, duration });
};
(window as any).removeNotification = NotificationManager.remove.bind(NotificationManager);
