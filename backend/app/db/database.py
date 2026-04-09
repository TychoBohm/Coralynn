# database connectie - SQLite voor Cloudflare D1
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

# laad env variabelen
backend_dir = Path(__file__).resolve().parent.parent.parent
env_path = backend_dir / '.env'
load_dotenv(env_path)

# D1 Database - SQLite
DATABASE_PATH = backend_dir / 'coralynn.db'
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# Create engine with SQLite-specific settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    # geeft database sessie, sluit automatisch af
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
