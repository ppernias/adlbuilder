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

def validate_yaml_against_schema(yaml_path, schema_path):
    """Validar un archivo YAML contra un esquema"""
    try:
        # Verificar que los archivos existen
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return False
        
        if not Path(schema_path).exists():
            logger.error(f"Schema file not found: {schema_path}")
            return False
        
        # Cargar los archivos
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        # Parsear el YAML y el esquema
        yaml_data = yaml.safe_load(yaml_content)
        schema_data = yaml.safe_load(schema_content)
        
        # Validar contra el esquema
        logger.info(f"Validando {yaml_path} contra el esquema...")
        validate(instance=yaml_data, schema=schema_data)
        logger.info(f"\u2705 {yaml_path} es vu00e1lido segu00fan el esquema")
        return True
    except ValidationError as e:
        error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
        logger.error(f"\u274c Error de validaciu00f3n en '{error_path}': {e.message}")
        return False
    except Exception as e:
        logger.error(f"\u274c Error durante la validaciu00f3n: {e}")
        return False

def main():
    schema_path = "/root/adlbuilder/schema.yaml"
    
    # Validar el archivo original
    original_yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    logger.info(f"\nValidando archivo original: {original_yaml_path}")
    original_valid = validate_yaml_against_schema(original_yaml_path, schema_path)
    
    # Validar el archivo modificado con campo name
    modified_yaml_path = "/root/adlbuilder/patricia_ok_with_name.yaml"
    logger.info(f"\nValidando archivo modificado: {modified_yaml_path}")
    modified_valid = validate_yaml_against_schema(modified_yaml_path, schema_path)
    
    # Resumen
    logger.info("\n=== Resumen de validaciu00f3n ===")
    logger.info(f"Archivo original: {'\u2705 Vu00e1lido' if original_valid else '\u274c Invu00e1lido'}")
    logger.info(f"Archivo modificado: {'\u2705 Vu00e1lido' if modified_valid else '\u274c Invu00e1lido'}")

if __name__ == "__main__":
    main()
