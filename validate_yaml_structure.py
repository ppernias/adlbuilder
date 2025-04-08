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

def analyze_yaml_structure(yaml_data, schema_data):
    """Analizar la estructura del YAML y verificar que cumple con el esquema"""
    try:
        # Verificar las secciones principales
        logger.info("Verificando secciones principales...")
        root_keys = list(yaml_data.keys())
        required_keys = schema_data.get('required', [])
        logger.info(f"Secciones encontradas: {root_keys}")
        logger.info(f"Secciones requeridas: {required_keys}")
        
        missing_keys = [key for key in required_keys if key not in root_keys]
        if missing_keys:
            logger.error(f"Faltan secciones requeridas: {missing_keys}")
        else:
            logger.info("\u2705 Todas las secciones requeridas están presentes")
        
        # Verificar la sección metadata
        if 'metadata' in yaml_data:
            logger.info("\nVerificando sección 'metadata'...")
            metadata = yaml_data['metadata']
            metadata_keys = list(metadata.keys())
            logger.info(f"Campos encontrados en metadata: {metadata_keys}")
            
            metadata_schema = schema_data['properties']['metadata']
            metadata_required = metadata_schema.get('required', [])
            logger.info(f"Campos requeridos en metadata: {metadata_required}")
            
            missing_metadata = [key for key in metadata_required if key not in metadata_keys]
            if missing_metadata:
                logger.error(f"Faltan campos requeridos en metadata: {missing_metadata}")
            else:
                logger.info("\u2705 Todos los campos requeridos en metadata están presentes")
        
        # Verificar la sección assistant_instructions
        if 'assistant_instructions' in yaml_data:
            logger.info("\nVerificando sección 'assistant_instructions'...")
            ai = yaml_data['assistant_instructions']
            ai_keys = list(ai.keys())
            logger.info(f"Campos encontrados en assistant_instructions: {ai_keys}")
            
            ai_schema = schema_data['properties']['assistant_instructions']
            ai_required = ai_schema.get('required', [])
            logger.info(f"Campos requeridos en assistant_instructions: {ai_required}")
            
            missing_ai = [key for key in ai_required if key not in ai_keys]
            if missing_ai:
                logger.error(f"Faltan campos requeridos en assistant_instructions: {missing_ai}")
            else:
                logger.info("\u2705 Todos los campos requeridos en assistant_instructions están presentes")
            
            # Verificar la sección tools
            if 'tools' in ai:
                logger.info("\nVerificando sección 'tools'...")
                tools = ai['tools']
                tools_keys = list(tools.keys())
                logger.info(f"Campos encontrados en tools: {tools_keys}")
                
                tools_schema = ai_schema['properties']['tools']
                tools_required = tools_schema.get('required', [])
                logger.info(f"Campos requeridos en tools: {tools_required}")
                
                missing_tools = [key for key in tools_required if key not in tools_keys]
                if missing_tools:
                    logger.error(f"Faltan campos requeridos en tools: {missing_tools}")
                else:
                    logger.info("\u2705 Todos los campos requeridos en tools están presentes")
        
        # Validar contra el esquema
        logger.info("\nValidando YAML contra el esquema...")
        validate(instance=yaml_data, schema=schema_data)
        logger.info("\u2705 YAML válido según el esquema")
        return True
    except ValidationError as e:
        error_path = '.'.join(str(path) for path in e.path) if e.path else 'root'
        logger.error(f"\u274c Error de validación en '{error_path}': {e.message}")
        return False
    except Exception as e:
        logger.error(f"\u274c Error durante el análisis: {e}")
        return False

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    schema_path = "/root/adlbuilder/schema.yaml"
    
    # Verificar que los archivos existen
    if not Path(yaml_path).exists():
        logger.error(f"YAML file not found: {yaml_path}")
        return
    
    if not Path(schema_path).exists():
        logger.error(f"Schema file not found: {schema_path}")
        return
    
    # Cargar los archivos
    try:
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        # Parsear el YAML y el esquema
        yaml_data = yaml.safe_load(yaml_content)
        schema_data = yaml.safe_load(schema_content)
        
        # Analizar la estructura
        logger.info(f"Analizando estructura de {yaml_path}...\n")
        is_valid = analyze_yaml_structure(yaml_data, schema_data)
        
        if is_valid:
            logger.info("\n\u2705 El archivo YAML es válido y cumple con todos los requisitos del esquema")
        else:
            logger.error("\n\u274c El archivo YAML no es válido según el esquema")
    except Exception as e:
        logger.error(f"Error al procesar los archivos: {e}")

if __name__ == "__main__":
    main()
