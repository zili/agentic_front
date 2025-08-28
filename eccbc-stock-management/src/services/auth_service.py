from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..models.auth import UserLogin, UserResponse, Token
from ..database import get_db

# Configuration JWT
SECRET_KEY = "eccbc-secret-key-2024-super-secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

security = HTTPBearer()

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Vérifier le mot de passe avec bcrypt"""
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hasher le mot de passe avec bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        """Créer un token JWT"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Vérifier et décoder un token JWT"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return None
            return payload
        except jwt.PyJWTError:
            return None
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[UserResponse]:
        """Authentifier un utilisateur"""
        # Récupérer l'utilisateur depuis la base de données
        query = text("SELECT id, username, password_hash, role, is_active, created_at, updated_at FROM users WHERE username = :username")
        result = db.execute(query, {"username": username}).fetchone()
        
        if not result:
            return None
        
        user_data = {
            "id": result[0],
            "username": result[1],
            "password_hash": result[2],
            "role": result[3],
            "is_active": result[4],
            "created_at": result[5],
            "updated_at": result[6]
        }
        
        # Vérifier si l'utilisateur est actif
        if not user_data["is_active"]:
            return None
        
        # Vérifier le mot de passe
        if not AuthService.verify_password(password, user_data["password_hash"]):
            return None
        
        return UserResponse(**user_data)
    
    @staticmethod
    def login(db: Session, user_credentials: UserLogin) -> Token:
        """Connecter un utilisateur et retourner un token"""
        user = AuthService.authenticate_user(db, user_credentials.username, user_credentials.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Nom d'utilisateur ou mot de passe incorrect",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Créer le token d'accès
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = AuthService.create_access_token(
            data={"sub": user.username, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        return Token(access_token=access_token, user=user)
    
    @staticmethod
    def get_current_user(db: Session, token: str) -> UserResponse:
        """Récupérer l'utilisateur actuel à partir du token"""
        payload = AuthService.verify_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Récupérer l'utilisateur depuis la base de données
        query = text("SELECT id, username, password_hash, role, is_active, created_at, updated_at FROM users WHERE username = :username")
        result = db.execute(query, {"username": username}).fetchone()
        
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur non trouvé",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_data = {
            "id": result[0],
            "username": result[1],
            "password_hash": result[2],
            "role": result[3],
            "is_active": result[4],
            "created_at": result[5],
            "updated_at": result[6]
        }
        
        if not user_data["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur inactif",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return UserResponse(**user_data)
from typing import Optional
import bcrypt
import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..models.auth import UserLogin, UserResponse, Token
from ..database import get_db

# Configuration JWT
SECRET_KEY = "eccbc-secret-key-2024-super-secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

security = HTTPBearer()

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Vérifier le mot de passe avec bcrypt"""
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hasher le mot de passe avec bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        """Créer un token JWT"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Vérifier et décoder un token JWT"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return None
            return payload
        except jwt.PyJWTError:
            return None
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[UserResponse]:
        """Authentifier un utilisateur"""
        # Récupérer l'utilisateur depuis la base de données
        query = text("SELECT id, username, password_hash, role, is_active, created_at, updated_at FROM users WHERE username = :username")
        result = db.execute(query, {"username": username}).fetchone()
        
        if not result:
            return None
        
        user_data = {
            "id": result[0],
            "username": result[1],
            "password_hash": result[2],
            "role": result[3],
            "is_active": result[4],
            "created_at": result[5],
            "updated_at": result[6]
        }
        
        # Vérifier si l'utilisateur est actif
        if not user_data["is_active"]:
            return None
        
        # Vérifier le mot de passe
        if not AuthService.verify_password(password, user_data["password_hash"]):
            return None
        
        return UserResponse(**user_data)
    
    @staticmethod
    def login(db: Session, user_credentials: UserLogin) -> Token:
        """Connecter un utilisateur et retourner un token"""
        user = AuthService.authenticate_user(db, user_credentials.username, user_credentials.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Nom d'utilisateur ou mot de passe incorrect",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Créer le token d'accès
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = AuthService.create_access_token(
            data={"sub": user.username, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        return Token(access_token=access_token, user=user)
    
    @staticmethod
    def get_current_user(db: Session, token: str) -> UserResponse:
        """Récupérer l'utilisateur actuel à partir du token"""
        payload = AuthService.verify_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Récupérer l'utilisateur depuis la base de données
        query = text("SELECT id, username, password_hash, role, is_active, created_at, updated_at FROM users WHERE username = :username")
        result = db.execute(query, {"username": username}).fetchone()
        
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur non trouvé",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_data = {
            "id": result[0],
            "username": result[1],
            "password_hash": result[2],
            "role": result[3],
            "is_active": result[4],
            "created_at": result[5],
            "updated_at": result[6]
        }
        
        if not user_data["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur inactif",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return UserResponse(**user_data)
