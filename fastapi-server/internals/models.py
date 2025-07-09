from .database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

#here is where we define all our tables
#commonly we use ORM object relational mapping
#in this ORM we have tools to convert a class to represent a db table
#so its like we mapp an object with database tables

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)


#Question model, later