#!/usr/bin/env python3

import yaml
import json
import logging
from pathlib import Path
from jsonschema import validate, ValidationError, SchemaError

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_yaml(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        data = yaml.safe_load(content)
        return content, data
    except Exception as e:
        logger.error(f"Error loading YAML from {file_path}: {e}")
        return None, None

def validate_yaml_against_schema(yaml_content, schema_content):
    try:
        # Parse YAML content and schema
        data = yaml.safe_load(yaml_content)
        schema = yaml.safe_load(schema_content)
        
        logger.debug(f"YAML data keys: {list(data.keys())}")
        logger.debug(f"Schema required properties: {schema.get('required', [])}")
        
        # Verificar campos requeridos en el nivel raíz
        for field in schema.get('required', []):
            if field not in data:
                logger.error(f"Required field '{field}' is missing in the YAML")
        
        # Validate the data against the schema
        validate(instance=data, schema=schema)
        logger.debug("Validation successful!")
        return True, None
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        logger.error(f"Error path: {e.path}")
        logger.error(f"Error message: {e.message}")
        logger.error(f"Error schema path: {e.schema_path}")
        
        # Proporcionar un mensaje de error más informativo
        error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
        if e.validator == 'required':
            missing_props = e.validator_value
            parent = error_path if error_path != 'root' else ''
            if parent:
                parent += '.'
            missing_props_str = ', '.join([f"'{parent}{prop}'" for prop in missing_props])
            error_msg = f"Missing required properties: {missing_props_str}"
        else:
            error_msg = f"Validation error at '{error_path}': {e.message}"
        
        return False, error_msg
    except SchemaError as e:
        logger.error(f"Schema error: {e}")
        return False, f"Schema error: {str(e)}"
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return False, f"Unexpected error: {str(e)}"

def main():
    # Cargar el esquema
    schema_path = Path("/root/adlbuilder/schema.yaml")
    if not schema_path.exists():
        logger.error(f"Schema file not found: {schema_path}")
        return
    
    schema_content, schema_data = load_yaml(schema_path)
    if not schema_content or not schema_data:
        return
    
    # Cargar el archivo YAML a validar
    yaml_path = Path("/root/adlbuilder/patricia_ok.yaml")
    if not yaml_path.exists():
        logger.error(f"YAML file not found: {yaml_path}")
        return
    
    yaml_content, yaml_data = load_yaml(yaml_path)
    if not yaml_content or not yaml_data:
        return
    
    # Validar el YAML contra el esquema
    logger.info(f"Validating {yaml_path} against {schema_path}...")
    is_valid, error = validate_yaml_against_schema(yaml_content, schema_content)
    
    if is_valid:
        logger.info("✅ YAML is valid according to the schema!")
    else:
        logger.error(f"❌ YAML is not valid: {error}")

if __name__ == "__main__":
    main()
