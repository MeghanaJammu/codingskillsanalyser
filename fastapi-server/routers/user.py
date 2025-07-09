from fastapi import APIRouter,Depends
from ..internals import database, schemas
from sqlalchemy.orm import Session
from ..apirepository import user


router = APIRouter(tags=['Users'])
#tag is name in the swagger docs UI
#we can use prefix="/blog" in the bracket which allows us to remove /blog in all the below route sto make code cleaner


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post('/user', response_model=schemas.User)
def create_user(request: schemas.User, db: Session=Depends(get_db)):
    return user.create_user(request, db)


@router.get('/user/{id}', response_model=schemas.User)
def get_user(id: int, db: Session=Depends(get_db)):
    return user.get_user(id, db)