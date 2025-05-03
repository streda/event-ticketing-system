import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import type { RootState, AppDispatch } from '../../app/store'; 

function NavBar() {
    // ---> Get state and dispatch <---
    const { token } = useSelector((state: RootState) => state.auth); 
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        // Navigate to home page after logout
        navigate('/'); 
    };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          EventLite
        </Typography>
        <Box>
          {/* Always show Home */}
          <Button color="inherit" component={RouterLink} to="/">Home</Button> 
           {/* Conditionally shows Login, Register OR Logout */}
           {
            token ? (
              <Button color='inherit' onClick={handleLogout}>Logout</Button>
            ):(
              <>
                <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                <Button color="inherit" component={RouterLink} to="/register">Register</Button>
              </>
            )
           }
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;