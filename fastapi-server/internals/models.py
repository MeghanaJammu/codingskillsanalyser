from .database import Base
from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship

#here is where we define all our tables
#commonly we use ORM object relational mapping
#in this ORM we have tools to convert a class to represent a db table
#so its like we mapp an object with database tables

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)



class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    difficulty = Column(String)
    topics = Column(JSON)
    input_format = Column(Text)
    output_format = Column(Text)
    examples = Column(JSON)
    hidden_cases = Column(JSON)
    constraints = Column(Text)