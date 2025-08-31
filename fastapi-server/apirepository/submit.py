import os
import httpx
from fastapi import HTTPException
from ..internals import models
from sqlalchemy.orm import Session
import json
import traceback

PISTON_URL = "https://emkc.org/api/v2/piston/execute"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # points to fastapi-server/
TESTCASE_DIR = os.path.join(BASE_DIR, "testcases")

async def evaluate_submit(req, question):
    try:
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        

        hidden_cases = (
            json.loads(question.hidden_cases)
            if isinstance(question.hidden_cases, str)
            else question.hidden_cases or []
        )
        results = []

        async with httpx.AsyncClient() as client:
            for case in hidden_cases:
                print("case:", case)
                input_path = os.path.normpath(os.path.join(TESTCASE_DIR, case["file"]))
                print("input_path:", input_path)
                expected_output = case["output"].strip()

                try:
                    # read testcase input from file
                    with open(input_path, "r") as f:
                        test_input = f.read().strip()
                except FileNotFoundError:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Test input file not found: {input_path}"
                    )

                payload = {
                    "language": req.language,
                    "version": req.version, 
                    "files": [{"name": "main.cpp", "content": req.sourceCode}],
                    "stdin": test_input,
                }


                response = await client.post(PISTON_URL, json=payload)
                if response.status_code != 200:
                    raise HTTPException(status_code=500, detail="Piston API error")
                

                data = response.json()
                actual_output = data["run"]["output"].strip()

                passed = actual_output.strip().split() == expected_output.strip().split()
                results.append({
                    "input_file": input_path,
                    "expected": expected_output,
                    "actual": actual_output,
                    "passed": passed
                })

        all_passed = all(r["passed"] for r in results)

        return {
            "qid": req.qid,
            "all_passed": all_passed,
            "results": results
        }

    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        print("Unexpected error in evaluate_submit:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


def create_submission(user_id: int, question_id: int, code: str, language: str, test_id: int | None, status: str, execution_time: int, memory_used: int, db: Session):
    submission = models.Submission(
        user_id=user_id,
        question_id=question_id,
        test_id=test_id,
        code=code,
        language=language,
        status=status,
        execution_time=execution_time,
        memory_used=memory_used
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission




