/**
 * Activa una pestaña específica
 * @param tabId ID de la pestaña a activar (sin el sufijo '-tab')
 */
export declare function activateTab(tabId: string): void;
/**
 * Inicializa la pu00e1gina basada en los paru00e1metros de URL
 */
export declare function initializePage(): Promise<void>;
/**
 * Carga la plantilla por defecto
 */
export declare function loadDefaultTemplate(): Promise<void>;
