import sqlite3
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.models.user import User, UserCreate, VALID_ROLES
from app.auth.security import get_password_hash

# Database path
USER_DB_PATH = Path(__file__).parent.parent.parent / "users.db"

def init_user_db():
    """Initialize the user database"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        role TEXT NOT NULL,
        organization TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    ''')
    
    # Create user_files table for tracking file ownership
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, filename)
    )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_user_db()

def get_user(email: str) -> Optional[User]:
    """Get a user by email"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user_row = cursor.fetchone()
    
    if user_row:
        user_dict = dict(user_row)
        # Convert timestamps to datetime objects
        user_dict["created_at"] = datetime.fromisoformat(user_dict["created_at"])
        user_dict["updated_at"] = datetime.fromisoformat(user_dict["updated_at"])
        # Convert is_active to boolean
        user_dict["is_active"] = bool(user_dict["is_active"])
        # Ensure hashed_password is included
        user = User(**user_dict)
        return user
    
    conn.close()
    return None

def get_user_by_id(user_id: int) -> Optional[User]:
    """Get a user by ID"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user_row = cursor.fetchone()
    
    if user_row:
        user_dict = dict(user_row)
        # Convert timestamps to datetime objects
        user_dict["created_at"] = datetime.fromisoformat(user_dict["created_at"])
        user_dict["updated_at"] = datetime.fromisoformat(user_dict["updated_at"])
        # Convert is_active to boolean
        user_dict["is_active"] = bool(user_dict["is_active"])
        # Ensure hashed_password is included
        user = User(**user_dict)
        return user
    
    conn.close()
    return None

def create_user(user: UserCreate) -> User:
    """Create a new user"""
    # Check if user already exists
    if get_user(user.email):
        raise ValueError("Email already registered")
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Current timestamp
    now = datetime.now().isoformat()
    
    conn = sqlite3.connect(str(USER_DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Insert the user
    cursor.execute(
        "INSERT INTO users (email, hashed_password, role, organization, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user.email, hashed_password, user.role, user.organization, True, now, now)
    )
    
    # Get the user ID
    user_id = cursor.lastrowid
    
    conn.commit()
    conn.close()
    
    # Return the created user
    return User(
        id=user_id,
        email=user.email,
        role=user.role,
        organization=user.organization,
        is_active=True,
        hashed_password=hashed_password,
        created_at=datetime.fromisoformat(now),
        updated_at=datetime.fromisoformat(now)
    )

def update_user(user_id: int, user_data: Dict[str, Any]) -> Optional[User]:
    """Update a user"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get the current user data
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user_row = cursor.fetchone()
    
    if not user_row:
        conn.close()
        return None
    
    # Update the user data
    update_fields = []
    params = []
    
    if "role" in user_data:
        # Validate role
        if user_data["role"] not in VALID_ROLES:
            conn.close()
            raise ValueError(f"Role must be one of: {', '.join(VALID_ROLES)}")
        update_fields.append("role = ?")
        params.append(user_data["role"])
    
    if "organization" in user_data:
        update_fields.append("organization = ?")
        params.append(user_data["organization"])
    
    if "is_active" in user_data:
        update_fields.append("is_active = ?")
        params.append(user_data["is_active"])
    
    if "email" in user_data:
        # Check if email already exists for another user
        cursor.execute("SELECT id FROM users WHERE email = ? AND id != ?", (user_data["email"], user_id))
        if cursor.fetchone():
            conn.close()
            raise ValueError("Email already registered")
        update_fields.append("email = ?")
        params.append(user_data["email"])
    
    if "password" in user_data:
        update_fields.append("hashed_password = ?")
        params.append(get_password_hash(user_data["password"]))
    
    if not update_fields:
        conn.close()
        return User(**dict(user_row))
    
    # Add updated_at timestamp
    update_fields.append("updated_at = ?")
    params.append(datetime.now().isoformat())
    
    # Add user_id to params
    params.append(user_id)
    
    # Execute the update
    cursor.execute(
        f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?",
        params
    )
    
    conn.commit()
    
    # Get the updated user
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    updated_user = cursor.fetchone()
    conn.close()
    
    if updated_user:
        user_dict = dict(updated_user)
        # Convert timestamps to datetime objects
        user_dict["created_at"] = datetime.fromisoformat(user_dict["created_at"])
        user_dict["updated_at"] = datetime.fromisoformat(user_dict["updated_at"])
        # Convert is_active to boolean
        user_dict["is_active"] = bool(user_dict["is_active"])
        # Ensure hashed_password is included
        return User(**user_dict)
    
    return None

def delete_user(user_id: int) -> bool:
    """Delete a user"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    cursor = conn.cursor()
    
    # Delete the user
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    
    # Check if a row was deleted
    deleted = cursor.rowcount > 0
    
    # Delete user's file associations
    if deleted:
        cursor.execute("DELETE FROM user_files WHERE user_id = ?", (user_id,))
    
    conn.commit()
    conn.close()
    
    return deleted

def list_users(skip: int = 0, limit: int = 100) -> List[User]:
    """List all users"""
    conn = sqlite3.connect(str(USER_DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT * FROM users ORDER BY email LIMIT ? OFFSET ?", 
        (limit, skip)
    )
    
    users = []
    for row in cursor.fetchall():
        user_dict = dict(row)
        # Convert timestamps to datetime objects
        user_dict["created_at"] = datetime.fromisoformat(user_dict["created_at"])
        user_dict["updated_at"] = datetime.fromisoformat(user_dict["updated_at"])
        # Convert is_active to boolean
        user_dict["is_active"] = bool(user_dict["is_active"])
        # Ensure hashed_password is included
        users.append(User(**user_dict))
    
    conn.close()
    return users
