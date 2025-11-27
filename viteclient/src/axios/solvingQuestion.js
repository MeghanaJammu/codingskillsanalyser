import instance from "./app";

export const fetchQuestionById = async (id) => {
  const res = await instance.get(`http://localhost:8080/question/${id}`);
  return res.data;
};
