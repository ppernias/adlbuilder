from sqlalchemy import inspect
from app.db.session import engine

# Funciu00f3n para verificar las tablas existentes
def check_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Tablas existentes en la base de datos:")
    for table in tables:
        print(f"- {table}")
        columns = inspector.get_columns(table)
        print(f"  Columnas:")
        for column in columns:
            print(f"    - {column['name']} ({column['type']})")

if __name__ == "__main__":
    check_tables()
