import google.generativeai as genai
import re


api_key = "AIzaSyCcpz9BkXxSSPImU69VSpkjspaWY4eCKWM"

genai.configure(api_key=api_key)

gemini_model = genai.GenerativeModel("gemini-2.5-pro")



def analyze_with_gemini(code_snippet):
    prompt = f"""
Analyze this code and return three things:

1. Time Complexity (TC) in Big-O notation.
2. Space Complexity (SC) in Big-O notation.
3. A suggestion to improve the code and include the language used by user and also explain the method used by user as the solution (if any).Also if the code is wrong fro that task as you expect, then tell the user why is it wrong and what to be done to make it correct and explain well but dont explain time and space complexities.

Format EXACTLY like this:
TC: <time complexity>
SC: <space complexity>
Suggestion: <short suggestion>

{code_snippet}
"""
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()

        # Extract TC, SC, Suggestion
        tc_match = re.search(r"TC:\s*(.*)", text)
        sc_match = re.search(r"SC:\s*(.*)", text)
        sg_match = re.search(r"Suggestion:\s*(.*)", text)

        result = {
            "tc": tc_match.group(1) if tc_match else "Unknown",
            "sc": sc_match.group(1) if sc_match else "Unknown",
            "suggestion": sg_match.group(1) if sg_match else "No suggestions"
        }

    except Exception as e:
        print(e)
        result = {"tc": "Unknown", "sc": "Unknown", "suggestion": "Analysis failed"}
    return result
