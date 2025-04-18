import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <section className="hero bg-primary-light py-5 mb-5 rounded">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold text-primary-dark">ADL Builder</h1>
              <p className="lead mb-4">
                Create and edit language assistant definitions with ease. Validate your YAML files against schemas and manage your assistants in one place.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/login" variant="primary" size="lg">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="outline-primary" size="lg">
                  Register
                </Button>
              </div>
            </Col>
            <Col md={6} className="d-flex justify-content-center">
              <div className="hero-image p-4 bg-white rounded shadow-lg">
                <pre className="mb-0 text-primary-dark">
                  <code>
                    {`# Assistant.yaml

metadata:
  author:
    name: "User"
    role: "Developer"
  description:
    title: "My Assistant"
    summary: "A helpful assistant"

assistant_instructions:
  role: "You are a helpful assistant"
  context:
    context_definition:
      - "Help users with tasks"
      - "Answer questions accurately"`}
                  </code>
                </pre>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features py-5">
        <Container>
          <h2 className="text-center mb-5 form-section-title">Key Features</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="text-center mb-3">
                    <i className="bi bi-shield-check" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
                  </div>
                  <Card.Title className="text-center">Schema Validation</Card.Title>
                  <Card.Text>
                    Validate your assistant definitions against a schema to ensure they meet all requirements.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="text-center mb-3">
                    <i className="bi bi-pencil-square" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
                  </div>
                  <Card.Title className="text-center">Simple & Advanced Editing</Card.Title>
                  <Card.Text>
                    Choose between simple mode for basic editing or advanced mode for full control over your YAML files.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="text-center mb-3">
                    <i className="bi bi-people" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
                  </div>
                  <Card.Title className="text-center">User Management</Card.Title>
                  <Card.Text>
                    Different roles for different needs: admin, editor, and viewer access levels to control permissions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta bg-primary text-white p-5 rounded mb-5">
        <Container className="text-center">
          <h2 className="mb-4">Ready to get started?</h2>
          <p className="lead mb-4">Join now and start creating your own assistant definitions.</p>
          <Button as={Link} to="/register" variant="light" size="lg">
            Create an Account
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
