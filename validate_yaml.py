#!/usr/bin/env python3

import yaml
import json
import sys
from jsonschema import validate, ValidationError, SchemaError
from pathlib import Path

def load_yaml(yaml_path):
    try:
        with open(yaml_path, 'r') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"Error loading YAML: {e}")
        return None

def validate_yaml_against_schema(data, schema):
    try:
        validate(instance=data, schema=schema)
        print("Validation successful!")
        return True
    except ValidationError as e:
        print(f"\nValidation error: {e}")
        print(f"Error path: {e.path}")
        print(f"Error message: {e.message}")
        print(f"Error schema path: {e.schema_path}")
        return False
    except SchemaError as e:
        print(f"\nSchema error: {e}")
        return False

def main():
    # Cargar el esquema
    schema_path = Path("/root/adlbuilder/schema.yaml")
    if not schema_path.exists():
        print(f"Schema file not found: {schema_path}")
        return
    
    schema = load_yaml(schema_path)
    if not schema:
        return
    
    # Cargar el archivo YAML a validar
    yaml_path = Path("/root/adlbuilder/patricia_ok.yaml")
    if not yaml_path.exists():
        print(f"YAML file not found: {yaml_path}")
        return
    
    data = load_yaml(yaml_path)
    if not data:
        return
    
    # Imprimir información para depuración
    print(f"\nYAML file: {yaml_path}")
    print(f"Schema file: {schema_path}")
    
    # Verificar campos requeridos en el nivel raíz
    print("\nChecking required fields at root level:")
    if 'metadata' not in data:
        print("- 'metadata' is missing")
    if 'assistant_instructions' not in data:
        print("- 'assistant_instructions' is missing")
    
    # Verificar campos requeridos en metadata
    if 'metadata' in data:
        metadata = data['metadata']
        print("\nChecking required fields in metadata:")
        required_metadata_fields = ['author', 'description', 'visibility', 'rights', 'history']
        for field in required_metadata_fields:
            if field not in metadata:
                print(f"- 'metadata.{field}' is missing")
        
        # Verificar author si existe
        if 'author' in metadata and isinstance(metadata['author'], dict):
            if 'name' not in metadata['author']:
                print("- 'metadata.author.name' is missing")
        
        # Verificar description si existe
        if 'description' in metadata and isinstance(metadata['description'], dict):
            required_desc_fields = ['title', 'summary', 'coverage', 'educational_level', 'use_cases', 'keywords']
            for field in required_desc_fields:
                if field not in metadata['description']:
                    print(f"- 'metadata.description.{field}' is missing")
    
    # Verificar campos requeridos en assistant_instructions
    if 'assistant_instructions' in data:
        ai = data['assistant_instructions']
        print("\nChecking required fields in assistant_instructions:")
        required_ai_fields = ['context', 'style_guidelines', 'final_notes', 'help_text', 'role', 'behavior', 'capabilities', 'tools']
        for field in required_ai_fields:
            if field not in ai:
                print(f"- 'assistant_instructions.{field}' is missing")
        
        # Verificar tools si existe
        if 'tools' in ai and isinstance(ai['tools'], dict):
            required_tools_fields = ['commands', 'options', 'decorators']
            for field in required_tools_fields:
                if field not in ai['tools']:
                    print(f"- 'assistant_instructions.tools.{field}' is missing")
    
    # Validar contra el esquema
    print("\nValidating against schema:")
    is_valid = validate_yaml_against_schema(data, schema)
    
    if is_valid:
        print("\nYAML is valid according to the schema!")
    else:
        print("\nYAML is not valid according to the schema. See errors above.")

if __name__ == "__main__":
    main()
