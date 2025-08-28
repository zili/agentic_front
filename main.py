from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime, timedelta
import uuid
from contextlib import contextmanager
import bcrypt
import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI(title="ECCBC Stock Management API", version="1.0.0")

# CORS middleware pour permettre les appels depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration de la base de données
DATABASE_CONFIG = {
    "host": "localhost",
    "database": "coca_db",
    "user": "postgres",  # ou ton user dans pgAdmin
    "password": "1234",      # vide si pas de mot de passe
    "port": 5432
}

# Modèles Pydantic
class ProductBase(BaseModel):
    code: str
    name: str
    name_fr: Optional[str] = None
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    category_id: int
    unit_type: str
    unit_size: Optional[str] = None
    units_per_case: int = 24
    price: float
    is_active: bool = True

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

class ProductWithStock(Product):
    stock_quantity: int
    reserved_quantity: int
    available_quantity: int

class StockUpdate(BaseModel):
    quantity: int
    notes: Optional[str] = None

class OrderItem(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_phone: str
    customer_name: Optional[str] = None
    language: str = "fr"
    items: List[OrderItem]
    notes: Optional[str] = None

class Order(BaseModel):
    id: int
    order_number: str
    customer_phone: str
    customer_name: Optional[str]
    status: str
    total_amount: float
    language: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

class StockCheck(BaseModel):
    product_id: int
    available: bool
    quantity: int
    product_name: str
    product_name_local: Optional[str] = None

# Gestionnaire de connexion à la base
@contextmanager
def get_db_connection():
    conn = None
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        yield conn
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

# Endpoints pour les produits
@app.get("/api/products", response_model=List[ProductWithStock])
async def get_products(active_only: bool = True):
    """Récupérer tous les produits avec leur stock"""
    query = """
        SELECT p.*, s.quantity as stock_quantity, 
               COALESCE(s.reserved_quantity, 0) as reserved_quantity,
               (s.quantity - COALESCE(s.reserved_quantity, 0)) as available_quantity
        FROM products p
        LEFT JOIN stock s ON p.id = s.product_id
    """
    if active_only:
        query += " WHERE p.is_active = true"
    query += " ORDER BY p.name"
    
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query)
        products = cursor.fetchall()
        return products

@app.get("/api/products/{product_id}", response_model=ProductWithStock)
async def get_product(product_id: int):
    """Récupérer un produit spécifique avec son stock"""
    query = """
        SELECT p.*, s.quantity as stock_quantity, 
               COALESCE(s.reserved_quantity, 0) as reserved_quantity,
               (s.quantity - COALESCE(s.reserved_quantity, 0)) as available_quantity
        FROM products p
        LEFT JOIN stock s ON p.id = s.product_id
        WHERE p.id = %s
    """
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query, (product_id,))
        product = cursor.fetchone()
        if not product:
            raise HTTPException(status_code=404, detail="Produit non trouvé")
        return product

@app.get("/api/products/search/{search_term}")
async def search_products(search_term: str, language: str = "fr"):
    """Rechercher des produits par nom (multilingue)"""
    search_pattern = f"%{search_term.lower()}%"
    
    query = """
        SELECT p.*, s.quantity as stock_quantity,
               COALESCE(s.reserved_quantity, 0) as reserved_quantity,
               (s.quantity - COALESCE(s.reserved_quantity, 0)) as available_quantity
        FROM products p
        LEFT JOIN stock s ON p.id = s.product_id
        WHERE p.is_active = true AND (
            LOWER(p.name) LIKE %s OR
            LOWER(p.name_fr) LIKE %s OR
            LOWER(p.name_ar) LIKE %s OR
            LOWER(p.name_en) LIKE %s OR
            LOWER(p.code) LIKE %s
        )
        ORDER BY p.name
    """
    
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query, (search_pattern,) * 5)
        products = cursor.fetchall()
        return products

