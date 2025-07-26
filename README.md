# FlowInvoice: Sistema de Gestión de Facturas

Proyecto técnico full-stack para la gestión eficiente de facturas, con importación desde JSON, gestión de notas de crédito, filtrado avanzado y generación de reportes.

---

## 📌 Descripción

FlowInvoice es una aplicación web construida con ASP.NET Core 8 en el backend y React (Vite + MUI) en el frontend.  
Permite importar, consultar, actualizar y generar reportes sobre facturas, facilitando la gestión financiera y administrativa.



---
## 🚀 Características principales

- Importación masiva de facturas desde archivos JSON  
- Filtro y búsqueda avanzada por número, fechas y estados  
- Gestión de notas de crédito asociadas a facturas  
- Reportes de facturas vencidas, estado de pagos y facturas inconsistentes  
- API REST documentada con Swagger  
- Base de datos SQLite reinicializable para pruebas y demos

---
## ⚙️ Tecnologías utilizadas

| Categoría           | Herramientas                                                                 |
|---------------------|-------------------------------------------------------------------------------|
| **Lenguajes**       | C#, JavaScript                                                            |
| **Backend**         | ASP.NET Core 8                                                                       |
| **Frontend**        | React (Vite + Material UI)                                                                       |
| **Bases de datos**  | SQLite                                                                         |
| **ORM** | Entity Framework Core                                                |
| **Documentación API**| Swagger                                                                          |
| **Infraestructura** | Docker, Docker Compose                                                        |
| **EDA y Feature Engineering** | Pandas, Numpy, Sweetviz, YData Profiling                            |
| **Control de versiones** | Git                                                         |
---
## 📄 Arquitectura y patrones de diseño.

Para el backend se implementó una arquitectura por capas que organiza el código de la siguiente manera:

- Models: Definición de entidades y modelos de dominio que representan la estructura principal de los datos.

- Data: Configuración y gestión del contexto de base de datos utilizando Entity Framework Core.

- Repositories: Implementación del patrón Repositorio para abstraer el acceso a datos, facilitando la mantenibilidad y permitiendo realizar pruebas unitarias.

- Services: Contienen la lógica de negocio y las reglas de la aplicación, actuando como intermediarios entre los repositorios y los controladores.

- Controllers: Exposición de la API REST, gestionando las solicitudes HTTP y utilizando DTOs (Data Transfer Objects) para definir claramente los datos que se envían y reciben, separando así las entidades internas de los modelos externos.
---
## 📂 Documentos presentes

- Casos de uso del sistema
- Historias de usuario del sistema
- Requisitos funcionales y no funcionales del sistema
- Modelo Entidad Relación del sistema
---
## 🛠️ Instalación y ejecución

### Requisitos

- Docker y Docker Compose  
- Git  
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) (solo para instalación local)  
- Node.js 20+ (solo para instalación local)  

---

### Ejecución con Docker (recomendado)
- Clonar repositorio
```bash
git clone https://github.com/lespinozaortiz/FlowInvoice.git
```
- Ir al directorio del proyecto donde se encuentra el archivo docker-compose
```bash
cd FlowInvoice
```
- Ejecutar el siguiente comando
```bash
docker-compose up --build
```
- Luego acceder en el navegador a:
- Frontend: http://localhost:5173
- Swagger UI: http://localhost:8080/swagger/index.html
---
### Ejecución local
- Clonar repositorio
```bash
git clone https://github.com/lespinozaortiz/FlowInvoice.git
```
-Dirigirse a la carpeta del backend donde está el archivo .csproj
```bash
cd FlowInvoice/FlowInvoice/FlowInvoice
```
- Ejecutar los siguientes comandos
```bash
dotnet restore
dotnet run
```
- El backend se ejecutará en http://localhost:5000/swagger/index.html
- Dirigirse a la carpeta del frontend
```bash
cd frontend-flowinvoice
```
- Ejecutar los siguientes comandos
```bash
npm install
npm run dev
```
- El frontend se ejecutará en http://localhost:5173
> Este software está licenciado bajo la licencia **MIT**.  
Ver el archivo [LICENSE](./LICENSE) para más detalles.

