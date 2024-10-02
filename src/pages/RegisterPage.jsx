import React, { useState } from 'react';
import styles from '../styles/RegisterPage.module.css';
import { Button, Form, Alert, Container, Card } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { register } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!email || !password || !confirmPassword) {
      setMessage('Todos los campos son obligatorios');
      return;
    }
  
    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
  
    try {
      const success = await register(email, password);
      if (success) {
        setMessage('Registro exitoso');
        setTimeout(() => navigate('/profile'), 1000); // Redirigir al perfil
      } else {
        setMessage('Error en el registro. El usuario ya existe o hubo un problema.');
      }
    } catch (error) {
      if (error.message === 'User already exists') {
        setMessage('Este email ya está registrado. Por favor, inicia sesión.');
      } else {
        setMessage('Error en el registro');
      }
    }
  };
  

  return (
    <Container className={styles['container']}>
      <h1 className={styles['text-center']} style={{ marginBottom: '20px' }}>Registro</h1>
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleRegister}>
        <Card body className={`${styles['card']} mt-5`}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Introduce tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introduce tu password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirmar Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirma tu password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group>
            <Button type="submit">Registrarse</Button>
          </Form.Group>
        </Card>
      </Form>
    </Container>
  );
};

export default RegisterPage;

