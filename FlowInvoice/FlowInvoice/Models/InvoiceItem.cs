using FlowInvoice.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace FlowInvoice.Models
{
    /// <summary>
    /// Representa un producto o servicio incluido en la factura.
    /// </summary>
    public class InvoiceItem
    {
        /// <summary>
        /// Identificador único del ítem de la factura, clave primaria.
        /// </summary>
        [Key]
        public int Id { get; set; }
        /// <summary>
        /// Identificador de la factura a la que pertenece este ítem, clave foránea.
        /// </summary>
        public int InvoiceId { get; set; }
        /// <summary>
        /// Factura asociada a este ítem.
        /// </summary>
        [ForeignKey("InvoiceId")]
        public Invoice Invoice { get; set; }
        /// <summary>
        /// Nombre del producto o servicio facturado.
        /// </summary>
        [Required]
        [MaxLength(255)]
        public string ProductName { get; set; }
        /// <summary>
        /// Cantidad del producto facturado.
        /// </summary>
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio unitario debe ser mayor a 0.")]
        public int Quantity { get; set; }
        /// <summary>
        /// Precio unitario del producto.
        /// </summary>
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio unitario debe ser mayor a 0.")]
        public decimal UnitPrice { get; set; }
        /// <summary>
        /// Subtotal ( Quantity * UnitPrice).
        /// </summary>
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }
    }
}
