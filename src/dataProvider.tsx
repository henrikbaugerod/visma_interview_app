import axios from "axios"
import { toast } from "react-toastify";

const useDataProvider = () => {
    const getList = async (resource: string, params?: any) => {
        const request = {
            method: 'GET',
            url: `${import.meta.env.VITE_API_URL}/${resource}`,
            data: {
                ...params
            }
        }

        const response = await axios({ ...request });

        return {
            data: response.data
        }
    }
    const getOne = async (resource: string, params?: any) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_API_URL}/${resource}/${params.id}`,
            })

            return {
                data: response.data
            }
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Error occurred');
            }
            throw error;
        }
    }
    const create = async (resource: string, params?: any) => {
        try {
            const response = await axios({
                method: 'POST',
                url: `${import.meta.env.VITE_API_URL}/${resource}`,
                data: {
                    ...params
                }
            });

            return {
                data: response.data
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Error occurred');
            }
            throw error;
        }
    }

    return {
        getList,
        getOne,
        create
    }
}

export default useDataProvider;