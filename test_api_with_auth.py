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

def login(email="admin@adlbuilder.com", password="adminpassword", login_url="http://localhost:8000/api/v1/login/access-token"):
    """Iniciar sesiu00f3n y obtener token de acceso"""
    try:
        # Crear payload para login
        login_data = {
            'username': email,
            'password': password
        }
        
        # Realizar solicitud POST para login
        response = requests.post(login_url, data=login_data)
        
        # Verificar respuesta
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get('access_token')
            logger.info("\u2705 Login exitoso, token obtenido")
            return access_token
        else:
            logger.error(f"\u274c Error de login: {response.status_code}")
            logger.error(f"Respuesta: {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error durante el login: {e}")
        return None

def test_api_validation_with_auth(yaml_path, token, api_url="http://localhost:8000/api/v1/assistants/validate"):
    """Probar la validaciu00f3n de un archivo YAML a travu00e9s de la API con autenticaciu00f3n"""
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
        
        # Configurar headers con token de autenticaciu00f3n
        headers = {
            'Authorization': f'Bearer {token}'
        }
        
        # Realizar la solicitud POST con autenticaciu00f3n
        response = requests.post(api_url, json=payload, headers=headers)
        
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

def test_upload_yaml_with_auth(yaml_path, token, api_url="http://localhost:8000/api/v1/assistants/upload"):
    """Probar la carga y validaciu00f3n de un archivo YAML a travu00e9s de la API con autenticaciu00f3n"""
    try:
        # Verificar que el archivo existe
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        logger.info(f"Cargando archivo: {yaml_path}")
        
        # Configurar headers con token de autenticaciu00f3n
        headers = {
            'Authorization': f'Bearer {token}'
        }
        
        # Crear el archivo para subir
        files = {
            'file': (Path(yaml_path).name, open(yaml_path, 'rb'), 'application/x-yaml')
        }
        
        # Realizar la solicitud POST con autenticaciu00f3n
        response = requests.post(api_url, files=files, headers=headers)
        
        # Verificar la respuesta
        if response.status_code == 200:
            result = response.json()
            if result.get('valid'):
                logger.info("\u2705 YAML cargado y validado correctamente!")
                logger.info(f"Respuesta: {json.dumps(result, indent=2)}")
            else:
                logger.error(f"\u274c YAML invu00e1lido: {result.get('errors')}")
                logger.error(f"Respuesta: {json.dumps(result, indent=2)}")
        else:
            logger.error(f"\u274c Error HTTP: {response.status_code}")
            logger.error(f"Respuesta: {response.text}")
    except Exception as e:
        logger.error(f"Error durante la carga: {e}")
    finally:
        # Cerrar el archivo
        files['file'][1].close()

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    
    # Iniciar sesiu00f3n y obtener token
    logger.info("=== AUTENTICACIU00d3N ===")
    token = login()
    
    if token:
        # Probar validaciu00f3n API con autenticaciu00f3n
        logger.info("\n=== VALIDACIU00d3N API CON AUTENTICACIU00d3N ===")
        test_api_validation_with_auth(yaml_path, token)
        
        # Probar carga y validaciu00f3n API con autenticaciu00f3n
        logger.info("\n=== CARGA Y VALIDACIU00d3N API CON AUTENTICACIU00d3N ===")
        test_upload_yaml_with_auth(yaml_path, token)
    else:
        logger.error("No se pudo obtener el token de autenticaciu00f3n. Abortando pruebas.")

if __name__ == "__main__":
    main()
