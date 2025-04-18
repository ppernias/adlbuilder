import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface AssistantCardProps {
  filename: string;
  onDelete: (filename: string) => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ filename, onDelete }) => {
  return (
    <Card className="assistant-card h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-primary-dark">{filename}</Card.Title>
        <Card.Text className="text-muted mb-4">
          YAML Assistant File
        </Card.Text>
        <div className="mt-auto d-flex gap-2">
          <Button 
            as={Link} 
            to={`/edit/${filename}?mode=simple`} 
            variant="outline-primary" 
            className="flex-grow-1"
          >
            Edit
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={() => onDelete(filename)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AssistantCard;
