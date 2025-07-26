using System.ComponentModel.DataAnnotations;

namespace FlowInvoice.DTOs
{
    /// <summary>
    /// DTO para agregar una nota de crédito a una factura existente.
    /// </summary>
    public class AddCreditNoteDto
    {
        /// <summary>
        /// Monto a descontar mediante la nota de crédito.
        /// Debe ser mayor que cero.
        /// </summary>
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor que cero")]
        public decimal CreditNoteAmount { get; set; }
    }
    /// <summary>
    /// DTO de respuesta tras aplicar una nota de crédito a una factura.
    /// </summary>
    public class CreditNoteResponseDto
    {
        /// <summary>
        /// Número único asignado a la nota de crédito generada.
        /// </summary>
        public string CreditNoteNumber { get; set; }
        /// <summary>
        /// Nuevo saldo de factura de aplicado la nota de crédito
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