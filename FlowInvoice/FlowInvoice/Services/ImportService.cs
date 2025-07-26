using FlowInvoice.DTOs;
using FlowInvoice.Models;
using FlowInvoice.Repositories;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FlowInvoice.Services
{
    /// <summary>
    /// Servicio responsable de importar facturas desde un DTO,
    /// gestionando la validación de duplicados e inconsistencias.
    /// </summary>
    public class ImportService : IImportService
    {
        private readonly IInvoiceRepository _invoiceRepository;
        /// <summary>
        /// Inicializa una nueva instancia.
        /// </summary>
        /// <param name="invoiceRepository">Repositorio para operaciones con facturas.</param>
        public ImportService(IInvoiceRepository invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }
        /// <summary>
        /// Importa facturas desde un objeto DTO, validando duplicados e inconsistencias, y registra los errores en la base de datos.
        /// </summary>
        /// <param name="rootDto">DTO contenedor con la lista de facturas a importar.</param>
        /// <returns></returns>
        public async Task<ImportResult> ImportInvoicesFromDtoAsync(RootImportDto rootDto)
        {
            var result = new ImportResult { Message = "Proceso de importación iniciado." };

            if (rootDto?.Invoices == null || !rootDto.Invoices.Any())
            {
                result.Message = "El DTO recibido es nulo, inválido o no contiene facturas.";
                return result;
            }

            result.TotalInvoicesProcessed = rootDto.Invoices.Count;
            var invoicesToProcess = new List<Invoice>();
            var processedInvoiceNumbers = new HashSet<string>();

            foreach (var invoiceDto in rootDto.Invoices)
            {
                string currentInvoiceNumber = invoiceDto.InvoiceNumber.ToString();

                // Verifica si la factura ya existe en la base de datos.
                if (await _invoiceRepository.InvoiceExistsAsync(currentInvoiceNumber))
                {
                    await HandleDuplicateInvoice(result, invoiceDto);
                    continue;
                }

                // Verifica duplicados dentro del mismo lote de importación.
                if (processedInvoiceNumbers.Contains(currentInvoiceNumber))
                {
                    await HandleDuplicateInvoice(result, invoiceDto);
                    continue;
                }

                processedInvoiceNumbers.Add(currentInvoiceNumber);

                var invoice = MapToInvoice(invoiceDto);
                CalculateInvoiceStatus(invoice, invoiceDto);

                if (!invoice.IsConsistent)
                {
                    await HandleInconsistentInvoice(result, invoice, invoiceDto);
                    invoicesToProcess.Add(invoice); // Añadir inconsistentes para reporte
                }
                else
                {
                    result.InvoicesImportedSuccessfully++; // Contar solo consistentes importadas.
                    invoicesToProcess.Add(invoice); 
                }
            }

            if (invoicesToProcess.Any())
            {
                await _invoiceRepository.AddRangeAsync(invoicesToProcess);
            }

            await _invoiceRepository.SaveChangesAsync();

            result.Message = $"Proceso de importación finalizado. Total procesadas: {result.TotalInvoicesProcessed}, " +
                             $"Importadas correctamente: {result.InvoicesImportedSuccessfully}, " +
                             $"Duplicadas omitidas: {result.InvoicesSkippedDueToDuplicate}, " +
                             $"Inconsistentes: {result.InvoicesMarkedInconsistent}.";

            return result;
        }

        /// <summary>
        /// Maneja el registro de facturas duplicadas durante la importación.
        /// </summary>
        /// <param name="result">Objeto donde se almacena el resumen de la importación.</param>
        /// <param name="invoiceDto">DTO de la factura duplicada.</param>
        /// <returns></returns>
        private async Task HandleDuplicateInvoice(ImportResult result, InvoiceImportDto invoiceDto)
        {
            result.InvoicesSkippedDueToDuplicate++;
            await _invoiceRepository.AddImportErrorAsync(new ImportError
            {
                ErrorType = "DuplicateInvoiceNumber",
                Details = $"Factura con número {invoiceDto.InvoiceNumber} ya existe. JSON: {JsonSerializer.Serialize(invoiceDto)}"
            });
            result.DuplicateErrors.Add($"Factura con número {invoiceDto.InvoiceNumber} ya existe.");
        }
        /// <summary>
        /// Maneja el registro de facturas inconsistentes durante la importación.
        /// </summary>
        /// <param name="result">Objeto donde almacena el resumen de la importación.</param>
        /// <param name="invoice">Entidad factura con inconsistencia detectada.</param>
        /// <param name="invoiceDto">DTO original de factura para detalles.</param>
        /// <returns></returns>
        private async Task HandleInconsistentInvoice(ImportResult result, Invoice invoice, InvoiceImportDto invoiceDto)
        {
            result.InvoicesMarkedInconsistent++;
            await _invoiceRepository.AddImportErrorAsync(new ImportError
            {
                ErrorType = "InconsistentAmount",
                Details = $"Factura {invoice.InvoiceNumber}: El monto total no coincide con la suma de los subtotales. JSON: {JsonSerializer.Serialize(invoiceDto)}"
            });
            result.InconsistentErrors.Add($"Factura {invoice.InvoiceNumber}: El monto total no coincide con la suma de los subtotales.");
        }
        /// <summary>
        /// Mapea un DTO de factura importada a la entidad
        /// </summary>
        /// <param name="dto">DTO con la información de factura.</param>
        /// <returns>Entidad factura mapeada.</returns>
        private Invoice MapToInvoice(InvoiceImportDto dto)
        {
            var invoice = new Invoice
            {
                InvoiceNumber = dto.InvoiceNumber.ToString(),
                InvoiceDate = dto.InvoiceDate,
                DueDate = dto.PaymentDueDate,
                TotalAmount = dto.TotalAmount,
                CustomerRun = dto.Customer.CustomerRun,
                CustomerName = dto.Customer.CustomerName,
                CustomerEmail = dto.Customer.CustomerEmail,
                PaymentMethod = dto.InvoicePayment?.PaymentMethod,
                PaymentDate = dto.InvoicePayment?.PaymentDate,
                Items = dto.InvoiceDetails.Select(id => new InvoiceItem
                {
                    ProductName = id.ProductName,
                    Quantity = id.Quantity,
                    UnitPrice = id.UnitPrice,
                    Subtotal = id.Subtotal
                }).ToList(),
                CreditNotes = dto.InvoiceCreditNotes.Select(icn => new CreditNote
                {
                    CreditNoteNumber = icn.CreditNoteNumber.ToString(),
                    CreditNoteAmount = icn.CreditNoteAmount,
                    CreatedDate = icn.CreditNoteDate
                }).ToList()
            };
            return invoice;
        }
        /// <summary>
        /// Calcula y asigna el estado de consistencia, estado de factura y estado de pago.
        /// </summary>
        /// <param name="invoice">Entidad factura a actualizar.</param>
        /// <param name="dto">DTO con datos para la validación</param>
        private void CalculateInvoiceStatus(Invoice invoice, InvoiceImportDto dto)
        {
            // 1. Validar consistencia de montos
            decimal calculatedSubtotalSum = dto.InvoiceDetails.Sum(id => id.Subtotal);
            invoice.IsConsistent = (calculatedSubtotalSum == dto.TotalAmount);

            // 2. Determinar estado de la factura (Issued, Partial, Cancelled)
            decimal totalCreditNotesAmount = dto.InvoiceCreditNotes?.Sum(icn => icn.CreditNoteAmount) ?? 0;
            if (totalCreditNotesAmount == 0)
            {
                invoice.Status = "Issued";
            }
            else if (totalCreditNotesAmount >= invoice.TotalAmount)
            {
                invoice.Status = "Cancelled";
            }
            else
            {
                invoice.Status = "Partial";
            }

            // 3. Determinar estado del pago (Pending, Overdue, Paid)
            decimal outstandingBalance = invoice.TotalAmount - totalCreditNotesAmount;

            if (outstandingBalance <= 0)
            {
                invoice.PaymentStatus = "Paid";
            }
            else if (invoice.PaymentDate.HasValue) 
            {
                invoice.PaymentStatus = "Paid";
            }
            else
            {
                invoice.PaymentStatus = (invoice.DueDate.Date < DateTime.UtcNow.Date) ? "Overdue" : "Pending";
            }
        }
    }
}
