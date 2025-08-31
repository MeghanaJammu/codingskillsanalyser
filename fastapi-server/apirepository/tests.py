from internals import models
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime

def create_test(user_id: int, name: str, question_ids: list[int], duration: int, db: Session):
    new_test = models.Test(user_id=user_id, name=name, duration_minutes=duration)
    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    for qid in question_ids:
        db.add(models.TestQuestion(test_id=new_test.id, question_id=qid))

    db.commit()
    db.refresh(new_test)
    return new_test


def get_user_tests(user_id: int, db: Session):
    return db.query(models.Test).filter(models.Test.user_id == user_id).all()


def update_user_score(user_id: int, db: Session):
    submissions = db.query(models.Submission).filter(models.Submission.user_id==user_id).all()
    total_tests = len({s.test_id for s in submissions if s.test_id})  # exclude practice mode
    scores = [s.status == "Accepted" for s in submissions]  # basic scoring: 1 for Accepted
    best_score = max(scores, default=0)
    avg_score = sum(scores)/len(scores) if scores else 0

    user = db.query(models.User).filter(models.User.id==user_id).first()
    user.total_tests_attempted = total_tests
    user.best_score = best_score
    user.average_score = avg_score
    db.commit()

def start_user_test(user_id: int, test_id: int, db: Session):
    test = db.query(models.Test).filter(models.Test.id==test_id, models.Test.user_id==user_id).first()
    if not test or test.started_at:
        raise HTTPException(status_code=400, detail="Test already started or not found")
    
    test.started_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    return test

def finish_user_test(user_id: int, test_id: int, db: Session):
    test = db.query(models.Test).filter(models.Test.id==test_id, models.Test.user_id==user_id).first()
    if not test or not test.started_at:
        raise HTTPException(status_code=400, detail="Test not started")
    
    test.ended_at = datetime.utcnow()
    test.time_spent_minutes = (test.ended_at - test.started_at).total_seconds() / 60
    db.commit()
    db.refresh(test)
    return test
