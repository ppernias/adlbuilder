/**
 * ADL Builder - OpenAI Configuration TypeScript
 */
interface OpenAIConfig {
    id?: number;
    user_id?: number;
    api_key?: string;
    selected_model?: string;
    created_at?: string;
    updated_at?: string;
}
interface OpenAIModel {
    id: string;
    name: string;
}
interface OpenAIModelsResponse {
    models: OpenAIModel[];
}
interface OpenAIConfigStatus {
    exists: boolean;
    config: OpenAIConfig | null;
}
interface OpenAIKeyValidation {
    valid: boolean;
    error?: string;
}
/**
 * OpenAI Configuration Manager
 */
declare class OpenAIConfigManager {
    private static apiKeyInput;
    private static modelSelect;
    private static modelSelectionDiv;
    private static validateKeyBtn;
    private static saveConfigBtn;
    private static configForm;
    private static toggleKeyBtn;
    private static configStatus;
    private static configExists;
    private static selectedModel;
    /**
     * Initialize the OpenAI configuration form and UI elements
     */
    static initialize(): void;
    /**
     * Toggle API key visibility between password and text
     */
    private static toggleApiKeyVisibility;
    /**
     * Load existing OpenAI configuration
     */
    private static loadConfiguration;
    /**
     * Validate the OpenAI API key
     */
    private static validateApiKey;
    /**
     * Load available OpenAI models
     */
    private static loadModels;
    /**
     * Populate the model dropdown with available models
     */
    private static populateModelDropdown;
    /**
     * Save the OpenAI configuration
     */
    private static saveConfiguration;
    /**
     * Show a notification to the user
     */
    private static showNotification;
}
