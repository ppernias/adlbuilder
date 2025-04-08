/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/static/ts/modules/editor.ts":
/*!*****************************************!*\
  !*** ./app/static/ts/modules/editor.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeEditor: () => (/* binding */ initializeEditor)
/* harmony export */ });
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
/* harmony import */ var _yaml_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./yaml-utils */ "./app/static/ts/modules/yaml-utils.ts");
/* harmony import */ var _form_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form-utils */ "./app/static/ts/modules/form-utils.ts");
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page */ "./app/static/ts/modules/page.ts");
// editor.ts - Funcionalidad especu00edfica del editor YAML
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// Crear una referencia tipada al objeto window
var customWindow = window;
/**
 * Inicializa el editor YAML con CodeMirror
 */
function initializeEditor() {
    var _this = this;
    // Initialize CodeMirror for YAML editor
    var yamlEditorElement = document.getElementById('yaml-editor');
    if (yamlEditorElement) {
        // This assumes CodeMirror is loaded globally
        // @ts-ignore - CodeMirror is loaded via script tag
        var editor_1 = CodeMirror.fromTextArea(yamlEditorElement, {
            mode: 'yaml',
            lineNumbers: true,
            theme: 'default',
            indentUnit: 2,
            tabSize: 2,
            lineWrapping: true,
            extraKeys: {
                'Tab': function (cm) {
                    // Insert spaces instead of tab character
                    var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                    cm.replaceSelection(spaces);
                }
            }
        });
        // Store editor instance in window for global access
        customWindow.yamlEditor = editor_1;
        // Set up validation on change
        editor_1.on('change', function () {
            // Clear previous timeout
            if (customWindow.yamlValidationTimeout) {
                clearTimeout(customWindow.yamlValidationTimeout);
            }
            // Esperar 800ms despuu00e9s de que el usuario deje de escribir para validar
            customWindow.yamlValidationTimeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var yamlContent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            yamlContent = editor_1.getValue();
                            if (!yamlContent.trim()) return [3 /*break*/, 2];
                            // Usar la funciu00f3n centralizada para validar (modo silencioso)
                            return [4 /*yield*/, (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_1__.validateYamlContent)(yamlContent, true)];
                        case 1:
                            // Usar la funciu00f3n centralizada para validar (modo silencioso)
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }, 800);
        });
        // Set up tab switching
        var tabs = document.querySelectorAll('.tab');
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function (e) {
                var _a;
                e.preventDefault();
                var targetTab = tab.getAttribute('data-tab');
                var currentActiveTab = (_a = document.querySelector('.tab.active')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-tab');
                // Don't do anything if clicking the already active tab
                if (targetTab === currentActiveTab)
                    return;
                // Activar la pestaña seleccionada usando la función centralizada
                (0,_page__WEBPACK_IMPORTED_MODULE_3__.activateTab)(targetTab || 'metadata');
                // If switching to YAML tab, update the editor content from form
                if (targetTab === 'yaml' && currentActiveTab === 'form') {
                    try {
                        var form = document.getElementById('assistant-form');
                        if (form && customWindow.yamlEditor) {
                            // Get current cursor position to restore it later
                            var cursor = customWindow.yamlEditor.getCursor();
                            // Generate YAML from form and update editor
                            var yamlContent = (0,_form_utils__WEBPACK_IMPORTED_MODULE_2__.generateYamlFromForm)(form);
                            customWindow.yamlEditor.setValue(yamlContent);
                            // Restore cursor position
                            customWindow.yamlEditor.setCursor(cursor);
                            // Validate the YAML
                            (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_1__.validateYamlContent)(yamlContent, true);
                        }
                    }
                    catch (error) {
                        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error al generar YAML: ".concat(error.message), 'error');
                    }
                }
                // If switching to Form tab, update form from YAML
                else if (targetTab === 'form' && currentActiveTab === 'yaml') {
                    try {
                        if (customWindow.yamlEditor) {
                            var yamlContent_1 = customWindow.yamlEditor.getValue();
                            if (yamlContent_1.trim()) {
                                // Validate before populating form
                                (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_1__.validateYamlContent)(yamlContent_1, false).then(function (isValid) {
                                    if (isValid) {
                                        (0,_form_utils__WEBPACK_IMPORTED_MODULE_2__.populateFormFromYaml)(yamlContent_1);
                                    }
                                });
                            }
                        }
                    }
                    catch (error) {
                        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error al cargar formulario: ".concat(error.message), 'error');
                    }
                }
            });
        });
    }
    // Set up validation button
    var validateYamlBtn = document.getElementById('validate-yaml-btn');
    if (validateYamlBtn) {
        validateYamlBtn.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var yamlContent, yamlEditor, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        yamlContent = '';
                        // Get content from CodeMirror if available
                        if (customWindow.yamlEditor) {
                            yamlContent = customWindow.yamlEditor.getValue();
                        }
                        else {
                            yamlEditor = document.getElementById('yaml-editor');
                            if (yamlEditor) {
                                yamlContent = yamlEditor.value;
                            }
                        }
                        if (!yamlContent) {
                            (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('YAML content is empty', 'error');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_1__.validateYamlContent)(yamlContent, false)];
                    case 1:
                        isValid = _a.sent();
                        if (isValid) {
                            // Update form from YAML
                            (0,_form_utils__WEBPACK_IMPORTED_MODULE_2__.populateFormFromYaml)(yamlContent);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    }
}


/***/ }),

/***/ "./app/static/ts/modules/file-loader.ts":
/*!**********************************************!*\
  !*** ./app/static/ts/modules/file-loader.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeFileLoader: () => (/* binding */ initializeFileLoader)
/* harmony export */ });
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
/* harmony import */ var _yaml_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./yaml-utils */ "./app/static/ts/modules/yaml-utils.ts");
/* harmony import */ var _form_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form-utils */ "./app/static/ts/modules/form-utils.ts");
// file-loader.ts - Funciones para cargar archivos YAML
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



// Crear una referencia tipada al objeto window
var customWindow = window;
/**
 * Inicializa el componente de carga de archivos YAML
 */
function initializeFileLoader() {
    var fileInput = document.getElementById('yaml-file-input');
    var loadFileBtn = document.getElementById('load-yaml-file-btn');
    if (!fileInput || !loadFileBtn) {
        console.error('No se encontraron los elementos necesarios para la carga de archivos YAML');
        return;
    }
    // Asignar el evento al botón
    loadFileBtn.addEventListener('click', function () {
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
function handleFileSelect(event) {
    return __awaiter(this, void 0, void 0, function () {
        var fileInput, files, file, yamlContent, isValid, yamlEditor, inputEvent, yamlTab, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileInput = event.target;
                    files = fileInput.files;
                    if (!files || files.length === 0) {
                        return [2 /*return*/];
                    }
                    file = files[0];
                    // Verificar que sea un archivo YAML
                    if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
                        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('Por favor, selecciona un archivo YAML válido (.yaml o .yml)', 'error');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, readFileAsText(file)];
                case 2:
                    yamlContent = _a.sent();
                    return [4 /*yield*/, (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_1__.validateYamlContent)(yamlContent, false)];
                case 3:
                    isValid = _a.sent();
                    if (isValid) {
                        yamlEditor = document.getElementById('yaml-editor');
                        if (yamlEditor) {
                            yamlEditor.value = yamlContent;
                            inputEvent = new Event('input', { bubbles: true });
                            yamlEditor.dispatchEvent(inputEvent);
                        }
                        // Poblar el formulario con los datos del YAML
                        (0,_form_utils__WEBPACK_IMPORTED_MODULE_2__.populateFormFromYaml)(yamlContent);
                        yamlTab = document.querySelector('a[data-tab="yaml"]');
                        if (yamlTab) {
                            yamlTab.click();
                        }
                        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Archivo '".concat(file.name, "' cargado correctamente"), 'success');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error al leer el archivo: ".concat(error_1.message), 'error');
                    return [3 /*break*/, 5];
                case 5:
                    // Limpiar el input para permitir cargar el mismo archivo nuevamente
                    fileInput.value = '';
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Lee un archivo como texto
 * @param file Archivo a leer
 * @returns Promesa con el contenido del archivo
 */
function readFileAsText(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var _a;
            if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) {
                resolve(event.target.result);
            }
            else {
                reject(new Error('No se pudo leer el archivo'));
            }
        };
        reader.onerror = function () {
            reject(new Error('Error al leer el archivo'));
        };
        reader.readAsText(file);
    });
}


/***/ }),

