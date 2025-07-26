using FlowInvoice.DTOs;
using System.Threading.Tasks;

namespace FlowInvoice.Services
{
    /// <summary>
    /// Servicio responsable de importar facturas desde un DTO.
    /// </summary>
    public interface IImportService
    {
        /// <summary>
        /// Importa facturas desde un DTO, validando duplicados e inconsistencias.
        /// </summary>
        /// <param name="rootDto">Objeto contenedor con la lista de facturas a importar.</param>
        /// <returns>Resultado del proceso de importación</returns>
        Task<ImportResult> ImportInvoicesFromDtoAsync(RootImportDto rootDto);
    }
    /// <summary>
    /// Representa el resultado del proceso de importación de facturas.
    /// </summary>

    public class ImportResult
    {
        /// <summary>
        /// Total de facturas procesadas en el lote.
        /// </summary>
        public int TotalInvoicesProcessed { get; set; }
        /// <summary>
        /// Cantidad de facturas importadas exitosamente
        /// </summary>
        public int InvoicesImportedSuccessfully { get; set; }
        /// <summary>
        /// Cantidad de facturas omitidas por estar duplicadas.
        /// </summary>
        public int InvoicesSkippedDueToDuplicate { get; set; }
        /// <summary>
        /// Cantidad de facturas marcadas como inconsistentes.
        /// </summary>
        public int InvoicesMarkedInconsistent { get; set; }
        /// <summary>
        /// Mensaje general del resultado de importación.
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        /// Errores detectados por duplicación.
        /// </summary>
        public List<string> DuplicateErrors { get; set; } = new List<string>();
        /// <summary>
        /// Errores detectados por inconsistencias en montos.
        /// </summary>
        public List<string> InconsistentErrors { get; set; } = new List<string>();
    }
}
