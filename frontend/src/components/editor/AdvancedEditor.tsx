import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { ValidationResult } from '../../types';
import { yamlAPI } from '../../services/api';

interface AdvancedEditorProps {
  yamlContent: string;
  isLoading: boolean;
  error: string | null;
  onSave: (content: string) => Promise<void>;
}

const AdvancedEditor: React.FC<AdvancedEditorProps> = ({ 
  yamlContent, 
  isLoading, 
  error, 
  onSave 
}) => {
  const [content, setContent] = useState(yamlContent);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setContent(yamlContent);
  }, [yamlContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Clear validation results when content changes
    setValidationResult(null);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await yamlAPI.validateYAML({ content });
      setValidationResult(result);
    } catch (err: any) {
      console.error('Validation error:', err);
      setValidationResult({
        valid: false,
        message: err.response?.data?.detail || 'Failed to validate YAML content.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(content);
  };

  return (
    <div className="editor-container">
      <h2 className="mb-4">Advanced Editor</h2>
      
      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}
      
      {validationResult && (
        <Alert 
          variant={validationResult.valid ? 'success' : 'danger'}
          dismissible
          onClose={() => setValidationResult(null)}
        >
          {validationResult.message}
          {validationResult.errors && validationResult.errors.length > 0 && (
            <ul className="mt-2 mb-0">
              {validationResult.errors.map((err, index) => (
                <li key={index}>
                  <strong>{err.path}:</strong> {err.message}
                </li>
              ))}
            </ul>
          )}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4" controlId="yamlContent">
          <Form.Control
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={20}
            className="font-monospace"
            style={{ resize: 'vertical' }}
          />
        </Form.Group>
        
        <div className="d-flex justify-content-between">
          <Button 
            variant="outline-primary" 
            type="button" 
            onClick={handleValidate}
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Validating...</span>
              </>
            ) : (
              'Validate YAML'
            )}
          </Button>
          
          <div className="d-flex gap-2">
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
        </div>
      </Form>
    </div>
  );
};

export default AdvancedEditor;
