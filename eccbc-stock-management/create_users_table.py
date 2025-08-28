import psycopg2
import bcrypt
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de la base de données
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'coca_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', '1234'),
    'port': os.getenv('DB_PORT', '5432')
}

def create_users_table():
    """Créer la table users et insérer un utilisateur admin par défaut"""
    try:
        # Connexion à la base de données
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Créer la table users
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        cursor.execute(create_table_sql)
        print("✅ Table 'users' créée avec succès")
        
        # Vérifier si l'utilisateur admin existe déjà
        cursor.execute("SELECT id FROM users WHERE username = 'admin'")
        admin_exists = cursor.fetchone()
        
        if not admin_exists:
            # Créer le mot de passe hashé
            password = "ECCBC2024!"
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            # Insérer l'utilisateur admin
            insert_admin_sql = """
            INSERT INTO users (username, password_hash, role, is_active)
            VALUES (%s, %s, %s, %s)
            """
            
            cursor.execute(insert_admin_sql, ('admin', password_hash.decode('utf-8'), 'admin', True))
            print("✅ Utilisateur admin créé avec succès")
            print("   Username: admin")
            print("   Password: ECCBC2024!")
        else:
            print("ℹ️  L'utilisateur admin existe déjà")
        
        # Valider les changements
        conn.commit()
        print("✅ Base de données mise à jour avec succès")
        
    except psycopg2.Error as e:
        print(f"❌ Erreur lors de la création de la table users: {e}")
        if conn:
            conn.rollback()
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🚀 Création de la table users et de l'utilisateur admin...")
    create_users_table()
    print("✅ Script terminé")
