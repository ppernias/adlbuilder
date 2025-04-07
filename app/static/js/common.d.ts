/**
 * ADL Builder - Common TypeScript Functions
 */
type NotificationType = 'success' | 'error' | 'warning' | 'info';
interface NotificationOptions {
    message: string;
    type: NotificationType;
    duration?: number;
}
/**
 * Authentication module for handling user authentication state and UI updates
 */
declare class AuthenticationManager {
    /**
     * Updates the UI based on authentication status
     * @param isAuthenticated Whether the user is authenticated
     */
    static updateUI(isAuthenticated: boolean): void;
    /**
     * Handles user logout
     */
    static handleLogout(): void;
    /**
     * Checks if the user is authenticated
     * @returns Whether the user is authenticated
     */
    static isAuthenticated(): boolean;
}
/**
 * Notification manager for displaying and managing notifications
 */
declare class NotificationManager {
    /**
     * Shows a notification to the user
     * @param options Notification options
     */
    static show(options: NotificationOptions): void;
    /**
     * Removes a notification with animation
     * @param notification The notification element to remove
     */
    static remove(notification: HTMLElement): void;
}
/**
 * UI manager for handling UI interactions
 */
declare class UIManager {
    /**
     * Toggles the mobile menu visibility
     */
    static toggleMobileMenu(): void;
}
