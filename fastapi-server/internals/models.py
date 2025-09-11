from internals.database import Base
from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.dialects.postgresql import JSONB


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)



class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)
    topics = Column(JSONB)
    input_format = Column(Text)
    output_format = Column(Text)
    examples = Column(JSONB)
    hidden_cases = Column(JSONB)
    constraints = Column(Text)


