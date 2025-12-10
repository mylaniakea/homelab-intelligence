from pydantic import BaseModel
from typing import Dict, Any, Optional

class SettingsBase(BaseModel):
    providers: Dict[str, Dict[str, Any]] = {} # Initialize as empty dict
    active_model: Optional[str] = None # Make active_model optional
    primary_provider: Optional[str] = None # Make primary_provider optional
    fallback_provider: Optional[str] = None # Make fallback_provider optional
    system_prompt: Optional[str] = "You are a helpful Homelab Assistant. You have access to server stats and documentation."
    
    cron_24hr_report: Optional[str] = "0 2 * * *"
    cron_7day_report: Optional[str] = "0 3 * * 1"
    cron_monthly_report: Optional[str] = "0 4 1 * *"

    polling_interval: Optional[int] = 30 # Dashboard polling interval in seconds


class SettingsCreate(SettingsBase):
    pass

class SettingsUpdate(SettingsBase):
    pass

class Settings(SettingsBase):
    id: int

    class Config:
        from_attributes = True
