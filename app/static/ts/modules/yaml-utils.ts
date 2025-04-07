// yaml-utils.ts - Funciones relacionadas con YAML

import { ValidationResult, CustomWindow } from './types';
import { showNotification } from './notifications';

// Crear una referencia tipada al objeto window
const customWindow = window as CustomWindow;

/**
 * Valida el contenido YAML usando la API
 * @param yamlContent Contenido YAML a validar
 * @param showNotifications Si se deben mostrar notificaciones
 * @returns Resultado de la validaciu00f3n
 */
export async function validateYaml(yamlContent: string, showNotifications: boolean = true): Promise<ValidationResult> {
    try {
        const response = await fetch('/api/v1/assistants/validate-yaml', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ yaml_content: yamlContent }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de validaciu00f3n: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        
        if (showNotifications) {
            if (data.valid) {
                showNotification('YAML validado correctamente', 'success');
            } else {
                const errorMessage = data.errors?.join('\n') || 'Error desconocido';
                showNotification(`Error de validaciu00f3n:\n${errorMessage}`, 'error');
            }
        }
        
        return data;
    } catch (error) {
        if (showNotifications) {
            showNotification(`Error: ${(error as Error).message}`, 'error');
        }
        return { valid: false, errors: [(error as Error).message] };
    }
}

/**
 * Carga una plantilla de asistente desde el servidor
 * @returns Contenido YAML de la plantilla
 */
export async function loadTemplate(): Promise<string> {
    try {
        const response = await fetch('/api/v1/assistants/template', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        
        if (!response.ok) {
            throw new Error(`Error al cargar la plantilla: ${response.status}`);
        }
        
        const data = await response.json();
        return data.yaml_content || '';
    } catch (error) {
        showNotification(`Error al cargar la plantilla: ${(error as Error).message}`, 'error');
        return '';
    }
}

/**
 * Funciu00f3n centralizada para validar el contenido YAML y actualizar la UI
 * @param yamlContent Contenido YAML a validar
 * @param silentMode Si es true, no muestra notificaciones ni actualiza la UI
 * @returns true si el YAML es vu00e1lido, false si no lo es
 */
export async function validateYamlContent(yamlContent: string, silentMode: boolean = false): Promise<boolean> {
    try {
        // Validar sintaxis YAML bu00e1sica (cliente)
        const parsedYaml = customWindow.jsyaml?.load(yamlContent);
        if (!parsedYaml) {
            throw new Error('El YAML no puede estar vacio');
        }
        
        // Validar campos requeridos
        const clientErrors = [];
        if (!parsedYaml.name) {
            clientErrors.push('El campo \'name\' es obligatorio');
        }
        
        // Si hay errores del cliente, mostrar y retornar
        if (clientErrors.length > 0) {
            if (!silentMode) {
                const validationStatus = document.getElementById('validation-status');
                if (validationStatus) {
                    validationStatus.innerHTML = `<div class="flex items-center">
                        <span class="inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span class="text-red-700 font-medium">YAML invu00e1lido</span>
                    </div>
                    <div class="mt-2 text-sm text-red-600">${clientErrors.map(err => `<div class="mb-1">${err}</div>`).join('')}</div>`;
                }
                showNotification(`YAML invu00e1lido: ${clientErrors.join(', ')}`, 'error');
            }
            return false;
        }
        
        // Validar con el servidor
        const result = await validateYaml(yamlContent, !silentMode);
        
        // Actualizar UI si no estamos en modo silencioso
        if (!silentMode) {
            const validationStatus = document.getElementById('validation-status');
            if (validationStatus) {
                if (result.valid) {
                    validationStatus.innerHTML = `<div class="flex items-center">
                        <span class="inline-flex items-center justify-center p-1 bg-green-100 text-green-700 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span class="text-green-700 font-medium">Sintaxis YAML vu00e1lida</span>
                    </div>`;
                } else {
                    const errorMessages = result.errors?.join('<br>') || 'Error desconocido';
                    validationStatus.innerHTML = `<div class="flex items-center">
                        <span class="inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span class="text-red-700 font-medium">Error de validaciu00f3n</span>
                    </div>
                    <div class="mt-2 text-sm text-red-600">${errorMessages}</div>`;
                }
            }
        }
        
        return result.valid;
    } catch (error) {
        // Error de sintaxis
        if (!silentMode) {
            const validationStatus = document.getElementById('validation-status');
            if (validationStatus) {
                validationStatus.innerHTML = `<div class="flex items-center">
                    <span class="inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <span class="text-red-700 font-medium">Error de sintaxis</span>
                </div>
                <div class="mt-2 text-sm text-red-600">${(error as Error).message}</div>`;
            }
            showNotification(`Error de sintaxis YAML: ${(error as Error).message}`, 'error');
        }
        return false;
    }
}

/**
 * Funciu00f3n para copiar el YAML al portapapeles
 */
export async function copyYamlToClipboard(): Promise<void> {
    try {
        // Get YAML content from CodeMirror
        const yamlContent = customWindow.yamlEditor?.getValue() || '';
        
        // Copy to clipboard
        await navigator.clipboard.writeText(yamlContent);
        
        // Show success notification
        showNotification('YAML copiado al portapapeles', 'success');
    } catch (error) {
        showNotification(`Error al copiar: ${(error as Error).message}`, 'error');
    }
}
