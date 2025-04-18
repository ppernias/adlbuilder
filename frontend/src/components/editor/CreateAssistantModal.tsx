import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface CreateAssistantModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (filename: string) => void;
}

const CreateAssistantModal: React.FC<CreateAssistantModalProps> = ({ show, onHide, onConfirm }) => {
  const [filename, setFilename] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate filename
    if (!filename) {
      setError('Por favor, ingresa un nombre para el asistente');
      return;
    }
    
    // Add .yaml extension if not present
    let finalFilename = filename;
    if (!finalFilename.endsWith('.yaml')) {
      finalFilename += '.yaml';
    }
    
    onConfirm(finalFilename);
    setFilename('');
    setError(null);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear nuevo asistente</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre del asistente</Form.Label>
            <Form.Control
              type="text"
              placeholder="mi_asistente"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              autoFocus
            />
            <Form.Text className="text-muted">
              La extensión .yaml se añadirá automáticamente si no la incluyes.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Crear
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateAssistantModal;
