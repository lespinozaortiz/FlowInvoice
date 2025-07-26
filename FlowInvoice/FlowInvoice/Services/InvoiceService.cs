using FlowInvoice.DTOs;
using FlowInvoice.Repositories;
using FlowInvoice.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace FlowInvoice.Services
{
    /// <summary>
    /// Servicio responsable de importar facturas desde un DTO,
    /// gestionando la validación de duplicados e inconsistencias.
    /// </summary>
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepository;

        public InvoiceService(IInvoiceRepository invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }
        /// <summary>
        /// Obtiene una lista de facturas que coinciden con los filtros opcionales proporcionados.
        /// </summary>
        /// <param name="invoiceNumber">Número de la factura a buscar (opcional).</param>
        /// <param name="status">Estado de la factura, como "Emitida", "Cancelada", etc. (opcional).</param>
        /// <param name="paymentStatus">Estado de pago, como "Pagada", "Pendiente", "Parcial" (opcional).</param>
        /// <returns>Una lista de facturas que cumplen con los criterios de búsqueda.</returns>
        public async Task<List<InvoiceListDto>> GetFilteredInvoicesAsync(string invoiceNumber = null, string status = null, string paymentStatus = null)
        {
            Console.WriteLine($"InvoiceService - GetFilteredInvoicesAsync: invoiceNumber='{invoiceNumber}', status='{status}', paymentStatus='{paymentStatus}'");
            return await _invoiceRepository.GetFilteredInvoicesAsync(invoiceNumber, status, paymentStatus);
        }
        /// <summary>
        /// Obtiene los detalles completos de una factura dado su número único.
        /// </summary>
        /// <param name="invoiceNumber">Número identificador de la factura.</param>
        /// <returns>Un objeto  si se encuentra la factura, o null en caso contrario.</returns>
        public async Task<InvoiceDetailDto?> GetInvoiceDetailsByNumberAsync(string invoiceNumber)
        {
            var invoice = await _invoiceRepository.GetInvoiceByNumberAsync(invoiceNumber);

            if (invoice == null)
            {
                return null;
            }

            return new InvoiceDetailDto
            {
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceDate = invoice.InvoiceDate,
                DueDate = invoice.DueDate,
                TotalAmount = invoice.TotalAmount,
                Status = invoice.Status,
                PaymentStatus = invoice.PaymentStatus,
                IsConsistent = invoice.IsConsistent,
                Customer = new CustomerDetailDto
                {
                    CustomerRun = invoice.CustomerRun,
                    CustomerName = invoice.CustomerName,
                    CustomerEmail = invoice.CustomerEmail
                },
                InvoicePayment = new InvoicePaymentDetailDto
                {
                    PaymentMethod = invoice.PaymentMethod,
                    PaymentDate = invoice.PaymentDate
                },
                Items = invoice.Items.Select(item => new InvoiceItemDetailDto
                {
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Subtotal = item.Subtotal
                }).ToList(),
                CreditNotes = invoice.CreditNotes.Select(cn => new CreditNoteDetailDto
                {
                    CreditNoteNumber = cn.CreditNoteNumber,
                    CreditNoteAmount = cn.CreditNoteAmount,
                    CreatedDate = cn.CreatedDate
                }).ToList()
            };
        }
        /// <summary>
        /// Agrega una nota de crédito a una factura existente, ajustando su estado y total pagado.
        /// </summary>
        /// <param name="creditNoteDto">DTO que representa la nota de crédito a aplicar.</param>
        /// <returns>True si la operación fue exitosa, False si falló (por ejemplo, si la factura no existe o ya fue cancelada).</returns>
        /// <remarks>
        /// Este método valida que la factura exista, que no esté cancelada, y actualiza automáticamente el estado de pago.
        /// También evita que el total de notas de crédito supere el total original de la factura.
        /// </remarks>
        public async Task<AddCreditNoteResultDto> AddCreditNoteAsync(string invoiceNumber, AddCreditNoteDto creditNoteDto)
        {
            var result = new AddCreditNoteResultDto();

            // Validación básica
            if (creditNoteDto.CreditNoteAmount <= 0)
            {
                result.Success = false;
                result.ErrorMessage = "El monto debe ser mayor que cero.";
                return result;
            }

            // Obtener la factura para actualización 
            var invoice = await _invoiceRepository.GetInvoiceByNumberForUpdateAsync(invoiceNumber);

            if (invoice == null)
            {
                result.Success = false;
                result.ErrorMessage = "Factura no encontrada.";
                return result;
            }

            // Validar estado de factura
            if (invoice.Status == "Cancelled")
            {
                result.Success = false;
                result.ErrorMessage = "No se pueden agregar notas de crédito a facturas canceladas.";
                return result;
            }

            // Calcular saldo pendiente
            decimal existingCreditNotesSum = invoice.CreditNotes?.Sum(cn => cn.CreditNoteAmount) ?? 0;
            decimal pendingBalance = invoice.TotalAmount - existingCreditNotesSum;

            // Validar monto
            if (creditNoteDto.CreditNoteAmount > pendingBalance)
            {
                result.Success = false;
                result.ErrorMessage = $"El monto excede el saldo pendiente. Saldo disponible: {pendingBalance:C2}.";
                result.MaxAllowedAmount = pendingBalance;
                return result;
            }

            // Crear nueva nota de crédito
            var newCreditNote = new Models.CreditNote 
            {
                CreditNoteNumber = GenerateCreditNoteNumber(invoiceNumber),
                CreditNoteAmount = creditNoteDto.CreditNoteAmount,
                CreatedDate = DateTime.UtcNow
            };

            // Añadir nota de crédito a la factura rastreada
            if (invoice.CreditNotes == null)
            {
                invoice.CreditNotes = new List<Models.CreditNote>();
            }
            invoice.CreditNotes.Add(newCreditNote);

            // Recalcular y actualizar el estado de la factura
            decimal totalCreditNotesAmount = existingCreditNotesSum + newCreditNote.CreditNoteAmount;
            if (totalCreditNotesAmount >= invoice.TotalAmount)
            {
                invoice.Status = "Cancelled";
                invoice.PaymentStatus = "Paid"; // Si se cancela por NC, se considera pagada
            }
            else if (totalCreditNotesAmount > 0)
            {
                invoice.Status = "Partial";
            }
            else
            {
                invoice.Status = "Issued";
            }

            // Guardar los cambios en la factura y la nueva nota de crédito
            await _invoiceRepository.SaveChangesAsync();

            // Preparar resultado exitoso
            result.Success = true;
            result.NewInvoiceStatus = invoice.Status;
            result.NewPaymentStatus = invoice.PaymentStatus;
            result.MaxAllowedAmount = pendingBalance - newCreditNote.CreditNoteAmount; // Nuevo saldo pendiente

            return result;
        }

        private string GenerateCreditNoteNumber(string invoiceNumber)
        {
            return $"NC-{invoiceNumber}-{DateTime.UtcNow:yyyyMMddHHmmss}";
        }
        /// <summary>
        /// Genera un reporte de facturas vencidas, considerando la fecha de vencimiento y el estado de pago.
        /// </summary>
        /// <returns>Una lista de facturas vencidas que no han sido pagadas completamente y cuya fecha de vencimiento ya ha pasado.</returns>
        public async Task<List<OverdueInvoiceReportDto>> GetOverdueInvoicesReportAsync()
        {
            var invoices = await _invoiceRepository.GetOverdueInvoicesWithoutCreditNotesAsync();
            return invoices.Select(i => new OverdueInvoiceReportDto
            {
                InvoiceNumber = i.InvoiceNumber,
                CustomerName = i.CustomerName,
                TotalAmount = i.TotalAmount,
                DueDate = i.DueDate,
                DaysOverdue = (int)(DateTime.UtcNow - i.DueDate).TotalDays
            }).ToList();
        }
        /// <summary>
        /// Genera un resumen estadístico del estado de pago de todas las facturas.
        /// </summary>
        /// <returns>
        /// Un objeto que contiene el número total de facturas
        /// y un desglose por estado de pago con porcentajes.
        /// </returns>
        public async Task<PaymentStatusReportDto> GetPaymentStatusSummaryReportAsync()
        {
            var invoices = await _invoiceRepository.GetAllConsistentInvoicesAsync();
            var totalInvoices = invoices.Count;

            var summaries = invoices.GroupBy(i => i.PaymentStatus)
                .Select(g => new PaymentStatusSummaryDto
                {
                    Status = g.Key,
                    TotalCount = g.Count(),
                    Percentage = totalInvoices > 0 ? (decimal)g.Count() / totalInvoices * 100 : 0
                })
                .ToList();

            return new PaymentStatusReportDto
            {
                TotalInvoices = totalInvoices,
                Summaries = summaries
            };
        }
        /// <summary>
        /// Genera un reporte de facturas inconsistentes donde el subtotal calculado no coincide con el total declarado.
        /// </summary>
        /// <returns>Una lista de facturas con discrepancias en los montos.</returns>
        /// <remarks>
        /// Las inconsistencias pueden deberse a errores en el detalle de los ítems, totales mal calculados, o datos mal ingresados.
        /// </remarks>
        public async Task<List<InconsistentInvoiceReportDto>> GetInconsistentInvoicesReportAsync()
        {
            var invoices = await _invoiceRepository.GetInconsistentInvoicesAsync();
            return invoices.Select(i => new InconsistentInvoiceReportDto
            {
                InvoiceNumber = i.InvoiceNumber,
                DeclaredTotalAmount = i.TotalAmount,
                CalculatedSubtotalSum = i.Items.Sum(item => item.Subtotal), // Asumiendo que Items está cargado
                DiscrepancyDetails = $"Declarado: {i.TotalAmount}, Calculado: {i.Items.Sum(item => item.Subtotal)}"
            }).ToList();
        }
    }
}