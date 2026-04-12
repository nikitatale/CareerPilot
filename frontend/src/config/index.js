import axios from "axios";


export const BASE_URL = process.env.NODE_ENV === 'production'
  ? "https://careerpilot-p9bi.onrender.com"
  : "http://localhost:8080";

export const clientServer = axios.create({
  baseURL: BASE_URL
});