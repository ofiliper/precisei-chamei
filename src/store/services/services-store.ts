import { create } from 'zustand'

// 1. Interface para a Categoria (que vem aninhada)
export interface IServiceCategory {
    id: string;
    name: string;
}

// 2. Interface para o objeto principal de dados (o conteúdo de "data")
// export interface IServiceItem {
//     id: string;
//     id_workspace: string;
//     id_category: string;
//     name: string;
//     image: string | null;       // Pode vir string vazia ou null
//     cover_image: string | null; // Pode vir string vazia ou null
//     content: string | null;
//     createdAt: string;
//     updatedAt: string;
//     Category: IServiceCategory; // Relacionamento
// }

interface IProps {
    fetching: boolean;
    id: string;
    id_workspace: string;
    id_category: string;
    id_subcategory: string;
    whatsapp: string;
    name: string;
    logo_image: string | null;       // Pode vir string vazia ou null
    cover_image: string | null; // Pode vir string vazia ou null
    content: {
        content: any,
        social_media: any
    };
    address: {
        cep: string
        street: string
        neighborhood: string
        number: number
        city: string
        state: string
    },
    gallery: [],

    // Category: IServiceCategory; // Relacionamento
}

const stateDefault: IProps = {
    fetching: true,
    id: '',
    whatsapp: '',
    id_workspace: '',
    id_category: '',
    id_subcategory: '',
    name: '',
    logo_image: '',
    cover_image: '',
    content: {
        content: "",
        social_media: {}
    },
    address: {
        cep: '',
        street: '',
        neighborhood: '',
        number: 0,
        city: '',
        state: ''
    },
    gallery: []
    // Category: null,
}

type Store = {
    data: IProps
    errors: Partial<{ [field in keyof IProps]: string }>
    fnOnChange: (field: keyof IProps, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IProps) => void
}

export const serviceStore = create<Store>((set, get) => ({
    data: { ...stateDefault },
    errors: {},
    fnOnChange: (field, value) => {
        set((prevState) => (
            {
                ...prevState,
                data: {
                    ...prevState.data,
                    [field]: value
                }
            }))
    },
    fnReset: () => {
        set((prevState) => (
            {
                ...prevState,
                data: { ...stateDefault }
            }))
    },
    fnParcialReset: (field) => {
        set((prevState) => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    [field]: stateDefault[field]
                }
            }
        }
        )
    }
}))