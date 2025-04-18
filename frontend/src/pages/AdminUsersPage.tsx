import { useEffect, useState } from 'react';
import { Table, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { User } from '../types';
import { adminAPI } from '../services/api';

const ROLES = ['admin', 'editor'];

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await adminAPI.deleteUser(userId);
      setActionSuccess('User deleted successfully.');
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      setActionError('Failed to delete user.');
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'editor') => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setActionSuccess('Role updated successfully.');
    } catch (err: any) {
      setActionError('Failed to update role.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">User Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {actionError && <Alert variant="danger">{actionError}</Alert>}
      {actionSuccess && <Alert variant="success">{actionSuccess}</Alert>}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Organization</th>
              <th>Position</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <Form.Select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value as 'admin' | 'editor')}
                    disabled={user.role === 'admin'}
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </Form.Select>
                </td>
                <td>{user.organization}</td>
                <td>{user.position}</td>
                <td>{user.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={user.role === 'admin'}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminUsersPage;
