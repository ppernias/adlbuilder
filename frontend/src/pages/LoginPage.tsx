import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { UserLogin } from '../types';
import { authAPI } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials: UserLogin) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.access_token);
      onLoginSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Row className="g-0">
                <Col md={12}>
                  <LoginForm 
                    onLogin={handleLogin} 
                    isLoading={isLoading} 
                    error={error} 
                  />
                  <div className="text-center p-4 bg-light">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary">
                        Register now
                      </Link>
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
