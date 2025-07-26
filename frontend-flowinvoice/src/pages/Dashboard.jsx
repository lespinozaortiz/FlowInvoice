// src/pages/Dashboard.jsx

import {
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  useTheme
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Receipt as InvoiceIcon,
  CloudUpload as ImportIcon,
  Assessment as ReportIcon,
  ArrowForward as ArrowIcon
} from "@mui/icons-material";

/**
 * Página principal del sistema (Dashboard)
 * 
 * Esta vista ofrece accesos rápidos a las funcionalidades clave del sistema:
 * - Visualización de facturas
 * - Importación de datos
 * - Generación de reportes
 */
const Dashboard = () => {
  const theme = useTheme();

  // Acciones rápidas disponibles en el panel principal
  const quickActions = [
    {
      title: 'Ver Facturas',
      icon: <InvoiceIcon fontSize="large" />,
      path: '/invoices',
      color: theme.palette.primary.main
    },
    {
      title: 'Importar Facturas',
      icon: <ImportIcon fontSize="large" />,
      path: '/import',
      color: theme.palette.secondary.main
    },
    {
      title: 'Generar Reportes',
      icon: <ReportIcon fontSize="large" />,
      path: '/reports',
      color: theme.palette.success.main
    },
  ];

  return (
    <Box>
      {/* Encabezado principal */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Panel de Control
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Bienvenido al sistema de gestión de facturas FlowInvoice
        </Typography>
      </Box>

      {/* Sección de acciones rápidas */}
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Acciones Disponibles
      </Typography>

      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Button
              component={Link}
              to={action.path}
              fullWidth
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: `${action.color}10`,
                color: 'text.primary',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: `${action.color}20`,
                  transform: 'translateY(-3px)'
                }
              }}
            >
              {/* Ícono con estilo personalizado */}
              <Avatar sx={{
                backgroundColor: `${action.color}20`,
                color: action.color,
                mb: 2,
                width: 60,
                height: 60
              }}>
                {action.icon}
              </Avatar>

              {/* Título de la acción */}
              <Typography variant="h6" fontWeight="bold">
                {action.title}
              </Typography>

              {/* Indicador de navegación */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Acceder
                </Typography>
                <ArrowIcon fontSize="small" />
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
