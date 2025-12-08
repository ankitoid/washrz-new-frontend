import axios from "axios";
import constant from "./constant";
const { baseUrl, Authkey, washrzserver } = constant;
// axios.defaults.withCredentials = true;

export const instance = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Authkey}`,
  },
});

export default axios.create({
  baseURL: `${washrzserver}/api/v1`,
    headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const axiosPrivate = axios.create({
  baseURL: `${washrzserver}/api/v1`,
  headers: { "Content-Type": "application/json" },
});
