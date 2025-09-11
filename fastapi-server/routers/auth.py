#login and verifying password

from fastapi import APIRouter,Depends
from typing import Annotated
from internals import database
from sqlalchemy.orm import Session
from apirepository import auth
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(tags=['Auth'])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post('/login')
def login(request:Annotated[OAuth2PasswordRequestForm, Depends()], db: Session=Depends(get_db)):
    return auth.login(request,db)