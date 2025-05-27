
The outline of the project architecture of this Django-React project based on our work together.

The project follows a common **client-server architecture**, also often referred to as a **three-tier architecture** (Presentation, Application, Data) when considering the database.

Here's a breakdown:

1.  **Frontend (Client-Side / Presentation Tier):**
    *   **Technology:** React (using Vite for the build tool).
    *   **UI Library:** Material-UI (MUI) for pre-built components and styling.
    *   **HTTP Client:** Axios for making API requests to the backend.
    *   **Form Handling:** `react-hook-form` for managing form state and `yup` for validation.
    *   **Date Handling:** `date-fns` library with `@mui/x-date-pickers` for date input fields.
    *   **Responsibilities:**
        *   Rendering the user interface (e.g., `ProjectTable`, `ProjectForm` modal).
        *   Handling user interactions (button clicks, form submissions).
        *   Fetching data from and sending data to the backend API.
        *   Displaying data and feedback (loading states, error/success messages).
    *   **Location:** `frontend/` directory.

2.  **Backend (Server-Side / Application Tier):**
    *   **Technology:** Django (a Python web framework).
    *   **API Framework:** Django REST Framework (DRF) for building RESTful APIs.
    *   **Responsibilities:**
        *   Defining data models (`ProjectManager`, `Employees`, `Project`).
        *   Handling business logic.
        *   Providing API endpoints for CRUD (Create, Read, Update, Delete) operations on the models.
        *   Serializing data (converting model instances to JSON and vice-versa).
        *   Authentication and authorization (though not explicitly implemented in detail yet, DRF provides mechanisms).
        *   Serving API requests from the frontend.
    *   **Key Components:**
        *   `models.py`: Defines the database schema.
        *   `serializers.py`: Defines how model data is converted to/from JSON.
        *   `views.py`: Contains the logic for handling API requests (using DRF's generic views).
        *   `urls.py`: Maps URL patterns to views.
        *   `settings.py`: Django project configuration.
    *   **Location:** `backend/` directory.

3.  **Database (Data Tier):**
    *   **Technology:** SQLite (currently used for development).
    *   **Responsibilities:** Persistently storing the application's data (project managers, employees, projects).
    *   **Interaction:** The Django backend interacts with the database through Django's Object-Relational Mapper (ORM).
    *   **Location:** `backend/db.sqlite3` (by default).

4.  **Web Server & Deployment (Conceptual, based on our discussion):**
    *   While not fully implemented and running in a production environment yet, we've discussed a typical deployment setup:
        *   **WSGI Server (e.g., Gunicorn):** To run the Python/Django application. It acts as an interface between the web server and the Django application.
        *   **Web Server/Reverse Proxy (e.g., Nginx):**
            *   Handles incoming HTTP requests from the internet.
            *   Serves static files (CSS, JavaScript, images) directly for better performance.
            *   Forwards dynamic requests (API calls) to the Gunicorn/Django application.
            *   Can handle SSL termination, load balancing (if needed), and other tasks.
        *   **Process Manager (e.g., Supervisor):** To ensure the Gunicorn process (and thereby the Django app) is always running, restarting it if it crashes.
    *   **Static Files:** Django's `STATIC_ROOT` setting is configured for collecting static files, which Nginx would then serve in a production environment. `whitenoise` was also discussed as an option for simpler static file serving directly from Django/Gunicorn, especially in PaaS environments.

**Interaction Flow:**

1.  The **User** interacts with the **React Frontend** in their web browser.
2.  The Frontend (using Axios) sends HTTP requests (e.g., GET, POST, PUT, DELETE) to specific API endpoints on the **Django Backend**.
3.  The **Django Backend** receives these requests:
    *   DRF routes the request to the appropriate view.
    *   The view uses serializers to validate and process incoming data or to prepare data for the response.
    *   The view interacts with the models, which in turn query or update the **Database** via Django's ORM.
4.  The Django Backend sends an HTTP response (typically JSON) back to the Frontend.
5.  The Frontend receives the response, updates its state, and re-renders the UI to reflect any changes.

**Development vs. Production:**

*   **Development:**
    *   The React development server (Vite) serves the frontend (often on a port like `5173`).
    *   The Django development server (`manage.py runserver`) serves the backend API (often on port `8000`).
    *   `CORS_ALLOW_ALL_ORIGINS = True` is used in Django to allow requests from the React dev server.
    *   SQLite is used as the database.
*   **Production (as planned):**
    *   The React app is built into static assets (HTML, CSS, JS).
    *   Nginx serves these static frontend assets.
    *   Nginx also acts as a reverse proxy, forwarding API requests to Gunicorn.
    *   Gunicorn runs the Django application.
    *   A more robust database (e.g., PostgreSQL, MySQL) would typically be used instead of SQLite.
    *   `DEBUG` would be `False`, `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` would be configured specifically.

This architecture separates concerns effectively: the frontend handles the user interface and experience, while the backend manages data and business logic. This makes the application more scalable, maintainable, and allows different teams to potentially work on the frontend and backend independently.
