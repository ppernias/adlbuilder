// assistant_editor.ts - Punto de entrada principal para el editor de asistentes
// Este archivo importa todos los módulos necesarios

// Importar todos los módulos desde el archivo de barril
import * as AssistantEditor from './modules/index';

// Importar funciones específicas que necesitamos
import { initializeEditor } from './modules/editor';
import { initAccordions } from './modules/ui-components';
import { initializePage } from './modules/page';
import { initializeFileLoader } from './modules/file-loader';

// Exponer funciones y tipos necesarios globalmente
(window as any).AssistantEditor = AssistantEditor;

// Inicializar los módulos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Assistant Editor cargado correctamente');
    
    // Inicializar componentes principales manualmente
    initializeEditor();
    initAccordions();
    initializePage();
    initializeFileLoader();
});
