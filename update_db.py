from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db.session import engine

# Función para actualizar la base de datos
def update_database():
    try:
        # Añadir columnas role y organization a la tabla user
        with engine.connect() as connection:
            # Verificar si la columna role ya existe
            result = connection.execute(text("PRAGMA table_info(user)"))
            columns = [row[1] for row in result.fetchall()]
            
            # Añadir columna role si no existe
            if 'role' not in columns:
                connection.execute(text("ALTER TABLE user ADD COLUMN role TEXT"))
                print("Columna 'role' añadida correctamente")
            else:
                print("La columna 'role' ya existe")
            
            # Añadir columna organization si no existe
            if 'organization' not in columns:
                connection.execute(text("ALTER TABLE user ADD COLUMN organization TEXT"))
                print("Columna 'organization' añadida correctamente")
            else:
                print("La columna 'organization' ya existe")
                
            print("Base de datos actualizada correctamente")
    except Exception as e:
        print(f"Error al actualizar la base de datos: {e}")

if __name__ == "__main__":
    update_database()
