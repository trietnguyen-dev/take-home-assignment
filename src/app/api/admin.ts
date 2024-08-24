import axios from 'axios';
import { handleApiError } from './common';

const API_URL = "http://localhost:5000/api";

const getOffers = async (): Promise<IResponseOffer> => {
    try {
        console.log('token:', localStorage.getItem('authToken'));
        const response = await axios.get(`${API_URL}/admin/offers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error, "getOffers");
    }
};
const deleteOffer = async (id: string): Promise<IResponseOffer> => {
    try {
        console.log('token:', localStorage.getItem('authToken'));
        console.log('id:', id);
        const response = await axios.delete(`${API_URL}/admin/deleteOffers/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error, "deleteOffer");
    }
};
const addOffer = async (data: IOffer): Promise<IResponseOffer> => {
    try {
        const response = await axios.post(`${API_URL}/admin/addOffers`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error, "addOffer");
    }
}
const updateOffer = async (id: string, data: IOffer): Promise<IResponseOffer> => {
    try {
        const response = await axios.put(`${API_URL}/admin/updateOffers/${id}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error, "updateOffer");
    }
}
export { getOffers, deleteOffer, addOffer, updateOffer };


