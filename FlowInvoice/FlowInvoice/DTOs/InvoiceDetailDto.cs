namespace FlowInvoice.DTOs
{
    /// <summary>
    /// Detalles de un ítem de factura
    /// </summary>
    public class InvoiceItemDetailDto
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
    }
    /// <summary>
    /// Detalles de una nota de crédito asociada a la factura.
    /// </summary>
    public class CreditNoteDetailDto
    {
        public string CreditNoteNumber { get; set; }
        public decimal CreditNoteAmount { get; set; }
        public System.DateTime CreatedDate { get; set; }
    }
    /// <summary>
    /// Información del cliente asociado a la factura.
    /// </summary>
    public class CustomerDetailDto
    {
        public string CustomerRun { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
    }
    /// <summary>
    /// Información del pago de la factura.
    /// </summary>
    public class InvoicePaymentDetailDto
    {
        public string? PaymentMethod { get; set; }
        public System.DateTime? PaymentDate { get; set; }
    }
    /// <summary>
    /// DTO completo para mostrar los detalles de una factura.
    /// </summary>
    public class InvoiceDetailDto
    {
        public string InvoiceNumber { get; set; }
        public System.DateTime InvoiceDate { get; set; }
        public System.DateTime DueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public string PaymentStatus { get; set; }
        /// <summary>
        /// Indica si la factura tiene consistencia entre su monto declarado y el monto calculado.
        /// </summary>
        public bool IsConsistent { get; set; }

        public CustomerDetailDto Customer { get; set; }
        public InvoicePaymentDetailDto InvoicePayment { get; set; }
        public List<InvoiceItemDetailDto> Items { get; set; }
        public List<CreditNoteDetailDto> CreditNotes { get; set; }
    }
}