from fastapi import APIRouter, UploadFile, Depends, Query, Body
from sqlalchemy.orm import Session
from ..internals import database
from ..apirepository import questions
from typing import List, Optional


router = APIRouter(tags=["Questions"])


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()




@router.post("/upload-questions")
async def upload_questions(file: UploadFile, db: Session = Depends(get_db)):
    return questions.upload(file, db)



@router.get("/get-questions")
async def get_questions(topics: Optional[List[str]] = Query(None),
    easy_count: int = 0,
    medium_count: int = 0,
    hard_count: int = 0,
    db: Session = Depends(get_db)):
    return questions.get(topics,easy_count, medium_count, hard_count, db)



@router.get("/question/{id}")
async def get_question(id: int, db: Session = Depends(get_db)):
    return questions.get_one(id, db)


@router.put("/question/{id}")
async def update_question(id: int, updated_data: dict = Body(...),  db: Session = Depends(get_db)):
    return questions.update_question(id, updated_data, db)