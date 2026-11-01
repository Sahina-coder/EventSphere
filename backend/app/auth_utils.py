from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "eventsphere-dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# ───────────────────────────────────────────────
#  NEW: FastAPI dependencies for route protection
# ───────────────────────────────────────────────

def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Extracts and validates the JWT from the Authorization header.
    Returns the decoded payload dict: {"sub": "user_id", "role": "Organizer", ...}
    Use this as a dependency on any route that needs a logged-in user.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return payload  # {"sub": "42", "role": "Organizer", "exp": ...}


def require_role(required_role: str):
    """
    Returns a dependency that checks the logged-in user has the required role.
    Usage: current_user = Depends(require_role("Organizer"))
    """
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") != required_role:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required role: {required_role}"
            )
        return current_user
    return role_checker