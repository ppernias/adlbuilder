// form-utils.ts - Funciones para manejar formularios

import { AssistantData, CustomWindow } from './types';
import { showNotification } from './notifications';
import { validateYamlContent } from './yaml-utils';
import { activateTab } from './page';

// Crear una referencia tipada al objeto window
const customWindow = window as CustomWindow;

/**
 * Genera YAML a partir de los datos del formulario
 * @param formElement Elemento del formulario
 * @returns Contenido YAML generado
 */
export function generateYamlFromForm(formElement: HTMLFormElement): string {
    // Recopilar datos bu00e1sicos
    const formData = new FormData(formElement);
    const assistantData: AssistantData = {
        name: formData.get('name') as string || '',
        description: formData.get('description') as string || undefined,
        version: formData.get('version') as string || undefined,
        model: formData.get('model') as string || undefined,
        prompt: formData.get('prompt') as string || undefined,
        system_prompt: formData.get('system_prompt') as string || undefined,
        commands: [],
        options: [],
        decorators: []
    };
    
    // Filtrar campos vaciu00f3os
    Object.keys(assistantData).forEach(key => {
        const value = assistantData[key as keyof AssistantData];
        if (value === '' || value === undefined) {
            delete assistantData[key as keyof AssistantData];
        }
    });
    
    // Recopilar comandos
    const commandsContainer = document.getElementById('commands-container');
    if (commandsContainer) {
        const commandItems = commandsContainer.querySelectorAll('.command-item');
        commandItems.forEach(item => {
            const nameInput = item.querySelector('[name^="command-name"]') as HTMLInputElement;
            const descInput = item.querySelector('[name^="command-description"]') as HTMLInputElement;
            const examplesInput = item.querySelector('[name^="command-examples"]') as HTMLTextAreaElement;
            
            if (nameInput && nameInput.value) {
                const command = {
                    name: nameInput.value,
                    description: descInput?.value || undefined,
                    examples: examplesInput?.value ? examplesInput.value.split('\n').map(e => e.trim()).filter(e => e) : undefined
                };
                
                // Filtrar campos vaciu00f3os
                Object.keys(command).forEach(key => {
                    const value = command[key as keyof typeof command];
                    if (value === '' || value === undefined) {
                        delete command[key as keyof typeof command];
                    }
                });
                
                assistantData.commands = assistantData.commands || [];
                assistantData.commands.push(command);
            }
        });
    }
    
    // Recopilar opciones
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        const optionItems = optionsContainer.querySelectorAll('.option-item');
        optionItems.forEach(item => {
            const nameInput = item.querySelector('[name^="option-name"]') as HTMLInputElement;
            const descInput = item.querySelector('[name^="option-description"]') as HTMLInputElement;
            const typeInput = item.querySelector('[name^="option-type"]') as HTMLSelectElement;
            const defaultInput = item.querySelector('[name^="option-default"]') as HTMLInputElement;
            
            if (nameInput && nameInput.value && typeInput && typeInput.value) {
                // Crear objeto base
                const baseOption: { 
                    name: string; 
                    description?: string; 
                    type: string;
                } = {
                    name: nameInput.value,
                    description: descInput?.value || undefined,
                    type: typeInput.value
                };
                
                // Crear objeto final con el tipo correcto para default
                let option: any;
                
                if (defaultInput?.value) {
                    if (typeInput.value === 'boolean') {
                        option = {
                            ...baseOption,
                            default: defaultInput.value.toLowerCase() === 'true'
                        };
                    } else if (typeInput.value === 'number') {
                        option = {
                            ...baseOption,
                            default: Number(defaultInput.value)
                        };
                    } else {
                        option = {
                            ...baseOption,
                            default: defaultInput.value
                        };
                    }
                } else {
                    option = baseOption;
                }
                
                // Filtrar campos vaciu00f3os
                Object.keys(option).forEach(key => {
                    const value = option[key as keyof typeof option];
                    if (value === '' || value === undefined) {
                        delete option[key as keyof typeof option];
                    }
                });
                
                assistantData.options = assistantData.options || [];
                assistantData.options.push(option);
            }
        });
    }
    
    // Recopilar decoradores
    const decoratorsContainer = document.getElementById('decorators-container');
    if (decoratorsContainer) {
        const decoratorItems = decoratorsContainer.querySelectorAll('.decorator-item');
        decoratorItems.forEach(item => {
            const nameInput = item.querySelector('[name^="decorator-name"]') as HTMLInputElement;
            const descInput = item.querySelector('[name^="decorator-description"]') as HTMLInputElement;
            const patternInput = item.querySelector('[name^="decorator-pattern"]') as HTMLInputElement;
            
            if (nameInput && nameInput.value && patternInput && patternInput.value) {
                const decorator = {
                    name: nameInput.value,
                    description: descInput?.value || undefined,
                    pattern: patternInput.value
                };
                
                // Filtrar campos vaciu00f3os
                Object.keys(decorator).forEach(key => {
                    const value = decorator[key as keyof typeof decorator];
                    if (value === '' || value === undefined) {
                        delete decorator[key as keyof typeof decorator];
                    }
                });
                
                assistantData.decorators = assistantData.decorators || [];
                assistantData.decorators.push(decorator);
            }
        });
    }
    
    // Convertir a YAML
    try {
        return customWindow.jsyaml?.dump(assistantData) || '';
    } catch (error) {
        showNotification(`Error al generar YAML: ${(error as Error).message}`, 'error');
        return '';
    }
}

