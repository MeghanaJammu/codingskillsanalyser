from fastapi import HTTPException
import httpx

PISTON_URL = "https://emkc.org/api/v2/piston/execute"


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


async def evaluate_run(request):
    results = []

    async with httpx.AsyncClient() as client:
        for idx, tc in enumerate(request.examples):
            try:
                resp = await client.post(
                    PISTON_URL,
                    json={
                        "language": request.language,
                        "version": request.version,
                        "files": [{"name": "main.cpp", "content": request.sourceCode}],
                        "stdin": tc.formatted_input,
                    },
                    timeout=30.0,
                )
                print(resp)

                if resp.status_code != 200:
                    raise HTTPException(status_code=500, detail="Piston API failed")

                data = resp.json()
                run_data = data.get("run", {})
                actual_output = extract_output(run_data)
                expected_output = tc.output.strip()

                results.append({
                    "testcase": idx + 1,
                    "input": tc.formatted_input,
                    "expected": expected_output,
                    "actual": actual_output,
                    "passed": actual_output.strip() == expected_output
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
