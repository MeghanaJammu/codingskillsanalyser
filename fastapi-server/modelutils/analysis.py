from modelutils import predict, gemini

def hybrid_analysis(code_snippet):
    # Step 1: T5 predicts TC
    tc_model = predict.predict_tc(code_snippet)

    # Step 2: Gemini predicts TC & SC + Suggestion
    gemini_output = gemini.analyze_with_gemini(code_snippet)
    tc_gemini = gemini_output["tc"]
    sc_gemini = gemini_output["sc"]
    suggestion = gemini_output["suggestion"]

    # Step 3: Check mismatch
    mismatch_flag = (tc_model != tc_gemini)

    # Step 4: If mismatch, use Gemini's TC
    final_tc = tc_gemini if mismatch_flag else tc_model

    result = {
        "code": code_snippet,
        "tc_final": final_tc,
        "sc_gemini": sc_gemini,
        "suggestion": suggestion
    }
    
    return result
