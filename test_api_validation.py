#!/usr/bin/env python3

import requests
import json
import logging
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_yaml_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        logger.error(f"Error loading YAML from {file_path}: {e}")
        return None

def validate_yaml_via_api(yaml_content):
    try:
        url = "http://localhost:8000/api/v1/assistants/validate"
        headers = {"Content-Type": "application/json"}
        data = {"yaml_content": yaml_content}
        
        logger.debug(f"Sending request to {url}")
        response = requests.post(url, headers=headers, json=data)
        
        logger.debug(f"Response status code: {response.status_code}")
        logger.debug(f"Response headers: {response.headers}")
        
        try:
            result = response.json()
            logger.debug(f"Response JSON: {json.dumps(result, indent=2)}")
            return result
        except Exception as e:
            logger.error(f"Error parsing response JSON: {e}")
            logger.debug(f"Response text: {response.text}")
            return {"valid": False, "errors": [f"Error parsing response: {str(e)}"]}
    except Exception as e:
        logger.error(f"Error making API request: {e}")
        return {"valid": False, "errors": [f"Error making API request: {str(e)}"]}

def main():
    # Cargar el archivo YAML a validar
    yaml_path = Path("/root/adlbuilder/patricia_ok.yaml")
    if not yaml_path.exists():
        logger.error(f"YAML file not found: {yaml_path}")
        return
    
    yaml_content = load_yaml_content(yaml_path)
    if not yaml_content:
        return
    
    # Validar el YAML a través de la API
    logger.info(f"Validating {yaml_path} via API...")
    result = validate_yaml_via_api(yaml_content)
    
    if result.get("valid", False):
        logger.info("u2705 YAML is valid according to the API!")
    else:
        errors = result.get("errors", ["Unknown error"])
        logger.error(f"u274c YAML is not valid according to the API: {', '.join(errors)}")

if __name__ == "__main__":
    main()
