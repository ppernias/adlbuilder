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

def simulate_frontend_validation(yaml_path):
    """Simular el proceso de validaciu00f3n actualizado del frontend"""
    try:
        # Cargar el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        logger.info(f"Simulando validaciu00f3n frontend actualizada para {yaml_path}")
        
        # Paso 1: Validar sintaxis YAML bu00e1sica (cliente)
        try:
            parsed_yaml = yaml.safe_load(yaml_content)
            if not parsed_yaml:
                logger.error("El YAML no puede estar vacu00edo")
                return False
            logger.info("\u2705 Sintaxis YAML bu00e1sica vu00e1lida")
        except yaml.YAMLError as e:
            logger.error(f"Error de sintaxis YAML: {e}")
            return False
        
        # Paso 2: Verificar campos requeridos a nivel cliente (ACTUALIZADO)
        client_errors = []
        
        # Verificar secciones principales requeridas segu00fan el esquema
        if 'metadata' not in parsed_yaml:
            client_errors.append("La secciu00f3n 'metadata' es obligatoria")
        
        if 'assistant_instructions' not in parsed_yaml:
            client_errors.append("La secciu00f3n 'assistant_instructions' es obligatoria")
        
        if client_errors:
            logger.error("Errores de validaciu00f3n cliente:")
            for error in client_errors:
                logger.error(f"  - {error}")
            return False
        
        logger.info("\u2705 Validaciu00f3n cliente exitosa")
        
        # Paso 3: Validar contra el esquema
        schema_path = "/root/adlbuilder/schema.yaml"
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        schema_data = yaml.safe_load(schema_content)
        
        try:
            validate(instance=parsed_yaml, schema=schema_data)
            logger.info("\u2705 Validaciu00f3n contra el esquema exitosa")
            return True
        except ValidationError as e:
            error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
            logger.error(f"Error de validaciu00f3n en '{error_path}': {e.message}")
            return False
    except Exception as e:
        logger.error(f"Error durante la simulaciu00f3n: {e}")
        return False

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    
    if not Path(yaml_path).exists():
        logger.error(f"YAML file not found: {yaml_path}")
        return
    
    is_valid = simulate_frontend_validation(yaml_path)
    
    if is_valid:
        logger.info("\n\u2705 El archivo YAML es vu00e1lido segu00fan la simulaciu00f3n del frontend actualizado")
    else:
        logger.error("\n\u274c El archivo YAML no es vu00e1lido segu00fan la simulaciu00f3n del frontend actualizado")

if __name__ == "__main__":
    main()
