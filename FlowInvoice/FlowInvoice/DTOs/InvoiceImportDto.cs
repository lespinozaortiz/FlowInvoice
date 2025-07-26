using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace FlowInvoice.DTOs
{
    /// <summary>
    /// Representa una factura importada desde un archivo JSON.
    /// </summary>
    public class InvoiceImportDto
    {
        [JsonPropertyName("invoice_number")]
        public int InvoiceNumber { get; set; } // Número de factura

        [JsonPropertyName("invoice_date")]
        public DateTime InvoiceDate { get; set; } // Fecha de emisión de la factura

        [JsonPropertyName("invoice_status")]
        public string InvoiceStatus { get; set; } // Estado de la factura, se lee pero no se usa

        [JsonPropertyName("total_amount")]
        public decimal TotalAmount { get; set; } // Monto total de la factura

        [JsonPropertyName("days_to_due")]
        public int DaysToDue { get; set; } // Días para el vencimiento, se lee pero no se usa

        [JsonPropertyName("payment_due_date")]
        public DateTime PaymentDueDate { get; set; } // Fecha de vencimiento del pago

        [JsonPropertyName("payment_status")]
        public string PaymentStatus { get; set; } // Estado del pago, se lee pero no se usa

        [JsonPropertyName("invoice_detail")]
        public List<InvoiceDetailImportDto> InvoiceDetails { get; set; } // Detalle de la factura

        [JsonPropertyName("invoice_payment")]
        public InvoicePaymentImportDto InvoicePayment { get; set; } // Información de pago de la factura

        [JsonPropertyName("invoice_credit_note")]
        public List<InvoiceCreditNoteImportDto> InvoiceCreditNotes { get; set; } // Notas de crédito asociadas a la factura

        [JsonPropertyName("customer")]
        public CustomerImportDto Customer { get; set; } // Información del cliente


    }
    /// <summary>
    /// Representa un ítem dentro de una factura importada.
    /// </summary>
    public class InvoiceDetailImportDto
    {
        [JsonPropertyName("product_name")]
        public string ProductName { get; set; } // Nombre del producto
        [JsonPropertyName("quantity")]
        public int Quantity { get; set; } // Cantidad del producto
        [JsonPropertyName("unit_price")]
        public decimal UnitPrice { get; set; } // Precio unitario del producto
        [JsonPropertyName("subtotal")]
        public decimal Subtotal { get; set; } // Subtotal del producto (Quantity * UnitPrice)
    }
    /// <summary>
    /// Representa los detalles del pago de una factura.
    /// </summary>
    public class InvoicePaymentImportDto
    {
        [JsonPropertyName("payment_method")]
        public string? PaymentMethod { get; set; } // Método de pago
        [JsonPropertyName("payment_date")]
        public DateTime? PaymentDate { get; set; } // Fecha de pago, puede ser nula
    }
    /// <summary>
    /// Representa una nota de crédito asociada a una factura.
    /// </summary>
    public class InvoiceCreditNoteImportDto
    {
        [JsonPropertyName("credit_note_number")]
        public int CreditNoteNumber { get; set; } // ID de la nota de crédito
        [JsonPropertyName("credit_note_amount")]
        public decimal CreditNoteAmount { get; set; } // Monto de la nota de crédito
        [JsonPropertyName("credit_note_date")]
        public DateTime CreditNoteDate { get; set; } // Fecha de creación de la nota de crédito
    }
    /// <summary>
    /// Representa la información de un cliente importado.
    /// </summary>
    public class CustomerImportDto
    {
        [JsonPropertyName("customer_run")]
        public string CustomerRun { get; set; } // RUN del cliente (RUT en Chile)
        [JsonPropertyName("customer_name")]
        public string CustomerName { get; set; } // Nombre del cliente
        [JsonPropertyName("customer_email")]
        public string CustomerEmail { get; set; } // Email del cliente
    }
    /// <summary>
    /// Contenedor raíz para la importación de multiples facturas.
    /// </summary>
    public class RootImportDto
    {
        [JsonPropertyName("invoices")]
        public List<InvoiceImportDto> Invoices { get; set; } // Lista de facturas a importar
    }
}
