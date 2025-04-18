// Definiciu00f3n de tipos para la aplicaciu00f3n

// Usuario
export interface User {
  id: number;
  email: string;
  full_name?: string;
  role: 'admin' | 'editor';
  organization?: string;
  position?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  role: 'admin' | 'editor';
  organization: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name?: string;
  organization: string;
  position?: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  role?: 'admin' | 'editor'; // sigue opcional, pero no lo pidas en registro
  organization?: string;
  position?: string;
  is_active?: boolean;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

// Autenticaciu00f3n
export interface AuthToken {
  access_token: string;
  token_type: string;
}

// Archivos YAML
export interface YAMLFile {
  filename: string;
  content: string;
  validation_error?: ValidationResult;
}

export interface YAMLContent {
  content: string;
}

// Validaciu00f3n
export interface ValidationResult {
  valid: boolean;
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
}

// Historial
export interface HistoryEntry {
  id: number;
  filename: string;
  timestamp: string;
  action: string;
  user: string;
  content?: string;
}

export interface HistoryList {
  total: number;
  items: HistoryEntry[];
}

// Esquema
export interface SchemaField {
  path: string;
  type: string;
  title?: string;
  description?: string;
  required: boolean;
  category?: string;
  default?: any;
  enum?: string[];
  isArray?: boolean;
  itemType?: string;
}

// Modo de ediciu00f3n
export type EditorMode = 'simple' | 'advanced';

// Respuesta genu00e9rica
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
