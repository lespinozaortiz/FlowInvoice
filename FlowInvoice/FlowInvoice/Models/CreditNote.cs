using FlowInvoice.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;
namespace FlowInvoice.Models
{
    /// <summary>
    /// Representa una nota de crédito asociada a una factura.
    /// Las notas de crédito pueden anular o disminuir el monto total de una factura.
    /// </summary>
    public class CreditNote
    {
        /// <summary>
        /// Idenficador único de la nota de crédito, llave primaria.
        /// </summary>
        [Key]
        public int Id { get; set; }
        /// <summary>
        /// Identificador de la factura asociada a esta nota de crédito, llave foránea.
        /// </summary>
        public int InvoiceId { get; set; } 
        /// <summary>
        /// Factura asociada a esta nota de crédito.
        /// </summary>
        [ForeignKey("InvoiceId")]
        public Invoice Invoice { get; set; }
        /// <summary>
        /// Número de la nota de crédito.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string CreditNoteNumber { get; set; }
        /// <summary>
        /// Monto total de la nota de crédito.
        /// </summary>
        [Column(TypeName = "decimal(18, 2)")]
        [Range(0, double.MaxValue, ErrorMessage = "El monto de la nota de crédito debe ser mayor o igual a 0.")]
        public decimal CreditNoteAmount { get; set; } 
        /// <summary>
        /// Fecha de emisión de la nota de crédito.
        /// </summary>
        public DateTime CreatedDate { get; set; } 
    }
}
