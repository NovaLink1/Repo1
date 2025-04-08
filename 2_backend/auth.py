# auth.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer


# Config
SECRET_KEY = "leadnova-secret"  # ⛔ In Produktion: in .env!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Passwort-Hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dummy-Nutzer
fake_users_db = {
    "tester@leadnova.de": {
        "email": "tester@leadnova.de",
        "hashed_password": pwd_context.hash("17Z7Totuu!!"),
    }
}

# OAuth2-Schema
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Benutzer prüfen
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(email: str, password: str):
    user = fake_users_db.get(email)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user

# Token erstellen
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Aktuellen Benutzer auslesen
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return fake_users_db.get(email)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
