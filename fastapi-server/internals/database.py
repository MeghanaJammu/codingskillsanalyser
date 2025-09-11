import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()
print("ENV DB_URL:", os.getenv("DB_URL"))


# 1. Load DB URL from environment variable (fallback to SQLite for local dev)
SQLALCHEMY_DATABASE_URL = os.getenv("DB_URL", "sqlite:///./app.db")
print("Connected to DB:", SQLALCHEMY_DATABASE_URL)


# 2. Create engine
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. Declare base
Base = declarative_base()

# 4. Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
