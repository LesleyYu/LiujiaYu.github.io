import { useState } from 'react';
import { registerUser } from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullname.trim()) {
      newErrors.fullname = "Fullname is required.";
    }
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await registerUser(fullname, email, password);
      navigate('/user/login');
    } catch (err: any) {
      if (err.error) {
        const errorMsg = err.error;
        if (errorMsg === "Fullname is required.") {
          setErrors({ fullname: errorMsg });
        } else if (errorMsg === "Email is required.") {
          setErrors({ email: errorMsg, password: errorMsg });
        } else if (errorMsg === "Password is required.") {
          setErrors({ password: errorMsg });
        } else if (errorMsg === "User with this email already exists.") {
          setErrors({ email: errorMsg });
        } else {
          setErrors({ general: 'Registration failed' });
        }
      } else {
        setErrors({ general: 'Registration failed' });
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      <Form onSubmit={handleRegister} noValidate>
        <Form.Group controlId="formFullname">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Enter full name"
            isInvalid={!!errors.fullname}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.fullname}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formEmail" className="mt-3">
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
          Register
        </Button>
        <p className="mt-3">
          Already have an account? <Link to="/user/login">Login here</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Register;