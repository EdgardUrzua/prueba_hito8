import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { Card, Form, Button, Alert } from "react-bootstrap";
import styles from "../styles/LoginPage.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      setMessage("Inicio de sesión exitoso");
      setTimeout(() => {
        navigate('/profile'); 
      }, 1000); 
    } else {
      setMessage("Error en el inicio de sesión. Verifique sus credenciales.");
    }
  };

  return (
    <div className={styles['login-container']}>
      <h1 className={styles['login-title']}>Iniciar Sesión</h1>
      {message && <Alert variant="info">{message}</Alert>}
      <form onSubmit={handleLogin} className={styles['login-form']}>
        <Card body className={styles['login-card']}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles['login-input']}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles['login-input']}
            />
          </Form.Group>
          <Button type="submit" className={styles['login-button']}>Iniciar Sesión</Button>
        </Card>
      </form>
    </div>
  );
};

export default LoginPage;

