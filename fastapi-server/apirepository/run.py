from fastapi import HTTPException
import httpx

PISTON_URL = "https://emkc.org/api/v2/piston/execute"

async def evaluate_run(request):
    results = []

    async with httpx.AsyncClient() as client:
        for idx, tc in enumerate(request.examples):
            try:
                # Send to Piston API
                resp = await client.post(
                    PISTON_URL,
                    json={
                        "language": request.language,
                        "version": request.version,
                        "files": [
                            {"name": "main", "content": request.sourceCode}
                        ],
                        "stdin": tc.formatted_input,
                    },
                )

                if resp.status_code != 200:
                    raise HTTPException(status_code=500, detail="Piston API failed")

                data = resp.json()
                actual_output = (data.get("run", {}).get("output") or "").strip()
                expected_output = tc.output.strip()

                results.append({
                    "testcase": idx + 1,
                    "input": tc.formatted_input,
                    "expected": expected_output,
                    "actual": actual_output,
                    "passed": actual_output == expected_output
                })

            except Exception as e:
                results.append({
                    "testcase": idx + 1,
                    "input": tc.formatted_input,
                    "expected": tc.output,
                    "actual": str(e),
                    "passed": False
                })

    return {"results": results}