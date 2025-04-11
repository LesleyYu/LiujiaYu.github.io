import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { isAuthenticated } = useAuth();  // user,
  // console.log("In NavBar, user data:", user);  // normal

  return (
  <BootstrapNavbar bg="light" variant="light" expand="lg">
    <Container>
      <BootstrapNavbar.Brand as={NavLink} to="/">Artist Search</BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto justify-content-lg-end" variant="pills">
          <Nav.Link className='px-4' as={NavLink} to="/">Search</Nav.Link>
          {isAuthenticated ? (
            <>
              <Nav.Link className='px-4' as={NavLink} to="user/favorites">Favorites</Nav.Link>
              <ProfileDropdown />
            </>
          ) : (<>
            <Nav.Link className='px-4' as={NavLink} to="/user/login">Log in</Nav.Link>
            <Nav.Link className='px-4' as={NavLink} to="/user/Register">Register</Nav.Link>
          </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </Container>
  </BootstrapNavbar>

  );
};

export default Navbar;