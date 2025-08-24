from fastapi import FastAPI
from .internals import models, database
from .routers import user, auth, questions, run, submit
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#creating database
#whenever we run server we migrate all models to tables
models.Base.metadata.create_all(database.engine)

#now to include routers
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(run.router)
app.include_router(submit.router)
