from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth

from .firebase import get_db

security = HTTPBearer()


def current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    # Authentication uses the same Firebase app as Firestore; initialise it first.
    get_db()
    try:
        token = auth.verify_id_token(credentials.credentials)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired Firebase token") from exc

    snapshot = get_db().collection("users").document(token["uid"]).get()
    profile = snapshot.to_dict() if snapshot.exists else {}
    return {
        "uid": token["uid"],
        "email": token.get("email", ""),
        "name": token.get("name", ""),
        "role": profile.get("role", "member"),
        **profile,
    }


def admin_user(user: dict = Depends(current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Librarian access is required")
    return user