/***/ "./app/static/ts/modules/form-utils.ts":
/*!*********************************************!*\
  !*** ./app/static/ts/modules/form-utils.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateYamlFromForm: () => (/* binding */ generateYamlFromForm),
/* harmony export */   handleFormSubmit: () => (/* binding */ handleFormSubmit),
/* harmony export */   populateFormFromYaml: () => (/* binding */ populateFormFromYaml)
/* harmony export */ });
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
/* harmony import */ var _yaml_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./yaml-utils */ "./app/static/ts/modules/yaml-utils.ts");
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./page */ "./app/static/ts/modules/page.ts");
// form-utils.ts - Funciones para manejar formularios
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



// Crear una referencia tipada al objeto window
var customWindow = window;
/**
 * Genera YAML a partir de los datos del formulario
 * @param formElement Elemento del formulario
 * @returns Contenido YAML generado
 */
function generateYamlFromForm(formElement) {
    var _a;
    // Recopilar datos bu00e1sicos
    var formData = new FormData(formElement);
    var assistantData = {
        name: formData.get('name') || '',
        description: formData.get('description') || undefined,
        version: formData.get('version') || undefined,
        model: formData.get('model') || undefined,
        prompt: formData.get('prompt') || undefined,
        system_prompt: formData.get('system_prompt') || undefined,
        commands: [],
        options: [],
        decorators: []
    };
    // Filtrar campos vaciu00f3os
    Object.keys(assistantData).forEach(function (key) {
        var value = assistantData[key];
        if (value === '' || value === undefined) {
            delete assistantData[key];
        }
    });
    // Recopilar comandos
    var commandsContainer = document.getElementById('commands-container');
    if (commandsContainer) {
        var commandItems = commandsContainer.querySelectorAll('.command-item');
        commandItems.forEach(function (item) {
            var nameInput = item.querySelector('[name^="command-name"]');
            var descInput = item.querySelector('[name^="command-description"]');
            var examplesInput = item.querySelector('[name^="command-examples"]');
            if (nameInput && nameInput.value) {
                var command_1 = {
                    name: nameInput.value,
                    description: (descInput === null || descInput === void 0 ? void 0 : descInput.value) || undefined,
                    examples: (examplesInput === null || examplesInput === void 0 ? void 0 : examplesInput.value) ? examplesInput.value.split('\n').map(function (e) { return e.trim(); }).filter(function (e) { return e; }) : undefined
                };
                // Filtrar campos vaciu00f3os
                Object.keys(command_1).forEach(function (key) {
                    var value = command_1[key];
                    if (value === '' || value === undefined) {
                        delete command_1[key];
                    }
                });
                assistantData.commands = assistantData.commands || [];
                assistantData.commands.push(command_1);
            }
        });
    }
    // Recopilar opciones
    var optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        var optionItems = optionsContainer.querySelectorAll('.option-item');
        optionItems.forEach(function (item) {
            var nameInput = item.querySelector('[name^="option-name"]');
            var descInput = item.querySelector('[name^="option-description"]');
            var typeInput = item.querySelector('[name^="option-type"]');
            var defaultInput = item.querySelector('[name^="option-default"]');
            if (nameInput && nameInput.value && typeInput && typeInput.value) {
                // Crear objeto base
                var baseOption = {
                    name: nameInput.value,
                    description: (descInput === null || descInput === void 0 ? void 0 : descInput.value) || undefined,
                    type: typeInput.value
                };
                // Crear objeto final con el tipo correcto para default
                var option_1;
                if (defaultInput === null || defaultInput === void 0 ? void 0 : defaultInput.value) {
                    if (typeInput.value === 'boolean') {
                        option_1 = __assign(__assign({}, baseOption), { default: defaultInput.value.toLowerCase() === 'true' });
                    }
                    else if (typeInput.value === 'number') {
                        option_1 = __assign(__assign({}, baseOption), { default: Number(defaultInput.value) });
                    }
                    else {
                        option_1 = __assign(__assign({}, baseOption), { default: defaultInput.value });
                    }
                }
                else {
                    option_1 = baseOption;
                }
                // Filtrar campos vaciu00f3os
                Object.keys(option_1).forEach(function (key) {
                    var value = option_1[key];
                    if (value === '' || value === undefined) {
                        delete option_1[key];
                    }
                });
                assistantData.options = assistantData.options || [];
                assistantData.options.push(option_1);
            }
        });
    }
    // Recopilar decoradores
    var decoratorsContainer = document.getElementById('decorators-container');
    if (decoratorsContainer) {
        var decoratorItems = decoratorsContainer.querySelectorAll('.decorator-item');
        decoratorItems.forEach(function (item) {
            var nameInput = item.querySelector('[name^="decorator-name"]');
            var descInput = item.querySelector('[name^="decorator-description"]');
            var patternInput = item.querySelector('[name^="decorator-pattern"]');
            if (nameInput && nameInput.value && patternInput && patternInput.value) {
                var decorator_1 = {
                    name: nameInput.value,
                    description: (descInput === null || descInput === void 0 ? void 0 : descInput.value) || undefined,
                    pattern: patternInput.value
                };
                // Filtrar campos vaciu00f3os
                Object.keys(decorator_1).forEach(function (key) {
                    var value = decorator_1[key];
                    if (value === '' || value === undefined) {
                        delete decorator_1[key];
                    }
                });
                assistantData.decorators = assistantData.decorators || [];
                assistantData.decorators.push(decorator_1);
            }
        });
    }
    // Convertir a YAML
    try {
        return ((_a = customWindow.jsyaml) === null || _a === void 0 ? void 0 : _a.dump(assistantData)) || '';
    }
    catch (error) {
        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error al generar YAML: ".concat(error.message), 'error');
        return '';
    }
}
/**
 * Rellena el formulario con los datos del YAML
 * @param yamlContent Contenido YAML
 */
