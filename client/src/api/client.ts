import axios from "axios";

export const api = axios.create({
    // use Vite dev proxy in local dev; in Docker, Vite server proxies to server container
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
});

