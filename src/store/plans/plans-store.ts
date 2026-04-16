import { create } from 'zustand'

// --- Interfaces para os itens da lista ---


// --- Estado Inicial ---
interface IPlansData {
    fetching: boolean;
    rows: {
        id: string;
        name: string
        raw: string;
        value: number;
        duration: number;
    }[]
}

const stateDefault: IPlansData = {
    fetching: true,
    rows: []
}

// --- Definição do Store ---

type Store = {
    data: IPlansData
    errors: Partial<{ [field in keyof IPlansData]: string }>

    // Actions
    fnOnChange: (field: keyof IPlansData, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IPlansData) => void

    // Opcional: Action para popular tudo de uma vez quando a API retornar
    fnSetData: (data: Partial<IPlansData>) => void
}

export const plansStore = create<Store>((set) => ({
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