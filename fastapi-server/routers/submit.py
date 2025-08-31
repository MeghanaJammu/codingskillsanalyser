from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..internals import database, schemas, models, auth_utils
from ..apirepository import questions, submit, tests


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


@router.post("/submissions")
def submit_code(submission_data: dict, current_user: models.User = Depends(auth_utils.get_current_user),
                db: Session = Depends(get_db)):
    return submit.create_submission(
        user_id=current_user.id,
        question_id=submission_data["question_id"],
        code=submission_data["code"],
        language=submission_data["language"],
        test_id=submission_data.get("test_id"),
        status=submission_data["status"],
        execution_time=submission_data.get("execution_time", 0),
        memory_used=submission_data.get("memory_used", 0),
        db=db
    )


