using FlowInvoice.Data;
using FlowInvoice.DTOs;
using FlowInvoice.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlowInvoice.Repositories
{
    /// <summary>
    /// Implementación de Interfaz IInvoiceRepository usando EF Core.
    /// </summary>
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ApplicationDbContext _context;
        /// <summary>
        /// Inicializa una nueva instancia del repositorio de facturas.
        /// </summary>
        /// <param name="context">Contexto de base de datos.</param>
        public InvoiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddInvoiceAsync(Invoice invoice)
        {
            await _context.Invoices.AddAsync(invoice);
        }

        public async Task AddRangeAsync(IEnumerable<Invoice> invoices)
        {
            await _context.Invoices.AddRangeAsync(invoices);
        }

        public async Task<bool> InvoiceExistsAsync(string invoiceNumber)
        {
            return await _context.Invoices.AnyAsync(i => i.InvoiceNumber == invoiceNumber);
        }

        public async Task AddImportErrorAsync(ImportError error)
        {
            await _context.ImportErrors.AddAsync(error);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Invoice?> GetInvoiceByNumberAsync(string invoiceNumber)
        {
            return await _context.Invoices
                .Include(i => i.Items)
                .Include(i => i.CreditNotes)
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.InvoiceNumber == invoiceNumber);
        }

        public async Task<List<InvoiceListDto>> GetFilteredInvoicesAsync(
            string? invoiceNumber = null,
            string? status = null,
            string? paymentStatus = null)
        {
            var query = _context.Invoices
                .Where(i => i.IsConsistent)
                .AsQueryable();

            // Filtros combinados con condiciones
            if (!string.IsNullOrEmpty(invoiceNumber))
            {
                query = query.Where(i => i.InvoiceNumber.Contains(invoiceNumber));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            if (!string.IsNullOrEmpty(paymentStatus))
            {
                query = query.Where(i => i.PaymentStatus == paymentStatus);
            }

            return await query
                .Select(i => new InvoiceListDto
                {
                    InvoiceNumber = i.InvoiceNumber,
                    CustomerName = i.CustomerName,
                    TotalAmount = i.TotalAmount,
                    Status = i.Status,
                    PaymentStatus = i.PaymentStatus
                })
                .AsNoTracking() 
                .ToListAsync();
        }

        public async Task<Invoice?> GetInvoiceByNumberForUpdateAsync(string invoiceNumber)
        {
            return await _context.Invoices
                .Include(i => i.CreditNotes)
                .FirstOrDefaultAsync(i => i.InvoiceNumber == invoiceNumber);
        }
        /// <summary>
        /// Obtiene todas las facturas vencidas, sin notas de crédito y consistentes.
        /// </summary>
        /// <returns></returns>
        public async Task<List<Invoice>> GetOverdueInvoicesWithoutCreditNotesAsync()
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
            return await _context.Invoices
                .Where(i => i.IsConsistent &&
                            i.PaymentStatus == "Overdue" &&
                            i.CreditNotes.Count == 0 &&
                            i.DueDate < thirtyDaysAgo)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Invoice>> GetAllConsistentInvoicesAsync()
        {
            return await _context.Invoices
                .Where(i => i.IsConsistent)
                .AsNoTracking()
                .ToListAsync();
        }
        /// <summary>
        /// Obtiene facturas inconsistentes incluyendo sus items para el reporte.
        /// </summary>
        /// <returns></returns>
        public async Task<List<Invoice>> GetInconsistentInvoicesAsync()
        {
            return await _context.Invoices
                .Include(i => i.Items) // Se incluye los ítems para calcular la suma de subtotales
                .Where(i => !i.IsConsistent)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}




