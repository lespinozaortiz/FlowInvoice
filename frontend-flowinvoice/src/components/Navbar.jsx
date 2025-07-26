// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  useMediaQuery, 
  useTheme,
  Menu,
  MenuItem,
  Box
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';

/**
 * Barra de navegación superior de la aplicación
 * 
 * Responsivo
 * 
 * Contiene:
 * - Logo de la aplicación
 * - Menú de navegación
 * - Icono de usuario con menú desplegable
 */
const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const userMenuOpen = Boolean(anchorEl);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // Elementos de navegación
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Facturas', path: '/invoices' },
    { label: 'Importar', path: '/import' },
    { label: 'Reportes', path: '/reports' }
  ];

  return (
    <AppBar position="sticky" sx={{ 
      backgroundColor: '#1a237e', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)'
    }}>
      <Toolbar>
        {/* Logo */}
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700, 
            letterSpacing: 1.2, 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box component="span" sx={{ 
            backgroundColor: '#ffffff', 
            color: '#1a237e', 
            borderRadius: '4px', 
            px: 1, 
            mr: 1,
            fontWeight: 800 
          }}>
            Flow
          </Box>
          Invoice
        </Typography>

        {/* Menú de navegación - Versión escritorio */}
        {!isMobile && (
          <Box sx={{ display: 'flex' }}>
            {navItems.map((item) => (
              <Button 
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{ 
                  mx: 1, 
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Menú de usuario */}
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleUserMenuOpen}
          color="inherit"
          sx={{ ml: 2 }}
        >
          <AccountCircle />
        </IconButton>

        {/* Menú hamburguesa para móviles */}
        {isMobile && (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="mobile-menu"
              anchorEl={mobileMenuAnchor}
              open={mobileMenuOpen}
              onClose={handleMobileMenuClose}
              MenuListProps={{
                'aria-labelledby': 'mobile-menu',
              }}
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.path} 
                  component={Link}
                  to={item.path}
                  onClick={handleMobileMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        {/* Menú de usuario desplegable */}
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={userMenuOpen}
          onClose={handleUserMenuClose}
          MenuListProps={{
            'aria-labelledby': 'user-menu',
          }}
        >
          <MenuItem onClick={handleUserMenuClose}>Mi Perfil</MenuItem>
          <MenuItem onClick={handleUserMenuClose}>Configuración</MenuItem>
          <MenuItem onClick={handleUserMenuClose}>Cerrar Sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;