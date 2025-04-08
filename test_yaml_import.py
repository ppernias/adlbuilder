#!/usr/bin/env python3

import yaml
import json
import logging
import sys
from pathlib import Path
from jsonschema import validate, ValidationError

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_and_validate_yaml(yaml_path, schema_path):
    """Cargar y validar un archivo YAML contra un esquema"""
    try:
        # Cargar el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        # Cargar el esquema
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        # Parsear el YAML y el esquema
        yaml_data = yaml.safe_load(yaml_content)
        schema_data = yaml.safe_load(schema_content)
        
        logger.debug(f"YAML data keys: {list(yaml_data.keys())}")
        logger.debug(f"Schema required properties: {schema_data.get('required', [])}")
        
        # Verificar secciones requeridas en el nivel rau00edz
        missing_root_fields = []
        for required_field in schema_data.get('required', []):
            if required_field not in yaml_data:
                missing_root_fields.append(required_field)
                logger.error(f"Required root field '{required_field}' is missing")
        
        if missing_root_fields:
            logger.error(f"Missing required root fields: {missing_root_fields}")
            return False, [f"Required root sections missing: {', '.join(missing_root_fields)}"], yaml_content
        
        # Verificar secciu00f3n tools en assistant_instructions
        if 'assistant_instructions' in yaml_data and 'tools' in yaml_data['assistant_instructions']:
            tools = yaml_data['assistant_instructions']['tools']
            # Verificar que tools tenga las subsecciones requeridas
            required_tools_sections = ['commands', 'options', 'decorators']
            missing_tools_sections = []
            
            for section in required_tools_sections:
                if section not in tools:
                    missing_tools_sections.append(section)
                    logger.error(f"Required tools section '{section}' is missing")
            
            if missing_tools_sections:
                logger.error(f"Missing required tools sections: {missing_tools_sections}")
                return False, [f"Required fields missing in 'assistant_instructions.tools': {', '.join(missing_tools_sections)}"], yaml_content
        
        # Validar contra el esquema
        validate(instance=yaml_data, schema=schema_data)
        logger.debug("Validation successful!")
        return True, None, yaml_content
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
        return False, [f"Validation error at '{error_path}': {e.message}"], yaml_content
    except Exception as e:
        logger.error(f"Error during validation: {e}")
        return False, [f"Error during validation: {str(e)}"], yaml_content

def simulate_yaml_import(yaml_path, schema_path):
    """Simular el proceso de importaciu00f3n de YAML en la aplicaciu00f3n"""
    logger.info(f"Simulando importaciu00f3n de {yaml_path}...")
    
    # Paso 1: Cargar y validar el YAML
    is_valid, errors, yaml_content = load_and_validate_yaml(yaml_path, schema_path)
    
    if not is_valid:
        logger.error(f"Error de validaciu00f3n: {errors}")
        return False, errors
    
    # Paso 2: Simular el procesamiento del YAML en la aplicaciu00f3n
    try:
        yaml_data = yaml.safe_load(yaml_content)
        
        # Verificar que la estructura sea la esperada por la aplicaciu00f3n
        if 'metadata' not in yaml_data or 'assistant_instructions' not in yaml_data:
            logger.error("Estructura YAML invu00e1lida: faltan secciones requeridas")
            return False, ["Estructura YAML invu00e1lida: faltan secciones requeridas"]
        
        # Verificar la secciu00f3n tools
        if 'tools' not in yaml_data['assistant_instructions']:
            logger.error("Estructura YAML invu00e1lida: falta la secciu00f3n 'tools' en 'assistant_instructions'")
            return False, ["Estructura YAML invu00e1lida: falta la secciu00f3n 'tools' en 'assistant_instructions'"]
        
        tools = yaml_data['assistant_instructions']['tools']
        if not isinstance(tools, dict):
            logger.error("Estructura YAML invu00e1lida: 'tools' debe ser un objeto")
            return False, ["Estructura YAML invu00e1lida: 'tools' debe ser un objeto"]
        
        # Verificar las subsecciones de tools
        for section in ['commands', 'options', 'decorators']:
            if section not in tools:
                logger.error(f"Estructura YAML invu00e1lida: falta la subsecciu00f3n '{section}' en 'tools'")
                return False, [f"Estructura YAML invu00e1lida: falta la subsecciu00f3n '{section}' en 'tools'"]
        
        logger.info("Simulaciu00f3n de importaciu00f3n exitosa")
        return True, None
    except Exception as e:
        logger.error(f"Error durante la simulaciu00f3n de importaciu00f3n: {e}")
        return False, [f"Error durante la simulaciu00f3n de importaciu00f3n: {str(e)}"]

def main():
    if len(sys.argv) > 1:
        yaml_path = Path(sys.argv[1])
    else:
        yaml_path = Path("/root/adlbuilder/patricia_ok.yaml")
    
    schema_path = Path("/root/adlbuilder/schema.yaml")
    
    if not yaml_path.exists():
        logger.error(f"YAML file not found: {yaml_path}")
        return
    
    if not schema_path.exists():
        logger.error(f"Schema file not found: {schema_path}")
        return
    
    is_valid, errors = simulate_yaml_import(yaml_path, schema_path)
    
    if is_valid:
        logger.info("u2705 YAML import simulation successful!")
    else:
        logger.error(f"u274c YAML import simulation failed: {errors}")

if __name__ == "__main__":
    main()
