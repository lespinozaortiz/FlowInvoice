namespace FlowInvoice.DTOs
{
    /// <summary>
    /// Representa un resumen por estado de pago de las facturas
    /// </summary>
    public class PaymentStatusSummaryDto
    {
        /// <summary>
        /// Estado de pago.
        /// </summary>
        public string Status { get; set; }
        /// <summary>
        /// Cantidad total de facturas que tienen este estado.
        /// </summary>
        public int TotalCount { get; set; }
        /// <summary>
        /// Porcentaje que representa este estado respecto al total de facturas.
        /// </summary>
        public decimal Percentage { get; set; }
    }
    /// <summary>
    /// DTO que encapsula un reporte de resumen de estados de pago.
    /// </summary>
    public class PaymentStatusReportDto
    {
        /// <summary>
        /// Total de facturas 
        /// </summary>
        public int TotalInvoices { get; set; }
        /// <summary>
        /// Lista de resumenes por estado de pago.
        /// </summary>
        public List<PaymentStatusSummaryDto> Summaries { get; set; }
    }
}