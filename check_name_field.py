#!/usr/bin/env python3

import yaml
import logging
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_yaml_structure(yaml_path):
    """Verificar si el archivo YAML tiene un campo 'name' a nivel raíz"""
    try:
        # Verificar que el archivo existe
        if not Path(yaml_path).exists():
            logger.error(f"YAML file not found: {yaml_path}")
            return
        
        # Leer el archivo YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_content = f.read()
        
        # Parsear el YAML
        yaml_data = yaml.safe_load(yaml_content)
        
        # Verificar si hay un campo 'name' a nivel raíz
        if 'name' in yaml_data:
            logger.info(f"\u2705 El archivo YAML tiene un campo 'name' a nivel raíz: {yaml_data['name']}")
        else:
            logger.warning(f"\u26a0 El archivo YAML NO tiene un campo 'name' a nivel raíz")
            logger.info(f"Campos a nivel raíz: {list(yaml_data.keys())}")
            
            # Verificar si hay un campo 'name' en metadata
            if 'metadata' in yaml_data and isinstance(yaml_data['metadata'], dict):
                metadata = yaml_data['metadata']
                if 'name' in metadata:
                    logger.info(f"\u2705 El archivo YAML tiene un campo 'name' en la sección 'metadata': {metadata['name']}")
                else:
                    logger.warning(f"\u26a0 El archivo YAML NO tiene un campo 'name' en la sección 'metadata'")
                    logger.info(f"Campos en metadata: {list(metadata.keys())}")
            
            # Verificar si hay un campo 'name' en assistant_instructions
            if 'assistant_instructions' in yaml_data and isinstance(yaml_data['assistant_instructions'], dict):
                ai = yaml_data['assistant_instructions']
                if 'name' in ai:
                    logger.info(f"\u2705 El archivo YAML tiene un campo 'name' en la sección 'assistant_instructions': {ai['name']}")
                else:
                    logger.warning(f"\u26a0 El archivo YAML NO tiene un campo 'name' en la sección 'assistant_instructions'")
                    logger.info(f"Campos en assistant_instructions: {list(ai.keys())}")
    except Exception as e:
        logger.error(f"Error al verificar el archivo YAML: {e}")

def main():
    yaml_path = "/root/adlbuilder/patricia_ok.yaml"
    check_yaml_structure(yaml_path)

if __name__ == "__main__":
    main()
