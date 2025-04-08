#!/usr/bin/env python3

import requests
import yaml
import json
import logging
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_api_validation(yaml_path, api_url="http://localhost:8000/api/v1/assistants/validate"):
    """Probar la validaciu00f3n de un archivo YAML a travu00e9s de la API sin autenticaciu00f3n"""
    try:
        # Verificar que el archivo existe
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        # Leer el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        logger.info(f"Validando archivo: {yaml_path}")
        logger.info(f"Contenido: {len(yaml_content)} bytes")
        
        # Crear el payload JSON
        payload = {
            'yaml_content': yaml_content
        }
        
        # Realizar la solicitud POST sin autenticaciu00f3n (solo para pruebas)
        response = requests.post(api_url, json=payload)
        
        # Verificar la respuesta
        if response.status_code == 200:
            result = response.json()
            if result.get('valid'):
                logger.info("\u2705 YAML validado correctamente!")
                logger.info(f"Respuesta: {json.dumps(result, indent=2)}")
            else:
                logger.error(f"\u274c YAML invu00e1lido: {result.get('errors')}")
                logger.error(f"Respuesta: {json.dumps(result, indent=2)}")
        else:
            logger.error(f"\u274c Error HTTP: {response.status_code}")
            logger.error(f"Respuesta: {response.text}")
    except Exception as e:
        logger.error(f"Error durante la validaciu00f3n: {e}")

def test_local_validation(yaml_path):
    """Probar la validaciu00f3n local del archivo YAML"""
    try:
        # Verificar que el archivo existe
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        # Leer el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        logger.info(f"Validando localmente: {yaml_path}")
        
        # Paso 1: Validar sintaxis YAML bu00e1sica
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
        return True
    except Exception as e:
        logger.error(f"Error durante la validaciu00f3n local: {e}")
        return False

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    
    # Probar validaciu00f3n local
    logger.info("=== VALIDACIU00d3N LOCAL ===")
    is_valid_local = test_local_validation(yaml_path)
    
    if is_valid_local:
        logger.info("\n\u2705 El archivo YAML es vu00e1lido segu00fan la validaciu00f3n local")
    else:
        logger.error("\n\u274c El archivo YAML no es vu00e1lido segu00fan la validaciu00f3n local")
    
    # Probar validaciu00f3n API
    logger.info("\n=== VALIDACIU00d3N API ===")
    test_api_validation(yaml_path)

if __name__ == "__main__":
    main()
