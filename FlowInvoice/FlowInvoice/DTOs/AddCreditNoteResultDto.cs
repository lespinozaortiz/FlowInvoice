namespace FlowInvoice.DTOs
{
    /// <summary>
    /// Resultado del intento de agregar una nota de cr�dito a una factura.
    /// </summary>
    public class AddCreditNoteResultDto
    {
        /// <summary>
        /// Indica si la factura fue exitosa.
        /// </summary>
        public bool Success { get; set; }
        /// <summary>
        /// Mensaje de error si la factura falla.
        /// </summary>
        public string? ErrorMessage { get; set; }
        /// <summary>
        /// Monto m�ximo permitido para aplicar como nota de cr�dito, corresponde al saldo pendiente de la factura.
        /// </summary>
        public decimal MaxAllowedAmount { get; set; }
        /// <summary>
        /// Estado actualizado de la factura.
        /// </summary>
        public string? NewInvoiceStatus { get; set; }
        /// <summary>
        /// Estado actualizado del pago.
        /// </summary>
        public string? NewPaymentStatus { get; set; }
    }
}