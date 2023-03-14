
import axios from "axios";

const BASE_URL = "https://data.messari.io/api/v1";

export function sendGetRequest(url: string) {
    return axios.get(`${BASE_URL}${url}`);
}