from functools import lru_cache

import firebase_admin
from firebase_admin import auth, credentials, firestore

from .config import DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_NAME, DEFAULT_BORROW_LIMIT, SERVICE_ACCOUNT_PATH


@lru_cache
def get_db():
    """Initialise Firebase only once for the FastAPI process."""
    if not SERVICE_ACCOUNT_PATH.exists():
        raise RuntimeError(
            "Firebase service account file is missing. Copy backend/.env.example to "
            "backend/.env and set FIREBASE_SERVICE_ACCOUNT."
        )
    if not firebase_admin._apps:
        firebase_admin.initialize_app(credentials.Certificate(str(SERVICE_ACCOUNT_PATH)))
    return firestore.client()


def ensure_default_admin() -> None:
    """Create the prototype administrator once, then preserve any later changes."""
    db = get_db()
    try:
        account = auth.get_user_by_email(DEFAULT_ADMIN_EMAIL)
    except auth.UserNotFoundError:
        # Password is deliberately only used when the account is first created.
        from .config import DEFAULT_ADMIN_PASSWORD
        account = auth.create_user(email=DEFAULT_ADMIN_EMAIL, password=DEFAULT_ADMIN_PASSWORD, display_name=DEFAULT_ADMIN_NAME)

    db.collection("users").document(account.uid).set({
        "name": DEFAULT_ADMIN_NAME,
        "email": DEFAULT_ADMIN_EMAIL,
        "role": "admin",
        "status": "Active",
        "maxBorrowLimit": DEFAULT_BORROW_LIMIT,
        "membershipId": "AL-ADMIN-01",
    }, merge=True)
