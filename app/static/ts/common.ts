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
    // Update desktop menu
    const authenticatedMenu = document.getElementById('authenticated-menu');
    const unauthenticatedMenu = document.getElementById('unauthenticated-menu');
    
    if (authenticatedMenu && unauthenticatedMenu) {
      if (isAuthenticated) {
        authenticatedMenu.style.display = 'flex';
        unauthenticatedMenu.style.display = 'none';
      } else {
        authenticatedMenu.style.display = 'none';
        unauthenticatedMenu.style.display = 'flex';
      }
    }
    
    // Update mobile menu
    const authenticatedMobileMenu = document.getElementById('authenticated-mobile-menu');
    const unauthenticatedMobileMenu = document.getElementById('unauthenticated-mobile-menu');
    
    if (authenticatedMobileMenu && unauthenticatedMobileMenu) {
      if (isAuthenticated) {
        authenticatedMobileMenu.style.display = 'block';
        unauthenticatedMobileMenu.style.display = 'none';
      } else {
        authenticatedMobileMenu.style.display = 'none';
        unauthenticatedMobileMenu.style.display = 'block';
      }
    }
  }

  /**
   * Handles user logout
   */
  public static handleLogout(): void {
    // Clear token
    localStorage.removeItem('token');
    
    // Show notification
    NotificationManager.show({
      message: 'You have successfully logged out',
      type: 'success'
    });
    
    // Update UI
    this.updateUI(false);
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }

  /**
   * Checks if the user is authenticated
   * @returns Whether the user is authenticated
   */
  public static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
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
  // Toggle mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', UIManager.toggleMobileMenu);
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  const logoutMobileBtn = document.getElementById('logout-mobile-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', AuthenticationManager.handleLogout.bind(AuthenticationManager));
  }
  
  if (logoutMobileBtn) {
    logoutMobileBtn.addEventListener('click', AuthenticationManager.handleLogout.bind(AuthenticationManager));
  }
  
  // Check authentication on page load
  AuthenticationManager.updateUI(AuthenticationManager.isAuthenticated());
});

// Export classes to global scope for backward compatibility
(window as any).updateAuthenticationUI = AuthenticationManager.updateUI.bind(AuthenticationManager);
(window as any).showNotification = (message: string, type: NotificationType = 'info', duration: number = 5000) => {
  NotificationManager.show({ message, type, duration });
};
(window as any).removeNotification = NotificationManager.remove.bind(NotificationManager);
