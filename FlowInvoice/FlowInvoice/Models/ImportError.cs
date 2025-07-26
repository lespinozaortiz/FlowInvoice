using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace FlowInvoice.Models
{
    /// <summary>
    /// Representa un error detectado durante el proceso de importación de facturas desde JSON.
    /// </summary>
    public class ImportError
    {
        /// <summary>
        /// Identificador único del error, clave primaria.
        /// </summary>
        [Key]
        public int Id { get; set; }
        /// <summary>
        /// Marca de tiempo en que ocurrió el error
        /// </summary>
        public DateTime TimeStamp { get; set; }
        /// <summary>
        /// Tipo de error: "Duplicate", "InconsistentAmount".
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string ErrorType { get; set; }
        /// <summary>
        /// Detalles adicionales del error.
        /// </summary>
        [Required]
        public string Details { get; set; }

        public ImportError()
        {
            TimeStamp = DateTime.UtcNow;
        }
    }
}
