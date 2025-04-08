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

def get_access_token(login_url="http://localhost:8000/api/v1/login/access-token"):
    """Obtener un token de acceso para la API"""
    try:
        # Datos de inicio de sesión (usuario y contraseña)
        login_data = {
            "username": "admin@adlbuilder.com",
            "password": "adminpassword"
        }
        
        # Realizar la solicitud POST para obtener el token
        response = requests.post(
            login_url,
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        # Verificar la respuesta
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get("access_token")
            if access_token:
                logger.debug("Token de acceso obtenido correctamente")
                return access_token
            else:
                logger.error("No se pudo obtener el token de acceso")
                return None
        else:
            logger.error(f"Error al obtener el token: {response.status_code}")
            logger.error(f"Respuesta: {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error al obtener el token: {e}")
        return None

def test_upload_yaml(yaml_path, api_url="http://localhost:8000/api/v1/assistants/upload"):
    """Probar la carga de un archivo YAML a través de la API"""
    try:
        # Verificar que el archivo existe
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        # Obtener token de acceso
        access_token = get_access_token()
        if not access_token:
            logger.error("No se pudo obtener el token de acceso. Abortando.")
            return
        
        # Leer el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        logger.info(f"Uploading file: {yaml_path}")
        logger.info(f"Content length: {len(yaml_content)} bytes")
        
        # Crear un objeto de archivo para enviar
        files = {
            'file': (Path(yaml_path).name, yaml_content, 'application/x-yaml')
        }
        
        # Configurar los headers con el token de autenticación
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        # Realizar la solicitud POST
        response = requests.post(api_url, files=files, headers=headers)
        
        # Verificar la respuesta
        if response.status_code == 200:
            result = response.json()
            if result.get('valid'):
                logger.info("\u2705 YAML upload successful!")
                logger.info(f"Response: {json.dumps(result, indent=2)}")
            else:
                logger.error(f"\u274c YAML validation failed: {result.get('errors')}")
                logger.debug(f"Response: {json.dumps(result, indent=2)}")
        else:
            logger.error(f"\u274c HTTP Error: {response.status_code}")
            logger.error(f"Response: {response.text}")
    except Exception as e:
        logger.error(f"Error uploading YAML: {e}")

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    test_upload_yaml(yaml_path)

if __name__ == "__main__":
    main()
