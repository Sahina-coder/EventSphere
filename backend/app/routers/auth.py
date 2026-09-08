from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.auth_utils import hash_password, verify_password, create_access_token, decode_access_token
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])

VALID_ROLES = ["Organizer", "Attendee", "Vendor"]

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if user.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Role must be one of {VALID_ROLES}")

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "role": new_user.role})
    return Token(access_token=token, token_type="bearer", user=new_user)

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(access_token=token, token_type="bearer", user=user)

@router.get("/me", response_model=UserResponse)
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user