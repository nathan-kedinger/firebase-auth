import axios, {AxiosError, type AxiosRequestConfig, type AxiosResponse} from 'axios'
import type {ErrorLd, IJsonLdResponseCollection} from "./IJsonLdResponse";
// Créer l'instance Axios avec la base URL
const token = localStorage.getItem('token');

const config = {
    baseURL: import.meta.env.VITE_VUE_APP_API_URL,
    headers: {
        Authorization: `Bearer ${token}`,
    },
}

let axiosInstance = axios.create(config)
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const ApiResource = {

    // -------------- GET ONE ITEM --------------
    getItem: async (
        url: string,
        config?: AxiosRequestConfig<any>,
        errorHandled = true
    ): Promise<any | null> => {
        return await handleResponseItem(axiosInstance.get(url, config), url, errorHandled)
    },
    // ---------- GET COLLECTION ITEMS ----------
    getCollection: async (
        url: string,
        config?: AxiosRequestConfig<any>,
        useJsonLd: boolean = false,
        errorHandled = true
    ): Promise<any> => {
        return await handleResponseCollection(
            axiosInstance.get(url, config),
            useJsonLd,
            url,
            errorHandled
        )
    },
    // --------------- POST ITEM ---------------
    post: async (
        url: string,
        data?: any | undefined,
        config?: AxiosRequestConfig<any>,
        errorHandled = true
    ): Promise<any> => {
        return await handleResponseItem(axiosInstance.post(url, data, config), url, errorHandled)
    },
    // ---------------- PUT ITEM ----------------
    put: async (
        url: string,
        data?: any | undefined,
        config?: AxiosRequestConfig<any>,
        errorHandled = true
    ): Promise<any | null> => {
        return await handleResponseItem(axiosInstance.put(url, data, config), url, errorHandled)
    },
    // --------------- PATCH ITEM ---------------
    patch: async (
        url: string,
        data?: any | undefined,
        config?: AxiosRequestConfig<any>,
        errorHandled = true
    ): Promise<any> => {
        return await handleResponseItem(axiosInstance.patch(url, data, config), url, errorHandled)
    },
    // --------------- DELETE ITEM ---------------
    delete: async (
        url: string,
        config?: AxiosRequestConfig<any>,
        errorHandled = true
    ): Promise<any | null> => {
        return await handleResponseItem(axiosInstance.delete(url, config), url, errorHandled)
    },
    // --------------- MASSIVE POST ITEM ---------------
    massivePost: async (
        url: string,
        data?: any | undefined,
        config?: AxiosRequestConfig<any>
    ): Promise<any> => {
        return await handleResponseMassive(axiosInstance.post(url, data, config), url)
    },
    // --------------- MASSIVE PUT ITEM ---------------
    massivePut: async (
        url: string,
        data?: any | undefined,
        config?: AxiosRequestConfig<any>
    ): Promise<any> => {
        return await handleResponseMassive(axiosInstance.put(url, data, config), url)
    }
}


// -------------- HANDLE AXIOS RESPONSE ITEM --------------
const handleResponseItem = async (
    promise: Promise<AxiosResponse<any>>,
    calledEndpoint: string = '',
    errorHandled: boolean
): Promise<any | null> => {
    try {
        const response = await promise
        return response.data ?? null
    } catch (error) {
        if (errorHandled) {
            handleError(<AxiosError<ErrorLd>>error, calledEndpoint)
        }
        throw AxiosError.ERR_BAD_RESPONSE
    }
}

// -------------- HANDLE AXIOS RESPONSE ITEM --------------
const handleResponseMassive = async (
    promise: Promise<AxiosResponse<any>>,
    calledEndpoint: string = ''
): Promise<any | null> => {
    try {
        const response = await promise
        return response.data ?? null
    } catch (error) {
        const errorMessage = handleMassiveError(<AxiosError<ErrorLd>>error, calledEndpoint)
        throw new Error(errorMessage)
    }
}

// ----------- HANDLE AXIOS RESPONSE COLLECTION -----------
const handleResponseCollection = async (
    promise: Promise<AxiosResponse<IJsonLdResponseCollection<any> | any>>,
    useJsonLd: boolean,
    calledEndpoint: string = '',
    errorHandled: boolean
): Promise<any> => {
    try {
        const response = await promise;
        if (useJsonLd) return response.data;
        return response.data['member'];
    } catch (error) {
        if (errorHandled) {
            handleError(<AxiosError<ErrorLd>>error, calledEndpoint);
        }
        throw AxiosError.ERR_BAD_RESPONSE;
    }
};

const handleError = (error: AxiosError<ErrorLd>, calledEndpoint: string) => {
    if (error.response) {
        const {status} = error.response;

        if (status === 401) {
            window.location.href = '/register';
            return;
        }
        displayApiErrorNotif(error.response, calledEndpoint);
    }
};

const handleMassiveError = (error: AxiosError<ErrorLd>, calledEndpoint: string) => {
    let errorMessage = 'Unknown error happened'
    if (error.response) {
        const {status} = error.response
        errorMessage = error.response.data['detail'] || error.response.statusText || 'Unspecified error'
    }
    return errorMessage
}

const displayApiErrorNotif = (errorResponse: AxiosResponse<ErrorLd>, calledEndpoint: string) => {
    const title = `Erreur API ${calledEndpoint} (HTTP ${errorResponse.status})`
    const message = errorResponse.data['hydra:title']
        ? errorResponse.data['hydra:title']
        : errorResponse.data['detail']
            ? errorResponse.data['detail']
            : errorResponse.statusText
    const description = errorResponse.data['hydra:description']
        ? errorResponse.data['hydra:description']
        : ''
}


