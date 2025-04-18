import yaml
from pathlib import Path
from jsonschema import validate, ValidationError
from typing import Dict, Any, List, Optional

# Load schema.yaml
SCHEMA_PATH = Path(__file__).parent.parent.parent / "schema.yaml"
with open(SCHEMA_PATH, "r") as f:
    schema = yaml.safe_load(f)

def validate_yaml_content(content):
    """Validate YAML content against schema with detailed feedback"""
    try:
        # Parse YAML content
        content_dict = yaml.safe_load(content)
        
        # Validate against schema
        validate(instance=content_dict, schema=schema)
        
        return {"valid": True, "message": "YAML content is valid"}
    
    except yaml.YAMLError as e:
        # YAML parsing error with visual feedback
        error_message = str(e)
        visual_feedback = None
        
        if hasattr(e, 'problem_mark'):
            mark = e.problem_mark
            line_num = mark.line + 1
            col_num = mark.column + 1
            
            # Get the problematic line and surrounding context
            lines = content.split('\n')
            context_start = max(0, line_num - 3)
            context_end = min(len(lines), line_num + 2)
            
            # Create visual feedback
            visual_feedback = {
                "line": line_num,
                "column": col_num,
                "context": lines[context_start:context_end],
                "pointer": ' ' * col_num + '^'
            }
        
        return {
            "valid": False,
            "error_type": "YAML_PARSE_ERROR",
            "message": error_message,
            "visual_feedback": visual_feedback
        }
    
    except ValidationError as e:
        # Schema validation error
        path = "." + ".".join([str(p) for p in e.path]) if e.path else ""
        return {
            "valid": False,
            "error_type": "SCHEMA_VALIDATION_ERROR",
            "message": e.message,
            "path": path,
            "schema_path": ".".join([str(p) for p in e.schema_path])
        }
    
    except Exception as e:
        # Other errors
        return {
            "valid": False,
            "error_type": "UNKNOWN_ERROR",
            "message": str(e)
        }
