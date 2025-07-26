import { Box, Typography, Link, IconButton, Container, Stack } from "@mui/material";
import { GitHub, LinkedIn, Email } from "@mui/icons-material";

/**
 * Footer de la aplicación - versión para portafolio personal
 * Incluye:
 * - Nombre y año
 * - Íconos de redes sociales con enlaces reales
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#1a237e",
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2">
            © {currentYear} Leonardo Espinoza. Todos los derechos reservados.
          </Typography>

          <Box>
            <IconButton
              component="a"
              href="https://github.com/lespinozaortiz"
              target="_blank"
              rel="noopener"
              color="inherit"
              aria-label="GitHub"
            >
              <GitHub />
            </IconButton>

            <IconButton
              component="a"
              href="https://www.linkedin.com/in/leonardo-espinoza-ortiz-311229263/"
              target="_blank"
              rel="noopener"
              color="inherit"
              aria-label="LinkedIn"
            >
              <LinkedIn />
            </IconButton>

            <IconButton
              component="a"
              href="mailto:leonardo.espinoza.o@usach.cl"
              color="inherit"
              aria-label="Email"
            >
              <Email />
            </IconButton>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
