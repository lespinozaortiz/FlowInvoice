import { useState } from 'react';
import { 
  Box, Typography, Paper, CircularProgress, Alert, 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Chip, IconButton, Divider
} from '@mui/material';
import { 
  getOverdueInvoicesReport, 
  getPaymentStatusSummaryReport, 
  getInconsistentInvoicesReport 
} from '../services/api';
import { 
  EventBusy as OverdueIcon, 
  Assessment as SummaryIcon, 
  Warning as InconsistentIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';

/**
 * Componente para generar y visualizar reportes de facturación.
 * 
 * Reportes disponibles:
 * 1. Facturas Vencidas: Muestra facturas con pagos pendientes y vencidos.
 * 2. Resumen de Estados de Pago: Estadísticas de los estados de pago de las facturas.
 * 3. Facturas Inconsistentes: Facturas con discrepancias en sus montos.
 * 
 * @component
 * @example
 * <Route path="/reports" element={<Reports />} />
 */
export default function Reports() {
  // Estados del componente
  const [reportType, setReportType] = useState(null); // Tipo de reporte seleccionado
  const [reportData, setReportData] = useState(null); // Datos del reporte
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Mensajes de error

  /**
   * Obtiene los datos del reporte desde la API
   * @param {string} type - Tipo de reporte a generar
   */
  const fetchReport = async (type) => {
    setReportType(type);
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      let response;
      switch (type) {
        case 'overdue':
          response = await getOverdueInvoicesReport();
          break;
        case 'paymentSummary':
          response = await getPaymentStatusSummaryReport();
          break;
        case 'inconsistent':
          response = await getInconsistentInvoicesReport();
          break;
        default:
          throw new Error('Tipo de reporte desconocido');
      }
      setReportData(response.data);
    } catch (err) {
      setError('Error al cargar el reporte: ' + 
        (err.response?.data?.message || err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renderiza la tabla del reporte según el tipo seleccionado
   * @returns {JSX.Element} Componente de tabla para el reporte
   */
  const renderReportTable = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'overdue':
        return (
          <Paper elevation={3} sx={{ 
            mt: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            {/* Encabezado para reporte de facturas vencidas */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'primary.main', 
              color: 'common.white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <OverdueIcon sx={{ mr: 2 }} />
              <Typography variant="h6">Facturas Vencidas sin Notas de Crédito</Typography>
            </Box>
            
            {/* Contenido de la tabla */}
            {reportData.length === 0 ? (
              <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
                No hay facturas vencidas sin notas de crédito.
              </Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Número</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Monto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Fecha Vencimiento</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Días Vencidos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{row.invoiceNumber}</TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell align="right">${row.totalAmount.toFixed(2)}</TableCell>
                        <TableCell align="right">{formatDate(row.dueDate)}</TableCell>
                        <TableCell align="right">{row.daysOverdue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        );
      case 'paymentSummary':
        return (
          <Paper elevation={3} sx={{ 
            mt: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            {/* Encabezado para reporte de resumen de pagos */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'primary.main', 
              color: 'common.white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <SummaryIcon sx={{ mr: 2 }} />
              <Typography variant="h6">Resumen de Estados de Pago</Typography>
            </Box>
            
            {/* Resumen estadístico */}
            {reportData.totalInvoices === 0 ? (
              <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
                No hay datos de facturas para el resumen.
              </Alert>
            ) : (
              <>
                <Box sx={{ p: 2, backgroundColor: '#f5f7fa' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Total de Facturas: 
                    <Box component="span" fontWeight={700} color="primary.main">
                      {reportData.totalInvoices}
                    </Box>
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Estado de Pago</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Porcentaje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.summaries.map((row, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Chip 
                              label={translateStatus(row.status)} 
                              size="small"
                              sx={statusStyles[row.status]}
                            />
                          </TableCell>
                          <TableCell align="right">{row.totalCount}</TableCell>
                          <TableCell align="right">{row.percentage.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        );
      case 'inconsistent':
        return (
          <Paper elevation={3} sx={{ 
            mt: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            {/* Encabezado para reporte de facturas inconsistentes */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'primary.main', 
              color: 'common.white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <InconsistentIcon sx={{ mr: 2 }} />
              <Typography variant="h6">Facturas Inconsistentes</Typography>
            </Box>
            
            {/* Contenido de la tabla */}
            {reportData.length === 0 ? (
              <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
                No hay facturas inconsistentes.
              </Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Número</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Monto Declarado</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Suma Subtotales</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Detalles de Discrepancia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{row.invoiceNumber}</TableCell>
                        <TableCell align="right">${row.declaredTotalAmount.toFixed(2)}</TableCell>
                        <TableCell align="right">${row.calculatedSubtotalSum.toFixed(2)}</TableCell>
                        <TableCell>{row.discrepancyDetails}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Encabezado principal */}
      <Paper elevation={3} sx={{ 
        mb: 4, 
        p: 3,
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'common.white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Generación de Reportes
        </Typography>
        <Typography variant="subtitle1" color="rgba(255,255,255,0.8)">
          Seleccione el tipo de reporte que desea generar
        </Typography>
      </Paper>
      
      {/* Selector de reportes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Reporte de Facturas Vencidas */}
        <Grid item xs={12} md={4}>
          <Button 
            fullWidth
            onClick={() => fetchReport('overdue')}
            startIcon={<OverdueIcon />}
            variant="contained"
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: '#ff525215',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: '100%',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #ff525240',
              '&:hover': {
                backgroundColor: '#ff525230',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <OverdueIcon sx={{ fontSize: 40, color: '#ff5252', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Facturas Vencidas
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Reporte de facturas con pagos pendientes
              </Typography>
            </Box>
          </Button>
        </Grid>
        
        {/* Reporte de Resumen de Pagos */}
        <Grid item xs={12} md={4}>
          <Button 
            fullWidth
            onClick={() => fetchReport('paymentSummary')}
            startIcon={<SummaryIcon />}
            variant="contained"
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: '#4caf5015',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: '100%',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #4caf5040',
              '&:hover': {
                backgroundColor: '#4caf5030',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <SummaryIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Resumen de Pagos
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Estadísticas de estados de pago
              </Typography>
            </Box>
          </Button>
        </Grid>
        
        {/* Reporte de Facturas Inconsistentes */}
        <Grid item xs={12} md={4}>
          <Button 
            fullWidth
            onClick={() => fetchReport('inconsistent')}
            startIcon={<InconsistentIcon />}
            variant="contained"
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: '#ff980015',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: '100%',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #ff980040',
              '&:hover': {
                backgroundColor: '#ff980030',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <InconsistentIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Facturas Inconsistentes
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Detección de inconsistencias en facturas
              </Typography>
            </Box>
          </Button>
        </Grid>
      </Grid>

      {/* Estado de carga */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          backgroundColor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          p: 4
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 3 }}>
            Generando reporte...
          </Typography>
        </Box>
      )}
      
      {/* Manejo de errores */}
      {!loading && error && (
        <Alert severity="error" sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          alignItems: 'center',
          mb: 4,
          p: 2
        }}>
          <Typography variant="body1" fontWeight={500}>
            {error}
          </Typography>
          <Button 
            onClick={() => setError(null)} 
            variant="outlined" 
            sx={{ ml: 2 }}
          >
            Reintentar
          </Button>
        </Alert>
      )}
      
      {/* Visualización del reporte */}
      {!loading && !error && reportType && reportData && (
        <Box>
          {/* Encabezado del reporte generado */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => setReportType(null)} sx={{ mr: 1 }}>
              <BackIcon />
            </IconButton>
            <Typography variant="h5">
              Reporte: {reportType === 'overdue' ? 'Facturas Vencidas' : 
                      reportType === 'paymentSummary' ? 'Resumen de Pagos' : 
                      'Facturas Inconsistentes'}
            </Typography>
          </Box>
          
          {/* Contenido del reporte */}
          {renderReportTable()}
        </Box>
      )}

      {/* Vista cuando no hay datos */}
      {!loading && !error && reportType && 
        (Array.isArray(reportData) && reportData.length === 0 || 
        (reportData && reportData.summaries && reportData.summaries.length === 0)) && (
          <Paper elevation={3} sx={{ 
            mt: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            p: 4,
            textAlign: 'center'
          }}>
            <InconsistentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No hay datos disponibles
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              No se encontraron registros para este reporte
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setReportType(null)}
              startIcon={<BackIcon />}
            >
              Volver a los reportes
            </Button>
          </Paper>
        )}
    </Box>
  );
}

// ========================================================
//  Funciones y constantes auxiliares
// ========================================================

/**
 * Estilos visuales para diferentes estados de factura
 */
const statusStyles = {
  Issued: { bgcolor: '#e3f2fd', color: '#1976d2' },
  Partial: { bgcolor: '#fff8e1', color: '#ff8f00' },
  Cancelled: { bgcolor: '#ffebee', color: '#d32f2f' },
  Paid: { bgcolor: '#e8f5e9', color: '#2e7d32' },
  Pending: { bgcolor: '#fff3e0', color: '#ef6c00' },
  Overdue: { bgcolor: '#fbe9e7', color: '#d84315' }
};

/**
 * Traduce estados de inglés a español
 * @param {string} status - Estado a traducir
 * @returns {string} Estado traducido
 */
function translateStatus(status) {
  const translations = {
    'Issued': 'Emitida',
    'Partial': 'Parcial',
    'Cancelled': 'Cancelada',
    'Paid': 'Pagada',
    'Pending': 'Pendiente',
    'Overdue': 'Vencida'
  };
  return translations[status] || status;
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
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return "Fecha inválida";
  }
}