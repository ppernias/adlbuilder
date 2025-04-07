// main.ts - Punto de entrada principal

import { initializeEditor } from './editor';
import { initAccordions, addCommandItem, addOptionItem, addDecoratorItem, updateAuthenticationUI } from './ui-components';
import { initializePage } from './page';
import { copyYamlToClipboard, validateYamlContent } from './yaml-utils';
import { handleFormSubmit, generateYamlFromForm } from './form-utils';
import { showNotification } from './notifications';

/**
 * Inicializa la aplicaciu00f3n cuando el DOM estu00e1 cargado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes principales
    initializeEditor();
    initAccordions();
    
    // Manejar el botu00f3n de validaciu00f3n en el formulario principal
    const validateBtn = document.getElementById('validate-btn');
    if (validateBtn) {
        validateBtn.addEventListener('click', async () => {
            // Generar YAML desde el formulario
            const form = document.getElementById('assistant-form') as HTMLFormElement;
            if (form) {
                try {
                    const yamlContent = generateYamlFromForm(form);
                    
                    // Validar el YAML generado
                    await validateYamlContent(yamlContent, false);
                    
                    // Actualizar el campo oculto con el YAML validado
                    const yamlContentField = document.getElementById('yaml-content') as HTMLInputElement;
                    if (yamlContentField) {
                        yamlContentField.value = yamlContent;
                    }
                } catch (error) {
                    showNotification(`Error al generar YAML: ${(error as Error).message}`, 'error');
                }
            }
        });
    }
    
    // Configurar botones de elementos dinu00e1micos
    const addCommandBtn = document.getElementById('add-command-btn');
    if (addCommandBtn) {
        addCommandBtn.addEventListener('click', addCommandItem);
    }
    
    const addOptionBtn = document.getElementById('add-option-btn');
    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', addOptionItem);
    }
    
    const addDecoratorBtn = document.getElementById('add-decorator-btn');
    if (addDecoratorBtn) {
        addDecoratorBtn.addEventListener('click', addDecoratorItem);
    }
    
    // Configurar botu00f3n para copiar YAML
    const copyYamlBtn = document.getElementById('copy-yaml-btn');
    if (copyYamlBtn) {
        copyYamlBtn.addEventListener('click', copyYamlToClipboard);
    }
    
    // Configurar manejo de enviu00f3o del formulario
    const form = document.getElementById('assistant-form') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Inicializar pu00e1gina basada en paru00e1metros de URL
    initializePage();
    
    // Actualizar UI de autenticaciu00f3n
    const token = localStorage.getItem('token');
    updateAuthenticationUI(!!token);
});
