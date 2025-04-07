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
            
            # Load the YAML content and schema
            data = YAMLService.load_yaml(yaml_content)
            schema = YAMLService.load_yaml(schema_content)
            
            # Validate the data against the schema
            try:
                validate(instance=data, schema=schema)
                return True, None
            except ValidationError as e:
                return False, [f"Validation error: {e.message}"]
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
            # First check if it's valid YAML syntax
            data = YAMLService.load_yaml(yaml_content)
            
            # Check for minimum required fields
            if not isinstance(data, dict):
                return {
                    "valid": False,
                    "errors": ["YAML content must contain a root object"]
                }
                
            # Success case
            return {
                "valid": True,
                "errors": None
            }
        except Exception as e:
            return {
                "valid": False,
                "errors": [str(e)]
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
