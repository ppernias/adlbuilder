import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { User, UserUpdate, PasswordChange } from '../types';
import { authAPI } from '../services/api';

interface ProfilePageProps {
  user: User | null;
  onUserUpdate: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate }) => {
  const [userData, setUserData] = useState<UserUpdate>({
    email: '',
    full_name: '',
    organization: '',
    position: '',
  });
  
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    current_password: '',
    new_password: ''
  });
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        email: user.email,
        full_name: user.full_name || '',
        organization: user.organization,
        position: user.position || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'new_password') setChangePasswordError(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    
    try {
      const updatedUser = await authAPI.updateCurrentUser(userData);
      onUserUpdate(updatedUser);
      setProfileSuccess('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setProfileError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChangePasswordError(null);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.new_password !== confirmNewPassword) {
      setChangePasswordError('Passwords do not match');
      return;
    }
    setIsLoadingPassword(true);
    try {
      await authAPI.changePassword(passwordData);
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: ''
      });
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPasswordError(err.response?.data?.detail || 'Failed to change password. Please try again.');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  if (!user) {
    return (
      <Container className="text-center py-5">
        <Alert variant="warning">Please log in to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">My Profile</h1>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              {profileError && (
                <Alert variant="danger" dismissible onClose={() => setProfileError(null)}>
                  {profileError}
                </Alert>
              )}
              
              {profileSuccess && (
                <Alert variant="success" dismissible onClose={() => setProfileSuccess(null)}>
                  {profileSuccess}
                </Alert>
              )}
              
              <Form onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={userData.full_name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formOrganization">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control
                    type="text"
                    name="organization"
                    value={userData.organization}
                    onChange={handleProfileChange}
                    placeholder="Enter your organization"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPosition">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={userData.position}
                    onChange={handleProfileChange}
                    placeholder="Your position in the organization"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    plaintext
                    readOnly
                    value={user.role}
                  />
                  <Form.Text className="text-muted">
                    Your role cannot be changed from this page.
                  </Form.Text>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isLoadingProfile}
                >
                  {isLoadingProfile ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Updating...</span>
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Change Password</h5>
            </Card.Header>
            <Card.Body>
              {passwordError && (
                <Alert variant="danger" dismissible onClose={() => setPasswordError(null)}>
                  {passwordError}
                </Alert>
              )}
              
              {passwordSuccess && (
                <Alert variant="success" dismissible onClose={() => setPasswordSuccess(null)}>
                  {passwordSuccess}
                </Alert>
              )}
              
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3" controlId="formCurrentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmNewPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    required
                  />
                </Form.Group>
                {changePasswordError && (
                  <Alert variant="danger">{changePasswordError}</Alert>
                )}

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isLoadingPassword}
                >
                  {isLoadingPassword ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Changing...</span>
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
