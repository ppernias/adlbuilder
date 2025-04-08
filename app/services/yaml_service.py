import yaml
import json
from typing import Dict, Any, List, Optional, Union, Tuple


class YAMLService:
    @staticmethod
    def load_yaml(yaml_content: str) -> Dict[str, Any]:
        """Load YAML content into a Python dictionary"""
        try:
            return yaml.safe_load(yaml_content)
        except yaml.YAMLError as e:
            raise ValueError(f"Invalid YAML: {str(e)}")
    
    @staticmethod
    def dump_yaml(data: Dict[str, Any]) -> str:
        """Convert Python dictionary to YAML string"""
        try:
            return yaml.dump(data, default_flow_style=False, sort_keys=False)
        except yaml.YAMLError as e:
            raise ValueError(f"Error converting to YAML: {str(e)}")
    
    @staticmethod
    def validate_yaml_against_schema(yaml_content: str, schema_content: str) -> Tuple[bool, Optional[List[str]]]:
        """Validate YAML content against a schema"""
        try:
            from jsonschema import validate, ValidationError, SchemaError
            import logging
            
            # Configurar logging
            logging.basicConfig(level=logging.DEBUG)
            logger = logging.getLogger(__name__)
            
            # Load the YAML content and schema
            data = YAMLService.load_yaml(yaml_content)
            schema = YAMLService.load_yaml(schema_content)
            
            # Log para depuración
            logger.debug(f"YAML data: {data}")
            logger.debug(f"Schema: {schema}")
            
            # Validate the data against the schema
            try:
                # Imprimir la estructura completa del YAML y el esquema para depuración
                import json
                logger.debug(f"YAML data structure: {json.dumps(data, indent=2)}")
                
                # Verificar si hay campos requeridos faltantes en el nivel raíz
                missing_root_fields = []
                if 'metadata' not in data:
                    logger.error("'metadata' is missing in the YAML")
                    missing_root_fields.append('metadata')
                if 'assistant_instructions' not in data:
                    logger.error("'assistant_instructions' is missing in the YAML")
                    missing_root_fields.append('assistant_instructions')
                
                # Si faltan campos en el nivel raíz, devolver error inmediatamente
                if missing_root_fields:
                    error_msg = f"Required root sections missing: {', '.join(missing_root_fields)}. These sections are required according to the schema."
                    logger.error(error_msg)
                    return False, [error_msg]
                    
                # Verificar la estructura de metadata si existe
                if 'metadata' in data:
                    metadata = data['metadata']
                    required_metadata_fields = ['author', 'description', 'visibility', 'rights', 'history']
                    missing_metadata_fields = []
                    for field in required_metadata_fields:
                        if field not in metadata:
                            logger.error(f"'metadata.{field}' is missing in the YAML")
                            missing_metadata_fields.append(field)
                    
                    # Si faltan campos en metadata, devolver error inmediatamente
                    if missing_metadata_fields:
                        error_msg = f"Required fields missing in 'metadata': {', '.join(missing_metadata_fields)}. These fields are required according to the schema."
                        logger.error(error_msg)
                        return False, [error_msg]
                    
                    # Verificar author si existe
                    if 'author' in metadata and isinstance(metadata['author'], dict):
                        if 'name' not in metadata['author']:
                            logger.error("'metadata.author.name' is missing in the YAML")
                    
                    # Verificar description si existe
                    if 'description' in metadata and isinstance(metadata['description'], dict):
                        required_desc_fields = ['title', 'summary', 'coverage', 'educational_level', 'use_cases', 'keywords']
                        for field in required_desc_fields:
                            if field not in metadata['description']:
                                logger.error(f"'metadata.description.{field}' is missing in the YAML")
                
                # Verificar assistant_instructions si existe
                if 'assistant_instructions' in data:
                    ai = data['assistant_instructions']
                    required_ai_fields = ['context', 'style_guidelines', 'final_notes', 'help_text', 'role', 'behavior', 'capabilities', 'tools']
                    missing_ai_fields = []
                    for field in required_ai_fields:
                        if field not in ai:
                            logger.error(f"'assistant_instructions.{field}' is missing in the YAML")
                            missing_ai_fields.append(field)
                    
                    # Si faltan campos en assistant_instructions, devolver error inmediatamente
                    if missing_ai_fields:
                        error_msg = f"Required fields missing in 'assistant_instructions': {', '.join(missing_ai_fields)}. These fields are required according to the schema."
                        logger.error(error_msg)
                        return False, [error_msg]
                    
                    # Verificar tools si existe
                    if 'tools' in ai and isinstance(ai['tools'], dict):
                        required_tools_fields = ['commands', 'options', 'decorators']
                        missing_tools_fields = []
                        for field in required_tools_fields:
                            if field not in ai['tools']:
                                logger.error(f"'assistant_instructions.tools.{field}' is missing in the YAML")
                                missing_tools_fields.append(field)
                        
                        # Si faltan campos en tools, devolver error inmediatamente
                        if missing_tools_fields:
                            error_msg = f"Required fields missing in 'assistant_instructions.tools': {', '.join(missing_tools_fields)}. These fields are required according to the schema."
                            logger.error(error_msg)
                            return False, [error_msg]
                
                # Intentar validar contra el esquema
                validate(instance=data, schema=schema)
                logger.debug("Validation successful!")
                return True, None
            except ValidationError as e:
                logger.error(f"Validation error: {e}")
                logger.error(f"Error path: {e.path}")
                logger.error(f"Error message: {e.message}")
                logger.error(f"Error schema path: {e.schema_path}")
                # Provide more informative error messages
                error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
                if 'required property' in e.message:
                    # Extract the required property name from the error message
                    import re
                    match = re.search(r"'([^']+)'", e.message)
                    if match:
                        required_prop = match.group(1)
                        if required_prop == 'metadata':
                            return False, ["Required section 'metadata' is missing. This section must include author and description information."]
                        elif required_prop == 'assistant_instructions':
                            return False, ["Required section 'assistant_instructions' is missing. This section contains the instructions for the assistant."]
                        elif error_path == 'metadata' and required_prop in ['author', 'description', 'visibility', 'rights', 'history']:
                            return False, [f"Required field 'metadata.{required_prop}' is missing. This field is required in the metadata section."]
                        elif 'author' in error_path and required_prop == 'name':
                            return False, ["Required field 'metadata.author.name' is missing. Author name is mandatory."]
                        elif 'description' in error_path:
                            return False, [f"Required field 'metadata.description.{required_prop}' is missing. This field is required in the description section."]
                        else:
                            return False, [f"Required property '{required_prop}' is missing at '{error_path}'. Check the schema for required fields."]
                    else:
                        return False, [f"Validation error at '{error_path}': {e.message}"]
                else:
                    return False, [f"Validation error at '{error_path}': {e.message}"]
            except SchemaError as e:
                return False, [f"Schema error: {e.message}"]
            
        except Exception as e:
            return False, [f"Error during validation: {str(e)}"]
    
    @staticmethod
    def create_default_assistant(schema_content: str) -> Tuple[Dict[str, Any], str]:
        """Create a default assistant based on schema defaults"""
        try:
            schema = YAMLService.load_yaml(schema_content)
            default_data = YAMLService._extract_defaults_from_schema(schema)
            
            # Ensure required top-level objects exist
            if "metadata" not in default_data:
                default_data["metadata"] = {}
            if "assistant_instructions" not in default_data:
                default_data["assistant_instructions"] = {}
                
            # Add timestamp to history
            if "history" not in default_data["metadata"]:
                default_data["metadata"]["history"] = []
            
            import datetime
            default_data["metadata"]["history"].append(
                f"Created on {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            )
            
            yaml_content = YAMLService.dump_yaml(default_data)
            return default_data, yaml_content
        except Exception as e:
            raise ValueError(f"Error creating default assistant: {str(e)}")
    
    @staticmethod
    def _extract_defaults_from_schema(schema: Dict[str, Any], path: List[str] = None) -> Dict[str, Any]:
        """Recursively extract default values from schema"""
        if path is None:
            path = []
            
        if not isinstance(schema, dict):
            return {}
            
        result = {}
        
        # Handle properties at current level
        if "properties" in schema and isinstance(schema["properties"], dict):
            for prop_name, prop_schema in schema["properties"].items():
                current_path = path + [prop_name]
                
                # If this property has a default, use it
                if "default" in prop_schema:
                    if len(path) == 0:
                        result[prop_name] = prop_schema["default"]
                    elif len(path) == 1:
                        if path[0] not in result:
                            result[path[0]] = {}
                        result[path[0]][prop_name] = prop_schema["default"]
                    elif len(path) == 2:
                        if path[0] not in result:
                            result[path[0]] = {}
                        if path[1] not in result[path[0]]:
                            result[path[0]][path[1]] = {}
                        result[path[0]][path[1]][prop_name] = prop_schema["default"]
                
                # If this property has sub-properties, recurse
                if isinstance(prop_schema, dict):
                    sub_result = YAMLService._extract_defaults_from_schema(prop_schema, current_path)
                    
                    # Merge sub_result into result
                    if sub_result:
                        if len(path) == 0:
                            if prop_name not in result:
                                result[prop_name] = {}
                            result[prop_name].update(sub_result)
                        elif len(path) == 1:
                            if path[0] not in result:
                                result[path[0]] = {}
                            if prop_name not in result[path[0]]:
                                result[path[0]][prop_name] = {}
                            result[path[0]][prop_name].update(sub_result)
        
        # Handle additionalProperties (for commands, options, decorators)
        if "additionalProperties" in schema and isinstance(schema["additionalProperties"], dict):
            prop_schema = schema["additionalProperties"]
            if "default" in schema:  # Default key name
                default_key = schema["default"]
                default_key_clean = default_key.lstrip("/").lstrip("+")
                
                # Extract defaults from the additionalProperties schema
                defaults = {}
                if "properties" in prop_schema and isinstance(prop_schema["properties"], dict):
                    for sub_prop, sub_schema in prop_schema["properties"].items():
                        if "default" in sub_schema:
                            defaults[sub_prop] = sub_schema["default"]
                
                # Add this default entry
                if len(path) == 2 and path[0] == "assistant_instructions" and path[1] == "tools":
                    tool_type = path[-1]  # commands, options, or decorators
                    if tool_type not in result:
                        result[tool_type] = {}
                    result[tool_type][default_key_clean] = defaults
                    
        return result
    
    @staticmethod
    def validate_yaml(yaml_content: str) -> Dict[str, Any]:
        """Validate YAML syntax and structure"""
        try:
            # Verificar si el contenido está vacío
            if not yaml_content or yaml_content.strip() == "":
                return {
                    "valid": False,
                    "errors": ["YAML content cannot be empty. You must provide at least the basic structure of the assistant."]
                }
                
            # First check if it's valid YAML syntax
            data = YAMLService.load_yaml(yaml_content)
            
            # Check for minimum required fields
            if not isinstance(data, dict):
                return {
                    "valid": False,
                    "errors": ["YAML content must contain a root object. Check the document structure."]
                }
                
            # Verificar campos requeridos básicos según el esquema
            required_fields = ['metadata', 'assistant_instructions']  # Secciones requeridas por el esquema
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                return {
                    "valid": False,
                    "errors": [f"Required section '{field}' is missing. This section is mandatory according to the schema." for field in missing_fields]
                }
                
            # Success case
            return {
                "valid": True,
                "errors": None
            }
        except yaml.YAMLError as e:
            # Mejorar mensajes de error de sintaxis YAML
            error_msg = str(e)
            if "duplicated mapping key" in error_msg:
                return {
                    "valid": False,
                    "errors": [f"Duplicated key: {error_msg}. You have defined the same property more than once at the same level."]
                }
            elif "end of the stream" in error_msg or "unexpected end" in error_msg:
                return {
                    "valid": False,
                    "errors": [f"Structure error: {error_msg}. Verify that all braces, brackets, and quotes are properly closed."]
                }
            elif "expected a mapping" in error_msg:
                return {
                    "valid": False,
                    "errors": [f"Format error: {error_msg}. An object (mapping) was expected but another data type was found."]
                }
            else:
                return {
                    "valid": False,
                    "errors": [f"Syntax error: {error_msg}. Check the structure and format of your YAML document."]
                }
        except Exception as e:
            return {
                "valid": False,
                "errors": [f"Validation error: {str(e)}. Verify that the YAML complies with the required schema. Required sections: metadata, assistant_instructions."]
            }
    
    @staticmethod
    def update_assistant_history(yaml_content: str, is_minor_change: bool = False) -> str:
        """Update assistant history with current timestamp"""
        if is_minor_change:
            return yaml_content
            
        try:
            data = YAMLService.load_yaml(yaml_content)
            
            # Ensure metadata and history exist
            if "metadata" not in data:
                data["metadata"] = {}
            if "history" not in data["metadata"]:
                data["metadata"]["history"] = []
            
            # Add new history entry
            import datetime
            data["metadata"]["history"].append(
                f"Updated on {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            )
            
            return YAMLService.dump_yaml(data)
        except Exception as e:
            raise ValueError(f"Error updating assistant history: {str(e)}")
    
    @staticmethod
    def get_default_template() -> Dict[str, Any]:
        """Generate a default assistant template"""
        default_template = {
            "name": "mi_asistente",
            "description": "Mi asistente de IA",
            "version": "1.0.0",
            "model": "gpt-4",
            "prompt": "You are a very helpful and friendly assistant.\n\nRespond to user questions in a concise and precise manner.\n\nAlways be polite and respectful.",
            "system_prompt": "Greet the user at the beginning of the conversation. Introduce yourself as an AI assistant.",
            "tools": {
                "commands": [
                    {
                        "name": "help",
                        "description": "Muestra información de ayuda sobre el asistente",
                        "usage": "/help"
                    }
                ],
                "options": [
                    {
                        "name": "language",
                        "description": "Idioma de respuesta del asistente",
                        "type": "string",
                        "default": "es"
                    }
                ],
                "decorators": []
            }
        }
        
        return {
            "yaml_content": YAMLService.dump_yaml(default_template)
        }

# Exportar funciones como funciones de nivel de módulo
def validate_yaml(yaml_content: str) -> Dict[str, Any]:
    """Validate YAML syntax and structure"""
    return YAMLService.validate_yaml(yaml_content)

def get_default_template() -> Dict[str, Any]:
    """Generate a default assistant template"""
    return YAMLService.get_default_template()
