import axios, { AxiosRequestConfig } from 'axios';

export const Get = async (url: string, config?: AxiosRequestConfig<any>) => {
    try {
        const result = await axios.get(url, config);
        return result.data;
    } catch (error: any) {
        let err = error?.response?.data ? error.response.data : error;
        throw err;
    }
};

export const Post = async (url: string, data?: any, config?: AxiosRequestConfig<any>) => {
    try {
        const result = await axios.post(url, data, config);
        return result.data;
    } catch (error: any) {
        let err = error?.response?.data ? error.response.data : error;
        throw err;
    }
};