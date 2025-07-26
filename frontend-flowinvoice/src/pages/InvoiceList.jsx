import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Alert, Button, IconButton, Tooltip, Grid, Chip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Refresh as RefreshIcon, 
  Visibility as VisibilityIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import { getInvoices } from '../services/api';

/**
 * Componente para listar y filtrar facturas.
 * 
 * Funcionalidades principales:
 * - Búsqueda de facturas por número con debounce
 * - Filtrado por estado de factura y estado de pago
 * - Visualización tabular con detalles clave
 * - Acceso rápido a detalles de cada factura
 * - Resumen estadístico del listado
 * 
 * @component
 * @example
 * <Route path="/invoices" element={<InvoiceList />} />
 */
export default function InvoiceList() {
  // Estados principales
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Estados para filtros
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  
  // Debounce para búsqueda (500ms)
  const [debouncedInvoiceNumber] = useDebounce(invoiceNumber, 500);

  /**
   * Obtiene facturas desde la API aplicando filtros
   * Maneja estados de carga y errores
   */
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir parámetros de consulta
      const params = {
        ...(debouncedInvoiceNumber && { invoiceNumber: debouncedInvoiceNumber }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      };
      
      const response = await getInvoices(params);
      setInvoices(response.data);
    } catch (err) {
      setError('Error al cargar las facturas: ' + 
        (err.response?.data?.message || err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [debouncedInvoiceNumber, status, paymentStatus]);

  // Efecto para cargar datos al montar o cambiar filtros
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  /**
   * Navega a la página de detalles de una factura
   * @param {string} invoiceNumber - Número de factura
   */
  const handleRowClick = (invoiceNumber) => {
    navigate(`/invoices/${invoiceNumber}`);
  };

  /**
   * Restablece todos los filtros a sus valores iniciales
   */
  const handleResetFilters = () => {
    setInvoiceNumber('');
    setStatus('');
    setPaymentStatus('');
  };

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', p: 3 }}>
      {/* Contenedor principal */}
      <Paper elevation={1} sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        mb: 4
      }}>
        {/* Encabezado con gradiente */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: 'common.white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              <Box component="span" sx={{ 
                backgroundColor: '#ffffff', 
                color: '#1a237e', 
                borderRadius: '4px', 
                px: 1, 
                mr: 1,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                Flow
              </Box>
              Invoice
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              Listado completo de facturas
            </Typography>
          </Box>
          
          {/* Botón para restablecer filtros */}
          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleResetFilters}
            startIcon={<RefreshIcon />}
            sx={{ 
              mt: { xs: 2, md: 0 },
              backgroundColor: '#ffffff',
              color: '#1a237e',
              fontWeight: 600,
              fontSize: '1rem',
              py: 1.5,
              px: 3,
              '&:hover': {
                backgroundColor: '#e0e0e0'
              }
            }}
          >
            Restablecer Filtros
          </Button>
        </Box>

        {/* Sección de Filtros */}
        <Box sx={{ p: 3, backgroundColor: '#ffffff' }}>
          <Grid container spacing={3} alignItems="center">
            {/* Búsqueda por número de factura */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Buscar por número de factura"
                variant="outlined"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                  ),
                  sx: {
                    height: '56px',
                    fontSize: '1rem',
                    borderRadius: 2,
                    backgroundColor: '#f5f7fa',
                    pl: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#757575',
                    '&.Mui-focused': {
                      color: '#1a237e',
                      fontWeight: 500,
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Filtro por estado de factura */}
            <Grid item xs={12} sm={6} md={4.5} sx={{ minWidth: 300 }}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 300 }}>
                <InputLabel>Estado de Factura</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Estado de Factura"
                  sx={{
                    height: '56px',
                    fontSize: '1rem',
                    borderRadius: 2,
                    backgroundColor: '#f5f7fa',
                    '& .MuiSelect-select': {
                      padding: '16px 32px 16px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Todos los estados</em>
                  </MenuItem>
                  <MenuItem value="Issued">
                    <FilterIcon sx={{ color: 'primary.main', mr: 1 }} />
                    Emitida
                  </MenuItem>
                  <MenuItem value="Partial">
                    <FilterIcon sx={{ color: 'warning.main', mr: 1 }} />
                    Parcial
                  </MenuItem>
                  <MenuItem value="Cancelled">
                    <FilterIcon sx={{ color: 'error.main', mr: 1 }} />
                    Cancelada
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Filtro por estado de pago */}
            <Grid item xs={12} sm={6} md={4.5} sx={{ minWidth: 300 }}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 300 }}>
                <InputLabel>Estado de Pago</InputLabel>
                <Select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  label="Estado de Pago"
                  sx={{
                    height: '56px',
                    fontSize: '1rem',
                    borderRadius: 2,
                    backgroundColor: '#f5f7fa',
                    '& .MuiSelect-select': {
                      padding: '16px 32px 16px 16px',
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Todos los estados</em>
                  </MenuItem>
                  <MenuItem value="Paid">
                    <FilterIcon sx={{ color: 'success.main', mr: 1 }} />
                    Pagado
                  </MenuItem>
                  <MenuItem value="Pending">
                    <FilterIcon sx={{ color: 'warning.main', mr: 1 }} />
                    Pendiente
                  </MenuItem>
                  <MenuItem value="Overdue">
                    <FilterIcon sx={{ color: 'error.main', mr: 1 }} />
                    Vencido
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Sección de Resultados */}
        <Box sx={{ p: 3, backgroundColor: '#f9fafe' }}>
          {/* Estado de carga */}
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 300 
            }}>
              <CircularProgress size={50} />
              <Typography variant="body1" sx={{ ml: 2 }}>Cargando facturas...</Typography>
            </Box>
          )}
          
          {/* Estado de error */}
          {!loading && error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                mb: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="body1">
                {error}
              </Typography>
            </Alert>
          )}
          
          {/* Sin resultados */}
          {!loading && !error && invoices.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              p: 4, 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#e8eaf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <SearchIcon sx={{ fontSize: 50, color: '#5c6bc0' }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                No se encontraron facturas
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Intente ajustar sus filtros de búsqueda
              </Typography>
              <Button 
                variant="contained"
                onClick={handleResetFilters}
                startIcon={<RefreshIcon />}
                sx={{ fontWeight: 600 }}
              >
                Restablecer filtros
              </Button>
            </Box>
          )}
          
          {/* Listado de facturas */}
          {!loading && !error && invoices.length > 0 && (
            <>
              <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e8eaf6' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>NÚMERO</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>CLIENTE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>MONTO</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>ESTADO FACTURA</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>ESTADO PAGO</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>ACCIÓN</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow 
                        key={invoice.invoiceNumber} 
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f5f7fa',
                            cursor: 'pointer' 
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: '#f9f9ff'
                          }
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={600} color="primary">
                            {invoice.invoiceNumber}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(invoice.invoiceDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>
                            {invoice.customerName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {invoice.customerRun || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>
                            ${invoice.totalAmount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status === 'Issued' ? 'Emitida' : 
                                   invoice.status === 'Partial' ? 'Parcial' : 'Cancelada'}
                            sx={getStatusStyle(invoice.status)}
                            size="medium"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.paymentStatus === 'Paid' ? 'Pagado' : 
                                   invoice.paymentStatus === 'Pending' ? 'Pendiente' : 'Vencido'}
                            sx={getStatusStyle(invoice.paymentStatus)}
                            size="medium"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Ver detalles">
                            <IconButton 
                              onClick={() => handleRowClick(invoice.invoiceNumber)}
                              sx={{ 
                                color: 'primary.main',
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                }
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Resumen estadístico */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mt: 2,
                p: 2,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" color="textSecondary">
                  Mostrando {invoices.length} facturas
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total: ${invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

// ========================================================
//  Funciones Auxiliares
// ========================================================

/**
 * Asigna estilos visuales a los chips según el estado
 * @param {string} status - Estado de la factura o pago
 * @returns {object} Objeto de estilos para el componente Chip
 */
function getStatusStyle(status) {
  switch(status) {
    case 'Issued': 
      return { 
        bgcolor: '#e3f2fd', 
        color: '#1976d2', 
        border: '1px solid #bbdefb',
        fontWeight: 600
      };
    case 'Partial': 
      return { 
        bgcolor: '#fff8e1', 
        color: '#ff8f00', 
        border: '1px solid #ffecb3',
        fontWeight: 600
      };
    case 'Cancelled': 
      return { 
        bgcolor: '#ffebee', 
        color: '#d32f2f', 
        border: '1px solid #ffcdd2',
        fontWeight: 600
      };
    case 'Paid': 
      return { 
        bgcolor: '#e8f5e9', 
        color: '#2e7d32', 
        border: '1px solid #c8e6c9',
        fontWeight: 600
      };
    case 'Pending': 
      return { 
        bgcolor: '#fff3e0', 
        color: '#ef6c00', 
        border: '1px solid #ffe0b2',
        fontWeight: 600
      };
    case 'Overdue': 
      return { 
        bgcolor: '#fbe9e7', 
        color: '#d84315', 
        border: '1px solid #ffccbc',
        fontWeight: 600
      };
    default: 
      return { 
        bgcolor: '#f5f5f5', 
        color: '#616161', 
        border: '1px solid #e0e0e0',
        fontWeight: 600
      };
  }
}

/**
 * Formatea fechas de forma segura
 * @param {string} dateString - Fecha en formato string
 * @returns {string} Fecha formateada o mensaje de error
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return isNaN(date) ? "Fecha inválida" : date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return "Fecha inválida";
  }
}