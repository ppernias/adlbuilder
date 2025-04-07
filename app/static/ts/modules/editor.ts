// editor.ts - Funcionalidad especu00edfica del editor YAML

import { CustomWindow } from './types';
import { showNotification } from './notifications';
import { validateYamlContent } from './yaml-utils';
import { populateFormFromYaml, generateYamlFromForm } from './form-utils';

// Crear una referencia tipada al objeto window
const customWindow = window as CustomWindow;

/**
 * Inicializa el editor YAML con CodeMirror
 */
export function initializeEditor(): void {
    // Initialize CodeMirror for YAML editor
    const yamlEditorElement = document.getElementById('yaml-editor') as HTMLTextAreaElement;
    if (yamlEditorElement) {
        // This assumes CodeMirror is loaded globally
        // @ts-ignore - CodeMirror is loaded via script tag
        const editor = CodeMirror.fromTextArea(yamlEditorElement, {
            mode: 'yaml',
            lineNumbers: true,
            theme: 'default',
            indentUnit: 2,
            tabSize: 2,
            lineWrapping: true,
            extraKeys: {
                'Tab': function(cm: any) {
                    // Insert spaces instead of tab character
                    const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                    cm.replaceSelection(spaces);
                }
            }
        });
        
        // Store editor instance in window for global access
        customWindow.yamlEditor = editor;
        
        // Set up validation on change
        editor.on('change', () => {
            // Clear previous timeout
            if (customWindow.yamlValidationTimeout) {
                clearTimeout(customWindow.yamlValidationTimeout);
            }
            
            // Esperar 800ms despuu00e9s de que el usuario deje de escribir para validar
            customWindow.yamlValidationTimeout = setTimeout(async () => {
                const yamlContent = editor.getValue();
                if (yamlContent.trim()) {
                    // Usar la funciu00f3n centralizada para validar (modo silencioso)
                    await validateYamlContent(yamlContent, true);
                }
            }, 800);
        });
        
        // Set up tab switching
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = (tab as HTMLElement).getAttribute('data-tab');
                const currentActiveTab = document.querySelector('.tab.active')?.getAttribute('data-tab');
                
                // Don't do anything if clicking the already active tab
                if (targetTab === currentActiveTab) return;
                
                // Deactivate all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Hide all tab contents
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => content.classList.add('hidden'));
                
                // Activate clicked tab
                tab.classList.add('active');
                
                // Show corresponding tab content
                const targetContent = document.getElementById(`${targetTab}-content`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
                
                // If switching to YAML tab, update the editor content from form
                if (targetTab === 'yaml' && currentActiveTab === 'form') {
                    try {
                        const form = document.getElementById('assistant-form') as HTMLFormElement;
                        if (form && customWindow.yamlEditor) {
                            // Get current cursor position to restore it later
                            const cursor = customWindow.yamlEditor.getCursor();
                            
                            // Generate YAML from form and update editor
                            const yamlContent = generateYamlFromForm(form);
                            customWindow.yamlEditor.setValue(yamlContent);
                            
                            // Restore cursor position
                            customWindow.yamlEditor.setCursor(cursor);
                            
                            // Validate the YAML
                            validateYamlContent(yamlContent, true);
                        }
                    } catch (error) {
                        showNotification(`Error al generar YAML: ${(error as Error).message}`, 'error');
                    }
                }
                // If switching to Form tab, update form from YAML
                else if (targetTab === 'form' && currentActiveTab === 'yaml') {
                    try {
                        if (customWindow.yamlEditor) {
                            const yamlContent = customWindow.yamlEditor.getValue();
                            if (yamlContent.trim()) {
                                // Validate before populating form
                                validateYamlContent(yamlContent, false).then(isValid => {
                                    if (isValid) {
                                        populateFormFromYaml(yamlContent);
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        showNotification(`Error al cargar formulario: ${(error as Error).message}`, 'error');
                    }
                }
            });
        });
    }
    
    // Set up validation button
    const validateYamlBtn = document.getElementById('validate-yaml-btn');
    if (validateYamlBtn) {
        validateYamlBtn.addEventListener('click', async () => {
            let yamlContent = '';
            
            // Get content from CodeMirror if available
            if (customWindow.yamlEditor) {
                yamlContent = customWindow.yamlEditor.getValue();
            } else {
                const yamlEditor = document.getElementById('yaml-editor') as HTMLTextAreaElement;
                if (yamlEditor) {
                    yamlContent = yamlEditor.value;
                }
            }
            
            if (!yamlContent) {
                showNotification('YAML content is empty', 'error');
                return;
            }
            
            // Usar la funciu00f3n centralizada para validar (modo no silencioso)
            const isValid = await validateYamlContent(yamlContent, false);
            
            if (isValid) {
                // Update form from YAML
                populateFormFromYaml(yamlContent);
            }
        });
    }
}


