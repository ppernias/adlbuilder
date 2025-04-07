/**
 * Genera YAML a partir de los datos del formulario
 * @param formElement Elemento del formulario
 * @returns Contenido YAML generado
 */
export declare function generateYamlFromForm(formElement: HTMLFormElement): string;
/**
 * Rellena el formulario con los datos del YAML
 * @param yamlContent Contenido YAML
 */
export declare function populateFormFromYaml(yamlContent: string): void;
/**
 * Maneja el enviu00f3o del formulario
 * @param event Evento de submit
 */
export declare function handleFormSubmit(event: Event): Promise<void>;
