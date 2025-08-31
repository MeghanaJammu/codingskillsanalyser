import os
import httpx
import json
import traceback
from fastapi import HTTPException

PISTON_URL = "https://emkc.org/api/v2/piston/execute"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # points to fastapi-server/
TESTCASE_DIR = os.path.join(BASE_DIR, "testcases")


def extract_output(run_data: dict) -> str:
    stdout = (run_data.get("stdout") or "").strip()
    stderr = (run_data.get("stderr") or "").strip()
    signal = run_data.get("signal")

    if signal == "SIGKILL":
        return "Time Limit Exceeded"
    elif signal:
        return f"Process killed by signal: {signal}"
    elif stderr:
        return stderr
    else:
        return stdout


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

                response = await client.post(PISTON_URL, json=payload, timeout=30.0)
                print(response)
                if response.status_code != 200:
                    raise HTTPException(status_code=500, detail="Piston API error")

                data = response.json()
                run_data = data.get("run", {})
                actual_output = extract_output(run_data)

                # Compare outputs in a whitespace-agnostic way
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
        raise
    except Exception as e:
        print("Unexpected error in evaluate_submit:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
