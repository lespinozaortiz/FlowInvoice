using FlowInvoice.DTOs;
using FlowInvoice.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FlowInvoice.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImportController : ControllerBase
    {
        private readonly IImportService _importService;

        public ImportController(IImportService importService)
        {
            _importService = importService;
        }

        /// <summary>
        /// Importa facturas desde un JSON con la estructura definida en RootImportDto.
        /// </summary>
        /// <param name="rootDto">DTO contenedor con la lista de facturas a importar.</param>
        /// <returns>Resultado del proceso de importación, incluyendo conteo de importadas, duplicadas e inconsistentes.</returns>
        /// <response code="200">Facturas importadas correctamente.</response>
        /// <response code="400">Contenido JSON inválido o no se importaron facturas exitosamente.</response>
        [HttpPost("json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ImportJson([FromBody] RootImportDto rootDto)
        {
            if (rootDto == null || rootDto.Invoices == null || rootDto.Invoices.Count == 0)
            {
                return BadRequest("El contenido JSON no es válido o está vacío.");
            }

            var result = await _importService.ImportInvoicesFromDtoAsync(rootDto);

            if (result.InvoicesImportedSuccessfully > 0)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
    }
}
