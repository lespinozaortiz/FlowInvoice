// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImportInvoices from "./pages/ImportInvoices";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetails from "./pages/InvoiceDetails";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";

/**
 * Componente principal de la aplicación FlowInvoice
 * 
 * FlowInvoice es un sistema de gestión de facturas que permite:
 * - Listar facturas existentes
 * - Importar nuevas facturas
 * - Ver detalles de facturas individuales
 * - Generar reportes financieros
 * 
 * La aplicación utiliza React Router para la navegación y Material-UI para la interfaz de usuario.
 */
export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Barra de navegación superior */}
      <Navbar />
      
      {/* Contenido principal */}
      <Container 
        component="main" 
        maxWidth="xl" 
        sx={{ 
          py: 4, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/import" element={<ImportInvoices />} />
          <Route path="/invoices/:invoiceNumber" element={<InvoiceDetails />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Container>
      
      {/* Pie de página */}
      <Footer />
    </Box>
  );
}