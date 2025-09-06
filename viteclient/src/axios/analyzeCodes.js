import instance from "./app";

export const analyzeUserCodes = async (questions = []) => {
  try {
    const username = localStorage.getItem("username");
    if (!username) throw new Error("No active user found");

    const submissions = [];

    questions.forEach((q) => {
      const langs = ["cpp", "python", "java"];
      let code = null;

      // Pick C++ first if exists
      const cppCode = localStorage.getItem(`${username}_userCode_${q.id}_cpp`);
      if (cppCode && cppCode.trim() !== "") {
        code = cppCode;
      } else {
        // Otherwise pick first non-empty code among other languages
        for (let lang of langs) {
          if (lang === "cpp") continue;
          const tempCode = localStorage.getItem(
            `${username}_userCode_${q.id}_${lang}`
          );
          if (tempCode && tempCode.trim() !== "") {
            code = tempCode;
            break;
          }
        }
      }

      if (code) {
        submissions.push({
          question_id: q.id,
          title: q.title,
          code,
        });
      }
    });

    if (submissions.length === 0) {
      console.warn("[analyzeUserCodes] No user code found to analyze");
      return [];
    }

    console.log(
      `[analyzeUserCodes] Sending ${submissions.length} submissions for analysis`
    );

    const response = await instance.post("/analyze", { submissions });

    console.log(
      "[analyzeUserCodes] response status:",
      response.status,
      "response data:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "[analyzeUserCodes] Request failed:",
      error?.response?.status,
      error?.response?.data ?? error.message ?? error
    );
    throw error;
  }
};
