#!/usr/bin/env python3

import yaml
import json
import logging
from pathlib import Path
from jsonschema import validate, ValidationError
from app.services.yaml_service import YAMLService

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_server_validation(yaml_path, schema_path="/root/adlbuilder/schema.yaml"):
    """Simular la validaciu00f3n del servidor directamente"""
    try:
        # Verificar que los archivos existen
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        if not Path(schema_path).exists():
            logger.error(f"Schema file not found: {schema_path}")
            return
        
        # Cargar el servicio YAML
        yaml_service = YAMLService()
        
        # Leer el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        logger.info(f"Validando archivo: {yaml_path}")
        logger.info(f"Contenido: {len(yaml_content)} bytes")
        
        # Cargar el esquema
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        # Validar el YAML contra el esquema usando el servicio
        try:
            # Primero, convertir el contenido YAML a un diccionario
            yaml_dict = yaml.safe_load(yaml_content)
            schema_dict = yaml.safe_load(schema_content)
            
            # Validar manualmente
            validate(instance=yaml_dict, schema=schema_dict)
            logger.info("\u2705 YAML validado correctamente!")
            logger.info(f"El archivo {yaml_path} cumple con el esquema.")
        except ValidationError as e:
            error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
            logger.error(f"\u274c Error de validaci\u00f3n en '{error_path}': {e.message}")
        except Exception as e:
            logger.error(f"Error durante la validaci\u00f3n: {e}")
    except Exception as e:
        logger.error(f"Error durante la validaciu00f3n: {e}")

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    test_server_validation(yaml_path)

if __name__ == "__main__":
    main()
