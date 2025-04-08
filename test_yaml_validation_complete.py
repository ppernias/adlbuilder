#!/usr/bin/env python3

import yaml
import json
import logging
import sys
from pathlib import Path
from jsonschema import validate, ValidationError

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def validate_yaml_structure(yaml_data):
    """Validar la estructura del YAML sin usar jsonschema"""
    errors = []
    
    # Verificar secciones de nivel raíz
    if 'metadata' not in yaml_data:
        errors.append("Required section 'metadata' is missing")
    if 'assistant_instructions' not in yaml_data:
        errors.append("Required section 'assistant_instructions' is missing")
    
    # Verificar metadata si existe
    if 'metadata' in yaml_data:
        metadata = yaml_data['metadata']
        if not isinstance(metadata, dict):
            errors.append("'metadata' must be an object")
        else:
            required_metadata_fields = ['author', 'description', 'visibility', 'rights', 'history']
            for field in required_metadata_fields:
                if field not in metadata:
                    errors.append(f"Required field 'metadata.{field}' is missing")
            
            # Verificar author si existe
            if 'author' in metadata:
                if not isinstance(metadata['author'], dict):
                    errors.append("'metadata.author' must be an object")
                elif 'name' not in metadata['author']:
                    errors.append("Required field 'metadata.author.name' is missing")
            
            # Verificar description si existe
            if 'description' in metadata:
                if not isinstance(metadata['description'], dict):
                    errors.append("'metadata.description' must be an object")
                else:
                    required_desc_fields = ['title', 'summary', 'coverage', 'educational_level', 'use_cases', 'keywords']
                    for field in required_desc_fields:
                        if field not in metadata['description']:
                            errors.append(f"Required field 'metadata.description.{field}' is missing")
    
    # Verificar assistant_instructions si existe
    if 'assistant_instructions' in yaml_data:
        ai = yaml_data['assistant_instructions']
        if not isinstance(ai, dict):
            errors.append("'assistant_instructions' must be an object")
        else:
            required_ai_fields = ['context', 'style_guidelines', 'final_notes', 'help_text', 'role', 'behavior', 'capabilities', 'tools']
            for field in required_ai_fields:
                if field not in ai:
                    errors.append(f"Required field 'assistant_instructions.{field}' is missing")
            
            # Verificar tools si existe
            if 'tools' in ai:
                if not isinstance(ai['tools'], dict):
                    errors.append("'assistant_instructions.tools' must be an object")
                else:
                    required_tools_fields = ['commands', 'options', 'decorators']
                    for field in required_tools_fields:
                        if field not in ai['tools']:
                            errors.append(f"Required field 'assistant_instructions.tools.{field}' is missing")
    
    return errors

def validate_yaml_against_schema(yaml_data, schema_data):
    """Validar YAML contra esquema usando jsonschema"""
    try:
        validate(instance=yaml_data, schema=schema_data)
        return []
    except ValidationError as e:
        error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
        return [f"Validation error at '{error_path}': {e.message}"]

def validate_yaml_file(yaml_path, schema_path):
    """Validar un archivo YAML contra un esquema"""
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
        
        # Validar la estructura del YAML
        structure_errors = validate_yaml_structure(yaml_data)
        if structure_errors:
            logger.error("Structure validation errors:")
            for error in structure_errors:
                logger.error(f"  - {error}")
            return False, structure_errors
        
        # Validar contra el esquema
        schema_errors = validate_yaml_against_schema(yaml_data, schema_data)
        if schema_errors:
            logger.error("Schema validation errors:")
            for error in schema_errors:
                logger.error(f"  - {error}")
            return False, schema_errors
        
        logger.debug("Validation successful!")
        return True, None
    except Exception as e:
        logger.error(f"Error during validation: {e}")
        return False, [f"Error during validation: {str(e)}"]

def check_yaml_file(yaml_path, schema_path):
    """Verificar un archivo YAML y mostrar información detallada"""
    logger.info(f"Checking YAML file: {yaml_path}")
    
    try:
        # Verificar que los archivos existen
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        if not Path(schema_path).exists():
            logger.error(f"Schema file not found: {schema_path}")
            return
        
        # Cargar el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        # Verificar que el contenido no está vacío
        if not yaml_content.strip():
            logger.error("YAML file is empty")
            return
        
        # Verificar que el YAML es sintácticamente válido
        try:
            yaml_data = yaml.safe_load(yaml_content)
            if yaml_data is None:
                logger.error("YAML content is empty or invalid")
                return
        except yaml.YAMLError as e:
            logger.error(f"YAML syntax error: {e}")
            return
        
        # Mostrar información sobre el YAML
        logger.info(f"YAML file size: {len(yaml_content)} bytes")
        logger.info(f"YAML structure: {list(yaml_data.keys())}")
        
        # Validar el YAML
        logger.info(f"Validating {yaml_path} against {schema_path}...")
        is_valid, errors = validate_yaml_file(yaml_path, schema_path)
        
        if is_valid:
            logger.info("\u2705 YAML is valid according to the schema!")
        else:
            logger.error(f"\u274c YAML is not valid: {errors}")
    except Exception as e:
        logger.error(f"Error checking YAML file: {e}")

def main():
    if len(sys.argv) > 1:
        yaml_path = sys.argv[1]
    else:
        yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    
    schema_path = "/root/adlbuilder/schema.yaml"
    check_yaml_file(yaml_path, schema_path)

if __name__ == "__main__":
    main()
