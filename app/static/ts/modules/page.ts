// page.ts - Inicializaciu00f3n de la pu00e1gina

import { CustomWindow } from './types';
import { showNotification } from './notifications';
import { populateFormFromYaml } from './form-utils';
import { loadTemplate } from './yaml-utils';

// Crear una referencia tipada al objeto window
const customWindow = window as CustomWindow;

/**
 * Inicializa la pu00e1gina basada en los paru00e1metros de URL
 */
export async function initializePage(): Promise<void> {
    // Check if we're in edit mode
    const formMode = document.getElementById('form-mode')?.getAttribute('value');
    const assistantId = document.getElementById('assistant-id')?.getAttribute('value');
    
    if (formMode === 'edit' && assistantId) {
        // Edit existing assistant - load data from server
        try {
            const response = await fetch(`/api/v1/assistants/${assistantId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar asistente: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Populate form with assistant data
            if (data.yaml_content) {
                populateFormFromYaml(data.yaml_content);
                
                // Update CodeMirror if available
                if (customWindow.yamlEditor) {
                    customWindow.yamlEditor.setValue(data.yaml_content);
                }
            }
            
        } catch (error) {
            showNotification(`Error: ${(error as Error).message}`, 'error');
        }
    } else if (formMode === 'import') {
        // Import from YAML - check for temp data in sessionStorage
        const importedYaml = sessionStorage.getItem('temp_yaml_content');
        const importedName = sessionStorage.getItem('temp_yaml_name');
        
        if (importedYaml) {
            // Populate form with imported YAML
            populateFormFromYaml(importedYaml);
            
            // Set name if available
            const nameInput = document.querySelector('[name="name"]') as HTMLInputElement;
            if (nameInput && importedName) {
                nameInput.value = importedName;
            }
            
            // Update CodeMirror if available
            if (customWindow.yamlEditor) {
                customWindow.yamlEditor.setValue(importedYaml);
            }
            
            // Clear sessionStorage after use
            sessionStorage.removeItem('temp_yaml_content');
            sessionStorage.removeItem('temp_yaml_name');
        } else {
            // If no imported content, load default template
            await loadDefaultTemplate();
        }
    } else {
        // New assistant - load default template
        await loadDefaultTemplate();
    }
}

/**
 * Carga la plantilla por defecto
 */
export async function loadDefaultTemplate(): Promise<void> {
    const template = await loadTemplate();
    if (template) {
        populateFormFromYaml(template);
        
        // Update CodeMirror if available
        if (customWindow.yamlEditor) {
            customWindow.yamlEditor.setValue(template);
        }
    }
}
