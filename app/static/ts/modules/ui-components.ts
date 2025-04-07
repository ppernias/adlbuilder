// ui-components.ts - Componentes de UI como acordeones y elementos dinámicos

import { showNotification } from './notifications';

/**
 * Inicializa los acordeones en la página
 */
export function initAccordions(): void {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const content = accordionItem?.querySelector('.accordion-content');
            const icon = header.querySelector('svg');
            
            if (accordionItem && content && icon) {
                // Toggle active class
                accordionItem.classList.toggle('active');
                
                // Toggle content visibility
                if (accordionItem.classList.contains('active')) {
                    content.classList.remove('hidden');
                    icon.classList.add('transform', 'rotate-180');
                } else {
                    content.classList.add('hidden');
                    icon.classList.remove('transform', 'rotate-180');
                }
            }
        });
    });
}

/**
 * Agrega un nuevo elemento de comando al contenedor
 */
export function addCommandItem(): void {
    const container = document.getElementById('commands-container');
    if (!container) {
        showNotification('No se encontró el contenedor de comandos', 'error');
        return;
    }
    
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
                <input type="text" name="command-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input type="text" name="command-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ejemplos (uno por línea)</label>
                <textarea name="command-examples[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3"></textarea>
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
    
    container.appendChild(commandItem);
}

/**
 * Agrega un nuevo elemento de opción al contenedor
 */
export function addOptionItem(): void {
    const container = document.getElementById('options-container');
    if (!container) {
        showNotification('No se encontró el contenedor de opciones', 'error');
        return;
    }
    
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
                <input type="text" name="option-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input type="text" name="option-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo <span class="text-red-500">*</span></label>
                <select name="option-type[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="string">String</option>
                    <option value="boolean">Boolean</option>
                    <option value="number">Number</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor por defecto</label>
                <input type="text" name="option-default[]" class="w-full px-3 py-2 border border-gray-300 rounded-md">
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
    
    container.appendChild(optionItem);
}

/**
 * Agrega un nuevo elemento de decorador al contenedor
 */
export function addDecoratorItem(): void {
    const container = document.getElementById('decorators-container');
    if (!container) {
        showNotification('No se encontró el contenedor de decoradores', 'error');
        return;
    }
    
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
                <input type="text" name="decorator-name[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input type="text" name="decorator-description[]" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Patrón <span class="text-red-500">*</span></label>
                <input type="text" name="decorator-pattern[]" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
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
    
    container.appendChild(decoratorItem);
}

/**
 * Actualiza la UI según el estado de autenticación
 * @param isAuthenticated Indica si el usuario está autenticado
 */
export function updateAuthenticationUI(isAuthenticated: boolean): void {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (loginBtn) {
        loginBtn.style.display = isAuthenticated ? 'none' : 'block';
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = isAuthenticated ? 'block' : 'none';
    }
    
    if (userMenu) {
        userMenu.style.display = isAuthenticated ? 'block' : 'none';
    }
}
