import { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import EditorModeSelector from '../components/editor/EditorModeSelector';
import SimpleEditor from '../components/editor/SimpleEditor';
import AdvancedEditor from '../components/editor/AdvancedEditor';
import CreateAssistantModal from '../components/editor/CreateAssistantModal';
import { EditorMode, SchemaField } from '../types';
import { yamlAPI, schemaAPI } from '../services/api';

const EditorPage: React.FC = () => {
  const { filename } = useParams<{ filename: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<EditorMode>(
    (searchParams.get('mode') as EditorMode) || 'simple'
  );
  const [yamlContent, setYamlContent] = useState('');
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(!filename);

  useEffect(() => {
    const fetchData = async () => {
      console.log('EditorPage useEffect running with filename:', filename, 'mode:', mode);
      
      if (!filename) {
        // If no filename, we'll wait for the user to provide one via the modal
        console.log('No filename provided, setting isLoading to false');
        setIsLoading(false); // Ensure loading is false when no filename
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching custom schema fields...');
        // Fetch only custom schema fields using the backend filtering
        const fieldsResponse = await schemaAPI.getFieldsList('custom');
        console.log('Custom schema fields received:', fieldsResponse);
        // Asegurarse de que estamos pasando el array de campos, no el objeto completo
        if (fieldsResponse && fieldsResponse.fields && Array.isArray(fieldsResponse.fields)) {
          console.log('Setting schema fields array with length:', fieldsResponse.fields.length);
          setSchemaFields(fieldsResponse.fields);
        } else {
          console.error('Invalid schema fields format:', fieldsResponse);
          setError('Error loading schema fields. Invalid format received from server.');
        }
        
        console.log('Fetching YAML file for editing:', filename);
        // Fetch YAML file if editing existing file
        const fileData = await yamlAPI.getYAMLFileForEditing(filename, mode);
        console.log('YAML file data received:', fileData);
        // La respuesta contiene {file: {filename, content}, schema, mode}
        if (fileData && fileData.file && fileData.file.content) {
          console.log('Setting YAML content from file.content');
          setYamlContent(fileData.file.content);
        } else {
          console.error('Invalid file data structure:', fileData);
          setError('Invalid file data structure received from server');
        }
      } catch (err: any) {
        console.error('Error loading editor data:', err);
        setError(err.response?.data?.detail || 'Failed to load editor data. Please try again.');
      } finally {
        console.log('Setting isLoading to false');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [filename, mode]);
  
  const handleCreateAssistant = async (newFilename: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create new file with user-provided filename
      const newFileData = await yamlAPI.createNewYAMLFile(newFilename, mode);
      setYamlContent(newFileData.content);
      
      // Update URL with new filename
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('filename', newFilename);
      setSearchParams(newSearchParams);
      
      // Navigate to the editor with the new filename
      navigate(`/edit/${newFilename}?mode=${mode}`);
      
      // Hide the modal
      setShowCreateModal(false);
    } catch (err: any) {
      console.error('Error creating assistant:', err);
      setError(err.response?.data?.detail || 'Failed to create assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: EditorMode) => {
    // Update URL with new mode
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('mode', newMode);
    navigate({ search: newSearchParams.toString() });
    
    setMode(newMode);
  };

  const handleSave = async (content: string) => {
    setIsSaving(true);
    setError(null);
    try {
      const saveFilename = filename || 'new_assistant.yaml';
      await yamlAPI.saveYAMLFile(saveFilename, { content });
      
      // If creating a new file, redirect to the edit page for that file
      if (!filename) {
        navigate(`/edit/${saveFilename}?mode=${mode}`);
      }
    } catch (err: any) {
      console.error('Error saving file:', err);
      setError(err.response?.data?.detail || 'Failed to save file. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading editor...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">{filename ? `Edit ${filename}` : 'Create New Assistant'}</h1>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {filename ? (
        <>
          <EditorModeSelector 
            mode={mode} 
            onModeChange={handleModeChange} 
            disabled={isSaving}
          />
          
          {mode === 'simple' ? (
            <SimpleEditor 
              yamlContent={yamlContent}
              schemaFields={schemaFields}
              isLoading={isSaving}
              error={null}
              onSave={handleSave}
            />
          ) : (
            <AdvancedEditor 
              yamlContent={yamlContent}
              isLoading={isSaving}
              error={null}
              onSave={handleSave}
            />
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <p>Por favor, ingresa un nombre para tu nuevo asistente.</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Crear nuevo asistente
          </Button>
        </div>
      )}
      
      <CreateAssistantModal 
        show={showCreateModal} 
        onHide={() => {
          setShowCreateModal(false);
          if (!filename) {
            navigate('/dashboard');
          }
        }} 
        onConfirm={handleCreateAssistant} 
      />
    </Container>
  );
};

export default EditorPage;
