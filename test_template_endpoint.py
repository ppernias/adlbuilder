#!/usr/bin/env python3

import requests
import json
import logging

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

def test_template_endpoint(token, api_url="http://localhost:8000/api/v1/assistants/template"):
    """Probar el endpoint de la plantilla"""
    try:
        # Configurar headers con token de autenticaciu00f3n
        headers = {
            'Authorization': f'Bearer {token}'
        }
        
        # Realizar la solicitud GET con autenticaciu00f3n
        response = requests.get(api_url, headers=headers)
        
        # Verificar la respuesta
        if response.status_code == 200:
            result = response.json()
            logger.info("\u2705 Plantilla obtenida correctamente!")
            logger.info(f"Respuesta: {json.dumps(result, indent=2)}")
        else:
            logger.error(f"\u274c Error HTTP: {response.status_code}")
            logger.error(f"Respuesta: {response.text}")
    except Exception as e:
        logger.error(f"Error al obtener la plantilla: {e}")

def main():
    # Iniciar sesiu00f3n y obtener token
    logger.info("=== AUTENTICACIU00d3N ===")
    token = login()
    
    if token:
        # Probar endpoint de la plantilla
        logger.info("\n=== PRUEBA DEL ENDPOINT DE LA PLANTILLA ===")
        test_template_endpoint(token)
    else:
        logger.error("No se pudo obtener el token de autenticaciu00f3n. Abortando pruebas.")

if __name__ == "__main__":
    main()
