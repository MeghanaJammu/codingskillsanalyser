from fastapi import APIRouter
from apirepository import analyze
from internals import schemas


router = APIRouter()


@router.post("/analyze", response_model=schemas.AnalysisResponse)
async def analyze_user_codes(request: schemas.CodeSubmissionRequest):
    return await analyze.analyze_codes(request)



