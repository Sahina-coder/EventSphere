from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceResponse
from app.auth_utils import get_current_user, require_role
from typing import List

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.post("/", response_model=ResourceResponse)
def create_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    new_resource = Resource(**resource.dict())
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return new_resource

@router.get("/", response_model=List[ResourceResponse])
def get_resources(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(Resource).offset(skip).limit(limit).all()

@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(
    resource_id: int,
    updated: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    for key, value in updated.dict().items():
        setattr(resource, key, value)
    db.commit()
    db.refresh(resource)
    return resource

@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(resource)
    db.commit()
    return {"message": "Resource deleted successfully"}