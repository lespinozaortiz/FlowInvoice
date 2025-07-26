import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { addCreditNote } from '../services/api';

/**
 * Componente AddCreditNoteForm
 * 
 * Formulario para agregar una Nota de Crédito a una factura específica.
 * 
 * Props:
 * - invoiceNumber: número de factura al que se le asignará la nota de crédito.
 * - pendingBalance: monto restante que puede cubrirse con la nota de crédito.
 * - onClose: función callback para cerrar el formulario/modal.
 * - onCreditNoteAdded: callback para recargar la información tras agregar una nota.
 * - invoicePaymentStatus: estado actual de la factura (ejemplo: "Paid").
 */
export default function AddCreditNoteForm({
  invoiceNumber,
  pendingBalance,
  onClose,
  onCreditNoteAdded,
  invoicePaymentStatus
}) {
  // Estados locales
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const creditNoteAmount = parseFloat(amount);

    // Validación: monto válido y positivo
    if (isNaN(creditNoteAmount) || creditNoteAmount <= 0) {
      setError('Por favor, ingrese un monto válido y positivo.');
      setLoading(false);
      return;
    }

    // Validación: no exceder el saldo pendiente
    if (creditNoteAmount > pendingBalance) {
      setError(
        `El monto de la nota de crédito no puede superar el saldo pendiente ($${pendingBalance.toFixed(2)}).`
      );
      setLoading(false);
      return;
    }

    // Llamada a API
    try {
      await addCreditNote(invoiceNumber, { creditNoteAmount });
      setSuccess(true);
      onCreditNoteAdded(); // Refresca datos de factura
      onClose();           // Cierra el modal 
    } catch (err) {
      // Manejo de errores de red/API
      setError(
        'Error al agregar la nota de crédito: ' +
        (err.response?.data?.message || err.message || 'Error desconocido')
      );
    } finally {
      setLoading(false);
    }
  };

  // Si la factura ya está pagada, mostrar aviso y deshabilitar formulario
  if (invoicePaymentStatus === 'Paid') {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          No se pueden agregar notas de crédito a facturas ya pagadas.
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button onClick={onClose} variant="outlined">Cerrar</Button>
        </Box>
      </Box>
    );
  }

  // Formulario principal
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 2 }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Agregar Nota de Crédito
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Saldo pendiente: <strong>${pendingBalance.toFixed(2)}</strong>
      </Typography>

      <TextField
        label="Monto de la Nota de Crédito"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
        required
        inputProps={{ step: "0.01", min: "0" }}
      />

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>Nota de crédito agregada exitosamente.</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );
}
