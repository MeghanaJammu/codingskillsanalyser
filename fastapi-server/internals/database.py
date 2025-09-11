import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()



# 1. Load DB URL from environment variable
SQLALCHEMY_DATABASE_URL = os.getenv("DB_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DB_URL environment variable is not set")


# 2. Create engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)


# 3. Declare base
Base = declarative_base()

# 4. Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)
