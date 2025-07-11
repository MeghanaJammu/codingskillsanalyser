import instance from "./app";

export const register = async (userData) => {
  const res = await instance.post("/user", userData);
  return res.data;
};
