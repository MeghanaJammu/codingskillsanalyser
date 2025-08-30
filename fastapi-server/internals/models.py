from .database import Base
from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, DateTime, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    # summary fields
    total_tests_attempted = Column(Integer, default=0)
    best_score = Column(Float, default=0.0)
    average_score = Column(Float, default=0.0)

    # relationships
    tests = relationship("Test", back_populates="user")
    submissions = relationship("Submission", back_populates="user")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)
    topics = Column(JSON)
    input_format = Column(Text)
    output_format = Column(Text)
    examples = Column(JSON)
    hidden_cases = Column(JSON)
    constraints = Column(Text)

    test_questions = relationship("TestQuestion", back_populates="question")
    submissions = relationship("Submission", back_populates="question")


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    duration_minutes = Column(Integer, nullable=False)  # e.g., 60 min

    user = relationship("User", back_populates="tests")
    questions = relationship("TestQuestion", back_populates="test")
    submissions = relationship("Submission", back_populates="test")


class TestQuestion(Base):
    """
    Many-to-many link between Test and Question.
    Stores which questions are part of a test.
    """
    __tablename__ = "test_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    test = relationship("Test", back_populates="questions")
    question = relationship("Question", back_populates="test_questions")


class Submission(Base):
    """
    Stores users attempt of a question (in a test or outside).
    """
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=True)  # null → practice mode
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    status = Column(String)  # e.g., Accepted, Wrong Answer, TLE
    execution_time = Column(Integer)  # ms
    memory_used = Column(Integer)  # KB
    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="submissions")
    test = relationship("Test", back_populates="submissions")
    question = relationship("Question", back_populates="submissions")
