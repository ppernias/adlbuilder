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

def upload_yaml_file(file_path):
    try:
        url = "http://localhost:8000/api/v1/assistants/upload"
        
        # Obtener un token de autenticación (esto es solo para pruebas)
        auth_url = "http://localhost:8000/api/v1/auth/login/access-token"
        auth_data = {"username": "admin@example.com", "password": "password"}
        auth_response = requests.post(auth_url, json=auth_data)
        
        if not auth_response.ok:
            logger.error(f"Error de autenticación: {auth_response.status_code} {auth_response.text}")
            return
        
        token = auth_response.json().get("access_token")
        if not token:
            logger.error("No se pudo obtener el token de autenticación")
            return
        
        logger.debug(f"Token obtenido: {token[:10]}...")
        
        # Preparar el archivo para la carga
        files = {'file': (file_path.name, open(file_path, 'rb'), 'application/x-yaml')}
        headers = {'Authorization': f'Bearer {token}'}
        
        logger.debug(f"Enviando archivo {file_path} al endpoint {url}")
        response = requests.post(url, headers=headers, files=files)
        
        logger.debug(f"Respuesta: {response.status_code}")
        
        if response.ok:
            result = response.json()
            logger.debug(f"Respuesta JSON: {json.dumps(result, indent=2)}")
            
            if result.get("valid", False):
                logger.info("✅ El archivo YAML es válido según el servidor")
                return True
            else:
                errors = result.get("errors", ["Error desconocido"])
                logger.error(f"❌ El archivo YAML no es válido: {', '.join(errors)}")
                return False
        else:
            logger.error(f"Error en la respuesta: {response.status_code} {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error al cargar el archivo: {e}")
        return False

def main():
    yaml_path = Path("/root/adlbuilder/patricia_ok.yaml")
    if not yaml_path.exists():
        logger.error(f"Archivo YAML no encontrado: {yaml_path}")
        return
    
    logger.info(f"Cargando archivo YAML: {yaml_path}")
    result = upload_yaml_file(yaml_path)
    
    if result:
        logger.info("Proceso completado con éxito")
    else:
        logger.error("El proceso falló")

if __name__ == "__main__":
    main()
