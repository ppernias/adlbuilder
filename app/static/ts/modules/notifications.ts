// notifications.ts - Sistema de notificaciones

/**
 * Muestra una notificaciu00f3n en la interfaz de usuario
 * @param message Mensaje a mostrar
 * @param type Tipo de notificaciu00f3n: info, success o error
 * @param duration Duraciu00f3n en milisegundos (0 para no ocultar automu00e1ticamente)
 * @param id ID opcional para la notificaciu00f3n
 */
export function showNotification(message: string, type: 'info' | 'success' | 'error' = 'info', duration: number = 3000, id?: string): void {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        // Create notification container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `px-4 py-3 rounded-md shadow-lg transition-all transform translate-x-0 duration-300 flex items-center ${
        type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
        type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 
        'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
    }`;
    
    // Add ID if provided
    if (id) {
        notification.id = `notification-${id}`;
    }
    
    // Add icon based on type
    let icon = '';
    if (type === 'success') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>`;
    } else if (type === 'error') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>`;
    } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>`;
    }
    
    // Support for multiline messages (convert newlines to <br>)
    const formattedMessage = message.replace(/\n/g, '<br>');
    notification.innerHTML = `${icon}<span>${formattedMessage}</span>`;
    
    // Add to container
    document.getElementById('notification-container')?.appendChild(notification);
    
    // Add entrance animation
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(20px)';
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after specified duration (only if duration > 0)
    if (duration > 0) {
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
}
