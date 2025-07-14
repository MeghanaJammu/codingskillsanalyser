import instance from "./app";

export const fetchFilteredQuestions = async (
  selectedTopics,
  difficultyCounts
) => {
  try {
    const params = new URLSearchParams();

    selectedTopics.forEach((topic) => {
      params.append("topics", topic);
    });

    Object.entries(difficultyCounts).forEach(([difficulty, count]) => {
      if (count > 0) {
        params.append(`${difficulty}_count`, count);
      }
    });

    const response = await instance.get(`/get-questions?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch filtered questions:", error);
    throw error;
  }
};
