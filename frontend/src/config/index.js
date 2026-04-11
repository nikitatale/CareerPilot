import axios from "axios";

//PROD
export const BASE_URL = "https://careerpilot-p9bi.onrender.com"


// DEV
// export const BASE_URL = "http://localhost:8080"


export const clientServer = axios.create({
    baseURL: BASE_URL
})