function populateFormFromYaml(yamlContent) {
    var _a;
    try {
        // Parsear YAML
        var data = (_a = customWindow.jsyaml) === null || _a === void 0 ? void 0 : _a.load(yamlContent);
        if (!data) {
            throw new Error('YAML invu00e1lido o vaciu00f3');
        }
        console.log('Populating form with YAML data:', data);
        // Extraer datos de metadata y assistant_instructions si existen
        var metadata = data.metadata || data;
        var instructions = data.assistant_instructions || data;
        // Rellenar campos bu00e1sicos desde metadata o del objeto principal
        var nameInput = document.querySelector('[name="name"]');
        var descInput = document.querySelector('[name="description"]');
        var versionInput = document.querySelector('[name="version"]');
        var modelInput = document.querySelector('[name="model"]');
        var promptInput = document.querySelector('[name="prompt"]');
        var systemPromptInput = document.querySelector('[name="system_prompt"]');
        if (nameInput)
            nameInput.value = metadata.name || data.name || '';
        if (descInput)
            descInput.value = metadata.description || data.description || '';
        if (versionInput)
            versionInput.value = metadata.version || data.version || '';
        if (modelInput)
            modelInput.value = metadata.model || data.model || '';
        if (promptInput)
            promptInput.value = instructions.prompt || data.prompt || '';
        if (systemPromptInput)
            systemPromptInput.value = instructions.system_prompt || data.system_prompt || '';
        // Activar la pestaña de Metadata
        (0,_page__WEBPACK_IMPORTED_MODULE_2__.activateTab)('metadata');
        // Limpiar contenedores existentes
        var commandsContainer_1 = document.getElementById('commands-container');
        var optionsContainer_1 = document.getElementById('options-container');
        var decoratorsContainer_1 = document.getElementById('decorators-container');
        if (commandsContainer_1)
            commandsContainer_1.innerHTML = '';
        if (optionsContainer_1)
            optionsContainer_1.innerHTML = '';
        if (decoratorsContainer_1)
            decoratorsContainer_1.innerHTML = '';
        // Agregar comandos
        if (data.commands && data.commands.length > 0 && commandsContainer_1) {
            data.commands.forEach(function (command) {
                var commandItem = document.createElement('div');
                commandItem.className = 'command-item bg-gray-50 p-4 rounded-md mb-4';
                commandItem.innerHTML = "\n                    <div class=\"flex justify-between items-center mb-2\">\n                        <h4 class=\"text-lg font-medium\">Comando</h4>\n                        <button type=\"button\" class=\"remove-item-btn text-red-500 hover:text-red-700\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                                <path fill-rule=\"evenodd\" d=\"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </button>\n                    </div>\n                    <div class=\"space-y-3\">\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Nombre <span class=\"text-red-500\">*</span></label>\n                            <input type=\"text\" name=\"command-name[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"".concat(command.name || '', "\" required>\n                        </div>\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Descripciu00f3n</label>\n                            <input type=\"text\" name=\"command-description[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"").concat(command.description || '', "\">\n                        </div>\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Ejemplos (uno por liu00f1ea)</label>\n                            <textarea name=\"command-examples[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" rows=\"3\">").concat(command.examples ? command.examples.join('\n') : '', "</textarea>\n                        </div>\n                    </div>\n                ");
                // Agregar evento para eliminar
                var removeBtn = commandItem.querySelector('.remove-item-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function () {
                        commandItem.remove();
                    });
                }
                commandsContainer_1.appendChild(commandItem);
            });
        }
        // Agregar opciones
        if (data.options && data.options.length > 0 && optionsContainer_1) {
            data.options.forEach(function (option) {
                var optionItem = document.createElement('div');
                optionItem.className = 'option-item bg-gray-50 p-4 rounded-md mb-4';
                optionItem.innerHTML = "\n                    <div class=\"flex justify-between items-center mb-2\">\n                        <h4 class=\"text-lg font-medium\">Opciu00f3n</h4>\n                        <button type=\"button\" class=\"remove-item-btn text-red-500 hover:text-red-700\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                                <path fill-rule=\"evenodd\" d=\"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </button>\n                    </div>\n                    <div class=\"space-y-3\">\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Nombre <span class=\"text-red-500\">*</span></label>\n                            <input type=\"text\" name=\"option-name[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"".concat(option.name || '', "\" required>\n                        </div>\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Descripciu00f3n</label>\n                            <input type=\"text\" name=\"option-description[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"").concat(option.description || '', "\">\n                        </div>\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Tipo <span class=\"text-red-500\">*</span></label>\n                            <select name=\"option-type[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" required>\n                                <option value=\"string\" ").concat(option.type === 'string' ? 'selected' : '', ">String</option>\n                                <option value=\"boolean\" ").concat(option.type === 'boolean' ? 'selected' : '', ">Boolean</option>\n                                <option value=\"number\" ").concat(option.type === 'number' ? 'selected' : '', ">Number</option>\n                            </select>\n                        </div>\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Valor por defecto</label>\n                            <input type=\"text\" name=\"option-default[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"").concat(option.default !== undefined ? option.default : '', "\">\n                        </div>\n                    </div>\n                ");
                // Agregar evento para eliminar
                var removeBtn = optionItem.querySelector('.remove-item-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function () {
                        optionItem.remove();
                    });
                }
                optionsContainer_1.appendChild(optionItem);
            });
        }
        // Agregar decoradores
        if (data.decorators && data.decorators.length > 0 && decoratorsContainer_1) {
            data.decorators.forEach(function (decorator) {
                var decoratorItem = document.createElement('div');
                decoratorItem.className = 'decorator-item bg-gray-50 p-4 rounded-md mb-4';
                decoratorItem.innerHTML = "\n                    <div class=\"flex justify-between items-center mb-2\">\n                        <h4 class=\"text-lg font-medium\">Decorador</h4>\n                        <button type=\"button\" class=\"remove-item-btn text-red-500 hover:text-red-700\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                                <path fill-rule=\"evenodd\" d=\"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </button>\n                    </div>\n                    <div class=\"space-y-3\">\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Nombre <span class=\"text-red-500\">*</span></label>\n                            <input type=\"text\" name=\"decorator-name[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"".concat(decorator.name || '', "\" required>\n                        </div>\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Descripciu00f3n</label>\n                            <input type=\"text\" name=\"decorator-description[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"").concat(decorator.description || '', "\">\n                        </div>\n                        <div>\n                            <label class=\"block text-sm font-medium text-gray-700 mb-1\">Patru00f3n <span class=\"text-red-500\">*</span></label>\n                            <input type=\"text\" name=\"decorator-pattern[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" value=\"").concat(decorator.pattern || '', "\" required>\n                        </div>\n                    </div>\n                ");
                // Agregar evento para eliminar
                var removeBtn = decoratorItem.querySelector('.remove-item-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function () {
                        decoratorItem.remove();
                    });
                }
                decoratorsContainer_1.appendChild(decoratorItem);
            });
        }
    }
    catch (error) {
        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error al cargar YAML: ".concat(error.message), 'error');
    }
}
/**
 * Maneja el enviu00f3o del formulario
 * @param event Evento de submit
 */
