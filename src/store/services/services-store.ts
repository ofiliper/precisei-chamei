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
    name: string;
    image: string | null;       // Pode vir string vazia ou null
    cover_image: string | null; // Pode vir string vazia ou null
    content: {
        content: any,
        address: any,
        images: any,
        social_media: any
    };
    // Category: IServiceCategory; // Relacionamento
}

const stateDefault: IProps = {
    fetching: true,
    id: '',
    id_workspace: '',
    id_category: '',
    name: '',
    image: '',
    cover_image: '',
    content: {
        content: "",
        images: {},
        address: {},
        social_media: {}
    },
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