/**
 * Rellena el formulario con los datos del YAML
 * @param yamlContent Contenido YAML
 */
export function populateFormFromYaml(yamlContent: string): void {
    try {
        // Parsear YAML
        const data = customWindow.jsyaml?.load(yamlContent) as AssistantData;
        if (!data) {
            throw new Error('YAML inválido o vacío');
        }
        
        console.log('Populating form with YAML data:', data);
        
        // Extraer datos de metadata y assistant_instructions si existen
        const metadata = data.metadata || data;
        const instructions = data.assistant_instructions || data;
        
        // Rellenar campos básicos desde metadata o del objeto principal
        const nameInput = document.querySelector('[name="name"]') as HTMLInputElement;
        const descInput = document.querySelector('[name="description"]') as HTMLTextAreaElement;
        const versionInput = document.querySelector('[name="version"]') as HTMLInputElement;
        const modelInput = document.querySelector('[name="model"]') as HTMLInputElement;
        const promptInput = document.querySelector('[name="prompt"]') as HTMLTextAreaElement;
        const systemPromptInput = document.querySelector('[name="system_prompt"]') as HTMLTextAreaElement;
        
        // Rellenar campos de metadata
        if (nameInput) nameInput.value = metadata.name || data.name || '';
        if (descInput) {
            // Si hay una descripción anidada en metadata, usar el campo summary
            if (typeof metadata.description === 'object' && metadata.description !== null) {
                const descObj = metadata.description as any;
                if (descObj.summary) {
                    descInput.value = descObj.summary;
                }
            } else {
                descInput.value = metadata.description || data.description || '';
            }
        }
        if (versionInput) versionInput.value = metadata.version || data.version || '';
        if (modelInput) modelInput.value = metadata.model || data.model || '';
        
        // Rellenar campos de instrucciones
        if (instructions.prompt && promptInput) {
            promptInput.value = instructions.prompt;
        } else if (data.prompt && promptInput) {
            promptInput.value = data.prompt;
        }
        
        if (instructions.system_prompt && systemPromptInput) {
            systemPromptInput.value = instructions.system_prompt;
        } else if (data.system_prompt && systemPromptInput) {
            systemPromptInput.value = data.system_prompt;
        }
        
        // Activar la pestaña de Metadata
        activateTab('metadata');
        
        // Limpiar contenedores existentes
        const commandsContainer = document.getElementById('commands-container');
        const optionsContainer = document.getElementById('options-container');
        const decoratorsContainer = document.getElementById('decorators-container');
        
        if (commandsContainer) commandsContainer.innerHTML = '';
        if (optionsContainer) optionsContainer.innerHTML = '';
        if (decoratorsContainer) decoratorsContainer.innerHTML = '';
        
        // Agregar comandos
        if (data.commands && data.commands.length > 0 && commandsContainer) {
            data.commands.forEach(command => {
                const commandItem = document.createElement('div');
                commandItem.className = 'command-item bg-gray-50 p-4 rounded-md mb-4';
                commandItem.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-lg font-medium">Comando</h4>
                        <button type="button" class="remove-item-btn text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                            <input type="text" name="command-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${command.name || ''}" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input type="text" name="command-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${command.description || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ejemplos (uno por línea)</label>
                            <textarea name="command-examples[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">${command.examples ? command.examples.join('\n') : ''}</textarea>
                        </div>
                    </div>
                `;
                
                // Agregar evento para eliminar
                const removeBtn = commandItem.querySelector('.remove-item-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        commandItem.remove();
                    });
                }
                
                commandsContainer.appendChild(commandItem);
            });
        }
        
        // Agregar opciones
        if (data.options && data.options.length > 0 && optionsContainer) {
            data.options.forEach(option => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item bg-gray-50 p-4 rounded-md mb-4';
                optionItem.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-lg font-medium">Opción</h4>
                        <button type="button" class="remove-item-btn text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                            <input type="text" name="option-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${option.name || ''}" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input type="text" name="option-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${option.description || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo <span class="text-red-500">*</span></label>
                            <select name="option-type[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                <option value="string" ${option.type === 'string' ? 'selected' : ''}>String</option>
                                <option value="boolean" ${option.type === 'boolean' ? 'selected' : ''}>Boolean</option>
                                <option value="number" ${option.type === 'number' ? 'selected' : ''}>Number</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Valor por defecto</label>
                            <input type="text" name="option-default[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${option.default !== undefined ? option.default : ''}">
                        </div>
                    </div>
                `;
                
                // Agregar evento para eliminar
                const removeBtn = optionItem.querySelector('.remove-item-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        optionItem.remove();
                    });
                }
                
                optionsContainer.appendChild(optionItem);
            });
        }
        
        // Agregar decoradores
        if (data.decorators && data.decorators.length > 0 && decoratorsContainer) {
            data.decorators.forEach(decorator => {
                const decoratorItem = document.createElement('div');
                decoratorItem.className = 'decorator-item bg-gray-50 p-4 rounded-md mb-4';
                decoratorItem.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-lg font-medium">Decorador</h4>
                        <button type="button" class="remove-item-btn text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                            <input type="text" name="decorator-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${decorator.name || ''}" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input type="text" name="decorator-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${decorator.description || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Patrón <span class="text-red-500">*</span></label>
                            <input type="text" name="decorator-pattern[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${decorator.pattern || ''}" required>
                        </div>
                    </div>
                `;
                
                // Agregar evento para eliminar
                const removeBtn = decoratorItem.querySelector('.remove-item-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        decoratorItem.remove();
                    });
                }
                
                decoratorsContainer.appendChild(decoratorItem);
            });
        }
        
        // Actualizar el editor YAML con el contenido cargado
        const yamlEditor = document.getElementById('yaml-editor');
        if (yamlEditor) {
            // Si estamos usando CodeMirror
            if (customWindow.yamlEditor) {
                customWindow.yamlEditor.setValue(yamlContent);
            } else {
                // Si es un textarea normal
                (yamlEditor as HTMLTextAreaElement).value = yamlContent;
            }
        }
        
        // Mostrar notificación de éxito
        showNotification('YAML cargado correctamente', 'success');
    } catch (error) {
        console.error('Error al cargar el YAML:', error);
        showNotification(`Error al cargar YAML: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
    }
}

/**
 * Maneja el enviu00f3o del formulario
 * @param event Evento de submit
 */
export async function handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formMode = document.getElementById('form-mode')?.getAttribute('value');
    const assistantId = document.getElementById('assistant-id')?.getAttribute('value');
    
    try {
        // Generar YAML desde el formulario
        const yamlContent = generateYamlFromForm(form);
        
        // Validar YAML
        const isValid = await validateYamlContent(yamlContent);
        if (!isValid) {
            return; // La validaciu00f3n ya muestra los errores
        }
        
        // Actualizar campo oculto con el YAML
        const yamlContentField = document.getElementById('yaml-content') as HTMLInputElement;
        if (yamlContentField) {
            yamlContentField.value = yamlContent;
        }
        
        // Enviar formulario
        const formData = new FormData(form);
        const url = formMode === 'edit' && assistantId 
            ? `/api/v1/assistants/${assistantId}` 
            : '/api/v1/assistants/';
        
        const response = await fetch(url, {
            method: formMode === 'edit' ? 'PUT' : 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al guardar: ${response.status} ${errorText}`);
        }
        
        // Redirigir a la lista de asistentes
        showNotification('Asistente guardado correctamente', 'success');
        setTimeout(() => {
            window.location.href = '/assistants';
        }, 1000);
        
    } catch (error) {
        showNotification(`Error: ${(error as Error).message}`, 'error');
    }
}
