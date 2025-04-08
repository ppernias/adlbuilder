// file-loader.ts - Funciones para cargar archivos YAML

import { CustomWindow } from './types';
import { showNotification } from './notifications';
import { validateYamlContent } from './yaml-utils';
import { populateFormFromYaml } from './form-utils';

// Crear una referencia tipada al objeto window
const customWindow = window as CustomWindow;

/**
 * Inicializa el componente de carga de archivos YAML
 */
export function initializeFileLoader(): void {
    const fileInput = document.getElementById('yaml-file-input') as HTMLInputElement;
    const loadFileBtn = document.getElementById('load-yaml-file-btn');
    
    if (!fileInput || !loadFileBtn) {
        console.error('No se encontraron los elementos necesarios para la carga de archivos YAML');
        return;
    }
    
    // Asignar el evento al botón
    loadFileBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Asignar el evento al input
    fileInput.addEventListener('change', handleFileSelect);
    
    console.log('Inicializado el cargador de archivos YAML');
}

/**
 * Maneja la selección de un archivo YAML
 * @param event Evento de cambio del input file
 */
async function handleFileSelect(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;
    
    if (!files || files.length === 0) {
        return;
    }
    
    const file = files[0];
    
    // Verificar que sea un archivo YAML
    if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
        showNotification('Por favor, selecciona un archivo YAML válido (.yaml o .yml)', 'error');
        return;
    }
    
    try {
        // Leer el contenido del archivo
        const yamlContent = await readFileAsText(file);
        
        // Validar el YAML antes de cargarlo en el formulario
        const isValid = await validateYamlContent(yamlContent, false);
        
        if (isValid) {
            // Si el YAML es válido, actualizar el editor y el formulario
            const yamlEditor = document.getElementById('yaml-editor') as HTMLTextAreaElement;
            if (yamlEditor) {
                yamlEditor.value = yamlContent;
                // Disparar un evento de input para activar la validación en tiempo real
                const inputEvent = new Event('input', { bubbles: true });
                yamlEditor.dispatchEvent(inputEvent);
            }
            
            // Poblar el formulario con los datos del YAML
            populateFormFromYaml(yamlContent);
            
            // Activar la pestaña de YAML para mostrar el contenido cargado
            const yamlTab = document.querySelector('a[data-tab="yaml"]') as HTMLElement;
            if (yamlTab) {
                yamlTab.click();
            }
            
            showNotification(`Archivo '${file.name}' cargado correctamente`, 'success');
        }
    } catch (error) {
        showNotification(`Error al leer el archivo: ${(error as Error).message}`, 'error');
    }
    
    // Limpiar el input para permitir cargar el mismo archivo nuevamente
    fileInput.value = '';
}

/**
 * Lee un archivo como texto
 * @param file Archivo a leer
 * @returns Promesa con el contenido del archivo
 */
function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            if (event.target?.result) {
                resolve(event.target.result as string);
            } else {
                reject(new Error('No se pudo leer el archivo'));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };
        
        reader.readAsText(file);
    });
}
