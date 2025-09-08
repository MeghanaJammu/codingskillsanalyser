import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", //server, later to be deployed
});

export default instance;
