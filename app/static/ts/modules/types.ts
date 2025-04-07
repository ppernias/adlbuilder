// types.ts - Definiciones de tipos e interfaces

// Definir tipos para las propiedades personalizadas que usamos en window
export type CustomWindow = Window & {
    yamlEditor?: any;
    yamlValidationTimeout?: ReturnType<typeof setTimeout>;
    jsyaml?: any;
};

// Interfaces para validación
export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}

// Interfaces para datos del asistente
export interface AssistantData {
    name: string;
    description?: string;
    version?: string;
    model?: string;
    prompt?: string;
    system_prompt?: string;
    commands?: Command[];
    options?: Option[];
    decorators?: Decorator[];
}

export interface Command {
    name: string;
    description?: string;
    examples?: string[];
}

export interface Option {
    name: string;
    description?: string;
    type: string;
    default?: string | boolean | number;
}

export interface Decorator {
    name: string;
    description?: string;
    pattern: string;
}
