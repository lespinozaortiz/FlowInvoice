namespace FlowInvoice.DTOs
{
    /// <summary>
    /// DTO para reportar facturas vencidas sin notas de cr�dito.
    /// </summary>
    public class OverdueInvoiceReportDto
    {
        /// <summary>
        /// Numero �nico de factura.
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
        /// Cantidad de d�as de la factura que est� vencida.
        /// </summary>
        public int DaysOverdue { get; set; }
    }
}