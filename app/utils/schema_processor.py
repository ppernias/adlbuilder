import copy
from typing import Dict, Any, List, Optional
import yaml as yaml_module

def process_schema_node(node, path="", category_filter=None, ui_order=1):
    """
    Process a schema node to make it compatible with form libraries and apply category filtering.
    """
    # Make a copy to avoid modifying the original
    processed_node = copy.deepcopy(node)
    
    # Add a flag to track if this node matches the filter
    processed_node["matchesFilter"] = True
    
    # Check if this node has a category and apply filtering
    if category_filter and "x-category" in processed_node:
        if processed_node["x-category"] != category_filter:
            processed_node["matchesFilter"] = False
    
    # Process child nodes
    if "properties" in processed_node:
        for prop_name, prop_value in processed_node["properties"].items():
            new_path = f"{path}.{prop_name}" if path else prop_name
            processed_node["properties"][prop_name] = process_schema_node(prop_value, new_path, category_filter)
    
    if "items" in processed_node and isinstance(processed_node["items"], dict):
        new_path = f"{path}[]" if path else ""
        processed_node["items"] = process_schema_node(processed_node["items"], new_path, category_filter)
    
    return processed_node

def create_fields_list(schema: Dict[str, Any], path: str = "", category_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Create a flat list of fields from the schema.
    Only include leaf nodes (fields that don't have nested properties).
    """
    fields = []
    
    # Check if this node has properties
    if "properties" in schema:
        for prop_name, prop_value in schema["properties"].items():
            new_path = f"{path}.{prop_name}" if path else prop_name
            
            # Check if this field matches the category filter
            if category_filter and "x-category" in prop_value and prop_value["x-category"] != category_filter:
                continue
            
            # Check if this is a leaf node (no nested properties)
            is_leaf_node = "properties" not in prop_value and not (
                prop_value.get("type") == "array" and 
                "items" in prop_value and 
                isinstance(prop_value["items"], dict) and 
                "properties" in prop_value["items"]
            )
            
            # Only add leaf nodes to the fields list
            if is_leaf_node:
                field_info = {
                    "path": new_path,
                    "title": prop_value.get("title", prop_name),
                    "type": prop_value.get("type", "string"),
                    "description": prop_value.get("description", ""),
                    "required": prop_name in schema.get("required", []),
                    "category": prop_value.get("x-category")
                }
                # Add additional information for array types
                if prop_value.get("type") == "array":
                    field_info["isArray"] = True
                    if "items" in prop_value and isinstance(prop_value["items"], dict):
                        field_info["itemType"] = prop_value["items"].get("type", "string")
                        if "enum" in prop_value["items"]:
                            field_info["enum"] = prop_value["items"]["enum"]
                fields.append(field_info)
            # Recursively process child fields SOLO para objetos normales
            if prop_value.get("type") != "array" and "properties" in prop_value:
                fields.extend(create_fields_list(prop_value, new_path, category_filter))
            # NO añadir subcampos 'item' para arrays (eliminado)

    
    return fields

def generate_default_yaml_from_schema(schema: Dict[str, Any]) -> str:
    """
    Generate default YAML content based on the schema.
    """
    def _generate_default_value(node: Dict[str, Any]) -> Any:
        # If the node has a default value, use it
        if "default" in node:
            return node["default"]
        
        # Handle different types
        node_type = node.get("type")
        
        if node_type == "object":
            result = {}
            # Process required properties
            for prop_name in node.get("required", []):
                if prop_name in node.get("properties", {}):
                    result[prop_name] = _generate_default_value(node["properties"][prop_name])
            # Process non-required properties with defaults
            for prop_name, prop_value in node.get("properties", {}).items():
                if prop_name not in result and "default" in prop_value:
                    result[prop_name] = _generate_default_value(prop_value)
            return result
        
        elif node_type == "array":
            # For arrays, return an empty array or default items if specified
            if "items" in node and "default" in node["items"]:
                return [node["items"]["default"]]
            return []
        
        elif node_type == "string":
            return ""  # Empty string as default
        
        elif node_type == "number" or node_type == "integer":
            return 0  # Zero as default
        
        elif node_type == "boolean":
            return False  # False as default
        
        # Default fallback
        return None
    
    # Generate the default content based on the schema
    default_content = _generate_default_value(schema)
    
    # Convert to YAML string
    return yaml_module.dump(default_content, sort_keys=False, default_flow_style=False)
