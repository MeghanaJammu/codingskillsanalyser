from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#CREATING DATABASE CONNECTION

#1. creating engine
SQLALCHEMY_DATABASE_URL = 'sqlite:///./questions.db'

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

#2.declare a mapping
Base = declarative_base()

#3.creating session
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
