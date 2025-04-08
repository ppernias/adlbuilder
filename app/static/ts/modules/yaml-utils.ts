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
        const response = await fetch('/api/v1/assistants/validate', {
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
                // Mejorar el mensaje de error para hacerlo más informativo
                const errorMessages = data.errors || ['Unknown error'];
                const formattedErrors = errorMessages.map((err: string) => {
                    // Detectar tipos comunes de errores y proporcionar explicaciones más claras
                    if (err.includes('Required field')) {
                        const match = err.match(/\'([^']+)\'/);
                        const field = match ? match[1] : 'unknown';
                        return `Required field: '${field}' is missing in the YAML. This field is mandatory.`;
                    } else if (err.includes('must be')) {
                        return `Incorrect data type: ${err}. Verify that the value has the correct format.`;
                    } else if (err.includes('additional properties')) {
                        return `Not allowed property: ${err}. You have included a field that is not defined in the schema.`;
                    } else {
                        return `Error: ${err}`;
                    }
                }).join('\n');
                
                showNotification(`Errores de validación YAML:\n${formattedErrors}`, 'error');
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
        const clientErrors: string[] = [];
        // Verificar que el YAML tenga las secciones principales requeridas por el esquema
        if (!parsedYaml.metadata) {
            clientErrors.push('La sección \'metadata\' es obligatoria');
        }
        if (!parsedYaml.assistant_instructions) {
            clientErrors.push('La sección \'assistant_instructions\' es obligatoria');
        }
        
        // Si hay errores del cliente, mostrar y retornar
        if (clientErrors.length > 0) {
            if (!silentMode) {
                // Actualizar todos los elementos con ID 'validation-status'
                const validationStatusElements = document.querySelectorAll('#validation-status');
                validationStatusElements.forEach(validationStatus => {
                    // Mejorar la presentación de errores con explicaciones
                    const formattedErrors = clientErrors.map((err: string) => {
                        // Proporcionar explicaciones más detalladas para cada tipo de error
                        if (err.includes("'metadata' es obligatoria")) {
                            return `<div class="mb-1"><strong>Sección 'metadata' obligatoria:</strong> Debes incluir la sección 'metadata' en el YAML. Esta sección contiene información sobre el autor, descripción y otros metadatos del asistente.</div>`;
                        } else if (err.includes("'assistant_instructions' es obligatoria")) {
                            return `<div class="mb-1"><strong>Sección 'assistant_instructions' obligatoria:</strong> Debes incluir la sección 'assistant_instructions' en el YAML. Esta sección contiene las instrucciones y comportamiento del asistente.</div>`;
                        } else if (err.includes("El YAML no puede estar vacio")) {
                            return `<div class="mb-1"><strong>Documento vacío:</strong> El documento YAML no puede estar vacío. Debes proporcionar al menos la estructura básica del asistente con las secciones 'metadata' y 'assistant_instructions'.</div>`;
                        } else {
                            return `<div class="mb-1"><strong>Error de validación:</strong> ${err}</div>`;
                        }
                    }).join('');
                    
                    validationStatus.innerHTML = `<div class="flex items-center">
                        <span class="inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span class="text-red-700 font-medium">YAML inválido</span>
                    </div>
                    <div class="mt-2 text-sm text-red-600 validation-error-details">${formattedErrors}</div>`;
                });
                // Mejorar el mensaje de notificación para errores del cliente
                const formattedClientErrors = clientErrors.map((err: string) => {
                    if (err.includes("'metadata' es obligatoria")) {
                        return `Sección 'metadata' obligatoria: Debes incluir la sección de metadatos`;
                    } else if (err.includes("'assistant_instructions' es obligatoria")) {
                        return `Sección 'assistant_instructions' obligatoria: Debes incluir las instrucciones del asistente`;
                    } else {
                        return err;
                    }
                }).join(', ');
                showNotification(`YAML inválido: ${formattedClientErrors}`, 'error');
            }
            return false;
        }
        
        // Validar con el servidor
        const result = await validateYaml(yamlContent, !silentMode);
        
        // Actualizar UI si no estamos en modo silencioso
        if (!silentMode) {
            // Actualizar todos los elementos con ID 'validation-status'
            const validationStatusElements = document.querySelectorAll('#validation-status');
            validationStatusElements.forEach(validationStatus => {
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
                    // Mejorar la presentación de errores del servidor con explicaciones más detalladas
                    const errorList = result.errors || ['Error desconocido'];
                    const formattedErrors = errorList.map((err: string) => {
                        // Detectar tipos comunes de errores y proporcionar explicaciones más claras
                        if (err.includes('required property')) {
                            const match = err.match(/\'([^']+)\'/);
                            const field = match ? match[1] : 'desconocido';
                            return `<div class="mb-1"><strong>Campo requerido:</strong> '${field}' no está presente en el YAML. Este campo es obligatorio para que el asistente funcione correctamente.</div>`;
                        } else if (err.includes('must be')) {
                            return `<div class="mb-1"><strong>Tipo de dato incorrecto:</strong> ${err}. Verifica que el valor tenga el formato correcto según la documentación.</div>`;
                        } else if (err.includes('additional properties')) {
                            return `<div class="mb-1"><strong>Propiedad no permitida:</strong> ${err}. Has incluido un campo que no está definido en el esquema del asistente.</div>`;
                        } else if (err.includes('schema')) {
                            return `<div class="mb-1"><strong>Error de esquema:</strong> ${err}. La estructura del YAML no cumple con el esquema requerido.</div>`;
                        } else {
                            return `<div class="mb-1"><strong>Error:</strong> ${err}</div>`;
                        }
                    }).join('');
                    
                    validationStatus.innerHTML = `<div class="flex items-center">
                        <span class="inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span class="text-red-700 font-medium">Error de validación</span>
                    </div>
                    <div class="mt-2 text-sm text-red-600 validation-error-details">${formattedErrors}</div>`;
                }
            });
        }
        
        return result.valid;
    } catch (error) {
        // Error de sintaxis
        if (!silentMode) {
            // Actualizar todos los elementos con ID 'validation-status'
            const validationStatusElements = document.querySelectorAll('#validation-status');
            validationStatusElements.forEach(validationStatus => {
                // Mejorar la presentación de errores de sintaxis con explicaciones más detalladas
                const errorMsg = (error as Error).message;
                let formattedError = errorMsg;
                
                // Detect common syntax error types and provide clearer explanations
                if (errorMsg.includes('duplicated mapping key')) {
                    formattedError = `<strong>Duplicated key:</strong> ${errorMsg}. You have defined the same property more than once at the same level.`;
                } else if (errorMsg.includes('end of the stream') || errorMsg.includes('unexpected end')) {
                    formattedError = `<strong>Structure error:</strong> ${errorMsg}. Verify that all braces, brackets, and quotes are properly closed.`;
                } else if (errorMsg.includes('expected a mapping')) {
                    formattedError = `<strong>Format error:</strong> ${errorMsg}. An object (mapping) was expected but another data type was found.`;
                } else if (errorMsg.includes('cannot read')) {
                    formattedError = `<strong>Reading error:</strong> ${errorMsg}. The YAML document cannot be correctly interpreted.`;
                } else if (errorMsg.includes('YAML content cannot be empty')) {
                    formattedError = `<strong>Empty document:</strong> The YAML cannot be empty. You must provide at least the basic structure of the assistant with required fields: name, model, prompt.`;
                } else {
                    formattedError = `<strong>Syntax error:</strong> ${errorMsg}. Check the structure and format of your YAML document.`;
                }
                
                validationStatus.innerHTML = `<div class="flex items-center">
                    <span class="inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <span class="text-red-700 font-medium">Syntax Error</span>
                </div>
                <div class="mt-2 text-sm text-red-600 validation-error-details">${formattedError}</div>
                <div class="mt-1 text-xs text-gray-600">Required sections: metadata, assistant_instructions</div>`;
            });
            // Improve error message in notification
            const errorMsg = (error as Error).message;
            let formattedError = `YAML syntax error: ${errorMsg}`;
            
            // Provide more informative messages based on error type
            if (errorMsg.includes('duplicated mapping key')) {
                formattedError = `Syntax error: You have defined a duplicate property in the YAML. Check for repeated keys.`;
            } else if (errorMsg.includes('end of the stream') || errorMsg.includes('unexpected end')) {
                formattedError = `Syntax error: The YAML structure is incomplete. Verify that all braces and brackets are properly closed.`;
            } else if (errorMsg.includes('YAML content cannot be empty')) {
                formattedError = `Error: The YAML document cannot be empty. You must provide at least the basic structure of the assistant with required fields: name, model, prompt.`;
            }
            
            showNotification(formattedError, 'error', 10000); // Show for 10 seconds for better readability
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
        showNotification('YAML copied to clipboard', 'success');
    } catch (error) {
        showNotification(`Error copying: ${(error as Error).message}`, 'error');
    }
}