# Endpoints pour la vérification de stock
@app.get("/api/stock/check/{product_id}", response_model=StockCheck)
async def check_stock(product_id: int, language: str = "fr"):
    """Vérifier la disponibilité d'un produit"""
    query = """
        SELECT p.id, p.name, p.name_fr, p.name_ar, p.name_en,
               s.quantity, COALESCE(s.reserved_quantity, 0) as reserved_quantity
        FROM products p
        LEFT JOIN stock s ON p.id = s.product_id
        WHERE p.id = %s AND p.is_active = true
    """
    
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query, (product_id,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Produit non trouvé")
        
        available_qty = result['quantity'] - result['reserved_quantity']
        
        # Sélectionner le nom selon la langue
        name_field = f"name_{language}" if language != "fr" else "name"
        local_name = result.get(name_field) or result['name']
        
        return StockCheck(
            product_id=result['id'],
            available=available_qty > 0,
            quantity=available_qty,
            product_name=result['name'],
            product_name_local=local_name
        )

@app.put("/api/stock/{product_id}")
async def update_stock(product_id: int, stock_update: StockUpdate):
    """Mettre à jour le stock d'un produit"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Vérifier si le produit existe
        cursor.execute("SELECT id FROM products WHERE id = %s", (product_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Produit non trouvé")
        
        # Mettre à jour le stock
        cursor.execute("""
            INSERT INTO stock (product_id, quantity) 
            VALUES (%s, %s)
            ON CONFLICT (product_id) 
            DO UPDATE SET quantity = %s, last_updated = CURRENT_TIMESTAMP
        """, (product_id, stock_update.quantity, stock_update.quantity))
        
        # Enregistrer le mouvement de stock
        cursor.execute("""
            INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, notes)
            VALUES (%s, 'adjustment', %s, 'manual', %s)
        """, (product_id, stock_update.quantity, stock_update.notes))
        
        conn.commit()
        return {"message": "Stock mis à jour avec succès"}

# Endpoints pour les commandes
@app.post("/api/orders", response_model=dict)
async def create_order(order: OrderCreate):
    """Créer une nouvelle commande"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Générer un numéro de commande unique
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Vérifier la disponibilité des produits
        for item in order.items:
            cursor.execute("""
                SELECT s.quantity - COALESCE(s.reserved_quantity, 0) as available
                FROM stock s WHERE s.product_id = %s
            """, (item.product_id,))
            result = cursor.fetchone()
            if not result or result[0] < item.quantity:
                cursor.execute("SELECT name FROM products WHERE id = %s", (item.product_id,))
                product_name = cursor.fetchone()[0]
                raise HTTPException(
                    status_code=400, 
                    detail=f"Stock insuffisant pour {product_name}. Disponible: {result[0] if result else 0}"
                )
        
        # Calculer le total
        total_amount = 0
        for item in order.items:
            cursor.execute("SELECT price FROM products WHERE id = %s", (item.product_id,))
            price = cursor.fetchone()[0]
            total_amount += price * item.quantity
        
        # Créer la commande
        cursor.execute("""
            INSERT INTO orders (order_number, customer_phone, customer_name, language, total_amount, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (order_number, order.customer_phone, order.customer_name, order.language, total_amount, order.notes))
        
        order_id = cursor.fetchone()[0]
        
        # Ajouter les items de commande et réserver le stock
        for item in order.items:
            cursor.execute("SELECT price FROM products WHERE id = %s", (item.product_id,))
            unit_price = cursor.fetchone()[0]
            total_price = unit_price * item.quantity
            
            cursor.execute("""
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
                VALUES (%s, %s, %s, %s, %s)
            """, (order_id, item.product_id, item.quantity, unit_price, total_price))
            
            # Réserver le stock
            cursor.execute("""
                UPDATE stock SET reserved_quantity = COALESCE(reserved_quantity, 0) + %s
                WHERE product_id = %s
            """, (item.quantity, item.product_id))
            
            # Enregistrer le mouvement de stock
            cursor.execute("""
                INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, notes)
                VALUES (%s, 'out', %s, 'order', %s, 'Réservation pour commande')
            """, (item.product_id, -item.quantity, order_id))
        
        conn.commit()
        
        return {
            "order_id": order_id,
            "order_number": order_number,
            "total_amount": total_amount,
            "status": "pending",
            "message": "Commande créée avec succès"
        }

@app.get("/api/orders/all", response_model=List[dict])
async def get_all_orders(limit: int = 50):
    """Récupérer toutes les commandes"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            # D'abord récupérer les commandes de base - version simple
            cursor.execute("""
                SELECT * FROM orders 
                ORDER BY created_at DESC 
                LIMIT %s
            """, (limit,))
            
            orders = cursor.fetchall()
            
            # Pour chaque commande, récupérer ses items
            for order in orders:
                cursor.execute("""
                    SELECT oi.*, p.name as product_name
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = %s
                """, (order['id'],))
                
                items = cursor.fetchall()
                order['items'] = list(items) if items else []
            
            return list(orders)
            
    except Exception as e:
        print(f"Erreur lors de la récupération des commandes: {e}")
        return []

