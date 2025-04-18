import sqlite3
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime

# Database path
DB_PATH = Path(__file__).parent.parent.parent / "history.db"

def init_history_db():
    """Initialize the history database"""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        action TEXT NOT NULL,
        user TEXT,
        content TEXT
    )
    ''')
    
    # Create index for faster searches
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_filename ON history(filename)")
    conn.commit()
    conn.close()

# Initialize database
init_history_db()

def record_history(filename: str, action: str, content: Optional[str] = None, user: Optional[str] = None):
    """Record an action in the history database"""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    timestamp = datetime.now().isoformat()
    
    cursor.execute(
        "INSERT INTO history (filename, timestamp, action, user, content) VALUES (?, ?, ?, ?, ?)",
        (filename, timestamp, action, user, content)
    )
    
    conn.commit()
    conn.close()

def get_history_list(filename: Optional[str] = None, action: Optional[str] = None, 
                  user: Optional[str] = None, limit: int = 20, offset: int = 0):
    """Get history of file operations"""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Build the query based on filters
    query = "SELECT id, filename, timestamp, action, user FROM history"
    params = []
    where_clauses = []
    
    if filename:
        where_clauses.append("filename = ?")
        params.append(filename)
    
    if action:
        where_clauses.append("action = ?")
        params.append(action)
    
    if user:
        where_clauses.append("user = ?")
        params.append(user)
    
    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)
    
    # Count total results
    count_query = f"SELECT COUNT(*) FROM ({query})"
    cursor.execute(count_query, params)
    total = cursor.fetchone()[0]
    
    # Add order and pagination
    query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    cursor.execute(query, params)
    entries = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "entries": entries,
        "total": total,
        "limit": limit,
        "offset": offset
    }

def get_history_detail(history_id: int):
    """Get detailed history entry including content"""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id, filename, timestamp, action, user, content FROM history WHERE id = ?",
        (history_id,)
    )
    
    entry = cursor.fetchone()
    conn.close()
    
    if not entry:
        return None
    
    return dict(entry)
