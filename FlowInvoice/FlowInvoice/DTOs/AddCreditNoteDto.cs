using System.ComponentModel.DataAnnotations;

namespace FlowInvoice.DTOs
{
    /// <summary>
    /// DTO para agregar una nota de cr�dito a una factura existente.
    /// </summary>
    public class AddCreditNoteDto
    {
        /// <summary>
        /// Monto a descontar mediante la nota de cr�dito.
        /// Debe ser mayor que cero.
        /// </summary>
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor que cero")]
        public decimal CreditNoteAmount { get; set; }
    }
    /// <summary>
    /// DTO de respuesta tras aplicar una nota de cr�dito a una factura.
    /// </summary>
    public class CreditNoteResponseDto
    {
        /// <summary>
        /// N�mero �nico asignado a la nota de cr�dito generada.
        /// </summary>
        public string CreditNoteNumber { get; set; }
        /// <summary>
        /// Nuevo saldo de factura de aplicado la nota de cr�dito
        /// </summary>
        public decimal NewBalance { get; set; }
        /// <summary>
        /// Estado actualizado de la factura
        /// </summary>
        public string InvoiceStatus { get; set; }
        /// <summary>
        /// Estado de pago actualizado
        /// </summary>
        public string PaymentStatus { get; set; }
    }
}