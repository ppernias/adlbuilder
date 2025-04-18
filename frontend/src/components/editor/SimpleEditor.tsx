import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { SchemaField } from '../../types';
import * as yaml from 'js-yaml';
import './SimpleEditor.css';

interface SimpleEditorProps {
  yamlContent: string;
  schemaFields: SchemaField[];
  isLoading: boolean;
  error: string | null;
  onSave: (content: string) => Promise<void>;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({ 
  yamlContent, 
  schemaFields, 
  isLoading, 
  error, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [parsedYaml, setParsedYaml] = useState<any>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Parse YAML content when it changes
  useEffect(() => {
    console.log('SimpleEditor: yamlContent changed', yamlContent ? 'content exists' : 'no content');
    console.log('SimpleEditor: schemaFields', schemaFields ? schemaFields.length : 'undefined');
    
    if (yamlContent && schemaFields && Array.isArray(schemaFields)) {
      try {
        console.log('SimpleEditor: Attempting to parse YAML content');
        // Parse YAML content using js-yaml library
        const parsed = yaml.load(yamlContent);
        console.log('SimpleEditor: YAML parsed successfully', parsed);
        setParsedYaml(parsed);
        setLocalError(null);
        
        // Extract editable fields (only custom fields in simple mode)
        const initialFormData: Record<string, any> = {};
        const customFields = schemaFields.filter(field => field.category === 'custom');
        console.log('SimpleEditor: Custom fields count', customFields.length);
        
        customFields.forEach(field => {
          console.log('SimpleEditor: Processing field', field.path);
          const path = field.path.split('.');
          let value: any = parsed;
          for (const key of path) {
            console.log('SimpleEditor: Accessing key', key, 'in object', typeof value);
            if (value && typeof value === 'object') {
              value = key in value ? value[key] : undefined;
            } else {
              value = undefined;
              break;
            }
          }
          console.log('SimpleEditor: Field value', field.path, value);
          initialFormData[field.path] = value !== undefined ? value : field.default;
        });
        
        console.log('SimpleEditor: Setting form data', initialFormData);
        setFormData(initialFormData);
      } catch (err) {
        console.error('SimpleEditor: Error parsing YAML:', err);
        setLocalError(`Error parsing YAML: ${err}`);
      }
    } else {
      console.log('SimpleEditor: Missing required data', { 
        hasYamlContent: !!yamlContent, 
        hasSchemaFields: !!schemaFields,
        isSchemaFieldsArray: schemaFields ? Array.isArray(schemaFields) : false
      });
    }
  }, [yamlContent, schemaFields]);

  const handleChange = (path: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [path]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!parsedYaml) return;
    
    try {
      // Update the parsed YAML with form data values
      const updatedYaml = { ...parsedYaml };
      
      Object.entries(formData).forEach(([path, value]) => {
        const keys = path.split('.');
        let current = updatedYaml;
        
        // Navigate to the nested property
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!current[key]) current[key] = {};
          current = current[key];
        }
        
        // Set the value
        current[keys[keys.length - 1]] = value;
      });
      
      // Convert back to YAML string using js-yaml
      const updatedYamlString = yaml.dump(updatedYaml);
      await onSave(updatedYamlString);
    } catch (err) {
      console.error('Error saving YAML:', err);
      setLocalError(`Error saving YAML: ${err}`);
    }
  };

  // Helper function to handle array item changes
  const handleArrayItemChange = (path: string, index: number, value: any) => {
    const currentArray = [...(formData[path] || [])];
    currentArray[index] = value;
    handleChange(path, currentArray);
  };

  // Helper function to add a new item to an array
  const handleAddArrayItem = (path: string, itemType: string) => {
    const currentArray = [...(formData[path] || [])];
    const defaultValue = itemType === 'number' ? 0 : itemType === 'boolean' ? false : '';
    currentArray.push(defaultValue);
    handleChange(path, currentArray);
  };

  // Helper function to remove an item from an array
  const handleRemoveArrayItem = (path: string, index: number) => {
    const currentArray = [...(formData[path] || [])];
    currentArray.splice(index, 1);
    handleChange(path, currentArray);
  };

  // Helper function to render array form controls
  const renderArrayControl = (field: SchemaField) => {
    const arrayValue = formData[field.path] || [];
    const itemType = field.itemType || 'string';
    // Mejor label singular para el campo (sin 'item', ni número delante)
    const getEntryLabel = () => {
      const pathParts = field.path.split('.');
      const lastPart = pathParts[pathParts.length - 1];
      // Capitaliza y reemplaza guiones bajos por espacios
      return lastPart.replace(/_/g, ' ').replace(/s$/, '').replace(/\b\w/g, c => c.toUpperCase());
    };
    const entryLabel = getEntryLabel();
    return (
      <div className="array-control">
        {arrayValue.length > 0 && arrayValue.map((entry: any, index: number) => (
          <div key={index} className="d-flex mb-2 align-items-center">
            {field.enum ? (
              <Form.Select
                className="flex-grow-1"
                value={entry}
                onChange={(e) => handleArrayItemChange(field.path, index, e.target.value)}
                aria-label={`${entryLabel} ${index + 1}`}
              >
                {field.enum.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            ) : itemType === 'number' ? (
              <Form.Control
                className="flex-grow-1"
                type="number"
                value={entry}
                onChange={(e) => handleArrayItemChange(field.path, index, Number(e.target.value))}
                placeholder={entryLabel}
                aria-label={`${entryLabel} ${index + 1}`}
              />
            ) : (
              <Form.Control
                className="flex-grow-1"
                type="text"
                value={entry}
                onChange={(e) => handleArrayItemChange(field.path, index, e.target.value)}
                placeholder={entryLabel}
                aria-label={`${entryLabel} ${index + 1}`}
              />
            )}
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-2"
              onClick={() => handleRemoveArrayItem(field.path, index)}
              title={`Remove ${entryLabel}`}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        ))}
        <Button
          variant="outline-primary"
          size="sm"
          className="mt-2"
          onClick={() => handleAddArrayItem(field.path, itemType)}
        >
          <i className="bi bi-plus"></i> Add {entryLabel}
        </Button>
        {field.description && (
          <div className="text-muted mt-1" style={{ fontSize: '0.95em' }}>
            {field.description}
          </div>
        )}
      </div>
    );
  };

  // Helper function to render form controls based on schema field type
  const renderFormControl = (field: SchemaField) => {
    // No renderizar campos 'item' huérfanos de arrays
    if (field.path.endsWith('.item')) {
      return null;
    }
    const value = formData[field.path] ?? field.default;
    // Para campos array, solo renderizar el control de array
    if (field.type === 'array' || field.isArray) {
      return renderArrayControl(field);
    }
    // Para el resto, render normal
    switch (field.type) {
      case 'string':
        if (field.enum && field.enum.length > 0) {
          return (
            <Form.Select
              value={value || ''}
              onChange={(e) => handleChange(field.path, e.target.value)}
            >
              {field.enum.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          );
        }
        return (
          <Form.Control
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field.path, e.target.value)}
            placeholder={field.description || `Enter ${field.title || field.path}`}
          />
        );
      
      case 'number':
        return (
          <Form.Control
            type="number"
            value={value || 0}
            onChange={(e) => handleChange(field.path, Number(e.target.value))}
            placeholder={field.description || `Enter ${field.title || field.path}`}
          />
        );
      
      case 'boolean':
        return (
          <Form.Check
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleChange(field.path, e.target.checked)}
            label={field.description || field.title || field.path}
          />
        );
      
      default:
        return (
          <Form.Control
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field.path, e.target.value)}
            placeholder={field.description || `Enter ${field.title || field.path}`}
          />
        );
    }
  };

  if (!parsedYaml) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading editor...</p>
      </div>
    );
  }

  // Ya no necesitamos filtrar los campos personalizados aquí, ya vienen filtrados del backend
  const customFields = schemaFields;

  // Agrupar campos por categoría basada en la ruta
  const groupFieldsByCategory = (fields: SchemaField[]) => {
    const groups: Record<string, SchemaField[]> = {
      'author': [],
      'description': [],
      'tools': [],
      'other': []
    };
    
    fields.forEach(field => {
      const path = field.path.toLowerCase();
      if (path.includes('author')) {
        groups['author'].push(field);
      } else if (path.includes('description')) {
        groups['description'].push(field);
      } else if (path.includes('command') || path.includes('option') || path.includes('decorator')) {
        groups['tools'].push(field);
      } else {
        groups['other'].push(field);
      }
    });
    
    return groups;
  };

  const fieldGroups = groupFieldsByCategory(customFields);

  // Render form
  return (
    <div className="editor-container">
      <h2 className="mb-4">Simple Editor</h2>
      
      {(error || localError) && (
        <Alert variant="danger" dismissible onClose={() => setLocalError(null)}>
          {error || localError}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Basic Information</h5>
          </Card.Header>
          <Card.Body>
              {customFields.length > 0 ? (
                <>
                  {/* Author Section */}
                  {fieldGroups['author'].length > 0 && (
                    <div className="mb-4">
                      <div className="section-header">Author Information</div>
                      <Row>
                        {fieldGroups['author']
  .filter(f => !f.path.endsWith('.item'))
  .map((field) => (
                          <Col md={6} key={field.path} className="mb-3">
                            <Form.Group controlId={`form-${field.path}`}>
                              <Form.Label>
                                {field.title || field.path.split('.').pop()}
                                {field.required && <span className="text-danger">*</span>}
                              </Form.Label>
                              {renderFormControl(field)}
                            </Form.Group>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  {/* Description Section */}
                  {fieldGroups['description'].length > 0 && (
                    <div className="mb-4">
                      <div className="section-header">Description</div>
                      <Row>
                        {fieldGroups['description']
  .filter(f => !f.path.endsWith('.item'))
  .map((field) => (
                          <Col md={field.type === 'array' || field.isArray ? 12 : 6} key={field.path} className="mb-3">
                            <Form.Group controlId={`form-${field.path}`}>
                              <Form.Label>
                                {field.title || field.path.split('.').pop()}
                                {field.required && <span className="text-danger">*</span>}
                              </Form.Label>
                              {renderFormControl(field)}
                            </Form.Group>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  {/* Tools Section */}
                  {fieldGroups['tools'].length > 0 && (
                    <div className="mb-4">
                      <div className="section-header">Tools</div>
                      <Row>
                        {fieldGroups['tools']
  .filter(f => !f.path.endsWith('.item'))
  .map((field) => (
                          <Col md={field.type === 'array' || field.isArray ? 12 : 6} key={field.path} className="mb-3">
                            <Form.Group controlId={`form-${field.path}`}>
                              <Form.Label>
                                {field.title || field.path.split('.').pop()}
                                {field.required && <span className="text-danger">*</span>}
                              </Form.Label>
                              {renderFormControl(field)}
                            </Form.Group>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  {/* Other Section */}
                  {fieldGroups['other'].length > 0 && (
                    <div>
                      <div className="section-header">Other Information</div>
                      <Row>
                        {fieldGroups['other']
  .filter(f => !f.path.endsWith('.item'))
  .map((field) => (
                          <Col md={field.type === 'array' || field.isArray ? 12 : 6} key={field.path} className="mb-3">
                            <Form.Group controlId={`form-${field.path}`}>
                              <Form.Label>
                                {field.title || field.path.split('.').pop()}
                                {field.required && <span className="text-danger">*</span>}
                              </Form.Label>
                              {renderFormControl(field)}
                            </Form.Group>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </>
              ) : (
                <Alert variant="info">
                  <p>No custom fields found in the schema. Switch to advanced mode for full editing.</p>
                  <p>Total custom fields available: {schemaFields ? schemaFields.length : 0}</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" type="button">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  export default SimpleEditor;
