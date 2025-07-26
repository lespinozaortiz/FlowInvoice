namespace FlowInvoice.DTOs
{
    /// <summary>
    /// DTO para mostrar un resumen de facturas en listados.
    /// </summary>
    public class InvoiceListDto
    {
        /// <summary>
        /// Numero de factura.
        /// </summary>
        public string InvoiceNumber { get; set; }
        /// <summary>
        /// Nombre del cliente asociado a factura.
        /// </summary>
        public string CustomerName { get; set; }
        /// <summary>
        /// Monto total declarado en la factura.
        /// </summary>
        public decimal TotalAmount { get; set; }
        /// <summary>
        /// Estado actual de la factura (Issued, Partial, Cancelled).
        /// </summary>
        public string Status { get; set; }
        /// <summary>
        /// Estado del pago (Pending, Overdue, Paid).
        /// </summary>
        public string PaymentStatus { get; set; }
    }
}