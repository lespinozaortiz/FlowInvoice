using FlowInvoice.DTOs;
using FlowInvoice.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FlowInvoice.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly ILogger<InvoicesController> _logger;

        public InvoicesController(
            IInvoiceService invoiceService,
            ILogger<InvoicesController> logger)
        {
            _invoiceService = invoiceService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene la lista de facturas filtradas por número de factura, estado o estado de pago.
        /// </summary>
        /// <param name="invoiceNumber">Número de factura para filtrar (opcional).</param>
        /// <param name="status">Estado de la factura para filtrar (opcional).</param>
        /// <param name="paymentStatus">Estado del pago para filtrar (opcional).</param>
        /// <returns>Lista de facturas que cumplen con los filtros aplicados.</returns>
        /// <response code="200">Devuelve la lista de facturas filtradas.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<InvoiceListDto>>> GetInvoices(
            [FromQuery] string? invoiceNumber,
            [FromQuery] string? status,
            [FromQuery] string? paymentStatus)
        {
            try
            {
                var invoices = await _invoiceService.GetFilteredInvoicesAsync(
                    NormalizeQueryParam(invoiceNumber),
                    NormalizeQueryParam(status),
                    NormalizeQueryParam(paymentStatus)
                );

                return Ok(invoices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener facturas");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        /// <summary>
        /// Obtiene el detalle completo de una factura específica por número.
        /// </summary>
        /// <param name="invoiceNumber">Número de la factura.</param>
        /// <returns>Detalle completo de la factura.</returns>
        /// <response code="200">Devuelve el detalle de la factura.</response>
        /// <response code="404">No se encontró la factura.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpGet("{invoiceNumber}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InvoiceDetailDto>> GetInvoiceDetails(string invoiceNumber)
        {
            try
            {
                var invoiceDetails = await _invoiceService.GetInvoiceDetailsByNumberAsync(invoiceNumber);

                if (invoiceDetails == null)
                {
                    return NotFound($"Factura con número {invoiceNumber} no encontrada.");
                }

                return Ok(invoiceDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener detalles de la factura {InvoiceNumber}", invoiceNumber);
                return StatusCode(500, "Error interno del servidor");
            }
        }

        /// <summary>
        /// Agrega una nota de crédito a una factura existente.
        /// </summary>
        /// <param name="invoiceNumber">Número de la factura.</param>
        /// <param name="creditNoteDto">Datos de la nota de crédito a agregar.</param>
        /// <returns>Resultado de la operación con estado actualizado y mensajes.</returns>
        /// <response code="200">Nota de crédito agregada exitosamente.</response>
        /// <response code="400">Error de validación o estado de la factura.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("{invoiceNumber}/credit-note")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AddCreditNoteResultDto>> AddCreditNote(
            string invoiceNumber,
            [FromBody] AddCreditNoteDto creditNoteDto)
        {
            try
            {
                var result = await _invoiceService.AddCreditNoteAsync(invoiceNumber, creditNoteDto);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agregar nota de crédito a la factura {InvoiceNumber}", invoiceNumber);
                return StatusCode(500, "Error interno del servidor");
            }
        }

        /// <summary>
        /// Obtiene el reporte de facturas vencidas sin notas de crédito.
        /// </summary>
        /// <returns>Lista de facturas vencidas sin notas de crédito.</returns>
        /// <response code="200">Reporte generado correctamente.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpGet("reports/overdue-without-creditnotes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<OverdueInvoiceReportDto>>> GetOverdueInvoicesReport()
        {
            try
            {
                var report = await _invoiceService.GetOverdueInvoicesReportAsync();
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el reporte de facturas vencidas sin notas de crédito.");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        /// <summary>
        /// Obtiene el reporte resumen de estados de pago de facturas.
        /// </summary>
        /// <returns>Resumen de estados de pago con totales y porcentajes.</returns>
        /// <response code="200">Reporte generado correctamente.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpGet("reports/payment-status-summary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PaymentStatusReportDto>> GetPaymentStatusSummaryReport()
        {
            try
            {
                var report = await _invoiceService.GetPaymentStatusSummaryReportAsync();
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el reporte de resumen de estados de pago.");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        /// <summary>
        /// Obtiene el reporte de facturas inconsistentes.
        /// </summary>
        /// <returns>Lista de facturas con inconsistencias detectadas.</returns>
        /// <response code="200">Reporte generado correctamente.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpGet("reports/inconsistent-invoices")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<InconsistentInvoiceReportDto>>> GetInconsistentInvoicesReport()
        {
            try
            {
                var report = await _invoiceService.GetInconsistentInvoicesReportAsync();
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el reporte de facturas inconsistentes.");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        /// <summary>
        /// Normaliza un parámetro de consulta eliminando espacios y convirtiendo strings vacíos a null.
        /// </summary>
        /// <param name="param">Parámetro a normalizar.</param>
        /// <returns>String normalizado o null si está vacío.</returns>
        private string? NormalizeQueryParam(string? param) =>
            string.IsNullOrWhiteSpace(param) ? null : param.Trim();
    }
}
