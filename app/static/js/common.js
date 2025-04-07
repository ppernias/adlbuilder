"use strict";
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
        // Update desktop menu
        var authenticatedMenu = document.getElementById('authenticated-menu');
        var unauthenticatedMenu = document.getElementById('unauthenticated-menu');
        if (authenticatedMenu && unauthenticatedMenu) {
            if (isAuthenticated) {
                authenticatedMenu.style.display = 'flex';
                unauthenticatedMenu.style.display = 'none';
            }
            else {
                authenticatedMenu.style.display = 'none';
                unauthenticatedMenu.style.display = 'flex';
            }
        }
        // Update mobile menu
        var authenticatedMobileMenu = document.getElementById('authenticated-mobile-menu');
        var unauthenticatedMobileMenu = document.getElementById('unauthenticated-mobile-menu');
        if (authenticatedMobileMenu && unauthenticatedMobileMenu) {
            if (isAuthenticated) {
                authenticatedMobileMenu.style.display = 'block';
                unauthenticatedMobileMenu.style.display = 'none';
            }
            else {
                authenticatedMobileMenu.style.display = 'none';
                unauthenticatedMobileMenu.style.display = 'block';
            }
        }
    };
    /**
     * Handles user logout
     */
    AuthenticationManager.handleLogout = function () {
        // Clear token from localStorage
        localStorage.removeItem('token');
        // Clear token cookie
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        // Show notification
        NotificationManager.show({
            message: 'You have successfully logged out',
            type: 'success'
        });
        // Update UI
        this.updateUI(false);
        // Redirect to home page
        setTimeout(function () {
            window.location.href = '/';
        }, 1000);
    };
    /**
     * Checks if the user is authenticated
     * @returns Whether the user is authenticated
     */
    AuthenticationManager.isAuthenticated = function () {
        return !!localStorage.getItem('token');
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
    // Toggle mobile menu
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', UIManager.toggleMobileMenu);
    }
    // Logout functionality
    var logoutBtn = document.getElementById('logout-btn');
    var logoutMobileBtn = document.getElementById('logout-mobile-btn');
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
window.updateAuthenticationUI = AuthenticationManager.updateUI.bind(AuthenticationManager);
window.showNotification = function (message, type, duration) {
    if (type === void 0) { type = 'info'; }
    if (duration === void 0) { duration = 5000; }
    NotificationManager.show({ message: message, type: type, duration: duration });
};
window.removeNotification = NotificationManager.remove.bind(NotificationManager);
//# sourceMappingURL=common.js.map