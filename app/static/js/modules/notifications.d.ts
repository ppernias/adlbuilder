/**
 * Muestra una notificaciu00f3n en la interfaz de usuario
 * @param message Mensaje a mostrar
 * @param type Tipo de notificaciu00f3n: info, success o error
 * @param duration Duraciu00f3n en milisegundos (0 para no ocultar automu00e1ticamente)
 * @param id ID opcional para la notificaciu00f3n
 */
export declare function showNotification(message: string, type?: 'info' | 'success' | 'error', duration?: number, id?: string): void;