function handleFormSubmit(event) {
    return __awaiter(this, void 0, void 0, function () {
        var form, formMode, assistantId, yamlContent, isValid, yamlContentField, formData, url, response, errorText, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    event.preventDefault();
                    form = event.target;
                    formMode = (_a = document.getElementById('form-mode')) === null || _a === void 0 ? void 0 : _a.getAttribute('value');
                    assistantId = (_b = document.getElementById('assistant-id')) === null || _b === void 0 ? void 0 : _b.getAttribute('value');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    yamlContent = generateYamlFromForm(form);
                    return [4 /*yield*/, (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_1__.validateYamlContent)(yamlContent)];
                case 2:
                    isValid = _c.sent();
                    if (!isValid) {
                        return [2 /*return*/]; // La validaciu00f3n ya muestra los errores
                    }
                    yamlContentField = document.getElementById('yaml-content');
                    if (yamlContentField) {
                        yamlContentField.value = yamlContent;
                    }
                    formData = new FormData(form);
                    url = formMode === 'edit' && assistantId
                        ? "/api/v1/assistants/".concat(assistantId)
                        : '/api/v1/assistants/';
                    return [4 /*yield*/, fetch(url, {
                            method: formMode === 'edit' ? 'PUT' : 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(localStorage.getItem('token')),
                            },
                            body: formData,
                        })];
                case 3:
                    response = _c.sent();
                    if (!!response.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, response.text()];
                case 4:
                    errorText = _c.sent();
                    throw new Error("Error al guardar: ".concat(response.status, " ").concat(errorText));
                case 5:
                    // Redirigir a la lista de asistentes
                    (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('Asistente guardado correctamente', 'success');
                    setTimeout(function () {
                        window.location.href = '/assistants';
                    }, 1000);
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error: ".concat(error_1.message), 'error');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ "./app/static/ts/modules/index.ts":
/*!****************************************!*\
  !*** ./app/static/ts/modules/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activateTab: () => (/* reexport safe */ _page__WEBPACK_IMPORTED_MODULE_6__.activateTab),
/* harmony export */   addCommandItem: () => (/* reexport safe */ _ui_components__WEBPACK_IMPORTED_MODULE_4__.addCommandItem),
/* harmony export */   addDecoratorItem: () => (/* reexport safe */ _ui_components__WEBPACK_IMPORTED_MODULE_4__.addDecoratorItem),
/* harmony export */   addOptionItem: () => (/* reexport safe */ _ui_components__WEBPACK_IMPORTED_MODULE_4__.addOptionItem),
/* harmony export */   copyYamlToClipboard: () => (/* reexport safe */ _yaml_utils__WEBPACK_IMPORTED_MODULE_2__.copyYamlToClipboard),
/* harmony export */   generateYamlFromForm: () => (/* reexport safe */ _form_utils__WEBPACK_IMPORTED_MODULE_3__.generateYamlFromForm),
/* harmony export */   handleFormSubmit: () => (/* reexport safe */ _form_utils__WEBPACK_IMPORTED_MODULE_3__.handleFormSubmit),
/* harmony export */   initAccordions: () => (/* reexport safe */ _ui_components__WEBPACK_IMPORTED_MODULE_4__.initAccordions),
/* harmony export */   initializeEditor: () => (/* reexport safe */ _editor__WEBPACK_IMPORTED_MODULE_5__.initializeEditor),
/* harmony export */   initializeFileLoader: () => (/* reexport safe */ _file_loader__WEBPACK_IMPORTED_MODULE_7__.initializeFileLoader),
/* harmony export */   initializePage: () => (/* reexport safe */ _page__WEBPACK_IMPORTED_MODULE_6__.initializePage),
/* harmony export */   loadDefaultTemplate: () => (/* reexport safe */ _page__WEBPACK_IMPORTED_MODULE_6__.loadDefaultTemplate),
/* harmony export */   loadTemplate: () => (/* reexport safe */ _yaml_utils__WEBPACK_IMPORTED_MODULE_2__.loadTemplate),
/* harmony export */   populateFormFromYaml: () => (/* reexport safe */ _form_utils__WEBPACK_IMPORTED_MODULE_3__.populateFormFromYaml),
/* harmony export */   showNotification: () => (/* reexport safe */ _notifications__WEBPACK_IMPORTED_MODULE_1__.showNotification),
/* harmony export */   updateAuthenticationUI: () => (/* reexport safe */ _ui_components__WEBPACK_IMPORTED_MODULE_4__.updateAuthenticationUI),
/* harmony export */   validateYaml: () => (/* reexport safe */ _yaml_utils__WEBPACK_IMPORTED_MODULE_2__.validateYaml),
/* harmony export */   validateYamlContent: () => (/* reexport safe */ _yaml_utils__WEBPACK_IMPORTED_MODULE_2__.validateYamlContent)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./app/static/ts/modules/types.ts");
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
/* harmony import */ var _yaml_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./yaml-utils */ "./app/static/ts/modules/yaml-utils.ts");
/* harmony import */ var _form_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form-utils */ "./app/static/ts/modules/form-utils.ts");
/* harmony import */ var _ui_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui-components */ "./app/static/ts/modules/ui-components.ts");
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor */ "./app/static/ts/modules/editor.ts");
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./page */ "./app/static/ts/modules/page.ts");
/* harmony import */ var _file_loader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./file-loader */ "./app/static/ts/modules/file-loader.ts");
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./main */ "./app/static/ts/modules/main.ts");
// index.ts - Archivo de barril para exportar todos los mu00f3dulos
// Exportar tipos

// Exportar utilidades







// Exportar punto de entrada principal



/***/ }),

/***/ "./app/static/ts/modules/main.ts":
/*!***************************************!*\
  !*** ./app/static/ts/modules/main.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./editor */ "./app/static/ts/modules/editor.ts");
/* harmony import */ var _ui_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-components */ "./app/static/ts/modules/ui-components.ts");
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./page */ "./app/static/ts/modules/page.ts");
/* harmony import */ var _yaml_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./yaml-utils */ "./app/static/ts/modules/yaml-utils.ts");
/* harmony import */ var _form_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./form-utils */ "./app/static/ts/modules/form-utils.ts");
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
// main.ts - Punto de entrada principal
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






/**
 * Inicializa la aplicaciu00f3n cuando el DOM estu00e1 cargado
 */
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar componentes principales
    (0,_editor__WEBPACK_IMPORTED_MODULE_0__.initializeEditor)();
    (0,_ui_components__WEBPACK_IMPORTED_MODULE_1__.initAccordions)();
    // Manejar el botu00f3n de validaciu00f3n en el formulario principal
    var validateBtn = document.getElementById('validate-btn');
    if (validateBtn) {
        validateBtn.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var form, yamlContent, yamlContentField, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        form = document.getElementById('assistant-form');
                        if (!form) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        yamlContent = (0,_form_utils__WEBPACK_IMPORTED_MODULE_4__.generateYamlFromForm)(form);
                        // Validar el YAML generado
                        return [4 /*yield*/, (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_3__.validateYamlContent)(yamlContent, false)];
                    case 2:
                        // Validar el YAML generado
                        _a.sent();
                        yamlContentField = document.getElementById('yaml-content');
                        if (yamlContentField) {
                            yamlContentField.value = yamlContent;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        (0,_notifications__WEBPACK_IMPORTED_MODULE_5__.showNotification)("Error al generar YAML: ".concat(error_1.message), 'error');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    }
    // Configurar botones de elementos dinu00e1micos
    var addCommandBtn = document.getElementById('add-command-btn');
    if (addCommandBtn) {
        addCommandBtn.addEventListener('click', _ui_components__WEBPACK_IMPORTED_MODULE_1__.addCommandItem);
    }
    var addOptionBtn = document.getElementById('add-option-btn');
    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', _ui_components__WEBPACK_IMPORTED_MODULE_1__.addOptionItem);
    }
    var addDecoratorBtn = document.getElementById('add-decorator-btn');
    if (addDecoratorBtn) {
        addDecoratorBtn.addEventListener('click', _ui_components__WEBPACK_IMPORTED_MODULE_1__.addDecoratorItem);
    }
    // Configurar botu00f3n para copiar YAML
    var copyYamlBtn = document.getElementById('copy-yaml-btn');
    if (copyYamlBtn) {
        copyYamlBtn.addEventListener('click', _yaml_utils__WEBPACK_IMPORTED_MODULE_3__.copyYamlToClipboard);
    }
    // Configurar manejo de enviu00f3o del formulario
    var form = document.getElementById('assistant-form');
    if (form) {
        form.addEventListener('submit', _form_utils__WEBPACK_IMPORTED_MODULE_4__.handleFormSubmit);
    }
    // Inicializar pu00e1gina basada en paru00e1metros de URL
    (0,_page__WEBPACK_IMPORTED_MODULE_2__.initializePage)();
    // Actualizar UI de autenticaciu00f3n
    var token = localStorage.getItem('token');
    (0,_ui_components__WEBPACK_IMPORTED_MODULE_1__.updateAuthenticationUI)(!!token);
});


