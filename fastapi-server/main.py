from fastapi import FastAPI
from .internals import models, database
from .routers import user, auth



app = FastAPI()

#creating database
#whenever we run server we migrate all models to tables
models.Base.metadata.create_all(database.engine)

#now to include routers
app.include_router(user.router)
app.include_router(auth.router)
