import axios from "axios";

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  API_BASE_URL = window.location.protocol === "https:"
    ? "https://localhost:7153/api"
    : "http://localhost:5000/api";
}

const api = axios.create({
  baseURL: API_BASE_URL,
  // headers del backend.
});

// Funciones de la API
export const importInvoices = (data) => api.post("/import/json", data);
export const getInvoices = (filters) => api.get("/Invoices", { params: filters });
export const getInvoiceDetails = (invoiceNumber) => api.get(`/Invoices/${invoiceNumber}`);
export const addCreditNote = (invoiceNumber, data) => api.post(`/Invoices/${invoiceNumber}/credit-note`, data);

export const getOverdueInvoicesReport = () => api.get('/Invoices/reports/overdue-without-creditnotes');
export const getPaymentStatusSummaryReport = () => api.get('/Invoices/reports/payment-status-summary');
export const getInconsistentInvoicesReport = () => api.get('/Invoices/reports/inconsistent-invoices');
