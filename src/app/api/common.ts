import axios from 'axios';

export const handleApiError = (error: any, functionName: string) => {
    let errorMessage = 'An unknown error occurred';

    if (axios.isAxiosError(error)) {
        console.log(`${functionName} Axios error:`, error.response?.data || error.message);

        if (error.response?.status === 404) {
            errorMessage = 'Endpoint not found: Please check the API URL and endpoint.';
        } else if (error.response?.status === 500) {
            errorMessage = 'Server error: Something went wrong on the server.';
        } else if (error.response?.data?.msg) {
            errorMessage = error.response.data.msg;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else {
            errorMessage = error.message || 'An error occurred during the API request.';
        }

    } else {
        console.log(`${functionName} unknown error:`, error);
        errorMessage = error instanceof Error ? error.message : errorMessage;
    }
    console.log(`${functionName} error message:`, errorMessage);
    return { err: "error", msg: errorMessage };
};
