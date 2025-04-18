import { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { UserRegister } from '../../types';

interface RegisterFormProps {
  onRegister: (userData: UserRegister) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, isLoading, error }) => {
  const [userData, setUserData] = useState<UserRegister>({
    email: '',
    password: '',
    organization: '',
    position: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    if (userData.password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    await onRegister(userData);
  };

  return (
    <div className="form-section p-4 rounded shadow-sm">
      <h2 className="form-section-title mb-4">Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <Form.Text className="text-muted">
            Password must be at least 8 characters long.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />
        </Form.Group>
        {passwordError && (
          <Alert variant="danger">{passwordError}</Alert>
        )}

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formOrganization">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={userData.organization}
                onChange={handleChange}
                placeholder="Enter your organization"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPosition">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={userData.position}
                onChange={handleChange}
                placeholder="Your position in the organization"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button 
          variant="primary" 
          type="submit" 
          disabled={isLoading}
          className="w-100"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
    </div>
  );
};

export default RegisterForm;