/***/ }),

/***/ "./app/static/ts/modules/notifications.ts":
/*!************************************************!*\
  !*** ./app/static/ts/modules/notifications.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   showNotification: () => (/* binding */ showNotification)
/* harmony export */ });
// notifications.ts - Sistema de notificaciones
/**
 * Muestra una notificaciu00f3n en la interfaz de usuario
 * @param message Mensaje a mostrar
 * @param type Tipo de notificaciu00f3n: info, success o error
 * @param duration Duraciu00f3n en milisegundos (0 para no ocultar automu00e1ticamente)
 * @param id ID opcional para la notificaciu00f3n
 */
function showNotification(message, type, duration, id) {
    var _a;
    if (type === void 0) { type = 'info'; }
    if (duration === void 0) { duration = 3000; }
    var notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        // Create notification container if it doesn't exist
        var container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2';
        document.body.appendChild(container);
    }
    // Create notification element
    var notification = document.createElement('div');
    notification.className = "px-4 py-3 rounded-md shadow-lg transition-all transform translate-x-0 duration-300 flex items-center ".concat(type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
        type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
            'bg-blue-100 text-blue-800 border-l-4 border-blue-500');
    // Add ID if provided
    if (id) {
        notification.id = "notification-".concat(id);
    }
    // Add icon based on type
    var icon = '';
    if (type === 'success') {
        icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 mr-2\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n            <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\" />\n        </svg>";
    }
    else if (type === 'error') {
        icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 mr-2\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n            <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z\" clip-rule=\"evenodd\" />\n        </svg>";
    }
    else {
        icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 mr-2\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n            <path fill-rule=\"evenodd\" d=\"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\" clip-rule=\"evenodd\" />\n        </svg>";
    }
    // Support for multiline messages (convert newlines to <br>)
    var formattedMessage = message.replace(/\n/g, '<br>');
    notification.innerHTML = "".concat(icon, "<span>").concat(formattedMessage, "</span>");
    // Add to container
    (_a = document.getElementById('notification-container')) === null || _a === void 0 ? void 0 : _a.appendChild(notification);
    // Add entrance animation
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(20px)';
    setTimeout(function () {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    // Remove after specified duration (only if duration > 0)
    if (duration > 0) {
        setTimeout(function () {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            // Remove from DOM after animation completes
            setTimeout(function () {
                notification.remove();
            }, 300);
        }, duration);
    }
}


/***/ }),

/***/ "./app/static/ts/modules/page.ts":
/*!***************************************!*\
  !*** ./app/static/ts/modules/page.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activateTab: () => (/* binding */ activateTab),
/* harmony export */   initializePage: () => (/* binding */ initializePage),
/* harmony export */   loadDefaultTemplate: () => (/* binding */ loadDefaultTemplate)
/* harmony export */ });
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
/* harmony import */ var _form_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form-utils */ "./app/static/ts/modules/form-utils.ts");
/* harmony import */ var _yaml_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./yaml-utils */ "./app/static/ts/modules/yaml-utils.ts");
// page.ts - Inicializaciu00f3n de la pu00e1gina
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



// Crear una referencia tipada al objeto window
var customWindow = window;
/**
 * Activa una pestaña específica
 * @param tabId ID de la pestaña a activar (sin el sufijo '-tab')
 */
function activateTab(tabId) {
    // Deactivate all tabs
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
        // Eliminar estilos específicos de pestaña activa
        tab.classList.remove('text-teal-600');
        tab.classList.remove('border-teal-600');
        tab.classList.add('border-transparent');
    });
    // Hide all tab contents
    var tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (content) { return content.classList.add('hidden'); });
    // Activate target tab
    var targetTab = document.querySelector("[data-tab=\"".concat(tabId, "\"]"));
    if (targetTab) {
        targetTab.classList.add('active');
        // Aplicar estilos específicos de pestaña activa
        targetTab.classList.add('text-teal-600');
        targetTab.classList.add('border-teal-600');
        targetTab.classList.remove('border-transparent');
    }
    // Show corresponding tab content
    var targetContent = document.getElementById("".concat(tabId, "-content"));
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }
}
/**
 * Inicializa la pu00e1gina basada en los paru00e1metros de URL
 */
function initializePage() {
    return __awaiter(this, void 0, void 0, function () {
        var formMode, assistantId, response, data, error_1, importedYaml, importedName, nameInput;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    formMode = (_a = document.getElementById('form-mode')) === null || _a === void 0 ? void 0 : _a.getAttribute('value');
                    assistantId = (_b = document.getElementById('assistant-id')) === null || _b === void 0 ? void 0 : _b.getAttribute('value');
                    if (!(formMode === 'edit' && assistantId)) return [3 /*break*/, 6];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/api/v1/assistants/".concat(assistantId), {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(localStorage.getItem('token')),
                            },
                        })];
                case 2:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error("Error al cargar asistente: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _c.sent();
                    // Populate form with assistant data
                    if (data.yaml_content) {
                        (0,_form_utils__WEBPACK_IMPORTED_MODULE_1__.populateFormFromYaml)(data.yaml_content);
                        // Update CodeMirror if available
                        if (customWindow.yamlEditor) {
                            customWindow.yamlEditor.setValue(data.yaml_content);
                        }
                        // Ensure metadata tab is active
                        activateTab('metadata');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error: ".concat(error_1.message), 'error');
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 12];
                case 6:
                    if (!(formMode === 'import')) return [3 /*break*/, 10];
                    importedYaml = sessionStorage.getItem('temp_yaml_content');
                    importedName = sessionStorage.getItem('temp_yaml_name');
                    if (!importedYaml) return [3 /*break*/, 7];
                    // Populate form with imported YAML
                    (0,_form_utils__WEBPACK_IMPORTED_MODULE_1__.populateFormFromYaml)(importedYaml);
                    nameInput = document.querySelector('[name="name"]');
                    if (nameInput && importedName) {
                        nameInput.value = importedName;
                    }
                    // Update CodeMirror if available
                    if (customWindow.yamlEditor) {
                        customWindow.yamlEditor.setValue(importedYaml);
                    }
                    // Ensure metadata tab is active
                    activateTab('metadata');
                    // Clear sessionStorage after use
                    sessionStorage.removeItem('temp_yaml_content');
                    sessionStorage.removeItem('temp_yaml_name');
                    return [3 /*break*/, 9];
                case 7: 
                // If no imported content, load default template
                return [4 /*yield*/, loadDefaultTemplate()];
                case 8:
                    // If no imported content, load default template
                    _c.sent();
                    _c.label = 9;
                case 9: return [3 /*break*/, 12];
                case 10: 
                // New assistant - load default template
                return [4 /*yield*/, loadDefaultTemplate()];
                case 11:
                    // New assistant - load default template
                    _c.sent();
                    // Ensure metadata tab is active
                    activateTab('metadata');
                    _c.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
/**
 * Carga la plantilla por defecto
 */
function loadDefaultTemplate() {
    return __awaiter(this, void 0, void 0, function () {
        var template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0,_yaml_utils__WEBPACK_IMPORTED_MODULE_2__.loadTemplate)()];
                case 1:
                    template = _a.sent();
                    if (template) {
                        (0,_form_utils__WEBPACK_IMPORTED_MODULE_1__.populateFormFromYaml)(template);
                        // Update CodeMirror if available
                        if (customWindow.yamlEditor) {
                            customWindow.yamlEditor.setValue(template);
                        }
                        // Ensure metadata tab is active
                        activateTab('metadata');
                    }
                    return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ "./app/static/ts/modules/types.ts":
/*!****************************************!*\
  !*** ./app/static/ts/modules/types.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// types.ts - Definiciones de tipos e interfaces



/***/ }),

