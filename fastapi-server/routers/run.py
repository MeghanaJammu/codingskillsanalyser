from fastapi import APIRouter
from internals import schemas
from apirepository import run



router = APIRouter()


@router.post("/evaluate")
async def evaluate_code(request: schemas.EvalRequest):
    return await run.evaluate_run(request)