@app.get("/api/orders/{customer_phone}")
async def get_customer_orders(customer_phone: str, limit: int = 10):
    """Récupérer l'historique des commandes d'un client"""
    query = """
        SELECT o.*, 
               array_agg(
                   json_build_object(
                       'product_name', p.name,
                       'quantity', oi.quantity,
                       'unit_price', oi.unit_price,
                       'total_price', oi.total_price
                   )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.customer_phone = %s
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT %s
    """
    
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query, (customer_phone, limit))
        orders = cursor.fetchall()
        return orders

# Endpoint de santé
@app.get("/api/health")
async def health_check():
    """Vérifier l'état de l'API et de la base de données"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
        return {"status": "healthy", "timestamp": datetime.now()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de base de données: {str(e)}")

# Configuration JWT
SECRET_KEY = "eccbc-secret-key-2024-super-secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

security = HTTPBearer()

# Modèles d'authentification
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

# Service d'authentification
class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def create_access_token(data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return None
            return payload
        except jwt.PyJWTError:
            return None
    
    @staticmethod
    def authenticate_user(username: str, password: str):
        with get_db_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(
                "SELECT * FROM users WHERE username = %s",
                (username,)
            )
            user = cursor.fetchone()
            
            if not user:
                return None
            
            if not user['is_active']:
                return None
            
            if not AuthService.verify_password(password, user['password_hash']):
                return None
            
            return user

# Routes d'authentification
@app.post("/api/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Authentifier un utilisateur et retourner un token JWT"""
    user = AuthService.authenticate_user(user_credentials.username, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = AuthService.create_access_token(
        data={"sub": user['username'], "role": user['role']}
    )
    
    return Token(
        access_token=access_token,
        user={
            "id": user['id'],
            "username": user['username'],
            "role": user['role'],
            "is_active": user['is_active'],
            "created_at": user['created_at'],
            "updated_at": user['updated_at']
        }
    )

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Récupérer les informations de l'utilisateur actuel"""
    payload = AuthService.verify_token(credentials.credentials)
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
    
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            "SELECT * FROM users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur non trouvé",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return UserResponse(**user)

@app.post("/api/auth/verify")
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Vérifier si un token JWT est valide"""
    payload = AuthService.verify_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    return {"valid": True, "username": payload.get("sub")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
# Configuration JWT
SECRET_KEY = "eccbc-secret-key-2024-super-secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

security = HTTPBearer()

# Modèles d'authentification
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

# Service d'authentification
class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def create_access_token(data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return None
            return payload
        except jwt.PyJWTError:
            return None
    
    @staticmethod
    def authenticate_user(username: str, password: str):
        with get_db_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(
                "SELECT * FROM users WHERE username = %s",
                (username,)
            )
            user = cursor.fetchone()
            
            if not user:
                return None
            
            if not user['is_active']:
                return None
            
            if not AuthService.verify_password(password, user['password_hash']):
                return None
            
            return user

# Routes d'authentification
@app.post("/api/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Authentifier un utilisateur et retourner un token JWT"""
    user = AuthService.authenticate_user(user_credentials.username, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = AuthService.create_access_token(
        data={"sub": user['username'], "role": user['role']}
    )
    
    return Token(
        access_token=access_token,
        user={
            "id": user['id'],
            "username": user['username'],
            "role": user['role'],
            "is_active": user['is_active'],
            "created_at": user['created_at'],
            "updated_at": user['updated_at']
        }
    )

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Récupérer les informations de l'utilisateur actuel"""
    payload = AuthService.verify_token(credentials.credentials)
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
    
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            "SELECT * FROM users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur non trouvé",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return UserResponse(**user)

@app.post("/api/auth/verify")
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Vérifier si un token JWT est valide"""
    payload = AuthService.verify_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    return {"valid": True, "username": payload.get("sub")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)