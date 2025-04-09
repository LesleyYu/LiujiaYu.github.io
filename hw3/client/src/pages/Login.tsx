import { useState } from 'react';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email must be valid.";
    }
    if (!password) {
      newErrors.password = "Email is required.";
    }
    return newErrors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      navigate('/');
    } catch (err: any) {
      if (err.error) {
        const errorMsg = err.error;
        if (errorMsg === "Missing email or password") {
          const newErr: { [key: string]: string } = {};
          if (!email) newErr.email = "Email is required.";
          if (!password) newErr.password = "Email is required.";
          setErrors(newErr);
        } else if (errorMsg === "Invalid email or password") {
          setErrors({ password: "Password or email is incorrect." });
        } else {
          setErrors({ general: "Login failed" });
        }
      } else {
        setErrors({ general: "Login failed" });
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleLogin} noValidate>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            isInvalid={!!errors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            isInvalid={!!errors.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {errors.general && <div className="text-danger mt-3">{errors.general}</div>}
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
        <p className="mt-3">
          New user? <Link to="/user/register">Register here</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;