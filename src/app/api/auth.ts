import axios from "axios";
import { handleApiError } from "./common";
import IResponse from "../interface/IResponse";
import { log } from "console";
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post<IResponse>(`${API_URL}/auth/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'signIn');
    }
};

const signInWithAdmin = async (email: string, password: string) => {
    try {
        const response = await axios.post<IResponse>(`${API_URL}/admin/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'signInWithAdmin');
    }
};
const signUp = async (email: string, password: string, confirmPassword: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            confirmPassword,
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, "signUp");
    }
}
export { signIn, signUp, signInWithAdmin };