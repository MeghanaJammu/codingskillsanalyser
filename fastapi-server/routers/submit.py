from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..internals import database, schemas
from ..apirepository import questions, submit


router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/submit")
async def submit_code(req: schemas.SubmitRequest, db: Session = Depends(get_db)):
    question = questions.get_one(req.qid, db)
    return await submit.evaluate_submit(req, question)
