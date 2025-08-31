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



@router.get("/tests/me")
def get_my_tests(current_user: models.User = Depends(auth_utils.get_current_user),
                 db: Session = Depends(get_db)):
    tests = db.query(models.Test).filter(models.Test.user_id == current_user.id).all()
    return tests

@router.post("/tests/start/{test_id}")
def start_test(test_id: int, current_user: models.User = Depends(auth_utils.get_current_user),
               db: Session = Depends(get_db)):
    return tests.start_user_test(current_user.id, test_id, db)


@router.post("/tests/finish/{test_id}")
def finish_test(test_id: int,
                current_user: models.User = Depends(auth_utils.get_current_user),
                db: Session = Depends(get_db)):
    return tests.finish_user_test(current_user.id, test_id, db)

@router.post("/tests/create")
def create_test(name: str,
                question_ids: list[int],
                duration: int,
                current_user: models.User = Depends(auth_utils.get_current_user),
                db: Session = Depends(get_db)):
    return tests.create_test(current_user.id, name, question_ids, duration, db)


@router.post("/users/me/update_score")
def update_score(current_user: models.User = Depends(auth_utils.get_current_user),
                 db: Session = Depends(get_db)):
    tests.update_user_score(current_user.id, db)
    return {"status": "User score updated successfully"}


