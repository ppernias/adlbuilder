#!/usr/bin/env python3

import yaml
import json
import logging
import requests
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def simulate_frontend_validation(yaml_path):
    """Simular el proceso de validaciu00f3n que ocurre en el frontend"""
    try:
        # Cargar el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        logger.info(f"Simulando validaciu00f3n frontend para {yaml_path}")
        
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
        
        # Paso 2: Verificar campos requeridos a nivel cliente
        client_errors = []
        
        # Verificar campos requeridos segu00fan el frontend
        if 'metadata' not in parsed_yaml:
            client_errors.append("Falta la secciu00f3n 'metadata'")
        
        if 'assistant_instructions' not in parsed_yaml:
            client_errors.append("Falta la secciu00f3n 'assistant_instructions'")
        
        # Verificar campos en metadata
        if 'metadata' in parsed_yaml:
            metadata = parsed_yaml['metadata']
            if not isinstance(metadata, dict):
                client_errors.append("'metadata' debe ser un objeto")
            else:
                required_metadata_fields = ['author', 'description', 'visibility', 'rights', 'history']
                for field in required_metadata_fields:
                    if field not in metadata:
                        client_errors.append(f"Falta el campo '{field}' en metadata")
        
        # Verificar campos en assistant_instructions
        if 'assistant_instructions' in parsed_yaml:
            ai = parsed_yaml['assistant_instructions']
            if not isinstance(ai, dict):
                client_errors.append("'assistant_instructions' debe ser un objeto")
            else:
                required_ai_fields = ['context', 'style_guidelines', 'final_notes', 'help_text', 'role', 'behavior', 'capabilities', 'tools']
                for field in required_ai_fields:
                    if field not in ai:
                        client_errors.append(f"Falta el campo '{field}' en assistant_instructions")
                
                # Verificar tools
                if 'tools' in ai:
                    tools = ai['tools']
                    if not isinstance(tools, dict):
                        client_errors.append("'tools' debe ser un objeto")
                    else:
                        required_tools_fields = ['commands', 'options', 'decorators']
                        for field in required_tools_fields:
                            if field not in tools:
                                client_errors.append(f"Falta el campo '{field}' en tools")
        
        if client_errors:
            logger.error("Errores de validaciu00f3n cliente:")
            for error in client_errors:
                logger.error(f"  - {error}")
            return False
        
        logger.info("\u2705 Validaciu00f3n cliente exitosa")
        
        # Paso 3: Simular validaciu00f3n del servidor
        # En este punto, el frontend enviaru00eda el YAML al servidor para validaciu00f3n
        # Vamos a simular esto validando contra el esquema localmente
        schema_path = "/root/adlbuilder/schema.yaml"
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        schema_data = yaml.safe_load(schema_content)
        
        # Importar jsonschema para validar
        from jsonschema import validate, ValidationError
        
        try:
            validate(instance=parsed_yaml, schema=schema_data)
            logger.info("\u2705 Validaciu00f3n servidor exitosa")
            return True
        except ValidationError as e:
            error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
            logger.error(f"Error de validaciu00f3n servidor en '{error_path}': {e.message}")
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
        logger.info("\n\u2705 El archivo YAML es vu00e1lido segu00fan la simulaciu00f3n del frontend")
    else:
        logger.error("\n\u274c El archivo YAML no es vu00e1lido segu00fan la simulaciu00f3n del frontend")

if __name__ == "__main__":
    main()
