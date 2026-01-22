import { create } from 'zustand'

// --- Interfaces para os itens da lista ---

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

// Interface que representa UM item dentro do array retornado pela API
export interface IServiceItem {
    id: string;
    id_workspace: string;
    id_category: string;
    name: string;
    logo_image: string | null;
    cover_image: string | null;
    content: IServiceContent;
    gallery: string[];
    createdAt: string;
    updatedAt: string;
    // Nota: O JSON fornecido aqui não trouxe os objetos expandidos
    // 'Category' e 'Address', então removi da tipagem. 
    // Se a API de listagem retornar eles, basta adicionar aqui.
}

// --- Interface do Estado Global da Listagem ---

interface IServicesData {
    fetching: boolean;
    services: IServiceItem[]; // Array contendo a lista
    count?: number; // Opcional: útil se a API retornar total de registros para paginação
    pagination: number
    meta: {
        total_items: number,
        total_pages: number
        page: number
        page_size: number
    }
}

// --- Estado Inicial ---

const stateDefault: IServicesData = {
    fetching: true,
    services: [],
    count: 0,
    pagination: 1,
    meta: {
        total_items: 0,
        total_pages: 0,
        page: 1,
        page_size: 10
    }
}

// --- Definição do Store ---

type Store = {
    data: IServicesData
    errors: Partial<{ [field in keyof IServicesData]: string }>

    // Actions
    fnOnChange: (field: keyof IServicesData, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IServicesData) => void

    // Opcional: Action para popular tudo de uma vez quando a API retornar
    fnSetData: (data: Partial<IServicesData>) => void
}

export const publicServiceListStore = create<Store>((set) => ({
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