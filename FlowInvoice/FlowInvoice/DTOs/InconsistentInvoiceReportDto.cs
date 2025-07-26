namespace FlowInvoice.DTOs
{
    /// <summary>
    /// Representa una factura que tiene discrepancias en el total declarado y el subtotal calculado
    /// </summary>
    public class InconsistentInvoiceReportDto
    {
        /// <summary>
        /// Número de la factura que presenta inconsistencias.
        /// </summary>
        public string InvoiceNumber { get; set; }
        /// <summary>
        /// Monto total declarado de la factura
        /// </summary>
        public decimal DeclaredTotalAmount { get; set; }
        /// <summary>
        /// Suma calculada del subtotal de los ítems de la factura.
        /// </summary>
        public decimal CalculatedSubtotalSum { get; set; }
        /// <summary>
        /// Detalles de la discrepancia encontrada.
        /// </summary>
        public string DiscrepancyDetails { get; set; }
    }
}