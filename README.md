# ADL Builder

ADL Builder es una aplicación web para crear y editar asistentes de IA basados en archivos YAML siguiendo un esquema predefinido.

## Características

- Creación y edición de asistentes de IA en formato YAML
- Validación de esquema según definición en schema.yaml
- Integración con OpenAI API para mejorar campos
- Autenticación de usuarios con JWT
- Interfaz responsive con Bootstrap y Tailwind CSS

## Requisitos técnicos

- Python 3.8+
- Node.js 16+
- SQLite

## Instalación

```bash
# Clonar el repositorio
git clone [repo-url] adlbuilder
cd adlbuilder

# Instalar dependencias de Python
pip install -r requirements.txt

# Inicializar la base de datos
alembic upgrade head

# Ejecutar la aplicación
uvicorn app.main:app --reload
```

## Estructura del proyecto

```
adlbuilder/
├── app/                  # Código principal
│   ├── api/              # Endpoints de la API
│   ├── core/             # Configuración y utilidades core
│   ├── db/               # Base de datos y migraciones
│   ├── models/           # Modelos de SQLAlchemy
│   ├── schemas/          # Esquemas de Pydantic
│   ├── services/         # Servicios de negocio
│   ├── utils/            # Utilidades
│   ├── templates/        # Plantillas Jinja2
│   └── static/           # Archivos estáticos
├── migrations/           # Migraciones de Alembic
├── schema.yaml           # Esquema de validación
└── requirements.txt      # Dependencias de Python
```

## Licencia

CC by-sa 4.0
