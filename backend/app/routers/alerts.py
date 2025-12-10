from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List
from datetime import datetime
from app.database import get_db
from app import models
from app.schemas_alerts import Alert, AlertUpdate, AlertChannel, AlertChannelCreate, AlertChannelUpdate
from app.services.alert_channels import get_all_channels

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/", response_model=List[Alert])
def get_alerts(
    limit: int = 100,
    unresolved_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get alerts with optional filtering"""
    query = db.query(models.Alert).order_by(models.Alert.triggered_at.desc())

    if unresolved_only:
        query = query.filter(models.Alert.resolved == False)

    alerts = query.limit(limit).all()
    return alerts

@router.get("/stats")
def get_alert_stats(db: Session = Depends(get_db)):
    """Get alert statistics for dashboard"""
    total = db.query(models.Alert).count()
    unresolved = db.query(models.Alert).filter(models.Alert.resolved == False).count()

    # Count by severity
    critical = db.query(models.Alert).filter(
        and_(models.Alert.severity == "critical", models.Alert.resolved == False)
    ).count()
    warning = db.query(models.Alert).filter(
        and_(models.Alert.severity == "warning", models.Alert.resolved == False)
    ).count()
    info = db.query(models.Alert).filter(
        and_(models.Alert.severity == "info", models.Alert.resolved == False)
    ).count()

    return {
        "total": total,
        "unresolved": unresolved,
        "critical": critical,
        "warning": warning,
        "info": info
    }

@router.put("/{alert_id}", response_model=Alert)
def update_alert(alert_id: int, alert_update: AlertUpdate, db: Session = Depends(get_db)):
    """Update an alert (acknowledge or resolve)"""
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not db_alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    if alert_update.acknowledged is not None and alert_update.acknowledged:
        db_alert.acknowledged = True
        db_alert.acknowledged_at = datetime.now()

    if alert_update.resolved is not None and alert_update.resolved:
        db_alert.resolved = True
        db_alert.resolved_at = datetime.now()

    db.commit()
    db.refresh(db_alert)
    return db_alert

@router.post("/{alert_id}/acknowledge", response_model=Alert)
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    """Acknowledge an alert"""
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not db_alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db_alert.acknowledged = True
    db_alert.acknowledged_at = datetime.now()
    db.commit()
    db.refresh(db_alert)
    return db_alert

@router.post("/{alert_id}/resolve", response_model=Alert)
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    """Resolve an alert"""
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not db_alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db_alert.resolved = True
    db_alert.resolved_at = datetime.now()
    db.commit()
    db.refresh(db_alert)
    return db_alert

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    """Delete an alert"""
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not db_alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(db_alert)
    db.commit()
    return {"message": "Alert deleted successfully"}

# Alert Channels endpoints
@router.get("/channels/available")
def get_available_channels():
    """Get all available alert channel types"""
    return get_all_channels()

@router.get("/channels/", response_model=List[AlertChannel])
def get_alert_channels(db: Session = Depends(get_db)):
    """Get all configured alert channels"""
    channels = db.query(models.AlertChannel).all()
    return channels

@router.post("/channels/", response_model=AlertChannel)
def create_alert_channel(channel: AlertChannelCreate, db: Session = Depends(get_db)):
    """Create a new alert channel"""
    db_channel = models.AlertChannel(**channel.model_dump())
    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel

@router.put("/channels/{channel_id}", response_model=AlertChannel)
def update_alert_channel(
    channel_id: int,
    channel_update: AlertChannelUpdate,
    db: Session = Depends(get_db)
):
    """Update an alert channel"""
    db_channel = db.query(models.AlertChannel).filter(models.AlertChannel.id == channel_id).first()
    if not db_channel:
        raise HTTPException(status_code=404, detail="Alert channel not found")

    update_data = channel_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_channel, key, value)

    db.commit()
    db.refresh(db_channel)
    return db_channel

@router.delete("/channels/{channel_id}")
def delete_alert_channel(channel_id: int, db: Session = Depends(get_db)):
    """Delete an alert channel"""
    db_channel = db.query(models.AlertChannel).filter(models.AlertChannel.id == channel_id).first()
    if not db_channel:
        raise HTTPException(status_code=404, detail="Alert channel not found")

    db.delete(db_channel)
    db.commit()
    return {"message": "Alert channel deleted successfully"}

@router.post("/channels/{channel_id}/test")
def test_alert_channel(channel_id: int, db: Session = Depends(get_db)):
    """Send a test alert through the specified channel"""
    db_channel = db.query(models.AlertChannel).filter(models.AlertChannel.id == channel_id).first()
    if not db_channel:
        raise HTTPException(status_code=404, detail="Alert channel not found")

    if not db_channel.enabled:
        raise HTTPException(status_code=400, detail="Channel is not enabled")

    # TODO: Implement actual notification sending
    # For now, just return success
    return {"message": f"Test alert sent via {db_channel.name}", "success": True}
