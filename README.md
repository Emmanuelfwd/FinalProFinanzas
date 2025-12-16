# FinalProFinanzas

## Descripción general

**FinalProFinanzas** es una aplicación web de gestión financiera personal desarrollada como proyecto académico–práctico. La plataforma permite a los usuarios registrar ingresos y egresos, visualizar su comportamiento financiero mediante dashboards interactivos y generar reportes en PDF. El objetivo principal es apoyar la toma de decisiones financieras personales a través de información clara, estructurada y visual.

El sistema está construido bajo una arquitectura **cliente–servidor**, separando claramente el frontend y el backend, e implementa principios de desarrollo modular, reutilización de componentes y consumo de APIs REST.

---

## Funcionalidades principales

* Autenticación de usuarios (login y registro).
* Gestión de movimientos financieros (ingresos y gastos).
* Categorización de transacciones.
* Dashboard con indicadores y gráficos estadísticos.
* Visualización de históricos financieros.
* Exportación de reportes a PDF.
* Persistencia de datos en base de datos relacional.

---

## Arquitectura del proyecto

El repositorio se divide en dos grandes módulos:

### 1. Frontend

Aplicación SPA encargada de la interfaz de usuario y la experiencia visual.

* Consumo de servicios REST del backend.
* Manejo de estado en el cliente.
* Navegación mediante rutas protegidas.
* Dashboards con gráficos dinámicos.

### 2. Backend

API REST responsable de la lógica de negocio, autenticación y persistencia de datos.

* Exposición de endpoints seguros.
* Validación y serialización de datos.
* Gestión de usuarios y movimientos financieros.

---

## Tecnologías utilizadas

### Frontend

* **React.js** – Biblioteca principal para la construcción de la interfaz.
* **Vite** – Herramienta de desarrollo y empaquetado.
* **JavaScript (ES6+)** – Lenguaje base del frontend.
* **React Router DOM** – Manejo de rutas y navegación.
* **Bootstrap 5** – Estilos y diseño responsivo.
* **CSS3** – Estilos personalizados.
* **Recharts** – Visualización de datos mediante gráficos.
* **jsPDF** – Generación de reportes en formato PDF.
* **LocalStorage** – Persistencia ligera de sesión en el cliente.

### Backend

* **Python 3** – Lenguaje base del servidor.
* **Django** – Framework principal del backend.
* **Django REST Framework (DRF)** – Construcción de la API REST.
* **JWT (JSON Web Tokens)** – Autenticación y autorización.
* **SQLite / MySQL** – Base de datos relacional (según configuración).

### Herramientas y entorno

* **Git & GitHub** – Control de versiones y repositorio.
* **Visual Studio Code** – Entorno de desarrollo.
* **Postman** – Pruebas de endpoints REST.

---

## Estructura general del proyecto

```
FinalProFinanzas/
│
├── frontend/        # Aplicación React
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/         # API Django REST
│   ├── api/
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

---

## Instalación y ejecución (resumen)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Referencias

* React Documentation: [https://react.dev/](https://react.dev/)
* Vite Documentation: [https://vitejs.dev/](https://vitejs.dev/)
* Django Documentation: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
* Django REST Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
* Bootstrap 5: [https://getbootstrap.com/](https://getbootstrap.com/)
* Recharts: [https://recharts.org/](https://recharts.org/)
* jsPDF: [https://github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)
* JWT: [https://jwt.io/](https://jwt.io/)

---

## Autor

Proyecto desarrollado por **Emmanuel Ruiz Hurtado** como parte de un trabajo académico orientado a la aplicación práctica de conceptos de finanzas, desarrollo web y arquitectura de software.
