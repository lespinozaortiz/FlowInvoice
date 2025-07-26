namespace FlowInvoice.DTOs
{
    /// <summary>
    /// DTO para reportar facturas vencidas sin notas de crédito.
    /// </summary>
    public class OverdueInvoiceReportDto
    {
        /// <summary>
        /// Numero único de factura.
        /// </summary>
        public string InvoiceNumber { get; set; }
        /// <summary>
        /// Nombre del cliente asociado a factura.
        /// </summary>
        public string CustomerName { get; set; }
        /// <summary>
        /// Monto total declarado de la factura
        /// </summary>
        public decimal TotalAmount { get; set; }
        /// <summary>
        /// Fecha de vencimiento original de la factura.
        /// </summary>
        public System.DateTime DueDate { get; set; }
        /// <summary>
        /// Cantidad de días de la factura que está vencida.
        /// </summary>
        public int DaysOverdue { get; set; }
    }
}