using FlowInvoice.Models;
using FlowInvoice.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FlowInvoice.Repositories
{
    /// <summary>
    /// Interfaz que define las operaciones de acceso a datos.
    /// </summary>
    public interface IInvoiceRepository
    {
        /// <summary>
        /// Agrega una factura individual al contexto.
        /// </summary>
        /// <param name="invoice">Factura a agregar.</param>
        /// <returns></returns>
        Task AddInvoiceAsync(Invoice invoice);
        /// <summary>
        /// Agrega multiples facturas al contexto.
        /// </summary>
        /// <param name="invoices">Colección de facturas.</param>
        /// <returns></returns>
        Task AddRangeAsync(IEnumerable<Invoice> invoices);
        /// <summary>
        /// Verifica si una factura existe por su número.
        /// </summary>
        /// <param name="invoiceNumber">Número de la factura.</param>
        /// <returns>True si existe, false si no.</returns>
        Task<bool> InvoiceExistsAsync(string invoiceNumber);
        /// <summary>
        /// Agrega un error de importación al contexto.
        /// </summary>
        /// <param name="error">Error de importación a registrar.</param>
        /// <returns></returns>
        Task AddImportErrorAsync(ImportError error);
        /// <summary>
        /// Persiste todos los cambios pendientes en la base de datos.
        /// </summary>
        /// <returns></returns>
        Task SaveChangesAsync();
        /// <summary>
        /// Recupera facturas filtradas según parámetros opcionales.
        /// </summary>
        /// <param name="invoiceNumber">Filtro por número de factura.</param>
        /// <param name="status">Filtro por estado.</param>
        /// <param name="paymentStatus">Filtro por estado de pago.</param>
        /// <returns></returns>
        Task<List<InvoiceListDto>> GetFilteredInvoicesAsync(string invoiceNumber = null, string status = null, string paymentStatus = null);
        /// <summary>
        /// Obtiene una factura por su número, con ítems y notas de crédito
        /// </summary>
        /// <param name="invoiceNumber">Número de factura.</param>
        /// <returns></returns>
        Task<Invoice> GetInvoiceByNumberAsync(string invoiceNumber);
        /// <summary>
        /// Obtiene una factura por su número, incluyendo notas de crédito ( para editar)
        /// </summary>
        /// <param name="invoiceNumber">Número de factura.</param>
        /// <returns></returns>
        Task<Invoice?> GetInvoiceByNumberForUpdateAsync(string invoiceNumber);
        /// <summary>
        /// Obtiene todas las facturas vencidas(más de 30 días) y sin notas de crédito.
        /// </summary>
        /// <returns></returns>
        Task<List<Invoice>> GetOverdueInvoicesWithoutCreditNotesAsync();
        /// <summary>
        /// Obtiene todas las facturas marcadas como consistentes.
        /// </summary>
        /// <returns></returns>
        Task<List<Invoice>> GetAllConsistentInvoicesAsync();
        /// <summary>
        /// Obtiene todas las facturas marcadas como inconsistentes, con sus ítems.
        /// </summary>
        /// <returns></returns>
        Task<List<Invoice>> GetInconsistentInvoicesAsync();
    }
}
