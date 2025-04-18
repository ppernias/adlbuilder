import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CreateAssistantCard: React.FC = () => {
  return (
    <Card className="assistant-card h-100 shadow-sm border-primary border-2">
      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
        <div className="mb-3">
          <i className="bi bi-plus-circle" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
        </div>
        <Card.Title>Create New Assistant</Card.Title>
        <Card.Text className="text-muted mb-4">
          Start building a new YAML assistant from scratch
        </Card.Text>
        <div className="mt-auto d-flex flex-column gap-2 w-100">
          <Button 
            as={Link} 
            to="/create?mode=simple" 
            variant="primary" 
            className="w-100"
          >
            Simple Mode
          </Button>
          <Button 
            as={Link} 
            to="/create?mode=advanced" 
            variant="outline-primary" 
            className="w-100"
          >
            Advanced Mode
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CreateAssistantCard;
