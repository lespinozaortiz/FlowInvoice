using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FlowInvoice.Models
{
    /// <summary>
    /// Representa una factura emitida a un cliente, incluyendo sus detalles, notas de crédito y estado de pago.
    /// </summary>
    public class Invoice
    {
        /// <summary>
        /// Identificador único de la factura, llave primaria
        /// </summary>
        [Key]
        public int Id { get; set; }
        /// <summary>
        /// Número único de la factura, proporcionado por el archivo de importación.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string InvoiceNumber { get; set; }
        /// <summary>
        /// Fecha en que fue emitida la factura.
        /// </summary>
        public DateTime InvoiceDate { get; set; }
        /// <summary>
        /// Fecha de vencimiento de la factura.
        /// </summary>
        public DateTime DueDate { get; set; }
        /// <summary>
        /// Monto total declarado de la factura. 
        /// </summary>
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }



        // -----------
        //Información del cliente
        // -----------

        /// <summary>
        /// Run del cliente (RUT en Chile).
        /// </summary>
        [MaxLength(20)]
        public string CustomerRun { get; set; }
        /// <summary>
        /// Nombre del cliente.
        /// </summary>
        [MaxLength(100)]
        public string CustomerName { get; set; }
        /// <summary>
        /// Email del cliente.
        /// </summary>
        [MaxLength(100)]
        public string CustomerEmail { get; set; }

        // -----------
        // Información de pago
        // -----------

        /// <summary>
        /// Método de pago utilizado
        /// </summary>
        [MaxLength(50)]
        public string? PaymentMethod { get; set; }
        /// <summary>
        /// Fecha en que se realizó el pago
        /// </summary>
        public DateTime? PaymentDate { get; set; }

        //-----------
        // Estados y consistencia
        //-----------

        /// <summary>
        /// Estado actual de la factura: "Issued", "Partial", "Cancelled".
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Status { get; set; }

        /// <summary>
        /// Estado de pago: "Paid", "Pending", "Overdue".
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string PaymentStatus { get; set; }
        /// <summary>
        /// Indicador si la factura es consistente.
        /// </summary>
        public bool IsConsistent { get; set; }

        //-----------
        // Relaciones
        //-----------

        /// <summary>
        /// Detalles de items incluidos en la factura.
        /// </summary>
        public ICollection<InvoiceItem> Items { get; set; }
        /// <summary>
        /// Notas de crédito asociadas a la factura
        /// </summary>
        public ICollection<CreditNote> CreditNotes { get; set; }

        public Invoice()
        {
            Items = new List<InvoiceItem>();
            CreditNotes = new List<CreditNote>();
            IsConsistent = true; // Por defecto, la factura es consistente, se confirmará al importar
            Status = "Issued"; // Por defecto, el estado es "Issued", se calculará al importar
            PaymentStatus = "Pending"; // Por defecto, el estado de pago es "Pending", se calculará al importar
        }
    }
}
