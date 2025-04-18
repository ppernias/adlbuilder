import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import AssistantCard from '../components/dashboard/AssistantCard';
import CreateAssistantCard from '../components/dashboard/CreateAssistantCard';
import { yamlAPI } from '../services/api';

const DashboardPage: React.FC = () => {
  const [yamlFiles, setYamlFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYamlFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const files = await yamlAPI.getYAMLFiles();
      setYamlFiles(files);
    } catch (err: any) {
      console.error('Error fetching YAML files:', err);
      setError(err.response?.data?.detail || 'Failed to load your assistants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYamlFiles();
  }, []);

  const handleDeleteFile = async (filename: string) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await yamlAPI.deleteYAMLFile(filename);
        await fetchYamlFiles(); // Refresh the list
      } catch (err: any) {
        console.error('Error deleting file:', err);
        setError(err.response?.data?.detail || `Failed to delete ${filename}. Please try again.`);
      }
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your assistants...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">My Assistants</h1>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {/* Create New Assistant Card */}
        <Col>
          <CreateAssistantCard />
        </Col>
        
        {/* Existing Assistants */}
        {yamlFiles.map((filename) => (
          <Col key={filename}>
            <AssistantCard 
              filename={filename} 
              onDelete={handleDeleteFile} 
            />
          </Col>
        ))}
        
        {yamlFiles.length === 0 && (
          <Col>
            <Alert variant="info">
              You don't have any assistants yet. Create your first one!
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default DashboardPage;
