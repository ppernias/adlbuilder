# ADL Builder

Aplicación web para la creación y edición de asistentes de lenguaje definidos en archivos YAML, con autenticación de usuarios y validación contra esquemas.

## Estructura del Proyecto

El proyecto ha sido reorganizado en una estructura modular para mejorar la mantenibilidad:

```
/app
  ├── __init__.py             # Inicialización del paquete
  ├── main.py                 # Punto de entrada principal de la aplicación
  ├── models/                 # Modelos de datos Pydantic
  │   ├── __init__.py
  │   ├── user.py             # Modelos para usuarios
  │   └── yaml_file.py        # Modelos para archivos YAML
  ├── auth/                   # Autenticación y gestión de usuarios
  │   ├── __init__.py
  │   ├── security.py         # Funciones de seguridad (JWT, hashing)
  │   ├── user_db.py          # Operaciones de BD para usuarios
  │   └── file_ownership.py   # Gestión de propiedad de archivos
  ├── routers/                # Endpoints de la API
  │   ├── __init__.py
  │   ├── auth.py             # Endpoints de autenticación
  │   ├── admin.py            # Endpoints de administración
  │   ├── yaml_files.py       # Endpoints para gestión de archivos YAML
  │   └── schema.py           # Endpoints para esquemas
  ├── utils/                  # Utilidades
  │   ├── __init__.py
  │   ├── yaml_validator.py   # Validación de YAML
  │   └── schema_processor.py # Procesamiento de esquemas
  └── db/                     # Operaciones de base de datos
      ├── __init__.py
      └── history_db.py       # Historial de operaciones
```

## Características

### Backend
- **Autenticación de Usuarios**: Registro, inicio de sesión y gestión de usuarios con JWT
- **Roles de Usuario**: Administrador, editor y visualizador
- **Validación de YAML**: Validación contra esquema con retroalimentación detallada
- **Gestión de Archivos**: Guardar, cargar, eliminar y buscar archivos YAML
- **Historial**: Seguimiento de cambios en archivos
- **API RESTful**: Endpoints bien organizados con FastAPI

### Frontend
- **Interfaz Responsive**: Diseño adaptable a diferentes dispositivos
- **Tema Personalizable**: Paleta de colores moka fácilmente modificable mediante CSS
- **Editor de Asistentes**: Modos simple y avanzado para edición de archivos YAML
- **Dashboard de Usuario**: Gestión de asistentes creados
- **Validación en Tiempo Real**: Feedback inmediato sobre la validez del YAML

## Requisitos

### Backend
- Python 3.8+
- FastAPI
- Uvicorn
- SQLite
- Otras dependencias en requirements.txt

### Frontend
- Node.js 16+
- React con TypeScript
- Bootstrap para estilos
- React Router para navegación

## Instalación

### Backend
1. Clonar el repositorio
2. Crear un entorno virtual: `python -m venv venv`
3. Activar el entorno virtual: `source venv/bin/activate` (Linux/Mac) o `venv\Scripts\activate` (Windows)
4. Instalar dependencias: `pip install -r requirements.txt`

### Frontend
1. Navegar al directorio del frontend: `cd frontend`
2. Instalar dependencias: `npm install`
3. Compilar para producción: `npm run build` o iniciar en modo desarrollo: `npm run dev`

## Ejecución

### Backend
```bash
# Asegúrate de detener cualquier instancia previa del servidor
pkill -f uvicorn

# Iniciar el servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
# Modo desarrollo
npm run dev

# O para construir y servir la versión de producción
npm run build
npm run preview
```

## Documentación de la API

La documentación interactiva está disponible en:
- Swagger UI: `/docs`
- ReDoc: `/redoc`

## Endpoints Principales

### Autenticación
- `POST /register`: Registrar un nuevo usuario
- `POST /token`: Obtener token de acceso
- `GET /users/me`: Obtener información del usuario actual
- `PUT /users/me`: Actualizar información del usuario actual
- `POST /users/me/change-password`: Cambiar contraseña

### Administración (solo admin)
- `GET /admin/users`: Listar todos los usuarios
- `GET /admin/users/{user_id}`: Obtener usuario específico
- `PUT /admin/users/{user_id}`: Actualizar usuario
- `DELETE /admin/users/{user_id}`: Eliminar usuario
- `GET /admin/users/{user_email}/files`: Listar archivos de un usuario

### Archivos YAML
- `GET /yaml-files`: Listar archivos YAML del usuario
- `GET /yaml-files/{filename}`: Obtener archivo YAML
- `POST /yaml-files/{filename}`: Guardar archivo YAML
- `DELETE /yaml-files/{filename}`: Eliminar archivo YAML
- `POST /validate-yaml`: Validar contenido YAML

### Historial
- `GET /history`: Obtener historial de operaciones
- `GET /history/{history_id}`: Obtener detalle de historial

### Esquema
- `GET /schema`: Obtener esquema para formularios
- `GET /schema/fields-list`: Obtener lista plana de campos
