from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
import copy

from app.utils import process_schema_node, create_fields_list
from app.utils.yaml_validator import schema

router = APIRouter(prefix="", tags=["schema"])

@router.get("/schema")
async def get_schema(category: Optional[str] = Query(None, description="Filter fields by x-category (e.g., 'custom' or 'system')")):
    """
    Get the schema structure in a format compatible with JSON Schema Form libraries.
    Optionally filter fields by x-category.
    """
    try:
        # Create a deep copy to avoid modifying the original schema
        schema_copy = copy.deepcopy(schema)
        
        # Process the schema to make it compatible with form libraries and apply filtering
        processed_schema = process_schema_node(schema_copy, "", category)
        
        # If filtering is applied, remove nodes that don't match the filter
        if category:
            def filter_nodes(node):
                if isinstance(node, dict):
                    # For objects with properties, filter the properties
                    if "properties" in node:
                        node["properties"] = {
                            k: v for k, v in node["properties"].items() 
                            if v.get("matchesFilter", True)
                        }
                        # Recursively filter remaining properties
                        for prop in node["properties"].values():
                            filter_nodes(prop)
                    
                    # For arrays, filter the items
                    if "items" in node and isinstance(node["items"], dict):
                        if not node["items"].get("matchesFilter", True):
                            # If items don't match, remove them
                            del node["items"]
                        else:
                            # Otherwise, recursively filter items
                            filter_nodes(node["items"])
            
            # Apply the filtering
            filter_nodes(processed_schema)
        
        # Remove the matchesFilter property as it's only used for filtering
        def clean_nodes(node):
            if isinstance(node, dict):
                if "matchesFilter" in node:
                    del node["matchesFilter"]
                
                # Recursively clean properties
                if "properties" in node:
                    for prop in node["properties"].values():
                        clean_nodes(prop)
                
                # Recursively clean items
                if "items" in node and isinstance(node["items"], dict):
                    clean_nodes(node["items"])
        
        # Apply the cleaning
        clean_nodes(processed_schema)
        
        return {
            "schema": processed_schema,
            "schemaVersion": "1.0",
            "category_filter": category
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schema/fields-list")
async def get_schema_fields_list(category: Optional[str] = Query(None, description="Filter fields by x-category (e.g., 'custom' or 'system')")):
    """
    Get a flat list of all fields in the schema.
    Optionally filter fields by x-category.
    """
    try:
        fields = create_fields_list(schema, "", category)
        return {
            "fields": fields,
            "total": len(fields),
            "category_filter": category
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
