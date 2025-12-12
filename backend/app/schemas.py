from .schemas_settings import *
from .schemas_knowledge import *
from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, List, Any
from datetime import datetime

class ServerProfileBase(BaseModel):
    name: str = "Unknown Server"
    description: Optional[str] = None
    ip_address: Optional[str] = None
    
    # SSH Config
    ssh_port: int = 22
    ssh_username: Optional[str] = None
    ssh_key_path: Optional[str] = None
    use_local_agent: bool = False
    
    # Data Plugins
    enabled_plugins: List[str] = []
    detected_plugins: Dict[str, bool] = {}

    hardware_info: Dict[str, Any] = {}
    os_info: Dict[str, Any] = {}
    packages: List[Any] = []

class ServerProfileCreate(ServerProfileBase):
    pass

class ServerProfileUpdate(ServerProfileBase):
    name: Optional[str] = None
    
class ServerProfile(ServerProfileBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
