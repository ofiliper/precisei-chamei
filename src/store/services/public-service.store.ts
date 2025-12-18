import { create } from 'zustand'

// --- Interfaces Auxiliares ---

export interface IServiceCategory {
    id: string;
    name: string;
}

export interface ISocialMedia {
    x?: string;
    facebook?: string;
    instagram?: string;
    [key: string]: string | undefined;
}

export interface IServiceContent {
    content: string;
    social_media: ISocialMedia;
}

export interface IServiceAddress {
    id?: string;
    street: string;
    cep: string;
    neighborhood: string;
    number: string; // String é mais seguro para endereço (ex: "S/N", "10A")
    city: string;
    state: string;
    latitude?: string | null;
    longitude?: string | null;
}

// --- Interface Principal do Store ---

interface IServiceData {
    fetching: boolean;
    id: string;
    id_workspace: string;
    id_category: string;
    name: string;
    logo_image: string | null;
    cover_image: string | null;

    // Objeto aninhado conforme API
    content: IServiceContent;

    // Array de strings conforme API
    gallery: string[];

    // Objeto aninhado conforme API (Normalizei para minúsculo 'address')
    address: IServiceAddress;

    // Objeto aninhado conforme API (Normalizei para minúsculo 'category')
    category: IServiceCategory | null;

    createdAt?: string;
    updatedAt?: string;
}

// --- Estado Inicial ---

const stateDefault: IServiceData = {
    fetching: true,
    id: '',
    id_workspace: '',
    id_category: '',
    name: '',
    logo_image: null,
    cover_image: null,
    content: {
        content: "",
        social_media: {
            x: "",
            facebook: "",
            instagram: ""
        }
    },
    gallery: [],
    address: {
        street: '',
        cep: '',
        neighborhood: '',
        number: '',
        city: '',
        state: '',
        latitude: null,
        longitude: null
    },
    category: null
}

// --- Definição do Store ---

type Store = {
    data: IServiceData
    errors: Partial<{ [field in keyof IServiceData]: string }>

    // Actions
    fnOnChange: (field: keyof IServiceData, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IServiceData) => void

    // Opcional: Action para popular tudo de uma vez quando a API retornar
    fnSetData: (data: Partial<IServiceData>) => void
}

export const publicServiceStore = create<Store>((set) => ({
    data: { ...stateDefault },
    errors: {},

    fnOnChange: (field, value) => {
        set((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [field]: value
            }
        }))
    },

    fnReset: () => {
        set((prevState) => ({
            ...prevState,
            data: { ...stateDefault }
        }))
    },

    fnParcialReset: (field) => {
        set((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [field]: stateDefault[field]
            }
        }))
    },

    // Útil para preencher o store assim que o fetch da API termina
    fnSetData: (apiData) => {
        set((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                ...apiData,
                fetching: false // Garante que o loading pare
            }
        }))
    }
}))