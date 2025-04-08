// populate-form.ts - Función para poblar el formulario desde YAML

import { AssistantData, CustomWindow } from './types';
import { showNotification } from './notifications';
import { activateTab } from './page';

// Crear una referencia tipada al objeto window
const customWindow = window as CustomWindow;

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
        const metadata = data.metadata || {};
        const instructions = data.assistant_instructions || {};
        
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
            if (typeof metadata.description === 'object' && metadata.description?.summary) {
                descInput.value = metadata.description.summary;
            } else {
                descInput.value = metadata.description || data.description || '';
            }
        }
        if (versionInput) versionInput.value = metadata.version || data.version || '';
        if (modelInput) modelInput.value = metadata.model || data.model || '';
        
        // Rellenar campos de instrucciones
        if (instructions.role && promptInput) {
            promptInput.value = instructions.role;
        }
        if (instructions.system_prompt && systemPromptInput) {
            systemPromptInput.value = instructions.system_prompt;
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
        
        // Procesar herramientas (tools)
        const tools = instructions.tools || data.tools || {};
        
        // Agregar comandos desde la estructura anidada
        if (tools.commands && commandsContainer) {
            Object.entries(tools.commands).forEach(([key, commandData]) => {
                const command = commandData as any;
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
                            <input type="text" name="command-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${key.replace(/^\//, '')}" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre para mostrar</label>
                            <input type="text" name="command-display-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${command.display_name || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input type="text" name="command-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${command.description || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                            <textarea name="command-prompt[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">${command.prompt || ''}</textarea>
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
        } else if (data.commands && data.commands.length > 0 && commandsContainer) {
            // Compatibilidad con el formato anterior (array de comandos)
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
        
        // Agregar opciones desde la estructura anidada
        if (tools.options && optionsContainer) {
            Object.entries(tools.options).forEach(([key, optionData]) => {
                const option = optionData as any;
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
                            <input type="text" name="option-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${key.replace(/^\//, '')}" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre para mostrar</label>
                            <input type="text" name="option-display-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${option.display_name || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input type="text" name="option-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${option.description || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                            <textarea name="option-prompt[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">${option.prompt || ''}</textarea>
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
        } else if (data.options && data.options.length > 0 && optionsContainer) {
            // Compatibilidad con el formato anterior (array de opciones)
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
        
        // Agregar decoradores desde la estructura anidada
        if (tools.decorators && decoratorsContainer) {
            Object.entries(tools.decorators).forEach(([key, decoratorData]) => {
                const decorator = decoratorData as any;
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
                            <input type="text" name="decorator-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${key.replace(/^\+\+\+/, '')}" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre para mostrar</label>
                            <input type="text" name="decorator-display-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${decorator.display_name || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input type="text" name="decorator-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${decorator.description || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                            <textarea name="decorator-prompt[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">${decorator.prompt || ''}</textarea>
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
        } else if (data.decorators && data.decorators.length > 0 && decoratorsContainer) {
            // Compatibilidad con el formato anterior (array de decoradores)
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
        showNotification(`Error al cargar YAML: ${(error as Error).message}`, 'error');
    }
}
