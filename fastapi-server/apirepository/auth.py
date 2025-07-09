from fastapi import status, HTTPException
from ..internals import jwtToken, schemas, models, hashing
from sqlalchemy.orm import Session
from datetime import timedelta



def login(request, db: Session):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid Credentials")
    
    if not hashing.Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect Password")
    
    #if user found with correct password we generate the jwtToken and send in response

    access_token_expires = timedelta(minutes=jwtToken.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwtToken.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")