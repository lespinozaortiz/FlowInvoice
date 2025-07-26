using FlowInvoice.Models;
using Microsoft.EntityFrameworkCore;

namespace FlowInvoice.Data
{
    /// <summary>
    /// Representa el contexto de base de datos para la aplicación FlowInvoice
    /// Define los DbSet y las relaciones entre entidades
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Constructor del contexto que recibe opciones desde la configuración de la app.
        /// </summary>
        /// <param name="options">Opciones de configuración para el contexto</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        /// <summary>
        /// Conjunto de facturas registradas en el sistema.
        /// </summary>
        public DbSet<Invoice> Invoices { get; set; }
        /// <summary>
        /// Conjunto de ítems asociados a facturas.
        /// </summary>
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        /// <summary>
        /// Conjunto de notas de crédito emitidas.
        /// </summary>
        public DbSet<CreditNote> CreditNotes { get; set; }
        /// <summary>
        /// Conjunto de errores ocurridos durante la importación de datos.
        /// </summary>
        public DbSet<ImportError> ImportErrors { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Config para Invoice Number como único
            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.InvoiceNumber)
                .IsUnique();

            // Config para relación uno a muchos entre Invoice y InvoiceItem
            modelBuilder.Entity<InvoiceItem>()
                .HasOne(ii => ii.Invoice)
                .WithMany(i => i.Items)
                .HasForeignKey(ii => ii.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade); // Eliminar items al eliminar factura

            //Config para relación uno a muchos entre Invoice y CreditNote
            modelBuilder.Entity<CreditNote>()
                .HasOne(cn => cn.Invoice)
                .WithMany(i => i.CreditNotes)
                .HasForeignKey(cn => cn.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade); // Eliminar notas de crédito al eliminar factura
        }
    }

}

