#!/usr/bin/env python3

import yaml
import json
import logging
from pathlib import Path
from jsonschema import validate, ValidationError

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def validate_yaml_directly(yaml_path, schema_path):
    """Validar un archivo YAML directamente contra un esquema sin usar la API"""
    try:
        # Cargar el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        # Cargar el esquema
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        # Parsear el YAML y el esquema
        yaml_data = yaml.safe_load(yaml_content)
        schema_data = yaml.safe_load(schema_content)
        
        logger.debug(f"YAML data keys: {list(yaml_data.keys())}")
        logger.debug(f"Schema required properties: {schema_data.get('required', [])}")
        
        # Verificar secciones requeridas en el nivel raíz
        missing_root_fields = []
        for required_field in schema_data.get('required', []):
            if required_field not in yaml_data:
                missing_root_fields.append(required_field)
                logger.error(f"Required root field '{required_field}' is missing")
        
        if missing_root_fields:
            logger.error(f"Missing required root fields: {missing_root_fields}")
            return False, [f"Required root sections missing: {', '.join(missing_root_fields)}"]
        
        # Verificar sección tools en assistant_instructions
        if 'assistant_instructions' in yaml_data and 'tools' in yaml_data['assistant_instructions']:
            tools = yaml_data['assistant_instructions']['tools']
            # Verificar que tools tenga las subsecciones requeridas
            required_tools_sections = ['commands', 'options', 'decorators']
            missing_tools_sections = []
            
            for section in required_tools_sections:
                if section not in tools:
                    missing_tools_sections.append(section)
                    logger.error(f"Required tools section '{section}' is missing")
            
            if missing_tools_sections:
                logger.error(f"Missing required tools sections: {missing_tools_sections}")
                return False, [f"Required fields missing in 'assistant_instructions.tools': {', '.join(missing_tools_sections)}"]
        
        # Validar contra el esquema
        validate(instance=yaml_data, schema=schema_data)
        logger.debug("Validation successful!")
        return True, None
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
        return False, [f"Validation error at '{error_path}': {e.message}"]
    except Exception as e:
        logger.error(f"Error during validation: {e}")
        return False, [f"Error during validation: {str(e)}"]

def main():
    yaml_path = Path("/root/adlbuilder/patricia_ok.yaml")
    schema_path = Path("/root/adlbuilder/schema.yaml")
    
    if not yaml_path.exists():
        logger.error(f"YAML file not found: {yaml_path}")
        return
    
    if not schema_path.exists():
        logger.error(f"Schema file not found: {schema_path}")
        return
    
    logger.info(f"Validating {yaml_path} against {schema_path}...")
    is_valid, errors = validate_yaml_directly(yaml_path, schema_path)
    
    if is_valid:
        logger.info("✅ YAML is valid according to the schema!")
    else:
        logger.error(f"❌ YAML is not valid: {errors}")

if __name__ == "__main__":
    main()
