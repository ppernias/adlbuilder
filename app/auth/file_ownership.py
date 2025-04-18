import sqlite3
from pathlib import Path
from typing import List
from app.auth.user_db import USER_DB_PATH

def assign_file_to_user(user_id: int, filename: str) -> bool:
    """Assign a YAML file to a user"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT OR REPLACE INTO user_files (user_id, filename) VALUES (?, ?)",
            (user_id, filename)
        )
        conn.commit()
        success = True
    except sqlite3.Error:
        conn.rollback()
        success = False
    
    conn.close()
    return success

def remove_file_from_user(user_id: int, filename: str) -> bool:
    """Remove a YAML file from a user"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    cursor = conn.cursor()
    
    cursor.execute(
        "DELETE FROM user_files WHERE user_id = ? AND filename = ?",
        (user_id, filename)
    )
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def get_user_files(user_id: int) -> List[str]:
    """Get all YAML files owned by a user"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    cursor = conn.cursor()
    
    cursor.execute("SELECT filename FROM user_files WHERE user_id = ?", (user_id,))
    files = [row[0] for row in cursor.fetchall()]
    
    conn.close()
    return files

def get_user_files_by_email(email: str) -> List[str]:
    """Get all YAML files owned by a user identified by email"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT uf.filename 
           FROM user_files uf 
           JOIN users u ON uf.user_id = u.id 
           WHERE u.email = ?""", 
        (email,)
    )
    
    files = [row[0] for row in cursor.fetchall()]
    conn.close()
    return files

def is_file_owned_by_user(user_id: int, filename: str) -> bool:
    """Check if a file is owned by a user"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT 1 FROM user_files WHERE user_id = ? AND filename = ?",
        (user_id, filename)
    )
    
    result = cursor.fetchone() is not None
    conn.close()
    return result
