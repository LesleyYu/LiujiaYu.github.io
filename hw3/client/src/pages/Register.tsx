import { useState } from 'react';
import { registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullname.trim()) {
      newErrors.fullname = "Fullname is required.";
      setIsDisabled(true);
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      setIsDisabled(true);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email must be valid.";
      setIsDisabled(true);
    }
    if (!password) {
      newErrors.password = "Email is required.";
      setIsDisabled(true);
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
      const userData = await registerUser(fullname, email, password);
      setUser(userData);
      navigate('/');
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
        } 
      } else {
        setErrors({ general: 'Registration failed' });
      }
    }
  };

  return (
    <div className='d-flex flex-column align-items-center justify-content-center'>
      <Container className="mt-5 login-container border rounded">
        <h2>Register</h2>
        <Form onSubmit={handleRegister} noValidate>
          <Form.Group controlId="formFullname">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={fullname}
              onChange={(e) => {
                setFullname(e.target.value);
                setIsDisabled(false);
              }}
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
              onChange={(e) => {
                setEmail(e.target.value);
                setIsDisabled(false);
              }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setIsDisabled(false);
              }}
              placeholder="Password"
              isInvalid={!!errors.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          
          {errors.general && <div className="text-danger mt-3">{errors.general}</div>}

          <Button variant="primary" type="submit" className="mt-3" disabled={isDisabled}>
            Register
          </Button>
        </Form>
      </Container>
      <p className="mt-3">
        Already have an account? <Link to="/user/login" className='links'>Login</Link>
      </p>
    </div>
  );
};

export default Register;