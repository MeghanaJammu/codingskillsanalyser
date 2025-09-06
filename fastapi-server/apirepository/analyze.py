from ..modelutils import analysis
from ..internals import schemas




async def analyze_codes(request: schemas.CodeSubmissionRequest):
    results = {}
    for submission in request.submissions:
        analysis_result = analysis.hybrid_analysis(submission.code)
        results[submission.question_id] = schemas.AnalysisResult(
            title=submission.title,
            code=submission.code,
            tc_final=analysis_result["tc_final"],
            sc_gemini=analysis_result["sc_gemini"],
            suggestion=analysis_result["suggestion"]
        )
    return schemas.AnalysisResponse(results=results)