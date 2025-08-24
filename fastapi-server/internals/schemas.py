from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    username: str
    password: str


class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None


class Example(BaseModel):
    input: str
    formatted_input: str
    output: str
    explanation: str
    image_url: Optional[str]

class HiddenCase(BaseModel):
    file: str
    output: str

class Question(BaseModel):
    title: str
    description: str
    difficulty: str
    topics: List[str]
    input_format: str
    output_format: str
    examples: List[Example]
    hidden_cases: List[HiddenCase]
    constraints: str

class TestCase(BaseModel):
    formatted_input: str
    output: str

class EvalRequest(BaseModel):
    language: str
    version: str
    sourceCode: str
    examples: List[TestCase]


class SubmitRequest(BaseModel):
    language: str
    sourceCode: str
    version: str
    qid: int