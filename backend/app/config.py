import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

SERVICE_ACCOUNT = os.getenv("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")
SERVICE_ACCOUNT_PATH = Path(SERVICE_ACCOUNT)
if not SERVICE_ACCOUNT_PATH.is_absolute():
    SERVICE_ACCOUNT_PATH = BASE_DIR / SERVICE_ACCOUNT_PATH

ALLOWED_ORIGINS = [item.strip() for item in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if item.strip()]
LOAN_DURATION_DAYS = int(os.getenv("LOAN_DURATION_DAYS", "14"))
DEFAULT_BORROW_LIMIT = int(os.getenv("DEFAULT_BORROW_LIMIT", "5"))

# Development bootstrap account. Change these values before publishing the app.
DEFAULT_ADMIN_EMAIL = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@auralib.lk")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123")
DEFAULT_ADMIN_NAME = os.getenv("DEFAULT_ADMIN_NAME", "AuraLib Administrator")
