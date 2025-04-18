from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class YAMLContent(BaseModel):
    content: str

class YAMLFile(BaseModel):
    filename: str
    content: str

class HistoryEntry(BaseModel):
    id: int
    filename: str
    timestamp: str
    action: str
    user: Optional[str] = None
    content: Optional[str] = None

class HistoryList(BaseModel):
    entries: List[HistoryEntry]
    total: int
    limit: int
    offset: int
