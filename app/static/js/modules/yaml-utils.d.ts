import { ValidationResult } from './types';
/**
 * Valida el contenido YAML usando la API
 * @param yamlContent Contenido YAML a validar
 * @param showNotifications Si se deben mostrar notificaciones
 * @returns Resultado de la validaciu00f3n
 */
export declare function validateYaml(yamlContent: string, showNotifications?: boolean): Promise<ValidationResult>;
/**
 * Carga una plantilla de asistente desde el servidor
 * @returns Contenido YAML de la plantilla
 */
export declare function loadTemplate(): Promise<string>;
/**
 * Funciu00f3n centralizada para validar el contenido YAML y actualizar la UI
 * @param yamlContent Contenido YAML a validar
 * @param silentMode Si es true, no muestra notificaciones ni actualiza la UI
 * @returns true si el YAML es vu00e1lido, false si no lo es
 */
export declare function validateYamlContent(yamlContent: string, silentMode?: boolean): Promise<boolean>;
/**
 * Funciu00f3n para copiar el YAML al portapapeles
 */
export declare function copyYamlToClipboard(): Promise<void>;
