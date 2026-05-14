import { get, put } from "./api";

export const getMe = () => get("/users/me");
export const updateMe = (payload) => put("/users/me", payload);
