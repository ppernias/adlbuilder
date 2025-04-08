#!/usr/bin/env python3

import requests
import logging
import json
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_validate_yaml(yaml_path, api_url="http://localhost:8000/api/v1/assistants/validate"):
    """Probar la validación de un archivo YAML a través de la API"""
    try:
        # Verificar que el archivo existe
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        # Leer el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        logger.info(f"Validating file: {yaml_path}")
        logger.info(f"Content length: {len(yaml_content)} bytes")
        
        # Crear el payload JSON
        payload = {
            'yaml_content': yaml_content
        }
        
        # Realizar la solicitud POST
        response = requests.post(
            api_url, 
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        # Verificar la respuesta
        if response.status_code == 200:
            result = response.json()
            if result.get('valid'):
                logger.info("\u2705 YAML validation successful!")
                logger.info(f"Response: {json.dumps(result, indent=2)}")
            else:
                logger.error(f"\u274c YAML validation failed: {result.get('errors')}")
                logger.debug(f"Response: {json.dumps(result, indent=2)}")
        else:
            logger.error(f"\u274c HTTP Error: {response.status_code}")
            logger.error(f"Response: {response.text}")
    except Exception as e:
        logger.error(f"Error validating YAML: {e}")

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    test_validate_yaml(yaml_path)

if __name__ == "__main__":
    main()
