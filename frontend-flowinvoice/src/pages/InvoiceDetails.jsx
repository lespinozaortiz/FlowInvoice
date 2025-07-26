import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Modal, Grid, Chip, IconButton, Divider, Stack
} from '@mui/material';
import { 
  ArrowBack as BackIcon, 
  Receipt as InvoiceIcon, 
  Person as CustomerIcon, 
  CreditCard as PaymentIcon, 
  LocalOffer as ProductIcon, 
  NoteAdd as CreditNoteIcon,
  Paid as PaidIcon,
  Event as DateIcon
} from '@mui/icons-material';
import { getInvoiceDetails } from '../services/api';
import AddCreditNoteForm from '../components/AddCreditNoteForm';

/**
 * Componente para visualizar detalles completos de una factura
 * 
 * Funcionalidades principales:
 * - Muestra información detallada de una factura específica
 * - Presenta datos del cliente, productos y pagos asociados
 * - Gestiona notas de crédito asociadas a la factura
 * - Permite agregar nuevas notas de crédito mediante modal
 * - Calcula y muestra saldos pendientes
 * 
 * @component
 * @example
 * <Route path="/invoices/:invoiceNumber" element={<InvoiceDetails />} />
 */
export default function InvoiceDetails() {
  // Obtiene parámetro de la URL
  const { invoiceNumber } = useParams();
  
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Estados del componente
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreditNoteModal, setOpenCreditNoteModal] = useState(false);

  /**
   * Obtiene los detalles de la factura desde la API
   * Maneja estados de carga y errores
   */
  const fetchInvoiceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvoiceDetails(invoiceNumber);
      setInvoice(response.data);
    } catch (err) {
      setError('Error al cargar los detalles de la factura: ' + 
        (err.response?.data?.message || err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos al montar el componente o cambiar invoiceNumber
  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceNumber]);

  // Controla apertura/cierre del modal de notas de crédito
  const handleOpenCreditNoteModal = () => setOpenCreditNoteModal(true);
  const handleCloseCreditNoteModal = () => {
    setOpenCreditNoteModal(false);
    fetchInvoiceDetails(); // Recarga los detalles después de agregar
  };

  // Cálculo de saldo pendiente
  const totalCreditNotesAmount = invoice?.creditNotes?.reduce((sum, cn) => sum + cn.creditNoteAmount, 0) || 0;
  const pendingBalance = invoice ? invoice.totalAmount - totalCreditNotesAmount : 0;

  /**
   * Traduce estados de inglés a español para mejor presentación
   * @param {string} status - Estado a traducir
   * @returns {string} Estado traducido
   */
  const translateStatus = (status) => {
    const translations = {
      'Issued': 'Emitida',
      'Partial': 'Parcial',
      'Cancelled': 'Cancelada',
      'Paid': 'Pagado',
      'Pending': 'Pendiente',
      'Overdue': 'Vencido'
    };
    return translations[status] || status;
  };

  // ========================================================
  //  Renderizado condicional basado en estado de carga/error
  // ========================================================
  
  // Estado de carga
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            alignItems: 'center'
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            {error}
          </Typography>
          <Button 
            onClick={() => navigate('/invoices')} 
            variant="outlined" 
            sx={{ ml: 2 }}
            startIcon={<BackIcon />}
          >
            Volver al Listado
          </Button>
        </Alert>
      </Box>
    );
  }

  // Factura no encontrada
  if (!invoice) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            alignItems: 'center'
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Factura no encontrada.
          </Typography>
          <Button 
            onClick={() => navigate('/invoices')} 
            variant="outlined" 
            sx={{ ml: 2 }}
            startIcon={<BackIcon />}
          >
            Volver al Listado
          </Button>
        </Alert>
      </Box>
    );
  }

  // ========================================================
  //  Renderizado principal
  // ========================================================
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Contenedor principal de la factura */}
      <Paper elevation={3} sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
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
            <Typography variant="h5" component="h2" sx={{ mt: 1 }}>
              Factura #{invoice.invoiceNumber}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/invoices')}
            startIcon={<BackIcon />}
            sx={{ 
              mt: { xs: 2, md: 0 },
              backgroundColor: '#ffffff',
              color: '#1a237e',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#e0e0e0'
              }
            }}
          >
            Volver al Listado
          </Button>
        </Box>

        {/* Contenido principal - Grid de 2 columnas */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Columna izquierda: Información de factura y cliente */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
                {/* Sección: Datos de Factura */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <InvoiceIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">Datos de la Factura</Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Fecha de Emisión</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      <DateIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                      {formatDate(invoice.invoiceDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Fecha de Vencimiento</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      <DateIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                      {formatDate(invoice.dueDate)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Estado de Factura</Typography>
                    <Chip
                      label={translateStatus(invoice.status)}
                      sx={statusStyles[invoice.status]}
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Estado de Pago</Typography>
                    <Chip
                      label={translateStatus(invoice.paymentStatus)}
                      sx={statusStyles[invoice.paymentStatus]}
                      size="medium"
                    />
                  </Grid>
                </Grid>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Monto Total</Typography>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      ${invoice.totalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Saldo Pendiente</Typography>
                    <Typography variant="h5" fontWeight={700} color={pendingBalance > 0 ? 'error.main' : 'success.main'}>
                      ${invoice.paymentStatus === 'Paid' ? (0).toFixed(2) : pendingBalance.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Sección: Datos del Cliente */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CustomerIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">Datos del Cliente</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Nombre</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {invoice.customer.customerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">RUN</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {invoice.customer.customerRun}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {invoice.customer.customerEmail}
                    </Typography>
                  </Grid>
                </Grid>
                
                {/* Sección: Información de Pago (si existe) */}
                {invoice.invoicePayment && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PaymentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Typography variant="h5">Información de Pago</Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Método de Pago</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {invoice.invoicePayment.paymentMethod || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Fecha de Pago</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(invoice.invoicePayment.paymentDate)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Paper>
            </Grid>
            
            {/* Columna derecha: Productos y Notas de Crédito */}
            <Grid item xs={12} md={6}>
              {/* Tabla de Productos */}
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ProductIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">Detalle de Productos</Typography>
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Precio Unitario</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.items && invoice.items.length > 0 ? (
                        invoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Typography variant="body2" color="textSecondary">
                              No hay productos registrados
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              
              {/* Tabla de Notas de Crédito */}
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CreditNoteIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5">Notas de Crédito</Typography>
                  </Box>
                  
                  {/* Botón condicional para agregar notas */}
                  {invoice.status !== 'Cancelled' && invoice.paymentStatus !== 'Paid' && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleOpenCreditNoteModal}
                      startIcon={<CreditNoteIcon />}
                    >
                      Agregar Nota
                    </Button>
                  )}
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Número NC</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Monto</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Fecha</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.creditNotes && invoice.creditNotes.length > 0 ? (
                        invoice.creditNotes.map((cn, index) => (
                          <TableRow key={index}>
                            <TableCell>{cn.creditNoteNumber}</TableCell>
                            <TableCell align="right">${cn.creditNoteAmount.toFixed(2)}</TableCell>
                            <TableCell align="right">{formatDate(cn.createdDate)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="textSecondary">
                              No hay notas de crédito registradas
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Modal para agregar Nota de Crédito */}
      <Modal
        open={openCreditNoteModal}
        onClose={handleCloseCreditNoteModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CreditNoteIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" id="modal-title">
              Agregar Nota de Crédito
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Factura: #{invoiceNumber}
          </Typography>
          
          <AddCreditNoteForm 
            invoiceNumber={invoiceNumber} 
            pendingBalance={pendingBalance} 
            onClose={handleCloseCreditNoteModal} 
            onCreditNoteAdded={fetchInvoiceDetails} 
            invoicePaymentStatus={invoice.paymentStatus} 
          />
        </Box>
      </Modal>
    </Box>
  );
}

// ========================================================
//  Funciones y constantes auxiliares
// ========================================================

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
 * Estilo para el modal de notas de crédito
 */
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};