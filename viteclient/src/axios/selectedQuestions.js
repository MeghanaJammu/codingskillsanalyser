import instance from "./app";

export const fetchFilteredQuestions = async (
  selectedTopics = [],
  difficultyCounts = {}
) => {
  try {
    const params = new URLSearchParams();

    // topics (safe default)
    (selectedTopics || []).forEach((topic) => {
      params.append("topics", topic);
    });

    // Explicit mapping -> backend expects easy_count, medium_count, hard_count
    const mapping = {
      easy: "easy_count",
      medium: "medium_count",
      hard: "hard_count",
    };
    Object.entries(difficultyCounts || {}).forEach(([difficulty, count]) => {
      const key = mapping[difficulty] || `${difficulty}_count`;
      if (count > 0) params.append(key, String(count));
    });

    const url = `/get-questions?${params.toString()}`;

    console.log(
      "[fetchFilteredQuestions] axios baseURL:",
      instance?.defaults?.baseURL
    );
    console.log("[fetchFilteredQuestions] Request URL:", url);

    const response = await instance.get(url);

    console.log(
      "[fetchFilteredQuestions] response status:",
      response.status,
      "data length:",
      Array.isArray(response.data) ? response.data.length : typeof response.data
    );
    // For debugging only — you can remove after bugfix
    console.log(
      "[fetchFilteredQuestions] response data (first item):",
      response.data?.[0]
    );

    return response.data;
  } catch (error) {
    // More informative logging
    console.error(
      "[fetchFilteredQuestions] Request failed:",
      error?.response?.status,
      error?.response?.data ?? error.message ?? error
    );
    throw error;
  }
};
