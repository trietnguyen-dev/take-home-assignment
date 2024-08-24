import axios from 'axios';
import IResponse from '../interface/IResponse';
import { handleApiError } from './common';

const API_URL = "http://localhost:5000/api";

const getOffers = async (): Promise<IResponseOffer> => {
    try {
        console.log('token:', localStorage.getItem('authToken'));
        const response = await axios.get(`${API_URL}/user/getOffers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error, "getOffers");
    }
};

const buyOffer = async (id: string): Promise<void> => {
    try {
        await axios.post(
            `${API_URL}/user/buyOffers`,
            { offerId: id },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );
    } catch (error) {
        handleApiError(error, 'buyOffer');
        throw error;
    }
};

export { buyOffer, getOffers };