/***/ "./app/static/ts/modules/ui-components.ts":
/*!************************************************!*\
  !*** ./app/static/ts/modules/ui-components.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCommandItem: () => (/* binding */ addCommandItem),
/* harmony export */   addDecoratorItem: () => (/* binding */ addDecoratorItem),
/* harmony export */   addOptionItem: () => (/* binding */ addOptionItem),
/* harmony export */   initAccordions: () => (/* binding */ initAccordions),
/* harmony export */   updateAuthenticationUI: () => (/* binding */ updateAuthenticationUI)
/* harmony export */ });
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
// ui-components.ts - Componentes de UI como acordeones y elementos dinámicos

/**
 * Inicializa los acordeones en la página
 */
function initAccordions() {
    var accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var accordionItem = header.parentElement;
            var content = accordionItem === null || accordionItem === void 0 ? void 0 : accordionItem.querySelector('.accordion-content');
            var icon = header.querySelector('svg');
            if (accordionItem && content && icon) {
                // Toggle active class
                accordionItem.classList.toggle('active');
                // Toggle content visibility
                if (accordionItem.classList.contains('active')) {
                    content.classList.remove('hidden');
                    icon.classList.add('transform', 'rotate-180');
                }
                else {
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
function addCommandItem() {
    var container = document.getElementById('commands-container');
    if (!container) {
        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('No se encontró el contenedor de comandos', 'error');
        return;
    }
    var commandItem = document.createElement('div');
    commandItem.className = 'command-item bg-gray-50 p-4 rounded-md mb-4';
    commandItem.innerHTML = "\n        <div class=\"flex justify-between items-center mb-2\">\n            <h4 class=\"text-lg font-medium\">Comando</h4>\n            <button type=\"button\" class=\"remove-item-btn text-red-500 hover:text-red-700\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                    <path fill-rule=\"evenodd\" d=\"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z\" clip-rule=\"evenodd\" />\n                </svg>\n            </button>\n        </div>\n        <div class=\"space-y-3\">\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Nombre <span class=\"text-red-500\">*</span></label>\n                <input type=\"text\" name=\"command-name[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" required>\n            </div>\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Descripci\u00F3n</label>\n                <input type=\"text\" name=\"command-description[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\">\n            </div>\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Ejemplos (uno por l\u00EDnea)</label>\n                <textarea name=\"command-examples[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" rows=\"3\"></textarea>\n            </div>\n        </div>\n    ";
    // Agregar evento para eliminar
    var removeBtn = commandItem.querySelector('.remove-item-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function () {
            commandItem.remove();
        });
    }
    container.appendChild(commandItem);
}
/**
 * Agrega un nuevo elemento de opción al contenedor
 */
function addOptionItem() {
    var container = document.getElementById('options-container');
    if (!container) {
        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('No se encontró el contenedor de opciones', 'error');
        return;
    }
    var optionItem = document.createElement('div');
    optionItem.className = 'option-item bg-gray-50 p-4 rounded-md mb-4';
    optionItem.innerHTML = "\n        <div class=\"flex justify-between items-center mb-2\">\n            <h4 class=\"text-lg font-medium\">Opci\u00F3n</h4>\n            <button type=\"button\" class=\"remove-item-btn text-red-500 hover:text-red-700\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                    <path fill-rule=\"evenodd\" d=\"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z\" clip-rule=\"evenodd\" />\n                </svg>\n            </button>\n        </div>\n        <div class=\"space-y-3\">\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Nombre <span class=\"text-red-500\">*</span></label>\n                <input type=\"text\" name=\"option-name[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" required>\n            </div>\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Descripci\u00F3n</label>\n                <input type=\"text\" name=\"option-description[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\">\n            </div>\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Tipo <span class=\"text-red-500\">*</span></label>\n                <select name=\"option-type[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" required>\n                    <option value=\"string\">String</option>\n                    <option value=\"boolean\">Boolean</option>\n                    <option value=\"number\">Number</option>\n                </select>\n            </div>\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Valor por defecto</label>\n                <input type=\"text\" name=\"option-default[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\">\n            </div>\n        </div>\n    ";
    // Agregar evento para eliminar
    var removeBtn = optionItem.querySelector('.remove-item-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function () {
            optionItem.remove();
        });
    }
    container.appendChild(optionItem);
}
/**
 * Agrega un nuevo elemento de decorador al contenedor
 */
function addDecoratorItem() {
    var container = document.getElementById('decorators-container');
    if (!container) {
        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('No se encontró el contenedor de decoradores', 'error');
        return;
    }
    var decoratorItem = document.createElement('div');
    decoratorItem.className = 'decorator-item bg-gray-50 p-4 rounded-md mb-4';
    decoratorItem.innerHTML = "\n        <div class=\"flex justify-between items-center mb-2\">\n            <h4 class=\"text-lg font-medium\">Decorador</h4>\n            <button type=\"button\" class=\"remove-item-btn text-red-500 hover:text-red-700\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                    <path fill-rule=\"evenodd\" d=\"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z\" clip-rule=\"evenodd\" />\n                </svg>\n            </button>\n        </div>\n        <div class=\"space-y-3\">\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Nombre <span class=\"text-red-500\">*</span></label>\n                <input type=\"text\" name=\"decorator-name[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" required>\n            </div>\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Descripci\u00F3n</label>\n                <input type=\"text\" name=\"decorator-description[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\">\n            </div>\n            <div>\n                <label class=\"block text-sm font-medium text-gray-700 mb-1\">Patr\u00F3n <span class=\"text-red-500\">*</span></label>\n                <input type=\"text\" name=\"decorator-pattern[]\" class=\"w-full px-3 py-2 border border-gray-300 rounded-md\" required>\n            </div>\n        </div>\n    ";
    // Agregar evento para eliminar
    var removeBtn = decoratorItem.querySelector('.remove-item-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function () {
            decoratorItem.remove();
        });
    }
    container.appendChild(decoratorItem);
}
/**
 * Actualiza la UI según el estado de autenticación
 * @param isAuthenticated Indica si el usuario está autenticado
 */
function updateAuthenticationUI(isAuthenticated) {
    var loginBtn = document.getElementById('login-btn');
    var logoutBtn = document.getElementById('logout-btn');
    var userMenu = document.getElementById('user-menu');
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


/***/ }),

/***/ "./app/static/ts/modules/yaml-utils.ts":
/*!*********************************************!*\
  !*** ./app/static/ts/modules/yaml-utils.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyYamlToClipboard: () => (/* binding */ copyYamlToClipboard),
