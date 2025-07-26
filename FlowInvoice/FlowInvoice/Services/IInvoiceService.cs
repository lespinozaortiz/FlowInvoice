using FlowInvoice.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FlowInvoice.Services
{
    /// <summary>
    /// Servicio para gestionar facturas, incluyendo filtros, detalles, notas de crédito y reportes.
    /// </summary>
    public interface IInvoiceService
    {
        /// <summary>
        /// Obtiene una lista de facturas filtradas por número, estado o estado de pago.
        /// </summary>
        /// <param name="invoiceNumber">Numero de factura.</param>
        /// <param name="status">Estado de la factura.</param>
        /// <param name="paymentStatus">Estado de pago.</param>
        /// <returns>Lista de facturas coincidentes.</returns>
        Task<List<InvoiceListDto>> GetFilteredInvoicesAsync(string invoiceNumber = null, string status = null, string paymentStatus = null);
        /// <summary>
        /// Obtiene los detalles completos de facturas por su número.
        /// </summary>
        /// <param name="invoiceNumber">Número de la factura.</param>
        /// <returns>Detalle de la factura, o null si no se encuentra.</returns>
        Task<InvoiceDetailDto?> GetInvoiceDetailsByNumberAsync(string invoiceNumber);
        /// <summary>
        /// Agrega una nota de crédito a una factura existente.
        /// </summary>
        /// <param name="invoiceNumber">Número de la factura a la cual se aplicará la nota de crédito. </param>
        /// <param name="creditNoteDto">Detalles de la nota de crédito.</param>
        /// <returns>Resultado de la operación, incluyendo validaciones y nuevo estado.</returns>
        Task<AddCreditNoteResultDto> AddCreditNoteAsync(string invoiceNumber, AddCreditNoteDto creditNoteDto);
        /// <summary>
        /// Genera un reporte de facturas vencidas que no tienen notas de crédito aplicadas.
        /// </summary>
        /// <returns>Listas de facturas vencidas</returns>
        Task<List<OverdueInvoiceReportDto>> GetOverdueInvoicesReportAsync();
        /// <summary>
        /// Genera un resumen del estado de pagos de todas las facturas consistentes.
        /// </summary>
        /// <returns>Resumen con porcentajes y conteo de pago.</returns>
        Task<PaymentStatusReportDto> GetPaymentStatusSummaryReportAsync();
        /// <summary>
        /// Genera un reporte de facturas inconsistentes, mostrando discrepancias entre el total declarado y el total calculado.
        /// </summary>
        /// <returns>Lista de facturas con inconsistencias detectadas.</returns>
        Task<List<InconsistentInvoiceReportDto>> GetInconsistentInvoicesReportAsync();
    }
}