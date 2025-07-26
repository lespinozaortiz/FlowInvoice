import { useState, useRef } from "react";
import { importInvoices } from "../services/api";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Tooltip
} from "@mui/material";
import { 
  CloudUpload as UploadIcon, 
  Description as FileIcon, 
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";

/**
 * Componente para importar facturas desde un archivo JSON.
 * 
 * Funcionalidades principales:
 * - Permite seleccionar un archivo JSON local
 * - Valida la estructura básica del JSON
 * - Envía los datos al backend para procesamiento
 * - Muestra estadísticas de importación (éxitos, duplicados, errores)
 * - Proporciona detalles expandibles de errores
 * - Ofrece feedback visual durante todo el proceso
 * 
 * @component
 * @example
 * <ImportInvoices />
 */
export default function ImportInvoices() {
  // Estado para almacenar el contenido del archivo JSON parseado
  const [fileContent, setFileContent] = useState(null);
  
  // Estado para almacenar el nombre del archivo seleccionado
  const [fileName, setFileName] = useState("");
  
  // Estado para controlar la visualización del spinner de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para almacenar el resultado de la importación desde el backend
  const [result, setResult] = useState(null);
  
  // Estado para almacenar mensajes de error
  const [error, setError] = useState(null);
  
  // Estado para controlar la expansión de la sección de errores duplicados
  const [openDuplicateErrors, setOpenDuplicateErrors] = useState(false);
  
  // Estado para controlar la expansión de la sección de errores inconsistentes
  const [openInconsistentErrors, setOpenInconsistentErrors] = useState(false);
  
  // Referencia al input de archivo para manipulación directa
  const fileInputRef = useRef(null);

  /**
   * Maneja la selección de archivos:
   * 1. Resetea estados previos
   * 2. Valida la existencia del archivo
   * 3. Lee el contenido como texto
   * 4. Intenta parsear a JSON
   * 
   * @param {Object} e - Evento de cambio del input file
   */
  const handleFileChange = (e) => {
    setResult(null);
    setError(null);
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        setFileContent(json);
      } catch {
        setError("Archivo JSON inválido");
        setFileContent(null);
      }
    };
    reader.readAsText(file);
  };

  /**
   * Gestiona el proceso de importación:
   * 1. Valida que exista contenido para importar
   * 2. Inicia estado de carga
   * 3. Envía datos al backend
   * 4. Maneja respuestas exitosas/errores
   * 5. Actualiza el estado con resultados
   */
  const handleImport = async () => {
    if (!fileContent) {
      setError("Debes seleccionar un archivo JSON válido");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await importInvoices(fileContent);
      setResult(response.data);
    } catch (e) {
      setError(
        "Error importando facturas: " +
          (e.response?.data?.message || e.message || "Error desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetea completamente el estado de importación:
   * 1. Limpia contenido y nombre de archivo
   * 2. Elimina resultados y errores
   * 3. Cierra secciones expandibles
   * 4. Resetea el input de archivo
   */
  const handleRemoveFile = () => {
    setFileContent(null);
    setFileName("");
    setResult(null);
    setError(null);
    setOpenDuplicateErrors(false);
    setOpenInconsistentErrors(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 3,
        background: 'linear-gradient(to bottom, #f5f7fa, #e3e8f0)'
      }}>
        {/* Cabecera con ícono y título */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <UploadIcon sx={{ 
            fontSize: 60, 
            color: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            borderRadius: '50%',
            p: 1.5,
            mb: 2
          }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Importar Facturas
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Sube un archivo JSON para importar facturas al sistema
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {/* Área de arrastrar/soltar archivo */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ 
              p: 3, 
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.03)',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.06)',
                transform: 'translateY(-2px)'
              }
            }}>
              {/* Input de archivo oculto con referencia */}
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                id="file-upload"
                ref={fileInputRef}
                style={{ 
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              
              <label htmlFor="file-upload">
                <Button 
                  variant="contained" 
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Seleccionar archivo
                </Button>
              </label>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Formato aceptado: JSON
              </Typography>
              
              {/* Preview de archivo seleccionado */}
              {fileName && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 1,
                  p: 1.5,
                  mt: 2,
                  maxWidth: 400,
                  mx: 'auto'
                }}>
                  <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1" noWrap sx={{ flexGrow: 1, textAlign: 'left' }}>
                    {fileName}
                  </Typography>
                  <Tooltip title="Quitar archivo">
                    <IconButton onClick={handleRemoveFile}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Botón de acción principal */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={loading || !fileContent}
              size="large"
              sx={{ 
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Importar Facturas"}
            </Button>
          </Grid>
        </Grid>

        {/* Área de resultados y errores */}
        <Box sx={{ mt: 4 }}>
          {/* Mensaje de error */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {error}
              </Typography>
            </Alert>
          )}

          {/* Panel de resultados exitosos */}
          {result && (
            <Paper elevation={0} sx={{ 
              border: '1px solid',
              borderColor: 'success.light',
              borderRadius: 2,
              backgroundColor: 'rgba(46, 125, 50, 0.05)',
              p: 3
            }}>
              <Alert 
                severity="success" 
                icon={false}
                sx={{ 
                  backgroundColor: 'transparent',
                  p: 0,
                  mb: 2,
                  color: 'success.dark',
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                ¡Importación completada con éxito!
              </Alert>
              
              {/* Grid de estadísticas */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(46, 125, 50, 0.08)'
                  }}>
                    <Typography variant="h5" fontWeight={700} color="success.dark">
                      {result.totalInvoicesProcessed}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Facturas procesadas
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(46, 125, 50, 0.08)'
                  }}>
                    <Typography variant="h5" fontWeight={700} color="success.dark">
                      {result.invoicesImportedSuccessfully}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Importadas correctamente
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 152, 0, 0.08)'
                  }}>
                    <Typography variant="h5" fontWeight={700} color="warning.dark">
                      {result.invoicesSkippedDueToDuplicate}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Duplicadas omitidas
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                  }}>
                    <Typography variant="h5" fontWeight={700} color="error.dark">
                      {result.invoicesMarkedInconsistent}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Inconsistentes
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              {/* Sección expandible de errores duplicados */}
              {result.duplicateErrors && result.duplicateErrors.length > 0 && (
                <Paper sx={{ mt: 3, mb: 2, borderRadius: 2 }}>
                  <Button
                    fullWidth
                    onClick={() => setOpenDuplicateErrors(!openDuplicateErrors)}
                    endIcon={openDuplicateErrors ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{
                      textAlign: 'left',
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.15)'
                      }
                    }}
                  >
                    <Typography variant="subtitle1" color="warning.dark" fontWeight={500}>
                      Errores de Duplicados ({result.duplicateErrors.length})
                    </Typography>
                  </Button>
                  
                  <Collapse in={openDuplicateErrors}>
                    <Divider />
                    <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {result.duplicateErrors.map((err, index) => (
                        <ListItem key={index} sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <ListItemText 
                            primary={err} 
                            primaryTypographyProps={{ color: 'warning.dark', variant: 'body2' }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Paper>
              )}
              
              {/* Sección expandible de errores inconsistentes */}
              {result.inconsistentErrors && result.inconsistentErrors.length > 0 && (
                <Paper sx={{ mt: 2, borderRadius: 2 }}>
                  <Button
                    fullWidth
                    onClick={() => setOpenInconsistentErrors(!openInconsistentErrors)}
                    endIcon={openInconsistentErrors ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{
                      textAlign: 'left',
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.15)'
                      }
                    }}
                  >
                    <Typography variant="subtitle1" color="error.dark" fontWeight={500}>
                      Errores de Inconsistencia ({result.inconsistentErrors.length})
                    </Typography>
                  </Button>
                  
                  <Collapse in={openInconsistentErrors}>
                    <Divider />
                    <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {result.inconsistentErrors.map((err, index) => (
                        <ListItem key={index} sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <ListItemText 
                            primary={err} 
                            primaryTypographyProps={{ color: 'error.dark', variant: 'body2' }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Paper>
              )}
            </Paper>
          )}
        </Box>
      </Paper>
    </Container>
  );
}