/* harmony export */   loadTemplate: () => (/* binding */ loadTemplate),
/* harmony export */   validateYaml: () => (/* binding */ validateYaml),
/* harmony export */   validateYamlContent: () => (/* binding */ validateYamlContent)
/* harmony export */ });
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications */ "./app/static/ts/modules/notifications.ts");
// yaml-utils.ts - Funciones relacionadas con YAML
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

// Crear una referencia tipada al objeto window
var customWindow = window;
/**
 * Valida el contenido YAML usando la API
 * @param yamlContent Contenido YAML a validar
 * @param showNotifications Si se deben mostrar notificaciones
 * @returns Resultado de la validaciu00f3n
 */
function validateYaml(yamlContent_1) {
    return __awaiter(this, arguments, void 0, function (yamlContent, showNotifications) {
        var response, errorText, data, errorMessages, formattedErrors, error_1;
        if (showNotifications === void 0) { showNotifications = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch('/api/v1/assistants/validate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(localStorage.getItem('token')),
                            },
                            body: JSON.stringify({ yaml_content: yamlContent }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _a.sent();
                    throw new Error("Error de validaciu00f3n: ".concat(response.status, " ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    if (showNotifications) {
                        if (data.valid) {
                            (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('YAML validado correctamente', 'success');
                        }
                        else {
                            errorMessages = data.errors || ['Unknown error'];
                            formattedErrors = errorMessages.map(function (err) {
                                // Detectar tipos comunes de errores y proporcionar explicaciones más claras
                                if (err.includes('Required field')) {
                                    var match = err.match(/\'([^']+)\'/);
                                    var field = match ? match[1] : 'unknown';
                                    return "Required field: '".concat(field, "' is missing in the YAML. This field is mandatory.");
                                }
                                else if (err.includes('must be')) {
                                    return "Incorrect data type: ".concat(err, ". Verify that the value has the correct format.");
                                }
                                else if (err.includes('additional properties')) {
                                    return "Not allowed property: ".concat(err, ". You have included a field that is not defined in the schema.");
                                }
                                else {
                                    return "Error: ".concat(err);
                                }
                            }).join('\n');
                            (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Errores de validaci\u00F3n YAML:\n".concat(formattedErrors), 'error');
                        }
                    }
                    return [2 /*return*/, data];
                case 5:
                    error_1 = _a.sent();
                    if (showNotifications) {
                        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error: ".concat(error_1.message), 'error');
                    }
                    return [2 /*return*/, { valid: false, errors: [error_1.message] }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Carga una plantilla de asistente desde el servidor
 * @returns Contenido YAML de la plantilla
 */
function loadTemplate() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/v1/assistants/template', {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(localStorage.getItem('token')),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error al cargar la plantilla: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.yaml_content || ''];
                case 3:
                    error_2 = _a.sent();
                    (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error al cargar la plantilla: ".concat(error_2.message), 'error');
                    return [2 /*return*/, ''];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Funciu00f3n centralizada para validar el contenido YAML y actualizar la UI
 * @param yamlContent Contenido YAML a validar
 * @param silentMode Si es true, no muestra notificaciones ni actualiza la UI
 * @returns true si el YAML es vu00e1lido, false si no lo es
 */
function validateYamlContent(yamlContent_1) {
    return __awaiter(this, arguments, void 0, function (yamlContent, silentMode) {
        var parsedYaml, clientErrors_1, validationStatusElements, formattedClientErrors, result_1, validationStatusElements, error_3, validationStatusElements, errorMsg, formattedError;
        var _a;
        if (silentMode === void 0) { silentMode = false; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    parsedYaml = (_a = customWindow.jsyaml) === null || _a === void 0 ? void 0 : _a.load(yamlContent);
                    if (!parsedYaml) {
                        throw new Error('El YAML no puede estar vacio');
                    }
                    clientErrors_1 = [];
                    // Verificar que el YAML tenga las secciones principales requeridas por el esquema
                    if (!parsedYaml.metadata) {
                        clientErrors_1.push('La sección \'metadata\' es obligatoria');
                    }
                    if (!parsedYaml.assistant_instructions) {
                        clientErrors_1.push('La sección \'assistant_instructions\' es obligatoria');
                    }
                    // Si hay errores del cliente, mostrar y retornar
                    if (clientErrors_1.length > 0) {
                        if (!silentMode) {
                            validationStatusElements = document.querySelectorAll('#validation-status');
                            validationStatusElements.forEach(function (validationStatus) {
                                // Mejorar la presentación de errores con explicaciones
                                var formattedErrors = clientErrors_1.map(function (err) {
                                    // Proporcionar explicaciones más detalladas para cada tipo de error
                                    if (err.includes("'metadata' es obligatoria")) {
                                        return "<div class=\"mb-1\"><strong>Secci\u00F3n 'metadata' obligatoria:</strong> Debes incluir la secci\u00F3n 'metadata' en el YAML. Esta secci\u00F3n contiene informaci\u00F3n sobre el autor, descripci\u00F3n y otros metadatos del asistente.</div>";
                                    }
                                    else if (err.includes("'assistant_instructions' es obligatoria")) {
                                        return "<div class=\"mb-1\"><strong>Secci\u00F3n 'assistant_instructions' obligatoria:</strong> Debes incluir la secci\u00F3n 'assistant_instructions' en el YAML. Esta secci\u00F3n contiene las instrucciones y comportamiento del asistente.</div>";
                                    }
                                    else if (err.includes("El YAML no puede estar vacio")) {
                                        return "<div class=\"mb-1\"><strong>Documento vac\u00EDo:</strong> El documento YAML no puede estar vac\u00EDo. Debes proporcionar al menos la estructura b\u00E1sica del asistente con las secciones 'metadata' y 'assistant_instructions'.</div>";
                                    }
                                    else {
                                        return "<div class=\"mb-1\"><strong>Error de validaci\u00F3n:</strong> ".concat(err, "</div>");
                                    }
                                }).join('');
                                validationStatus.innerHTML = "<div class=\"flex items-center\">\n                        <span class=\"inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                                <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </span>\n                        <span class=\"text-red-700 font-medium\">YAML inv\u00E1lido</span>\n                    </div>\n                    <div class=\"mt-2 text-sm text-red-600 validation-error-details\">".concat(formattedErrors, "</div>");
                            });
                            formattedClientErrors = clientErrors_1.map(function (err) {
                                if (err.includes("'metadata' es obligatoria")) {
                                    return "Secci\u00F3n 'metadata' obligatoria: Debes incluir la secci\u00F3n de metadatos";
                                }
                                else if (err.includes("'assistant_instructions' es obligatoria")) {
                                    return "Secci\u00F3n 'assistant_instructions' obligatoria: Debes incluir las instrucciones del asistente";
                                }
                                else {
                                    return err;
                                }
                            }).join(', ');
                            (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("YAML inv\u00E1lido: ".concat(formattedClientErrors), 'error');
                        }
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, validateYaml(yamlContent, !silentMode)];
                case 1:
                    result_1 = _b.sent();
                    // Actualizar UI si no estamos en modo silencioso
                    if (!silentMode) {
                        validationStatusElements = document.querySelectorAll('#validation-status');
                        validationStatusElements.forEach(function (validationStatus) {
                            if (result_1.valid) {
                                validationStatus.innerHTML = "<div class=\"flex items-center\">\n                        <span class=\"inline-flex items-center justify-center p-1 bg-green-100 text-green-700 rounded-full mr-2\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                                <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </span>\n                        <span class=\"text-green-700 font-medium\">Sintaxis YAML vu00e1lida</span>\n                    </div>";
                            }
                            else {
                                // Mejorar la presentación de errores del servidor con explicaciones más detalladas
                                var errorList = result_1.errors || ['Error desconocido'];
                                var formattedErrors = errorList.map(function (err) {
                                    // Detectar tipos comunes de errores y proporcionar explicaciones más claras
                                    if (err.includes('required property')) {
                                        var match = err.match(/\'([^']+)\'/);
                                        var field = match ? match[1] : 'desconocido';
                                        return "<div class=\"mb-1\"><strong>Campo requerido:</strong> '".concat(field, "' no est\u00E1 presente en el YAML. Este campo es obligatorio para que el asistente funcione correctamente.</div>");
                                    }
                                    else if (err.includes('must be')) {
                                        return "<div class=\"mb-1\"><strong>Tipo de dato incorrecto:</strong> ".concat(err, ". Verifica que el valor tenga el formato correcto seg\u00FAn la documentaci\u00F3n.</div>");
                                    }
                                    else if (err.includes('additional properties')) {
                                        return "<div class=\"mb-1\"><strong>Propiedad no permitida:</strong> ".concat(err, ". Has incluido un campo que no est\u00E1 definido en el esquema del asistente.</div>");
                                    }
                                    else if (err.includes('schema')) {
                                        return "<div class=\"mb-1\"><strong>Error de esquema:</strong> ".concat(err, ". La estructura del YAML no cumple con el esquema requerido.</div>");
                                    }
                                    else {
                                        return "<div class=\"mb-1\"><strong>Error:</strong> ".concat(err, "</div>");
                                    }
                                }).join('');
                                validationStatus.innerHTML = "<div class=\"flex items-center\">\n                        <span class=\"inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                                <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z\" clip-rule=\"evenodd\" />\n                            </svg>\n                        </span>\n                        <span class=\"text-red-700 font-medium\">Error de validaci\u00F3n</span>\n                    </div>\n                    <div class=\"mt-2 text-sm text-red-600 validation-error-details\">".concat(formattedErrors, "</div>");
                            }
                        });
                    }
                    return [2 /*return*/, result_1.valid];
                case 2:
                    error_3 = _b.sent();
                    // Error de sintaxis
                    if (!silentMode) {
                        validationStatusElements = document.querySelectorAll('#validation-status');
                        validationStatusElements.forEach(function (validationStatus) {
                            // Mejorar la presentación de errores de sintaxis con explicaciones más detalladas
                            var errorMsg = error_3.message;
                            var formattedError = errorMsg;
                            // Detect common syntax error types and provide clearer explanations
                            if (errorMsg.includes('duplicated mapping key')) {
                                formattedError = "<strong>Duplicated key:</strong> ".concat(errorMsg, ". You have defined the same property more than once at the same level.");
                            }
                            else if (errorMsg.includes('end of the stream') || errorMsg.includes('unexpected end')) {
                                formattedError = "<strong>Structure error:</strong> ".concat(errorMsg, ". Verify that all braces, brackets, and quotes are properly closed.");
                            }
                            else if (errorMsg.includes('expected a mapping')) {
                                formattedError = "<strong>Format error:</strong> ".concat(errorMsg, ". An object (mapping) was expected but another data type was found.");
                            }
                            else if (errorMsg.includes('cannot read')) {
                                formattedError = "<strong>Reading error:</strong> ".concat(errorMsg, ". The YAML document cannot be correctly interpreted.");
                            }
                            else if (errorMsg.includes('YAML content cannot be empty')) {
                                formattedError = "<strong>Empty document:</strong> The YAML cannot be empty. You must provide at least the basic structure of the assistant with required fields: name, model, prompt.";
                            }
                            else {
                                formattedError = "<strong>Syntax error:</strong> ".concat(errorMsg, ". Check the structure and format of your YAML document.");
                            }
                            validationStatus.innerHTML = "<div class=\"flex items-center\">\n                    <span class=\"inline-flex items-center justify-center p-1 bg-red-100 text-red-700 rounded-full mr-2\">\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                            <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z\" clip-rule=\"evenodd\" />\n                        </svg>\n                    </span>\n                    <span class=\"text-red-700 font-medium\">Syntax Error</span>\n                </div>\n                <div class=\"mt-2 text-sm text-red-600 validation-error-details\">".concat(formattedError, "</div>\n                <div class=\"mt-1 text-xs text-gray-600\">Required sections: metadata, assistant_instructions</div>");
                        });
                        errorMsg = error_3.message;
                        formattedError = "YAML syntax error: ".concat(errorMsg);
                        // Provide more informative messages based on error type
                        if (errorMsg.includes('duplicated mapping key')) {
                            formattedError = "Syntax error: You have defined a duplicate property in the YAML. Check for repeated keys.";
                        }
                        else if (errorMsg.includes('end of the stream') || errorMsg.includes('unexpected end')) {
                            formattedError = "Syntax error: The YAML structure is incomplete. Verify that all braces and brackets are properly closed.";
                        }
                        else if (errorMsg.includes('YAML content cannot be empty')) {
                            formattedError = "Error: The YAML document cannot be empty. You must provide at least the basic structure of the assistant with required fields: name, model, prompt.";
                        }
                        (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)(formattedError, 'error', 10000); // Show for 10 seconds for better readability
                    }
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Funciu00f3n para copiar el YAML al portapapeles
 */
function copyYamlToClipboard() {
    return __awaiter(this, void 0, void 0, function () {
        var yamlContent, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    yamlContent = ((_a = customWindow.yamlEditor) === null || _a === void 0 ? void 0 : _a.getValue()) || '';
                    // Copy to clipboard
                    return [4 /*yield*/, navigator.clipboard.writeText(yamlContent)];
                case 1:
                    // Copy to clipboard
                    _b.sent();
                    // Show success notification
                    (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)('YAML copied to clipboard', 'success');
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    (0,_notifications__WEBPACK_IMPORTED_MODULE_0__.showNotification)("Error copying: ".concat(error_4.message), 'error');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./app/static/ts/assistant_editor.ts ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/index */ "./app/static/ts/modules/index.ts");
/* harmony import */ var _modules_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/editor */ "./app/static/ts/modules/editor.ts");
/* harmony import */ var _modules_ui_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/ui-components */ "./app/static/ts/modules/ui-components.ts");
/* harmony import */ var _modules_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/page */ "./app/static/ts/modules/page.ts");
/* harmony import */ var _modules_file_loader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/file-loader */ "./app/static/ts/modules/file-loader.ts");
// assistant_editor.ts - Punto de entrada principal para el editor de asistentes
// Este archivo importa todos los módulos necesarios
// Importar todos los módulos desde el archivo de barril

// Importar funciones específicas que necesitamos




// Exponer funciones y tipos necesarios globalmente
window.AssistantEditor = _modules_index__WEBPACK_IMPORTED_MODULE_0__;
// Inicializar los módulos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    console.log('Assistant Editor cargado correctamente');
    // Inicializar componentes principales manualmente
    (0,_modules_editor__WEBPACK_IMPORTED_MODULE_1__.initializeEditor)();
    (0,_modules_ui_components__WEBPACK_IMPORTED_MODULE_2__.initAccordions)();
    (0,_modules_page__WEBPACK_IMPORTED_MODULE_3__.initializePage)();
    (0,_modules_file_loader__WEBPACK_IMPORTED_MODULE_4__.initializeFileLoader)();
});

})();

/******/ })()
;
//# sourceMappingURL=assistant_editor.js.map