import psycopg2
from psycopg2 import sql
import bcrypt
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de la base de données
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'eccbc_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': os.getenv('DB_PORT', '5432')
}

def create_users_table():
    """Créer la table users avec un admin par défaut"""
    try:
        # Connexion à la base de données
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Créer la table users
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'admin',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        cursor.execute(create_table_query)
        
        # Créer l'admin par défaut
        admin_username = 'admin'
        admin_password = 'ECCBC2024!'  # Mot de passe par défaut
        admin_role = 'admin'
        
        # Hasher le mot de passe
        password_hash = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())
        
        # Vérifier si l'admin existe déjà
        check_admin_query = "SELECT id FROM users WHERE username = %s"
        cursor.execute(check_admin_query, (admin_username,))
        
        if not cursor.fetchone():
            # Insérer l'admin
            insert_admin_query = """
            INSERT INTO users (username, password_hash, role) 
            VALUES (%s, %s, %s)
            """
            cursor.execute(insert_admin_query, (admin_username, password_hash.decode('utf-8'), admin_role))
            print(f"✅ Admin créé avec succès!")
            print(f"   Username: {admin_username}")
            print(f"   Password: {admin_password}")
            print(f"   Role: {admin_role}")
        else:
            print("ℹ️  L'admin existe déjà dans la base de données")
        
        # Commit des changements
        conn.commit()
        print("✅ Table users créée avec succès!")
        
    except psycopg2.Error as e:
        print(f"❌ Erreur lors de la création de la table users: {e}")
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()
            print("🔌 Connexion à la base de données fermée")

if __name__ == "__main__":
    print("🚀 Création de la table users et de l'admin...")
    create_users_table()
from psycopg2 import sql
import bcrypt
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de la base de données
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'eccbc_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': os.getenv('DB_PORT', '5432')
}

def create_users_table():
    """Créer la table users avec un admin par défaut"""
    try:
        # Connexion à la base de données
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Créer la table users
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'admin',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        cursor.execute(create_table_query)
        
        # Créer l'admin par défaut
        admin_username = 'admin'
        admin_password = 'ECCBC2024!'  # Mot de passe par défaut
        admin_role = 'admin'
        
        # Hasher le mot de passe
        password_hash = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())
        
        # Vérifier si l'admin existe déjà
        check_admin_query = "SELECT id FROM users WHERE username = %s"
        cursor.execute(check_admin_query, (admin_username,))
        
        if not cursor.fetchone():
            # Insérer l'admin
            insert_admin_query = """
            INSERT INTO users (username, password_hash, role) 
            VALUES (%s, %s, %s)
            """
            cursor.execute(insert_admin_query, (admin_username, password_hash.decode('utf-8'), admin_role))
            print(f"✅ Admin créé avec succès!")
            print(f"   Username: {admin_username}")
            print(f"   Password: {admin_password}")
            print(f"   Role: {admin_role}")
        else:
            print("ℹ️  L'admin existe déjà dans la base de données")
        
        # Commit des changements
        conn.commit()
        print("✅ Table users créée avec succès!")
        
    except psycopg2.Error as e:
        print(f"❌ Erreur lors de la création de la table users: {e}")
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()
            print("🔌 Connexion à la base de données fermée")

if __name__ == "__main__":
    print("🚀 Création de la table users et de l'admin...")
    create_users_table()
