import { useNavigate } from 'react-router-dom';
import { Dropdown, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { deleteUserAccount } from '../utils/api';

const ProfileDropdown = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // Handler for logging out
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to Search page (or home) when logged out
        addNotification({ message: 'Logged out', variant: 'success' });
        navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  // Handler for deleting account
  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      setUser(null); // Clear auth state
        addNotification({ message: 'Account deleted', variant: 'danger' });
        navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dropdown align="end" className='d-flex justify-content-center'> 
      <Dropdown.Toggle
        variant="light"
        id="dropdown-basic"
        className="d-flex align-items-center border-0 bg-transparent"
      >
        <Image
          src={user?.profileImageUrl}
          roundedCircle
          style={{ maxHeight: '30px', marginRight: '8px' }}
          alt="Profile"
        />
        <span>{user?.fullname}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item 
          onClick={handleDeleteAccount}
          style={{ color: 'red' }}
        >
          Delete account
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item 
          onClick={handleLogout}
          style={{ color: 'rgb(47, 118, 179)' }}
        >
          Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;